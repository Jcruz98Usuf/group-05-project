import {
  CompanyCapabilityProfile,
  Opportunity,
  RiskItem,
  RiskLevel,
  ScoreBreakdown
} from '../types';

/**
 * Nexas engine — Opportunity-to-Proposal Intelligence.
 *
 * Principles (per Nexas operating rules):
 * - Business value over technical detail.
 * - Never invent capabilities, certifications, staff, technologies, pricing or references.
 * - Missing information is marked explicitly ("Missing Information" / needs_confirmation).
 * - Every recommendation is explained and, where possible, tied to extracted evidence.
 */

export const SCORE_WEIGHTS = {
  businessFit: 0.25,
  capabilityMatch: 0.35,
  deliveryReadiness: 0.2,
  riskImpact: 0.2
} as const;

export const RISK_PENALTY: Record<RiskItem['severity'], number> = {
  Critical: 40,
  High: 25,
  Medium: 10,
  Low: 0
};

export interface ScoreInput {
  businessFit: number;
  capabilityMatch: number;
  deliveryReadiness: number;
  riskImpact: number;
}

export interface ScoreResult {
  opportunity_score: number;
  score_breakdown: ScoreBreakdown;
  recommendation: Recommendation;
  reasoning: string;
}

export type Recommendation = 'PURSUE' | 'INVESTIGATE FURTHER' | 'DO NOT PURSUE';

const clamp = (n: number, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));

/** Weighted opportunity score using the Nexas model: 25 / 35 / 20 / 20. */
export function scoreOpportunity(input: ScoreInput): ScoreResult {
  const breakdown: ScoreBreakdown = {
    businessFit: clamp(input.businessFit),
    capabilityMatch: clamp(input.capabilityMatch),
    deliveryReadiness: clamp(input.deliveryReadiness),
    riskImpact: clamp(input.riskImpact)
  };

  const opportunity_score = clamp(
    breakdown.businessFit * SCORE_WEIGHTS.businessFit +
      breakdown.capabilityMatch * SCORE_WEIGHTS.capabilityMatch +
      breakdown.deliveryReadiness * SCORE_WEIGHTS.deliveryReadiness +
      breakdown.riskImpact * SCORE_WEIGHTS.riskImpact
  );

  const recommendation = recommendationFromScore(opportunity_score);
  const reasoning =
    `Weighted score ${opportunity_score}/100 ` +
    `(Business Fit ${breakdown.businessFit} × 25%, ` +
    `Capability Match ${breakdown.capabilityMatch} × 35%, ` +
    `Delivery Readiness ${breakdown.deliveryReadiness} × 20%, ` +
    `Risk Impact ${breakdown.riskImpact} × 20%).`;

  return { opportunity_score, score_breakdown: breakdown, recommendation, reasoning };
}

export function recommendationFromScore(score: number): Recommendation {
  if (score >= 80) return 'PURSUE';
  if (score >= 60) return 'INVESTIGATE FURTHER';
  return 'DO NOT PURSUE';
}

export const RECOMMENDATION_TO_TYPE = {
  PURSUE: 'pursue',
  'INVESTIGATE FURTHER': 'investigate',
  'DO NOT PURSUE': 'do_not_pursue'
} as const;

/** Highest-severity risk collapses to an overall level. Critical maps to High. */
export function aggregateRiskLevel(risks: RiskItem[]): RiskLevel {
  if (risks.some((r) => r.severity === 'Critical' || r.severity === 'High')) return 'High';
  if (risks.some((r) => r.severity === 'Medium')) return 'Medium';
  return 'Low';
}

/** Average capability match across assessed domains. */
export function averageCapabilityMatch(opportunity: Opportunity): number {
  if (!opportunity.capabilities.length) return 0;
  const total = opportunity.capabilities.reduce((sum, c) => sum + c.matchPercentage, 0);
  return clamp(total / opportunity.capabilities.length);
}

export interface CapabilityMatchResult {
  matched_capabilities: { domain: string; match_percentage: number }[];
  partial_matches: { domain: string; match_percentage: number }[];
  gaps: { domain: string; match_percentage: number }[];
  match_percentage: number;
}

