import React, { useState } from 'react';
import { CompanyCapabilityProfile } from '../types';
import { 
  Building2, 
  Award, 
  Layers, 
  Users, 
  CheckCircle2, 
  Sliders, 
  Cpu, 
  Save, 
  Check,
  ShieldCheck,
  Code2
} from 'lucide-react';
import { EnterprisePageId } from '../types';

interface CapabilityManagerProps {
  companyProfile: CompanyCapabilityProfile;
  onUpdateProfile: (updated: CompanyCapabilityProfile) => void;
  onNavigate: (page: EnterprisePageId) => void;
}

export const CapabilityManager: React.FC<CapabilityManagerProps> = ({
  companyProfile,
  onUpdateProfile,
  onNavigate
}) => {
  const [profile, setProfile] = useState<CompanyCapabilityProfile>(companyProfile);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleServiceLevelChange = (serviceIndex: number, newLevel: number) => {
    const updatedServices = [...profile.services];
    updatedServices[serviceIndex] = {
      ...updatedServices[serviceIndex],
      level: newLevel
    };

    const updatedProfile = {
      ...profile,
      services: updatedServices
    };

    setProfile(updatedProfile);
    onUpdateProfile(updatedProfile);
  };

  const handleSave = () => {
    onUpdateProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Organization Capability Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure verified core services, industry credentials, technical assets, and staffing competencies that drive opportunity matching.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Changes Saved!' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>

      {/* Organization Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Company Name & Positioning
            </label>
            <input
              type="text"
              value={profile.companyName}
              onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              className="w-full text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-2 mt-2 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Annual Invoiced Revenue
            </label>
            <input
              type="text"
              value={profile.annualRevenue}
              onChange={(e) => setProfile({ ...profile, annualRevenue: e.target.value })}
              className="w-full text-sm font-bold font-mono text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Delivery Staff Headcount
            </label>
            <input
              type="number"
              value={profile.teamSize}
              onChange={(e) => setProfile({ ...profile, teamSize: Number(e.target.value) })}
              className="w-full text-sm font-bold font-mono text-slate-900 bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Primary Target Industries */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Target Vertical Industries
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.primaryIndustries.map((ind, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Services & Delivery Capabilities with Sliders */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2563EB]" />
              <span>Core Service Competencies (Level 1–5 Scale)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proficiency levels directly determine opportunity matching scores and capability gap warnings.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Matching Synchronized
          </span>
        </div>

        <div className="space-y-3">
          {profile.services.map((svc, idx) => (
            <div key={svc.name} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    {svc.name}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {svc.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#2563EB]">
                      Level {svc.level}
                    </span>
                    <span className="text-xs text-slate-400"> / 5</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                    {svc.pastProjectsCount} Delivered Projects
                  </span>
                </div>
              </div>

              {/* Slider & Discrete Touch Targets */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                <div className="flex-1 flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">L1</span>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={svc.level}
                    onChange={(e) => handleServiceLevelChange(idx, Number(e.target.value))}
                    className="flex-1 accent-[#2563EB] cursor-pointer min-h-[36px]"
                  />
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">L5</span>
                </div>

                {/* Discrete Touch Tap Targets (1-5) */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleServiceLevelChange(idx, lvl)}
                      className={`min-h-[38px] min-w-[38px] rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                        svc.level === lvl
                          ? 'bg-[#2563EB] text-white shadow-2xs scale-105'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications & Compliance Credentials */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Certifications & Accreditations ({profile.certifications.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These accreditations serve as automatic compliance pass/fail filters for incoming tenders.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profile.certifications.map((cert, idx) => (
            <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  cert.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {cert.status}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Exp: {cert.validThrough}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">
                {cert.name}
              </div>
              <p className="text-[11px] text-slate-500">
                Issued by {cert.issuer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technologies & Team Expertise Two-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Technologies */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-[#2563EB]" />
            <span>Technology Stack & Frameworks</span>
          </h3>
          <div className="space-y-3">
            {profile.techStack.map((ts, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="font-bold text-slate-900">{ts.category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {ts.technologies.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 font-mono text-[11px] border border-slate-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Personnel */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#2563EB]" />
            <span>Key Personnel & Clearance Credentials</span>
          </h3>
          <div className="space-y-2">
            {profile.keyPersonnel.map((p, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{p.title} • {p.experienceYears} Years Exp</div>
                </div>
                {p.clearance && p.clearance !== 'None' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800">
                    {p.clearance}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Commercial</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
