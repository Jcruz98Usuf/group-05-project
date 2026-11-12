import React, { useEffect, useRef, useState } from 'react';
import { Opportunity, CompanyCapabilityProfile, OpportunityDraft } from '../types';
import { aiService } from '../services/aiRouter';
import {
  uploadTenantDocument,
  isAcceptedFile,
  ACCEPTED_FILE_EXTENSIONS,
  UploadedDocument
} from '../services/storageService';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Briefcase,
  Trash2
} from 'lucide-react';

interface NewOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyProfile: CompanyCapabilityProfile;
  onOpportunityCreated: (opp: Opportunity) => void;
  initialDraft?: OpportunityDraft | null;
}

export const NewOpportunityModal: React.FC<NewOpportunityModalProps> = ({
  isOpen,
  onClose,
  companyProfile,
  onOpportunityCreated,
  initialDraft
}) => {
  const [documentName, setDocumentName] = useState('');
  const [rawText, setRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState('');
  const [progressPct, setProgressPct] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setDocumentName(initialDraft?.title ?? '');
    setRawText(initialDraft?.sourceText ?? '');
    setSelectedPreset(null);
    setAttachments([]);
    setUploadError('');
  }, [isOpen, initialDraft]);

  if (!isOpen) return null;

  const presets = [
    {
      id: 'transit',
      name: 'MTA Smart Transit IoT Telemetry Tender',
      budget: '$4.5M',
      client: 'Metropolitan Transportation Authority',
      docName: 'MTA-RFP-2026-Telematics-v2.pdf',
      text: `METROPOLITAN TRANSPORTATION AUTHORITY (MTA)
DEPARTMENT OF DIGITAL INFRASTRUCTURE & CAPITAL PROJECTS
REQUEST FOR PROPOSALS: RFP-2026-0881
PROJECT TITLE: Real-Time Fleet Telemetry & Predictive Analytics Lakehouse

1. EXECUTIVE OVERVIEW & OBJECTIVES
1.1 The Authority is soliciting competitive proposals from qualified enterprise software engineering vendors to modernize our real-time transit telemetry stack for 2,400 municipal hybrid and electric buses and 680 light-rail vehicles.
1.2 Budget: Board capital appropriation cap of $4,800,000 USD inclusive of software licenses, cloud architecture, and 12-month tier-3 operational support.
1.3 Liquidated Damages: $15,000 per business day penalty for unexcused schedule delays exceeding 30 calendar days past mutually agreed Phase milestones.
1.4 Performance: Ingestion engine must sustain 45,000 events/second at 99.99% availability with native GTFS-Realtime and SIRI support. Active SOC 2 Type II attestation mandatory. Evaluation Chair: Brenda Ramirez, Director of Transit Analytics.`
    },
    {
      id: 'health',
      name: 'Horizon Health Hospital Interoperability RFP',
      budget: '$3.0M',
      client: 'Horizon Health Alliance',
      docName: 'Horizon-Health-FHIR-RFP-2026.docx',
      text: `HORIZON HEALTH ALLIANCE
CLINICAL INFORMATICS & DIGITAL HEALTH INITIATIVE
RFP REFERENCE: HHA-2026-FHIR-04

1. STATEMENT OF NEED: Horizon Health Alliance operates 14 acute care hospitals and 82 outpatient clinics. We require an enterprise-grade clinical data exchange platform to securely aggregate electronic health records across Epic, Cerner, and Meditech.
2. TARGET CAPABILITIES: HL7 FHIR Release 4 standard with automated patient matching achieving >99.4% deduplication accuracy. Full HIPAA/HITECH compliance with BAA. Budget cap: $3,200,000. Project kickoff Q1 2027.`
    },
    {
      id: 'defense',
      name: 'Federal Mainframe COBOL Rewrite (NO-GO)',
      budget: '$8.5M',
      client: 'Defense Logistics Support Command',
      docName: 'DLSC-RFP-Mainframe-Modernization-2026.pdf',
      text: `DEFENSE LOGISTICS SUPPORT COMMAND (DLSC)
SOLICITATION: DLSC-2026-MF-0994
CLASSIFICATION: CUI // FEDCON
SECTION C - PERFORMANCE WORK STATEMENT: Contractor shall perform automated conversion of 4,200,000 lines of legacy COBOL/CICS inventory software on IBM z15 mainframes. Prime contractor must possess active Top Secret Facility Security Clearance (FCL) with approved SCIF processing capabilities at proposal submission. Non-negotiable. Contractor indemnifies the Government for any logistics routing failure with unlimited liability.`
    }
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setSelectedPreset(p.id);
    setDocumentName(p.docName);
    setRawText(p.text);
  };

  const ingestFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    const accepted = list.filter(isAcceptedFile);
    const rejected = list.length - accepted.length;
    setUploadError(rejected > 0 ? `${rejected} file(s) skipped (unsupported type).` : '');

    const uploaded: UploadedDocument[] = [];
    const texts: string[] = [];
    for (const file of accepted) {
      const doc = await uploadTenantDocument('draft', 'intake', file);
      uploaded.push(doc);
      if (doc.text) texts.push(doc.text);
    }

    if (uploaded.length) {
      setAttachments((prev) => [...prev, ...uploaded]);
      if (!documentName && uploaded[0]) setDocumentName(uploaded[0].name);
      if (texts.length) {
        setRawText((prev) => (prev.trim() ? `${prev}\n\n${texts.join('\n\n')}` : texts.join('\n\n')));
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!rawText.trim()) return;

    setIsAnalyzing(true);
    setProgressPct(15);
    setProgressStep('Ingesting document structure & tokenizing text...');

    try {
      const opp = await aiService.analyzeOpportunity(
        documentName || 'New-Opportunity-Intake.pdf',
        rawText,
        companyProfile,
        (step, pct) => {
          setProgressStep(step);
          setProgressPct(pct);
        }
      );

      if (attachments.length) {
        opp.attachments = attachments.map(({ text: _text, ...meta }) => meta);
      }

      setIsAnalyzing(false);
      onOpportunityCreated(opp);
      onClose();
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Intake New Business Opportunity
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a tender, procurement notice, discovery notes, or client email for evaluation.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Test Presets */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Quick-Load Real-World Scenarios
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                  selectedPreset === p.id
                    ? 'border-[#2563EB] bg-blue-50/70 text-[#2563EB] font-bold shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="font-bold truncate">{p.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{p.budget} • {p.client.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Document Upload (drag & drop) */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Upload Documents
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.length) ingestFiles(e.dataTransfer.files);
            }}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
              isDragging
                ? 'border-[#2563EB] bg-blue-50/60'
                : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_FILE_EXTENSIONS.join(',')}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) ingestFiles(e.target.files);
                e.target.value = '';
              }}
            />
            <UploadCloud className="w-6 h-6 text-[#2563EB] mx-auto" />
            <div className="text-xs font-semibold text-slate-700 mt-1">
              Drop files here or click to browse
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              PDF, DOCX, XLSX, CSV, TXT, PNG, JPG — text is extracted automatically
            </div>
          </div>

          {uploadError && <div className="text-[11px] text-rose-600">{uploadError}</div>}

          {attachments.length > 0 && (
            <div className="space-y-1.5">
              {attachments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-800 truncate">{a.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {(a.size / 1024).toFixed(1)} KB{a.text ? ' • text extracted' : ''}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAttachments((prev) => prev.filter((x) => x.id !== a.id));
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Details Form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Document Reference / Title
            </label>
            <input
              type="text"
              placeholder="e.g. City-Transit-RFP-2026.pdf or Discovery-Meeting-Notes.txt"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Document Text Content</span>
              <span className="text-[11px] font-mono text-slate-400">{rawText.length} characters</span>
            </div>
            <textarea
              rows={8}
              placeholder="Paste raw tender requirements, RFP text, email leads, or discovery notes here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Progress State */}
        {isAnalyzing && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-blue-900">
              <span className="flex items-center gap-2">
                <span className="animate-spin w-3.5 h-3.5 border-2 border-[#2563EB] border-t-transparent rounded-full" />
                {progressStep}
              </span>
              <span className="font-mono">{progressPct}%</span>
            </div>
            <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2563EB] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons: Mobile-first vertical stack on < 640px */}
        <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartAnalysis}
            disabled={isAnalyzing || !rawText.trim()}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 ${
              isAnalyzing || !rawText.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 text-white'
            }`}
          >
            <span>{isAnalyzing ? 'Evaluating Opportunity...' : 'Run Opportunity Evaluation'}</span>
            {!isAnalyzing && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