/** Compare requirements to company capabilities using extracted match data. */
export function buildCapabilityMatch(opportunity: Opportunity): CapabilityMatchResult {
  const matched_capabilities: CapabilityMatchResult['matched_capabilities'] = [];
  const partial_matches: CapabilityMatchResult['partial_matches'] = [];
  const gaps: CapabilityMatchResult['gaps'] = [];

  opportunity.capabilities.forEach((c) => {
    const entry = { domain: c.domain, match_percentage: c.matchPercentage };
    if (c.matchPercentage >= 80) matched_capabilities.push(entry);
    else if (c.matchPercentage >= 50) partial_matches.push(entry);
    else gaps.push(entry);
  });

  return {
    matched_capabilities,
    partial_matches,
    gaps,
    match_percentage: averageCapabilityMatch(opportunity)
  };
}

export interface OpportunityAnalysis {
  organization: string;
  industry: string;
  opportunity_type: string;
  opportunity_title: string;
  estimated_budget: string;
  deadline: string;
  requirements: string[];
  deliverables: string[];
  eligibility_requirements: string[];
  identified_risks: string[];
  important_contacts: string[];
  questions: string[];
}

const MISSING = 'Missing Information';

/** Structured, evidence-based opportunity analysis derived from stored data. */
export function buildOpportunityAnalysis(opportunity: Opportunity): OpportunityAnalysis {
  const deliverables = opportunity.proposal?.deliverables
    ? opportunity.proposal.deliverables
        .split('\n')
        .map((l) => l.replace(/^[-•*]\s*/, '').trim())
        .filter(Boolean)
    : [];

  return {
    organization: opportunity.organization || MISSING,
    industry: opportunity.industry || MISSING,
    opportunity_type: opportunity.type || MISSING,
    opportunity_title: opportunity.title || MISSING,
    estimated_budget: opportunity.estimatedBudget || MISSING,
    deadline: opportunity.deadline || MISSING,
    requirements: opportunity.requirements.map((r) => r.title),
    deliverables: deliverables.length ? deliverables : [MISSING],
    eligibility_requirements: opportunity.requirements
      .filter((r) => r.mandatory)
      .map((r) => r.title),
    identified_risks: opportunity.risks.map((r) => `${r.title} (${r.severity})`),
    important_contacts: opportunity.decisionMakers.map((d) => `${d.name} — ${d.role}`),
    questions: opportunity.proposal?.openQuestions
      ? opportunity.proposal.openQuestions
          .split('\n')
          .map((l) => l.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean)
      : [MISSING]
  };
}

/* ------------------------------------------------------------------ */
/* First-time company onboarding (evidence-based, no fabrication)      */
/* ------------------------------------------------------------------ */

export interface OnboardingInput {
  fullName: string;
  email: string;
  companyName: string;
  about?: string;
  website?: string;
  annualRevenue?: string;
  teamSize?: number;
}

interface ServiceDefinition {
  name: string;
  keywords: string[];
  description: string;
}

const SERVICE_CATALOG: ServiceDefinition[] = [
  {
    name: 'Business Intelligence',
    keywords: ['power bi', 'powerbi', 'business intelligence', 'dashboard', 'tableau', 'looker', 'reporting', 'analytics'],
    description: 'Executive dashboards, semantic reporting layers, and telemetry analytics.'
  },
  {
    name: 'Data Engineering',
    keywords: ['data engineering', 'data pipeline', 'etl', 'kafka', 'snowflake', 'databricks', 'lakehouse', 'spark', 'dbt', 'data warehouse'],
    description: 'Stream processing, lakehouse, and ETL data pipelines.'
  },
  {
    name: 'Artificial Intelligence',
    keywords: ['artificial intelligence', ' ai ', 'machine learning', ' ml ', 'llm', 'rag', 'predictive', 'computer vision', 'genai', 'gemini', 'openai'],
    description: 'Applied AI, predictive models, and language-model workflows.'
  },
  {
    name: 'Software Development',
    keywords: ['software development', 'software engineering', 'microservice', 'api', 'web application', 'mobile app', 'full stack', 'full-stack', 'react', 'node', 'python', '.net', 'java'],
    description: 'Custom software, APIs, and application engineering.'
  },
  {
    name: 'Digital Transformation',
    keywords: ['digital transformation', 'modernization', 'modernisation', 'transformation'],
    description: 'Modernization and change programs.'
  },
  {
    name: 'Consulting',
    keywords: ['consulting', 'consultancy', 'advisory', 'strategy'],
    description: 'Advisory and transformation consulting.'
  },
  {
    name: 'Training',
    keywords: ['training', 'enablement', 'upskilling', 'workshop', 'coaching', 'education'],
    description: 'Enablement and training programs.'
  },
  {
    name: 'Cloud Services',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'kubernetes', 'devops', 'migration', 'hosting'],
    description: 'Cloud architecture, migration, and managed services.'
  }
];

