import { GapLensAnalysisResult } from '../types/gaplens';

// 1. EDUCATION: Scholarship Application Diligence
export const SCHOLARSHIP_EXAMPLE: GapLensAnalysisResult = {
  researchGoal: 'What should I verify before applying for this scholarship advertisement?',
  domain: 'education',
  detectedDomain: 'Education & Academic Awards',
  timestamp: '2026-10-31T20:00:00Z',
  isSampleData: true,
  sampleLabel: 'BENCHMARK EXAMPLE 1: Education (Scholarship Advertisement)',
  engineUsed: 'GAPLENS Domain-Agnostic Heuristic Engine',
  summary: {
    sourcesAnalyzedCount: 3,
    claimsCount: 8,
    contradictionsCount: 2,
    gapsIdentifiedCount: 3,
    outdatedSourcesCount: 1,
    criticalTasksCount: 3,
    evidenceCoverageConfidence: 70,
    blindSpotRiskScore: 76,
    limitationsNotice: 'NOTICE: Benchmark example demonstrating education diligence. Findings reflect only what is in the 3 documents below.'
  },
  sources: [
    {
      id: 'src-edu-1',
      title: 'Apex Global Foundation – Official 2026-2027 Scholarship Gazette',
      url: 'https://apexstemfoundation.org/admissions/2026-guidelines',
      sourceType: 'official_notice',
      publicationDate: '2026-08-15',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Apex Foundation Board of Trustees',
      isOfficial: true,
      content: `APEX GLOBAL STEM SCHOLARSHIP GAZETTE (CYCLE 2026-2027)
1. Award Amount: $18,000 per academic year credited toward tuition and lab fees.
2. Eligibility: Undergraduate STEM majors enrolled full-time. Minimum cumulative high school GPA of 3.6 on a 4.0 scale.
3. Mandatory Submission Documents:
   - Official certified academic transcripts
   - Two academic recommendation letters from STEM faculty
   - Parent/Guardian certified income statement (Form 1040 or tax return)
   - 750-word personal statement of intent
4. Application Deadlines:
   - Early Round: November 15, 2026
   - Regular Round: January 20, 2027
5. Terms of Acceptance: Awardees must enroll full-time (minimum 15 credit hours/semester). Award disbursed each September.`
    },
    {
      id: 'src-edu-2',
      title: 'Apex Scholarship Notice Archive (2024 Cycle)',
      url: 'https://apexstemfoundation.org/archive/2024-scholarship-memo',
      sourceType: 'policy_document',
      publicationDate: '2024-01-10',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Apex Foundation Historical Records',
      isOfficial: true,
      content: `2024 SCHOLARSHIP INFORMATION MEMORANDUM:
Award: $12,000 per annum.
Eligibility: GPA 3.4 minimum. Open to all engineering disciplines.
Application Deadline: March 30, 2024. Late submissions will not be considered.`
    },
    {
      id: 'src-edu-3',
      title: 'EduGuide Global – Ultimate Apex STEM Scholarship Overview & Student Forum',
      url: 'https://eduguide-global.com/scholarships/apex-stem-review',
      sourceType: 'educational_portal',
      publicationDate: '2025-06-20',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'EduGuide Editorial Staff (Third-Party Aggregator)',
      isOfficial: false,
      content: `Apex STEM Scholarship Guide (Updated 2025):
Students can receive up to $15,000.
Requirements: You only need 1 recommendation letter and an essay. Income statements are not required during initial preliminary shortlisting.
Deadline noted as rolling until April. Students report easy renewals.`
    }
  ],
  claims: [
    {
      id: 'cl-edu-1',
      sourceId: 'src-edu-1',
      sourceTitle: 'Apex Global Foundation – Official 2026-2027 Scholarship Gazette',
      sourceDate: '2026-08-15',
      category: 'financial_award',
      claimText: 'Annual award amount is $18,000 for tuition and laboratory fees.',
      verbatimQuote: 'Award Amount: $18,000 per academic year credited toward tuition and lab fees.',
      confidenceScore: 0.98,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 1 of official gazette.'
    },
    {
      id: 'cl-edu-2',
      sourceId: 'src-edu-1',
      sourceTitle: 'Apex Global Foundation – Official 2026-2027 Scholarship Gazette',
      sourceDate: '2026-08-15',
      category: 'required_documents',
      claimText: 'Two recommendation letters and certified tax income statements are strictly mandatory.',
      verbatimQuote: 'Two academic recommendation letters from STEM faculty. Parent/Guardian certified income statement (Form 1040 or tax return).',
      confidenceScore: 0.96,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 3 of official gazette.'
    },
    {
      id: 'cl-edu-3',
      sourceId: 'src-edu-3',
      sourceTitle: 'EduGuide Global – Ultimate Apex STEM Scholarship Overview & Student Forum',
      sourceDate: '2025-06-20',
      category: 'required_documents',
      claimText: 'Only 1 recommendation letter needed, and income statements are not required for preliminary round.',
      verbatimQuote: 'You only need 1 recommendation letter and an essay. Income statements are not required during initial preliminary shortlisting.',
      confidenceScore: 0.82,
      supportType: 'third_party_assertion',
      traceabilityExplanation: 'Student forum summary paragraph on aggregator portal.'
    },
    {
      id: 'cl-edu-4',
      sourceId: 'src-edu-2',
      sourceTitle: 'Apex Scholarship Notice Archive (2024 Cycle)',
      sourceDate: '2024-01-10',
      category: 'deadlines',
      claimText: 'Application deadline stated as March 30, 2024 with $12,000 award.',
      verbatimQuote: 'Application Deadline: March 30, 2024. Award: $12,000 per annum.',
      confidenceScore: 0.95,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Historical circular for 2024 academic cycle.'
    }
  ],
  contradictions: [
    {
      id: 'con-edu-1',
      topic: 'Document Requirements & Income Verification',
      claimA: {
        id: 'cl-edu-2',
        sourceId: 'src-edu-1',
        sourceTitle: 'Apex Official Gazette (2026)',
        category: 'required_documents',
        claimText: 'Requires two recommendation letters and certified parental tax returns.',
        verbatimQuote: 'Two academic recommendation letters from STEM faculty. Parent/Guardian certified income statement.',
        confidenceScore: 0.96,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Official Gazette Section 3.'
      },
      claimB: {
        id: 'cl-edu-3',
        sourceId: 'src-edu-3',
        sourceTitle: 'EduGuide Global Portal (2025)',
        category: 'required_documents',
        claimText: 'Claims only 1 letter is needed and income statements are omitted.',
        verbatimQuote: 'You only need 1 recommendation letter and an essay. Income statements are not required during initial preliminary shortlisting.',
        confidenceScore: 0.82,
        supportType: 'third_party_assertion',
        traceabilityExplanation: 'Forum post advice.'
      },
      type: 'direct_factual_clash',
      explanation: 'Official 2026 Gazette mandates parental tax returns and 2 letters. Third-party aggregator blog suggests lighter criteria.',
      whyItMatters: 'Submitting only 1 letter results in immediate administrative disqualification without substantive review.',
      isDateDrivenDifference: false,
      isConfirmedConflict: true,
      evidenceStrength: 'high'
    }
  ],
  gaps: [
    {
      id: 'gap-edu-1',
      topic: 'Renewal Conditions & Multi-Year Guarantee',
      unansweredQuestion: 'Is the $18,000 award renewable for Years 2, 3, and 4, and what exact college GPA/credit completion benchmarks are mandatory?',
      reasonMissingMatters: 'Assuming 4-year funding without confirmation risks an unexpected $54,000 tuition debt if funding expires after Year 1.',
      severity: 'critical',
      category: 'renewal_conditions',
      suggestedFollowUpPrompt: 'Does the Apex STEM Scholarship renew automatically or requires annual competitive re-application?',
      whereToVerify: 'Apex Scholarship Secretariat: awards@apexstemfoundation.org',
      absenceType: 'complete_omission'
    }
  ],
  outdatedFlags: [
    {
      id: 'out-edu-1',
      sourceId: 'src-edu-2',
      sourceTitle: 'Apex Scholarship Notice Archive (2024 Cycle)',
      claimedDate: '2024-01-10',
      currentCycleYear: 2026,
      supersededBySourceId: 'src-edu-1',
      supersededBySourceTitle: 'Apex Official 2026-2027 Scholarship Gazette',
      reason: 'Contains obsolete 2024 deadline (March 30, 2024) and old funding amount ($12k vs current $18k).',
      urgency: 'high',
      notAutomaticallyInvalidNotice: 'Historical document explains past terms, but 2026-2027 Gazette supersedes active dates.'
    }
  ],
  decisionFlipScenarios: [
    {
      id: 'flip-edu-1',
      missingFactor: 'Multi-Year Renewal vs Single-Year One-Off Award',
      currentApparentChoice: 'Enroll in Private Research University ($48,000 tuition) relying on Apex award to cover $18,000 every year.',
      flippedChoice: 'Decline private university and enroll in state university ($14,000 tuition) unless written 4-year renewal terms are verified.',
      triggerCondition: 'If the award is revealed to be a ONE-TIME $18k freshman grant with no renewal guarantee for sophomore through senior years.',
      priority: 'critical',
      impactScore: 10,
      urgencyScore: 9,
      flipProbability: 'high',
      explanation: 'Students routinely make binding college commitments believing awards recur for 4 years ($72k total). If it is one-time, the student faces an unexpected $54,000 debt burden over subsequent years.',
      whyItMatters: 'An unexpected $54k debt hole can force academic withdrawal or high-interest private student loans.',
      verifiedFactsReferenced: [
        'Award amount is $18,000 for 2026-2027 cycle (Source 1: Official Gazette).',
        'Enrollment must be full-time at minimum 15 credits (Source 1: Official Gazette).'
      ],
      assumptionsExposed: [
        'Assumed the award automatically renews for Year 2, 3, and 4 without a retention GPA clause.',
        'Assumed $72,000 total 4-year funding is secured.'
      ],
      isHypothetical: true
    }
  ],
  verificationChecklist: [
    {
      id: 'chk-edu-1',
      title: 'Obtain Official Renewal Policy & Retention GPA Schedule',
      description: 'Email Apex Scholarship Secretariat directly to confirm if the $18k award is 4-year renewable and what minimum college GPA is required.',
      priority: 'critical',
      targetOfficialSource: 'Apex Foundation Secretariat: awards@apexstemfoundation.org',
      completed: false,
      relatedGapId: 'gap-edu-1'
    }
  ]
};

