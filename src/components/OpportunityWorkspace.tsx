import React, { useState } from 'react';
import { Opportunity, ExtractedRequirement, CapabilityMatchItem, RiskItem, SourceEvidence } from '../types';
import { 
  Building, 
  Calendar, 
  DollarSign, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  Compass, 
  Layers, 
  ArrowRight, 
  ExternalLink,
  Copy,
  Check,
  Award,
  Sparkles,
  FileText
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface OpportunityWorkspaceProps {
  opportunity: Opportunity;
  onNavigate: (page: EnterprisePageId) => void;
}

export const OpportunityWorkspace: React.FC<OpportunityWorkspaceProps> = ({
  opportunity,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'capability' | 'risks' | 'evidence'>('overview');
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    Object.keys(opportunity.evidenceMap)[0] || ''
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const evidenceList = Object.values(opportunity.evidenceMap);
  const activeEvidence = opportunity.evidenceMap[selectedEvidenceId] || evidenceList[0];

  const handleCopyQuote = (quote: string, id: string) => {
    navigator.clipboard.writeText(quote);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRecommendationBanner = (rec: Opportunity['recommendation'], score: number) => {
    switch (rec) {
      case 'pursue':
        return {
          title: 'RECOMMENDATION: PURSUE (GO)',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          containerBg: 'bg-emerald-50/80 border-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          actionText: 'Proceed to Proposal Studio',
          targetPage: 'proposal-studio' as EnterprisePageId
        };
      case 'investigate':
        return {
          title: 'RECOMMENDATION: INVESTIGATE FURTHER (CONDITIONAL)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          containerBg: 'bg-amber-50/80 border-amber-200',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
          actionText: 'Review Risk Analysis',
          targetPage: 'workspace' as EnterprisePageId
        };
      case 'do_not_pursue':
        return {
          title: 'RECOMMENDATION: DO NOT PURSUE (NO-GO)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          containerBg: 'bg-rose-50/80 border-rose-200',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
          actionText: 'View Disqualification Memo',
          targetPage: 'proposal-studio' as EnterprisePageId
        };
    }
  };

  const banner = getRecommendationBanner(opportunity.recommendation, opportunity.overallScore);

  return (
    <div className="space-y-6">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">{opportunity.organization}</span>
            <span>/</span>
            <span>{opportunity.industry}</span>
            <span>/</span>
            <span className="font-mono text-slate-400">{opportunity.sourceDocumentName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {opportunity.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Owner: <strong className="text-slate-700">{opportunity.assignedOwner}</strong> • Submission Deadline: <strong className="text-slate-700">{opportunity.deadline}</strong> • Estimated Budget: <strong className="text-slate-700">{opportunity.estimatedBudget}</strong>
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
              {opportunity.overallScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Opportunity Score
            </div>
          </div>
          <button
            onClick={() => onNavigate('proposal-studio')}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Open Proposal Studio</span>
          </button>
        </div>
      </div>

      {/* Decision Support Recommendation Banner: Mobile-first vertical stack on < 768px */}
      <div className={`p-4 sm:p-5 rounded-xl border ${banner.containerBg} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-2xs mt-0.5 shrink-0">
            {banner.icon}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${banner.badgeColor}`}>
                {banner.title}
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Recommendation
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium pt-0.5">
              {opportunity.recommendationReason}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <button
            onClick={() => {
              if (banner.targetPage === 'proposal-studio') onNavigate('proposal-studio');
              else setActiveTab('risks');
            }}
            className="min-h-[44px] w-full md:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{banner.actionText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Enterprise Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
        {[
          { id: 'overview', label: 'Overview', count: null },
          { id: 'capability', label: 'Capability Assessment', count: `${opportunity.capabilities.length} Domains` },
          { id: 'risks', label: 'Risk Analysis', count: `${opportunity.risks.length} Flags` },
          { id: 'evidence', label: 'Evidence', count: `${evidenceList.length} Citations` }
        ].map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/30'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Organization
              </div>
              <div className="text-sm font-bold text-slate-900">{opportunity.organization}</div>
              <div className="text-xs text-slate-500">Industry: {opportunity.industry}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Budget Clues
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">{opportunity.estimatedBudget}</div>
              <div className="text-xs text-slate-500">Procurement Type: {opportunity.type}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Proposal Deadline
              </div>
              <div className="text-sm font-bold text-slate-900">{opportunity.deadline}</div>
              <div className="text-xs text-slate-500">First Ingested: {opportunity.submittedDate}</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Contact
              </div>
              <div className="text-sm font-bold text-slate-900">{opportunity.decisionMakers[0]?.name || 'Evaluation Committee'}</div>
              <div className="text-xs text-slate-500">{opportunity.decisionMakers[0]?.role}</div>
            </div>

          </div>

          {/* Key Decision Makers & Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Decision Makers */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <span>Identified Contacts & Decision Makers</span>
              </h3>
              <div className="space-y-2">
                {opportunity.decisionMakers.map((dm, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{dm.name}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{dm.role}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      dm.influence === 'High' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {dm.influence} Influence
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procurement Milestones */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span>Procurement Milestones</span>
              </h3>
              <div className="space-y-2">
                {opportunity.keyDates.map((kd, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{kd.event}</span>
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {kd.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Extracted Requirements List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Extracted Requirements ({opportunity.requirements.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Mandatory qualifications and operational prerequisites extracted from document text.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {opportunity.requirements.map((req) => (
                <div key={req.id} className="py-3 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        req.mandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {req.mandatory ? 'Mandatory' : 'Optional'}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                        {req.category}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {req.confidence}% Confidence
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {req.title}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      In-House Match
                    </div>
                    <div className="text-sm font-bold text-slate-900 font-mono">
                      {req.companyProficiencyMatch}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: CAPABILITY MATCH */}
      {activeTab === 'capability' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Matched Services & Capability Gaps
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed comparison between opportunity requirements and verified company delivery assets.
              </p>
            </div>

            <div className="space-y-4">
              {opportunity.capabilities.map((cap) => (
                <div key={cap.domain} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-bold text-slate-900">{cap.domain}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Confidence: {cap.confidence}%</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-500 font-medium">Demand: Level {cap.requiredLevel}/5</span>
                        <span className="text-slate-300 mx-2">|</span>
                        <span className="text-xs font-bold text-[#2563EB]">In-House: Level {cap.currentLevel}/5</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {cap.matchPercentage}% Match
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="font-bold text-slate-700 mb-1">Capability Gap Diagnosis:</div>
                      <p className="text-slate-600 leading-relaxed">{cap.gapSummary}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                      <div className="font-bold text-blue-900 mb-1">Recommended Teaming / Mitigation:</div>
                      <p className="text-blue-950 leading-relaxed">{cap.mitigationStrategy}</p>
                    </div>
                  </div>

                  {cap.verifiedAssets.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Verified Assets:</span>
                      {cap.verifiedAssets.map((asset, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ {asset}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RISKS */}
      {activeTab === 'risks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Risk Categories, Severity & Mitigation Suggestions
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Contractual penalties, delivery constraints, and liability exposures extracted from procurement clauses.
              </p>
            </div>

            <div className="space-y-3">
              {opportunity.risks.map((risk) => (
                <div key={risk.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          risk.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                          risk.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {risk.severity} Severity
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {risk.category}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">{risk.title}</div>
                    </div>
                    <div className="text-right shrink-0 font-mono text-xs font-semibold text-slate-700">
                      {risk.costImpactEst}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {risk.description}
                  </p>

                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-950">
                    <strong className="text-blue-900">Actionable Mitigation:</strong> {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EVIDENCE (TRUST FEATURE) */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Evidence</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Every requirement and risk links to the source document text.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                100% Traceable
              </span>
            </div>

            {/* Split layout: Citations on left, Document Viewer on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Citations List (5 cols) */}
              <div className="lg:col-span-5 space-y-2">
                {evidenceList.map((ev) => {
                  const isSelected = selectedEvidenceId === ev.id;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => setSelectedEvidenceId(ev.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2563EB] bg-blue-50/60 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span className="text-[#2563EB] font-mono">{ev.section}</span>
                        {ev.page && <span>Page {ev.page}</span>}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                        "{ev.exactQuote}"
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1 truncate">
                        {ev.context}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Document Text Viewer with Active Highlight (7 cols) */}
              <div className="lg:col-span-7 p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                  <div className="font-bold text-slate-900">
                    Source Document: {opportunity.sourceDocumentName}
                  </div>
                  {activeEvidence && (
                    <button
                      onClick={() => handleCopyQuote(activeEvidence.exactQuote, activeEvidence.id)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                    >
                      {copiedId === activeEvidence.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Quote</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {activeEvidence ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1">
                        Anchored Quote: {activeEvidence.section}
                      </div>
                      <p className="font-mono text-xs font-bold text-amber-950 bg-white p-2.5 rounded border border-amber-200/80">
                        "{activeEvidence.exactQuote}"
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {opportunity.sourceDocumentText}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Select an evidence citation on the left.</div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