const TECH_KEYWORDS: { label: string; keywords: string[] }[] = [
  { label: 'React', keywords: ['react'] },
  { label: 'Node.js', keywords: ['node'] },
  { label: 'Python', keywords: ['python'] },
  { label: 'Apache Kafka', keywords: ['kafka'] },
  { label: 'Snowflake', keywords: ['snowflake'] },
  { label: 'Databricks', keywords: ['databricks'] },
  { label: 'Kubernetes', keywords: ['kubernetes', 'k8s'] },
  { label: 'AWS', keywords: ['aws', 'amazon web services'] },
  { label: 'Azure', keywords: ['azure'] },
  { label: 'Google Cloud', keywords: ['google cloud', 'gcp'] },
  { label: 'Power BI', keywords: ['power bi', 'powerbi'] },
  { label: 'Tableau', keywords: ['tableau'] }
];

const INDUSTRY_KEYWORDS: { label: string; keywords: string[] }[] = [
  { label: 'Healthcare & Life Sciences', keywords: ['health', 'hospital', 'clinical', 'patient', 'fhir', 'hipaa'] },
  { label: 'Financial Services & Fintech', keywords: ['fintech', 'bank', 'banking', 'payment', 'fraud', 'insurance'] },
  { label: 'Public Sector & Transit', keywords: ['transit', 'transport', 'government', 'public sector', 'municipal', 'authority'] },
  { label: 'Energy & Utilities', keywords: ['energy', 'utility', 'utilities', 'grid', 'power'] },
  { label: 'Enterprise SaaS', keywords: ['saas', 'software platform', 'subscription'] }
];

const includesAny = (text: string, keywords: string[]) =>
  keywords.some((k) => text.includes(k));

/**
 * Build a capability profile strictly from supplied evidence.
 * Never fabricates certifications, staff, technologies or revenue — anything
 * not evidenced is listed in `needsConfirmation`.
 */
export function buildCapabilityProfile(input: OnboardingInput): CompanyCapabilityProfile {
  const about = (input.about ?? '').toLowerCase();
  const needsConfirmation: string[] = [];

  const services = SERVICE_CATALOG.filter((s) => includesAny(about, s.keywords)).map((s) => ({
    name: s.name,
    level: 4,
    description: s.description,
    pastProjectsCount: 0
  }));
  if (!services.length) needsConfirmation.push('Core services / capabilities');

  const technologies = TECH_KEYWORDS.filter((t) => includesAny(about, t.keywords)).map((t) => t.label);

  const primaryIndustries = INDUSTRY_KEYWORDS.filter((i) => includesAny(about, i.keywords)).map(
    (i) => i.label
  );

  const certifications: CompanyCapabilityProfile['certifications'] = [];
  needsConfirmation.push('Certifications & accreditations');

  const keyPersonnel: CompanyCapabilityProfile['keyPersonnel'] = [];
  needsConfirmation.push('Key personnel & clearances');

  if (!technologies.length) needsConfirmation.push('Technology stack');
  if (!primaryIndustries.length) needsConfirmation.push('Target industries');
  if (!input.annualRevenue) needsConfirmation.push('Annual revenue');
  if (!input.teamSize) needsConfirmation.push('Team size');

  const summary =
    `${input.companyName} — profile generated from the supplied company description. ` +
    `${services.length} service area(s) and ${primaryIndustries.length} industry focus area(s) identified. ` +
    'Certifications, personnel and commercial figures require confirmation.';

  return {
    companyName: input.companyName,
    tagline: input.about ? input.about.slice(0, 80) : 'Company capability profile',
    annualRevenue: input.annualRevenue || 'Not provided',
    teamSize: input.teamSize || 0,
    primaryIndustries: primaryIndustries.length ? primaryIndustries : ['Not specified'],
    services,
    certifications,
    techStack: technologies.length
      ? [{ category: 'Detected Technologies', technologies }]
      : [],
    keyPersonnel,
    needsConfirmation
  };
}