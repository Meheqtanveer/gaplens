import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Upload, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  Landmark,
  ShieldAlert,
  HelpCircle,
  Building2,
  Compass
} from 'lucide-react';
import { SourceDocument, DomainType } from '../types/gaplens';

interface InputPanelProps {
  researchGoal: string;
  setResearchGoal: (goal: string) => void;
  domain: DomainType;
  setDomain: (domain: DomainType) => void;
  detectedDomain?: string;
  sources: SourceDocument[];
  setSources: React.Dispatch<React.SetStateAction<SourceDocument[]>>;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onLoadExample: (exampleKey: 'education' | 'banking_and_finance' | 'employment_and_jobs' | 'insurance') => void;
  onClearToBlank: () => void;
  isSampleActive: boolean;
  sampleLabel?: string;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  researchGoal,
  setResearchGoal,
  domain,
  setDomain,
  detectedDomain,
  sources,
  setSources,
  onAnalyze,
  isAnalyzing,
  onLoadExample,
  onClearToBlank,
  isSampleActive,
  sampleLabel,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlSuccess, setUrlSuccess] = useState<string | null>(null);

  // Manual document text form state
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [docDate, setDocDate] = useState('2026-10-31');
  const [isOfficialDoc, setIsOfficialDoc] = useState(false);
  const [showAddDocForm, setShowAddDocForm] = useState(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const domainOptions: Array<{ id: DomainType; label: string; icon: React.ElementType }> = [
    { id: 'auto_detect', label: 'Auto Detect', icon: Compass },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'banking_and_finance', label: 'Banking & Finance', icon: Landmark },
    { id: 'employment_and_jobs', label: 'Employment & Jobs', icon: Briefcase },
    { id: 'insurance', label: 'Insurance', icon: ShieldAlert },
    { id: 'government_schemes', label: 'Government Schemes', icon: Building2 },
    { id: 'general_information', label: 'General Information', icon: FileText },
  ];

  const getPlaceholderForDomain = (dom: DomainType): string => {
    switch (dom) {
      case 'banking_and_finance':
        return 'e.g. What hidden fees, prepayment penalties, or rate jumps should I verify in this loan advertisement?';
      case 'insurance':
        return 'e.g. What room rent sub-limits, exclusions, or waiting periods could reduce my cashless claim payout?';
      case 'employment_and_jobs':
        return 'e.g. What non-compete clauses, option exercise windows, or vesting cliffs should I verify before signing?';
      case 'education':
        return 'e.g. What GPA retention criteria, renewal clauses, or document requirements are unstated in this scholarship?';
      case 'government_schemes':
        return 'e.g. What income verification audits, asset ceilings, or renewal deadlines apply to this subsidy scheme?';
      default:
        return 'e.g. What critical missing facts, conflicting terms, or unstated conditions could flip my pending decision?';
    }
  };

  const handleFetchUrl = async () => {
    if (!urlInput.trim()) return;
    if (!urlInput.trim().startsWith('http://') && !urlInput.trim().startsWith('https://')) {
      setUrlError('Please enter a full URL beginning with http:// or https://');
      return;
    }

    setIsFetchingUrl(true);
    setUrlError(null);
    setUrlSuccess(null);

    try {
      const res = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to retrieve URL content');
      }

      const newDoc: SourceDocument = {
        id: `src-url-${Date.now()}`,
        title: data.title || urlInput,
        url: urlInput.trim(),
        sourceType: 'policy_document',
        publicationDate: data.publicationDate || new Date().toISOString().split('T')[0],
        accessedDate: new Date().toISOString().split('T')[0],
        authorOrPublisher: new URL(urlInput).hostname,
        isOfficial: Boolean(data.isOfficial),
        content: data.snippet || 'No text content extracted',
        extractedSnippetCount: 1,
      };

      setSources((prev) => [...prev, newDoc]);
      setUrlSuccess(`Successfully extracted content from ${new URL(urlInput).hostname} (${data.contentLength.toLocaleString()} characters)`);
      setUrlInput('');
      setTimeout(() => setUrlSuccess(null), 4000);
    } catch (err: any) {
      setUrlError(err.message || 'Network request failed');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File ${file.name} exceeds 5MB limit.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setUploadError(`File ${file.name} appears to be empty.`);
          return;
        }

        const newDoc: SourceDocument = {
          id: `src-file-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          sourceType: 'manual_text',
          publicationDate: new Date(file.lastModified).toISOString().split('T')[0],
          accessedDate: new Date().toISOString().split('T')[0],
          authorOrPublisher: 'Uploaded File',
          isOfficial: false,
          content: text.trim(),
        };

        setSources((prev) => [...prev, newDoc]);
      };

      reader.onerror = () => {
        setUploadError(`Error reading file ${file.name}`);
      };

      reader.readAsText(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddManualDocument = () => {
    if (!docTitle.trim() || !docContent.trim()) return;

    const newDoc: SourceDocument = {
      id: `src-doc-${Date.now()}`,
      title: docTitle.trim(),
      sourceType: isOfficialDoc ? 'official_notice' : 'policy_document',
      publicationDate: docDate || undefined,
      isDateUnknown: !docDate,
      accessedDate: new Date().toISOString().split('T')[0],
      authorOrPublisher: isOfficialDoc ? 'Primary Issuing Body' : 'Author / Forum User',
      isOfficial: isOfficialDoc,
      content: docContent.trim(),
    };

    setSources((prev) => [...prev, newDoc]);
    setDocTitle('');
    setDocContent('');
    setShowAddDocForm(false);
  };

  const removeSource = (id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 md:p-6 mb-8 shadow-xl space-y-6">
      {/* 4 Multi-Domain Benchmark Examples Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            Load Test Benchmark:
          </span>
          <button
            onClick={() => onLoadExample('education')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scholarship Ad</span>
          </button>
          <button
            onClick={() => onLoadExample('banking_and_finance')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-400" />
            <span>Personal Loan Ad</span>
          </button>
          <button
            onClick={() => onLoadExample('employment_and_jobs')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>Job Ad & Offer</span>
          </button>
          <button
            onClick={() => onLoadExample('insurance')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Insurance Policy</span>
          </button>
          <button
            onClick={onClearToBlank}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 rounded-lg text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Blank Investigation</span>
          </button>
        </div>

        {/* Status Indicator */}
        <div className="shrink-0">
          {isSampleActive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{sampleLabel || 'BENCHMARK SAMPLE DATA'}</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>LIVE CUSTOM INVESTIGATION</span>
            </span>
          )}
        </div>
      </div>

      {/* Step 1: Domain Selector & Research Question */}
      <div className="space-y-4">
        {/* Domain Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
              Step 1 · Select Operational Domain
            </label>
            {detectedDomain && (
              <span className="text-[11px] font-mono text-cyan-300">
                Active Context: {detectedDomain}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {domainOptions.map((opt) => {
              const IconComp = opt.icon;
              const isSelected = domain === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setDomain(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Research Question */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-2">
            Step 2 · Decision Goal or Core Inquiry
          </label>
          <div className="relative">
            <input
              type="text"
              value={researchGoal}
              onChange={(e) => setResearchGoal(e.target.value)}
              placeholder={getPlaceholderForDomain(domain)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 text-xs md:text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Information Sources Ingestion */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono">
            Step 3 · Ingest Information Sources ({sources.length} in corpus)
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            Multi-Source Collection: Web URLs, File Uploads & Text Passages
          </span>
        </div>

        {/* Input Bar: URL Fetch + File Upload + Text Paste */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          {/* URL Input */}
          <div className="md:col-span-7 relative flex items-center">
            <Globe className="w-4 h-4 absolute left-3 text-slate-500" />
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste public web link (e.g. loan ad, policy wording, or job circular)"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-9 pr-24 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={handleFetchUrl}
              disabled={isFetchingUrl || !urlInput.trim()}
              className="absolute right-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {isFetchingUrl ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                  <span>Fetching...</span>
                </>
              ) : (
                <span>Fetch Link</span>
              )}
            </button>
          </div>

          {/* File Upload Button */}
          <div className="md:col-span-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".txt,.md,.json,.csv"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload Docs</span>
            </button>
          </div>

          {/* Manual Text Paste Toggle */}
          <div className="md:col-span-3">
            <button
              onClick={() => setShowAddDocForm(!showAddDocForm)}
              className="w-full h-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-cyan-800/50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showAddDocForm ? 'Hide Text Editor' : 'Paste Document Text'}</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        {urlError && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{urlError}</span>
          </div>
        )}

        {urlSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{urlSuccess}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Manual Form */}
        {showAddDocForm && (
          <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">Source Title / Reference Name</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Loan Disclosure Statement, Policy Wording, Offer Agreement"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Publication / Revision Date</label>
                <input
                  type="date"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Passage / Document Text</label>
              <textarea
                rows={5}
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                placeholder="Paste the advertisement claims, contract clauses, or disclosure notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isOfficialDoc}
                  onChange={(e) => setIsOfficialDoc(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span>Classify as Primary / Official Authority Document</span>
              </label>

              <button
                onClick={handleAddManualDocument}
                disabled={!docTitle.trim() || !docContent.trim()}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs disabled:opacity-40 transition-colors cursor-pointer"
              >
                Add Document to Corpus
              </button>
            </div>
          </div>
        )}

        {/* Source Cards List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {sources.map((src, idx) => (
            <div
              key={src.id}
              className="flex items-start justify-between gap-3 p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg hover:border-slate-700 transition-colors"
            >
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-200 truncate">
                    #{idx + 1} · {src.title}
                  </span>
                  {src.isOfficial && (
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 px-1.5 py-0.2 rounded">
                      Official Document
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{src.publicationDate || 'Date: Unknown'}</span>
                  <span>·</span>
                  <span className="truncate max-w-xs">{src.url || src.authorOrPublisher || 'Pasted Text'}</span>
                  <span>·</span>
                  <span>{src.content.length.toLocaleString()} characters</span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                  {src.content.slice(0, 150)}...
                </p>
              </div>

              <button
                onClick={() => removeSource(src.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded transition-colors"
                title="Remove Source"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {sources.length === 0 && (
            <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              No sources in corpus. Add a URL, upload a file, paste text, or load a benchmark example above.
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Execution Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="text-xs text-slate-400">
          <span className="text-slate-300 font-medium">Domain-Independent Protocol:</span> Cross-Source Claims · Contradictions & Staleness · Missing Evidence Radar · Decision Flip Simulation
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || sources.length === 0 || !researchGoal.trim()}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs md:text-sm rounded-lg transition-all shadow-md shadow-cyan-900/30 disabled:opacity-40 active:scale-95 whitespace-nowrap cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Analyzing Information Dark Spots...</span>
            </>
          ) : (
            <>
              <span>Execute GAPLENS Analysis</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
