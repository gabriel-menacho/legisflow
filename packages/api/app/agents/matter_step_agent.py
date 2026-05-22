import json
import re

from pydantic_ai import Agent

from app.llm import get_chat_model
from app.matter_workflow import MATTER_STEPS

matter_step_agent = Agent(
    get_chat_model(),
    system_prompt=(
        "You are a legal workflow AI for a law firm. "
        "Respond with valid JSON only — no markdown fences, no commentary outside JSON."
    ),
)

STEP_SCHEMA_HINTS: dict[str, str] = {
    "client_intake": """{
  "fields": {"Client Name": "...", "Role": "...", "Start Date": "..."},
  "documentsNeeded": ["string"],
  "problemStatement": "string",
  "goals": ["string"],
  "risks": ["string"],
  "notes": ["string"]
}""",
    "document_collection": """{
  "files": [{"name": "string", "status": "received|pending|review", "folder": "intake"}],
  "checklist": [{"item": "string", "done": true}]
}""",
    "evidence_collection": """{
  "files": [{"name": "string", "status": "verified|pending", "folder": "evidence"}],
  "checklist": [{"item": "string", "done": true}],
  "flags": [{"type": "authenticity|consistency|gap", "severity": "low|medium|high", "message": "string"}]
}""",
    "legal_research": """{
  "citations": [{"title": "string", "source": "string", "excerpt": "string"}],
  "summary": "string",
  "jurisdictionNotes": "string"
}""",
    "strategy_structure": """{
  "suggestions": [{"category": "protections|clauses|risks|negotiation|structure", "title": "string", "body": "string", "rationale": "string"}]
}""",
    "draft_creation": """{
  "sections": [{"heading": "string", "body": "string"}],
  "version": "v1"
}""",
    "internal_review": """{
  "complianceChecks": [{"rule": "string", "pass": true, "detail": "string"}],
  "comparisons": [{"left": "string", "right": "string", "diffSummary": "string"}]
}""",
    "client_review": """{
  "comments": [{"author": "string", "section": "string", "text": "string", "resolved": false}]
}""",
    "revision_negotiation": """{
  "versions": [{"label": "v1", "date": "string", "summary": "string"}],
  "comments": [{"author": "string", "text": "string", "clause": "string"}]
}""",
    "final_approval": """{
  "checklist": [{"item": "string", "done": true}],
  "approver": "string",
  "approvedAt": null
}""",
    "execution_filing": """{
  "signers": [{"name": "string", "role": "string", "status": "pending|signed"}],
  "provider": "DocuSign (mock)",
  "envelopeId": "string",
  "filingStatus": "string"
}""",
    "storage_monitoring": """{
  "deadlines": [{"label": "string", "date": "string", "type": "renewal|hearing|compliance"}],
  "obligations": ["string"],
  "renewalReminders": ["string"]
}""",
}


def _parse_json_output(raw: str) -> dict | None:
    text = raw.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        data = json.loads(text)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            try:
                data = json.loads(match.group())
                return data if isinstance(data, dict) else None
            except json.JSONDecodeError:
                return None
    return None


async def generate_matter_step_content(
    step_key: str,
    matter_title: str,
    matter_type: str,
    client_name: str,
    prior_steps: dict[str, dict],
    rag_context: str,
) -> tuple[dict, str]:
    step_def = MATTER_STEPS.get(step_key, {"label": step_key})
    schema_hint = STEP_SCHEMA_HINTS.get(step_key, '{"summary": "string"}')
    prior_json = json.dumps(prior_steps, indent=2)[:4000]

    prompt = f"""Generate content for workflow step: {step_def.get("label", step_key)}
Matter: {matter_title} ({matter_type})
Client: {client_name}

Prior step outputs:
{prior_json}

Indexed documents context:
{rag_context[:3000]}

Return JSON matching this schema:
{schema_hint}

Use realistic legal content appropriate for this matter. Be specific and professional."""

    result = await matter_step_agent.run(prompt)
    if hasattr(result, "data"):
        raw = str(result.data)
    elif hasattr(result, "output"):
        raw = str(result.output)
    else:
        raw = str(result)

    parsed = _parse_json_output(raw)
    if parsed:
        return parsed, raw[:2000]

    fallback = {"summary": raw[:1500], "generated": True}
    return fallback, raw[:2000]
