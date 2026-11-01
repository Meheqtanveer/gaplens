import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  ExternalLink, 
  Calendar, 
  ShieldCheck, 
  GitCompare, 
  HelpCircle,
  Network,
  Table as TableIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import { EvidenceClaim, GapLensAnalysisResult, SourceDocument, Contradiction, InformationGap } from '../types/gaplens';

interface EvidenceMapProps {
  data: GapLensAnalysisResult;
}

export const EvidenceMap: React.FC<EvidenceMapProps> = ({ data }) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>(data.claims[0]?.id || '');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'matrix'>('network');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedClaim = data.claims.find((c) => c.id === selectedClaimId) || data.claims[0] || null;

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'financial_award', label: 'Financial / Award' },
    { id: 'required_documents', label: 'Required Documents' },
    { id: 'deadlines', label: 'Deadlines' },
    { id: 'renewal_conditions', label: 'Renewal & Duration' },
    { id: 'terms_and_penalties', label: 'Terms & Penalties' },
    { id: 'compensation', label: 'Compensation' },
  ];

  const filteredClaims = data.claims.filter((claim) => {
    const matchesCategory = selectedCategory === 'all' || claim.category === selectedCategory;
    const matchesSource = !selectedSourceId || claim.sourceId === selectedSourceId;
    const matchesQuery =
      claim.claimText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.sourceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.verbatimQuote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSource && matchesQuery;
  });

  const getSourceForClaim = (sourceId: string): SourceDocument | undefined => {
    return data.sources.find((s) => s.id === sourceId);
  };

  const getContradictionsForClaim = (claimId: string): Contradiction[] => {
    return data.contradictions.filter(
      (con) => con.claimA.id === claimId || con.claimB.id === claimId
    );
  };

  const getGapsForCategory = (category: string): InformationGap[] => {
    return data.gaps.filter((g) => g.category === category);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'financial_award':
      case 'compensation':
        return 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
      case 'eligibility':
        return 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40';
      case 'required_documents':
        return 'text-amber-400 bg-amber-950/40 border-amber-800/40';
      case 'deadlines':
        return 'text-purple-400 bg-purple-950/40 border-purple-800/40';
      case 'renewal_conditions':
        return 'text-rose-400 bg-rose-950/40 border-rose-800/40';
      case 'terms_and_penalties':
        return 'text-orange-400 bg-orange-950/40 border-orange-800/40';
      default:
        return 'text-blue-400 bg-blue-950/40 border-blue-800/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Evidence Relationship Map & Provenance Matrix</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Examine how sources connect to claims, where conflicting statements collide, and what questions remain unlinked.
          </p>
        </div>

        {/* View Mode Toggle & Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setViewMode('network')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'network'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Relational Map</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'matrix'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Traceability Table</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claims or citations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Source Filter Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-mono text-[11px] shrink-0">Filter by Source:</span>
        <button
          onClick={() => setSelectedSourceId(null)}
          className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
            selectedSourceId === null
              ? 'bg-cyan-500 text-slate-950 font-bold'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Sources ({data.sources.length})
        </button>
        {data.sources.map((src) => (
          <button
            key={src.id}
            onClick={() => setSelectedSourceId(selectedSourceId === src.id ? null : src.id)}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedSourceId === src.id
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span className="truncate max-w-[160px]">{src.title}</span>
            {src.isOfficial && (
              <span className="text-[9px] font-mono px-1 bg-cyan-950 text-cyan-300 rounded border border-cyan-800">
                Official
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Relational Network Mode */}
      {viewMode === 'network' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Visual Relationship Graph Layout */}
          <div className="lg:col-span-7 space-y-4">
            {/* Visual Legend */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span>Verified Source Claim</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Contradiction / Conflict Node</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Missing Evidence Dark Spot</span>
              </div>
            </div>

            {/* Claims Nodes List */}
            <div className="space-y-3">
              {filteredClaims.map((claim) => {
                const isSelected = selectedClaim?.id === claim.id;
                const source = getSourceForClaim(claim.sourceId);
                const relatedContradictions = getContradictionsForClaim(claim.id);
                const relatedGaps = getGapsForCategory(claim.category);

                return (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaimId(claim.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                    }`}
                  >
                    {/* Top Row: Category + Confidence */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryColor(
                            claim.category
                          )}`}
                        >
                          {claim.category.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {claim.supportType.replace('_', ' ')}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-slate-400">
                        Score: {(claim.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    {/* Claim Statement */}
                    <p className="text-xs md:text-sm font-semibold text-slate-200 mb-2 leading-relaxed">
                      {claim.claimText}
                    </p>

                    {/* Verbatim quote teaser */}
                    <blockquote className="text-[11px] font-mono text-slate-400 italic line-clamp-1 mb-3 pl-2 border-l border-slate-700">
                      &quot;{claim.verbatimQuote}&quot;
                    </blockquote>

                    {/* Relational Links strip: Connected Source, Conflicts, Gaps */}
                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xs">
                        <span className="text-slate-500 font-mono">Source:</span>
                        <span className="truncate text-slate-300 font-medium">{claim.sourceTitle}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {relatedContradictions.length > 0 && (
                          <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <GitCompare className="w-3 h-3 text-amber-400" />
                            <span>{relatedContradictions.length} Conflict</span>
                          </span>
                        )}

                        {relatedGaps.length > 0 && (
                          <span className="text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                            <HelpCircle className="w-3 h-3 text-rose-400" />
                            <span>{relatedGaps.length} Gap linked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredClaims.length === 0 && (
                <div className="text-center py-12 bg-slate-900/30 border border-slate-800 rounded-xl text-slate-500 text-xs">
                  No claims match the selected filter.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Deep Claim Provenance & Traceability Inspector */}
          <div className="lg:col-span-5 sticky top-20 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                  Evidence Traceability Inspector
                </h3>
              </div>
              {selectedClaim && (
                <span className="text-[10px] font-mono text-cyan-400">
                  ID: {selectedClaim.id}
                </span>
              )}
            </div>

            {selectedClaim ? (
              <div className="space-y-4 text-xs">
                {/* Category & Grounding Type */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-block text-xs font-mono uppercase px-2.5 py-1 rounded border ${getCategoryColor(
                      selectedClaim.category
                    )}`}
                  >
                    {selectedClaim.category.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-300">
                    Confidence: {(selectedClaim.confidenceScore * 100).toFixed(0)}%
                  </span>
                </div>

                {/* Synthesized Claim Text */}
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1 font-mono uppercase">
                    Extracted Fact / Claim
                  </span>
                  <p className="text-slate-100 font-semibold bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                    {selectedClaim.claimText}
                  </p>
                </div>

                {/* Verbatim Source Evidence */}
                <div>
                  <span className="text-[10px] text-cyan-400 block mb-1 font-mono uppercase">
                    Verbatim Text Passage (Grounding Proof)
                  </span>
                  <blockquote className="bg-cyan-950/20 border-l-2 border-cyan-500 p-3 rounded-r-lg text-slate-200 font-mono text-[11px] leading-relaxed italic">
                    &quot;{selectedClaim.verbatimQuote}&quot;
                  </blockquote>
                </div>

                {/* How Finding Was Generated */}
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">
                    Extraction Methodology & Traceability
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {selectedClaim.traceabilityExplanation ||
                      'Parsed via sentence-level syntactic isolation and entity matching against user research criteria.'}
                  </p>
                </div>

                {/* Source Document Provenance Details */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    Originating Source Document
                  </span>
                  <div className="font-bold text-slate-200">
                    {selectedClaim.sourceTitle}
                  </div>
                  {getSourceForClaim(selectedClaim.sourceId)?.url && (
                    <a
                      href={getSourceForClaim(selectedClaim.sourceId)?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1 truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{getSourceForClaim(selectedClaim.sourceId)?.url}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>Date: {selectedClaim.dateReferenced || 'Not specified'}</span>
                    <span>·</span>
                    <span>Publisher: {getSourceForClaim(selectedClaim.sourceId)?.authorOrPublisher}</span>
                  </div>
                </div>

                {/* Related Conflicts or Gaps */}
                {getContradictionsForClaim(selectedClaim.id).length > 0 && (
                  <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase font-mono block font-semibold">
                      Opposing Information Warning
                    </span>
                    <p className="text-[11px] text-amber-200">
                      This claim is directly contradicted by another document in your corpus. Check the Contradiction Hunter for side-by-side comparison.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Select a claim on the left to inspect its verbatim proof and provenance.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Traceability Matrix Table View */
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Extracted Claim</th>
                  <th className="p-3.5">Verbatim Quote Proof</th>
                  <th className="p-3.5">Source & Date</th>
                  <th className="p-3.5">Conflict Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredClaims.map((claim) => {
                  const conflicts = getContradictionsForClaim(claim.id);
                  return (
                    <tr
                      key={claim.id}
                      onClick={() => setSelectedClaimId(claim.id)}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        selectedClaim?.id === claim.id ? 'bg-slate-800/40' : ''
                      }`}
                    >
                      <td className="p-3.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getCategoryColor(
                            claim.category
                          )}`}
                        >
                          {claim.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-white max-w-xs">
                        {claim.claimText}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400 italic max-w-sm">
                        &quot;{claim.verbatimQuote}&quot;
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-slate-400">
                        <div className="font-semibold text-slate-300 truncate max-w-[180px]">
                          {claim.sourceTitle}
                        </div>
                        <div className="text-[10px] font-mono">{claim.dateReferenced || 'Undated'}</div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {conflicts.length > 0 ? (
                          <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded">
                            Conflicted ({conflicts.length})
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 rounded">
                            Uncontested
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
