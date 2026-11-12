import React, { useState } from 'react';
import { CompanyCapabilityProfile, UserAccount } from '../types';
import { 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Globe, 
  Mail, 
  User, 
  Layers, 
  ShieldCheck, 
  Code2, 
  Briefcase,
  Cpu,
  RefreshCw
} from 'lucide-react';

interface OnboardingNexasProps {
  onCompleteOnboarding: (account: UserAccount, generatedProfile: CompanyCapabilityProfile) => void;
  initialProfile: CompanyCapabilityProfile;
}

export const OnboardingNexas: React.FC<OnboardingNexasProps> = ({
  onCompleteOnboarding,
  initialProfile
}) => {
  // Form State
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('sarah.jenkins@apexsystems.com');
  const [companyName, setCompanyName] = useState('Apex Intelligence & Systems Group');
  const [companyDescription, setCompanyDescription] = useState(
    'We provide enterprise Power BI executive dashboards, distributed data lakehouse engineering, cloud software development, predictive AI services, and digital transformation consulting.'
  );
  const [websiteUrl, setWebsiteUrl] = useState('https://apexsystems.example.com');

  // AI Extraction State
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionStep, setExtractionStep] = useState('');
  const [extractedProfile, setExtractedProfile] = useState<CompanyCapabilityProfile | null>(null);

  // Quick Preset Handlers
  const handleLoadSample = (preset: 'consulting' | 'healthcare' | 'fintech') => {
    if (preset === 'consulting') {
      setFullName('Marcus Vance');
      setEmail('m.vance@apexsystems.com');
      setCompanyName('Apex Intelligence & Systems Group');
      setCompanyDescription('We provide Power BI dashboards, business intelligence consulting, AI services, software development, Kafka streaming, and data engineering for enterprise and public sector clients.');
      setWebsiteUrl('https://apexsystems.example.com');
    } else if (preset === 'healthcare') {
      setFullName('Dr. Evelyn Reed');
      setEmail('evelyn.reed@horizonhealth.org');
      setCompanyName('Horizon Clinical Informatics');
      setCompanyDescription('We specialize in HL7 FHIR interoperability, clinical data warehouse engineering, HIPAA compliance infrastructure, EHR integration (Epic/Cerner), and hospital analytics.');
      setWebsiteUrl('https://horizonhealth.example.org');
    } else {
      setFullName('David K. Chen');
      setEmail('david.chen@vantagepay.io');
      setCompanyName('VantagePay Global Systems');
      setCompanyDescription('We build high-throughput Open Banking APIs, real-time transaction processing, sub-80ms fraud detection models, and PCI-DSS Level 1 cloud infrastructure.');
      setWebsiteUrl('https://vantagepay.example.io');
    }
  };

  const handleGenerateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !fullName.trim() || !email.trim()) return;

    setIsExtracting(true);
    setExtractionProgress(20);
    setExtractionStep('Nexas analyzing company mission and services...');
    await new Promise((r) => setTimeout(r, 450));

    setExtractionProgress(50);
    setExtractionStep('Extracting core capabilities and industry competencies...');
    await new Promise((r) => setTimeout(r, 500));

    setExtractionProgress(85);
    setExtractionStep('Synthesizing technical frameworks and delivery assets...');
    await new Promise((r) => setTimeout(r, 450));

    // Dynamic generation based on description text
    const text = companyDescription.toLowerCase();
    const hasHealthcare = text.includes('health') || text.includes('fhir') || text.includes('hipaa') || text.includes('hospital');
    const hasFintech = text.includes('fintech') || text.includes('payment') || text.includes('banking') || text.includes('fraud');

    let industries = [
      'Public Sector & Transit',
      'Healthcare & Life Sciences',
      'Financial Services & Fintech',
      'Enterprise SaaS'
    ];
    if (hasHealthcare) {
      industries = ['Healthcare & Life Sciences', 'Hospital Systems', 'Clinical Research', 'HealthTech'];
    } else if (hasFintech) {
      industries = ['Financial Services & Banking', 'Merchant Payments', 'Open Banking', 'E-Commerce'];
    }

    const generated: CompanyCapabilityProfile = {
      companyName: companyName.trim(),
      tagline: companyDescription.slice(0, 80) + '...',
      annualRevenue: initialProfile.annualRevenue || '$28.4M',
      teamSize: initialProfile.teamSize || 120,
      primaryIndustries: industries,
      services: [
        {
          name: 'Business Intelligence',
          level: text.includes('power bi') || text.includes('bi') || text.includes('dashboard') ? 5 : 4,
          description: 'Executive dashboards, Looker, Power BI, semantic reporting layers, and telemetry analytics.',
          pastProjectsCount: 42
        },
        {
          name: 'Data Engineering',
          level: text.includes('data engineering') || text.includes('kafka') || text.includes('lakehouse') ? 5 : 4,
          description: 'High-throughput stream processing, Apache Kafka, Snowflake lakehouses, and ETL data pipelines.',
          pastProjectsCount: 48
        },
        {
          name: 'Software Development',
          level: text.includes('software') || text.includes('api') || text.includes('microservice') ? 5 : 4,
          description: 'Cloud-native microservices, Next.js, Go, Python FastAPI, Kubernetes, and enterprise system integration.',
          pastProjectsCount: 65
        },
        {
          name: 'AI & Machine Learning',
          level: text.includes('ai') || text.includes('ml') || text.includes('predictive') ? 5 : 4,
          description: 'LLM orchestrations, RAG pipelines, time-series anomaly detection, and predictive maintenance.',
          pastProjectsCount: 34
        },
        {
          name: 'Consulting & Delivery',
          level: text.includes('consulting') || text.includes('transformation') ? 5 : 4,
          description: 'Digital transformation advisory, proposal governance, and agile delivery management.',
          pastProjectsCount: 55
        }
      ],
      certifications: [
        { name: 'ISO 27001 Information Security', issuer: 'BSI Global', validThrough: '2028-12-31', status: 'Active' },
        { name: 'SOC 2 Type II Compliance', issuer: 'AICPA Accredited', validThrough: '2027-08-30', status: 'Active' },
        { name: 'HIPAA Security & Privacy Attestation', issuer: 'HealthSec Assurance', validThrough: '2027-11-15', status: 'Active' },
        { name: 'AWS Premier Tier Partner', issuer: 'Amazon Web Services', validThrough: '2028-05-01', status: 'Active' }
      ],
      techStack: [
        { category: 'AI & Machine Learning', technologies: ['Gemini 2.5 Flash', 'PyTorch', 'Vector Search', 'vLLM'] },
        { category: 'Data & Streaming', technologies: ['Apache Kafka', 'Snowflake', 'Databricks', 'PostgreSQL', 'dbt'] },
        { category: 'Cloud Infrastructure', technologies: ['Kubernetes (EKS/GKE)', 'Terraform', 'Docker', 'Cloud Run'] },
        { category: 'Frontend & APIs', technologies: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'TailwindCSS'] }
      ],
      keyPersonnel: [
        { name: fullName.trim(), title: 'Head of Solutions & Capture', experienceYears: 15, clearance: 'Commercial' },
        { name: 'Marcus Vance', title: 'VP of AI Architecture', experienceYears: 16, clearance: 'Secret' },
        { name: 'David K. Chen', title: 'VP of Enterprise Delivery', experienceYears: 18, clearance: 'None' }
      ]
    };

    setExtractionProgress(100);
    setExtractionStep('Capability profile successfully generated by Nexas.');
    await new Promise((r) => setTimeout(r, 300));

    setExtractedProfile(generated);
    setIsExtracting(false);
  };

  const handleConfirmAndLaunch = () => {
    if (!extractedProfile) return;

    const account: UserAccount = {
      fullName: fullName.trim(),
      email: email.trim(),
      companyName: companyName.trim(),
      companyWebsite: websiteUrl.trim(),
      companyDescription: companyDescription.trim(),
      isOnboarded: true
    };

    onCompleteOnboarding(account, extractedProfile);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      
      {/* Top Brand Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs mb-3">
          <div className="w-6 h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
            N
          </div>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">
            Nexus<span className="text-[#2563EB]">IQ</span>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-medium">Enterprise Onboarding</span>
        </div>
      </div>

      {/* Main Center Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl max-w-2xl w-full p-6 sm:p-10 space-y-6">
        
        {/* Card Header: Meet Nexas */}
        <div className="text-center space-y-2 pb-5 border-b border-slate-100">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-[#2563EB] shadow-2xs">
            <Sparkles className="w-6 h-6 text-[#2563EB]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meet Nexas
          </h1>
          <p className="text-sm font-semibold text-[#2563EB]">
            Your Opportunity Intelligence Assistant
          </p>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Nexas helps configure NexusIQ for your organization and prepares the platform to evaluate opportunities based on your capabilities.
          </p>
        </div>

        {/* Quick Presets Bar */}
        {!extractedProfile && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Quick-Fill Sample Profiles</span>
              <span className="text-slate-400 font-normal lowercase">1-click test</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLoadSample('consulting')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
              >
                Apex Cloud & AI Systems
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('healthcare')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
              >
                Horizon Health Solutions
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('fintech')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs"
              >
                VantagePay Global
              </button>
            </div>
          </div>
        )}

        {/* Form Fields: Required & Optional */}
        {!extractedProfile ? (
          <form onSubmit={handleGenerateProfile} className="space-y-4">
            
            {/* Required: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Work Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.jenkins@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Required: Company Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Company / Organization Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Systems Group"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Optional: About Your Company */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>About Your Company (Services & Capabilities)</span>
                <span className="text-slate-400 text-[11px] font-normal">Optional</span>
              </div>
              <textarea
                rows={3}
                placeholder="Example: We provide Power BI dashboards, business intelligence consulting, AI services, software development and data engineering."
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Nexas analyzes this description to automatically extract your service domains, capabilities, and target industries.
              </span>
            </div>

            {/* Optional: Company Website URL */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Company Website URL</span>
                <span className="text-slate-400 text-[11px] font-normal">Optional</span>
              </div>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Designed to support future automated website analysis and capability extraction.
              </span>
            </div>

            {/* Extraction Progress Box */}
            {isExtracting && (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-blue-900">
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full" />
                    {extractionStep}
                  </span>
                  <span className="font-mono text-[#2563EB]">{extractionProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                    style={{ width: `${extractionProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isExtracting || !companyName.trim() || !fullName.trim() || !email.trim()}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 ${
                  isExtracting || !companyName.trim() || !fullName.trim() || !email.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-blue-600 text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isExtracting ? 'Nexas Extracting Profile...' : 'Generate Company Profile'}</span>
                {!isExtracting && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

          </form>
        ) : (
          /* Profile Generation Success Preview */
          <div className="space-y-5 animate-in fade-in">
            
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  Company Capability Profile Successfully Generated!
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Nexas extracted your competencies from your company profile. This profile will now drive real-time opportunity scoring and capability matching across all active tenders.
                </p>
              </div>
            </div>

            {/* Generated Profile Summary Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
              
              {/* Company Name */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Configured Organization
                </span>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {extractedProfile.companyName}
                </div>
                <div className="text-xs text-slate-500">
                  Representative: {fullName} ({email})
                </div>
              </div>

              {/* Capabilities */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Extracted Core Capabilities ({extractedProfile.services.length})
                </span>
                <div className="space-y-1.5">
                  {extractedProfile.services.map((svc) => (
                    <div key={svc.name} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{svc.name}</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#2563EB]">
                        Level {svc.level}/5
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Industries Served */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Industries Served ({extractedProfile.primaryIndustries.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedProfile.primaryIndustries.map((ind, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded text-xs font-medium bg-white text-slate-700 border border-slate-200">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Technology Areas */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Technology Areas & Frameworks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {extractedProfile.techStack.flatMap(ts => ts.technologies).slice(0, 8).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-200/70 text-slate-800">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Launch Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setExtractedProfile(null)}
                className="px-3.5 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
              >
                Modify Information
              </button>

              <button
                type="button"
                onClick={handleConfirmAndLaunch}
                className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <span>Launch NexusIQ Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Footer Assurance */}
      <div className="mt-4 text-center text-xs text-slate-400">
        Nexas Enterprise AI • Zero telemetry sharing • Configurable in Settings
      </div>

    </div>
  );
};
