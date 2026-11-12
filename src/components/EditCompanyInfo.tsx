import React, { useState } from 'react';
import { AccountType, CompanyCapabilityProfile, UserAccount } from '../types';
import { Building2, Globe, Users, Target, Sparkles, Check, Save } from 'lucide-react';

interface EditCompanyInfoProps {
  account: UserAccount;
  profile: CompanyCapabilityProfile;
  onSave: (account: UserAccount, profile: CompanyCapabilityProfile) => void;
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

const GOALS = [
  'Qualify leads faster',
  'Reduce wasted bid effort',
  'Improve win rate',
  'Automate proposal drafting',
  'Strengthen compliance & risk review',
  'Centralize pipeline reporting'
];

const LearnedBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-violet-50 text-violet-700 border border-violet-200">
    <Sparkles className="w-2.5 h-2.5" />
    Auto-learned from chat
  </span>
);

export const EditCompanyInfo: React.FC<EditCompanyInfoProps> = ({ account, profile, onSave }) => {
  const [companyName, setCompanyName] = useState(profile.companyName || account.companyName || '');
  const [companyWebsite, setCompanyWebsite] = useState(profile.companyWebsite || account.companyWebsite || '');
  const [about, setAbout] = useState(profile.about || account.companyDescription || '');
  const [industry, setIndustry] = useState(profile.industry || account.industry || '');
  const [teamSize, setTeamSize] = useState<number>(profile.teamSize || account.teamSize || 0);
  const [goals, setGoals] = useState<string[]>(profile.goals || account.goals || []);
  const [accountType, setAccountType] = useState<AccountType>(account.accountType ?? 'enterprise');
  const [saved, setSaved] = useState(false);

  const learned = new Set(profile.autoLearnedFields ?? []);
  const isLearned = (field: string) => learned.has(field);

  const toggleGoal = (goal: string) =>
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));

  const handleSave = () => {
    const updatedProfile: CompanyCapabilityProfile = {
      ...profile,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      about: about.trim(),
      tagline: profile.tagline || about.trim().slice(0, 80),
      industry,
      teamSize,
      goals,
      setupCompleted: true
    };
    const updatedAccount: UserAccount = {
      ...account,
      companyName: companyName.trim(),
      companyWebsite: companyWebsite.trim(),
      companyDescription: about.trim(),
      industry,
      teamSize,
      goals,
      accountType,
      isOnboarded: true
    };
    onSave(updatedAccount, updatedProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-5" id="company-info">
      <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-[#38BDF8]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900">My Company Info</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            View, edit, or complete your business profile at any time. Fields learned from chat are tagged.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all"
        >
          {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-[11px] font-bold text-slate-700">Company / Organization Name</label>
            {isLearned('companyName') && <LearnedBadge />}
          </div>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company name"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <label className="text-[11px] font-bold text-slate-700">Website</label>
            {isLearned('companyWebsite') && <LearnedBadge />}
          </div>
          <input
            value={companyWebsite}
            onChange={(e) => setCompanyWebsite(e.target.value)}
            placeholder="https://company.com"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-[11px] font-bold text-slate-700">About the business</label>
          {isLearned('about') && <LearnedBadge />}
        </div>
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          rows={3}
          placeholder="What services do you provide? Which technologies do you use?"
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-[11px] font-bold text-slate-700">Industry</label>
            {isLearned('industry') && <LearnedBadge />}
          </div>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          >
            <option value="">Select industry…</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-[11px] font-bold text-slate-700">Team size</label>
            {isLearned('teamSize') && <LearnedBadge />}
          </div>
          <input
            type="number"
            min={0}
            value={teamSize || ''}
            onChange={(e) => setTeamSize(parseInt(e.target.value, 10) || 0)}
            placeholder="e.g. 25"
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Target className="w-3.5 h-3.5 text-slate-400" />
          <label className="text-[11px] font-bold text-slate-700">Primary goals</label>
          {isLearned('goals') && <LearnedBadge />}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {GOALS.map((g) => {
            const active = goals.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGoal(g)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                  active
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {active && <Check className="w-3 h-3" />}
                {g}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-bold text-slate-700">Account type</span>
        <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg">
          {(['enterprise', 'individual'] as AccountType[]).map((t) => (
            <button
              key={t}
              onClick={() => setAccountType(t)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                accountType === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              {t === 'enterprise' ? 'Enterprise' : 'Individual'}
            </button>
          ))}
        </div>
      </div>

      {profile.aiLearnedContext && profile.aiLearnedContext.length > 0 && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[11px] font-bold text-slate-700">Learned context</span>
          </div>
          <ul className="space-y-1">
            {profile.aiLearnedContext.slice(-6).map((c, i) => (
              <li key={i} className="text-[11px] text-slate-500 flex items-start gap-1.5">
                <span className="text-violet-400 mt-0.5">•</span>
                <span className="truncate">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};