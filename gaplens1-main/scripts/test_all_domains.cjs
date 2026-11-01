const http = require('http');

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

async function testDomains() {
  console.log('=== MULTI-DOMAIN INTEGRATION SUITE ===\n');

  // 1. Scholarship Notice
  console.log('--- Domain 1: Scholarship Notice ---');
  const resScholarship = await postAnalyze({
    researchGoal: 'What should I verify before accepting this scholarship?',
    domain: 'education',
    sources: [
      {
        id: 'sch-1',
        title: 'National Merit Scholarship Announcement',
        isOfficial: true,
        content: 'Congratulations! You have been selected for the $15,000 National STEM Excellence Scholarship for the upcoming academic year. Must maintain satisfactory academic standing.'
      }
    ]
  });
  console.log('Detected Doc Type:', resScholarship.data.detectedDocumentType);
  console.log('Gaps found:', resScholarship.data.gaps.map(g => g.topic));
  console.log('Decision Flip Scenarios:', resScholarship.data.decisionFlipScenarios.map(f => f.missingFactor));

  // 2. Loan Advertisement
  console.log('\n--- Domain 2: Banking Loan Advertisement ---');
  const resLoan = await postAnalyze({
    researchGoal: 'Is this 0% APR business loan as good as advertised?',
    domain: 'banking_and_finance',
    sources: [
      {
        id: 'loan-1',
        title: 'FastTrack Capital 0% APR Financing Promo',
        isOfficial: true,
        content: 'Special financing rate: 0% APR for qualified small business borrowers up to $50,000 principal. Instant approval today!'
      }
    ]
  });
  console.log('Detected Doc Type:', resLoan.data.detectedDocumentType);
  console.log('Gaps found:', resLoan.data.gaps.map(g => g.topic));
  console.log('Decision Flip Scenarios:', resLoan.data.decisionFlipScenarios.map(f => f.missingFactor));

  // 3. Health Insurance Policy
  console.log('\n--- Domain 3: Health Insurance Policy ---');
  const resInsurance = await postAnalyze({
    researchGoal: 'Does this health insurance cover everything?',
    domain: 'insurance',
    sources: [
      {
        id: 'ins-1',
        title: 'Optima Health Plan Coverage Brochure',
        isOfficial: true,
        content: 'Optima Health Plus offers 100% cashless hospitalization across 5,000 network hospitals up to $500,000 sum insured.'
      }
    ]
  });
  console.log('Detected Doc Type:', resInsurance.data.detectedDocumentType);
  console.log('Gaps found:', resInsurance.data.gaps.map(g => g.topic));
  console.log('Decision Flip Scenarios:', resInsurance.data.decisionFlipScenarios.map(f => f.missingFactor));

  console.log('\n=== MULTI-DOMAIN TEST COMPLETED SUCCESSFULLY ===');
}

testDomains().catch(console.error);
