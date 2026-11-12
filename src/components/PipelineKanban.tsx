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
  ArrowRight
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

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Opportunity Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stage-by-stage progression tracking from initial intake through qualification, proposal, and contract award.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter cards..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          <button
            onClick={onOpenNewOpportunityModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake Lead</span>
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1720px]">
          {stages.map((stage) => {
            const oppsInStage = filtered.filter((o) => o.stage === stage.id);
            const stageValue = oppsInStage.reduce((sum, o) => sum + o.estimatedBudgetNumeric, 0);

            return (
              <div
                key={stage.id}
                className={`w-72 bg-slate-100/70 rounded-xl p-3 border-t-4 ${stage.color} border border-slate-200/80 flex flex-col shrink-0`}
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

                          {/* Quick Stage Mover Selector */}
                          <select
                            value={opp.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => onUpdateOpportunityStage(opp.id, e.target.value as OpportunityStage)}
                            className="bg-slate-50 border border-slate-200 rounded text-[10px] font-semibold text-slate-700 py-0.5 px-1.5 focus:outline-none"
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