// 2. BANKING AND FINANCE: Personal Loan Advertisement Diligence
export const BANKING_EXAMPLE: GapLensAnalysisResult = {
  researchGoal: 'What should I verify before accepting this 5.9% personal loan advertisement?',
  domain: 'banking_and_finance',
  detectedDomain: 'Banking, Credit & Consumer Lending',
  timestamp: '2026-10-31T20:10:00Z',
  isSampleData: true,
  sampleLabel: 'BENCHMARK EXAMPLE 2: Banking & Finance (Personal Loan Advertisement)',
  engineUsed: 'GAPLENS Domain-Agnostic Heuristic Engine',
  summary: {
    sourcesAnalyzedCount: 3,
    claimsCount: 9,
    contradictionsCount: 2,
    gapsIdentifiedCount: 3,
    outdatedSourcesCount: 0,
    criticalTasksCount: 3,
    evidenceCoverageConfidence: 74,
    blindSpotRiskScore: 84,
    limitationsNotice: 'NOTICE: Benchmark example demonstrating personal lending diligence. In lending agreements, Truth-in-Lending statutory disclosures always supersede advertising marketing copy.'
  },
  sources: [
    {
      id: 'src-bnk-1',
      title: 'Apex Credit Direct – Personal Loan Digital Advertisement Banner & Landing Page',
      url: 'https://apexcreditdirect.com/personal-loans/promotional',
      sourceType: 'advertisement',
      publicationDate: '2026-10-01',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Apex Credit Direct Marketing Division',
      isOfficial: true,
      content: `APEX CREDIT DIRECT – SPECIAL FINANCIAL CAMPAIGN:
Instant Approval Personal Loans up to $45,000!
Enjoy an ultra-low 5.9% fixed interest rate* to consolidate high-interest credit cards or remodel your home.
Zero processing fee promotion for applications submitted this week!
Funds deposited in your checking account in as little as 24 hours. No hidden charges. Fast, transparent, and hassle-free financing.`
    },
    {
      id: 'src-bnk-2',
      title: 'Apex Credit Direct – Formal Truth-in-Lending Disclosure & Borrower Agreement',
      url: 'https://apexcreditdirect.com/legal/borrower-disclosure-oct2026',
      sourceType: 'contract_or_agreement',
      publicationDate: '2026-10-05',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Apex Credit Direct Underwriting Department',
      isOfficial: true,
      content: `TRUTH IN LENDING ACT (TILA) DISCLOSURE STATEMENT:
1. Promotional Interest Rate: The advertised 5.9% fixed rate applies exclusively to the first six (6) billing cycles. Beginning in billing cycle 7, the interest rate converts to Variable APR calculated as WSJ Prime + 14.75% (Effective APR currently 23.25%).
2. Loan Origination Fee: A mandatory administrative origination fee of 4.75% ($1,900 on a $40,000 principal) is deducted directly from loan disbursement proceeds. Borrower receives net proceeds of $38,100 while principal debt balance remains $40,000.
3. Prepayment Restrictions: A prepayment penalty of 5.0% of the remaining principal balance will be assessed if the loan is paid off in full or partially refinanced within 36 months of loan origination.
4. Default Clause: If any scheduled installment is missed by more than 15 days, late fee of $45 applies and interest escalates to Maximum Penalty APR of 29.99%.`
    },
    {
      id: 'src-bnk-3',
      title: 'Consumer Financial Protection Forum – Apex Credit Direct Borrower Audits',
      url: 'https://creditforum-reviews.org/lenders/apex-credit-complaints',
      sourceType: 'forum_post',
      publicationDate: '2026-09-12',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Verified Consumer Borrowers & Debt Counselors',
      isOfficial: false,
      content: `Apex Credit Direct Alert:
Borrowers report severe surprise costs. Marketing screams '5.9% fixed rate with zero fees,' but customers discover the 5.9% is merely an introductory 6-month teaser that quadruples to over 23% for the remaining 30 months!
Furthermore, when users attempt to refinance or repay early to escape the high rate, they get hit with an unexpected $1,800 prepayment penalty fee!`
    }
  ],
  claims: [
    {
      id: 'cl-bnk-1',
      sourceId: 'src-bnk-1',
      sourceTitle: 'Apex Credit Direct – Personal Loan Digital Advertisement',
      sourceDate: '2026-10-01',
      category: 'interest_and_rates',
      claimText: 'Ad advertises ultra-low 5.9% fixed interest rate up to $45,000 with zero processing fees.',
      verbatimQuote: 'Enjoy an ultra-low 5.9% fixed interest rate* to consolidate high-interest credit cards. Zero processing fee promotion for applications submitted this week!',
      confidenceScore: 0.98,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Hero headline of promotional ad banner.'
    },
    {
      id: 'cl-bnk-2',
      sourceId: 'src-bnk-2',
      sourceTitle: 'Apex Credit Direct – Formal Truth-in-Lending Disclosure',
      sourceDate: '2026-10-05',
      category: 'interest_and_rates',
      claimText: '5.9% rate lasts only 6 months, then converts to 23.25% variable APR.',
      verbatimQuote: 'The advertised 5.9% fixed rate applies exclusively to the first six (6) billing cycles. Beginning in billing cycle 7, the interest rate converts to Variable APR calculated as WSJ Prime + 14.75% (Effective APR currently 23.25%).',
      confidenceScore: 0.99,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 1 of binding Truth-in-Lending statutory disclosure.'
    },
    {
      id: 'cl-bnk-3',
      sourceId: 'src-bnk-2',
      sourceTitle: 'Apex Credit Direct – Formal Truth-in-Lending Disclosure',
      sourceDate: '2026-10-05',
      category: 'terms_and_penalties',
      claimText: 'Mandatory 4.75% origination fee deducted from proceeds and 5% prepayment penalty for 36 months.',
      verbatimQuote: 'A mandatory administrative origination fee of 4.75% is deducted directly from loan disbursement proceeds. A prepayment penalty of 5.0% applies if paid off within 36 months.',
      confidenceScore: 0.99,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 2 & 3 of TILA disclosure document.'
    },
    {
      id: 'cl-bnk-4',
      sourceId: 'src-bnk-3',
      sourceTitle: 'Consumer Financial Protection Forum',
      sourceDate: '2026-09-12',
      category: 'interest_and_rates',
      claimText: 'Borrowers confirm interest quadruples after month 6 with $1,800 penalty on early payoff.',
      verbatimQuote: 'Introductory 6-month teaser that quadruples to over 23% for the remaining 30 months! When users attempt to repay early they get hit with an unexpected $1,800 prepayment penalty.',
      confidenceScore: 0.88,
      supportType: 'third_party_assertion',
      traceabilityExplanation: 'Verified consumer complaints corroborating TILA disclosure fine print.'
    }
  ],
  contradictions: [
    {
      id: 'con-bnk-1',
      topic: 'Interest Rate Stability: Fixed Rate vs Teaser Escalation',
      claimA: {
        id: 'cl-bnk-1',
        sourceId: 'src-bnk-1',
        sourceTitle: 'Apex Loan Digital Ad Banner',
        category: 'interest_and_rates',
        claimText: 'Promotes "5.9% fixed interest rate with zero processing fees".',
        verbatimQuote: 'Enjoy an ultra-low 5.9% fixed interest rate*... Zero processing fee promotion!',
        confidenceScore: 0.98,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Ad headline.'
      },
      claimB: {
        id: 'cl-bnk-2',
        sourceId: 'src-bnk-2',
        sourceTitle: 'Truth-in-Lending Disclosure Agreement',
        category: 'interest_and_rates',
        claimText: 'Disclosure mandates rate jumps to 23.25% variable APR after month 6 with 4.75% fee.',
        verbatimQuote: 'The advertised 5.9% fixed rate applies exclusively to the first six (6) billing cycles... then converts to 23.25% Variable APR.',
        confidenceScore: 0.99,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Section 1 of TILA legal agreement.'
      },
      type: 'direct_factual_clash',
      explanation: 'The digital marketing banner falsely implies a permanent fixed 5.9% rate, whereas the legal disclosure specifies it is a temporary 6-month promotional teaser that skyrockets by 294% to 23.25% variable APR.',
      whyItMatters: 'A borrower seeking relief from an 18% credit card who accepts this loan will end up paying an even higher 23.25% rate for years 2 and 3!',
      sourceDateA: '2026-10-01',
      sourceDateB: '2026-10-05',
      isDateDrivenDifference: false,
      isConfirmedConflict: true,
      evidenceStrength: 'high'
    },
    {
      id: 'con-bnk-2',
      topic: 'Processing Fee: Zero Promotion vs 4.75% Deduction',
      claimA: {
        id: 'cl-bnk-1',
        sourceId: 'src-bnk-1',
        sourceTitle: 'Apex Loan Digital Ad Banner',
        category: 'financial_award',
        claimText: 'Promises zero processing fees.',
        verbatimQuote: 'Zero processing fee promotion for applications submitted this week! No hidden charges.',
        confidenceScore: 0.98,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Ad copy.'
      },
      claimB: {
        id: 'cl-bnk-3',
        sourceId: 'src-bnk-2',
        sourceTitle: 'Truth-in-Lending Disclosure Agreement',
        category: 'terms_and_penalties',
        claimText: 'Mandates 4.75% ($1,900 on $40k) origination fee deducted from principal.',
        verbatimQuote: 'A mandatory administrative origination fee of 4.75% is deducted directly from loan disbursement proceeds.',
        confidenceScore: 0.99,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Section 2 of TILA disclosure.'
      },
      type: 'direct_factual_clash',
      explanation: 'Marketing claims zero fees, but legal contract deducts $1,900 from disbursement as an "administrative origination fee".',
      whyItMatters: 'If you need exactly $40,000 to pay off debts, you will receive only $38,100, leaving a $1,900 immediate cash deficit while paying interest on the full $40k.',
      sourceDateA: '2026-10-01',
      sourceDateB: '2026-10-05',
      isDateDrivenDifference: false,
      isConfirmedConflict: true,
      evidenceStrength: 'high'
    }
  ],
  gaps: [
    {
      id: 'gap-bnk-1',
      topic: 'Total Lifetime Repayment Amount & Compounding Schedule',
      unansweredQuestion: 'What is the exact Total Finance Charge and Lifetime Repayment Amount across the entire 36-month amortization schedule when factoring the 23.25% variable rate?',
      reasonMissingMatters: 'Marketing omits total cost of credit. Without the full amortized schedule, borrowers cannot determine whether this loan saves or costs more money than their current credit cards.',
      severity: 'critical',
      category: 'interest_and_rates',
      suggestedFollowUpPrompt: 'Request the complete 36-month monthly payment amortization table showing total principal and interest paid.',
      whereToVerify: 'Lender Loan Estimate / Consumer Financial Protection Bureau (CFPB) Loan Calculator.',
      absenceType: 'complete_omission'
    },
    {
      id: 'gap-bnk-2',
      topic: 'Mandatory Binding Arbitration & Class Action Waiver',
      unansweredQuestion: 'Does the loan agreement waive borrower rights to jury trial, dispute arbitration, or class-action remedies in cases of predatory marketing?',
      reasonMissingMatters: 'Lenders commonly include mandatory arbitration clauses preventing consumers from joining collective litigation if deceptive practices occur.',
      severity: 'high',
      category: 'terms_and_penalties',
      suggestedFollowUpPrompt: 'Inquire whether borrower can opt out of mandatory arbitration within 30 days of loan origination.',
      whereToVerify: 'Section 14 of Master Promissory Note (Dispute Resolution Agreement).',
      absenceType: 'complete_omission'
    }
  ],
  outdatedFlags: [],
  decisionFlipScenarios: [
    {
      id: 'flip-bnk-1',
      missingFactor: 'Post-Teaser Rate Jump (5.9% ➔ 23.25%) + 5% Prepayment Penalty Lock-in',
      currentApparentChoice: 'Accept $40,000 personal loan believing it consolidates 18% credit cards at a low, fixed 5.9% rate.',
      flippedChoice: 'Decline loan offer and keep existing debts or seek a transparent credit union loan with a genuine fixed APR and zero prepayment penalties.',
      triggerCondition: 'If the interest rate explodes to 23.25% at Month 7 and the 5% prepayment penalty makes it economically impossible to refinance out of it for 3 years.',
      priority: 'critical',
      impactScore: 10,
      urgencyScore: 10,
      flipProbability: 'high',
      explanation: 'Over 36 months, paying 5.9% for 6 months and 23.25% for 30 months costs approximately $14,800 in interest plus $1,900 in fees ($16,700 total), whereas keeping existing 18% credit cards would have cost only $11,800. The loan increases debt by $4,900!',
      whyItMatters: 'Taking this loan leaves the borrower in a worse financial position with higher monthly payments and a 3-year penalty trap.',
      verifiedFactsReferenced: [
        'Ad states 5.9% fixed rate (Source 1).',
        'TILA disclosure reveals 5.9% ends after month 6 and converts to 23.25% (Source 2).',
        'TILA mandates 4.75% origination fee and 5% prepayment penalty within 36 months (Source 2).'
      ],
      assumptionsExposed: [
        'Assumed the 5.9% rate lasted the lifetime of the loan.',
        'Assumed you could simply refinance or pay off early if rates rose.'
      ],
      isHypothetical: true
    }
  ],
  verificationChecklist: [
    {
      id: 'chk-bnk-1',
      title: 'Review the Formal Truth in Lending Act (TILA) Disclosure Before Signing',
      description: 'Check Box 1 for Annual Percentage Rate (APR) to confirm lifetime rate and check for prepayment penalty boxes.',
      priority: 'critical',
      targetOfficialSource: 'Formal TILA Disclosure (Apex Credit Direct Compliance Office)',
      completed: false,
      relatedContradictionId: 'con-bnk-1'
    },
    {
      id: 'chk-bnk-2',
      title: 'Calculate Net Disbursed Funds Against Settlement Needs',
      description: 'Confirm whether the $1,900 origination fee leaves you with sufficient cash to pay off debt balances.',
      priority: 'critical',
      targetOfficialSource: 'Loan Proceeds Disbursement Schedule',
      completed: false,
      relatedContradictionId: 'con-bnk-2'
    }
  ]
};

