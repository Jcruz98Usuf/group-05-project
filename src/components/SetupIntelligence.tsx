import React, { useMemo, useState } from 'react';
import {
  AccountType,
  CompanyCapabilityProfile,
  SetupAnswers,
  UserAccount
} from '../types';
import { buildCapabilityProfile } from '../services/nexasEngine';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  User,
  Globe,
  Users,
  Target,
  X,
  AlertTriangle
} from 'lucide-react';

interface SetupIntelligenceProps {
  account: UserAccount;
  mode?: 'onboarding' | 'settings';
  onComplete: (account: UserAccount, profile: CompanyCapabilityProfile, answers: SetupAnswers) => void;
  onSkip: () => void;
  onExit?: () => void;
}

const INDUSTRIES = [
  'Public Sector & Transit',
  'Healthcare & Life Sciences',
  'Financial Services & Banking',
  'Technology & SaaS',
  'Energy & Utilities',
  'Manufacturing',
  'Retail & E-Commerce',
  'Other'
];

const ROLES = ['Executive', 'Business Development', 'Bid / Proposal Manager', 'Consultant', 'Delivery Lead'];

const GOALS = [
  'Qualify leads faster',
  'Reduce wasted bid effort',
  'Improve win rate',
  'Automate proposal drafting',
  'Strengthen compliance & risk review',
  'Centralize pipeline reporting'
];

const STEPS = [
  { id: 'profile', label: 'Business Profile', icon: Building2 },
  { id: 'industry', label: 'Industry', icon: Globe },
  { id: 'team', label: 'Team Size', icon: Users },
  { id: 'goals', label: 'Goals', icon: Target }
];

export const SetupIntelligence: React.FC<SetupIntelligenceProps> = ({
  account,
  mode = 'onboarding',
  onComplete,
  onSkip,
  onExit
}) => {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>(account.accountType ?? 'enterprise');
  const [companyName, setCompanyName] = useState(account.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(account.companyWebsite || '');
  const [about, setAbout] = useState(account.companyDescription || '');
  const [industry, setIndustry] = useState(account.industry || '');
  const [teamSize, setTeamSize] = useState<number>(account.teamSize || 0);
  const [role, setRole] = useState(account.fullName ? 'Executive' : 'Executive');
  const [goals, setGoals] = useState<string[]>(account.goals || []);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const isLast = step === STEPS.length - 1;
  const canContinue = useMemo(() => {
    if (step === 0) return companyName.trim().length > 1;
    if (step === 1) return industry.trim().length > 0;
    if (step === 2) return teamSize > 0;
    return true;
  }, [step, companyName, industry, teamSize]);

  const toggleGoal = (goal: string) => {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const handleComplete = () => {
    const profile = buildCapabilityProfile({
      fullName: account.fullName,
      email: account.email,
      companyName: companyName.trim(),
      about: about.trim(),
      website: companyWebsite.trim(),
      teamSize: teamSize || undefined
    });

    const updatedAccount: UserAccount = {
      ...account,
      companyName: companyName.trim() || account.companyName,
      companyWebsite: companyWebsite.trim(),
      companyDescription: about.trim(),
      accountType,
      industry,
      teamSize,
      goals,
      isOnboarded: true
    };

    const answers: SetupAnswers = { accountType, industry, teamSize, goals };
    onComplete(updatedAccount, profile, answers);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#38BDF8]/20 selection:text-white font-sans">
      {/* Ambient background glow (matches sign-in screen) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-700/40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg border border-blue-400/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 tracking-tight">Setup Intelligence</div>
                <div className="text-[11px] text-slate-500">Nexas workspace configuration</div>
              </div>
            </div>
            {mode === 'settings' && onExit && (
              <button
                onClick={onExit}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close setup"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="px-6 sm:px-8 pt-5">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.id} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        done ? 'bg-emerald-500' : active ? 'bg-[#2563EB]' : 'bg-slate-200'
                      }`}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <Icon className={`w-3 h-3 ${active ? 'text-[#2563EB]' : done ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-medium truncate ${active ? 'text-slate-900' : 'text-slate-400'}`}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-6 min-h-[300px]">
            <div key={step} className="nexas-step space-y-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {step === 0 && 'Tell us about your business'}
                  {step === 1 && 'Which industry do you operate in?'}
                  {step === 2 && 'How large is your team?'}
                  {step === 3 && 'What are your primary goals?'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {step === 0 && 'This lets Nexas tailor capability matching and proposal generation to your organization.'}
                  {step === 1 && 'We use your sector to prioritize relevant opportunities and compliance requirements.'}
                  {step === 2 && 'Team size helps Nexas estimate delivery readiness and resourcing.'}
                  {step === 3 && 'Select everything that applies — you can refine these later in Settings.'}
                </p>
              </div>

              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {(['enterprise', 'individual'] as AccountType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setAccountType(t)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                          accountType === t
                            ? 'bg-blue-50/70 border-[#2563EB] text-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t === 'enterprise' ? (
                          <Building2 className={`w-4 h-4 shrink-0 ${accountType === t ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                        ) : (
                          <User className={`w-4 h-4 shrink-0 ${accountType === t ? 'text-[#2563EB]' : 'text-slate-400'}`} />
                        )}
                        <div>
                          <div className="text-xs font-semibold">{t === 'enterprise' ? 'Enterprise / Team' : 'Individual'}</div>
                          <div className="text-[10px] text-slate-500">{t === 'enterprise' ? 'Organization workspace' : 'Solo consultant'}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Company / Organization Name</label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Analytics Group"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Website (optional)</label>
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">About the business (optional)</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={3}
                      placeholder="What services do you provide? Which technologies do you use?"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        industry === ind
                          ? 'bg-blue-50/70 border-[#2563EB] text-[#2563EB]'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Team / fleet size</label>
                    <input
                      type="number"
                      min={1}
                      value={teamSize || ''}
                      onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">Your role</label>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                            role === r
                              ? 'bg-blue-50/70 border-[#2563EB] text-[#2563EB]'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => {
                    const active = goals.includes(g);
                    return (
                      <button
                        key={g}
                        onClick={() => toggleGoal(g)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                          active
                            ? 'bg-emerald-50/70 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {g}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/60">
            <button
              onClick={() => setShowSkipConfirm(true)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}
              <button
                onClick={() => (isLast ? handleComplete() : setStep((s) => s + 1))}
                disabled={!canContinue}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition-all"
              >
                {isLast ? 'Finish Setup' : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-4">
          You can complete this later in Settings, or Nexas will learn as you chat.
        </p>
      </div>

      {/* Skip confirmation modal (matches sign-in card theme) */}
      {showSkipConfirm && (
        <div
          className="nexas-overlay fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSkipConfirm(false)}
        >
          <div
            className="nexas-modal w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Skip setup for now?</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Completing setup lets the AI analyze your business structure and tailor insights to your organization.
                  If you skip, you can complete it later in Settings, or the AI will learn your business automatically through normal chats.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={onSkip}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Yes, Skip for Now
              </button>
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all"
              >
                Continue Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};