import React from 'react';
import { 
  GitCompare, 
  Clock, 
  Calendar, 
  ExternalLink, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Contradiction, OutdatedFlag } from '../types/gaplens';

interface ContradictionHunterProps {
  contradictions: Contradiction[];
  outdatedFlags: OutdatedFlag[];
}

export const ContradictionHunter: React.FC<ContradictionHunterProps> = ({
  contradictions,
  outdatedFlags,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Contradiction Hunter & Information Age Detector
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies conflicting claims across sources, reconciles chronological date decay, and flags unverified discrepancies.
            </p>
          </div>
        </div>
      </div>

      {/* Contradictions Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Cross-Source Inconsistencies ({contradictions.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            Distinguishes confirmed factual clashes from date decay
          </span>
        </div>

        {contradictions.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4 hover:border-slate-700 transition-colors shadow-lg"
          >
            {/* Header: Title and Rigorous Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  #{idx + 1} · {item.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {item.isDateDrivenDifference ? (
                  <span className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50 px-2.5 py-0.5 rounded font-medium">
                    Chronological Decay (Superseded Cycle)
                  </span>
                ) : item.isConfirmedConflict ? (
                  <span className="text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/50 px-2.5 py-0.5 rounded font-medium">
                    Confirmed Factual Contradiction
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-800/50 px-2.5 py-0.5 rounded font-medium">
                    Possible Conflict (Needs Primary Verification)
                  </span>
                )}

                <span className="text-[10px] font-mono text-slate-400">
                  Strength: {item.evidenceStrength.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Side-by-Side Dual Perspective Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Perspective A */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300 truncate max-w-[240px]">
                    Perspective A: {item.claimA.sourceTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.sourceDateA || item.claimA.dateReferenced || 'Date: Unknown'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.claimA.claimText}
                </p>

                <blockquote className="text-[11px] font-mono bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 text-slate-300 italic">
                  &quot;{item.claimA.verbatimQuote}&quot;
                </blockquote>

                {item.claimA.sourceUrl && (
                  <a
                    href={item.claimA.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate pt-1"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.claimA.sourceUrl}</span>
                  </a>
                )}
              </div>

              {/* Perspective B */}
              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 truncate max-w-[240px]">
                    Perspective B: {item.claimB.sourceTitle}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.sourceDateB || item.claimB.dateReferenced || 'Date: Unknown'}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {item.claimB.claimText}
                </p>

                <blockquote className="text-[11px] font-mono bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 text-slate-300 italic">
                  &quot;{item.claimB.verbatimQuote}&quot;
                </blockquote>

                {item.claimB.sourceUrl && (
                  <a
                    href={item.claimB.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-mono truncate pt-1"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.claimB.sourceUrl}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Reconciliation Analysis & Why It Matters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-slate-300 block font-mono text-[11px] uppercase">
                  Reconciliation Logic
                </span>
                <p className="text-slate-400 leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-rose-300 block font-mono text-[11px] uppercase">
                  Why This Discrepancy Matters to Your Decision
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {item.whyItMatters ||
                    'Acting on contradictory specifications without resolving which document governs leads to disqualification or unexpected expenses.'}
                </p>
              </div>
            </div>
          </div>
        ))}

        {contradictions.length === 0 && (
          <div className="text-center py-8 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-400 text-xs">
            No contradictory claims or conflicting statements detected in the provided corpus.
          </div>
        )}
      </div>

      {/* Information Age & Version Staleness Section */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Information Age, Version & Staleness Detector ({outdatedFlags.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Never assumes undated sources are invalid
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outdatedFlags.map((flag) => (
            <div
              key={flag.id}
              className="p-4 bg-purple-950/20 border border-purple-900/50 rounded-xl space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-200 truncate">{flag.sourceTitle}</span>
                <span className="text-[10px] font-mono text-purple-300 uppercase px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                  {flag.isDateUnknown ? 'Date Unspecified' : `Urgency: ${flag.urgency}`}
                </span>
              </div>

              <p className="text-xs text-purple-200/90 leading-relaxed">
                {flag.reason}
              </p>

              {flag.supersededBySourceTitle && (
                <div className="text-[11px] text-purple-300/80 font-mono pt-1 border-t border-purple-900/40">
                  Superseded by: {flag.supersededBySourceTitle}
                </div>
              )}

              <div className="text-[10px] text-slate-400 italic font-mono pt-1">
                Note: {flag.notAutomaticallyInvalidNotice}
              </div>
            </div>
          ))}

          {outdatedFlags.length === 0 && (
            <div className="text-xs text-slate-500 py-4">
              All submitted sources contain contemporary cycle timestamps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
