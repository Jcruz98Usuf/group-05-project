export type OpportunityStage = 
  | 'new'
  | 'verification'
  | 'discovery'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export type RecommendationType = 'pursue' | 'investigate' | 'do_not_pursue';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type EnterprisePageId = 
  | 'dashboard'
  | 'opportunities'
  | 'workspace'
  | 'proposal-studio'
  | 'pipeline'
  | 'capability-manager'
  | 'settings';

export interface UserAccount {
  fullName: string;
  email: string;
  companyName: string;
  companyWebsite: string;
  companyDescription: string;
  isOnboarded: boolean;
  accountType?: AccountType;
  industry?: string;
  teamSize?: number;
  goals?: string[];
}

export type AccountType = 'individual' | 'enterprise';

export interface SetupAnswers {
  accountType: AccountType;
  industry: string;
  teamSize: number;
  goals: string[];
}

export interface SourceEvidence {
  id: string;
  section: string;
  page?: number;
  paragraphNumber?: number;
  exactQuote: string;
  context: string;
}

export interface ExtractedRequirement {
  id: string;
  title: string;
  category: 'Technical' | 'Business' | 'Compliance' | 'Operational' | 'Delivery' | 'Commercial';
  mandatory: boolean;
  confidence: number; // 0-100
  evidenceId: string;
  description: string;
  companyProficiencyMatch: number; // 0-100
}

export interface ExtractedEntity {
  label: string;
  value: string;
  confidence: number;
  evidenceId: string;
  category: 'Organization' | 'Timeline' | 'Budget' | 'Stakeholder' | 'Scope' | 'Compliance';
}

export interface CapabilityMatchItem {
  domain: string;
  requiredLevel: number; // 1-5
  currentLevel: number; // 1-5
  matchPercentage: number;
  confidence: number;
  gapSummary: string;
  mitigationStrategy: string;
  verifiedAssets: string[];
}

export interface RiskItem {
  id: string;
  title: string;
  category: 'Technical' | 'Commercial' | 'Compliance' | 'Timeline' | 'Resource';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  impact: string;
  description: string;
  evidenceId: string;
  mitigation: string;
  costImpactEst: string;
}

export interface ProposalDocument {
  executiveSummary: string;
  clientRequirements: string;
  recommendedSolution: string;
  deliverables: string;
  assumptions: string;
  dependencies: string;
  risks: string;
  openQuestions: string;
  lastUpdated: string;
}

export interface ScoreBreakdown {
  businessFit: number;
  capabilityMatch: number;
  deliveryReadiness: number;
  riskImpact: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  industry: string;
  type: 'Tender' | 'RFP' | 'Discovery Notes' | 'Field Lead' | 'Procurement Notice';
  submittedDate: string;
  deadline: string;
  estimatedBudget: string;
  estimatedBudgetNumeric: number;
  stage: OpportunityStage;
  overallScore: number; // 0-100
  scoreBreakdown?: ScoreBreakdown;
  riskLevel: RiskLevel;
  recommendation: RecommendationType;
  recommendationReason: string;
  assignedOwner: string;
  sourceDocumentText: string;
  sourceDocumentName: string;
  summary: string;
  decisionMakers: { name: string; role: string; influence: 'High' | 'Medium' | 'Low' }[];
  keyDates: { event: string; date: string }[];
  extractedEntities: ExtractedEntity[];
  requirements: ExtractedRequirement[];
  capabilities: CapabilityMatchItem[];
  risks: RiskItem[];
  evidenceMap: Record<string, SourceEvidence>;
  proposal: ProposalDocument;
  tags: string[];
  attachments?: AttachmentMeta[];
}

export interface CompanyCapabilityProfile {
  companyName: string;
  tagline: string;
  about?: string;
  companyWebsite?: string;
  annualRevenue: string;
  teamSize: number;
  primaryIndustries: string[];
  services: {
    name: string;
    level: number; // 1-5
    description: string;
    pastProjectsCount: number;
  }[];
  certifications: {
    name: string;
    issuer: string;
    validThrough: string;
    status: 'Active' | 'In Progress';
  }[];
  techStack: {
    category: string;
    technologies: string[];
  }[];
  keyPersonnel: {
    name: string;
    title: string;
    experienceYears: number;
    clearance?: string;
  }[];
  needsConfirmation?: string[];
  /** Setup Intelligence completion flag. */
  setupCompleted?: boolean;
  /** Facts passively learned from AI chat interactions. */
  aiLearnedContext?: string[];
  /** Field keys auto-filled from chat (for "Auto-learned from chat" badges). */
  autoLearnedFields?: string[];
  industry?: string;
  goals?: string[];
}

export type LearnedField =
  | 'companyName'
  | 'companyWebsite'
  | 'companyDescription'
  | 'industry'
  | 'teamSize'
  | 'goals';

export interface CompanyFacts {
  companyName?: string;
  companyWebsite?: string;
  companyDescription?: string;
  industry?: string;
  teamSize?: number;
  goals?: string[];
  context?: string[];
}

export interface AttachmentMeta {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  opportunityId: string;
  opportunityTitle: string;
  type: 'extraction' | 'qualification' | 'risk_detected' | 'stage_changed' | 'proposal_generated';
  message: string;
  actor: string;
  badgeType: 'blue' | 'emerald' | 'amber' | 'rose';
}
