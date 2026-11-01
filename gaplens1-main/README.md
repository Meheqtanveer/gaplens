# GAPLENS – The Decision Blind-Spot Detector
### General-Purpose Digital Information Gap Detection Platform

> **"Don't just find information. Discover what could be missing before you make a decision."**

[![Shinchan Hackathon 2026](https://img.shields.io/badge/Hackathon-Shinchan%20Online%202026-blue.svg)](https://hackathon.example.org)
[![Problem Statement](https://img.shields.io/badge/Problem%20Statement-Digital%20Dark%20Spot-cyan.svg)](https://hackathon.example.org)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

---

## 🎯 Executive Summary & Hackathon Mission

Engineered for the **Shinchan Online Hackathon 2026** solving the challenge:
**`DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform`**.

GAPLENS is a **universal, domain-independent information gap detection platform**. It analyzes information collected across **any sector**—education, banking & finance, employment, health insurance, government schemes, or general consumer decisions—to uncover:
1. **Critical Information Gaps**: Essential unstated clauses or omissions that users take for granted.
2. **Contradictions & Date Decay**: Distinguishing direct factual clashes from chronological cycle shifts.
3. **The Decision Flip Test (Signature Feature)**: Simulating which missing condition would cause a user to reverse an irreversible choice.
4. **Actionable Verification Checklist**: Directing users to verified primary authorities.

---

## 🌐 7 Supported Operational Domains

Users can select an explicit domain or allow GAPLENS to **Auto Detect** the domain from the context:
1. **Auto Detect**: Dynamically identifies the domain based on semantic vocabulary and document structure.
2. **Education**: Scholarships, grants, university admissions, and retention criteria.
3. **Banking & Finance**: Personal loans, mortgages, credit cards, APR teaser rates, and prepayment penalties.
4. **Employment & Jobs**: Job offers, equity stock options, post-termination exercise windows (PTEW), and non-compete covenants.
5. **Insurance**: Health coverage, critical illness, room rent sub-limits, proportionate deductions, and waiting periods.
6. **Government Schemes**: Welfare subsidies, citizen grants, income lookback audits, and disqualifying asset ceilings.
7. **General Information**: Contracts, agreements, consumer electronics warranties, and broad decision diligence.

---

## 🔬 4 Tested Domain Benchmarks (1-Click Test Scenarios)

| Domain | Tested Benchmark | Clashes & Dark Spots Uncovered | The Decision Flip |
| :--- | :--- | :--- | :--- |
| **Education** | **Scholarship Ad** | Official gazette mandates tax return & 2 letters; blog says 1 letter. Neither states renewal rules. | One-time grant vs. 4-year award flips choice from expensive private university to in-state public college ($54k debt saved). |
| **Banking & Finance** | **Personal Loan Ad** | Ad banner promotes "Zero fee & fixed 5.9% rate". TILA legal disclosure reveals 5.9% is a 6-month teaser jumping to 23.25% variable APR + 4.75% origination fee + 5% prepayment penalty. | Borrowing $40k to pay 18% credit cards triples interest charges. Flips choice from taking loan to keeping existing credit cards. |
| **Employment** | **Job Ad & Offer** | Ad advertises "100% remote freedom". Binding offer contract imposes worldwide 18-month non-compete in AI + 90-day stock option forfeiture cliff. | Flips choice from accepting offer to demanding deletion of non-compete or accepting a competing offer. |
| **Insurance** | **Health Policy** | Sales brochure promises "100% Cashless & Zero Room Capping". Policy wordings cap room at 1% and trigger proportionate deduction on all surgeon/hospital fees. | Exceeding room limit by $500 slashes surgery payout by 40%, leaving a $26k bill. Flips choice to policy with no sub-limits. |

---

## 🧩 Architectural Overview & Tech Stack

```
gaplens/
├── backend/                             # Python Alternative Backend
│   ├── app.py                           # Flask REST API & BeautifulSoup web scraper
│   ├── requirements.txt                 # Flask, requests, bs4, pandas, google-genai
│   └── sample_data.json                 # Multi-domain benchmark data
├── src/
│   ├── components/                      # Modular UI Views
│   │   ├── Header.tsx                   # Top Bar & 4-domain scenario dropdown
│   │   ├── InputPanel.tsx               # Domain selector (7 domains) & multi-source collector
│   │   ├── DashboardOverview.tsx        # High-density KPI strip & transparency notices
│   │   ├── EvidenceMap.tsx              # Interactive claim inspector & traceability table
│   │   ├── ContradictionHunter.tsx      # Side-by-side reconciliation & age detector
│   │   ├── MissingEvidenceRadar.tsx     # Categorized blind spots & where-to-verify
│   │   ├── DecisionFlipTest.tsx         # What-If Decision Simulator
│   │   ├── VerificationChecklist.tsx    # Prioritized tasks targeting verified authorities
│   │   └── ArchitectureGuide.tsx        # Hackathon submission guide
│   ├── data/
│   │   └── examples.ts                  # 4 Tested Domain Benchmarks
│   ├── types/
│   │   └── gaplens.ts                   # Strict TypeScript schemas & DomainType
│   ├── App.tsx                          # Root orchestrator & domain routing
│   └── index.css                        # Tailwind CSS v4 & typography
├── server.ts                            # Full-stack Node/Express server + Gemini 3.8 Flash SDK
├── package.json                         # Web dependencies
└── README.md                            # Complete documentation
```

### Dual-Engine Architecture
- **Primary AI Engine**: Gemini 3.8 Flash via `@google/genai` TypeScript SDK on the server side.
- **Deterministic Heuristic Engine**: Built-in rule-based NLP extractor that parses sentences, detects contradictions, identifies domain-specific gaps, and generates Decision Flip scenarios even without an API key or offline.

---

## 🚀 Quickstart & How to Run

### Method 1: Interactive Full-Stack Web Application (Default)

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Provide Gemini API key in .env
# If omitted, GAPLENS automatically runs its deterministic heuristic engine
echo 'GEMINI_API_KEY="your-key-here"' > .env

# 3. Start development server
npm run dev
```
Open your browser to: **`http://localhost:3000`**

### Method 2: Python Flask Backend (Submission Testing)

```bash
cd backend
pip install -r requirements.txt
python app.py
```
Runs on: **`http://localhost:5000`**

---

## ⚖️ License
Distributed under the Apache 2.0 License. Developed for Shinchan Online Hackathon 2026.
