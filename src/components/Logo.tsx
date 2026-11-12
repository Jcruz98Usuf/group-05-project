import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Connected Node Network Stylized 'N' */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#2563EB]/40 shadow-sm shadow-[#2563EB]/20 overflow-hidden`}>
        {/* Subtle background mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:6px_6px] opacity-20" />
        
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg">
          {/* Node Connections */}
          <line x1="8" y1="24" x2="8" y2="8" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="24" y2="24" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="24" y1="24" x2="24" y2="8" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="8" y1="8" x2="24" y2="8" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          <line x1="8" y1="24" x2="24" y2="24" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          
          {/* Intelligence Nodes */}
          <circle cx="8" cy="8" r="3" fill="#38BDF8" className="animate-pulse" />
          <circle cx="8" cy="24" r="3" fill="#2563EB" />
          <circle cx="24" cy="8" r="3" fill="#2563EB" />
          <circle cx="24" cy="24" r="3" fill="#38BDF8" className="animate-pulse" />
          <circle cx="16" cy="16" r="2.2" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-[#0F172A] ${textSizes[size]}`}>
            Nexus<span className="text-[#2563EB]">IQ</span>
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10">
            Enterprise
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium text-slate-500 tracking-normal mt-0.5">
            Know Before You Commit
          </span>
        )}
      </div>
    </div>
  );
};
