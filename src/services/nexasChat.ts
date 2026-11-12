import { CompanyCapabilityProfile, CompanyFacts, NexasChatMessage, Opportunity } from '../types';
import { generateJson } from './aiProvider';

export interface NexasChatReply {
  reply: string;
  companyFacts?: CompanyFacts;
  opportunityDraft?: {
    title: string;
    sourceText: string;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCompanyFacts(value: unknown): CompanyFacts | undefined {
  if (!isRecord(value)) return undefined;
  const facts: CompanyFacts = {};
  const stringFields = ['companyName', 'companyWebsite', 'companyDescription', 'industry'] as const;

  for (const field of stringFields) {
    const candidate = value[field];
    if (typeof candidate === 'string' && candidate.trim()) facts[field] = candidate.trim();
  }

  if (typeof value.teamSize === 'number' && Number.isFinite(value.teamSize) && value.teamSize > 0) {
    facts.teamSize = Math.round(value.teamSize);
  }
  if (Array.isArray(value.goals)) {
    const goals = value.goals.filter((goal): goal is string => typeof goal === 'string' && Boolean(goal.trim()));
    if (goals.length) facts.goals = goals.map((goal) => goal.trim());
  }
  if (Array.isArray(value.services)) {
    const services = value.services.filter((service): service is string => typeof service === 'string' && Boolean(service.trim()));
    if (services.length) facts.services = services.map((service) => service.trim());
  }
  if (Array.isArray(value.context)) {
    const context = value.context.filter((item): item is string => typeof item === 'string' && Boolean(item.trim()));
    if (context.length) facts.context = context.map((item) => item.trim());
  }

  return Object.keys(facts).length ? facts : undefined;
}

function parseReply(value: unknown): NexasChatReply | null {
  if (!isRecord(value) || typeof value.reply !== 'string' || !value.reply.trim()) return null;

  let opportunityDraft: NexasChatReply['opportunityDraft'];
  if (isRecord(value.opportunityDraft)) {
    const { title, sourceText } = value.opportunityDraft;
    if (typeof title === 'string' && title.trim() && typeof sourceText === 'string' && sourceText.trim()) {
      opportunityDraft = { title: title.trim(), sourceText: sourceText.trim() };
    }
  }

  return {
    reply: value.reply.trim(),
    companyFacts: parseCompanyFacts(value.companyFacts),
    opportunityDraft
  };
}

export async function generateNexasChatReply(
  messages: NexasChatMessage[],
  profile: CompanyCapabilityProfile,
  opportunity?: Opportunity
): Promise<NexasChatReply | null> {
  const recentMessages = messages
    .slice(-12)
    .map(({ sender, text }) => `${sender === 'user' ? 'User' : 'Nexas'}: ${text.slice(0, 2500)}`)
    .join('\n\n');

  const companyContext = {
    companyName: profile.companyName || undefined,
    description: profile.about || undefined,
    industry: profile.industry || profile.primaryIndustries.join(', ') || undefined,
    teamSize: profile.teamSize || undefined,
    services: profile.services.map((service) => service.name),
    servicesMentionedInChat: profile.learnedServices ?? [],
    goals: profile.goals ?? [],
    learnedContext: profile.aiLearnedContext?.slice(-10) ?? []
  };

  const result = await generateJson<unknown>({
    system:
      'You are Nexas, a practical business assistant. Answer the user’s actual question naturally; do not limit yourself to app navigation. ' +
      'Use the company and opportunity context when relevant. Never invent business facts, prices, dates, capabilities, or credentials; state uncertainty and ask a focused follow-up when needed. ' +
      'Services mentioned in chat are unverified until the user adds them as delivery capabilities; do not present them as proven experience. ' +
      'Extract company facts only when the user explicitly states them, never infer company profile details from a client opportunity. ' +
      'When the conversation clearly describes a distinct potential purchase, hiring need, project, tender, or business lead, return an opportunityDraft with a concise title and sourceText containing only the information shared so far. ' +
      'Do not claim an opportunity has been created. The user must confirm before it is added. Do not return an opportunityDraft for general business questions or hypothetical examples. ' +
      'Return JSON only with this shape: {"reply":"...","companyFacts":{"companyName":"...","companyWebsite":"...","companyDescription":"...","industry":"...","teamSize":0,"goals":["..."],"services":["..."],"context":["..."]},"opportunityDraft":{"title":"...","sourceText":"..."}}. Omit unknown fields.',
    prompt:
      `Company context:\n${JSON.stringify(companyContext)}\n\n` +
      (opportunity
        ? `Current opportunity:\n${JSON.stringify({
            title: opportunity.title,
            organization: opportunity.organization,
            industry: opportunity.industry,
            summary: opportunity.summary,
            budget: opportunity.estimatedBudget,
            deadline: opportunity.deadline,
            recommendation: opportunity.recommendation,
            recommendationReason: opportunity.recommendationReason,
            requirements: opportunity.requirements.map((requirement) => requirement.title),
            risks: opportunity.risks.map((risk) => ({ title: risk.title, severity: risk.severity, mitigation: risk.mitigation }))
          })}\n\n`
        : '') +
      `Conversation:\n${recentMessages}\n\nRespond to the latest user message.`,
    json: true,
    temperature: 0.3,
    maxTokens: 1200
  });

  return parseReply(result);
}
