import React, { useState } from 'react';
import { Opportunity, OpportunityStage, RiskLevel, RecommendationType } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown, 
  ExternalLink, 
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  activeOpportunity: Opportunity;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigate: (page: EnterprisePageId) => void;
  onOpenNewOpportunityModal: () => void;
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = ({
  opportunities,
  activeOpportunity,
  onSelectOpportunity,
  onNavigate,
  onOpenNewOpportunityModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'budget' | 'deadline' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter logic
  const filtered = opportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.assignedOwner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || opp.stage === statusFilter;
    const matchesRisk = riskFilter === 'All' || opp.riskLevel === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    let comp = 0;
    if (sortBy === 'score') comp = a.overallScore - b.overallScore;
    else if (sortBy === 'budget') comp = a.estimatedBudgetNumeric - b.estimatedBudgetNumeric;
    else if (sortBy === 'deadline') comp = a.deadline.localeCompare(b.deadline);
    else comp = a.title.localeCompare(b.title);
    return sortOrder === 'desc' ? -comp : comp;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (score >= 60) return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30';
    return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';
  };

  const getRecommendationBadge = (rec: RecommendationType) => {
    switch (rec) {
      case 'pursue':
        return <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PURSUE</span>;
      case 'investigate':
        return <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">INVESTIGATE</span>;
      case 'do_not_pursue':
        return <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">DO NOT PURSUE</span>;
    }
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'High':
        return <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">High Risk</span>;
      case 'Medium':
        return <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Medium</span>;
      case 'Low':
        return <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Opportunity Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Central repository for evaluating tenders, RFPs, and incoming leads with complete score breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewOpportunityModal}
            className="px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Intake Opportunity</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by opportunity name, client, industry, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="All">All Stages</option>
              <option value="new">New Intake</option>
              <option value="verification">Verification</option>
              <option value="discovery">Discovery</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Risk Level:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="All">All Risks</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="score">Opportunity Score</option>
              <option value="budget">Estimated Budget</option>
              <option value="deadline">Submission Deadline</option>
              <option value="name">Name</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Opportunity Name</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-3">Industry</th>
                <th className="py-3 px-3">Budget</th>
                <th className="py-3 px-3">Score</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Assigned Owner</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sorted.map((opp) => {
                const isSelected = opp.id === activeOpportunity.id;

                return (
                  <tr
                    key={opp.id}
                    onClick={() => {
                      onSelectOpportunity(opp);
                      onNavigate('workspace');
                    }}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 leading-snug">
                        {opp.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Due: {opp.deadline}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {opp.organization}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {opp.industry}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-800">
                      {opp.estimatedBudget}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getScoreBadge(opp.overallScore)}`}>
                          {opp.overallScore}/100
                        </span>
                        {getRecommendationBadge(opp.recommendation)}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {getRiskBadge(opp.riskLevel)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {opp.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[150px] font-medium">
                        {opp.assignedOwner}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectOpportunity(opp);
                          onNavigate('workspace');
                        }}
                        className="px-2.5 py-1 rounded bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-2xs transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {sorted.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No opportunities match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {sorted.length} of {opportunities.length} total opportunities</span>
          <span className="text-[11px]">NexusIQ Decision Support</span>
        </div>
      </div>

    </div>
  );
};
