import { 
  FileText, 
  Layers, 
  GitCompare, 
  HelpCircle, 
  Clock, 
  CheckSquare, 
  ShieldAlert, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Info,
  Landmark,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { GapLensAnalysisResult } from '../types/gaplens';

interface DashboardOverviewProps {
  data: GapLensAnalysisResult;
  onNavigateTab: (tabId: string) => void;
  onLoadExample?: (exampleKey: 'education' | 'banking_and_finance' | 'employment_and_jobs' | 'insurance') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  data,
  onNavigateTab,
  onLoadExample,
}) => {
  const { 
    summary, 
    researchGoal, 
    contradictions, 
    gaps, 
    outdatedFlags, 
    decisionFlipScenarios, 
    verificationChecklist,
    isSampleData,
    sampleLabel,
    engineUsed
  } = data;

  // Workspace Ready State (When no benchmark or analysis is loaded)
  if (summary.sourcesAnalyzedCount === 0) {
    return (
      <div className="space-y-8">
        {/* Universal Hero Banner */}
        <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-400 text-slate-950 font-bold tracking-wider">
                Hackathon 2026 Innovation
              </span>
              <span className="text-xs font-mono text-cyan-300">
                Problem Statement: DIGITAL DARK SPOT
              </span>
              <span className="text-xs text-slate-500">·</span>
              <span className="text-xs font-mono text-emerald-400">
                General-Purpose Multi-Domain Engine
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              GAPLENS – The Decision Blind-Spot Detector
            </h1>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Standard AI summarizers only recite what is written. <strong className="text-white">GAPLENS</strong> cross-examines multiple sources to identify <strong className="text-cyan-300">what is missing, conflicting, outdated, or unstated</strong> in contracts, advertisements, and policy notices before you commit.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Signature Feature: The Decision Flip Test</span>
              </span>
              <span>·</span>
              <span>Verbatim Claim Traceability</span>
              <span>·</span>
              <span>Date Decay vs Factual Clashes</span>
            </div>
          </div>
        </div>

        {/* 4 Tested Benchmark Scenarios Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Explore 4 Tested Domain Benchmarks
              </h2>
              <p className="text-xs text-slate-400">
                Click any domain below to load real-world text, cross-source evidence, and Decision Flip Stress Tests:
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 hidden sm:inline">
              Empirically Grounded · Real Fine Print Clashes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Banking & Finance */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/60 rounded-xl space-y-3 transition-all shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      Banking & Personal Loan Advertisement
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase">
                      Banking & Consumer Finance
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Ad promises <strong>5.9% fixed APR & zero closing fees</strong>. Disclosure rider reveals a <strong>23.25% variable rate</strong> after month 6, <strong>4.75% origination fee</strong>, and a <strong>5% prepayment penalty</strong>.
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-emerald-400 font-mono block text-[10px] uppercase">Decision Flip Tested:</strong>
                Rate jump + prepayment penalty flips loan from low-cost financing into high-interest debt trap.
              </div>

              {onLoadExample && (
                <button
                  onClick={() => onLoadExample('banking_and_finance')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Load Banking Benchmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Card 2: Employment & Career */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-amber-500/60 rounded-xl space-y-3 transition-all shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Tech Job Advertisement & Offer Letter
                    </h3>
                    <span className="text-[10px] font-mono text-amber-400 uppercase">
                      Employment & Careers
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Offer boasts <strong>$175,000 base + 40,000 ISO equity</strong>. Confidential appendix imposes an <strong>18-month worldwide non-compete</strong> and a <strong>90-day post-termination exercise window</strong>.
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-amber-400 font-mono block text-[10px] uppercase">Decision Flip Tested:</strong>
                Non-compete + 90-day option cliff flips offer from career advancement to extreme career lock-in.
              </div>

              {onLoadExample && (
                <button
                  onClick={() => onLoadExample('employment_and_jobs')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-800/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Load Employment Benchmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Card 3: Health Insurance Policy */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-rose-500/60 rounded-xl space-y-3 transition-all shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-rose-950/60 border border-rose-800/50 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">
                      Health Insurance Policy & Sales Brochure
                    </h3>
                    <span className="text-[10px] font-mono text-rose-400 uppercase">
                      Insurance & Healthcare
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Brochure advertises <strong>100% Cashless Hospitalization up to $500,000</strong>. Master policy clause 8.3 enforces a <strong>1% room rent cap</strong> triggering <strong>proportionate deductions</strong> across all bills.
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-rose-400 font-mono block text-[10px] uppercase">Decision Flip Tested:</strong>
                Executive room choice slashes 40% of all surgeon & treatment payouts out-of-pocket.
              </div>

              {onLoadExample && (
                <button
                  onClick={() => onLoadExample('insurance')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Load Insurance Benchmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Card 4: Scholarship Advertisement */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/60 rounded-xl space-y-3 transition-all shadow-lg group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      University Scholarship Notice
                    </h3>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">
                      Education & Academics
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Headline touts <strong>$18,000 annual STEM scholarship</strong>. Fine print reveals a <strong>3.75 GPA retention cliff</strong>, <strong>single-year non-guaranteed renewal</strong>, and <strong>$1,200 non-refundable deposit</strong>.
              </p>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-[11px] text-slate-400">
                <strong className="text-cyan-400 font-mono block text-[10px] uppercase">Decision Flip Tested:</strong>
                Lack of automatic multi-year renewal flips decision to accept public university grant instead.
              </div>

              {onLoadExample && (
                <button
                  onClick={() => onLoadExample('education')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/50 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>Load Scholarship Benchmark</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Custom Domain Instructions */}
        <div className="p-5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold font-mono uppercase text-[11px]">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Analyze Completely New User-Submitted Information</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            GAPLENS is not restricted to pre-baked domains. You can audit real estate leases, commercial service contracts, government welfare subsidies, municipal bylaws, or consumer warranties. Enter your pending decision in the input panel above, add documents or public URLs, and run analysis.
          </p>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Sources Audited',
      value: summary.sourcesAnalyzedCount,
      sub: `${data.sources.filter(s => s.isOfficial).length} verified official`,
      icon: FileText,
      color: 'text-blue-400',
      actionTab: null,
    },
    {
      label: 'Extracted Claims',
      value: summary.claimsCount,
      sub: 'All tied to verbatim quotes',
      icon: Layers,
      color: 'text-cyan-400',
      actionTab: 'evidence-map',
    },
    {
      label: 'Contradictions Detected',
      value: summary.contradictionsCount,
      sub: `${contradictions.filter(c => c.isDateDrivenDifference).length} date-decay shifts`,
      icon: GitCompare,
      color: 'text-amber-400',
      actionTab: 'contradictions',
    },
    {
      label: 'Missing Evidence Gaps',
      value: summary.gapsIdentifiedCount,
      sub: `${gaps.filter(g => g.severity === 'critical').length} critical severity`,
      icon: HelpCircle,
      color: 'text-rose-400',
      actionTab: 'gaps-radar',
    },
    {
      label: 'Outdated / Undated Sources',
      value: summary.outdatedSourcesCount,
      sub: 'Prior cycles flagged',
      icon: Clock,
      color: 'text-purple-400',
      actionTab: 'contradictions',
    },
    {
      label: 'Critical Action Tasks',
      value: summary.criticalTasksCount,
      sub: 'Before binding decision',
      icon: CheckSquare,
      color: 'text-emerald-400',
      actionTab: 'checklist',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Active Investigation Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl space-y-3 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                Active Research Context
              </span>
              {isSampleData && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                  {sampleLabel || 'BENCHMARK SAMPLE DATA'}
                </span>
              )}
            </div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
              &quot;{researchGoal}&quot;
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span>Audited: {new Date(data.timestamp).toLocaleString()}</span>
              <span>·</span>
              <span className="font-mono text-cyan-300/80">{engineUsed || 'GAPLENS Intelligence Engine'}</span>
            </div>
          </div>

          {/* Risk Indexes */}
          <div className="flex items-center gap-4 bg-slate-950/90 px-4 py-3 rounded-xl border border-slate-800 shrink-0 shadow-md">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Blind-Spot Risk
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-rose-400">
                {summary.blindSpotRiskScore}%
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                Evidence Coverage
              </div>
              <div className="text-xl font-bold font-mono tabular-nums text-cyan-400">
                {summary.evidenceCoverageConfidence}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, idx) => {
          const IconComponent = kpi.icon;
          return (
            <div
              key={idx}
              onClick={() => kpi.actionTab && onNavigateTab(kpi.actionTab)}
              className={`p-4 bg-slate-900/70 border border-slate-800/80 rounded-xl transition-all ${
                kpi.actionTab
                  ? 'hover:border-slate-700 cursor-pointer hover:bg-slate-900'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 font-medium">{kpi.label}</span>
                <IconComponent className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-2xl font-bold text-white font-mono tabular-nums">
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Feature Spotlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signature Spotlight: Decision Flip Test */}
        <div className="p-5 bg-slate-900/80 border border-cyan-900/50 rounded-xl relative overflow-hidden space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 border border-cyan-800/50">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Decision Flip Test (Signature Feature)</h3>
                <p className="text-[11px] text-slate-400">Missing facts that could overturn your current decision</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('decision-flip')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All ({decisionFlipScenarios.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {decisionFlipScenarios.slice(0, 2).map((flip) => (
              <div
                key={flip.id}
                className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-cyan-300">{flip.missingFactor}</span>
                  <span className="text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded">
                    Impact: {flip.impactScore}/10 · Urgency: {flip.urgencyScore}/10
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-900/70 rounded-lg border border-slate-800/80 space-y-0.5">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Apparent Choice</span>
                    <span className="text-slate-300">{flip.currentApparentChoice}</span>
                  </div>
                  <div className="p-2.5 bg-rose-950/20 rounded-lg border border-rose-900/40 space-y-0.5">
                    <span className="text-rose-400 block text-[10px] uppercase font-mono font-semibold">Flipped Action</span>
                    <span className="text-rose-200 font-medium">{flip.flippedChoice}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Trigger: &quot;{flip.triggerCondition}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contradictions & Outdated Sources Spotlight */}
        <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950/60 flex items-center justify-center text-amber-400 border border-amber-800/50">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Contradictions & Staleness</h3>
                <p className="text-[11px] text-slate-400">Differences between sources & cycle expiration</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('contradictions')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>View Details ({contradictions.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {contradictions.map((con) => (
              <div key={con.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">{con.topic}</span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    con.isDateDrivenDifference
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  }`}>
                    {con.isDateDrivenDifference ? 'Chronological Shift' : 'Factual Clash'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {con.explanation}
                </p>
              </div>
            ))}

            {outdatedFlags.map((out) => (
              <div key={out.id} className="p-3 bg-purple-950/20 border border-purple-900/40 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-200 truncate">{out.sourceTitle}</span>
                  <span className="text-[10px] font-mono text-purple-300">
                    {out.claimedDate ? `Year ${out.claimedDate.slice(0, 4)}` : 'Undated'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/80">
                  {out.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mandatory Analytical Transparency & Epistemic Boundaries */}
      <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1 shadow-md">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-slate-200 block font-mono text-[11px] uppercase">
              Analytical Transparency & Limitations Notice
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {summary.limitationsNotice} GAPLENS isolates verifiable facts directly quoted from provided sources,
              identifies what has not been answered, and generates hypothetical decision stress-tests. It does not fabricate
              unseen documents. Critical life, financial, and educational decisions should always be confirmed with the primary governing body.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
