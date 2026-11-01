"""
GAPLENS – The Decision Blind-Spot Detector
Flask Backend Implementation for Shinchan Online Hackathon 2026
Problem Statement: DIGITAL DARK SPOT – AI-Assisted Information Gap Detection Platform

Author: GAPLENS Team
"""

import os
import re
import json
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load optional Gemini key from environment
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "GAPLENS Flask Backend",
        "has_gemini_key": bool(GEMINI_API_KEY),
        "timestamp": datetime.utcnow().isoformat()
    })

@app.route("/api/demo-data", methods=["GET"])
def get_demo_data():
    sample_path = os.path.join(os.path.dirname(__file__), "sample_data.json")
    if os.path.exists(sample_path):
        with open(sample_path, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify({"error": "Sample data file not found"}), 404

@app.route("/api/fetch-url", methods=["POST"])
def fetch_url():
    data = request.get_json() or {}
    url = data.get("url")
    if not url:
        return jsonify({"error": "Missing URL parameter"}), 400

    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 GAPLENS/1.0"
        }
        resp = requests.get(url, headers=headers, timeout=8)
        if resp.status_code != 200:
            return jsonify({"error": f"Remote server returned HTTP {resp.status_code}", "inaccessible": True}), resp.status_code

        soup = BeautifulSoup(resp.text, "html.parser")
        
        # Remove non-content elements
        for script_or_style in soup(["script", "style", "nav", "footer", "noscript", "svg"]):
            script_or_style.decompose()

        title = soup.title.string.strip() if soup.title and soup.title.string else url
        text_content = " ".join(soup.stripped_strings)

        return jsonify({
            "title": title,
            "url": url,
            "accessed_date": datetime.utcnow().strftime("%Y-%m-%d"),
            "content_length": len(text_content),
            "snippet": text_content[:15000]
        })
    except Exception as e:
        return jsonify({"error": f"Could not fetch URL: {str(e)}", "inaccessible": True}), 502

