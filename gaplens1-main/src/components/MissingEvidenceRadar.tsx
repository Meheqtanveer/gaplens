import React, { useState } from 'react';
import { 
  HelpCircle, 
  AlertCircle, 
  Copy, 
  Check, 
  MessageSquare, 
  Compass, 
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { InformationGap } from '../types/gaplens';

interface MissingEvidenceRadarProps {
  gaps: InformationGap[];
}

export const MissingEvidenceRadar: React.FC<MissingEvidenceRadarProps> = ({ gaps }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/50';
      case 'high':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/50';
      case 'medium':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50';
      default:
        return 'text-blue-400 bg-blue-950/60 border-blue-800/50';
    }
  };

  const renderFindingTypeBadge = (type?: string) => {
    switch (type) {
      case 'explicitly_missing_information':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold tracking-wider">
            Explicitly Missing Information
          </span>
        );
      case 'unanswered_question':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-950/80 text-blue-300 border border-blue-800/60 font-semibold tracking-wider">
            Unanswered Question
          </span>
        );
      case 'verified_contradiction':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-950/80 text-rose-300 border border-rose-800/60 font-semibold tracking-wider">
            Verified Contradiction
          </span>
        );
      case 'hypothetical_risk':
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-950/80 text-purple-300 border border-purple-800/60 font-semibold tracking-wider">
            Hypothetical Risk
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Missing Evidence Radar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies essential unstated conditions, omissions, and unaddressed questions that could invalidate assumptions.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology Explanatory Callout */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-200 block font-mono text-[11px] uppercase">
            Rigorous Omission Standard
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            GAPLENS scans the entire text corpus and only flags a topic as missing if the submitted documents
            contain no definitive answer. Unstated conditions are ranked by their potential to disrupt your decision.
          </p>
        </div>
      </div>

      {/* Gaps List */}
      <div className="space-y-4">
        {gaps.map((gap, idx) => (
          <div
            key={gap.id}
            className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors space-y-3.5 shadow-lg"
          >
            {/* Top Bar: Topic + Severity + FindingType */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-white">
                  Gap #{idx + 1} · {gap.topic}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getSeverityStyle(
                    gap.severity
                  )}`}
                >
                  {gap.severity} Severity
                </span>
                {renderFindingTypeBadge(gap.findingType)}
              </div>

              <span className="text-[11px] font-mono text-slate-400">
                Absence Type: {gap.absenceType.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {/* Exact Submitted Passage context */}
            {gap.exactSubmittedPassage && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                  Context Passage from Submitted Text
                </span>
                <p className="text-xs text-slate-300 font-mono italic leading-relaxed border-l-2 border-slate-700 pl-2.5">
                  &quot;{gap.exactSubmittedPassage}&quot;
                </p>
              </div>
            )}

            {/* The Unanswered Question */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-mono text-cyan-400 block font-semibold">
                Crucial Unaddressed Question
              </span>
              <p className="text-xs md:text-sm font-bold text-slate-100 leading-relaxed">
                &quot;{gap.unansweredQuestion}&quot;
              </p>
            </div>

            {/* Why Missing Fact Matters */}
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs space-y-1">
              <span className="font-semibold text-rose-300 block font-mono text-[10px] uppercase">
                Why This Missing Fact Matters to Your Decision
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {gap.reasonMissingMatters}
              </p>
            </div>

            {/* Where to Verify & Follow-up Prompt Generator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
              {/* Where to verify */}
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase">
                  <Building className="w-3 h-3 text-cyan-400" />
                  <span>Where to Verify This Fact</span>
                </span>
                <p className="text-slate-200 text-[11px] font-medium">
                  {gap.whereToVerify || 'Direct primary issuing office, regulator, or institutional bursar.'}
                </p>
              </div>

              {/* Inquiry Prompt to copy */}
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase">
                    <MessageSquare className="w-3 h-3 text-cyan-400" />
                    <span>Suggested Inquiry Directive</span>
                  </span>
                  <p className="text-cyan-300 font-mono text-[11px] truncate mt-0.5">
                    &quot;{gap.suggestedFollowUpPrompt}&quot;
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(gap.id, gap.suggestedFollowUpPrompt)}
                  className="self-end flex items-center gap-1 px-2.5 py-1 text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer mt-2"
                >
                  {copiedId === gap.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Question</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {gaps.length === 0 && (
          <div className="text-center py-8 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No critical information gaps or omissions found in the submitted sources.
          </div>
        )}
      </div>
    </div>
  );
};
