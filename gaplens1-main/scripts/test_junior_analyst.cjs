const http = require('http');

const juniorAnalystAd = {
  researchGoal: 'Should I apply for this Junior Data Analyst role, and what critical details are missing from the posting?',
  domain: 'employment_and_jobs',
  sources: [
    {
      id: 'src-job-ad-1',
      title: 'Junior Data Analyst Recruitment Notice',
      sourceType: 'advertisement',
      publicationDate: '2026-10-28',
      accessedDate: '2026-11-01',
      authorOrPublisher: 'Startup Hiring Portal',
      isOfficial: true,
      content: `Exciting opportunity for a Junior Data Analyst!
Join our fast-growing startup team. We are looking for motivated candidates who want to build careers in tech.
Requirements:
- Must know Python and SQL.
- Strong analytical and problem-solving mindset.
- Fast-paced collaborative environment.
- Bachelor's degree or equivalent bootcamp certification.
Apply now with your resume and GitHub profile to start immediately.`
    }
  ]
};

function postAnalyze(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      'http://localhost:3000/api/analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            reject(new Error(`Failed to parse response: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== TEST 1: Junior Data Analyst Job Advertisement ===');
  const result = await postAnalyze(juniorAnalystAd);
  console.log('HTTP Status:', result.status);
  const data = result.data;
  console.log('Engine used:', data.engineUsed);
  console.log('Detected Document Type:', data.detectedDocumentType);
  console.log('Has Sufficient Data for Flip:', data.hasSufficientDataForFlip);
  console.log('Insufficient Data Notice:', data.insufficientDataNotice);

  console.log('\n--- Gaps Detected ---');
  let hasMissingSalary = false;
  let hasMissingHours = false;
  let hasFeeVerification = false;
  let hasEmployerIdentity = false;
  let hasResponsibilities = false;
  let hasEmploymentTerms = false;
  let hasGenericContractGaps = false;

  data.gaps.forEach((g, i) => {
    console.log(`[Gap ${i + 1}] (${g.findingType}) ${g.topic}`);
    console.log(`  Question: "${g.unansweredQuestion}"`);
    console.log(`  Exact Passage: "${g.exactSubmittedPassage}"`);

    const lower = (g.topic + ' ' + g.unansweredQuestion).toLowerCase();
    if (lower.includes('salary') || lower.includes('compensation')) hasMissingSalary = true;
    if (lower.includes('hours') || lower.includes('schedule')) hasMissingHours = true;
    if (lower.includes('fee') || lower.includes('scam')) hasFeeVerification = true;
    if (lower.includes('employer') || lower.includes('identity')) hasEmployerIdentity = true;
    if (lower.includes('responsibilit') || lower.includes('deliverable') || lower.includes('scope')) hasResponsibilities = true;
    if (lower.includes('w-2') || lower.includes('1099') || lower.includes('classification')) hasEmploymentTerms = true;
    if (lower.includes('renewal expiry') || lower.includes('exit penal') || lower.includes('prepayment') || lower.includes('arbitration')) {
      hasGenericContractGaps = true;
    }
  });

  console.log('\n--- Decision Flip Test Scenarios ---');
  let hasGenericContractFlips = false;
  let hasJobRelevantFlips = false;

  data.decisionFlipScenarios.forEach((flip, i) => {
    console.log(`[Flip ${i + 1}] (${flip.findingType}) ${flip.missingFactor}`);
    console.log(`  Trigger: "${flip.triggerCondition}"`);
    console.log(`  Apparent Choice: "${flip.currentApparentChoice}"`);
    console.log(`  Flipped Choice: "${flip.flippedChoice}"`);
    console.log(`  Exact Passage: "${flip.exactSubmittedPassage}"`);
    console.log(`  isHypothetical: ${flip.isHypothetical}`);

    const lower = (flip.missingFactor + ' ' + flip.triggerCondition + ' ' + flip.explanation).toLowerCase();
    if (lower.includes('renewal expiry') || lower.includes('exit penal') || lower.includes('prepayment') || lower.includes('arbitration') || lower.includes('clawback liabilities')) {
      hasGenericContractFlips = true;
    }
    if (lower.includes('salary') || lower.includes('compensation') || lower.includes('commission') || lower.includes('role scope') || lower.includes('analytics vs')) {
      hasJobRelevantFlips = true;
    }
  });

  console.log('\n--- Validation Assertions ---');
  console.log('✓ Missing salary details detected:', hasMissingSalary ? 'PASS' : 'FAIL');
  console.log('✓ Working hours & schedule detected:', hasMissingHours ? 'PASS' : 'FAIL');
  console.log('✓ Application fee verification detected:', hasFeeVerification ? 'PASS' : 'FAIL');
  console.log('✓ Employer identity & registration detected:', hasEmployerIdentity ? 'PASS' : 'FAIL');
  console.log('✓ Job responsibilities & work scope detected:', hasResponsibilities ? 'PASS' : 'FAIL');
  console.log('✓ Employment classification (W-2 vs 1099) detected:', hasEmploymentTerms ? 'PASS' : 'FAIL');
  console.log('✓ No generic exit penalties/renewal in Gaps:', !hasGenericContractGaps ? 'PASS' : 'FAIL');
  console.log('✓ No generic exit penalties/renewal in Decision Flip:', !hasGenericContractFlips ? 'PASS' : 'FAIL');
  console.log('✓ Job-relevant Decision Flip Scenarios present:', hasJobRelevantFlips ? 'PASS' : 'FAIL');

  console.log('\n=== TEST 2: Sparse input (<8 words) ===');
  const sparseAd = {
    researchGoal: 'Should I apply?',
    domain: 'employment_and_jobs',
    sources: [
      {
        id: 'sparse-1',
        title: 'Snippet',
        content: 'Junior Data Analyst needed. Apply soon.'
      }
    ]
  };
  const sparseResult = await postAnalyze(sparseAd);
  console.log('Sparse Has Sufficient Data for Flip:', sparseResult.data.hasSufficientDataForFlip);
  console.log('Sparse Insufficient Data Notice:', sparseResult.data.insufficientDataNotice);
  console.log('Sparse Decision Flip Scenarios Count:', sparseResult.data.decisionFlipScenarios.length);
  console.log('✓ Explains insufficient data clearly:', sparseResult.data.hasSufficientDataForFlip === false ? 'PASS' : 'FAIL');

  console.log('\n=== ALL TESTS COMPLETE ===');
}

runTests().catch(console.error);
