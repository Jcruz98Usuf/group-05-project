import React from 'react';
import { Opportunity, ActivityEvent } from '../types';
import { 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Briefcase, 
  AlertTriangle,
  Clock,
  Layers,
  Building,
  BarChart3
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface ExecutiveDashboardProps {
  opportunities: Opportunity[];
  activeOpportunity: Opportunity;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigate: (page: EnterprisePageId) => void;
  activityEvents: ActivityEvent[];
  onOpenNewOpportunityModal: () => void;
  companyName: string;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  opportunities,
  activeOpportunity,
  onSelectOpportunity,
  onNavigate,
  activityEvents,
  onOpenNewOpportunityModal,
  companyName
}) => {
  // Aggregate Metrics
  const totalCount = opportunities.length;
  const qualifiedCount = opportunities.filter((o) => o.stage === 'qualified' || o.stage === 'proposal' || o.stage === 'won').length;
  const proposalReadyCount = opportunities.filter((o) => o.proposal?.executiveSummary && o.overallScore >= 70).length;
  const highRiskCount = opportunities.filter((o) => o.riskLevel === 'High').length;
  const totalPipelineValue = opportunities.reduce((acc, curr) => acc + curr.estimatedBudgetNumeric, 0);
  const formattedPipelineValue = `$${(totalPipelineValue / 1000000).toFixed(1)}M`;

  // Status Breakdown calculation
  const statusCounts = {
    new: opportunities.filter((o) => o.stage === 'new').length,
    verification: opportunities.filter((o) => o.stage === 'verification').length,
    discovery: opportunities.filter((o) => o.stage === 'discovery').length,
    qualified: opportunities.filter((o) => o.stage === 'qualified').length,
    proposal: opportunities.filter((o) => o.stage === 'proposal').length,
    negotiation: opportunities.filter((o) => o.stage === 'negotiation').length,
    won: opportunities.filter((o) => o.stage === 'won').length,
    lost: opportunities.filter((o) => o.stage === 'lost').length,
  };

  // Industry Breakdown
  const industryMap: Record<string, number> = {};
  opportunities.forEach((o) => {
    industryMap[o.industry] = (industryMap[o.industry] || 0) + 1;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (score >= 60) return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30';
    return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';
  };

  const getRecommendationBadge = (rec: Opportunity['recommendation']) => {
    switch (rec) {
      case 'pursue':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PURSUE</span>;
      case 'investigate':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">INVESTIGATE</span>;
      case 'do_not_pursue':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">DO NOT PURSUE</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Enterprise Profile</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-[#2563EB]">{companyName}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Executive Opportunity Command
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time pipeline intelligence, risk exposure, and qualification decisions for {companyName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('pipeline')}
            className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Pipeline Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenNewOpportunityModal}
            className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Analyze New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* KPI 1: Active Opportunities */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Active Opportunities</span>
            <Briefcase className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Under active evaluation
          </div>
        </div>

        {/* KPI 2: Qualified Opportunities */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Qualified Opportunities</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{qualifiedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Passed capability gates
          </div>
        </div>

        {/* KPI 3: Proposal Ready */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Proposal Ready</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{proposalReadyCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Studio briefs drafted
          </div>
        </div>

        {/* KPI 4: High Risk Opportunities */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>High Risk Opportunities</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{highRiskCount}</div>
          <div className="text-[11px] text-rose-600/80 font-medium mt-1">
            Requires executive signoff
          </div>
        </div>

        {/* KPI 5: Pipeline Value */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Pipeline Value</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formattedPipelineValue}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Cumulative target value
          </div>
        </div>

      </div>

      {/* Middle Row: Charts & Visual Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Opportunity Status Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              <span>Pipeline Status Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{totalCount} total</span>
          </div>

          <div className="space-y-2.5">
            {[
              { stage: 'Qualified', count: statusCounts.qualified, color: 'bg-emerald-500' },
              { stage: 'Proposal Active', count: statusCounts.proposal, color: 'bg-blue-500' },
              { stage: 'Discovery', count: statusCounts.discovery, color: 'bg-purple-500' },
              { stage: 'Verification', count: statusCounts.verification, color: 'bg-amber-500' },
              { stage: 'New Intake', count: statusCounts.new, color: 'bg-slate-400' }
            ].map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.stage}</span>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${totalCount ? (item.count / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
            Conversion rate from Ingestion to Qualified: <strong className="text-slate-800">{Math.round((qualifiedCount / totalCount) * 100)}%</strong>
          </div>
        </div>

        {/* Chart 2: Industry Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#2563EB]" />
              <span>Industry Sector Exposure</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{Object.keys(industryMap).length} Sectors</span>
          </div>

          <div className="space-y-3">
            {Object.entries(industryMap).map(([ind, count]) => (
              <div key={ind} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 truncate">{ind}</span>
                <span className="px-2 py-0.5 rounded-full bg-white font-bold text-slate-700 border border-slate-200 shadow-2xs">
                  {count} {count === 1 ? 'Lead' : 'Leads'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            Public transit and healthcare verticals account for 68% of qualified enterprise pipeline.
          </p>
        </div>

        {/* Chart 3: Opportunity Trend & Win-Probability */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Opportunity Intake Trend</span>
            </h3>
            <span className="text-xs text-emerald-600 font-semibold">+35% MoM</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Q3 Monthly Intake Volume</span>
                <span className="font-bold text-slate-900">4 Opportunities ($11.2M)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[65%]" />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Q4 Monthly Intake Volume</span>
                <span className="font-bold text-slate-900">6 Opportunities ($17.5M)</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#2563EB] h-full w-[85%]" />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900">
            <strong>Decision Confidence Index:</strong> Disqualification filters have saved an estimated 120 proposal engineering hours this quarter.
          </div>
        </div>

      </div>

      {/* Bottom Sections: Recent Opportunities Table, Top Risks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Recent Opportunities */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Opportunities
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated leads with score, recommendation, and assigned owner.
              </p>
            </div>
            <button
              onClick={() => onNavigate('opportunities')}
              className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Opportunity</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Decision</th>
                  <th className="py-2.5 px-3">Risk</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {opportunities.slice(0, 5).map((opp) => (
                  <tr
                    key={opp.id}
                    onClick={() => {
                      onSelectOpportunity(opp);
                      onNavigate('workspace');
                    }}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{opp.title}</div>
                      <div className="text-[11px] text-slate-500">{opp.organization}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {opp.estimatedBudget}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getScoreBadge(opp.overallScore)}`}>
                        {opp.overallScore}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {getRecommendationBadge(opp.recommendation)}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[11px] font-semibold ${
                        opp.riskLevel === 'High' ? 'text-rose-600' :
                        opp.riskLevel === 'Medium' ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {opp.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOpportunity(opp);
                          onNavigate('workspace');
                        }}
                        className="text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        Open Workspace &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (1 col): Top Risks & Recent Activity */}
        <div className="space-y-6">
          
          {/* Top Contractual Risks Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Top Critical Risks</span>
              </h3>
              <span className="text-[10px] text-slate-400">Governance</span>
            </div>

            <div className="space-y-2.5">
              {opportunities
                .flatMap((o) => o.risks.map((r) => ({ ...r, oppTitle: o.title })))
                .filter((r) => r.severity === 'Critical' || r.severity === 'High')
                .slice(0, 3)
                .map((r) => (
                  <div key={r.id} className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{r.title}</span>
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                        {r.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      {r.impact}
                    </p>
                    <div className="text-[10px] text-slate-500 italic">
                      Opportunity: {r.oppTitle}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recent System Activity</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              {activityEvents.slice(0, 4).map((evt) => (
                <div key={evt.id} className="text-xs flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-slate-800 leading-snug font-medium">
                      {evt.message}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {evt.actor} • {evt.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
