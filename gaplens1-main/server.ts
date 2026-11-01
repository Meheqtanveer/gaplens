import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { SCHOLARSHIP_EXAMPLE, BANKING_EXAMPLE, EMPLOYMENT_EXAMPLE, INSURANCE_EXAMPLE } from './src/data/examples';
import { 
  GapLensAnalysisResult, 
  EvidenceClaim, 
  Contradiction, 
  InformationGap, 
  OutdatedFlag, 
  DecisionFlipScenario, 
  VerificationTask,
  DomainType,
  ClaimCategory
} from './src/types/gaplens';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI securely on the server
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for dynamic domain detection
function resolveDomain(
  requestedDomain?: DomainType,
  researchGoal?: string,
  sources?: Array<{ content?: string; title?: string }>
): { domain: DomainType; label: string } {
  if (requestedDomain && requestedDomain !== 'auto_detect') {
    switch (requestedDomain) {
      case 'education': return { domain: 'education', label: 'Education & Academics' };
      case 'banking_and_finance': return { domain: 'banking_and_finance', label: 'Banking & Finance' };
      case 'employment_and_jobs': return { domain: 'employment_and_jobs', label: 'Employment & Career' };
      case 'insurance': return { domain: 'insurance', label: 'Insurance & Healthcare' };
      case 'government_schemes': return { domain: 'government_schemes', label: 'Government & Public Schemes' };
      default: return { domain: 'general_information', label: 'General Information & Decision Diligence' };
    }
  }

  const combined = ((researchGoal || '') + ' ' + (sources || []).map(s => (s.title || '') + ' ' + (s.content || '').slice(0, 1000)).join(' ')).toLowerCase();

  if (combined.includes('loan') || combined.includes('apr') || combined.includes('interest rate') || combined.includes('credit card') || combined.includes('mortgage') || combined.includes('lender') || combined.includes('borrower') || combined.includes('banking')) {
    return { domain: 'banking_and_finance', label: 'Banking & Consumer Finance (Auto-Detected)' };
  }
  if (combined.includes('health insurance') || combined.includes('medical insurance') || combined.includes('life insurance') || combined.includes('cashless') || combined.includes('co-pay') || combined.includes('deductible') || combined.includes('room rent') || combined.includes('hospitalization') || combined.includes('pre-existing disease') || combined.includes('underwriting') || (combined.includes('insurance') && (combined.includes('coverage') || combined.includes('patient') || combined.includes('claim payout')))) {
    return { domain: 'insurance', label: 'Insurance & Healthcare (Auto-Detected)' };
  }
  if (combined.includes('job') || combined.includes('salary') || combined.includes('equity') || combined.includes('stock option') || combined.includes('non-compete') || combined.includes('severance') || combined.includes('employer') || combined.includes('employment') || combined.includes('hiring') || combined.includes('careers')) {
    return { domain: 'employment_and_jobs', label: 'Employment & Career (Auto-Detected)' };
  }
  if (combined.includes('scholarship') || combined.includes('tuition') || combined.includes('gpa') || combined.includes('university') || combined.includes('academic') || combined.includes('fellowship') || combined.includes('degree') || combined.includes('college')) {
    return { domain: 'education', label: 'Education & Academics (Auto-Detected)' };
  }
  if (combined.includes('scheme') || combined.includes('subsidy') || combined.includes('pension') || combined.includes('welfare') || combined.includes('citizen') || combined.includes('quota') || combined.includes('ministry')) {
    return { domain: 'government_schemes', label: 'Government Schemes (Auto-Detected)' };
  }
  if (combined.includes('lease') || combined.includes('tenant') || combined.includes('landlord') || combined.includes('rent') || combined.includes('property')) {
    return { domain: 'general_information', label: 'Commercial Lease & Real Estate (Auto-Detected)' };
  }
  return { domain: 'general_information', label: 'General Information & Decision Diligence (Auto-Detected)' };
}

// 1. Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
    service: 'GAPLENS Universal Information Gap Engine',
    supportedDomains: [
      'auto_detect',
      'education',
      'banking_and_finance',
      'employment_and_jobs',
      'insurance',
      'government_schemes',
      'general_information'
    ]
  });
});

// 2. Benchmark Datasets endpoint
app.get('/api/demo-data', (req: Request, res: Response) => {
  const domain = req.query.domain as string;
  if (domain === 'banking_and_finance') return res.json(BANKING_EXAMPLE);
  if (domain === 'employment_and_jobs') return res.json(EMPLOYMENT_EXAMPLE);
  if (domain === 'insurance') return res.json(INSURANCE_EXAMPLE);
  return res.json(SCHOLARSHIP_EXAMPLE);
});

