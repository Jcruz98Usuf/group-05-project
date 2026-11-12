import React, { useState, useRef, useEffect } from 'react';
import { Opportunity, CompanyCapabilityProfile, ProposalDocument, EnterprisePageId } from '../types';
import { 
  MessageSquare, 
  X, 
  Minus, 
  Send, 
  Sparkles, 
  Bot, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'copy' | 'navigate_proposal' | 'insert_summary';
    payload?: string;
  };
}

interface NexasChatbotBubbleProps {
  activeOpportunity: Opportunity;
  companyProfile: CompanyCapabilityProfile;
  currentPage: EnterprisePageId;
  onNavigate: (page: EnterprisePageId) => void;
  onUpdateProposal?: (updated: ProposalDocument) => void;
}

export const NexasChatbotBubble: React.FC<NexasChatbotBubbleProps> = ({
  activeOpportunity,
  companyProfile,
  currentPage,
  onNavigate,
  onUpdateProposal
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTeaserDismissed, setIsTeaserDismissed] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const initialGreeting: ChatMessage = {
    id: 'msg-init-1',
    sender: 'assistant',
    text: `Hello! I'm Nexas, your Opportunity Intelligence Assistant.\n\nI have evaluated **${activeOpportunity.title}** for **${activeOpportunity.organization}**.\n\n• Fit Score: **${activeOpportunity.overallScore}/100**\n• Recommendation: **${activeOpportunity.recommendation.toUpperCase().replace('_', ' ')}**\n• Value: **${activeOpportunity.estimatedBudget}**\n\nHow can I help you refine this proposal, review risks, or check capability matches?`,
    timestamp: 'Just now',
    suggestedAction: {
      label: 'Draft Executive Summary Hook',
      actionType: 'copy',
      payload: `Our team brings proven enterprise capabilities in distributed architecture and predictive intelligence to guarantee sub-second performance for ${activeOpportunity.organization}.`
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Update initial message when active opportunity changes if chat was fresh
  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([
        {
          id: `msg-opp-${activeOpportunity.id}`,
          sender: 'assistant',
          text: `Context switched to **${activeOpportunity.title}** (${activeOpportunity.organization}).\n\nFit Score: **${activeOpportunity.overallScore}/100** • Recommendation: **${activeOpportunity.recommendation.toUpperCase().replace('_', ' ')}**.\n\nAsk me about win themes, requirement gaps, or proposal drafting!`,
          timestamp: 'Just now'
        }
      ]);
    }
  }, [activeOpportunity.id]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate intelligent enterprise response based on actual opportunity data
    setTimeout(() => {
      let reply = '';
      let action: ChatMessage['suggestedAction'] | undefined = undefined;
      const lower = query.toLowerCase();

      if (lower.includes('risk') || lower.includes('danger') || lower.includes('threat')) {
        const topRisks = activeOpportunity.risks.slice(0, 3);
        reply = `Here are the top evaluated risks for **${activeOpportunity.organization}**:\n\n` +
          topRisks.map((r, i) => `${i + 1}. **${r.title}** (${r.severity} severity)\n   Mitigation: ${r.mitigation}`).join('\n\n') +
          `\n\nWould you like me to add these mitigations directly to Section 7 of the Proposal Studio?`;
        action = {
          label: 'View in Proposal Studio',
          actionType: 'navigate_proposal'
        };
      } else if (lower.includes('executive summary') || lower.includes('hook') || lower.includes('win theme')) {
        reply = `Here is a high-impact Win Theme formulated for **${activeOpportunity.organization}**:\n\n"To support ${activeOpportunity.organization}'s mission, ${companyProfile.companyName} combines enterprise-grade data architecture with specialized ${companyProfile.services.slice(0, 2).map(s => s.name).join(' and ')}. Our verified compliance with ${companyProfile.certifications.slice(0, 2).join(' & ')} eliminates vendor risk and guarantees day-one operational continuity."\n\nYou can insert this directly into Section 1.`;
        action = {
          label: 'Insert into Executive Summary',
          actionType: 'insert_summary',
          payload: `To support ${activeOpportunity.organization}'s mission, ${companyProfile.companyName} combines enterprise-grade data architecture with specialized ${companyProfile.services.slice(0, 2).map(s => s.name).join(' and ')}. Our verified compliance with ${companyProfile.certifications.slice(0, 2).join(' & ')} eliminates vendor risk and guarantees day-one operational continuity.`
        };
      } else if (lower.includes('match') || lower.includes('capability') || lower.includes('fit') || lower.includes('gap')) {
        const matchCount = activeOpportunity.capabilities.filter(m => m.matchPercentage >= 80).length;
        const partialCount = activeOpportunity.capabilities.filter(m => m.matchPercentage < 80).length;
        reply = `Capability Match Breakdown for **${companyProfile.companyName}**:\n\n• **${matchCount} High Match Domains** (≥80% alignment): Strong alignment in core architecture & compliance.\n• **${partialCount} Moderate / Development Domains**: Review required for sub-contracting or staffing surge.\n\nOverall Alignment Score: **${activeOpportunity.overallScore}%** fit.`;
      } else if (lower.includes('bid') || lower.includes('pursue') || lower.includes('recommendation')) {
        const rec = activeOpportunity.recommendation;
        reply = `**Recommendation: ${rec.toUpperCase().replace('_', ' ')}**\n\n` +
          `Rationale: ${activeOpportunity.recommendationReason}\n\n` +
          `• Contract Ceiling: ${activeOpportunity.estimatedBudget}\n` +
          `• Due Date: ${activeOpportunity.deadline}\n` +
          `• Fit Probability: ${activeOpportunity.overallScore}%\n\nOur system advises committing proposal drafting resources for this engagement.`;
        action = {
          label: 'Open Proposal Studio',
          actionType: 'navigate_proposal'
        };
      } else if (lower.includes('download') || lower.includes('export') || lower.includes('pdf') || lower.includes('docx')) {
        reply = `You can export this complete proposal from the **Proposal Studio**!\n\nNexusIQ supports:\n1. **Native Styled .DOCX**: Formatted Microsoft Word document.\n2. **Enterprise .PDF**: Header banner, metadata summary card, and pagination.\n3. **Markdown (.md)**: Plain text copy.\n\nClick below to open the Proposal Studio and download your files.`;
        action = {
          label: 'Go to Proposal Studio',
          actionType: 'navigate_proposal'
        };
      } else {
        reply = `Based on our analysis of **${activeOpportunity.title}**:\n\n• The client is **${activeOpportunity.organization}** with an estimated budget of **${activeOpportunity.estimatedBudget}**.\n• We have identified **${activeOpportunity.requirements.length} formal requirements** and **${activeOpportunity.risks.length} key risks**.\n• The proposal draft in Proposal Studio currently has all 8 sections generated and ready for export to .DOCX or .PDF.`;
        action = {
          label: 'Review Proposal Draft',
          actionType: 'navigate_proposal'
        };
      }

      const botMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: action
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleActionClick = (action: ChatMessage['suggestedAction']) => {
    if (!action) return;

    if (action.actionType === 'copy' && action.payload) {
      navigator.clipboard.writeText(action.payload);
      setCopiedId('action-copied');
      setTimeout(() => setCopiedId(null), 2000);
    } else if (action.actionType === 'navigate_proposal') {
      onNavigate('proposal-studio');
    } else if (action.actionType === 'insert_summary' && action.payload && onUpdateProposal) {
      const updated = {
        ...activeOpportunity.proposal,
        executiveSummary: `${action.payload}\n\n${activeOpportunity.proposal.executiveSummary}`,
        lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
      onUpdateProposal(updated);
      setCopiedId('inserted');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const quickPrompts = [
    'Summarize top risks',
    'Draft Win Theme',
    'How is our capability fit?',
    'Bid vs. No-Bid advice',
    'How do I download the PDF/DOCX?'
  ];

  return (
    <>
      {/* Teaser pill before opening (like enterprise Intercom / Drift chat) */}
      {!isOpen && !isTeaserDismissed && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs bg-white rounded-xl shadow-xl border border-slate-200 p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Nexas Assistant</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTeaserDismissed(true);
                }}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="Dismiss hint"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
              Have questions about <strong>{activeOpportunity.organization}</strong> ({activeOpportunity.overallScore}/100 fit)? Ask me anything!
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="mt-1.5 text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Open Assistant</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Launcher Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsTeaserDismissed(true);
          }}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            isOpen 
              ? 'bg-slate-800 text-white rotate-90 scale-95' 
              : 'bg-[#0F172A] hover:bg-slate-800 text-white hover:scale-105 border border-slate-700/80 shadow-slate-900/30'
          }`}
          aria-label={isOpen ? 'Close Nexas AI Assistant' : 'Open Nexas AI Assistant'}
          title="Nexas — Opportunity Intelligence Assistant"
        >
          {/* Online green indicator dot */}
          {!isOpen && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0F172A]"></span>
            </span>
          )}

          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-[#0F172A] p-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Nexas Intelligence</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[210px]">
                  Context: {activeOpportunity.organization}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([initialGreeting]);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Minimize assistant"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context pill banner */}
          <div className="bg-slate-100/90 px-3.5 py-2 border-b border-slate-200 flex items-center justify-between text-[11px] shrink-0">
            <span className="text-slate-600 truncate max-w-[240px] font-medium">
              Opportunity: <strong className="text-slate-900">{activeOpportunity.title}</strong>
            </span>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              activeOpportunity.overallScore >= 80 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {activeOpportunity.overallScore}/100 • {activeOpportunity.recommendation.toUpperCase()}
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-semibold text-slate-400">
                      {isUser ? 'You' : 'Nexas'}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-[#2563EB] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}

                    {/* Action button inside message */}
                    {msg.suggestedAction && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handleActionClick(msg.suggestedAction)}
                          className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-semibold flex items-center gap-1 transition-colors border border-blue-200"
                        >
                          {copiedId === 'action-copied' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Copied!</span>
                            </>
                          ) : copiedId === 'inserted' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Inserted!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-[#2563EB]" />
                              <span>{msg.suggestedAction.label}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-xl border border-slate-200 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] text-slate-400 ml-1">Nexas analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions pills */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 border border-slate-200 text-[10px] text-slate-600 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Ask Nexas about ${activeOpportunity.organization}...`}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-40 text-white transition-colors shrink-0 shadow-2xs"
              title="Send message"
            >
              <Send className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          </div>

        </div>
      )}
    </>
  );
};
