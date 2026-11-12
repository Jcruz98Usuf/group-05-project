import React, { useState } from 'react';
import { Opportunity, ProposalDocument, EnterprisePageId } from '../types';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  CheckCircle2, 
  FileDown,
  Layers,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldAlert,
  Info,
  Sliders,
  Eye,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle, 
  AlignmentType,
  ShadingType
} from 'docx';
import jsPDF from 'jspdf';

interface ProposalStudioProps {
  opportunity: Opportunity;
  onUpdateProposal: (updatedProposal: ProposalDocument) => void;
  onNavigate: (page: EnterprisePageId) => void;
  companyName?: string;
}

export const ProposalStudio: React.FC<ProposalStudioProps> = ({
  opportunity,
  onUpdateProposal,
  onNavigate,
  companyName = 'Apex Intelligence & Systems Group'
}) => {
  const [proposal, setProposal] = useState<ProposalDocument>(opportunity.proposal);
  const [activeSection, setActiveSection] = useState<keyof Omit<ProposalDocument, 'lastUpdated'>>('executiveSummary');
  const [copied, setCopied] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [includeMetadataHeader, setIncludeMetadataHeader] = useState<boolean>(true);

  const sections: { key: keyof Omit<ProposalDocument, 'lastUpdated'>; title: string; hint: string }[] = [
    { key: 'executiveSummary', title: '1. Executive Summary', hint: 'High-level business context, client objectives, and our strategic fit.' },
    { key: 'clientRequirements', title: '2. Client Requirements', hint: 'Core technical and operational requirements mapped from discovery.' },
    { key: 'recommendedSolution', title: '3. Recommended Solution', hint: 'Proposed architecture, methodology, and tech stack implementation.' },
    { key: 'deliverables', title: '4. Deliverables', hint: 'Milestones, work products, and concrete outcomes committed to client.' },
    { key: 'assumptions', title: '5. Assumptions', hint: 'Client resource access, data availability, and engagement scope bounds.' },
    { key: 'dependencies', title: '6. Dependencies', hint: 'Third-party APIs, client approvals, and environment prerequisites.' },
    { key: 'risks', title: '7. Risks & Mitigation', hint: 'Identified delivery and compliance risks with proactive mitigation.' },
    { key: 'openQuestions', title: '8. Open Questions', hint: 'Unresolved clarification items needed before commercial signing.' }
  ];

  const handleSectionTextChange = (text: string) => {
    const updated = {
      ...proposal,
      [activeSection]: text,
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };
    setProposal(updated);
    onUpdateProposal(updated);
  };

  const handleCopyClipboard = () => {
    const fullText = `# PROPOSAL BRIEF: ${opportunity.title}\nPrepared by: ${companyName}\nClient: ${opportunity.organization}\nBudget: ${opportunity.estimatedBudget}\nSubmission Due: ${opportunity.deadline}\nOpportunity Score: ${opportunity.overallScore}/100 (${opportunity.recommendation.toUpperCase()})\n\n` +
      sections.map(s => `## ${s.title}\n${proposal[s.key]}\n\n`).join('---\n\n');

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /**
   * Generates an enterprise-styled Microsoft Word (.docx) document
   */
  const handleExportDOCX = async () => {
    try {
      setIsExporting(true);
      setIsExportMenuOpen(false);
      setExportNotice('Formatting & generating styled Microsoft Word (.docx)...');

      const paragraphs: (Paragraph | Table)[] = [];

      // Title & Subtitle
      paragraphs.push(
        new Paragraph({
          text: opportunity.title.toUpperCase(),
          heading: HeadingLevel.TITLE,
          spacing: { before: 200, after: 120 },
        })
      );

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `PROPOSAL & COMMERCIAL RESPONSE BRIEF`, 
              bold: true, 
              color: '2563EB',
              size: 24 
            }),
          ],
          spacing: { after: 240 },
        })
      );

      // Metadata Table if enabled
      if (includeMetadataHeader) {
        const tableBorderNone = {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
          left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        };

        const metaTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: tableBorderNone,
                  shading: { fill: 'F8FAFC', type: ShadingType.SOLID, color: 'auto' },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'Client Organization: ', bold: true, color: '475569', size: 20 }),
                        new TextRun({ text: opportunity.organization, bold: true, color: '0F172A', size: 20 }),
                      ],
                      spacing: { before: 100, after: 60 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'Prepared By: ', bold: true, color: '475569', size: 20 }),
                        new TextRun({ text: companyName, color: '0F172A', size: 20 }),
                      ],
                      spacing: { after: 100 },
                    }),
                  ],
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  borders: tableBorderNone,
                  shading: { fill: 'F8FAFC', type: ShadingType.SOLID, color: 'auto' },
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'Estimated Budget: ', bold: true, color: '475569', size: 20 }),
                        new TextRun({ text: opportunity.estimatedBudget, bold: true, color: '2563EB', size: 20 }),
                      ],
                      spacing: { before: 100, after: 60 },
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: 'Submission Due: ', bold: true, color: '475569', size: 20 }),
                        new TextRun({ text: `${opportunity.deadline} (Fit: ${opportunity.overallScore}/100)`, color: '0F172A', size: 20 }),
                      ],
                      spacing: { after: 100 },
                    }),
                  ],
                }),
              ],
            }),
          ],
        });

        paragraphs.push(metaTable);
        paragraphs.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      }

      // Add each section with styled headings and structured body paragraphs
      sections.forEach((s) => {
        paragraphs.push(
          new Paragraph({
            text: s.title,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 120 },
          })
        );

        const contentLines = (proposal[s.key] || 'No information provided for this section.').split('\n');
        contentLines.forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ text: '  •  ', bold: true, color: '2563EB' }),
                  new TextRun({ text: trimmed.replace(/^[-•*]\s*/, '') })
                ],
                spacing: { after: 60 },
              })
            );
          } else if (trimmed.length > 0) {
            paragraphs.push(
              new Paragraph({
                children: [
                  new TextRun({ 
                    text: trimmed, 
                    color: '1E293B',
                    size: 22 
                  })
                ],
                spacing: { after: 100 },
              })
            );
          }
        });

        paragraphs.push(new Paragraph({ text: '', spacing: { after: 160 } }));
      });

      // Disclaimer footer
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ 
              text: `CONFIDENTIAL  |  Generated via NexusIQ  |  ${new Date().toLocaleDateString()}`,
              color: '94A3B8',
              size: 16,
              italics: true
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 300 }
        })
      );

      const doc = new Document({
        title: `Proposal - ${opportunity.title}`,
        description: `NexusIQ Generated Proposal for ${opportunity.organization}`,
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 1440, // 1 inch
                  right: 1440,
                  bottom: 1440,
                  left: 1440,
                },
              },
            },
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const sanitizedName = opportunity.organization.replace(/[^a-zA-Z0-9]/g, '_');
      a.download = `NexusIQ_Proposal_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsExporting(false);
      setExportNotice('Microsoft Word (.docx) document downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating .docx:', err);
      setIsExporting(false);
      setExportNotice('Failed to generate .docx. You can also export as PDF or copy to clipboard.');
      setTimeout(() => setExportNotice(null), 4000);
    }
  };

  /**
   * Generates a styled, executive PDF document using jsPDF
   */
  const handleExportPDF = () => {
    try {
      setIsExporting(true);
      setIsExportMenuOpen(false);
      setExportNotice('Rendering styled executive PDF with header & pagination...');

      const doc = new jsPDF({
        unit: 'pt',
        format: 'letter'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 45;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      // 1. Top Enterprise Header Bar
      doc.setFillColor(15, 23, 42); // #0F172A Deep Navy
      doc.rect(0, 0, pageWidth, 52, 'F');

      // Top bar brand & logo node mark
      doc.setFillColor(37, 99, 235); // Intelligence Blue
      doc.circle(margin + 8, 26, 7, 'F');
      doc.setFillColor(56, 189, 248); // Insight Cyan
      doc.circle(margin + 8, 26, 3.5, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      doc.text('NexusIQ', margin + 22, 30);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Opportunity-to-Proposal Platform', margin + 85, 30);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(56, 189, 248);
      doc.text('EXECUTIVE COMMERCIAL BRIEF', pageWidth - margin, 30, { align: 'right' });

      y = 78;

      // 2. Document Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      const titleLines = doc.splitTextToSize(opportunity.title, contentWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 20;

      // 3. Metadata Summary Card if enabled
      if (includeMetadataHeader) {
        y += 4;
        doc.setFillColor(248, 250, 252); // #F8FAFC
        doc.setDrawColor(226, 232, 240); // #E2E8F0
        doc.setLineWidth(1);
        doc.roundedRect(margin, y, contentWidth, 52, 6, 6, 'FD');

        const colWidth = contentWidth / 4;
        const metaY = y + 18;

        // Col 1: Client
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('CLIENT TARGET', margin + 12, metaY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(doc.splitTextToSize(opportunity.organization, colWidth - 16)[0], margin + 12, metaY + 14);

        // Col 2: Budget
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('ESTIMATED BUDGET', margin + colWidth + 8, metaY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(37, 99, 235);
        doc.text(opportunity.estimatedBudget, margin + colWidth + 8, metaY + 14);

        // Col 3: Deadline
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('SUBMISSION DUE', margin + colWidth * 2 + 8, metaY);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(opportunity.deadline, margin + colWidth * 2 + 8, metaY + 14);

        // Col 4: Score & Fit
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text('EVALUATION SCORE', margin + colWidth * 3 + 8, metaY);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        const fitColor = opportunity.overallScore >= 80 ? [16, 185, 129] : [245, 158, 11];
        doc.setTextColor(fitColor[0], fitColor[1], fitColor[2]);
        doc.text(`${opportunity.overallScore}/100 • ${opportunity.recommendation.toUpperCase()}`, margin + colWidth * 3 + 8, metaY + 14);

        y += 66;
      } else {
        y += 12;
      }

      // 4. Iterate Sections with Page-Break Detection
      sections.forEach((s) => {
        // Check if heading fits on page
        if (y > pageHeight - 110) {
          doc.addPage();
          y = margin + 15;
        }

        // Section Title Pill / Line
        doc.setFillColor(37, 99, 235);
        doc.rect(margin, y - 9, 3, 14, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.setTextColor(15, 23, 42);
        doc.text(s.title, margin + 9, y + 2);
        y += 18;

        // Content
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);

        const rawContent = proposal[s.key] || 'No content drafted for this section.';
        const paragraphs = rawContent.split('\n');

        paragraphs.forEach((pText) => {
          const trimmed = pText.trim();
          if (!trimmed) {
            y += 6;
            return;
          }

          const isBullet = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
          const cleanText = isBullet ? trimmed.replace(/^[-•*]\s*/, '') : trimmed;
          const textIndent = isBullet ? margin + 14 : margin;
          const textWidth = isBullet ? contentWidth - 14 : contentWidth;

          const lines = doc.splitTextToSize(cleanText, textWidth);

          lines.forEach((line: string, index: number) => {
            if (y > pageHeight - 55) {
              doc.addPage();
              y = margin + 15;
            }

            if (isBullet && index === 0) {
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(37, 99, 235);
              doc.text('•', margin + 4, y);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(51, 65, 85);
            }

            doc.text(line, textIndent, y);
            y += 13.5;
          });

          y += 3;
        });

        y += 14;
      });

      // 5. Add Professional Footers to all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.75);
        doc.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Confidential Proposal Brief • Prepared by ${companyName} • NexusIQ Verified`,
          margin,
          pageHeight - 20
        );

        doc.setFont('helvetica', 'bold');
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 20,
          { align: 'right' }
        );
      }

      const sanitizedName = opportunity.organization.replace(/[^a-zA-Z0-9]/g, '_');
      doc.save(`NexusIQ_Proposal_${sanitizedName}_${new Date().toISOString().slice(0, 10)}.pdf`);

      setIsExporting(false);
      setExportNotice('Enterprise PDF document generated and downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsExporting(false);
      setExportNotice('PDF generation error. Falling back to browser print dialog.');
      setTimeout(() => setExportNotice(null), 4000);
      window.print();
    }
  };

  /**
   * Generates a plain Markdown (.md) file download
   */
  const handleExportMarkdown = () => {
    try {
      setIsExportMenuOpen(false);
      const markdownContent = `# PROPOSAL BRIEF: ${opportunity.title}\n\n` +
        `**Client:** ${opportunity.organization}  \n` +
        `**Prepared By:** ${companyName}  \n` +
        `**Estimated Budget:** ${opportunity.estimatedBudget}  \n` +
        `**Submission Deadline:** ${opportunity.deadline}  \n` +
        `**NexusIQ Score:** ${opportunity.overallScore}/100 (${opportunity.recommendation.toUpperCase()})  \n\n` +
        `---\n\n` +
        sections.map(s => `## ${s.title}\n\n${proposal[s.key]}\n`).join('\n---\n\n');

      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Proposal-${opportunity.organization.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportNotice('Markdown (.md) file downloaded successfully!');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#2563EB] border border-blue-200 flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-[#2563EB]" />
              Proposal Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Client: {opportunity.organization}</span>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600">
              Score: {opportunity.overallScore}/100
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Proposal Document Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Draft the 8 proposal sections and export to DOCX, PDF, or Markdown.
          </p>
        </div>

        {/* Action Controls & Download Menu: Mobile-first wrap with 44px tap targets */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Quick Copy */}
          <button
            onClick={handleCopyClipboard}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs hover:bg-slate-50 active:bg-slate-100"
            title="Copy formatted proposal text to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span className="truncate">{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          {/* Download Word (.docx) Button */}
          <button
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="min-h-[44px] px-3.5 py-2 rounded-xl border border-blue-200 hover:border-blue-300 bg-blue-50/70 hover:bg-blue-100/70 text-xs font-bold text-[#2563EB] transition-colors flex items-center justify-center gap-1.5 shadow-2xs active:bg-blue-200/60"
            title="Download formatted Microsoft Word .docx document"
          >
            <FileDown className="w-4 h-4 text-[#2563EB]" />
            <span>.DOCX</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 active:bg-slate-900"
            title="Download executive formatted PDF document"
          >
            <Download className="w-4 h-4 text-[#38BDF8]" />
            <span>.PDF</span>
          </button>

          {/* More Export Formats Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="min-h-[44px] w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              title="More export options"
            >
              <Sliders className="w-4 h-4 text-slate-500" />
              <span className="sm:hidden font-medium">Formats</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 animate-in fade-in slide-in-from-top-1 text-xs">
                <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Export Options
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={handleExportDOCX}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <FileDown className="w-3.5 h-3.5 text-blue-600" />
                      Microsoft Word (.docx)
                    </span>
                    <span className="text-[10px] text-slate-400">DOCX</span>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-sky-600" />
                      Executive Report (.pdf)
                    </span>
                    <span className="text-[10px] text-slate-400">PDF</span>
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Raw Markdown (.md)
                    </span>
                    <span className="text-[10px] text-slate-400">MD</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      window.print();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between text-slate-700 font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      Print / System Dialog
                    </span>
                    <span className="text-[10px] text-slate-400">Print</span>
                  </button>
                </div>

                <div className="pt-2 mt-1 border-t border-slate-100 px-2">
                  <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={includeMetadataHeader}
                      onChange={(e) => setIncludeMetadataHeader(e.target.checked)}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>Include Cover Metadata Card</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Export notification alert */}
      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{exportNotice}</span>
          </div>
          {isExporting && (
            <span className="text-[11px] text-emerald-600 animate-pulse font-semibold">Processing...</span>
          )}
        </div>
      )}

      {/* Proposal Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1e293b] rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#38BDF8]">
              {opportunity.organization}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300">
              Budget: {opportunity.estimatedBudget}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-300">
              Due: {opportunity.deadline}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {opportunity.title}
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4" />
            <span>Download .PDF</span>
          </button>
          <button
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-white/20"
          >
            <FileDown className="w-4 h-4 text-[#38BDF8]" />
            <span>Download .DOCX</span>
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Section Selector Strip */}
      <div className="lg:hidden bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span>Active Section ({sections.findIndex(s => s.key === activeSection) + 1}/8)</span>
          <span className="text-[#2563EB] font-sans">Swipe to switch &rarr;</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {sections.map((s) => {
            const isSelected = activeSection === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 active:bg-slate-200'
                }`}
              >
                {s.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace: Outline on Left, Editor on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section Outline (Desktop: 4 cols) */}
        <div className="hidden lg:block lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Proposal Sections (8)
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              8/8 Complete
            </span>
          </div>

          <div className="space-y-1.5">
            {sections.map((s) => {
              const isSelected = activeSection === s.key;
              const charCount = (proposal[s.key] || '').length;

              return (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`w-full px-3 py-2.5 rounded-lg text-left transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/80 text-[#2563EB] border border-blue-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate">{s.title}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.hint}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {charCount > 50 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Section populated" />
                    )}
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 px-2 text-[11px] text-slate-500">
            <div className="flex items-center justify-between">
              <span>Prepared for:</span>
              <span className="font-semibold text-slate-700">{opportunity.organization}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Document Save:</span>
              <span className="font-mono text-slate-600">{proposal.lastUpdated}</span>
            </div>
          </div>

          {/* Quick Export Card */}
          <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#2563EB]" />
              Export Ready Proposal
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Generate native, client-ready files with standard corporate formatting and pagination.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full py-1.5 px-2 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3 text-sky-600" />
                <span>PDF Format</span>
              </button>
              <button
                onClick={handleExportDOCX}
                disabled={isExporting}
                className="w-full py-1.5 px-2 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <FileDown className="w-3 h-3 text-[#2563EB]" />
                <span>Word (.docx)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Editor Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4 min-h-[620px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  {sections.find(s => s.key === activeSection)?.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {sections.find(s => s.key === activeSection)?.hint}
                </p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{proposal[activeSection]?.length || 0} characters</span>
                <span>•</span>
                <span>{(proposal[activeSection]?.split(/\s+/).filter(Boolean).length || 0)} words</span>
              </div>
            </div>

            <div>
              <textarea
                rows={18}
                value={proposal[activeSection]}
                onChange={(e) => handleSectionTextChange(e.target.value)}
                placeholder="Draft or refine the proposal section content here..."
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] focus:bg-white transition-all resize-y shadow-inner"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Changes saved to active opportunity profile
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>Download .PDF</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleExportDOCX}
                disabled={isExporting}
                className="font-bold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download .DOCX &rarr;</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
