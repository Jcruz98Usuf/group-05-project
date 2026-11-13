/**
 * Dual-AI provider gateway.
 *
 * Routes every AI request to Google Gemini first. On rate-limit (HTTP 429),
 * quota exhaustion (RESOURCE_EXHAUSTED), token-limit, auth, or timeout errors,
 * it transparently retries with Groq (llama-3.3-70b-versatile) so the chat
 * session and UI state are never interrupted.
 *
 * Keys are read from Vite env vars (VITE_*). When no key is configured the
 * gateway returns null and callers fall back to deterministic behavior.
 */

export type AIProviderName = 'gemini' | 'groq';

export interface AIRequest {
  system?: string;
  prompt: string;
  json?: boolean;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResult {
  text: string;
  provider: AIProviderName;
}

const GEMINI_KEY = (import.meta.env.VITE_GEMINI_API_KEY as string | undefined)?.trim();
const GROQ_KEY = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim();

const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const REQUEST_TIMEOUT_MS = 20000;

export const AI_KEYS = {
  gemini: Boolean(GEMINI_KEY),
  groq: Boolean(GROQ_KEY)
};

export function aiConfigured(): boolean {
  return AI_KEYS.gemini || AI_KEYS.groq;
}

/** Which providers have keys configured (for status indicators / debugging). */
export function providerStatus(): { gemini: boolean; groq: boolean; configured: boolean } {
  return { gemini: AI_KEYS.gemini, groq: AI_KEYS.groq, configured: aiConfigured() };
}

function isRetryable(status: number, message: string): boolean {
  if (status === 429 || status === 408 || status === 503) return true;
  const m = message.toLowerCase();
  return (
    m.includes('resource_exhausted') ||
    m.includes('rate limit') ||
    m.includes('quota') ||
    m.includes('token') ||
    m.includes('timeout') ||
    m.includes('timed out') ||
    m.includes('unavailable') ||
    m.includes('overloaded')
  );
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGemini(req: AIRequest): Promise<string> {
  if (!GEMINI_KEY) throw new Error('Gemini key not configured');

  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: req.prompt }] }],
    generationConfig: {
      temperature: req.temperature ?? 0.2,
      maxOutputTokens: req.maxTokens ?? 2048,
      ...(req.json ? { responseMimeType: 'application/json' } : {})
    }
  };
  if (req.system) {
    body.systemInstruction = { parts: [{ text: req.system }] };
  }

  const res = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response');
  return text;
}

async function callGroq(req: AIRequest): Promise<string> {
  if (!GROQ_KEY) throw new Error('Groq key not configured');

  const messages: { role: string; content: string }[] = [];
  if (req.system) messages.push({ role: 'system', content: req.system });
  messages.push({ role: 'user', content: req.prompt });

  const res = await fetchWithTimeout('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: req.temperature ?? 0.2,
      max_tokens: req.maxTokens ?? 2048,
      ...(req.json ? { response_format: { type: 'json_object' } } : {})
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Groq ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text: string | undefined = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Groq returned an empty response');
  return text;
}

/**
 * Generate text with automatic Gemini → Groq failover.
 * Returns null when no provider is configured or both fail.
 */
export async function generateText(req: AIRequest): Promise<AIResult | null> {
  if (!aiConfigured()) return null;

  if (AI_KEYS.gemini) {
    try {
      const text = await callGemini(req);
      console.info('[aiProvider] Gemini responded');
      return { text, provider: 'gemini' };
    } catch (geminiErr) {
      const message = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
      const statusMatch = message.match(/Gemini (\d{3})/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;
      if (!isRetryable(status, message)) {
        console.warn('[aiProvider] Gemini error (non-retryable):', message);
        // Still attempt Groq if available.
      }
      if (AI_KEYS.groq) {
        console.warn('[aiProvider] Failing over from Gemini to Groq:', message);
        try {
          const text = await callGroq(req);
          console.info('[aiProvider] Groq (failover) responded');
          return { text, provider: 'groq' };
        } catch (groqErr) {
          console.warn('[aiProvider] Groq fallback failed:', groqErr);
          return null;
        }
      }
      console.warn('[aiProvider] Gemini failed and no Groq fallback configured.');
      return null;
    }
  }

  if (AI_KEYS.groq) {
    try {
      const text = await callGroq(req);
      console.info('[aiProvider] Groq responded');
      return { text, provider: 'groq' };
    } catch (groqErr) {
      console.warn('[aiProvider] Groq failed:', groqErr);
      return null;
    }
  }

  return null;
}

/** Generate and parse JSON. Returns null on any failure. */
export async function generateJson<T>(req: AIRequest): Promise<T | null> {
  const result = await generateText({ ...req, json: true });
  if (!result) return null;
  try {
    const cleaned = result.text
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.warn('[aiProvider] Failed to parse JSON response:', e);
    return null;
  }
}