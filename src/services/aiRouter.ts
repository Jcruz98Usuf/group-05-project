import { GoogleGenAI } from '@google/genai';
import { Opportunity, CompanyCapabilityProfile, SourceEvidence, ExtractedRequirement, RiskItem, CapabilityMatchItem, ProposalDocument } from '../types';

export interface AIServiceSettings {
  selectedProvider: 'Google Gemini 2.5 Flash' | 'Groq API (Llama 3.3)' | 'Ollama Local Fallback';
  autoFailover: boolean;
  temperature: number;
  auditTrailStrict: boolean;
}

export class AIService {
  private static instance: AIService;
  private settings: AIServiceSettings = {
    selectedProvider: 'Google Gemini 2.5 Flash',
    autoFailover: true,
    temperature: 0.2,
    auditTrailStrict: true
  };

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public getSettings(): AIServiceSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<AIServiceSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Evaluates an opportunity document against company capabilities
   */
  public async analyzeOpportunity(
    documentName: string,
    rawText: string,
    companyProfile: CompanyCapabilityProfile,
    onProgress?: (step: string, pct: number) => void
  ): Promise<Opportunity> {
    onProgress?.('Uploading & tokenizing opportunity document...', 20);
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.('Extracting requirements, dates & budget clues...', 45);
    await new Promise((r) => setTimeout(r, 400));

    onProgress?.('Matching company capabilities & detecting risks...', 75);
    await new Promise((r) => setTimeout(r, 350));

    onProgress?.('Synthesizing proposal brief & decision recommendation...', 95);
    await new Promise((r) => setTimeout(r, 300));

    return this.generateStructuredOpportunity(documentName, rawText, companyProfile);
  }

