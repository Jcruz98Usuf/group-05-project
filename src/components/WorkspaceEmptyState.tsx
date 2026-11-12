import React from 'react';
import { UserAccount } from '../types';
import { Sparkles, Plus, ArrowRight, Building2, User, CheckCircle2, Circle } from 'lucide-react';

interface WorkspaceEmptyStateProps {
  account: UserAccount;
  onRunSetup: () => void;
  onAddOpportunity: () => void;
  onLoadDemo?: () => void;
}

export const WorkspaceEmptyState: React.FC<WorkspaceEmptyStateProps> = ({
  account,
  onRunSetup,
  onAddOpportunity,
  onLoadDemo
}) => {
  const isEnterprise = (account.accountType ?? 'enterprise') === 'enterprise';
  const displayName = account.companyName || account.fullName || 'your workspace';

  const steps = [
    {
      label: 'Run the setup assistant',
      detail: 'Capture your business profile, industry, and goals so Nexas can tailor analysis.',
      done: Boolean(account.industry && account.teamSize),
      action: onRunSetup,
      cta: 'Run setup'
    },
    {
      label: 'Add your first opportunity',
      detail: 'Upload a tender, RFP, or discovery notes to generate a scored assessment.',
      done: false,
      action: onAddOpportunity,
      cta: 'Add opportunity'
    },
    {
      label: 'Build your capability profile',
      detail: 'Confirm the services, certifications, and personnel Nexas should match against.',
      done: false,
      action: onRunSetup,
      cta: 'Review profile'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8">
      {/* Welcome header */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#0F172A] flex items-center justify-center shrink-0">
          {isEnterprise ? <Building2 className="w-5 h-5 text-[#38BDF8]" /> : <User className="w-5 h-5 text-[#38BDF8]" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Welcome to NexusIQ</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-[#2563EB] border border-blue-200">
              {isEnterprise ? 'Enterprise' : 'Individual'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {displayName} is ready. Complete a few steps to unlock opportunity analysis and proposal generation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Setup checklist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Get started</h2>
          <div className="space-y-3">
            {steps.map((s) => (
              <div key={s.label} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60">
                {s.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800">{s.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.detail}</div>
                </div>
                <button
                  onClick={s.action}
                  className="shrink-0 text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  {s.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-3">Quick actions</h2>
            <div className="space-y-2">
              <button
                onClick={onRunSetup}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                Run Setup Assistant
              </button>
              <button
                onClick={onAddOpportunity}
                className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4 text-[#2563EB]" />
                Add Opportunity
              </button>
            </div>
          </div>

          {onLoadDemo && (
            <div className="bg-slate-100/70 rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Want to explore with sample data? Load a demo workspace — it stays isolated to this account.
              </p>
              <button
                onClick={onLoadDemo}
                className="mt-2 text-[11px] font-semibold text-[#2563EB] hover:underline"
              >
                Load demo data
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};