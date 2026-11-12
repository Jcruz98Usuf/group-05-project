import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Building2, 
  Settings, 
  KanbanSquare, 
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface NavigationProps {
  currentPage: EnterprisePageId;
  onNavigate: (page: EnterprisePageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  totalOpportunitiesCount: number;
  qualifiedCount: number;
  onOpenNewOpportunityModal: () => void;
  companyName: string;
  onRerunOnboarding: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  totalOpportunitiesCount,
  qualifiedCount,
  onOpenNewOpportunityModal,
  companyName,
  onRerunOnboarding
}) => {
  const navItems = [
    {
      id: 'dashboard' as EnterprisePageId,
      label: 'Executive Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'opportunities' as EnterprisePageId,
      label: 'Opportunities',
      shortLabel: 'Opportunities',
      icon: Briefcase,
      badge: totalOpportunitiesCount > 0 ? `${totalOpportunitiesCount}` : null
    },
    {
      id: 'workspace' as EnterprisePageId,
      label: 'Opportunity Workspace',
      shortLabel: 'Workspace',
      icon: FolderKanban,
      badge: 'Active'
    },
    {
      id: 'proposal-studio' as EnterprisePageId,
      label: 'Proposal Studio',
      shortLabel: 'Proposal',
      icon: FileText,
      badge: null
    },
    {
      id: 'pipeline' as EnterprisePageId,
      label: 'Pipeline',
      shortLabel: 'Pipeline',
      icon: KanbanSquare,
      badge: qualifiedCount > 0 ? `${qualifiedCount} Qualified` : null
    },
    {
      id: 'capability-manager' as EnterprisePageId,
      label: 'Capability Manager',
      shortLabel: 'Capabilities',
      icon: Building2,
      badge: null
    },
    {
      id: 'settings' as EnterprisePageId,
      label: 'Settings',
      shortLabel: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 transition-all duration-200 select-none border-r border-slate-800 shadow-xl ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
              N
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-none">
                Nexus<span className="text-[#38BDF8]">IQ</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-normal mt-0.5">
                Know Before You Commit
              </div>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
        )}
      </div>

      {/* Quick Action Button */}
      <div className="p-3 border-b border-slate-800/80">
        <button
          onClick={onOpenNewOpportunityModal}
          className={`w-full py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="New Opportunity Intake"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>New Opportunity</span>}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-white/10 text-white font-semibold shadow-xs border-l-2 border-[#2563EB]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#38BDF8]' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-slate-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Organization Indicator in Footer */}
      {!isCollapsed && (
        <div className="p-3 mx-2 mb-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Configured Profile</span>
            <span className="text-[9px] text-[#38BDF8] font-mono">Active</span>
          </div>
          <div className="text-white font-semibold truncate">
            {companyName}
          </div>
          <button
            onClick={onRerunOnboarding}
            className="w-full text-left text-[11px] text-[#38BDF8] hover:text-cyan-300 font-medium pt-1 flex items-center justify-between"
          >
            <span>Meet Nexas Assistant</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}

      {/* Collapse/Expand Sidebar Toggle */}
      <div className="p-2 border-t border-slate-800 flex justify-end">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors w-full flex items-center justify-center"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