// 3. EMPLOYMENT AND JOBS: Tech Job Advertisement & Equity Diligence
export const EMPLOYMENT_EXAMPLE: GapLensAnalysisResult = {
  researchGoal: 'What should I verify before accepting this Senior AI Engineer job advertisement and offer?',
  domain: 'employment_and_jobs',
  detectedDomain: 'Employment, Compensation & Equity Incentives',
  timestamp: '2026-10-31T20:20:00Z',
  isSampleData: true,
  sampleLabel: 'BENCHMARK EXAMPLE 3: Employment (Job Advertisement & Offer)',
  engineUsed: 'GAPLENS Domain-Agnostic Heuristic Engine',
  summary: {
    sourcesAnalyzedCount: 3,
    claimsCount: 8,
    contradictionsCount: 2,
    gapsIdentifiedCount: 3,
    outdatedSourcesCount: 0,
    criticalTasksCount: 3,
    evidenceCoverageConfidence: 75,
    blindSpotRiskScore: 80,
    limitationsNotice: 'NOTICE: Benchmark example demonstrating executive/tech employment diligence. Verbal recruiter representations are legally superseded by integrated offer agreements.'
  },
  sources: [
    {
      id: 'src-job-1',
      title: 'HyperScale AI – Public Job Advertisement & Career Page',
      url: 'https://hyperscale-ai.com/careers/senior-infrastructure',
      sourceType: 'advertisement',
      publicationDate: '2026-10-15',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'HyperScale AI Talent Acquisition',
      isOfficial: true,
      content: `HYPERSCALE AI CAREERS:
Senior AI Infrastructure Engineer:
Compensation: $175,000 - $210,000 Base Salary + Generous Equity Package ($300,000+ estimated valuation).
Benefits: 100% remote freedom from anywhere worldwide, unlimited PTO, top-tier healthcare.
Join our rocketship as we scale frontier generative infrastructure!`
    },
    {
      id: 'src-job-2',
      title: 'HyperScale AI – Formal Offer Letter & Restrictive Covenant Agreement',
      url: 'https://hyperscale-ai.internal/hr/formal-offer-alex',
      sourceType: 'contract_or_agreement',
      publicationDate: '2026-10-24',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'HyperScale AI Legal & People Operations',
      isOfficial: true,
      content: `CONFIDENTIAL EMPLOYMENT AGREEMENT:
1. Compensation: Annual base salary of $175,000. 40,000 Incentive Stock Options (ISOs) subject to standard 4-year vesting with a 1-year cliff.
2. Restrictive Covenants: Employee agrees to an 18-month worldwide post-employment non-compete covenant prohibiting direct or indirect employment with any entity developing AI models, machine learning infrastructure, or cloud compute solutions.
3. At-Will Clause: Employment is at-will. Company may terminate employment at any time with or without notice or cause, with zero severance entitlement.
4. Entire Agreement: This agreement supersedes all prior verbal statements, marketing brochures, or recruiter representations.`
    },
    {
      id: 'src-job-3',
      title: 'Blind & Glassdoor – HyperScale AI Engineering Compensation Reviews',
      url: 'https://teamblind.com/company/hyperscale-ai/reviews',
      sourceType: 'forum_post',
      publicationDate: '2026-08-14',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Verified HyperScale AI Senior Engineers',
      isOfficial: false,
      content: `Engineering Staff Warning on HyperScale AI:
Option plan documents enforce a strict 90-day post-termination exercise window (PTEW). If you leave, you must buy your shares within 90 days or lose all vested options.
Furthermore, Series A & B investors hold 2x participating preferred shares with senior liquidation rights, meaning common stock receives nothing unless company sells for over $400M.`
    }
  ],
  claims: [
    {
      id: 'cl-job-1',
      sourceId: 'src-job-1',
      sourceTitle: 'HyperScale AI – Job Advertisement',
      sourceDate: '2026-10-15',
      category: 'compensation',
      claimText: 'Advertises $175k-$210k base plus estimated $300k+ equity and 100% remote freedom.',
      verbatimQuote: 'Senior AI Infrastructure Engineer: $175,000 - $210,000 Base Salary + Generous Equity Package ($300,000+ estimated valuation). 100% remote freedom from anywhere worldwide.',
      confidenceScore: 0.98,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Public job advert text.'
    },
    {
      id: 'cl-job-2',
      sourceId: 'src-job-2',
      sourceTitle: 'Formal Offer Letter & Restrictive Covenants',
      sourceDate: '2026-10-24',
      category: 'terms_and_penalties',
      claimText: 'Offer contains 18-month worldwide non-compete and specifies $175,000 base (bottom of ad range).',
      verbatimQuote: 'Annual base salary of $175,000. Employee agrees to an 18-month worldwide post-employment non-compete covenant prohibiting employment with any entity developing AI models or cloud compute.',
      confidenceScore: 0.99,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 1 & 2 of legal offer agreement.'
    },
    {
      id: 'cl-job-3',
      sourceId: 'src-job-3',
      sourceTitle: 'Blind Engineering Reviews',
      sourceDate: '2026-08-14',
      category: 'terms_and_penalties',
      claimText: 'Option plan enforces strict 90-day exercise window on departure and 2x senior liquidation preference.',
      verbatimQuote: 'Option plan documents enforce a strict 90-day post-termination exercise window (PTEW). Series A & B investors hold 2x participating preferred shares.',
      confidenceScore: 0.85,
      supportType: 'third_party_assertion',
      traceabilityExplanation: 'Verified employee forum disclosures.'
    }
  ],
  contradictions: [
    {
      id: 'con-job-1',
      topic: 'Career Mobility vs Worldwide 18-Month Non-Compete',
      claimA: {
        id: 'cl-job-1',
        sourceId: 'src-job-1',
        sourceTitle: 'HyperScale Careers Page',
        category: 'compensation',
        claimText: 'Advertises flexible remote career freedom.',
        verbatimQuote: '100% remote freedom from anywhere worldwide. Unlimited PTO.',
        confidenceScore: 0.98,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Careers page ad.'
      },
      claimB: {
        id: 'cl-job-2',
        sourceId: 'src-job-2',
        sourceTitle: 'Formal Offer Agreement',
        category: 'terms_and_penalties',
        claimText: 'Enforces strict 18-month worldwide non-compete prohibiting work in entire AI sector upon leaving.',
        verbatimQuote: 'Employee agrees to an 18-month worldwide post-employment non-compete covenant prohibiting employment with any entity developing AI models or cloud compute.',
        confidenceScore: 0.99,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Section 2 of legal contract.'
      },
      type: 'direct_factual_clash',
      explanation: 'While the public job ad promises unrestricted career freedom, the binding contract handcuffs the engineer for 1.5 years worldwide from working anywhere in AI upon departure.',
      whyItMatters: 'If you leave after 1 year, you are legally barred from practicing your profession in the entire AI industry for 18 months without severance.',
      isDateDrivenDifference: false,
      isConfirmedConflict: true,
      evidenceStrength: 'high'
    }
  ],
  gaps: [
    {
      id: 'gap-job-1',
      topic: 'Current 409A Fair Market Value Strike Price',
      unansweredQuestion: 'What is the exact per-share exercise strike price and the total fully diluted share capitalization count for the 40,000 options?',
      reasonMissingMatters: 'Without the strike price, it is mathematically impossible to calculate how much money you must pay to exercise or whether the options have positive value.',
      severity: 'critical',
      category: 'compensation',
      suggestedFollowUpPrompt: 'What is the current 409A strike price and the total fully diluted share count of the company?',
      whereToVerify: 'HyperScale AI Chief Financial Officer / Carta Cap Table Administrator.',
      absenceType: 'complete_omission'
    }
  ],
  outdatedFlags: [],
  decisionFlipScenarios: [
    {
      id: 'flip-job-1',
      missingFactor: '18-Month Non-Compete Covenant + 90-Day Option Exercise Cliff',
      currentApparentChoice: 'Accept HyperScale AI offer ($175k base + equity) believing you can build your career in AI and move freely if culture turns toxic.',
      flippedChoice: 'Decline offer or insist on total deletion of the 18-month non-compete clause and demand a 5-year post-termination exercise window.',
      triggerCondition: 'If the company refuses to strike the 18-month non-compete and enforces the 90-day window, forcing you to forfeit all vested shares or spend $35,000 while unemployed for 18 months.',
      priority: 'critical',
      impactScore: 10,
      urgencyScore: 10,
      flipProbability: 'high',
      explanation: 'Signing a worldwide 18-month non-compete in a rapidly evolving field like AI effectively freezes your career earnings and prevents finding employment in your core expertise.',
      whyItMatters: 'An unenforceable or aggressive non-compete leads to prolonged unemployment or expensive litigation.',
      verifiedFactsReferenced: [
        'Job ad advertised remote freedom and $300k equity (Source 1).',
        'Offer contract specifies 18-month worldwide non-compete (Source 2).'
      ],
      assumptionsExposed: [
        'Assumed job ads reflect legal terms.',
        'Assumed you could easily transition to another AI startup if things did not work out.'
      ],
      isHypothetical: true
    }
  ],
  verificationChecklist: [
    {
      id: 'chk-job-1',
      title: 'Strike Out or Narrow the 18-Month Worldwide Non-Compete Covenant',
      description: 'Negotiate the removal of Section 2 before signing, or consult an employment lawyer in your jurisdiction.',
      priority: 'critical',
      targetOfficialSource: 'HyperScale AI Legal Counsel / General Counsel',
      completed: false,
      relatedContradictionId: 'con-job-1'
    }
  ]
};

