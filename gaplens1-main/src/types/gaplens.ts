export type FindingType =
  | 'explicitly_missing_information'
  | 'unanswered_question'
  | 'hypothetical_risk'
  | 'verified_contradiction';

export type DomainType =
  | 'auto_detect'
  | 'education'
  | 'banking_and_finance'
  | 'employment_and_jobs'
  | 'insurance'
  | 'government_schemes'
  | 'general_information';

export type SourceType =
  | 'official_notice'
  | 'news_article'
  | 'policy_document'
  | 'forum_post'
  | 'educational_portal'
  | 'contract_or_agreement'
  | 'advertisement'
  | 'product_spec'
  | 'manual_text';

export interface SourceDocument {
  id: string;
  title: string;
  url?: string;
  sourceType: SourceType;
  publicationDate?: string; // YYYY-MM-DD or descriptive, or 'Unknown'
  isDateUnknown?: boolean;
  accessedDate: string;
  authorOrPublisher: string;
  isOfficial: boolean;
  content: string;
  extractedSnippetCount?: number;
}

export type ClaimCategory =
  | 'eligibility'
  | 'financial_award'
  | 'required_documents'
  | 'deadlines'
  | 'renewal_conditions'
  | 'work_restrictions'
  | 'selection_criteria'
  | 'compensation'
  | 'responsibilities'
  | 'terms_and_penalties'
  | 'interest_and_rates'
  | 'coverage_and_benefits'
  | 'deductibles_and_copay'
  | 'waiting_periods'
  | 'clauses_and_exclusions'
  | 'specifications'
  | 'general_claim';

export interface EvidenceClaim {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;
  sourceDate?: string;
  category: ClaimCategory;
  claimText: string;
  verbatimQuote: string;
  exactSubmittedPassage?: string;
  confidenceScore: number; // 0 to 1
  dateReferenced?: string;
  supportType: 'direct_statement' | 'implied_inference' | 'third_party_assertion';
  traceabilityExplanation: string; // Explains precisely how the finding was identified in the source
}

export type ContradictionType = 'direct_factual_clash' | 'date_decay_difference' | 'context_scope_difference';

export interface Contradiction {
  id: string;
  topic: string;
  claimA: EvidenceClaim;
  claimB: EvidenceClaim;
  type: ContradictionType;
  findingType?: FindingType;
  explanation: string;
  whyItMatters: string;
  sourceDateA?: string;
  sourceDateB?: string;
  isDateDrivenDifference: boolean;
  isConfirmedConflict: boolean; // true = confirmed factual clash; false = possible conflict / needing verification
  evidenceStrength: 'high' | 'moderate' | 'circumstantial';
}

export type GapSeverity = 'critical' | 'high' | 'medium' | 'informational';

export interface InformationGap {
  id: string;
  topic: string;
  unansweredQuestion: string;
  reasonMissingMatters: string;
  severity: GapSeverity;
  category: ClaimCategory;
  findingType?: FindingType;
  exactSubmittedPassage?: string;
  suggestedFollowUpPrompt: string;
  whereToVerify: string;
  absenceType: 'complete_omission' | 'ambiguous_phrasing' | 'unspecified_exception';
}

export interface OutdatedFlag {
  id: string;
  sourceId: string;
  sourceTitle: string;
  claimedDate?: string;
  isDateUnknown?: boolean;
  currentCycleYear: number;
  supersededBySourceId?: string;
  supersededBySourceTitle?: string;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  notAutomaticallyInvalidNotice: string;
}

export interface DecisionFlipScenario {
  id: string;
  missingFactor: string;
  currentApparentChoice: string;
  flippedChoice: string;
  triggerCondition: string; // "If..."
  priority: 'critical' | 'high' | 'medium';
  impactScore: number; // 1-10
  urgencyScore: number; // 1-10
  flipProbability: 'high' | 'medium' | 'low';
  explanation: string;
  whyItMatters: string;
  findingType?: FindingType;
  exactSubmittedPassage?: string;
  isContractualAssumption?: boolean;
  verifiedFactsReferenced: string[]; // Known facts from documents
  assumptionsExposed: string[];      // Vulnerable unverified assumptions
  isHypothetical: true;
}

export interface VerificationTask {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  targetOfficialSource: string;
  completed: boolean;
  relatedGapId?: string;
  relatedContradictionId?: string;
}

export interface AnalysisSummary {
  sourcesAnalyzedCount: number;
  claimsCount: number;
  contradictionsCount: number;
  gapsIdentifiedCount: number;
  outdatedSourcesCount: number;
  criticalTasksCount: number;
  evidenceCoverageConfidence: number; // 0-100%
  blindSpotRiskScore: number; // 0-100%
  limitationsNotice: string;
}

export interface GapLensAnalysisResult {
  researchGoal: string;
  domain: DomainType;
  detectedDomain?: string;
  detectedDocumentType?: string;
  hasSufficientDataForFlip?: boolean;
  insufficientDataNotice?: string;
  timestamp: string;
  isSampleData?: boolean;
  sampleLabel?: string;
  engineUsed?: string;
  summary: AnalysisSummary;
  sources: SourceDocument[];
  claims: EvidenceClaim[];
  contradictions: Contradiction[];
  gaps: InformationGap[];
  outdatedFlags: OutdatedFlag[];
  decisionFlipScenarios: DecisionFlipScenario[];
  verificationChecklist: VerificationTask[];
}

