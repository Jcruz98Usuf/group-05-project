import React, { useState } from 'react';
import { Opportunity, OpportunityStage } from '../types';
import { 
  KanbanSquare, 
  Search, 
  DollarSign, 
  Calendar, 
  ShieldAlert, 
  Plus, 
  ChevronRight,
  ArrowRight,
  Filter
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface PipelineKanbanProps {
  opportunities: Opportunity[];
  activeOpportunity: Opportunity;
  onSelectOpportunity: (opp: Opportunity) => void;
  onUpdateOpportunityStage: (oppId: string, newStage: OpportunityStage) => void;
  onNavigate: (page: EnterprisePageId) => void;
  onOpenNewOpportunityModal: () => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  opportunities,
  activeOpportunity,
  onSelectOpportunity,
  onUpdateOpportunityStage,
  onNavigate,
  onOpenNewOpportunityModal
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileSelectedStage, setMobileSelectedStage] = useState<OpportunityStage | 'all'>('all');

  const stages: { id: OpportunityStage; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'border-t-slate-400' },
    { id: 'verification', label: 'Verification', color: 'border-t-indigo-400' },
    { id: 'discovery', label: 'Discovery', color: 'border-t-purple-400' },
    { id: 'qualified', label: 'Qualified', color: 'border-t-emerald-500' },
    { id: 'proposal', label: 'Proposal', color: 'border-t-blue-500' },
    { id: 'negotiation', label: 'Negotiation', color: 'border-t-amber-500' },
    { id: 'won', label: 'Won', color: 'border-t-emerald-600' },
    { id: 'lost', label: 'Lost', color: 'border-t-slate-300' }
  ];

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    o.organization.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (score >= 60) return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30';
    return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';
  };

  const displayedStages = mobileSelectedStage === 'all' 
    ? stages 
    : stages.filter(s => s.id === mobileSelectedStage);

  return (
    <div className="space-y-6">
      
      {/* Page Header: Mobile-first vertical stack on < 768px */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Opportunity Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stage-by-stage progression tracking from initial intake through qualification, proposal, and contract award.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter cards..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <button
            onClick={onOpenNewOpportunityModal}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Intake Lead</span>
          </button>
        </div>
      </div>

      {/* Mobile Stage Selector Strip for screens < 768px */}
      <div className="md:hidden bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>View Stage</span>
          </span>
          <span className="text-slate-500 font-sans font-medium">Swipe to switch &rarr;</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setMobileSelectedStage('all')}
            className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
              mobileSelectedStage === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Stages ({opportunities.length})
          </button>
          {stages.map((stage) => {
            const count = filtered.filter(o => o.stage === stage.id).length;
            const isSelected = mobileSelectedStage === stage.id;

            return (
              <button
                key={stage.id}
                onClick={() => setMobileSelectedStage(stage.id)}
                className={`min-h-[40px] px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{stage.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Single Stage Card View (when a specific stage is selected on screens < 768px) */}
      {mobileSelectedStage !== 'all' && (
        <div className="md:hidden space-y-3">
          {displayedStages.map((stage) => {
            const oppsInStage = filtered.filter((o) => o.stage === stage.id);
            const stageValue = oppsInStage.reduce((sum, o) => sum + o.estimatedBudgetNumeric, 0);

            return (
              <div key={stage.id} className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{stage.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] text-[10px] font-bold">
                      {oppsInStage.length} Leads
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700">
                    ${(stageValue / 1000000).toFixed(1)}M Total Value
                  </span>
                </div>

                <div className="space-y-3">
                  {oppsInStage.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => {
                        onSelectOpportunity(opp);
                        onNavigate('workspace');
                      }}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 active:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            {opp.organization}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-0.5">
                            {opp.title}
                          </h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border shrink-0 ${getScoreBadge(opp.overallScore)}`}>
                          {opp.overallScore} Fit
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 font-mono pt-1 border-t border-slate-100">
                        <span className="font-bold text-slate-900">{opp.estimatedBudget}</span>
                        <span className="text-slate-500 font-sans text-[11px]">{opp.deadline}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">
                          {opp.assignedOwner}
                        </span>

                        <select
                          value={opp.stage}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateOpportunityStage(opp.id, e.target.value as OpportunityStage)}
                          className="min-h-[40px] bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 py-1.5 px-3 focus:outline-none"
                        >
                          {stages.map((stg) => (
                            <option key={stg.id} value={stg.id}>
                              Move: {stg.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {oppsInStage.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                      No opportunities currently in this stage.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Multi-Column Horizontal Kanban Columns (Visible on Desktop >= 768px, or on mobile when 'All' is selected) */}
      <div className={`overflow-x-auto pb-4 scroll-smooth snap-x ${mobileSelectedStage !== 'all' ? 'hidden md:block' : 'block'}`}>
        <div className="flex gap-4 min-w-[1720px] pb-2">
          {stages.map((stage) => {
            const oppsInStage = filtered.filter((o) => o.stage === stage.id);
            const stageValue = oppsInStage.reduce((sum, o) => sum + o.estimatedBudgetNumeric, 0);

            return (
              <div
                key={stage.id}
                className={`w-72 bg-slate-100/70 rounded-xl p-3 border-t-4 ${stage.color} border border-slate-200/80 flex flex-col shrink-0 snap-start`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {stage.label}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                      {oppsInStage.length}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-600">
                    ${(stageValue / 1000000).toFixed(1)}M
                  </span>
                </div>

                {/* Cards List in Stage */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[620px]">
                  {oppsInStage.map((opp) => {
                    const isSelected = opp.id === activeOpportunity.id;

                    return (
                      <div
                        key={opp.id}
                        onClick={() => {
                          onSelectOpportunity(opp);
                          onNavigate('workspace');
                        }}
                        className={`p-3.5 rounded-xl border bg-white cursor-pointer transition-all shadow-2xs space-y-2.5 ${
                          isSelected
                            ? 'border-[#2563EB] ring-2 ring-[#2563EB]/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-0.5">
                            <span className="uppercase truncate">{opp.organization}</span>
                            <span className={`px-1.5 py-0.2 rounded font-bold border ${getScoreBadge(opp.overallScore)}`}>
                              {opp.overallScore} Fit
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                            {opp.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
                          <span className="font-bold text-slate-800">{opp.estimatedBudget}</span>
                          <span className="text-[10px] text-slate-400 font-sans">{opp.deadline}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-500 truncate max-w-[120px]">
                            {opp.assignedOwner.split(' ')[0]}
                          </span>

                          {/* Quick Stage Mover Selector (Touch-friendly minimum tap area) */}
                          <select
                            value={opp.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onUpdateOpportunityStage(opp.id, e.target.value as OpportunityStage)}
                            className="min-h-[36px] bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-700 py-1 px-2 focus:outline-none"
                          >
                            {stages.map((stg) => (
                              <option key={stg.id} value={stg.id}>
                                Move: {stg.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}

                  {oppsInStage.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      No active opportunities
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