// 4. INSURANCE: Health and Critical Illness Policy Diligence
export const INSURANCE_EXAMPLE: GapLensAnalysisResult = {
  researchGoal: 'What should I verify before buying this health and critical illness insurance policy advertisement?',
  domain: 'insurance',
  detectedDomain: 'Health, Medical & Critical Illness Insurance',
  timestamp: '2026-10-31T20:30:00Z',
  isSampleData: true,
  sampleLabel: 'BENCHMARK EXAMPLE 4: Insurance (Health Policy Advertisement & Wordings)',
  engineUsed: 'GAPLENS Domain-Agnostic Heuristic Engine',
  summary: {
    sourcesAnalyzedCount: 3,
    claimsCount: 9,
    contradictionsCount: 2,
    gapsIdentifiedCount: 3,
    outdatedSourcesCount: 0,
    criticalTasksCount: 3,
    evidenceCoverageConfidence: 78,
    blindSpotRiskScore: 86,
    limitationsNotice: 'NOTICE: Benchmark example demonstrating insurance diligence. Policy wording definitions and statutory exclusions strictly govern over promotional sales brochures.'
  },
  sources: [
    {
      id: 'src-ins-1',
      title: 'ShieldCare Health – Platinum Cover Sales Brochure & Digital Advertisement',
      url: 'https://shieldcare-insurance.com/plans/platinum-cashless',
      sourceType: 'advertisement',
      publicationDate: '2026-09-01',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'ShieldCare Marketing Group',
      isOfficial: true,
      content: `SHIELDCARE PLATINUM HEALTH COVER:
100% Cashless Hospitalization Coverage up to $500,000!
Complete peace of mind for you and your family. Covers all major surgeries, cancer treatments, ICU care, doctor fees, and medications.
Zero room rent capping – choose the hospital room of your choice!
Over 10,000 network hospitals worldwide with 60-minute cashless claim approval.`
    },
    {
      id: 'src-ins-2',
      title: 'ShieldCare Platinum – Policy Wordings, Benefit Schedule & Exclusions Document',
      url: 'https://shieldcare-insurance.com/legal/policy-wording-v2026',
      sourceType: 'contract_or_agreement',
      publicationDate: '2026-09-10',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'ShieldCare Underwriting & Actuarial Division',
      isOfficial: true,
      content: `SHIELDCARE MASTER POLICY WORDINGS:
1. Room Rent Sub-Limit: Daily room rent is capped at exactly 1.0% of Sum Insured ($1,500/day for $500k policy).
2. Proportionate Deductions Clause (Section 6.2): If policyholder chooses a room exceeding the room rent sub-limit, ALL associated medical and surgical expenses (including surgeon fees, anesthesia, diagnostic imaging, and ICU monitoring) shall be reduced proportionately by the ratio of allowed room rent to actual room rent incurred.
3. Pre-Existing Conditions: A mandatory 36-month waiting period applies to all pre-existing chronic conditions (including hypertension, diabetes, asthma, thyroid). Zero coverage is provided for claims related to pre-existing conditions prior to month 37.
4. Co-Payment: A mandatory 20% co-payment is deducted from every approved claim if treatment is received at any Tier 1 metropolitan hospital.`
    },
    {
      id: 'src-ins-3',
      title: 'National Insurance Ombudsman – Policyholder Complaint & Claim Denial Report',
      url: 'https://insurance-ombudsman-reports.org/cases/shieldcare-deductions',
      sourceType: 'official_notice',
      publicationDate: '2026-07-20',
      accessedDate: '2026-10-31',
      authorOrPublisher: 'Office of the Consumer Insurance Ombudsman',
      isOfficial: true,
      content: `Consumer Advisory on Health Insurance Proportionate Deductions:
In 2025, 64% of claim disputes involving ShieldCare arose from Section 6.2 (Proportionate Room Rent Deductions).
Patients admitted for cardiac surgeries believing they had $500,000 coverage chose a $2,500/day private room instead of the $1,500 sub-limit. As a consequence of the proportionate clause, the insurer deducted 40% from the surgeon's $45,000 operating fee, forcing the family to pay $26,000 out-of-pocket!`
    }
  ],
  claims: [
    {
      id: 'cl-ins-1',
      sourceId: 'src-ins-1',
      sourceTitle: 'ShieldCare Health – Sales Brochure & Ad',
      sourceDate: '2026-09-01',
      category: 'coverage_and_benefits',
      claimText: 'Brochure advertises 100% cashless coverage up to $500,000 with "Zero room rent capping".',
      verbatimQuote: '100% Cashless Hospitalization Coverage up to $500,000! Zero room rent capping – choose the hospital room of your choice!',
      confidenceScore: 0.98,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Promotional marketing brochure header.'
    },
    {
      id: 'cl-ins-2',
      sourceId: 'src-ins-2',
      sourceTitle: 'ShieldCare Platinum – Policy Wordings Document',
      sourceDate: '2026-09-10',
      category: 'clauses_and_exclusions',
      claimText: 'Policy enforces 1% room rent cap and slashes ALL hospital costs proportionately if room limit is exceeded.',
      verbatimQuote: 'Daily room rent is capped at 1.0% of Sum Insured. If policyholder chooses a room exceeding sub-limit, ALL associated medical and surgical expenses shall be reduced proportionately.',
      confidenceScore: 0.99,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 1 & 6.2 of legal policy contract.'
    },
    {
      id: 'cl-ins-3',
      sourceId: 'src-ins-2',
      sourceTitle: 'ShieldCare Platinum – Policy Wordings Document',
      sourceDate: '2026-09-10',
      category: 'waiting_periods',
      claimText: 'Mandates 36-month waiting period on pre-existing diseases and 20% co-payment in metro hospitals.',
      verbatimQuote: 'A mandatory 36-month waiting period applies to all pre-existing chronic conditions. A mandatory 20% co-payment is deducted for treatments in Tier 1 hospitals.',
      confidenceScore: 0.99,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Section 3 & 4 of policy wording.'
    },
    {
      id: 'cl-ins-4',
      sourceId: 'src-ins-3',
      sourceTitle: 'National Insurance Ombudsman Report',
      sourceDate: '2026-07-20',
      category: 'clauses_and_exclusions',
      claimText: 'Ombudsman confirmed patients paid $26,000 out-of-pocket due to proportionate room rent deduction clause.',
      verbatimQuote: 'Insurer deducted 40% from the surgeon\'s $45,000 operating fee, forcing the family to pay $26,000 out-of-pocket!',
      confidenceScore: 0.96,
      supportType: 'direct_statement',
      traceabilityExplanation: 'Official regulatory audit case study.'
    }
  ],
  contradictions: [
    {
      id: 'con-ins-1',
      topic: 'Room Rent Capping: "Zero Capping" vs Proportionate Slash',
      claimA: {
        id: 'cl-ins-1',
        sourceId: 'src-ins-1',
        sourceTitle: 'ShieldCare Sales Ad Banner',
        category: 'coverage_and_benefits',
        claimText: 'Brochure promises "Zero room rent capping – choose room of your choice".',
        verbatimQuote: 'Zero room rent capping – choose the hospital room of your choice!',
        confidenceScore: 0.98,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Sales brochure claim.'
      },
      claimB: {
        id: 'cl-ins-2',
        sourceId: 'src-ins-2',
        sourceTitle: 'Official Policy Wordings',
        category: 'clauses_and_exclusions',
        claimText: 'Policy contract strictly caps room at 1% and applies punitive proportionate deduction to entire hospital bill.',
        verbatimQuote: 'Daily room rent is capped at 1.0% of Sum Insured... ALL associated medical expenses shall be reduced proportionately.',
        confidenceScore: 0.99,
        supportType: 'direct_statement',
        traceabilityExplanation: 'Section 6.2 of policy wording.'
      },
      type: 'direct_factual_clash',
      explanation: 'The marketing ad promises zero room capping, but the legally binding policy wording caps room rent at 1% and uses a hidden "proportionate deduction" rule to slash payouts across all doctor, surgeon, and diagnostic fees.',
      whyItMatters: 'If you exceed the room rate by even $500/day during a major surgery, the insurer deducts 30%–50% from the ENTIRE hospital bill, leaving you with tens of thousands of dollars in surprise debt.',
      sourceDateA: '2026-09-01',
      sourceDateB: '2026-09-10',
      isDateDrivenDifference: false,
      isConfirmedConflict: true,
      evidenceStrength: 'high'
    }
  ],
  gaps: [
    {
      id: 'gap-ins-1',
      topic: 'Non-Payable Medical Consumables Exclusions List',
      unansweredQuestion: 'Which hospital consumables (PPE kits, surgical gloves, syringes, administrative handling fees) are excluded from cashless claim settlement?',
      reasonMissingMatters: 'Consumables routinely constitute 15% to 25% of modern hospital bills. If unstated or excluded, policyholders face thousands in out-of-pocket expenses even under 100% cashless claims.',
      severity: 'critical',
      category: 'clauses_and_exclusions',
      suggestedFollowUpPrompt: 'Request the complete Schedule of Non-Payable Consumable Items and administrative exclusions.',
      whereToVerify: 'ShieldCare Claims Adjudication Guidelines / IRDAI Standard Exclusions Annexure.',
      absenceType: 'complete_omission'
    },
    {
      id: 'gap-ins-2',
      topic: 'Age-Band Premium Escalation Matrix (Age 50+)',
      unansweredQuestion: 'What is the exact contractual premium increase percentage when the insured crosses age brackets (e.g. at ages 45, 50, 55, and 60)?',
      reasonMissingMatters: 'Insurers often offer low introductory premiums to young policyholders but hike premiums by 150% after age 50, forcing senior citizens to surrender policies after paying years of premiums.',
      severity: 'high',
      category: 'interest_and_rates',
      suggestedFollowUpPrompt: 'Provide the official 10-year actuarial premium rate revision grid across age bands.',
      whereToVerify: 'Actuarial Prospectus filed with National Insurance Regulator.',
      absenceType: 'complete_omission'
    }
  ],
  outdatedFlags: [],
  decisionFlipScenarios: [
    {
      id: 'flip-ins-1',
      missingFactor: 'Proportionate Room Rent Deduction Rule + Mandatory 20% Metro Co-Pay',
      currentApparentChoice: 'Purchase ShieldCare policy paying $1,200 annual premium believing you have complete $500,000 cashless protection.',
      flippedChoice: 'Reject ShieldCare policy immediately and select a policy with "No Room Rent Sub-Limit" and zero co-payment.',
      triggerCondition: 'If a $60,000 emergency surgery results in a $27,000 out-of-pocket hospital bill because room sub-limits triggered proportionate deductions across all surgeon fees.',
      priority: 'critical',
      impactScore: 10,
      urgencyScore: 10,
      flipProbability: 'high',
      explanation: 'Under Section 6.2, exceeding the $1,500 room rate triggers a mathematical ratio reduction across all hospital fees, plus the 20% metro co-pay, destroying the very purpose of having health insurance.',
      whyItMatters: 'You pay thousands in premiums for years, yet still face bankruptcy when serious illness strikes.',
      verifiedFactsReferenced: [
        'Ad promises 100% cashless up to $500,000 (Source 1).',
        'Policy Section 6.2 enforces proportionate reduction on all hospital expenses (Source 2).',
        'Ombudsman report documents real victims paying $26,000 out-of-pocket (Source 3).'
      ],
      assumptionsExposed: [
        'Assumed "Zero room rent capping" in the brochure meant you could choose any room without penalty.',
        'Assumed a $500,000 policy covered 100% of surgery costs.'
      ],
      isHypothetical: true
    }
  ],
  verificationChecklist: [
    {
      id: 'chk-ins-1',
      title: 'Audit Section 6.2 for Proportionate Deduction Clauses in Policy Wordings',
      description: 'Confirm in writing with the insurer whether choosing an executive or single room reduces reimbursement on doctors, ICU, and surgical fees.',
      priority: 'critical',
      targetOfficialSource: 'ShieldCare Underwriting Office (Policy Wordings Document)',
      completed: false,
      relatedContradictionId: 'con-ins-1'
    },
    {
      id: 'chk-ins-2',
      title: 'Verify Pre-Existing Disease (PED) Waiting Period and Disclosure Record',
      description: 'Disclose all prior consultations in writing to prevent claim repudiation under the 36-month clause.',
      priority: 'critical',
      targetOfficialSource: 'Medical Underwriting Declaration Form',
      completed: false,
      relatedGapId: 'gap-ins-1'
    }
  ]
};

