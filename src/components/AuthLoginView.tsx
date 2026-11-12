import React, { useState } from 'react';
import { UserAccount } from '../types';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  Building2, 
  User, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
  FileCheck
} from 'lucide-react';
import loginHeroImage from '../assets/images/enterprise_intelligence_hero_1794474320258.jpg';

interface AuthLoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('sarah.jenkins@apexsystems.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [companyName, setCompanyName] = useState('Apex Intelligence & Systems Group');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onLoginSuccess({
        fullName: fullName || 'Sarah Jenkins',
        email: email || 'sarah.jenkins@apexsystems.com',
        companyName: companyName || 'Apex Intelligence & Systems Group',
        companyWebsite: 'https://apexsystems.example.com',
        companyDescription: 'We provide enterprise Power BI dashboards, distributed data lakehouse engineering, cloud software development, and AI intelligence services.',
        isOnboarded: true
      });
      setIsLoading(false);
    }, 400);
  };

  const handleDemoLogin = (profileType: 'executive' | 'bid_manager' | 'consultant') => {
    setIsLoading(true);
    setTimeout(() => {
      if (profileType === 'executive') {
        onLoginSuccess({
          fullName: 'Sarah Jenkins',
          email: 'sarah.jenkins@apexsystems.com',
          companyName: 'Apex Intelligence & Systems Group',
          companyWebsite: 'https://apexsystems.example.com',
          companyDescription: 'We provide enterprise Power BI executive dashboards, distributed data lakehouse engineering, cloud software development, predictive AI services, and digital transformation consulting.',
          isOnboarded: true
        });
      } else if (profileType === 'bid_manager') {
        onLoginSuccess({
          fullName: 'David Sterling',
          email: 'david.sterling@apexsystems.com',
          companyName: 'Apex Intelligence & Systems Group',
          companyWebsite: 'https://apexsystems.example.com',
          companyDescription: 'Enterprise consulting and RFP bid qualification practice.',
          isOnboarded: true
        });
      } else {
        onLoginSuccess({
          fullName: 'Elena Rostova',
          email: 'elena.rostova@apexsystems.com',
          companyName: 'Apex Intelligence & Systems Group',
          companyWebsite: 'https://apexsystems.example.com',
          companyDescription: 'Cloud data modernization and AI capabilities engineering.',
          isOnboarded: true
        });
      }
      setIsLoading(false);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center p-4 sm:p-6 lg:p-8 selection:bg-[#38BDF8]/20 selection:text-white font-sans">
      
      {/* Background radial glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-700/40">
        
        {/* Left Side: Business Visual & Brand Story (5 cols on lg) */}
        <div className="lg:col-span-5 relative bg-slate-900 text-white p-6 sm:p-10 flex flex-col justify-between overflow-hidden min-h-[380px] lg:min-h-[660px]">
          
          {/* Background Hero Image with Deep Enterprise Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={loginHeroImage} 
              alt="NexusIQ Enterprise Intelligence Room" 
              className="w-full h-full object-cover object-center transform scale-105 filter brightness-75 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]/50 backdrop-blur-[1px]" />
          </div>

          {/* Top Brand Identity */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold text-lg shadow-lg border border-blue-400/30">
                N
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Nexus<span className="text-[#38BDF8]">IQ</span>
                </span>
                <span className="block text-[10px] font-semibold tracking-widest uppercase text-slate-300">
                  Know Before You Commit
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-medium text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Opportunity-to-Proposal Intelligence</span>
            </div>
          </div>

          {/* Middle: Brief Description about NexusIQ */}
          <div className="relative z-10 my-6 sm:my-8 space-y-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Evaluate opportunities before investing your team's capital and time.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              NexusIQ ingests tenders, procurement notices, discovery transcripts, and business leads. 
              Our engine cross-examines client requirements against your team's verified capabilities, flags hidden risks with verbatim evidence citations, and generates proposal-ready response briefs.
            </p>

            {/* Business KPI Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60">
              <div className="bg-slate-800/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-xs sm:text-base font-bold text-white">$1.4B+</div>
                <div className="text-[10px] text-slate-400">Pipeline Screened</div>
              </div>
              <div className="bg-slate-800/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-xs sm:text-base font-bold text-[#38BDF8]">88%</div>
                <div className="text-[10px] text-slate-400">Win Rate Fit</div>
              </div>
              <div className="bg-slate-800/70 backdrop-blur-xs p-2.5 rounded-xl border border-slate-700/50">
                <div className="text-xs sm:text-base font-bold text-emerald-400">100%</div>
                <div className="text-[10px] text-slate-400">Traceable Evidence</div>
              </div>
            </div>
          </div>

          {/* Bottom Security / Trust Proof */}
          <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              SOC-2 Type II & ISO 27001
            </span>
            <span className="text-slate-500">Enterprise Edition v2.5</span>
          </div>

        </div>

        {/* Right Side: Clean Enterprise Sign In / Sign Up Form (7 cols on lg) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white text-slate-900">
          
          <div className="space-y-6">
            
            {/* Form Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {authMode === 'signin' ? 'Sign In to NexusIQ' : 'Create Enterprise Account'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {authMode === 'signin' 
                    ? 'Access your organization pipeline, capability matrix, and proposal studio.' 
                    : 'Configure your company profile and evaluate incoming leads.'}
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'signin'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    authMode === 'signup'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>

            {/* Quick Demo Access Callout (Instant Entry) */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Executive Demo Access</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Pre-configured with Apex Intelligence & Systems Group ($18.5M active pipeline).
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDemoLogin('executive')}
                disabled={isLoading}
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <span>Launch Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Enterprise Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {authMode === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company / Organization
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Apex Intelligence Group"
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Corporate Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-slate-900"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Security Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to registered email.')}
                      className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <span>Trust this enterprise device for 30 days</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <span>Authenticating Workspace...</span>
                ) : (
                  <>
                    <span>{authMode === 'signin' ? 'Sign In to Workspace' : 'Create Organization Workspace'}</span>
                    <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
                  </>
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider text-slate-400">
                <span className="bg-white px-3">or authenticate via SSO</span>
              </div>
            </div>

            {/* Enterprise SSO Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('executive')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <div className="w-4 h-4 rounded bg-[#0078D4] text-white flex items-center justify-center text-[10px] font-bold">M</div>
                <span>Microsoft Azure AD</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('executive')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <div className="w-4 h-4 rounded bg-[#4285F4] text-white flex items-center justify-center text-[10px] font-bold">G</div>
                <span>Google Workspace</span>
              </button>
            </div>

          </div>

          {/* Footer Terms */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <span>© 2026 NexusIQ Inc. All rights reserved.</span>
            <div className="flex items-center gap-3">
              <span className="hover:underline cursor-pointer">Security Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
