import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Scale, 
  AlertOctagon, 
  HelpCircle, 
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Flame,
  Info,
  Quote,
  FileSearch
} from 'lucide-react';
import { DecisionFlipScenario } from '../types/gaplens';

interface DecisionFlipTestProps {
  scenarios: DecisionFlipScenario[];
  hasSufficientDataForFlip?: boolean;
  insufficientDataNotice?: string;
  detectedDocumentType?: string;
}

export const DecisionFlipTest: React.FC<DecisionFlipTestProps> = ({ 
  scenarios,
  hasSufficientDataForFlip = true,
  insufficientDataNotice,
  detectedDocumentType
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(
    scenarios[0]?.id || ''
  );
  const [simulationState, setSimulationState] = useState<Record<string, boolean>>({
    [scenarios[0]?.id || 'flip-1']: true, // Default first scenario stimulated
  });

  const activeScenario =
    scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const toggleSimulation = (id: string) => {
    setSimulationState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-rose-400 bg-rose-950/60 border-rose-800/50';
      case 'high':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/50';
      default:
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50';
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
            Hypothetical Risk (Simulation)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Signature Banner */}
      <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/50 rounded-xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-400 text-slate-950 font-bold tracking-wider">
                Signature Hackathon Innovation
              </span>
              <span className="text-xs font-mono text-cyan-300">
                Decision Blind-Spot Stress Tester
              </span>
              {detectedDocumentType && (
                <span className="text-xs font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                  Document Type: {detectedDocumentType.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">
              The Decision Flip Test
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Standard AI summarizers repeat known text. The Decision Flip Test stress-tests your pending choice by exposing
              <strong className="text-white"> unstated conditions</strong> and calculating how your decision must flip if an unverified clause is contrary to your assumptions.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/90 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1.5 shrink-0 font-mono">
            <div className="flex items-center gap-2 text-cyan-300 text-[11px] font-semibold">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Transparent Evaluation Logic</span>
            </div>
            <div>Impact: 1–10 (Potential financial/career risk)</div>
            <div>Urgency: 1–10 (Time-sensitivity before deadline)</div>
          </div>
        </div>
      </div>

      {/* Scope / Insufficient Data Notification */}
      {insufficientDataNotice && (
        <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 shadow-md ${
          hasSufficientDataForFlip === false 
            ? 'bg-rose-950/40 border-rose-800/80 text-rose-200' 
            : 'bg-slate-900/90 border-cyan-800/60 text-slate-300'
        }`}>
          {hasSufficientDataForFlip === false ? (
            <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <span className="font-bold text-white block font-mono text-[11px] uppercase tracking-wider">
              {hasSufficientDataForFlip === false ? 'Insufficient Information Warning' : 'Context & Scope Transparency'}
            </span>
            <p className="text-slate-300 text-[12px] leading-relaxed">
              {insufficientDataNotice}
            </p>
          </div>
        </div>
      )}

      {/* Epistemic Boundary Notice */}
      <div className="p-3.5 bg-amber-950/30 border border-amber-800/60 rounded-lg text-xs text-amber-200/90 flex items-start gap-2.5">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider block">
            Epistemic Boundary: Stress-Testing Simulation
          </span>
          <p className="text-amber-200/80 leading-relaxed text-[11px]">
            Decision Flip scenarios simulate hypothetical conditions to protect users from commitments made on incomplete information.
            Hypothetical outcomes are strictly labeled below and never presented as detected facts.
          </p>
        </div>
      </div>

      {/* When data is insufficient for flip testing */}
      {hasSufficientDataForFlip === false ? (
        <div className="py-12 px-6 text-center bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
          <FileSearch className="w-12 h-12 text-slate-500 mx-auto" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">Insufficient Data to Compute Decision Flip</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {insufficientDataNotice || 'The submitted text contains insufficient content to evaluate trade-offs or model decision flips. Please submit a more detailed advertisement, offer letter, or agreement.'}
            </p>
          </div>
        </div>
      ) : (
        /* Main Interactive Flip Chamber */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Missing Factor Scenarios List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-mono text-slate-400 px-1 flex items-center justify-between">
              <span>Decision Flip Scenarios ({scenarios.length})</span>
              <span>Select to inspect</span>
            </div>

            <div className="space-y-2.5">
              {scenarios.map((scen, idx) => {
                const isSelected = activeScenario?.id === scen.id;
                const isTriggered = simulationState[scen.id] ?? false;

                return (
                  <div
                    key={scen.id}
                    onClick={() => setActiveScenarioId(scen.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        #{idx + 1} · {scen.missingFactor}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getPriorityStyle(
                          scen.priority
                        )}`}
                      >
                        {scen.priority}
                      </span>
                    </div>

                    <div className="mb-2">
                      {renderFindingTypeBadge(scen.findingType)}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                      Trigger: &quot;{scen.triggerCondition}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                      <span>Impact: {scen.impactScore}/10 · Urgency: {scen.urgencyScore}/10</span>
                      <span className={isTriggered ? 'text-rose-400 font-semibold' : 'text-slate-500'}>
                        {isTriggered ? 'Condition Triggered' : 'Normal State'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Scenario Laboratory */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-5 md:p-6 shadow-xl space-y-5">
            {activeScenario ? (
              <>
                {/* Header and Simulator Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {renderFindingTypeBadge(activeScenario.findingType)}
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getPriorityStyle(
                          activeScenario.priority
                        )}`}
                      >
                        {activeScenario.priority} Priority
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Probability: {activeScenario.flipProbability.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white pt-1">
                      {activeScenario.missingFactor}
                    </h3>
                  </div>

                  {/* Interactive Simulator Button */}
                  <button
                    onClick={() => toggleSimulation(activeScenario.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer shrink-0 ${
                      simulationState[activeScenario.id]
                        ? 'bg-rose-500 text-slate-950 font-bold shadow-md shadow-rose-900/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {simulationState[activeScenario.id]
                        ? 'Simulate: Condition Triggered'
                        : 'Trigger Missing Condition'}
                    </span>
                  </button>
                </div>

                {/* Exact Submitted Supporting Passage */}
                {activeScenario.exactSubmittedPassage && (
                  <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] uppercase font-semibold">
                      <Quote className="w-3.5 h-3.5" />
                      <span>Exact Submitted Supporting Passage</span>
                    </div>
                    <p className="text-xs text-slate-200 font-mono italic leading-relaxed border-l-2 border-cyan-500/60 pl-3">
                      &quot;{activeScenario.exactSubmittedPassage}&quot;
                    </p>
                  </div>
                )}

                {/* Hypothetical Trigger Condition Box */}
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold">
                    Hypothetical Condition Stress-Test (Simulated Scenario)
                  </span>
                  <p className="text-xs text-slate-200 font-mono leading-relaxed italic">
                    &quot;{activeScenario.triggerCondition}&quot;
                  </p>
                </div>

                {/* Side-by-Side Decision Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Apparent Choice */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">
                        1. Apparent Baseline Choice
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">
                      {activeScenario.currentApparentChoice}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Formed from unverified assumptions and surface reading.
                    </p>
                  </div>

                  {/* Flipped Choice */}
                  <div
                    className={`p-4 rounded-xl border space-y-2 transition-all ${
                      simulationState[activeScenario.id]
                        ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-rose-400 uppercase font-bold">
                        2. Flipped Action (Risk-Mitigated)
                      </span>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          simulationState[activeScenario.id] ? 'bg-rose-400' : 'bg-slate-700'
                        }`}
                      />
                    </div>
                    <p className="text-xs text-rose-100 font-bold leading-relaxed">
                      {activeScenario.flippedChoice}
                    </p>
                    <p className="text-[11px] text-rose-300/80">
                      Prevents commitment to an unfavorable position without clear terms.
                    </p>
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-slate-300 block">
                    Why This Specific Missing Factor Matters:
                  </span>
                  <p className="text-slate-400 leading-relaxed">
                    {activeScenario.whyItMatters || activeScenario.explanation}
                  </p>
                </div>

                {/* Crucial Rigor: Verified Facts vs Exposed Assumptions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  {/* Verified Facts */}
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[11px] font-semibold">
                      <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Verified Facts from Documents</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                      {activeScenario.verifiedFactsReferenced.map((fact, i) => (
                        <li key={i} className="leading-relaxed">{fact}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Exposed Assumptions */}
                  <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-rose-300 font-mono text-[11px] font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Unverified Assumptions Exposed</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                      {activeScenario.assumptionsExposed.map((assump, i) => (
                        <li key={i} className="leading-relaxed">{assump}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Epistemic Footer */}
                <div className="text-[10px] text-slate-500 font-mono pt-1 text-center">
                  Notice: Decision Flip scenarios are hypothetical stress-testing simulations. They are not detected contractual facts.
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                No scenario selected.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