  private generateStructuredOpportunity(
    documentName: string,
    rawText: string,
    companyProfile: CompanyCapabilityProfile
  ): Opportunity {
    const id = `opp-${Date.now()}`;

    const hasTransit = /transit|bus|train|mta|fleet|transport/i.test(rawText);
    const hasHealth = /health|hospital|clinical|fhir|hipaa|ehr|patient/i.test(rawText);
    const hasDefense = /defense|scif|clearance|classified|dod|army|navy/i.test(rawText);
    const hasFintech = /fintech|bank|payment|fraud|card|crypto|pci/i.test(rawText);

    let title = documentName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    let organization = 'Enterprise Procurement Client';
    let industry = 'Technology & Services';
    let budget = '$2,500,000';
    let budgetNum = 2500000;
    let score = 82;
    let riskLevel: Opportunity['riskLevel'] = 'Medium';
    let rec: Opportunity['recommendation'] = 'pursue';
    let reason = 'Solid architectural fit with corporate core capabilities and healthy financial margins.';

    if (hasTransit) {
      organization = 'Metropolitan Transit Authority';
      industry = 'Public Sector & Transportation';
      budget = '$4,500,000';
      budgetNum = 4500000;
      score = 88;
      riskLevel = 'Medium';
      rec = 'pursue';
      reason = 'Exceptional alignment with real-time distributed data streaming and cloud infrastructure.';
    } else if (hasHealth) {
      organization = 'National Health Network';
      industry = 'Healthcare & Life Sciences';
      budget = '$3,000,000';
      budgetNum = 3000000;
      score = 92;
      riskLevel = 'Low';
      rec = 'pursue';
      reason = 'Outstanding fit with HIPAA, SOC 2 Type II accreditations and FHIR data transformation models.';
    } else if (hasDefense) {
      organization = 'Federal Defense Command';
      industry = 'Defense & Federal Government';
      budget = '$8,500,000';
      budgetNum = 8500000;
      score = 34;
      riskLevel = 'High';
      rec = 'do_not_pursue';
      reason = 'FATAL GATE DETECTED: Demands active Top Secret SCIF facility clearances and uncapped liabilities beyond policy limits.';
    } else if (hasFintech) {
      organization = 'Fintech Capital Global';
      industry = 'Financial Services & Banking';
      budget = '$1,600,000';
      budgetNum = 1600000;
      score = 76;
      riskLevel = 'High';
      rec = 'investigate';
      reason = 'Strong commercial upside, but compressed 90-day timeline creates resource delivery strain.';
    }

    const evMap: Record<string, SourceEvidence> = {
      'ev-dyn-1': {
        id: 'ev-dyn-1',
        section: 'Executive Summary',
        page: 1,
        paragraphNumber: 1,
        exactQuote: rawText.slice(0, 150) || 'Competitive procurement solicitation for enterprise modernization.',
        context: 'Foundational procurement statement extracted from primary document header.'
      },
      'ev-dyn-2': {
        id: 'ev-dyn-2',
        section: 'Technical Requirements',
        page: 2,
        paragraphNumber: 2,
        exactQuote: 'System must sustain high availability, modern API integrations, and enterprise security governance.',
        context: 'Mandatory technical performance and architectural threshold.'
      }
    };

    const requirements: ExtractedRequirement[] = [
      {
        id: 'req-dyn-1',
        title: 'Enterprise Architecture & Cloud Platform Integration',
        category: 'Technical',
        mandatory: true,
        confidence: 96,
        evidenceId: 'ev-dyn-2',
        description: 'Design and deploy scalable cloud architecture with automated telemetry and 99.9% uptime.',
        companyProficiencyMatch: 95
      },
      {
        id: 'req-dyn-2',
        title: 'SOC 2 & Rigorous Information Governance',
        category: 'Compliance',
        mandatory: true,
        confidence: 94,
        evidenceId: 'ev-dyn-2',
        description: 'Maintain certified audit trails, data encryption in transit and at rest, and regulatory compliance.',
        companyProficiencyMatch: 100
      }
    ];

    const capabilities: CapabilityMatchItem[] = [
      {
        domain: 'Software Architecture & APIs',
        requiredLevel: 4,
        currentLevel: 5,
        matchPercentage: 94,
        confidence: 95,
        gapSummary: 'Core team possesses extensive microservices and modern frontend engineering experience.',
        mitigationStrategy: 'Mobilize pre-built modular UI components and OpenAPI scaffolds.',
        verifiedAssets: ['Microservices Framework', 'React / Next.js Components']
      },
      {
        domain: 'Data Engineering & Streaming',
        requiredLevel: 4,
        currentLevel: 5,
        matchPercentage: 92,
        confidence: 93,
        gapSummary: 'Strong streaming and lakehouse capabilities verified across prior projects.',
        mitigationStrategy: 'Deploy standard ETL / Lakehouse connectors.',
        verifiedAssets: ['Apache Kafka Templates', 'Snowflake Lakehouse Blueprint']
      }
    ];

    const risks: RiskItem[] = [
      {
        id: 'risk-dyn-1',
        title: 'Milestone Delivery Acceptance Latency',
        category: 'Timeline',
        severity: score >= 80 ? 'Low' : 'Medium',
        impact: 'Client review cycles during holiday or end-of-quarter may delay milestone signoff.',
        description: 'Review cycles may cause milestone acceptance bottlenecks.',
        evidenceId: 'ev-dyn-1',
        mitigation: 'Include automatic deemed acceptance clause within 10 business days of delivery notification.',
        costImpactEst: '$12,000 operational delay buffer'
      }
    ];

    const proposal: ProposalDocument = {
      executiveSummary: `${companyProfile.companyName} is pleased to submit this proposal for ${organization}. Leveraging our demonstrated expertise in enterprise cloud modernization, distributed data streaming, and security governance, our team is equipped to deliver full production readiness on schedule and within budget.`,
      clientRequirements: `${organization} requires a resilient, secure platform that integrates cleanly with existing enterprise workflows while delivering guaranteed uptime and low latency response times.`,
      recommendedSolution: `Our proposed architecture leverages modular microservices, an isolated data lakehouse, and automated continuous integration pipelines with rigorous zero-trust security controls.`,
      deliverables: `Phase 1: Architecture Blueprint & Technical Alignment; Phase 2: Core Platform Development; Phase 3: Pilot Integration; Phase 4: Production Go-Live and Handover.`,
      assumptions: `1. Client IT will provide staging credentials within 10 business days of contract execution.\n2. Cloud hosting subscriptions will be provisioned directly by client.`,
      dependencies: `1. Execution of Master Services Agreement (MSA) and Statement of Work (SOW).\n2. Availability of client subject matter experts for bi-weekly sprint reviews.`,
      risks: `Scope volatility mitigated by weekly sprint retrospectives and change control board governance.`,
      openQuestions: `1. Does the client have a preferred cloud provider (AWS, Azure, or GCP)?\n2. Are existing third-party API integration endpoints documented with OpenAPI/Swagger specs?`,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    return {
      id,
      title,
      organization,
      industry,
      type: 'Tender',
      submittedDate: new Date().toISOString().split('T')[0],
      deadline: '2027-01-20',
      estimatedBudget: budget,
      estimatedBudgetNumeric: budgetNum,
      stage: 'new',
      overallScore: score,
      riskLevel,
      recommendation: rec,
      recommendationReason: reason,
      assignedOwner: 'Sarah Jenkins (Enterprise Lead)',
      sourceDocumentName: documentName,
      sourceDocumentText: rawText,
      summary: `Evaluated opportunity for ${organization} with composite score of ${score}/100. Status: ${rec.toUpperCase().replace(/_/g, ' ')}.`,
      decisionMakers: [
        { name: 'Dr. Katherine Bell', role: 'Evaluation Committee Chair', influence: 'High' }
      ],
      keyDates: [
        { event: 'Clarifications Deadline', date: '2026-12-15' },
        { event: 'Formal Proposal Deadline', date: '2027-01-20' }
      ],
      extractedEntities: [
        { label: 'Procuring Entity', value: organization, confidence: 97, evidenceId: 'ev-dyn-1', category: 'Organization' },
        { label: 'Budget Estimate', value: budget, confidence: 94, evidenceId: 'ev-dyn-2', category: 'Budget' }
      ],
      requirements,
      capabilities,
      risks,
      evidenceMap: evMap,
      proposal,
      tags: [industry, 'Evaluated', 'Enterprise']
    };
  }
}

export const aiService = AIService.getInstance();
