import React, { useState } from 'react';
import { Opportunity, UserAccount } from '../types';
import { 
  ChevronDown, 
  Search, 
  Plus, 
  HelpCircle, 
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen
} from 'lucide-react';

interface HeaderProps {
  opportunities: Opportunity[];
  activeOpportunity: Opportunity;
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenNewOpportunityModal: () => void;
  onOpenDocumentationModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userAccount?: UserAccount;
}

export const Header: React.FC<HeaderProps> = ({
  opportunities,
  activeOpportunity,
  onSelectOpportunity,
  onOpenNewOpportunityModal,
  onOpenDocumentationModal,
  searchQuery,
  onSearchChange,
  userAccount
}) => {
  const [showOppDropdown, setShowOppDropdown] = useState(false);

  const getScoreColor = (score: number) => {
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
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Active Opportunity Selector */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowOppDropdown(!showOppDropdown)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left max-w-md"
              title="Click to switch active opportunity"
            >
              <div className="flex flex-col truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Opportunity
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {activeOpportunity.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 pl-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getScoreColor(activeOpportunity.overallScore)}`}>
                  {activeOpportunity.overallScore}/100
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showOppDropdown && (
              <div className="absolute left-0 mt-1.5 w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Opportunities ({opportunities.length})</span>
                  <span className="text-[10px] lowercase font-normal">switch view</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {opportunities.map((opp) => (
                    <button
                      key={opp.id}
                      onClick={() => {
                        onSelectOpportunity(opp);
                        setShowOppDropdown(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left flex items-start justify-between gap-2 transition-colors ${
                        opp.id === activeOpportunity.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {opp.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          {opp.organization} • {opp.estimatedBudget}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getScoreColor(opp.overallScore)}`}>
                          {opp.overallScore}
                        </span>
                        <div className="mt-1">{getRecommendationBadge(opp.recommendation)}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => {
                      setShowOppDropdown(false);
                      onOpenNewOpportunityModal();
                    }}
                    className="w-full py-1.5 px-3 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Intake New Opportunity
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Clean Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-sm relative mx-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search opportunities, requirements, risks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
          />
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Architecture / Design Docs Reference */}
          <button
            onClick={onOpenDocumentationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            title="System Specifications & Methodology Blueprint"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Product Blueprint</span>
          </button>

          {/* New Opportunity CTA */}
          <button
            onClick={onOpenNewOpportunityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>New Lead</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {userAccount?.fullName
                ? userAccount.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                : 'SJ'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-none truncate max-w-[140px]">
                {userAccount?.fullName || 'Sarah Jenkins'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                {userAccount?.email || 'Strategy Lead'}
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
