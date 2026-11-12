import { CompanyCapabilityProfile, CompanyFacts } from '../types';
import { generateJson } from './aiProvider';

/**
 * Passive company memory.
 *
 * On AI chat interactions, extract structured company facts and merge them into
 * the tenant's capability profile. Only empty fields are filled (user-locked
 * edits are never overwritten); learned context is appended to
 * `aiLearnedContext`, and affected field keys are tracked in `autoLearnedFields`
 * so the UI can show an "Auto-learned from chat" badge.
 */

type ProfileField = 'companyName' | 'companyWebsite' | 'about' | 'industry' | 'teamSize' | 'goals';

const EXTRACT_SYSTEM =
  'You extract structured company facts from conversational text. Return STRICT JSON only. ' +
  'Never invent facts. If a field is not stated, omit it.';

const INDUSTRY_MAP: { label: string; keywords: string[] }[] = [
  { label: 'Healthcare & Life Sciences', keywords: ['health', 'hospital', 'clinical', 'patient', 'fhir', 'hipaa'] },
  { label: 'Financial Services & Banking', keywords: ['fintech', 'bank', 'banking', 'payment', 'fraud', 'insurance'] },
  { label: 'Public Sector & Transit', keywords: ['transit', 'transport', 'government', 'public sector', 'municipal', 'authority'] },
  { label: 'Energy & Utilities', keywords: ['energy', 'utility', 'utilities', 'grid', 'power'] },
  { label: 'Technology & SaaS', keywords: ['saas', 'software', 'platform', 'cloud'] },
  { label: 'Manufacturing', keywords: ['manufactur', 'factory', 'industrial'] },
  { label: 'Retail & E-Commerce', keywords: ['retail', 'e-commerce', 'ecommerce', 'store'] }
];

const GOAL_MAP: { label: string; keywords: string[] }[] = [
  { label: 'Qualify leads faster', keywords: ['qualify', 'qualification', 'lead'] },
  { label: 'Reduce wasted bid effort', keywords: ['no-bid', 'no bid', 'wasted', 'bid effort'] },
  { label: 'Improve win rate', keywords: ['win rate', 'win more', 'increase win'] },
  { label: 'Automate proposal drafting', keywords: ['proposal', 'draft', 'automate'] },
  { label: 'Strengthen compliance & risk review', keywords: ['compliance', 'risk', 'audit'] },
  { label: 'Centralize pipeline reporting', keywords: ['pipeline', 'reporting', 'dashboard'] }
];

function heuristicExtract(text: string): CompanyFacts {
  const lower = text.toLowerCase();
  const facts: CompanyFacts = {};

  const nameMatch = text.match(
    /(?:we are|we're|our company is|company is|i work at|i'm from|i am from|this is)\s+([A-Z][\w&.'\- ]{2,60})/
  );
  if (nameMatch) facts.companyName = nameMatch[1].trim();

  const teamMatch = lower.match(/(\d{1,6})\s*(?:people|employees|staff|team members|engineers|consultants|person)/);
  if (teamMatch) facts.teamSize = parseInt(teamMatch[1], 10);

  const industry = INDUSTRY_MAP.find((i) => i.keywords.some((k) => lower.includes(k)));
  if (industry) facts.industry = industry.label;

  const goals = GOAL_MAP.filter((g) => g.keywords.some((k) => lower.includes(k))).map((g) => g.label);
  if (goals.length) facts.goals = goals;

  const descMatch = text.match(/(?:we provide|we offer|we specialize in|we do|our services include)\s+([^.!?]{5,160})/i);
  if (descMatch) facts.companyDescription = descMatch[1].trim();

  if (Object.keys(facts).length > 0) facts.context = [text.trim()];
  return facts;
}

/** Extract facts using the AI gateway, falling back to heuristics offline. */
export async function extractCompanyFacts(text: string): Promise<CompanyFacts> {
  const trimmed = text.trim();
  if (!trimmed) return {};

  const ai = await generateJson<CompanyFacts>({
    system: EXTRACT_SYSTEM,
    prompt:
      'Extract company facts from the text below. Return JSON with any of these keys when present: ' +
      'companyName, companyWebsite, companyDescription, industry, teamSize, goals (array), context (array of short factual snippets).\n\n' +
      `Text:\n"""\n${trimmed.slice(0, 4000)}\n"""`,
    json: true,
    temperature: 0
  });

  if (ai && typeof ai === 'object') {
    return { ...ai, context: ai.context?.length ? ai.context : [trimmed] };
  }
  return heuristicExtract(trimmed);
}

/** Merge learned facts into a profile without overwriting user-locked fields. */
export function mergeLearnedFacts(
  profile: CompanyCapabilityProfile,
  facts: CompanyFacts
): CompanyCapabilityProfile {
  const autoLearned = new Set<string>(profile.autoLearnedFields ?? []);
  const context = [...(profile.aiLearnedContext ?? [])];
  const next: CompanyCapabilityProfile = { ...profile };

  const applyText = (field: ProfileField, value?: string) => {
    if (!value) return;
    const current = (next as unknown as Record<string, unknown>)[field];
    if (!current) {
      (next as unknown as Record<string, unknown>)[field] = value;
      autoLearned.add(field);
    }
  };

  applyText('companyName', facts.companyName);
  applyText('companyWebsite', facts.companyWebsite);
  applyText('about', facts.companyDescription);
  applyText('industry', facts.industry);

  if (facts.teamSize && !next.teamSize) {
    next.teamSize = facts.teamSize;
    autoLearned.add('teamSize');
  }

  if (facts.goals?.length && !(next.goals && next.goals.length)) {
    next.goals = facts.goals;
    autoLearned.add('goals');
  }

  if (facts.services?.length) {
    const learnedServices = new Set(next.learnedServices ?? []);
    facts.services.forEach((service) => learnedServices.add(service));
    next.learnedServices = Array.from(learnedServices).slice(-30);
    autoLearned.add('services');
  }

  if (facts.context?.length) {
    for (const c of facts.context) {
      const t = c.trim();
      if (t && !context.includes(t)) context.push(t);
    }
  }

  next.aiLearnedContext = context.slice(-50);
  next.autoLearnedFields = Array.from(autoLearned);
  return next;
}