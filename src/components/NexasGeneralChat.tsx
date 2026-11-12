import React, { useState, useRef, useEffect } from 'react';
import { EnterprisePageId } from '../types';
import { extractDocumentText } from '../services/storageService';
import { Sparkles, X, Send, ChevronRight, Paperclip } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  page?: EnterprisePageId;
}

interface NexasGeneralChatProps {
  companyName: string;
  onNavigate: (page: EnterprisePageId) => void;
  onOpenNewOpportunity: () => void;
}

/**
 * General-purpose Nexas assistant shown when there is no active opportunity
 * (e.g. brand-new accounts with an empty pipeline). It answers onboarding and
 * navigation questions and routes the user to the right screen.
 */
export const NexasGeneralChat: React.FC<NexasGeneralChatProps> = ({
  companyName,
  onNavigate,
  onOpenNewOpportunity
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'gen-init',
      sender: 'assistant',
      text: `Hi, I'm Nexas, your workspace assistant.\n\nAdd an opportunity to unlock scoring, risk analysis, and proposal drafting. What would you like to do?`,
      timestamp: 'Just now'
    }
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const reply = (query: string): ChatMessage => {
    const lower = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const base = { id: `gen-${Date.now()}`, sender: 'assistant' as const, timestamp: time };

    if (lower.includes('add') || lower.includes('opportunity') || lower.includes('upload') || lower.includes('document')) {
      return {
        ...base,
        text: 'To add an opportunity:\n\n1. Click **Add Opportunity** (or the **New Lead** button in the header).\n2. Upload a tender/RFP file or paste the text.\n3. Run the evaluation — I\'ll score the fit and draft a brief.',
        page: 'opportunities'
      };
    }
    if (lower.includes('company') || lower.includes('profile') || lower.includes('setup') || lower.includes('info')) {
      return {
        ...base,
        text: `Complete your company info so I can tailor analysis. Go to **Settings → My Company Info** to add your industry, team size, services, and goals.`,
        page: 'settings'
      };
    }
    if (lower.includes('who') || lower.includes('what is') || lower.includes('nexusiq')) {
      return {
        ...base,
        text: 'NexusIQ helps organizations know before they commit. It scores opportunities, surfaces risk, and drafts proposals from your capability profile.'
      };
    }
    if (lower.includes('risk') || lower.includes('fit') || lower.includes('score')) {
      return {
        ...base,
        text: 'Scoring, capability matching, and risk analysis appear once you add an opportunity and open its workspace.'
      };
    }
    return {
      ...base,
      text: 'I can help you add an opportunity, complete your company profile, or explain how scoring works. Try one of the suggestions below.'
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: `gen-user-${Date.now()}`, sender: 'user', text: query, timestamp: time }]);
    setInputMessage('');
    setTimeout(() => setMessages((prev) => [...prev, reply(query)]), 300);
  };

  const handleAttachFile = async (file: File) => {
    const text = await extractDocumentText(file);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages: ChatMessage[] = [
      {
        id: `gen-file-user-${Date.now()}`,
        sender: 'user',
        text: `📎 Attached: ${file.name}${text ? `\n\n${text.slice(0, 400)}` : ''}`,
        timestamp: time
      },
      {
        id: `gen-file-asst-${Date.now()}`,
        sender: 'assistant',
        text: text
          ? `I've received **${file.name}** and extracted its text. Add it as an opportunity to unlock scoring and risk analysis.`
          : `I've received **${file.name}**. This file type has no extractable text, but it is attached to our conversation.`,
        timestamp: time
      }
    ];
    setMessages((prev) => [...prev, ...newMessages]);
  };

  const quickPrompts = [
    'How do I add an opportunity?',
    'How do I complete my company profile?',
    'What is NexusIQ?'
  ];

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            isOpen
              ? 'bg-slate-800 text-white rotate-90 scale-95'
              : 'bg-[#0F172A] hover:bg-slate-800 text-white hover:scale-105 border border-slate-700/80'
          }`}
          aria-label={isOpen ? 'Close Nexas Assistant' : 'Open Nexas Assistant'}
          title="Nexas Assistant"
        >
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 flex h-3 w-3 sm:h-3.5 sm:w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 sm:h-3.5 sm:w-3.5 bg-emerald-500 border-2 border-[#0F172A]" />
            </span>
          )}
          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          ) : (
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#38BDF8] group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-[410px] sm:w-[410px] h-[520px] sm:h-[580px] max-h-[78vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 font-sans">
          <div className="bg-[#0F172A] p-4 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
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
                  {companyName || 'Your workspace'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Minimize assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-semibold text-slate-400">{msg.sender === 'user' ? 'You' : 'Nexas'}</span>
                  <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-[#2563EB] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  {msg.page && msg.sender === 'assistant' && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          if (msg.page) onNavigate(msg.page);
                          setIsOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-[11px] font-semibold flex items-center gap-1 transition-colors border border-blue-200"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Open</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="px-3 py-2 bg-white border-t border-slate-100 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 border border-slate-200 text-[10px] text-slate-600 font-medium transition-colors"
              >
                {prompt}
              </button>
            ))}
            <button
              onClick={() => {
                onOpenNewOpportunity();
                setIsOpen(false);
              }}
              className="whitespace-nowrap px-2.5 py-1 rounded-full bg-[#0F172A] text-white text-[10px] font-semibold"
            >
              + Add Opportunity
            </button>
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAttachFile(file);
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
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
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask Nexas how to get started..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] bg-slate-50 focus:bg-white transition-all"
            />
            <button
              onClick={() => handleSend()}
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