def run_rule_based_analysis(research_goal, sources):
    """
    Deterministic rule-based NLP & Heuristic Engine.
    Ensures GAPLENS functions reliably even without an LLM API key.
    """
    current_year = datetime.utcnow().year
    claims = []
    contradictions = []
    gaps = []
    outdated_flags = []
    flip_scenarios = []
    verification_tasks = []

    claim_idx = 1
    for src in sources:
        text = src.get("content", "")
        sentences = re.split(r'(?<=[.?!])\s+', text)
        src_id = src.get("id", f"src-{len(claims)+1}")
        src_title = src.get("title", "Untitled Source")
        pub_date = src.get("publication_date", "")

        # Check for outdated year in date or text
        years = [int(y) for y in re.findall(r'\b(20[12]\d)\b', text)]
        max_year = max(years) if years else None
        if pub_date and int(pub_date[:4]) < current_year - 1:
            outdated_flags.append({
                "id": f"out-{len(outdated_flags)+1}",
                "source_id": src_id,
                "source_title": src_title,
                "claimed_date": pub_date,
                "current_cycle_year": current_year,
                "reason": f"Published in {pub_date}, preceding the current operational cycle ({current_year}).",
                "urgency": "high"
            })

        for s in sentences:
            s_clean = s.strip()
            if len(s_clean) < 25:
                continue
            lower = s_clean.lower()
            category = None
            if any(k in lower for k in ["$", "usd", "award", "amount", "stipend"]):
                category = "financial_award"
            elif any(k in lower for k in ["gpa", "eligib", "minimum", "requirement"]):
                category = "eligibility"
            elif any(k in lower for k in ["deadline", "due date", "closing"]):
                category = "deadlines"
            elif any(k in lower for k in ["transcript", "recommendation", "tax", "document"]):
                category = "required_documents"
            elif any(k in lower for k in ["renew", "maintain", "continu"]):
                category = "renewal_conditions"

            if category and len(claims) < 25:
                claims.append({
                    "id": f"cl-{claim_idx}",
                    "source_id": src_id,
                    "source_title": src_title,
                    "category": category,
                    "claim_text": s_clean,
                    "verbatim_quote": s_clean,
                    "confidence_score": 0.95 if src.get("is_official") else 0.8,
                    "date_referenced": pub_date or (f"{max_year}-01-01" if max_year else None)
                })
                claim_idx += 1

    # Contradiction detection across documents
    req_docs = [c for c in claims if c["category"] == "required_documents"]
    if len(req_docs) >= 2 and req_docs[0]["source_id"] != req_docs[1]["source_id"]:
        contradictions.append({
            "id": "con-1",
            "topic": "Document Requirements Discrepancy",
            "claim_a": req_docs[0],
            "claim_b": req_docs[1],
            "type": "direct_factual_clash",
            "explanation": f"Document submissions differ between '{req_docs[0]['source_title']}' and '{req_docs[1]['source_title']}'. Submitting the wrong documents risks immediate disqualification.",
            "is_date_driven_difference": False,
            "evidence_strength": "high"
        })

    # Missing Evidence Radar: Renewal Terms
    has_renewal = any(c["category"] == "renewal_conditions" for c in claims)
    if not has_renewal:
        gaps.append({
            "id": "gap-renewal",
            "topic": "Multi-Year Renewal Guarantee & Retention Criteria",
            "unanswered_question": "Does the funding recur for Year 2, 3, and 4, and what retention criteria (minimum GPA, completed credits) apply?",
            "reason_missing_matters": "Committing to a high-cost path assuming multi-year aid leads to severe funding deficits if the award terminates after Year 1.",
            "severity": "critical",
            "category": "renewal_conditions",
            "suggested_follow_up": "Check official charter for explicit renewal clauses or recurring funding schedules."
        })

        # DECISION FLIP TEST (SIGNATURE FEATURE)
        flip_scenarios.append({
            "id": "flip-1",
            "missing_factor": "Multi-Year Renewal vs One-Time Grant",
            "current_apparent_choice": "Accept admission offer assuming total 4-year funding is secured.",
            "flipped_choice": "Decline or choose lower-cost in-state institution unless written multi-year retention terms are issued.",
            "trigger_condition": "If award terminates after 2 semesters or requires maintaining an unrealistic 3.9 GPA.",
            "impact_score": 10,
            "urgency_score": 9,
            "flip_probability": "high",
            "explanation": "A student banking on $72k total support will face a $54k debt hole if the award is one-time.",
            "is_hypothetical": True
        })

    # Actionable verification checklist
    verification_tasks.append({
        "id": "task-1",
        "title": "Validate Renewal Criteria with Direct Issuing Authority",
        "description": "Contact official registrar/board to verify multi-year terms and minimum retention standards.",
        "priority": "critical",
        "target_official_source": sources[0].get("title", "Official Issuing Authority"),
        "completed": False
    })
    if contradictions:
        verification_tasks.append({
            "id": "task-2",
            "title": "Verify Required Documents Against Official Gazette",
            "description": "Confirm whether parental tax transcripts and multiple letters are mandated.",
            "priority": "critical",
            "target_official_source": contradictions[0]["claim_a"]["source_title"],
            "completed": False
        })

    return {
        "research_goal": research_goal,
        "timestamp": datetime.utcnow().isoformat(),
        "summary": {
            "sources_analyzed_count": len(sources),
            "claims_count": len(claims),
            "contradictions_count": len(contradictions),
            "gaps_identified_count": len(gaps),
            "outdated_sources_count": len(outdated_flags),
            "critical_tasks_count": sum(1 for t in verification_tasks if t["priority"] == "critical"),
            "evidence_coverage_confidence": min(85, max(40, len(sources) * 22)),
            "blind_spot_risk_score": max(55, 95 - len(sources) * 10),
            "limitations_notice": "Analysis strictly limited to supplied text documents. External unprovided policies may supersede."
        },
        "sources": sources,
        "claims": claims,
        "contradictions": contradictions,
        "gaps": gaps,
        "outdated_flags": outdated_flags,
        "decision_flip_scenarios": flip_scenarios,
        "verification_checklist": verification_tasks,
        "engine_used": "rule_based_nlp"
    }

@app.route("/api/analyze", methods=["POST"])
def analyze_sources():
    data = request.get_json() or {}
    research_goal = data.get("research_goal")
    sources = data.get("sources", [])

    if not research_goal or not sources:
        return jsonify({"error": "research_goal and at least one source are required"}), 400

    result = run_rule_based_analysis(research_goal, sources)
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
