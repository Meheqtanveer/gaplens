import React, { useState } from 'react';
import { Terminal, FolderTree, Award, Cpu, FileCode, CheckCircle, ArrowRight, ShieldCheck, Copy, Check, Landmark, GraduationCap, Briefcase, ShieldAlert } from 'lucide-react';

export const ArchitectureGuide: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const folderStructure = `gaplens-project/
├── backend/                  # Python Flask Alternative Backend
│   ├── app.py                # Flask REST API, BeautifulSoup scraper, domain-agnostic engine
│   ├── requirements.txt      # Flask, requests, bs4, pandas, google-genai
│   └── sample_data.json      # Multi-domain benchmark datasets
├── src/                      # Full-Stack Interactive Frontend (React 19 + TypeScript)
│   ├── components/           # Universal UI Modules
│   │   ├── Header.tsx        # Top Bar Contract & 4-domain switcher
│   │   ├── InputPanel.tsx    # Domain selector (7 domains) & multi-source collector
│   │   ├── DashboardOverview.tsx # KPI strip, risk indexes & limitations
│   │   ├── EvidenceMap.tsx   # Interactive claim inspector & traceability table
│   │   ├── ContradictionHunter.tsx # Cross-source clash & age detector
│   │   ├── MissingEvidenceRadar.tsx # Categorized blind spots & where-to-verify
│   │   ├── DecisionFlipTest.tsx # Universal Decision Flip simulator
│   │   ├── VerificationChecklist.tsx # Actionable checklist with sources
│   │   └── ArchitectureGuide.tsx # Hackathon submission guide
│   ├── data/
│   │   └── examples.ts       # 4 Tested Domain Benchmarks (Education, Loan, Job, Insurance)
│   ├── types/
│   │   └── gaplens.ts        # Typed schemas for claims, gaps, flips, and DomainType
│   ├── App.tsx               # Orchestrator & state management
│   ├── main.tsx              # React DOM entry
│   └── index.css             # Tailwind v4 & typography
├── server.ts                 # Full-stack Node/Express server + Gemini 3.8 Flash SDK
├── package.json              # Express, @google/genai, React, Vite
├── README.md                 # Hackathon submission documentation
└── metadata.json             # AI Studio capabilities configuration`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Card */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
            Shinchan Online Hackathon 2026 Submission Blueprint
          </span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          GAPLENS General-Purpose Information Gap Detection Platform
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Official Problem Statement: <strong className="text-slate-300">DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform</strong>.
          Approximately 500 participants share this challenge. GAPLENS succeeds across all domains by rejecting generic summarization in favor of the signature Decision Flip Test, verbatim evidence provenance, and transparent contradiction auditing.
        </p>
      </div>

      {/* The 4 Tested Domain Benchmarks Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>4 Domain Benchmarks Tested & Operational</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Benchmark 1 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <GraduationCap className="w-4 h-4" />
              <span>1. Education: Scholarship Advertisement</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Scenario:</strong> $18,000/year STEM scholarship notice vs aggregator forum.<br />
              <strong>Detected Clash:</strong> Mandated tax returns and 2 letters vs &quot;no financial proof needed&quot; blog claim.<br />
              <strong>Decision Flip:</strong> Unstated single-year limitation flips choice from expensive private university to in-state public college.
            </p>
          </div>

          {/* Benchmark 2 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold">
              <Landmark className="w-4 h-4" />
              <span>2. Banking & Finance: Personal Loan Advertisement</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Scenario:</strong> &quot;Zero processing fees & fixed 5.9% loan&quot; ad vs TILA legal disclosure.<br />
              <strong>Detected Clash:</strong> 5.9% is an introductory 6-month teaser jumping to 23.25% variable APR + 4.75% fee.<br />
              <strong>Decision Flip:</strong> Balloon interest escalation and 5% prepayment penalty flips choice from taking loan to keeping existing credit cards.
            </p>
          </div>

          {/* Benchmark 3 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Briefcase className="w-4 h-4" />
              <span>3. Employment: Senior AI Engineer Job Ad & Offer</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Scenario:</strong> &quot;Unrestricted remote freedom & high equity&quot; ad vs formal offer agreement.<br />
              <strong>Detected Clash:</strong> Contract enforces worldwide 18-month non-compete in AI + 90-day option forfeiture cliff.<br />
              <strong>Decision Flip:</strong> Restrictive covenant and 90-day PTEW flips choice to declining offer or striking out Section 2.
            </p>
          </div>

          {/* Benchmark 4 */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>4. Insurance: Health Policy Brochure vs Wordings</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              <strong>Scenario:</strong> &quot;100% Cashless hospitalization up to $500k & Zero Room Rent Capping&quot; brochure vs Master Policy.<br />
              <strong>Detected Clash:</strong> Policy caps room at 1% and applies punitive proportionate deduction to all doctor/surgical fees.<br />
              <strong>Decision Flip:</strong> $26,000 out-of-pocket surprise bill on surgery flips choice to purchasing policy without sub-limits.
            </p>
          </div>
        </div>
      </div>

      {/* Judging Criteria Scorecard Alignment */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Judging Criteria Optimization Matrix (100% Total)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">1. Problem Relevance</span>
              <span className="font-mono text-cyan-400 font-bold">15%</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Solves the dark-spot problem across education, finance, employment, and healthcare by identifying unstated assumptions and omitted clauses.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-cyan-800/50 rounded-xl space-y-1 bg-cyan-950/10">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-cyan-300">2. Innovation & Originality</span>
              <span className="font-mono text-cyan-400 font-bold">20%</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              <strong className="text-white">Decision Flip Test:</strong> Simulates how unverified conditions overturn apparent decisions. Domain-independent and explainable.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">3. Working Prototype</span>
              <span className="font-mono text-cyan-400 font-bold">25%</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              End-to-end operational web app: multi-source ingestion, real URL scraping, document uploads, deterministic NLP fallback, and Gemini AI synthesis.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">4. Technical Implementation</span>
              <span className="font-mono text-cyan-400 font-bold">15%</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Clean separation of concerns: Express server, Python Flask reference backend, BeautifulSoup scraping, and TypeScript data models.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">5. Evidence & Accuracy</span>
              <span className="font-mono text-cyan-400 font-bold">15%</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Direct claim-to-quote mapping with exact provenance. Distinguishes confirmed text from identified absence; never fabricates citations.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">6. Presentation & Demo</span>
              <span className="font-mono text-cyan-400 font-bold">10%</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              High-contrast research dashboard aesthetic, 4 1-click domain benchmarks, and exportable verification tasks.
            </p>
          </div>
        </div>
      </div>

      {/* Project Folder Structure */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Repository Folder Structure
            </h3>
          </div>
          <button
            onClick={() => handleCopy('folder', folderStructure)}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 font-mono cursor-pointer"
          >
            {copiedSection === 'folder' ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Tree</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {folderStructure}
        </pre>
      </div>

      {/* Local Run Instructions */}
      <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            How to Run Locally for Hackathon Evaluation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-white block">Method A: Full-Stack React + Node (Default)</span>
            <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`npm install
npm run dev
# Open http://localhost:3000`}
            </pre>
            <p className="text-slate-400 text-[11px]">
              Runs the interactive web application with Express backend, Vite dev server, and built-in domain-independent heuristic NLP engine.
            </p>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
            <span className="font-semibold text-white block">Method B: Python Flask Backend</span>
            <pre className="p-2.5 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
{`cd backend
pip install -r requirements.txt
python app.py
# Runs Flask on http://localhost:5000`}
            </pre>
            <p className="text-slate-400 text-[11px]">
              Ready for judges who want to evaluate the Python Flask + BeautifulSoup + Pandas codebase directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