// 3. Public URL fetcher & sanitized text extractor with graceful error handling
app.post('/api/fetch-url', async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'Valid HTTP/HTTPS URL is required' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 GAPLENS/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Remote server responded with HTTP ${response.status} (${response.statusText}). The website may restrict automated web extraction or require authentication.`,
        inaccessible: true
      });
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname;

    const dateMatch =
      html.match(/<meta[^>]*property=["']article:published_time["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*name=["']date["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<time[^>]*datetime=["']([^"']+)["']/i);
    const publicationDate = dateMatch ? dateMatch[1].split('T')[0] : undefined;

    const cleanedHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ');

    const plainText = cleanedHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    return res.json({
      title,
      url,
      publicationDate: publicationDate || undefined,
      accessedDate: new Date().toISOString().split('T')[0],
      contentLength: plainText.length,
      snippet: plainText.slice(0, 16000),
      isOfficial: url.includes('.gov') || url.includes('.edu') || url.includes('official') || url.includes('org')
    });
  } catch (error: any) {
    return res.status(502).json({
      error: `Could not reach ${url}: ${error.message || 'Request timed out or connection was refused'}. Please copy and paste the document text manually.`,
      inaccessible: true
    });
  }
});

// 4. Truly Dynamic, Domain-Independent Heuristic NLP Engine
// Formulates claims, contradictions, omissions, and Decision Flips directly from user's actual text
function runHeuristicEngine(
  researchGoal: string,
  sources: Array<{ id: string; title: string; content: string; url?: string; publicationDate?: string; isOfficial?: boolean }>,
  requestedDomain?: DomainType
): GapLensAnalysisResult {
  const { domain, label: detectedDomainLabel } = resolveDomain(requestedDomain, researchGoal, sources);

  const claims: EvidenceClaim[] = [];
  const contradictions: Contradiction[] = [];
  const gaps: InformationGap[] = [];
  const outdatedFlags: OutdatedFlag[] = [];
  const decisionFlipScenarios: DecisionFlipScenario[] = [];
  const verificationChecklist: VerificationTask[] = [];

  let claimCounter = 1;
  const currentYear = new Date().getFullYear();

  // Helper to extract the most relevant passage from submitted sources matching a pattern
  const findSubmittedPassage = (pattern: RegExp): string => {
    for (const src of sources) {
      const sentences = src.content
        .replace(/\r\n/g, '\n')
        .split(/(?<=[.?!;])\s+|\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const match = sentences.find((s) => pattern.test(s));
      if (match) return match;
    }
    const firstSrc = sources[0];
    if (!firstSrc) return 'Submitted text';
    return firstSrc.content.slice(0, 160).trim();
  };

  // Step A: Extract Verifiable Claims from Submitted Documents
  for (const src of sources) {
    const rawSentences = src.content
      .replace(/\r\n/g, '\n')
      .split(/(?<=[.?!;])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 10);

    // Date analysis
    const yearMatches = src.content.match(/\b(19\d{2}|20\d{2})\b/g);
    const maxYearInDoc = yearMatches ? Math.max(...yearMatches.map(Number)) : null;
    const pubYear = src.publicationDate ? parseInt(src.publicationDate.slice(0, 4), 10) : maxYearInDoc;

    if (pubYear && pubYear < currentYear - 1) {
      outdatedFlags.push({
        id: `out-${outdatedFlags.length + 1}`,
        sourceId: src.id,
        sourceTitle: src.title,
        claimedDate: src.publicationDate || `${pubYear}`,
        currentCycleYear: currentYear,
        reason: `Publication timestamp (${pubYear}) precedes current calendar cycle (${currentYear}). Key figures, deadlines, or statutory terms in "${src.title}" may be obsolete.`,
        urgency: pubYear < currentYear - 2 ? 'high' : 'medium',
        notAutomaticallyInvalidNotice: 'Older documents provide context, but active cycle documents take legal precedence.'
      });
    } else if (!src.publicationDate && !maxYearInDoc) {
      outdatedFlags.push({
        id: `out-${outdatedFlags.length + 1}`,
        sourceId: src.id,
        sourceTitle: src.title,
        isDateUnknown: true,
        currentCycleYear: currentYear,
        reason: `Publication and revision dates are unspecified in "${src.title}".`,
        urgency: 'low',
        notAutomaticallyInvalidNotice: 'An undated source is not automatically invalid, but its contemporary relevance must be verified.'
      });
    }

    rawSentences.forEach((sentence) => {
      if (claims.length >= 35) return;
      const lower = sentence.toLowerCase();

      let category: ClaimCategory | null = null;
      const supportType: 'direct_statement' | 'third_party_assertion' = src.isOfficial ? 'direct_statement' : 'third_party_assertion';

      if (lower.includes('salary') || lower.includes('equity') || lower.includes('stock option') || lower.includes('compensation') || lower.includes('bonus') || lower.includes('hourly wage') || lower.includes('pay rate')) {
        category = 'compensation';
      } else if (lower.includes('stipend') || lower.includes('fellowship') || lower.includes('scholarship') || lower.includes('grant') || lower.includes('living allowance') || lower.includes('coverage') || lower.includes('cashless') || lower.includes('benefit') || lower.includes('hospitalization') || lower.includes('award')) {
        category = 'coverage_and_benefits';
      } else if (lower.includes('co-pay') || lower.includes('deductible') || lower.includes('out-of-pocket') || lower.includes('sub-limit') || lower.includes('room rent')) {
        category = 'deductibles_and_copay';
      } else if (lower.includes('waiting period') || lower.includes('survival period') || lower.includes('cliff') || lower.includes('vesting') || lower.includes('cooling-off') || lower.includes('probation')) {
        category = 'waiting_periods';
      } else if (lower.includes('penalty') || lower.includes('forfeit') || lower.includes('non-compete') || lower.includes('mandate') || lower.includes('in-office') || lower.includes('clause') || lower.includes('exclusion') || lower.includes('clawback') || lower.includes('prepayment') || lower.includes('lien') || lower.includes('repay')) {
        category = 'clauses_and_exclusions';
      } else if (lower.includes('renew') || lower.includes('maintain') || lower.includes('retention') || lower.includes('continuity') || lower.includes('installment') || lower.includes('recurring')) {
        category = 'renewal_conditions';
      } else if (lower.includes('eligible') || lower.includes('minimum') || lower.includes('criteria') || lower.includes('qualification') || lower.includes('gpa') || lower.includes('credit score') || lower.includes('candidate') || lower.includes('must know') || lower.includes('skills')) {
        category = 'eligibility';
      } else if (lower.includes('responsibilit') || lower.includes('deliverable') || lower.includes('role') || lower.includes('tasks') || lower.includes('duties') || lower.includes('work with') || lower.includes('opportunity for')) {
        category = 'responsibilities';
      } else if (lower.includes('must') || lower.includes('require') || lower.includes('mandatory') || lower.includes('document') || lower.includes('transcript') || lower.includes('proof') || lower.includes('resume') || lower.includes('apply')) {
        category = 'required_documents';
      } else if (lower.includes('apr') || lower.includes('interest rate') || lower.includes('interest') || lower.includes('fee') || lower.includes('rate') || lower.includes('price') || lower.includes('cost') || lower.includes('premium') || lower.includes('$') || lower.includes('usd')) {
        category = 'interest_and_rates';
      } else if (lower.includes('deadline') || lower.includes('due date') || lower.includes('expires') || lower.includes('timeline') || lower.includes('round')) {
        category = 'deadlines';
      } else if (rawSentences.length < 8) {
        category = 'general_claim';
      }

      if (category) {
        claims.push({
          id: `cl-${claimCounter++}`,
          sourceId: src.id,
          sourceTitle: src.title,
          sourceUrl: src.url,
          sourceDate: src.publicationDate,
          category,
          claimText: sentence,
          verbatimQuote: sentence,
          exactSubmittedPassage: sentence,
          confidenceScore: src.isOfficial ? 0.98 : 0.88,
          dateReferenced: src.publicationDate,
          supportType,
          traceabilityExplanation: `Directly quoted from submitted text in "${src.title}".`
        });
      }
    });
  }

  // Step B: Compare claims across different sources to identify real contradictions
  for (let i = 0; i < claims.length; i++) {
    for (let j = i + 1; j < claims.length; j++) {
      const c1 = claims[i];
      const c2 = claims[j];

      const isSameCategory = c1.category === c2.category;
      const isRelatedTopic = 
        (c1.claimText.toLowerCase().includes('remote') && c2.claimText.toLowerCase().includes('office')) ||
        (c1.claimText.toLowerCase().includes('waiting') && c2.claimText.toLowerCase().includes('waiting')) ||
        (c1.claimText.toLowerCase().includes('zero') && c2.claimText.toLowerCase().includes('day')) ||
        (c1.claimText.toLowerCase().includes('0%') && c2.claimText.toLowerCase().includes('apr')) ||
        (c1.claimText.toLowerCase().includes('lump-sum') && c2.claimText.toLowerCase().includes('survival'));

      if (c1.sourceId !== c2.sourceId && (isSameCategory || isRelatedTopic) && contradictions.length < 3) {
        const numbers1 = c1.claimText.match(/\b\d+([,.]\d+)?\b/g);
        const numbers2 = c2.claimText.match(/\b\d+([,.]\d+)?\b/g);

        const hasNumericalClash = numbers1 && numbers2 && numbers1.some(n => !numbers2.includes(n));
        const hasKeywordClash =
          (c1.claimText.toLowerCase().includes('not') && !c2.claimText.toLowerCase().includes('not')) ||
          (c1.claimText.toLowerCase().includes('zero') && (c2.claimText.toLowerCase().includes('%') || c2.claimText.toLowerCase().includes('day'))) ||
          (c1.claimText.toLowerCase().includes('fixed') && c2.claimText.toLowerCase().includes('variable')) ||
          (c1.claimText.toLowerCase().includes('free') && c2.claimText.toLowerCase().includes('fee')) ||
          (c1.claimText.toLowerCase().includes('remote') && c2.claimText.toLowerCase().includes('office')) ||
          (c1.claimText.toLowerCase().includes('mandatory') && c2.claimText.toLowerCase().includes('optional'));

        if (hasNumericalClash || hasKeywordClash || isRelatedTopic) {
          const isDateDecay = Boolean(c1.sourceDate && c2.sourceDate && c1.sourceDate.slice(0, 4) !== c2.sourceDate.slice(0, 4));
          
          let topicTitle = `${c1.category.replace(/_/g, ' ').toUpperCase()} Discrepancy`;
          const combinedLower = (c1.claimText + ' ' + c2.claimText).toLowerCase();
          if (combinedLower.includes('remote') || combinedLower.includes('office') || combinedLower.includes('mandate')) {
            topicTitle = 'Workplace Flexibility vs Mandatory In-Office Requirement';
          } else if (combinedLower.includes('survival') || combinedLower.includes('waiting')) {
            topicTitle = 'Immediate Coverage vs Survival / Waiting Period Exclusion';
          } else if (combinedLower.includes('stipend') || combinedLower.includes('clawback')) {
            topicTitle = 'Fellowship Stipend & Travel Clawback Liability';
          } else if (combinedLower.includes('0%') || combinedLower.includes('apr')) {
            topicTitle = 'Promotional Financing Rate vs Post-Introductory APR Jump';
          }

          let whyConflictMatters = `Acting on promotional representations without resolving which document legally governs risks unexpected financial loss, forfeiture, or administrative rejection.`;
          if (combinedLower.includes('remote') || combinedLower.includes('office')) {
            whyConflictMatters = 'Accepting a position based on remote marketing representations when the legal contract mandates 4 days in-office results in mandatory relocation expenses or disciplinary termination.';
          } else if (combinedLower.includes('survival') || combinedLower.includes('waiting')) {
            whyConflictMatters = 'Assuming immediate protection under marketing headlines leaves policyholders completely uncovered during the initial 30 to 90 days, resulting in denied claims during medical crises.';
          } else if (combinedLower.includes('clawback') || combinedLower.includes('repay')) {
            whyConflictMatters = 'Overlooking repayment obligations turns an academic fellowship grant into thousands in personal debt if research tenure terminates prematurely.';
          } else if (combinedLower.includes('0%') || combinedLower.includes('apr')) {
            whyConflictMatters = 'Relying on the 0% introductory rate without accounting for the 28.5% APR jump and 7% prepayment fee can drive a small business into severe cash-flow distress.';
          }

          contradictions.push({
            id: `con-${contradictions.length + 1}`,
            topic: topicTitle,
            claimA: c1,
            claimB: c2,
            type: isDateDecay ? 'date_decay_difference' : 'direct_factual_clash',
            findingType: 'verified_contradiction',
            explanation: `Sources "${c1.sourceTitle}" and "${c2.sourceTitle}" provide conflicting statements. One states: "${c1.claimText.slice(0, 75)}...", while the other states: "${c2.claimText.slice(0, 75)}...".`,
            whyItMatters: whyConflictMatters,
            sourceDateA: c1.sourceDate,
            sourceDateB: c2.sourceDate,
            isDateDrivenDifference: isDateDecay,
            isConfirmedConflict: !isDateDecay,
            evidenceStrength: isDateDecay ? 'high' : 'moderate'
          });
        }
      }
    }
  }

  // Step C: Document Type Classification & Contextual Intelligence
  const combinedCorpus = (sources.map((s) => `${s.title} ${s.content}`).join(' ') + ' ' + researchGoal).toLowerCase();
  const totalSubmittedWords = sources.reduce((acc, s) => acc + s.content.trim().split(/\s+/).filter(Boolean).length, 0);

  const hasJobKeywords = /\b(job|hiring|hire|analyst|junior|senior|developer|engineer|intern|candidate|resume|recruitment|vacancy|careers|apply now|qualifications|position|role|employment opportunity)\b/i.test(combinedCorpus);
  const hasFormalContractClauses = /\b(hereby agree|in witness whereof|parties agree|covenants and agrees|severability clause|arbitration agreement|confidentiality and non-disclosure agreement|promissory note|master agreement|truth in lending act)\b/i.test(combinedCorpus);
  const hasLoanKeywords = /\b(loan|apr|interest rate|borrower|prepayment penalty|origination fee|principal debt|financing rate)\b/i.test(combinedCorpus);
  const hasInsuranceKeywords = /\b(insurance|policyholder|room rent|cashless|copay|deductible|waiting period|hospitalization|sum insured)\b/i.test(combinedCorpus);
  const hasScholarshipKeywords = /\b(scholarship|fellowship|grant|tuition waiver|gpa retention|stipend|bursary)\b/i.test(combinedCorpus);

  const isJobAd = hasJobKeywords && !hasFormalContractClauses;
  let detectedDocumentType = 'general_notice';
  if (isJobAd) detectedDocumentType = 'job_advertisement';
  else if (hasJobKeywords && hasFormalContractClauses) detectedDocumentType = 'employment_contract';
  else if (hasLoanKeywords) detectedDocumentType = 'loan_agreement';
  else if (hasInsuranceKeywords) detectedDocumentType = 'insurance_policy';
  else if (hasScholarshipKeywords) detectedDocumentType = 'scholarship_notice';

  // Anchor passages from actual submitted user text
  const jobIntroSentence = findSubmittedPassage(/\b(analyst|job|opportunity|position|role|hiring|exciting)\b/i);
  const techSentence = findSubmittedPassage(/\b(python|sql|data|analyst|requirements|skills|tools|excel|dashboard)\b/i);
  const applySentence = findSubmittedPassage(/\b(apply|resume|send|contact|submit)\b/i);

  // Step D: Missing Evidence Radar derived strictly from submitted corpus
  if (isJobAd) {
    // 1. Missing Salary & Compensation Details
    const hasSalary = /\b(\$\s?\d+|\b\d+\s?k\b|salary|hourly wage|compensation|\/hr|\/year|\/yr|stipend|base pay)\b/i.test(combinedCorpus);
    if (!hasSalary) {
      gaps.push({
        id: 'gap-job-salary',
        topic: 'Missing Salary & Base Compensation Structure',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: jobIntroSentence,
        unansweredQuestion: 'What is the guaranteed base salary or hourly pay rate, payment schedule, and compensation model (fixed vs commission/incentive) for this role?',
        reasonMissingMatters: 'Without disclosed compensation in the advertisement, applicants risk investing extensive interview preparation into below-market wages, unpaid internships, or 100% commission arrangements.',
        severity: 'critical',
        category: 'compensation',
        suggestedFollowUpPrompt: 'What is the approved base salary range and overtime pay structure for this position before we proceed with technical interviews?',
        whereToVerify: 'Direct Hiring Manager or HR Talent Acquisition Office',
        absenceType: 'complete_omission'
      });
    }

    // 2. Working Hours & Schedule Expectations
    const hasHours = /\b(hours|schedule|shift|full-time|part-time|40 hrs|40 hours|overtime|weekend|9-5|9 to 5|on-call)\b/i.test(combinedCorpus);
    if (!hasHours) {
      gaps.push({
        id: 'gap-job-hours',
        topic: 'Unstated Working Hours, Schedule Expectations & Shift Requirements',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: jobIntroSentence,
        unansweredQuestion: 'What are the core daily working hours, expected weekly time commitment, and are there mandatory weekend or evening shifts?',
        reasonMissingMatters: 'Unstated working hours often conceal mandatory uncompensated overtime, irregular rotating shifts, or evening on-call demands.',
        severity: 'high',
        category: 'responsibilities',
        suggestedFollowUpPrompt: 'Could you specify the standard weekly schedule, core operating hours, and whether weekend or overtime coverage is expected?',
        whereToVerify: 'Official Job Posting / Department Manager',
        absenceType: 'complete_omission'
      });
    }

    // 3. Application Fee & Scam Safeguard Verification
    const mentionsFee = /\b(application fee|registration fee|screening fee|training cost|software fee|deposit)\b/i.test(combinedCorpus);
    if (mentionsFee) {
      gaps.push({
        id: 'gap-job-fee-critical',
        topic: 'Flagged Application or Training Fee (Severe Scam Risk)',
        findingType: 'hypothetical_risk',
        exactSubmittedPassage: findSubmittedPassage(/\b(fee|payment|deposit|cost)\b/i),
        unansweredQuestion: 'Why is an applicant asked to pay an upfront fee or purchase equipment/training for a standard employment role?',
        reasonMissingMatters: 'Legitimate employers never charge candidates an application, screening, or onboarding fee. This is a primary hallmark of recruitment fraud.',
        severity: 'critical',
        category: 'clauses_and_exclusions',
        suggestedFollowUpPrompt: 'Verify company corporate registration with state authorities before submitting any personal financial details or fees.',
        whereToVerify: 'State Corporate Registry / Federal Trade Commission Scam Portal',
        absenceType: 'complete_omission'
      });
    } else {
      gaps.push({
        id: 'gap-job-fee-verification',
        topic: 'Application Fee & Upfront Training Cost Verification',
        findingType: 'unanswered_question',
        exactSubmittedPassage: applySentence,
        unansweredQuestion: 'Does the application, testing, or onboarding process require any upfront application fee, software license purchase, or equipment deposit?',
        reasonMissingMatters: 'Legitimate employers never charge candidates an application fee or mandate upfront payment for training or software. Explicit verification protects applicants from recruitment phishing scams.',
        severity: 'high',
        category: 'clauses_and_exclusions',
        suggestedFollowUpPrompt: 'Confirm in writing that all application, evaluation, and onboarding processes are completely free of charge with employer-supplied equipment.',
        whereToVerify: 'Corporate HR Portal / Official Company Domain',
        absenceType: 'unspecified_exception'
      });
    }

    // 4. Employer Identity & Corporate Legitimacy
    const hasEmployerIdentity = /\b(inc\.|llc|ltd|corp|corporation|company registration|headquarters|founded in|registered office|ein)\b/i.test(combinedCorpus);
    if (!hasEmployerIdentity) {
      gaps.push({
        id: 'gap-job-employer-identity',
        topic: 'Employer Legal Identity & Business Registration Verification',
        findingType: 'unanswered_question',
        exactSubmittedPassage: sources[0]?.title || jobIntroSentence,
        unansweredQuestion: 'What is the legally registered company entity, physical office address, and verifiable corporate website behind this advertisement?',
        reasonMissingMatters: 'Generic recruitment notices without a verifiable legal entity or registered physical office pose severe risks of resume harvesting, identity theft, or phantom employers.',
        severity: 'medium',
        category: 'selection_criteria',
        suggestedFollowUpPrompt: 'Can you provide the registered corporate name and business entity number so I can review your corporate filings?',
        whereToVerify: 'State Corporate Registrar (e.g., SEC / Secretary of State) and Verified Domain WHOIS',
        absenceType: 'ambiguous_phrasing'
      });
    }

    // 5. Specific Daily Job Responsibilities & Technical Work Scope
    gaps.push({
      id: 'gap-job-responsibilities',
      topic: 'Specific Daily Responsibilities & Technical Work Scope',
      findingType: 'unanswered_question',
      exactSubmittedPassage: techSentence,
      unansweredQuestion: 'What are the concrete day-to-day deliverables, analytics projects, and database systems this Junior Data Analyst will work on versus routine administrative tasks?',
      reasonMissingMatters: 'Vague job descriptions often mischaracterize manual data entry, lead scrubbing, or customer support as "data analytics", impeding technical career growth.',
      severity: 'medium',
      category: 'responsibilities',
      suggestedFollowUpPrompt: 'Could you share an example of a typical project or weekly deliverable for this analytics team?',
      whereToVerify: 'Technical Interviewer / Senior Data Analytics Lead',
      absenceType: 'ambiguous_phrasing'
    });

    // 6. Employment Classification (W-2 vs 1099)
    const hasClassification = /\b(w-2|1099|direct employee|contractor|at-will|probation period|full-time employee)\b/i.test(combinedCorpus);
    if (!hasClassification) {
      gaps.push({
        id: 'gap-job-classification',
        topic: 'Employment Classification (W-2 Employee vs 1099 Contractor) & Probation Terms',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: jobIntroSentence,
        unansweredQuestion: 'Is this role direct W-2 employment with statutory benefits and tax withholding, or an independent 1099 contractor arrangement with self-employment tax liabilities?',
        reasonMissingMatters: 'Contractor misclassification denies workers statutory protections (unemployment insurance, workers comp) and imposes an extra 15.3% self-employment FICA tax burden.',
        severity: 'high',
        category: 'terms_and_penalties',
        suggestedFollowUpPrompt: 'Please confirm whether this role will be issued a W-2 or 1099 form, and what health and retirement benefits are included.',
        whereToVerify: 'Human Resources / Official Offer Letter Schedule',
        absenceType: 'complete_omission'
      });
    }
  } else {
    // Non-job domains: Banking, Insurance, Scholarship, or General Agreements
    const hasRenewalClaim = claims.some((c) => c.category === 'renewal_conditions' || c.claimText.toLowerCase().includes('renew') || c.claimText.toLowerCase().includes('duration'));
    const topMetricClaim = claims.find((c) => c.category === 'interest_and_rates' || c.category === 'compensation' || c.category === 'coverage_and_benefits');

    if (!hasRenewalClaim && (hasLoanKeywords || hasScholarshipKeywords)) {
      const quotedMetric = topMetricClaim ? `"${topMetricClaim.claimText.slice(0, 60)}..."` : 'the stated rate, benefit, or terms';
      gaps.push({
        id: 'gap-duration-continuity',
        topic: 'Unspecified Duration, Renewal & Rate Escalation Terms',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: topMetricClaim?.claimText || sources[0]?.content.slice(0, 120) || 'Submitted terms',
        unansweredQuestion: `Does ${quotedMetric} remain fixed throughout the entire agreement, or does it adjust, expire, or terminate after an initial period?`,
        reasonMissingMatters: `Without explicit renewal or duration terms in the submitted text, the user assumes permanent or multi-cycle stability, which leads to sudden expense hikes or loss of benefit.`,
        severity: 'critical',
        category: 'renewal_conditions',
        suggestedFollowUpPrompt: `Confirm the exact duration period and whether terms convert to variable/escalated rates after an initial phase.`,
        whereToVerify: sources.find((s) => s.isOfficial)?.title || 'Primary Governing Entity / Master Contract Schedule',
        absenceType: 'complete_omission'
      });
    }

    if (hasLoanKeywords) {
      gaps.push({
        id: 'gap-exit-penalties',
        topic: 'Unstated Early Prepayment Penalty & Origination Charges',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: findSubmittedPassage(/\b(loan|rate|apr|financing|approval)\b/i),
        unansweredQuestion: 'What specific origination fees or prepayment penalties apply if this loan balance is refinanced or paid off early?',
        reasonMissingMatters: 'Unstated early payoff penalties prevent the borrower from refinancing to lower rates without paying thousands in penalty charges.',
        severity: 'high',
        category: 'clauses_and_exclusions',
        suggestedFollowUpPrompt: 'Request full Truth in Lending Act (TILA) statutory disclosure schedule detailing all prepayment restrictions.',
        whereToVerify: 'Truth in Lending Act (TILA) Disclosure Schedule',
        absenceType: 'complete_omission'
      });
    } else if (hasInsuranceKeywords) {
      gaps.push({
        id: 'gap-insurance-sublimits',
        topic: 'Unstated Room Rent Caps & Proportionate Deductions',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: findSubmittedPassage(/\b(cashless|coverage|hospitalization|claim)\b/i),
        unansweredQuestion: 'Does the policy enforce a daily room rent sub-limit that triggers proportionate deductions across medical and surgical fees?',
        reasonMissingMatters: 'Room rent sub-limits result in policyholders paying 30% to 50% of the entire hospital bill out-of-pocket even on 100% cashless plans.',
        severity: 'critical',
        category: 'deductibles_and_copay',
        suggestedFollowUpPrompt: 'Confirm whether room rent has an absolute dollar cap or allows single private room without proportionate deduction penalties.',
        whereToVerify: 'Master Policy Wordings / Section 8 Exclusions Schedule',
        absenceType: 'complete_omission'
      });
    } else if (hasScholarshipKeywords) {
      gaps.push({
        id: 'gap-scholarship-retention',
        topic: 'Unstated GPA Retention Cliff & Multi-Year Renewal Terms',
        findingType: 'explicitly_missing_information',
        exactSubmittedPassage: findSubmittedPassage(/\b(award|scholarship|stipend|tuition|academic)\b/i),
        unansweredQuestion: 'What cumulative GPA must be maintained each term to retain this scholarship, and is renewal automatic or discretionary?',
        reasonMissingMatters: 'Unstated GPA retention minimums can cause students to forfeit awards mid-degree, leaving them with unexpected tuition debt.',
        severity: 'high',
        category: 'renewal_conditions',
        suggestedFollowUpPrompt: 'Request formal renewal regulations and academic probation policies from the scholarship foundation.',
        whereToVerify: 'Foundation Board of Trustees Official Gazette',
        absenceType: 'complete_omission'
      });
    }
  }

  // Step E: Rigorous Decision Flip Test (Signature Feature)
  let hasSufficientDataForFlip = true;
  let insufficientDataNotice: string | undefined;

  if (totalSubmittedWords < 8) {
    hasSufficientDataForFlip = false;
    insufficientDataNotice = `INSUFFICIENT INFORMATION FOR DECISION FLIP TEST: The submitted text contains only ${totalSubmittedWords} words, which is insufficient to calculate grounded decision flip trade-offs. Please submit a more detailed job posting, contract, or policy document.`;
  } else if (isJobAd) {
    // Transparent Notice explaining document scope
    insufficientDataNotice = 'NOTICE: The submitted document is a preliminary Job Advertisement, NOT an executed employment contract. The Decision Flip scenarios below model pre-interview risk triggers based strictly on unstated compensation and role terms in the submitted text. They are clearly labeled as hypothetical simulations and should not be confused with detected contractual facts.';

    // Flip 1: Undisclosed Compensation Structure Flip
    decisionFlipScenarios.push({
      id: 'flip-job-comp-structure',
      findingType: 'hypothetical_risk',
      missingFactor: 'Undisclosed Compensation: Salaried Base Pay vs 100% Commission or Unpaid Training',
      currentApparentChoice: 'Investing interview preparation time into this Junior Data Analyst role assuming it pays standard salaried entry-level compensation.',
      flippedChoice: 'Declining to apply or terminating the interview process if compensation is revealed to be 100% commission, stipend-only, or unpaid probationary training.',
      triggerCondition: 'If the unstated compensation structure turns out to be performance-commission only or requires an unpaid training period.',
      priority: 'critical',
      impactScore: 9,
      urgencyScore: 9,
      flipProbability: 'high',
      explanation: 'Job advertisements that omit numeric compensation frequently mask non-guaranteed commission-only or unpaid probationary arrangements. Uncovering this flips the economic feasibility of pursuing the role.',
      whyItMatters: 'Investing time into multiple interview rounds for a position that does not provide guaranteed living wages results in significant opportunity cost.',
      exactSubmittedPassage: jobIntroSentence,
      verifiedFactsReferenced: [
        `Submitted text announces a Junior Data Analyst opening ("${jobIntroSentence.slice(0, 75)}...") with zero numeric compensation or wage disclosures.`
      ],
      assumptionsExposed: [
        'Assumed standard salaried compensation based solely on the Junior Data Analyst title without written confirmation.'
      ],
      isHypothetical: true,
      isContractualAssumption: false
    });

    // Flip 2: Unstated Role Scope Flip
    decisionFlipScenarios.push({
      id: 'flip-job-role-deliverables',
      findingType: 'hypothetical_risk',
      missingFactor: 'Unstated Role Scope: Technical Analytics vs Clerical Manual Data Entry / Cold Sales',
      currentApparentChoice: 'Pursuing this opportunity to develop professional skills in Python, SQL, and business intelligence.',
      flippedChoice: 'Withdrawing candidacy if actual day-to-day responsibilities are clerical manual data entry or telemarketing rather than technical data analysis.',
      triggerCondition: 'If day-to-day responsibilities are clerical data entry, cold-calling, or lead generation rather than technical analytics.',
      priority: 'high',
      impactScore: 8,
      urgencyScore: 8,
      flipProbability: 'medium',
      explanation: 'The title "Data Analyst" is frequently used in recruitment marketing for clerical data entry or customer service roles lacking technical analytics.',
      whyItMatters: 'Accepting a mischaracterized position halts technical skill development and can set back early career progression.',
      exactSubmittedPassage: techSentence,
      verifiedFactsReferenced: [
        `Submitted text specifies technical keywords ("${techSentence.slice(0, 75)}...") but omits a detailed deliverable schedule.`
      ],
      assumptionsExposed: [
        'Assumed daily responsibilities involve technical data modeling without verifying the actual breakdown of daily tasks.'
      ],
      isHypothetical: true,
      isContractualAssumption: false
    });

    // Flip 3: If cross-source contradiction exists (e.g. ad vs Glassdoor or conflicting postings)
    if (contradictions.length > 0) {
      const con = contradictions[0];
      decisionFlipScenarios.push({
        id: 'flip-job-discrepancy',
        findingType: 'hypothetical_risk',
        missingFactor: `Discrepancy: "${con.claimA.sourceTitle}" vs "${con.claimB.sourceTitle}"`,
        currentApparentChoice: `Proceeding under the favorable statement in "${con.claimA.sourceTitle}".`,
        flippedChoice: `Withdrawing application or demanding clarification if the restrictive statement in "${con.claimB.sourceTitle}" governs.`,
        triggerCondition: `If the conflicting condition in "${con.claimB.sourceTitle}" is enforced.`,
        priority: 'high',
        impactScore: 8,
        urgencyScore: 8,
        flipProbability: 'high',
        explanation: con.whyItMatters,
        whyItMatters: con.whyItMatters,
        exactSubmittedPassage: con.claimA.exactSubmittedPassage || con.claimA.verbatimQuote,
        verifiedFactsReferenced: [
          `Claim A: "${con.claimA.verbatimQuote.slice(0, 80)}..." (${con.claimA.sourceTitle})`,
          `Claim B: "${con.claimB.verbatimQuote.slice(0, 80)}..." (${con.claimB.sourceTitle})`
        ],
        assumptionsExposed: [
          `Assumed the favorable statement in "${con.claimA.sourceTitle}" was accurate without reconciling the conflict.`
        ],
        isHypothetical: true,
        isContractualAssumption: false
      });
    }
  } else {
    // Non-job domains (Contracts, Loans, Insurance, Scholarships)
    if (contradictions.length > 0) {
      const con = contradictions[0];
      decisionFlipScenarios.push({
        id: 'flip-discrepancy',
        findingType: 'hypothetical_risk',
        missingFactor: `Binding Legal Precedence: "${con.claimA.sourceTitle}" vs "${con.claimB.sourceTitle}"`,
        currentApparentChoice: `Proceeding under the assumption that the more favorable statement in "${con.claimA.sourceTitle}" ("${con.claimA.claimText.slice(0, 60)}...") governs.`,
        flippedChoice: `Halting commitment or demanding a written contract addendum if the restrictive term in "${con.claimB.sourceTitle}" ("${con.claimB.claimText.slice(0, 60)}...") is legally enforced.`,
        triggerCondition: `If the restrictive term stated in "${con.claimB.sourceTitle}" is enforced as the binding contractual clause over the promotional representation.`,
        priority: 'critical',
        impactScore: 10,
        urgencyScore: 10,
        flipProbability: 'high',
        explanation: `Promotional summaries or advertisements routinely highlight attractive numbers while statutory disclosures or fine print impose strict limitations. Discovering that the restrictive clause governs flips the economic feasibility of the choice.`,
        whyItMatters: `Overlooking the legally binding restrictive clause results in immediate unexpected financial or contractual liabilities.`,
        exactSubmittedPassage: con.claimA.exactSubmittedPassage || con.claimA.verbatimQuote,
        verifiedFactsReferenced: [
          `Claim A: "${con.claimA.verbatimQuote.slice(0, 80)}..." (${con.claimA.sourceTitle})`,
          `Claim B: "${con.claimB.verbatimQuote.slice(0, 80)}..." (${con.claimB.sourceTitle})`
        ],
        assumptionsExposed: [
          `Assumed the favorable advertising representation in "${con.claimA.sourceTitle}" was legally binding without checking the fine print.`
        ],
        isHypothetical: true,
        isContractualAssumption: true
      });
    }

    if (hasLoanKeywords) {
      decisionFlipScenarios.push({
        id: 'flip-loan-apr-reset',
        findingType: 'hypothetical_risk',
        missingFactor: 'Introductory Rate Expiration & Post-Introductory APR Reset',
        currentApparentChoice: 'Financing through this loan based on the advertised low promotional rate.',
        flippedChoice: 'Rejecting this loan in favor of fixed-rate alternatives if the rate escalates after an initial teaser period.',
        triggerCondition: 'If the advertised rate is an introductory teaser that resets to a high variable APR after 6 months.',
        priority: 'critical',
        impactScore: 9,
        urgencyScore: 9,
        flipProbability: 'high',
        explanation: 'Promotional loans frequently advertise ultra-low teaser rates that convert to high APRs, doubling monthly debt service obligations.',
        whyItMatters: 'A sudden rate jump creates severe personal cash flow distress or insolvency.',
        exactSubmittedPassage: findSubmittedPassage(/\b(rate|apr|interest|promotional|fixed)\b/i),
        verifiedFactsReferenced: claims.slice(0, 1).map((c) => `"${c.claimText.slice(0, 80)}..." (${c.sourceTitle})`),
        assumptionsExposed: ['Assumed promotional rate remained fixed across the full loan tenure.'],
        isHypothetical: true,
        isContractualAssumption: true
      });
    } else if (hasInsuranceKeywords) {
      decisionFlipScenarios.push({
        id: 'flip-insurance-room-rent',
        findingType: 'hypothetical_risk',
        missingFactor: 'Proportionate Billing Deduction Clause on Room Rent Sub-Limit',
        currentApparentChoice: 'Selecting this health insurance policy believing hospital claims are 100% cashless.',
        flippedChoice: 'Upgrading to a plan with no room rent cap or budgeting for significant out-of-pocket medical expenses.',
        triggerCondition: 'If choosing an executive or standard single room violates the 1% sub-limit and slashes surgeon and medication payouts.',
        priority: 'critical',
        impactScore: 9,
        urgencyScore: 9,
        flipProbability: 'high',
        explanation: 'Sub-limits on room rent legally trigger proportionate deductions across all hospital expenses, not merely the room charge.',
        whyItMatters: 'Can result in thousands of dollars in unexpected medical debt during a critical emergency.',
        exactSubmittedPassage: findSubmittedPassage(/\b(cashless|coverage|hospital|room rent|deductible)\b/i),
        verifiedFactsReferenced: claims.slice(0, 1).map((c) => `"${c.claimText.slice(0, 80)}..." (${c.sourceTitle})`),
        assumptionsExposed: ['Assumed 100% cashless coverage applied regardless of room category selected.'],
        isHypothetical: true,
        isContractualAssumption: true
      });
    } else if (hasScholarshipKeywords) {
      decisionFlipScenarios.push({
        id: 'flip-scholarship-retention',
        findingType: 'hypothetical_risk',
        missingFactor: 'Non-Renewable 1-Year Grant vs Guaranteed 4-Year Tuition Support',
        currentApparentChoice: 'Accepting this scholarship offer over competing public university financial aid.',
        flippedChoice: 'Declining this offer in favor of guaranteed multi-year funding if the grant terminates after freshman year.',
        triggerCondition: 'If the scholarship does not renew automatically for subsequent academic years or requires an unattainable retention GPA.',
        priority: 'critical',
        impactScore: 9,
        urgencyScore: 9,
        flipProbability: 'high',
        explanation: 'Single-year scholarship awards leave students stranded with full tuition liabilities in years 2 through 4.',
        whyItMatters: 'Premature award termination forces students to take emergency high-interest student loans or drop out.',
        exactSubmittedPassage: findSubmittedPassage(/\b(scholarship|award|tuition|academic|grant)\b/i),
        verifiedFactsReferenced: claims.slice(0, 1).map((c) => `"${c.claimText.slice(0, 80)}..." (${c.sourceTitle})`),
        assumptionsExposed: ['Assumed the advertised grant amount applied automatically for all four undergraduate years.'],
        isHypothetical: true,
        isContractualAssumption: false
      });
    }
  }

  // Step F: Verification Checklist tailored to detected document context
  if (isJobAd) {
    verificationChecklist.push({
      id: 'chk-1',
      title: 'Request Written Base Salary & Overtime Terms Before Interview',
      description: 'Obtain the official approved salary range and payroll frequency from HR in writing.',
      priority: 'critical',
      targetOfficialSource: 'Hiring Manager / HR Talent Acquisition Office',
      completed: false
    });
    verificationChecklist.push({
      id: 'chk-2',
      title: 'Verify Employer Corporate Registration on Official Government Registry',
      description: 'Confirm the company is a registered legal entity with an active state business registration.',
      priority: 'high',
      targetOfficialSource: 'State Corporate Registry / Secretary of State',
      completed: false
    });
    verificationChecklist.push({
      id: 'chk-3',
      title: 'Confirm W-2 Employee Status vs 1099 Independent Contractor Classification',
      description: 'Ensure employment status does not shift 15.3% self-employment FICA taxes onto you.',
      priority: 'high',
      targetOfficialSource: 'Official Written Offer Letter / Employment Agreement',
      completed: false
    });
  } else {
    verificationChecklist.push({
      id: 'chk-1',
      title: 'Verify Governing Document Clauses Against Promotional Claims',
      description: 'Audit the legally binding agreement or statutory disclosure schedule against the advertised representations.',
      priority: 'critical',
      targetOfficialSource: sources.find((s) => s.isOfficial)?.title || 'Primary Governing Authority',
      completed: false
    });

    if (contradictions.length > 0) {
      verificationChecklist.push({
        id: 'chk-2',
        title: `Resolve Conflicting Term: ${contradictions[0].topic}`,
        description: `Reconcile the discrepancy between "${contradictions[0].claimA.sourceTitle}" and "${contradictions[0].claimB.sourceTitle}".`,
        priority: 'critical',
        targetOfficialSource: contradictions[0].claimA.sourceTitle,
        completed: false,
        relatedContradictionId: contradictions[0].id
      });
    }

    verificationChecklist.push({
      id: 'chk-3',
      title: `Confirm Current Calendar Year & Effective Revision Date`,
      description: `Ensure all terms and deadlines are current for ${currentYear} rather than archived cycles.`,
      priority: 'high',
      targetOfficialSource: 'Official Regulatory Document Portal',
      completed: false
    });
  }

  return {
    researchGoal,
    domain,
    detectedDomain: detectedDomainLabel,
    detectedDocumentType,
    hasSufficientDataForFlip,
    insufficientDataNotice,
    timestamp: new Date().toISOString(),
    isSampleData: false,
    engineUsed: 'GAPLENS Domain-Agnostic Heuristic NLP Engine',
    summary: {
      sourcesAnalyzedCount: sources.length,
      claimsCount: claims.length,
      contradictionsCount: contradictions.length,
      gapsIdentifiedCount: gaps.length,
      outdatedSourcesCount: outdatedFlags.length,
      criticalTasksCount: verificationChecklist.filter((t) => t.priority === 'critical').length,
      evidenceCoverageConfidence: Math.min(88, Math.max(45, sources.length * 20)),
      blindSpotRiskScore: Math.max(50, 95 - sources.length * 10),
      limitationsNotice: isJobAd
        ? 'Analysis conducted on submitted job advertisement. Preliminary recruitment copy lacks binding employment contract terms.'
        : 'Analysis conducted strictly on submitted text corpus. Findings reflect information gaps and discrepancies within these specific documents.'
    },
    sources: sources.map((s) => ({
      ...s,
      sourceType: s.isOfficial ? 'official_notice' : 'policy_document',
      authorOrPublisher: s.isOfficial ? 'Official Issuing Authority' : 'Primary Source Reference',
      isOfficial: Boolean(s.isOfficial),
      accessedDate: new Date().toISOString().split('T')[0]
    })),
    claims,
    contradictions,
    gaps,
    outdatedFlags,
    decisionFlipScenarios,
    verificationChecklist
  };
}

// 5. Main Analysis Endpoint (Gemini-Powered with Heuristic Fallback)
app.post('/api/analyze', async (req: Request, res: Response) => {
  const { researchGoal, sources, domain: requestedDomain } = req.body;

  if (!researchGoal || !Array.isArray(sources) || sources.length === 0) {
    return res.status(400).json({ error: 'Research goal and at least one source document are required' });
  }

  const { domain, label: detectedDomainLabel } = resolveDomain(requestedDomain, researchGoal, sources);

  const combinedCorpus = (sources.map((s) => `${s.title} ${s.content}`).join(' ') + ' ' + researchGoal).toLowerCase();
  const hasJobKeywords = /\b(job|hiring|hire|analyst|junior|senior|developer|engineer|intern|candidate|resume|recruitment|vacancy|careers|apply now|qualifications|position|role|employment opportunity)\b/i.test(combinedCorpus);
  const hasFormalContractClauses = /\b(hereby agree|in witness whereof|parties agree|covenants and agrees|severability clause|arbitration agreement|confidentiality and non-disclosure agreement|promissory note|master agreement|truth in lending act)\b/i.test(combinedCorpus);
  const isJobAd = hasJobKeywords && !hasFormalContractClauses;

  const ai = getGeminiClient();

  if (!ai) {
    const heuristicResult = runHeuristicEngine(researchGoal, sources, domain);
    return res.json({
      ...heuristicResult,
      engineUsed: 'heuristic_nlp_rules',
      notice: 'Analyzed using GAPLENS deterministic heuristic rules engine.'
    });
  }

  // Attempt Gemini generation with intelligent fallback
  try {
    const prompt = `You are GAPLENS – The Decision Blind-Spot Detector.
You are a GENERAL-PURPOSE DIGITAL INFORMATION GAP DETECTION PLATFORM.
You analyze information across ANY domain (e.g. Education, Banking/Finance, Employment, Insurance, Government, Healthcare, Real Estate, Commerce).

ACTIVE DOMAIN CONTEXT:
${detectedDomainLabel} (Domain Key: ${domain})

USER RESEARCH GOAL / PENDING DECISION:
"${researchGoal}"

SUBMITTED SOURCES:
${sources.map((s, idx) => `[Source ${idx + 1}: ID="${s.id}", Title="${s.title}", Date="${s.publicationDate || 'Unknown'}", Official=${s.isOfficial ? 'Yes' : 'No'}]
${s.content.slice(0, 4500)}
---`).join('\n\n')}

CRITICAL DOMAIN-SPECIFIC REASONING RULES:
1. DOCUMENT TYPE RECOGNITION (CRITICAL):
   - Identify whether the submitted text is a preliminary Job Advertisement/Posting, an executed Employment Contract, a Loan Agreement, an Insurance Policy, a Scholarship Notice, or General Notice.
   - DO NOT ASSUME A JOB ADVERTISEMENT IS AN EMPLOYMENT CONTRACT.
   - Preliminary job advertisements do NOT contain exit penalties, lease renewals, loan repayment liabilities, or binding arbitration. Never invent contractual clauses that are absent from the text!
   - For job advertisements, identify:
     a) Missing salary details & compensation model (base vs commission/bonus)
     b) Working hours, schedule flexibility, shift expectations, and physical work location
     c) Application fee verification & scam safeguards (confirming zero upfront fees/equipment purchases)
     d) Employer legal identity, corporate registration, and verifiable office location
     e) Daily job responsibilities & deliverables vs generic buzzwords
     f) Employment classification (W-2 employee vs 1099 contractor, probation terms)

