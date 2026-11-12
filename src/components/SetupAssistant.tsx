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

interface SetupAssistantProps {
  account: UserAccount;
  initialProfile?: CompanyCapabilityProfile;
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

export const SetupAssistant: React.FC<SetupAssistantProps> = ({
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
    <div className="min-h-screen w-full bg-[#0B1220] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-24 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Glass card */}
        <div className="nexas-glass rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 pt-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg">
                <Sparkles className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white tracking-tight">Run Setup Assistant</div>
                <div className="text-[11px] text-slate-300">Nexas workspace configuration</div>
              </div>
            </div>
            {mode === 'settings' && onExit && (
              <button
                onClick={onExit}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Close setup"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="px-6 sm:px-8 mt-5">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <div key={s.id} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        done ? 'bg-emerald-400' : active ? 'bg-[#38BDF8]' : 'bg-white/15'
                      }`}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <Icon className={`w-3 h-3 ${active ? 'text-[#38BDF8]' : done ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-medium truncate ${active ? 'text-white' : 'text-slate-400'}`}>
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
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {step === 0 && 'Tell us about your business'}
                  {step === 1 && 'Which industry do you operate in?'}
                  {step === 2 && 'How large is your team?'}
                  {step === 3 && 'What are your primary goals?'}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
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
                            ? 'bg-[#2563EB]/20 border-[#38BDF8]/60 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {t === 'enterprise' ? <Building2 className="w-4 h-4 shrink-0" /> : <User className="w-4 h-4 shrink-0" />}
                        <div>
                          <div className="text-xs font-semibold">{t === 'enterprise' ? 'Enterprise / Team' : 'Individual'}</div>
                          <div className="text-[10px] text-slate-400">{t === 'enterprise' ? 'Organization workspace' : 'Solo consultant'}</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Company / Organization Name</label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Analytics Group"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Website (optional)</label>
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://company.com"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]/60 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">About the business (optional)</label>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={3}
                      placeholder="What services do you provide? Which technologies do you use?"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]/60 transition-all resize-none"
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
                          ? 'bg-[#2563EB]/25 border-[#38BDF8]/60 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
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
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Team / fleet size</label>
                    <input
                      type="number"
                      min={1}
                      value={teamSize || ''}
                      onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
                      placeholder="e.g. 25"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/40 focus:border-[#38BDF8]/60 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">Your role</label>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          onClick={() => setRole(r)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                            role === r
                              ? 'bg-[#2563EB]/25 border-[#38BDF8]/60 text-white'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
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
                            ? 'bg-emerald-500/20 border-emerald-400/60 text-white'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
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
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-white/10 bg-white/5">
            <button
              onClick={() => setShowSkipConfirm(true)}
              className="text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              Skip for now
            </button>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/10 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}
              <button
                onClick={() => (isLast ? handleComplete() : setStep((s) => s + 1))}
                disabled={!canContinue}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg transition-all"
              >
                {isLast ? 'Finish Setup' : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500 mt-4">
          You can resume setup anytime from Settings.
        </p>
      </div>

      {/* Animated skip confirmation */}
      {showSkipConfirm && (
        <div
          className="nexas-overlay fixed inset-0 z-[60] bg-[#0B1220]/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowSkipConfirm(false)}
        >
          <div
            className="nexas-modal w-full max-w-md rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Skip setup for now?</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Completing setup lets the Nexas AI engine map your business structure, unlock tailored analytics, and automate your workspace configuration.
                  You can resume setup anytime from your dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={onSkip}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 border border-white/15 hover:bg-white/10 transition-colors"
              >
                Yes, Skip for Now
              </button>
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-lg transition-all"
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