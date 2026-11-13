import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Opportunity, CompanyCapabilityProfile, ProposalDocument, EnterprisePageId, CompanyFacts, NexasChatMessage, OpportunityDraft } from '../types';
import { buildCapabilityMatch } from '../services/nexasEngine';
import { extractDocumentText } from '../services/storageService';
import { generateNexasChatReply, NexasChatReply } from '../services/nexasChat';
import { providerStatus } from '../services/aiProvider';
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
  Maximize2,
  Paperclip
} from 'lucide-react';

interface NexasChatbotBubbleProps {
  activeOpportunity: Opportunity | null;
  companyProfile: CompanyCapabilityProfile;
  messages: NexasChatMessage[];
  isOpen: boolean;
  onMessagesChange: (messages: NexasChatMessage[]) => void;
  onOpenChange: (isOpen: boolean) => void;
  onNavigate: (page: EnterprisePageId) => void;
  onUpdateProposal?: (updated: ProposalDocument) => void;
  onLearnFacts: (facts: CompanyFacts) => void;
  onReviewOpportunity: (draft: OpportunityDraft) => void;
}

export const NexasChatbotBubble: React.FC<NexasChatbotBubbleProps> = ({
  activeOpportunity,
  companyProfile,
  messages,
  isOpen,
  onMessagesChange,
  onOpenChange,
  onNavigate,
  onUpdateProposal,
  onLearnFacts,
  onReviewOpportunity
}) => {
  const [isTeaserDismissed, setIsTeaserDismissed] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatFileInputRef = useRef<HTMLInputElement>(null);

  const ai = providerStatus();
  const aiLabel = ai.gemini && ai.groq ? 'Gemini + Groq' : ai.gemini ? 'Gemini' : ai.groq ? 'Groq' : 'Demo mode';

  const initialGreeting = useMemo<NexasChatMessage>(() => activeOpportunity ? ({
    id: `msg-init-${activeOpportunity.id}`,
    sender: 'assistant',
    text: `Hi, I'm Nexas, your Opportunity-to-Proposal Intelligence Assistant.\n\nYou're reviewing **${activeOpportunity.title}** for **${activeOpportunity.organization}**.\n\n• Opportunity Score: **${activeOpportunity.overallScore}/100**\n• Recommendation: **${activeOpportunity.recommendation.toUpperCase().replace(/_/g, ' ')}**\n• Estimated Budget: **${activeOpportunity.estimatedBudget}**\n\nWhat would you like to do next?`,
    timestamp: 'Just now',
    suggestedAction: {
      label: 'Draft Executive Summary Hook',
      actionType: 'copy',
      payload: `Our team brings proven enterprise capabilities in distributed architecture and predictive intelligence to guarantee sub-second performance for ${activeOpportunity.organization}.`
    }
  }) : ({
    id: 'msg-init-general',
    sender: 'assistant',
    text: 'Hi, I’m Nexas, your business assistant. Ask me about your business or describe a possible new opportunity. I’ll ask before adding anything.',
    timestamp: 'Just now'
  }), [activeOpportunity]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!messages.length) onMessagesChange([initialGreeting]);
  }, [messages.length, onMessagesChange, initialGreeting]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, isTyping]);

  /** Deterministic, data-grounded reply used when no AI provider is configured. */
  const buildDeterministicReply = (query: string): { text: string; action?: NexasChatMessage['suggestedAction'] } => {
    if (!activeOpportunity) {
      return {
        text: 'I can help with general business questions and opportunity planning. Tell me a little more about what you need, and I’ll do my best to help.'
      };
    }

    let reply = '';
    let action: NexasChatMessage['suggestedAction'] | undefined = undefined;
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
      reply = `Here is a draft executive summary for **${activeOpportunity.organization}**:\n\n"To support ${activeOpportunity.organization}'s mission, ${companyProfile.companyName} combines enterprise-grade data architecture with specialized ${companyProfile.services.slice(0, 2).map(s => s.name).join(' and ')}. Our verified compliance with ${companyProfile.certifications.slice(0, 2).map(c => c.name).join(' & ')} reduces vendor risk and supports day-one operational continuity."\n\nYou can insert this directly into Section 1.`;
      action = {
        label: 'Insert into Executive Summary',
        actionType: 'insert_summary',
        payload: `To support ${activeOpportunity.organization}'s mission, ${companyProfile.companyName} combines enterprise-grade data architecture with specialized ${companyProfile.services.slice(0, 2).map(s => s.name).join(' and ')}. Our verified compliance with ${companyProfile.certifications.slice(0, 2).map(c => c.name).join(' & ')} eliminates vendor risk and guarantees day-one operational continuity.`
      };
    } else if (lower.includes('match') || lower.includes('capability') || lower.includes('fit') || lower.includes('gap')) {
      const cm = buildCapabilityMatch(activeOpportunity);
      const fmt = (arr: { domain: string; match_percentage: number }[]) =>
        arr.length ? arr.map((x) => `• ${x.domain} — ${x.match_percentage}%`).join('\n') : '• None';
      reply =
        `Capability Assessment for **${companyProfile.companyName}**:\n\n` +
        `**Matched (≥80%)**\n${fmt(cm.matched_capabilities)}\n\n` +
        `**Partial (50–79%)**\n${fmt(cm.partial_matches)}\n\n` +
        `**Gaps (<50%)**\n${fmt(cm.gaps)}\n\n` +
        `Overall capability match: **${cm.match_percentage}%**.`;
    } else if (lower.includes('bid') || lower.includes('pursue') || lower.includes('recommendation')) {
      const rec = activeOpportunity.recommendation;
      reply = `**Recommendation: ${rec.toUpperCase().replace(/_/g, ' ')}**\n\n` +
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
    } else if (lower.includes('next') || lower.includes('what should i do')) {
      const rec = activeOpportunity.recommendation;
      if (rec === 'do_not_pursue') {
        reply = `Recommended next step: **Do not pursue** this opportunity.\n\n${activeOpportunity.recommendationReason}\n\nYou can record the decision in the Pipeline or review the risks in the Workspace.`;
        action = { label: 'Open Workspace', actionType: 'navigate', page: 'workspace' };
      } else if (rec === 'investigate') {
        reply = `Recommended next step: **Investigate further** before committing.\n\n1. Review the open risks in the Workspace.\n2. Confirm capability gaps and staffing.\n3. Move the opportunity to Qualified in the Pipeline when ready.`;
        action = { label: 'Open Workspace', actionType: 'navigate', page: 'workspace' };
      } else {
        reply = `Recommended next step: **Proceed to proposal**.\n\n1. Review requirements in the Workspace.\n2. Draft the proposal in Proposal Studio.\n3. Export to DOCX or PDF when ready.`;
        action = { label: 'Open Proposal Studio', actionType: 'navigate_proposal' };
      }
    } else if (lower.includes('add') || lower.includes('upload') || lower.includes('new opportunity') || lower.includes('intake') || lower.includes('how do i')) {
      reply = `To evaluate a new opportunity:\n\n1. Click **New Lead** in the header (or **New Opportunity** in the sidebar).\n2. Paste the tender, RFP, or discovery notes — or choose a sample.\n3. Click **Run Opportunity Evaluation**.\n\nNexusIQ extracts the requirements, scores the fit, and drafts a proposal brief.`;
      action = { label: 'Go to Opportunities', actionType: 'navigate', page: 'opportunities' };
    } else {
      reply = 'I couldn’t get an AI response just now. Please try again in a moment; your message is still saved in this chat.';
    }

    return { text: reply, action };
  };

  const tryAiReply = (conversation: NexasChatMessage[]): Promise<NexasChatReply | null> =>
    generateNexasChatReply(conversation, companyProfile, activeOpportunity ?? undefined);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage.trim();
    if (!query || isTyping) return;

    const userMsg: NexasChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const conversation = [...(messages.length ? messages : [initialGreeting]), userMsg];
    onMessagesChange(conversation);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await tryAiReply(conversation);
      if (response?.companyFacts) onLearnFacts(response.companyFacts);
      const fallback = response ? null : buildDeterministicReply(query);
      const botMsg: NexasChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: response?.reply ?? fallback?.text ?? 'I couldn’t reach the AI service just now. Please try again in a moment; your message is still saved in this chat.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: response ? undefined : fallback?.action,
        opportunityDraft: response?.opportunityDraft
      };
      onMessagesChange([...conversation, botMsg]);
    } catch (error) {
      console.error('Opportunity chat request failed:', error);
      onMessagesChange([
        ...conversation,
        {
          id: `asst-error-${Date.now()}`,
          sender: 'assistant',
          text: 'I couldn’t reach the AI service just now. Please try again in a moment; your message is still saved in this chat.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAttachFile = async (file: File) => {
    try {
      const text = await extractDocumentText(file);
      if (!text.trim()) {
        onMessagesChange([
          ...messages,
          {
            id: `user-file-${Date.now()}`,
            sender: 'user',
            text: `Attached: ${file.name}. No readable text could be extracted.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        return;
      }
      await handleSendMessage(`Please review the attached document for this opportunity and answer based on its contents.\n\n${file.name}\n\n${text.slice(0, 12000)}`);
    } catch (error) {
      console.error('Could not read the opportunity document:', error);
      onMessagesChange([
        ...messages,
        {
          id: `user-file-error-${Date.now()}`,
          sender: 'assistant',
          text: `I couldn’t read ${file.name}. Please try another file or paste its text into the chat.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleActionClick = (action: NexasChatMessage['suggestedAction']) => {
    if (!action) return;

    if (action.actionType === 'copy' && action.payload) {
      navigator.clipboard.writeText(action.payload);
      setCopiedId('action-copied');
      setTimeout(() => setCopiedId(null), 2000);
    } else if (action.actionType === 'navigate_proposal') {
      onNavigate('proposal-studio');
    } else if (action.actionType === 'navigate' && action.page) {
      onNavigate(action.page);
    } else if (action.actionType === 'insert_summary' && action.payload && onUpdateProposal && activeOpportunity) {
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

  const opportunityPrompts = [
    'How do I add an opportunity?',
    'What should I do next?',
    'Summarize top risks',
    'How is our capability fit?',
    'How do I export the proposal?'
  ];
  const quickPrompts = activeOpportunity
    ? opportunityPrompts
    : ['Help me think through a business decision.', 'What information should I track for a new opportunity?'];

  return (
    <>
      {/* Teaser pill before opening (like enterprise Intercom / Drift chat) */}
      {!isOpen && !isTeaserDismissed && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-xs bg-white rounded-xl shadow-xl border border-slate-200 p-3 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
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
              {activeOpportunity
                ? <>Have questions about <strong>{activeOpportunity.organization}</strong> ({activeOpportunity.overallScore}/100 fit)? Ask me anything!</>
                : 'Ask a business question or tell me about an opportunity you’re considering.'}
            </p>
            <button
              onClick={() => onOpenChange(true)}
              className="mt-1.5 text-[11px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
            >
              <span>Open Assistant</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Launcher Button (Bottom Right) */}
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => {
            onOpenChange(!isOpen);
            setIsTeaserDismissed(true);
          }}
          className={`relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            isOpen 
              ? 'bg-slate-800 text-white rotate-90 scale-95' 
              : 'bg-[#0F172A] hover:bg-slate-800 text-white hover:scale-105 border border-slate-700/80 shadow-slate-900/30'
          }`}
          aria-label={isOpen ? 'Close Nexas Assistant' : 'Open Nexas Assistant'}
          title="Opportunity Assistant"
        >
          {/* Online green indicator dot */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500 border-2 border-[#0F172A]"></span>
            </span>
          )}

          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <div className="flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-[410px] sm:w-[410px] h-[520px] sm:h-[580px] max-h-[78vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          
          {/* Header */}
          <div className="bg-[#0F172A] p-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">Nexas Assistant</h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[210px]">
                  <span className={ai.configured ? 'text-emerald-400' : 'text-amber-400'}>{aiLabel}</span>
                  {' • '}
                  {activeOpportunity
                    ? `Opportunity: ${activeOpportunity.organization}`
                    : companyProfile.companyName || 'General business chat'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  onMessagesChange([initialGreeting]);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
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
              {activeOpportunity
                ? <>Opportunity: <strong className="text-slate-900">{activeOpportunity.title}</strong></>
                : <strong className="text-slate-900">General business chat</strong>}
            </span>
            {activeOpportunity && <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              activeOpportunity.overallScore >= 80 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {activeOpportunity.overallScore}/100 • {activeOpportunity.recommendation.toUpperCase()}
            </span>}
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

                    {msg.opportunityDraft && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <div className="font-semibold">{msg.opportunityDraft.title}</div>
                        <p className="mt-1 text-slate-600">Would you like to review and add this opportunity?</p>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              if (msg.opportunityDraft) onReviewOpportunity(msg.opportunityDraft);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-[11px] font-semibold"
                          >
                            Review &amp; add
                          </button>
                          <button
                            onClick={() => onMessagesChange(messages.map((message) =>
                              message.id === msg.id
                                ? { ...message, opportunityDraft: undefined, text: `${message.text}\n\nOkay, I won’t add it.` }
                                : message
                            ))}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-semibold"
                          >
                            Not now
                          </button>
                        </div>
                      </div>
                    )}

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
                onClick={() => void handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 border border-slate-200 text-[10px] text-slate-600 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              ref={chatFileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAttachFile(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => chatFileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#2563EB] hover:border-blue-200 transition-colors shrink-0"
              title="Attach a document"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void handleSendMessage();
              }}
              placeholder={activeOpportunity
                ? `Ask Nexas about ${activeOpportunity.organization} or your business...`
                : 'Ask a business question or describe an opportunity...'}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-all"
            />
            <button
              onClick={() => void handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
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
