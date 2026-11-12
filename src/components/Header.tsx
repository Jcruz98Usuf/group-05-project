import React, { useState } from 'react';
import { Opportunity, UserAccount, EnterprisePageId } from '../types';
import { 
  ChevronDown, 
  Search, 
  Plus, 
  BookOpen,
  ArrowLeft,
  Menu,
  LogOut,
  Sparkles,
  User,
  Settings,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  opportunities: Opportunity[];
  activeOpportunity: Opportunity | null;
  onSelectOpportunity: (opp: Opportunity) => void;
  onOpenNewOpportunityModal: () => void;
  onOpenDocumentationModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userAccount?: UserAccount;
  currentPage: EnterprisePageId;
  canGoBack: boolean;
  onGoBack: () => void;
  onOpenMobileNav: () => void;
  onLogout: () => void;
  onNavigate: (page: EnterprisePageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  opportunities,
  activeOpportunity,
  onSelectOpportunity,
  onOpenNewOpportunityModal,
  onOpenDocumentationModal,
  searchQuery,
  onSearchChange,
  userAccount,
  currentPage,
  canGoBack,
  onGoBack,
  onOpenMobileNav,
  onLogout,
  onNavigate
}) => {
  const [showOppDropdown, setShowOppDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30';
    if (score >= 60) return 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30';
    return 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30';
  };

  const getRecommendationBadge = (rec: Opportunity['recommendation']) => {
    switch (rec) {
      case 'pursue':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">PURSUE</span>;
      case 'investigate':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">INVESTIGATE</span>;
      case 'do_not_pursue':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">DO NOT PURSUE</span>;
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Mobile Hamburger Menu + Back Button + Active Opportunity Selector */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={onOpenMobileNav}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors lg:hidden shrink-0"
            title="Open navigation menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Previous Page / Back Button */}
          {canGoBack && (
            <button
              onClick={onGoBack}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
              title="Return to previous page"
              aria-label="Go to previous page"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {/* Active Opportunity Switcher */}
          <div className="relative min-w-0">
            <button
              onClick={() => setShowOppDropdown(!showOppDropdown)}
              className="flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left max-w-[170px] sm:max-w-xs md:max-w-md shrink"
              title="Click to switch active opportunity"
            >
              <div className="flex flex-col min-w-0 truncate">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  Active Opportunity
                </span>
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {activeOpportunity?.title ?? 'No active opportunity'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                {activeOpportunity && (
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold border ${getScoreColor(activeOpportunity.overallScore)}`}>
                    {activeOpportunity.overallScore}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            {/* Dropdown Menu */}
            {showOppDropdown && (
              <div className="absolute left-0 mt-1.5 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
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
                        opp.id === activeOpportunity?.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
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
                    className="w-full py-1.5 px-3 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Intake New Opportunity
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar (Desktop only) */}
        <div className="hidden lg:flex items-center flex-1 max-w-xs xl:max-w-sm relative mx-2">
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
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Blueprint Specs Modal */}
          <button
            onClick={onOpenDocumentationModal}
            className="hidden md:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            title="System Specifications & Methodology Blueprint"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden xl:inline">Product Blueprint</span>
          </button>

          {/* New Opportunity CTA */}
          <button
            onClick={onOpenNewOpportunityModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
            title="Intake new tender or lead"
          >
            <Plus className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">New Lead</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Menu with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left"
              title="User profile and organization menu"
            >
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                {userAccount?.fullName
                  ? userAccount.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : 'SJ'}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">
                  {userAccount?.fullName || 'Sarah Jenkins'}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                  {userAccount?.companyName || 'Apex Intelligence'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-xs truncate">
                    {userAccount?.fullName || 'Sarah Jenkins'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userAccount?.email || 'sarah.jenkins@apexsystems.com'}
                  </div>
                  <div className="mt-1 px-1.5 py-0.5 rounded bg-blue-50 text-[#2563EB] text-[10px] font-semibold w-fit">
                    {userAccount?.companyName || 'Apex Intelligence Group'}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onNavigate('settings');
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Company Info</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenDocumentationModal();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium md:hidden"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>Product Blueprint</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