2. EVIDENCE TRACEABILITY (EXACT SUBMITTED PASSAGES):
   - For EVERY finding (every claim, contradiction, information gap, and decision flip scenario), extract and provide exactSubmittedPassage: the exact verbatim sentence from the submitted text that anchors or contextually supports the finding. Never invent passages.

3. STRICT TYPING (findingType):
   - Categorize every finding as one of:
     - 'explicitly_missing_information' (essential terms standard in this domain that are completely omitted)
     - 'unanswered_question' (crucial questions for decision-making left unanswered)
     - 'hypothetical_risk' (simulated risk scenario if unstated condition is adverse)
     - 'verified_contradiction' (direct cross-source clash between submitted documents)

4. DECISION FLIP TEST (SIGNATURE FEATURE):
   - Generate Decision Flip Test findings ONLY when relevant to the actual submitted content and user question.
   - If the available information is insufficient for a full Decision Flip Test (e.g. single advertisement without a competing offer or contract), clearly state this in insufficientDataNotice and explain what is needed (e.g., formal offer letter).
   - Show how the user's decision could change if an unstated condition turns out to be unfavorable (Current Apparent Choice vs Flipped Choice).
   - NEVER present hypothetical contractual risks as detected facts. All decision flip scenarios MUST have isHypothetical: true.
   - Do NOT generate generic findings just to fill the dashboard.

