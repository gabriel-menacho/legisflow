import type { MatterStepKey } from "@legisflow/shared";

/** Pre-seeded matter step content for demo matter (ported from API demo_seed_content.py). */
export const DEMO_STEP_CONTENT: Partial<Record<MatterStepKey, Record<string, unknown>>> = {
  client_intake: {
    fields: {
      "Client Name": "Riverside Manufacturing Ltd.",
      "Executive Role": "Chief Financial Officer",
      "Proposed Start Date": "1 September 2026",
      "Base Salary": "£185,000 + 20% bonus",
      "Reporting To": "CEO",
      Jurisdiction: "England & Wales",
    },
    documentsNeeded: [
      "Current org chart",
      "Prior CFO employment contract (redacted)",
      "Share incentive plan summary",
      "IP assignment policy",
    ],
    problemStatement:
      "Client requires a senior employment agreement for incoming CFO with enhanced confidentiality, restrictive covenants, and variable remuneration aligned to KPIs.",
    goals: [
      "Protect trade secrets and client relationships post-termination",
      "Align bonus to EBITDA and cash conversion metrics",
      "Enable garden leave and payment in lieu where appropriate",
    ],
    risks: [
      "Over-broad non-compete may be unenforceable under UK restraint doctrine",
      "Unclear bonus discretion could trigger wrongful dismissal exposure",
      "Missing whistleblowing carve-out in confidentiality clause",
    ],
    notes: [
      "Board wants 9-month non-compete",
      "Client prefers 3-month notice from employee",
      "Pension: employer 6% contribution",
    ],
  },
  document_collection: {
    files: [
      { name: "Prior_CFO_Contract_Redacted.pdf", status: "received", folder: "intake" },
      { name: "Riverside_Org_Chart_2026.pdf", status: "received", folder: "intake" },
      { name: "Share_Incentive_Plan_Summary.docx", status: "received", folder: "intake" },
      { name: "IP_Assignment_Policy.pdf", status: "pending", folder: "intake" },
    ],
    checklist: [
      { item: "Identity verification — CFO candidate", done: true },
      { item: "Company certificate of incorporation", done: true },
      { item: "Board resolution authorising offer", done: true },
      { item: "Pension scheme rules", done: false },
    ],
  },
  evidence_collection: {
    files: [
      { name: "Email_Thread_Offer_Terms.pdf", status: "verified", folder: "evidence" },
      { name: "Benchmark_Salary_Survey.pdf", status: "verified", folder: "evidence" },
    ],
    checklist: [
      { item: "Cross-check salary against market survey", done: true },
      { item: "Verify signatory authority on board resolution", done: true },
    ],
    flags: [
      {
        type: "gap",
        severity: "medium",
        message:
          "IP Assignment Policy not yet uploaded — required before draft finalisation.",
      },
      {
        type: "consistency",
        severity: "low",
        message:
          "Offer email references 6-month notice; intake notes specify 3-month employee notice.",
      },
    ],
  },
  legal_research: {
    citations: [
      {
        title: "Restrictive covenants in employment contracts",
        source: "UK Government / BEIS guidance",
        excerpt:
          "Non-compete clauses must be no wider than necessary to protect legitimate business interests.",
      },
      {
        title: "Patel v Peninsula Business Services",
        source: "EAT precedent",
        excerpt:
          "Garden leave provisions upheld where employer continues salary during restricted period.",
      },
      {
        title: "Employment Rights Act 1996 — s.86",
        source: "Statute",
        excerpt:
          "Minimum notice periods for employees with continuous service over one month.",
      },
    ],
    summary:
      "Research confirms enforceability of tailored restrictive covenants for senior executives when supported by legitimate interest and reasonable duration. Bonus clauses should specify objective metrics and pro-rata treatment on termination.",
    jurisdictionNotes:
      "England & Wales governing law; exclusive jurisdiction of English courts recommended.",
  },
  strategy_structure: {
    suggestions: [
      {
        category: "protections",
        title: "Enhanced confidentiality & trade secrets",
        body: "Extend confidentiality to group companies and require return/destruction of all media on exit.",
        rationale: "CFO access to consolidated financials and M&A pipeline.",
      },
      {
        category: "clauses",
        title: "Non-compete (9 months) + non-solicit (12 months)",
        body: "Geographic scope limited to UK; carve-out for passive investments <3%.",
        rationale: "Board mandate; must survive reasonableness test.",
      },
      {
        category: "risks",
        title: "Bonus discretion wording",
        body: "Replace sole discretion with 'reasonable discretion' tied to published KPI schedule.",
        rationale: "Reduce constructive dismissal and bonus dispute risk.",
      },
      {
        category: "negotiation",
        title: "Notice periods",
        body: "Propose 6-month employer / 3-month employee notice with garden leave option.",
        rationale: "Balance client preference with market standard for CFO roles.",
      },
      {
        category: "structure",
        title: "Document structure",
        body: "Main agreement + schedule (KPIs) + restrictive covenant schedule + IP assignment deed.",
        rationale: "Modular updates without re-executing entire contract.",
      },
    ],
  },
  draft_creation: {
    version: "v1",
    sections: [
      {
        heading: "1. Appointment & Duties",
        body: "The Executive is appointed as Chief Financial Officer reporting to the CEO, commencing 1 September 2026 on a full-time basis.",
      },
      {
        heading: "2. Remuneration",
        body: "Base salary £185,000 p.a. payable monthly. Annual bonus target 20% of base salary subject to KPI Schedule A (EBITDA, cash conversion, audit sign-off).",
      },
      {
        heading: "3. Confidentiality",
        body: "The Executive shall not disclose Confidential Information during or after employment except as required by law or with Board consent.",
      },
      {
        heading: "4. Restrictive Covenants",
        body: "For 9 months post-termination, the Executive shall not engage in Competing Business within the UK; non-solicitation of clients and employees for 12 months.",
      },
      {
        heading: "5. Termination",
        body: "Either party may terminate on 6 months' written notice (Employer) or 3 months' notice (Executive). Employer may place Executive on garden leave during notice.",
      },
    ],
  },
  internal_review: {
    complianceChecks: [
      { rule: "Minimum wage / working time", pass: true, detail: "Executive exempt category — N/A" },
      {
        rule: "Restrictive covenant reasonableness",
        pass: true,
        detail: "Duration and scope reviewed against Patel line of cases",
      },
      { rule: "Whistleblowing carve-out", pass: true, detail: "Included in confidentiality clause 3.4" },
      { rule: "Gender pay reporting", pass: true, detail: "Salary within approved band" },
      {
        rule: "Data protection (employee monitoring)",
        pass: false,
        detail: "Add reference to employee privacy notice",
      },
    ],
    comparisons: [
      {
        left: "Prior CFO contract (2022)",
        right: "Draft v1",
        diffSummary:
          "Non-compete extended from 6 to 9 months; bonus metrics updated to EBITDA-based schedule.",
      },
    ],
  },
  client_review: {
    comments: [
      {
        author: "CEO — Riverside",
        section: "Restrictive Covenants",
        text: "Prefer 12-month non-compete; willing to accept 9 months if non-solicit extended.",
        resolved: false,
      },
      {
        author: "HR Director",
        section: "Remuneration",
        text: "Confirm bonus payable pro-rata if termination without cause in H2.",
        resolved: true,
      },
    ],
  },
  revision_negotiation: {
    versions: [
      { label: "v1", date: "2026-05-10", summary: "Initial draft circulated to client" },
      {
        label: "v2",
        date: "2026-05-15",
        summary: "Incorporated pro-rata bonus; pending non-compete negotiation",
      },
    ],
    comments: [
      {
        author: "Senior Associate",
        text: "Counter-proposal: 9-month non-compete + 15-month non-solicit of key accounts.",
        clause: "Schedule B — Restrictive Covenants",
      },
    ],
  },
  final_approval: {
    checklist: [
      { item: "All client comments addressed or documented", done: false },
      { item: "Partner sign-off obtained", done: false },
      { item: "Defined terms cross-referenced", done: true },
      { item: "Schedules attached and numbered", done: true },
    ],
    approver: "Pending — Managing Partner",
    approvedAt: null,
  },
  execution_filing: {
    signers: [
      { name: "Riverside Manufacturing Ltd.", role: "Employer", status: "pending" },
      { name: "Executive (CFO)", role: "Employee", status: "pending" },
    ],
    provider: "DocuSign (mock)",
    envelopeId: "ENV-RM-CFO-2026-001",
    filingStatus: "Awaiting final approval before send",
  },
  storage_monitoring: {
    deadlines: [
      { label: "Contract renewal review", date: "2031-08-31", type: "renewal" },
      { label: "Restrictive covenant expiry review", date: "2027-06-01", type: "compliance" },
      { label: "Annual bonus KPI certification", date: "2027-03-31", type: "compliance" },
    ],
    obligations: [
      "Maintain executed copy in matter folder",
      "Calendar non-compete end date for client alert",
      "Notify payroll of bonus schedule attachment",
    ],
    renewalReminders: ["90-day pre-expiry review to Managing Partner"],
  },
};

export const GENERATE_SNIPPETS: Partial<Record<MatterStepKey, Record<string, unknown>>> = {
  legal_research: {
    aiSummary:
      "Additional case law suggests 9-month non-competes for CFO roles are enforceable when paired with garden leave.",
  },
  draft_creation: {
    aiDraftNote: "Generated supplementary clause 3.4(b) — whistleblowing carve-out.",
  },
  strategy_structure: {
    aiNote: "Recommended KPI schedule attachment as Schedule A.",
  },
};
