import React, { useState } from 'react';
import { CompanyCapabilityProfile, UserAccount } from '../types';
import { aiService, AIServiceSettings } from '../services/aiRouter';
import { EditCompanyInfo } from './EditCompanyInfo';
import { 
  Settings, 
  Building, 
  Cpu, 
  Sliders, 
  Bell, 
  ShieldCheck, 
  Check, 
  Save, 
  Lock,
  UserCheck
} from 'lucide-react';

interface SettingsViewProps {
  companyProfile: CompanyCapabilityProfile;
  onUpdateProfile: (updated: CompanyCapabilityProfile) => void;
  account: UserAccount;
  onSaveCompany: (account: UserAccount, profile: CompanyCapabilityProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companyProfile,
  onUpdateProfile,
  account,
  onSaveCompany
}) => {
  const [aiSettings, setAiSettings] = useState<AIServiceSettings>(aiService.getSettings());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [autoDisqualifyFatal, setAutoDisqualifyFatal] = useState<boolean>(true);
  const [auditRetentionDays, setAuditRetentionDays] = useState<number>(365);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);

  const handleSave = () => {
    aiService.updateSettings(aiSettings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System & Organization Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure organization preferences, AI provider routing, decision thresholds, and compliance audit retention.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save Settings'}</span>
        </button>
      </div>

      {/* My Company Info (Setup Intelligence editor + AI chat memory) */}
      <EditCompanyInfo account={account} profile={companyProfile} onSave={onSaveCompany} />

      {/* Section 1: Organization Details */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building className="w-4 h-4 text-[#2563EB]" />
          <span>Organization Details</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Company / Organization Legal Name</label>
            <input
              type="text"
              value={companyProfile.companyName}
              onChange={(e) => onUpdateProfile({ ...companyProfile, companyName: e.target.value })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Primary Enterprise Domain</label>
            <input
              type="text"
              defaultValue="apexsystems.com"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>
      </div>

      {/* Section 2: AI Provider Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2563EB]" />
            <span>AI Provider</span>
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Connected
          </span>
        </div>

        <p className="text-xs text-slate-500">
          NexusIQ abstracts LLM inference behind an enterprise service layer with automatic failover to prevent procurement workflow interruption.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Active AI Provider</label>
            <select
              value={aiSettings.selectedProvider}
              onChange={(e) => setAiSettings({ ...aiSettings, selectedProvider: e.target.value as any })}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value="Google Gemini 2.5 Flash">Google Gemini 2.5 Flash (Recommended)</option>
              <option value="Groq API (Llama 3.3)">Groq API (Llama 3.3 70B)</option>
              <option value="Ollama Local Fallback">Ollama / On-Premise Air-Gap Fallback</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Inference Temperature</label>
            <div className="flex items-center gap-3 mt-1.5">
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.05}
                value={aiSettings.temperature}
                onChange={(e) => setAiSettings({ ...aiSettings, temperature: Number(e.target.value) })}
                className="flex-1 accent-[#2563EB] cursor-pointer"
              />
              <span className="font-mono font-bold text-slate-800 text-xs w-10 text-right">
                {aiSettings.temperature}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Low temperature (0.1–0.2) enforces strict factuality and zero hallucinations.
            </span>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
            <input
              type="checkbox"
              checked={aiSettings.autoFailover}
              onChange={(e) => setAiSettings({ ...aiSettings, autoFailover: e.target.checked })}
              className="rounded accent-[#2563EB]"
            />
            <span className="font-medium">Enable Automated Fallover Routing if latency exceeds 1,200ms</span>
          </label>
        </div>
      </div>

      {/* Section 3: Decision Thresholds & System Configuration */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-[#2563EB]" />
          <span>Decision Support & Governance Rules</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Minimum Confidence Threshold ({confidenceThreshold}%)
            </label>
            <input
              type="range"
              min={60}
              max={95}
              step={5}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-[#2563EB] cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Claims with confidence below threshold are flagged for manual human verification.
            </span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Audit Trail Retention</label>
            <select
              value={auditRetentionDays}
              onChange={(e) => setAuditRetentionDays(Number(e.target.value))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            >
              <option value={90}>90 Days</option>
              <option value={180}>180 Days</option>
              <option value={365}>365 Days (1 Year - Recommended)</option>
              <option value={2555}>7 Years (Federal & Healthcare Mandate)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 space-y-2 text-xs text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoDisqualifyFatal}
              onChange={(e) => setAutoDisqualifyFatal(e.target.checked)}
              className="rounded accent-[#2563EB]"
            />
            <span className="font-medium">Automatically trigger DO NOT PURSUE upon detection of fatal gate compliance failures (e.g. missing security clearances)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="rounded accent-[#2563EB]"
            />
            <span className="font-medium">Send high-risk alert digest to Executive Bid Committee</span>
          </label>
        </div>
      </div>

    </div>
  );
};