export const ALL_BENCHMARK_EXAMPLES = {
  education: SCHOLARSHIP_EXAMPLE,
  banking_and_finance: BANKING_EXAMPLE,
  employment_and_jobs: EMPLOYMENT_EXAMPLE,
  insurance: INSURANCE_EXAMPLE,
};

export const BLANK_ANALYSIS_STATE: GapLensAnalysisResult = {
  researchGoal: '',
  domain: 'auto_detect',
  detectedDomain: 'Auto Detect (Awaiting Input)',
  timestamp: new Date().toISOString(),
  isSampleData: false,
  engineUsed: 'GAPLENS Universal Information Gap Engine',
  summary: {
    sourcesAnalyzedCount: 0,
    claimsCount: 0,
    contradictionsCount: 0,
    gapsIdentifiedCount: 0,
    outdatedSourcesCount: 0,
    criticalTasksCount: 0,
    evidenceCoverageConfidence: 0,
    blindSpotRiskScore: 0,
    limitationsNotice: 'No documents analyzed yet. Enter a decision question and add source documents, or select one of the 4 benchmark test scenarios.'
  },
  sources: [],
  claims: [],
  contradictions: [],
  gaps: [],
  outdatedFlags: [],
  decisionFlipScenarios: [],
  verificationChecklist: []
};
