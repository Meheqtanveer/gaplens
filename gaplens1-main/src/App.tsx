import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { DashboardOverview } from './components/DashboardOverview';
import { EvidenceMap } from './components/EvidenceMap';
import { ContradictionHunter } from './components/ContradictionHunter';
import { MissingEvidenceRadar } from './components/MissingEvidenceRadar';
import { DecisionFlipTest } from './components/DecisionFlipTest';
import { VerificationChecklist } from './components/VerificationChecklist';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { ALL_BENCHMARK_EXAMPLES, BLANK_ANALYSIS_STATE } from './data/examples';
import { GapLensAnalysisResult, SourceDocument, DomainType } from './types/gaplens';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [domain, setDomain] = useState<DomainType>('auto_detect');
  const [researchGoal, setResearchGoal] = useState<string>('');
  const [sources, setSources] = useState<SourceDocument[]>([]);
  const [analysisResult, setAnalysisResult] = useState<GapLensAnalysisResult>(
    BLANK_ANALYSIS_STATE
  );
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // 1. Load any of the 4 Domain Benchmark Examples
  const handleLoadExample = (exampleKey: 'education' | 'banking_and_finance' | 'employment_and_jobs' | 'insurance') => {
    const selected = ALL_BENCHMARK_EXAMPLES[exampleKey];
    if (!selected) return;

    setDomain(selected.domain);
    setResearchGoal(selected.researchGoal);
    setSources(selected.sources);
    setAnalysisResult(selected);
    setAnalysisError(null);
    setActiveTab('dashboard');
  };

  // 2. Clear to blank for custom live analysis in any domain
  const handleClearToBlank = () => {
    setDomain('auto_detect');
    setResearchGoal('');
    setSources([]);
    setAnalysisResult(BLANK_ANALYSIS_STATE);
    setAnalysisError(null);
    setActiveTab('dashboard');
  };

  // 3. Run dynamic analysis against backend (Gemini 3.8 Flash or deterministic heuristic)
  const handleAnalyze = async () => {
    if (!researchGoal.trim() || sources.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          researchGoal: researchGoal.trim(),
          domain,
          sources: sources.map((s) => ({
            id: s.id,
            title: s.title,
            content: s.content,
            url: s.url,
            publicationDate: s.publicationDate,
            isOfficial: s.isOfficial,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis service failed');
      }

      const result: GapLensAnalysisResult = await response.json();
      setAnalysisResult(result);
      if (result.domain) {
        setDomain(result.domain);
      }
      setActiveTab('dashboard');
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'Failed to complete analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. Toggle checklist tasks
  const handleToggleTask = (taskId: string) => {
    setAnalysisResult((prev) => ({
      ...prev,
      verificationChecklist: prev.verificationChecklist.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectExample={handleLoadExample}
        onClearToBlank={handleClearToBlank}
        isAnalyzing={isAnalyzing}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Source Ingestion, Domain Selector & Goal Formulation Controls */}
        <InputPanel
          researchGoal={researchGoal}
          setResearchGoal={setResearchGoal}
          domain={domain}
          setDomain={setDomain}
          detectedDomain={analysisResult.detectedDomain}
          sources={sources}
          setSources={setSources}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          onLoadExample={handleLoadExample}
          onClearToBlank={handleClearToBlank}
          isSampleActive={Boolean(analysisResult.isSampleData)}
          sampleLabel={analysisResult.sampleLabel}
        />

        {analysisError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <span className="font-bold block">Analysis Engine Notice</span>
              <span>{analysisError}. Please check your inputs or try pasting text directly.</span>
            </div>
          </div>
        )}

        {/* Tab View Router */}
        <div className="mt-2">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              data={analysisResult}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onLoadExample={handleLoadExample}
            />
          )}

          {activeTab === 'evidence-map' && (
            <EvidenceMap data={analysisResult} />
          )}

          {activeTab === 'contradictions' && (
            <ContradictionHunter
              contradictions={analysisResult.contradictions}
              outdatedFlags={analysisResult.outdatedFlags}
            />
          )}

          {activeTab === 'gaps-radar' && (
            <MissingEvidenceRadar gaps={analysisResult.gaps} />
          )}

          {activeTab === 'decision-flip' && (
            <DecisionFlipTest
              scenarios={analysisResult.decisionFlipScenarios}
              hasSufficientDataForFlip={analysisResult.hasSufficientDataForFlip}
              insufficientDataNotice={analysisResult.insufficientDataNotice}
              detectedDocumentType={analysisResult.detectedDocumentType}
            />
          )}

          {activeTab === 'checklist' && (
            <VerificationChecklist
              tasks={analysisResult.verificationChecklist}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureGuide />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">GAPLENS</span>
            <span>·</span>
            <span>Shinchan Online Hackathon 2026</span>
            <span>·</span>
            <span className="text-cyan-400/90 font-mono">General-Purpose Digital Information Gap Detection Platform</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Explainable AI · Verifiable Provenance · 4 Tested Domain Benchmarks
          </div>
        </div>
      </footer>
    </div>
  );
}