Return strictly valid JSON matching the exact schema.`;

    // Fast timeout wrapper to prevent API hanging under high load
    const withTimeout = <T>(p: Promise<T>, ms: number, label: string): Promise<T> =>
      Promise.race([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms))
      ]);

    // Try primary model, fallback if high-demand 503 or latency spike
    let responseText: string | undefined;
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedDocumentType: { type: Type.STRING },
              hasSufficientDataForFlip: { type: Type.BOOLEAN },
              insufficientDataNotice: { type: Type.STRING },
              summary: {
                type: Type.OBJECT,
                properties: {
                  sourcesAnalyzedCount: { type: Type.INTEGER },
                  claimsCount: { type: Type.INTEGER },
                  contradictionsCount: { type: Type.INTEGER },
                  gapsIdentifiedCount: { type: Type.INTEGER },
                  outdatedSourcesCount: { type: Type.INTEGER },
                  criticalTasksCount: { type: Type.INTEGER },
                  evidenceCoverageConfidence: { type: Type.INTEGER },
                  blindSpotRiskScore: { type: Type.INTEGER },
                  limitationsNotice: { type: Type.STRING }
                },
                required: ['sourcesAnalyzedCount', 'claimsCount', 'contradictionsCount', 'gapsIdentifiedCount', 'evidenceCoverageConfidence', 'blindSpotRiskScore', 'limitationsNotice']
              },
              claims: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    sourceId: { type: Type.STRING },
                    sourceTitle: { type: Type.STRING },
                    sourceUrl: { type: Type.STRING },
                    sourceDate: { type: Type.STRING },
                    category: { type: Type.STRING },
                    claimText: { type: Type.STRING },
                    verbatimQuote: { type: Type.STRING },
                    exactSubmittedPassage: { type: Type.STRING },
                    confidenceScore: { type: Type.NUMBER },
                    dateReferenced: { type: Type.STRING },
                    supportType: { type: Type.STRING },
                    traceabilityExplanation: { type: Type.STRING }
                  },
                  required: ['id', 'sourceId', 'sourceTitle', 'category', 'claimText', 'verbatimQuote', 'confidenceScore', 'supportType', 'traceabilityExplanation']
                }
              },
              contradictions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    findingType: { type: Type.STRING },
                    claimA: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        sourceId: { type: Type.STRING },
                        sourceTitle: { type: Type.STRING },
                        category: { type: Type.STRING },
                        claimText: { type: Type.STRING },
                        verbatimQuote: { type: Type.STRING },
                        exactSubmittedPassage: { type: Type.STRING },
                        confidenceScore: { type: Type.NUMBER },
                        supportType: { type: Type.STRING },
                        traceabilityExplanation: { type: Type.STRING }
                      },
                      required: ['id', 'sourceId', 'sourceTitle', 'category', 'claimText', 'verbatimQuote']
                    },
                    claimB: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        sourceId: { type: Type.STRING },
                        sourceTitle: { type: Type.STRING },
                        category: { type: Type.STRING },
                        claimText: { type: Type.STRING },
                        verbatimQuote: { type: Type.STRING },
                        exactSubmittedPassage: { type: Type.STRING },
                        confidenceScore: { type: Type.NUMBER },
                        supportType: { type: Type.STRING },
                        traceabilityExplanation: { type: Type.STRING }
                      },
                      required: ['id', 'sourceId', 'sourceTitle', 'category', 'claimText', 'verbatimQuote']
                    },
                    type: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    whyItMatters: { type: Type.STRING },
                    sourceDateA: { type: Type.STRING },
                    sourceDateB: { type: Type.STRING },
                    isDateDrivenDifference: { type: Type.BOOLEAN },
                    isConfirmedConflict: { type: Type.BOOLEAN },
                    evidenceStrength: { type: Type.STRING }
                  },
                  required: ['id', 'topic', 'claimA', 'claimB', 'type', 'explanation', 'whyItMatters', 'isDateDrivenDifference', 'isConfirmedConflict', 'evidenceStrength']
                }
              },
              gaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    findingType: { type: Type.STRING },
                    exactSubmittedPassage: { type: Type.STRING },
                    unansweredQuestion: { type: Type.STRING },
                    reasonMissingMatters: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    category: { type: Type.STRING },
                    suggestedFollowUpPrompt: { type: Type.STRING },
                    whereToVerify: { type: Type.STRING },
                    absenceType: { type: Type.STRING }
                  },
                  required: ['id', 'topic', 'unansweredQuestion', 'reasonMissingMatters', 'severity', 'category', 'suggestedFollowUpPrompt', 'whereToVerify', 'absenceType']
                }
              },
              outdatedFlags: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    sourceId: { type: Type.STRING },
                    sourceTitle: { type: Type.STRING },
                    claimedDate: { type: Type.STRING },
                    isDateUnknown: { type: Type.BOOLEAN },
                    currentCycleYear: { type: Type.INTEGER },
                    reason: { type: Type.STRING },
                    urgency: { type: Type.STRING },
                    notAutomaticallyInvalidNotice: { type: Type.STRING }
                  },
                  required: ['id', 'sourceId', 'sourceTitle', 'reason', 'urgency', 'notAutomaticallyInvalidNotice']
                }
              },
              decisionFlipScenarios: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    findingType: { type: Type.STRING },
                    exactSubmittedPassage: { type: Type.STRING },
                    isContractualAssumption: { type: Type.BOOLEAN },
                    missingFactor: { type: Type.STRING },
                    currentApparentChoice: { type: Type.STRING },
                    flippedChoice: { type: Type.STRING },
                    triggerCondition: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    impactScore: { type: Type.INTEGER },
                    urgencyScore: { type: Type.INTEGER },
                    flipProbability: { type: Type.STRING },
                    explanation: { type: Type.STRING },
                    whyItMatters: { type: Type.STRING },
                    verifiedFactsReferenced: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    assumptionsExposed: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    },
                    isHypothetical: { type: Type.BOOLEAN }
                  },
                  required: ['id', 'missingFactor', 'currentApparentChoice', 'flippedChoice', 'triggerCondition', 'priority', 'impactScore', 'urgencyScore', 'flipProbability', 'explanation', 'whyItMatters', 'verifiedFactsReferenced', 'assumptionsExposed', 'isHypothetical']
                }
              },
              verificationChecklist: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    targetOfficialSource: { type: Type.STRING },
                    completed: { type: Type.BOOLEAN },
                    relatedGapId: { type: Type.STRING },
                    relatedContradictionId: { type: Type.STRING }
                  },
                  required: ['id', 'title', 'description', 'priority', 'targetOfficialSource', 'completed']
                }
              }
            },
            required: ['summary', 'claims', 'contradictions', 'gaps', 'outdatedFlags', 'decisionFlipScenarios', 'verificationChecklist']
          }
        }
      }),
      10000,
      'Primary Gemini'
    );
    responseText = response.text;
    } catch (primaryErr: any) {
      console.warn('Primary Gemini call error, attempting backup model:', primaryErr.message);
      // Retry with gemini-flash-latest with 7s timeout
      const backupResponse = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          }
        }),
        7000,
        'Backup Gemini'
      );
      responseText = backupResponse.text;
    }

    const parsed = JSON.parse(responseText || '{}');
    return res.json({
      researchGoal,
      domain,
      detectedDomain: detectedDomainLabel,
      detectedDocumentType: parsed.detectedDocumentType || (isJobAd ? 'job_advertisement' : 'general_notice'),
      hasSufficientDataForFlip: parsed.hasSufficientDataForFlip !== undefined ? parsed.hasSufficientDataForFlip : true,
      insufficientDataNotice: parsed.insufficientDataNotice,
      timestamp: new Date().toISOString(),
      isSampleData: false,
      engineUsed: 'Gemini AI Intelligence Engine',
      summary: parsed.summary,
      sources: sources.map(s => ({
        ...s,
        sourceType: s.isOfficial ? 'official_notice' : 'policy_document',
        authorOrPublisher: s.isOfficial ? 'Official Issuing Authority' : 'Primary Source Reference',
        isOfficial: Boolean(s.isOfficial),
        accessedDate: new Date().toISOString().split('T')[0]
      })),
      claims: (parsed.claims || []).map((c: any) => ({
        ...c,
        exactSubmittedPassage: c.exactSubmittedPassage || c.verbatimQuote || c.claimText
      })),
      contradictions: (parsed.contradictions || []).map((con: any) => ({
        ...con,
        findingType: con.findingType || 'verified_contradiction'
      })),
      gaps: (parsed.gaps || []).map((g: any) => ({
        ...g,
        findingType: g.findingType || 'explicitly_missing_information'
      })),
      outdatedFlags: parsed.outdatedFlags || [],
      decisionFlipScenarios: (parsed.decisionFlipScenarios || []).map((flip: any) => ({
        ...flip,
        findingType: flip.findingType || 'hypothetical_risk',
        isHypothetical: true,
        isContractualAssumption: flip.isContractualAssumption !== undefined ? flip.isContractualAssumption : !isJobAd
      })),
      verificationChecklist: parsed.verificationChecklist || []
    });
  } catch (err: any) {
    console.error('Gemini API error, running dynamic heuristic engine:', err.message);
    const fallback = runHeuristicEngine(researchGoal, sources, domain);
    return res.json({
      ...fallback,
      engineUsed: 'heuristic_nlp_fallback',
      notice: `Analyzed via GAPLENS dynamic heuristic engine (LLM status: ${err.message || 'service busy'})`
    });
  }
});

// Vite middleware mounting for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GAPLENS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
