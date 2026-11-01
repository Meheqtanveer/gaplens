import React, { useState } from 'react';
import { Compass, Sparkles, ChevronDown, GraduationCap, Landmark, Briefcase, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSelectExample: (key: 'education' | 'banking_and_finance' | 'employment_and_jobs' | 'insurance') => void;
  onClearToBlank: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onSelectExample,
  onClearToBlank,
  isAnalyzing,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'evidence-map', label: 'Evidence Map' },
    { id: 'contradictions', label: 'Contradictions' },
    { id: 'gaps-radar', label: 'Missing Radar' },
    { id: 'decision-flip', label: 'Decision Flip' },
    { id: 'checklist', label: 'Checklist' },
    { id: 'architecture', label: 'Platform Architecture' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              GAPLENS
            </span>
            <span className="text-[10px] tracking-wider uppercase text-cyan-400 font-mono">
              Universal Dark Spot Detector
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single line, no wrapping) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap text-xs xl:text-sm cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-slate-900 border border-slate-700/60 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action with Dropdown for Benchmark Scenarios */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Analyzing...' : 'Test Benchmark Scenarios'}</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          {/* Benchmark Scenarios Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 space-y-1">
              <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">
                4 Domain Benchmarks
              </div>

              <button
                onClick={() => {
                  onSelectExample('education');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition-colors text-left cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="font-semibold">Education & Scholarship Ad</div>
                  <div className="text-[10px] text-slate-400">Renewal clauses & GPA retention</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectExample('banking_and_finance');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                <Landmark className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-semibold">Banking & Personal Loan Ad</div>
                  <div className="text-[10px] text-slate-400">5.9% teaser vs 23% APR & fees</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectExample('employment_and_jobs');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors text-left cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="font-semibold">Employment & Job Offer</div>
                  <div className="text-[10px] text-slate-400">Non-competes & 90-day PTEW</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onSelectExample('insurance');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 hover:text-rose-300 transition-colors text-left cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <div className="font-semibold">Insurance & Health Policy</div>
                  <div className="text-[10px] text-slate-400">Proportionate room rent deduction</div>
                </div>
              </button>

              <div className="border-t border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    onClearToBlank();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800 hover:text-rose-300 transition-colors text-left cursor-pointer"
                >
                  <span>Start Blank Custom Analysis</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
