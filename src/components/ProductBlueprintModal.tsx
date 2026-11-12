import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  Database, 
  Server, 
  CheckCircle2, 
  Cpu, 
  Copy, 
  Check, 
  Scale, 
  GitBranch,
  ShieldCheck
} from 'lucide-react';

interface ProductBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductBlueprintModal: React.FC<ProductBlueprintModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'methodology' | 'wireframes' | 'schema' | 'api' | 'roadmap'>('methodology');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const prismaSchemaCode = `// Prisma Database Schema for NexusIQ Opportunity-to-Proposal Intelligence
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Organization {
  id               String        @id @default(uuid())
  name             String
  tagline          String?
  annualRevenue    String?
  teamSize         Int           @default(50)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  users            User[]
  opportunities    Opportunity[]
  capabilities     CompanyCapability[]
  certifications   Certification[]
}

model User {
  id               String        @id @default(uuid())
  email            String        @unique
  fullName         String
  role             String        @default("BidDirector") // Executive, Architect, ProposalManager
  organizationId   String
  organization     Organization  @relation(fields: [organizationId], references: [id])
  createdAt        DateTime      @default(now())
}

model Opportunity {
  id               String        @id @default(uuid())
  organizationId   String
  organization     Organization  @relation(fields: [organizationId], references: [id])
  title            String
  procuringClient  String
  industry         String
  type             String        // Tender, RFP, Discovery Notes
  deadline         DateTime
  estimatedBudget  Decimal?
  stage            String        @default("new") // new, verification, discovery, qualified, proposal, won, lost
  overallScore     Int           @default(0) // 0 - 100
  riskLevel        String        @default("Medium") // Low, Medium, High
  recommendation   String        // pursue, investigate, do_not_pursue
  recommendationReason String?   @db.Text
  assignedOwner    String?
  sourceDocName    String
  sourceDocText    String        @db.Text
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  requirements     Requirement[]
  risks            Risk[]
  evidenceSnippets Evidence[]
  proposal         ProposalDocument?
}

model Requirement {
  id               String        @id @default(uuid())
  opportunityId    String
  opportunity      Opportunity   @relation(fields: [opportunityId], references: [id])
  title            String
  category         String        // Technical, Business, Compliance, Delivery
  mandatory        Boolean       @default(true)
  confidence       Int           // 0-100
  description      String        @db.Text
  evidenceId       String?
  matchProficiency Int           @default(80)
}

model Risk {
  id               String        @id @default(uuid())
  opportunityId    String
  opportunity      Opportunity   @relation(fields: [opportunityId], references: [id])
  title            String
  category         String        // Commercial, Technical, Compliance, Timeline, Resource
  severity         String        // Critical, High, Medium, Low
  impact           String        @db.Text
  description      String        @db.Text
  mitigation       String        @db.Text
  costImpactEst    String?
}

model Evidence {
  id               String        @id @default(uuid())
  opportunityId    String
  opportunity      Opportunity   @relation(fields: [opportunityId], references: [id])
  sectionTitle     String
  pageNumber       Int?
  paragraphNumber  Int?
  exactQuote       String        @db.Text
  context          String?
  createdAt        DateTime      @default(now())
}

model ProposalDocument {
  id                  String       @id @default(uuid())
  opportunityId       String       @unique
  opportunity         Opportunity  @relation(fields: [opportunityId], references: [id])
  executiveSummary    String       @db.Text
  clientRequirements  String       @db.Text
  recommendedSolution String       @db.Text
  deliverables        String       @db.Text
  assumptions         String       @db.Text
  dependencies        String       @db.Text
  risks               String       @db.Text
  openQuestions       String       @db.Text
  updatedAt           DateTime     @updatedAt
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0F172A] text-white">
              <BookOpen className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                NexusIQ Product Blueprint & Methodology Specifications
              </h2>
              <p className="text-xs text-slate-500">
                Decision scoring models, capability matching algorithms, relational schemas, and enterprise roadmap.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: Mobile touch-friendly scroll */}
        <div className="px-4 sm:px-6 border-b border-slate-200 bg-slate-50 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth text-xs font-semibold">
          {[
            { id: 'methodology', label: 'Scoring & Matching Methodology' },
            { id: 'wireframes', label: 'Screen Wireframes & Hierarchy' },
            { id: 'schema', label: 'Database Schema (PostgreSQL/Prisma)' },
            { id: 'api', label: 'FastAPI / REST Architecture' },
            { id: 'roadmap', label: 'MVP to Enterprise Roadmap' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] py-2.5 px-3.5 border-b-2 transition-colors whitespace-nowrap shrink-0 flex items-center ${
                activeTab === tab.id
                  ? 'border-[#2563EB] text-[#2563EB] bg-white font-bold shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 active:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* TAB 1: METHODOLOGY */}
          {activeTab === 'methodology' && (
            <div className="space-y-6">
              
              {/* Scoring Methodology */}
              <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#2563EB]" />
                  <span>1. Opportunity Scoring Methodology (0–100 Index)</span>
                </h3>
                <p className="leading-relaxed">
                  NexusIQ computes the Opportunity Composite Score (S_opp) as a deterministic multi-criteria evaluation of five weighted operational dimensions, penalized by fatal compliance gates:
                </p>
                <div className="p-3 rounded-lg bg-white font-mono text-xs border border-slate-300 text-slate-900">
                  S_opp = (0.25 * BusinessFit) + (0.25 * TechnicalFit) + (0.20 * StrategicFit) + (0.15 * DeliveryFit) + (0.15 * ComplianceFit) - FatalGatePenalty
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200">
                    <strong className="text-emerald-800 block">PURSUE (Score &ge; 80)</strong>
                    <span className="text-[11px] text-emerald-900">High win probability, verified in-house assets, healthy commercial margin.</span>
                  </div>
                  <div className="p-2.5 rounded bg-amber-50 border border-amber-200">
                    <strong className="text-amber-800 block">INVESTIGATE (Score 60–79)</strong>
                    <span className="text-[11px] text-amber-900">Strong business value, but carries timeline, staffing, or SLA penalty risks.</span>
                  </div>
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200">
                    <strong className="text-rose-800 block">DO NOT PURSUE (&lt; 60)</strong>
                    <span className="text-[11px] text-rose-900">Fatal gate deficit (e.g. missing security clearance, unlimited liabilities).</span>
                  </div>
                </div>
              </div>

              {/* Capability Matching Methodology */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>2. Capability Matching & Gap Analysis Methodology</span>
                </h3>
                <p className="leading-relaxed">
                  Opportunity requirements are compared against company capabilities on a standardized <strong>Level 1 to 5 proficiency scale</strong>:
                </p>
                <ul className="space-y-1.5 pl-4 list-disc">
                  <li><strong>Level 1 (Fundamental):</strong> Basic awareness; subcontracting partner mandatory.</li>
                  <li><strong>Level 3 (Competent):</strong> Demonstrated production delivery on 10+ commercial projects.</li>
                  <li><strong>Level 5 (Mastery):</strong> World-class recognized market leader; reusable blueprints and patent/certified assets.</li>
                </ul>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs">
                  MatchPercentage = Min(100, Round((InHouseProficiencyLevel / RequiredLevel) * 100))
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: WIREFRAMES & NAVIGATION */}
          {activeTab === 'wireframes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Navigation Hierarchy & 7 Primary Pages Structure
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { page: '1. Executive Dashboard', desc: 'KPI cards (Total Opps, Qualified, Proposal Ready, High Risk, Value), Status Breakdown, Industry Exposure, Recent Leads table.' },
                  { page: '2. Opportunities', desc: 'Central management table with Search, Filter by Status/Industry/Risk, Sort by Score/Budget/Deadline, Assigned Owner column.' },
                  { page: '3. Opportunity Workspace', desc: 'Single source of truth with 4 clean tabs: Overview, Capability Match, Risks & Exposure, and Verifiable Evidence (Trust feature).' },
                  { page: '4. Proposal Studio', desc: 'Executive document editor covering 8 standard proposal sections with DOCX, PDF, and Clipboard export.' },
                  { page: '5. Pipeline', desc: 'Enterprise 8-stage Kanban board tracking deal flow with stage card counts and total monetary volume.' },
                  { page: '6. Capability Manager', desc: 'Profile configuration: Core services with 1–5 level sliders, Certifications, Technologies, and Key Personnel.' },
                  { page: '7. Settings', desc: 'Organization profile, AI provider selection (Gemini, Groq, Ollama), Confidence thresholds, and audit retention.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <div className="font-bold text-slate-900 text-xs">{item.page}</div>
                    <p className="text-[11px] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">PostgreSQL Relational DDL & Prisma Schema</h3>
                  <p className="text-xs text-slate-500">Includes Organization, User, Opportunity, Requirement, Risk, Evidence, and Proposal.</p>
                </div>
                <button
                  onClick={() => handleCopy(prismaSchemaCode, 'prisma')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 bg-white flex items-center gap-1.5 shadow-2xs"
                >
                  {copied === 'prisma' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied === 'prisma' ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-[420px] border border-slate-800">
                <pre>{prismaSchemaCode}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: API */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">FastAPI REST API Architecture Specs</h3>
              <div className="space-y-2.5">
                {[
                  { m: 'POST', p: '/api/v1/opportunities/ingest', d: 'Accepts raw text or multipart document (PDF/DOCX); returns tokenized and extracted entities.' },
                  { m: 'GET', p: '/api/v1/opportunities', d: 'Returns paginated list of opportunities with filtering by stage, riskLevel, and overallScore.' },
                  { m: 'GET', p: '/api/v1/opportunities/{id}', d: 'Returns single source of truth including requirements, risks, capabilities, and evidence.' },
                  { m: 'POST', p: '/api/v1/proposals/{id}/generate', d: 'Synthesizes all 8 structured proposal sections using low-temperature AI reasoning.' },
                  { m: 'PATCH', p: '/api/v1/opportunities/{id}/stage', d: 'Moves opportunity across the 8 Kanban pipeline stages.' }
                ].map((a, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{a.m}</span>
                      <span className="font-mono font-semibold text-slate-800">{a.p}</span>
                    </div>
                    <span className="text-slate-500 max-w-sm text-right hidden sm:inline">{a.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">MVP to Enterprise Growth Roadmap</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Phase 1: Ingestion & Trust (Delivered MVP)</div>
                  <p className="text-slate-600">Multi-format ingestion, zero-hallucination quote anchoring, capability matching, and 8-section proposal studio.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Phase 2: CRM & SAM.gov Connectors</div>
                  <p className="text-slate-600">Automated ingestion from SAM.gov, TED (Tenders Electronic Daily), Salesforce Opportunities, and HubSpot deals.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Phase 3: Multi-User Collaboration & RBAC</div>
                  <p className="text-slate-600">Role-based access control (Executive, Solution Architect, Legal Redline Officer) with simultaneous document co-editing.</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Phase 4: Air-Gapped Sovereign Deployment</div>
                  <p className="text-slate-600">Full on-premise Kubernetes deployment with local Ollama Llama 3.3 for classified defense contractors.</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
