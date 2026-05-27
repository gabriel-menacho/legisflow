import type {
  AuthMeResponse,
  ChatMessage,
  ChatThread,
  Client,
  DocumentSummary,
  Matter,
  MatterStep,
  MatterStepKey,
  User,
  UserRole,
  WorkflowRun,
  WorkflowTemplate,
} from "@legisflow/shared";
import {
  DEMO_CLIENT_ID,
  DEMO_EMAIL,
  DEMO_FIRM_ID,
  DEMO_MATTER_ID,
  DEMO_PASSWORD,
  DEMO_USER_ID,
  MATTER_STEP_DEFS,
  ROLE_LABELS,
  WORKFLOW_IDS,
  mockId,
  nowIso,
} from "@/mocks/fixtures";
import { DEMO_STEP_CONTENT } from "@/mocks/matter-step-content";
import { MATTER_PHASES, MATTER_STEP_ORDER, STEP_LABELS } from "@/lib/matter-workflow";

const STORAGE_KEY = "legisflow_mock_store";

export type MockUserRecord = User & {
  password: string;
  firm_id: string | null;
  role: UserRole | null;
};

export type MockStore = {
  users: MockUserRecord[];
  firms: AuthMeResponse["firm"][];
  sessions: Record<string, string>;
  leads: { email: string; name?: string; message?: string; created_at: string }[];
  documents: DocumentSummary[];
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  workflowTemplates: WorkflowTemplate[];
  workflowRuns: WorkflowRun[];
  clients: Client[];
  matters: Matter[];
  matterSteps: Record<string, MatterStep[]>;
};

function stepStatus(key: MatterStepKey): MatterStep["status"] {
  if (key === "revision_negotiation") return "in_progress";
  if (key in DEMO_STEP_CONTENT) return "completed";
  return "pending";
}

function buildDemoSteps(matterId: string): MatterStep[] {
  return MATTER_STEP_ORDER.map((key) => {
    const def = MATTER_STEP_DEFS[key];
    const content = DEMO_STEP_CONTENT[key] ?? {};
    return {
      id: `step-${matterId}-${key}`,
      matter_id: matterId,
      step_key: key,
      label: def.label,
      status: stepStatus(key),
      assigned_role: def.assigned_role,
      assigned_role_label: ROLE_LABELS[def.assigned_role] ?? def.assigned_role,
      content: { ...content },
      ai_log: key in DEMO_STEP_CONTENT ? `[Mock] Seeded content for ${key}` : null,
      updated_at: nowIso(),
    };
  });
}

export function buildInitialStore(): MockStore {
  const ts = nowIso();
  const demoFirm: NonNullable<AuthMeResponse["firm"]> = {
    id: DEMO_FIRM_ID,
    name: "LegisFlow Demo Firm",
    size: "11-50",
    practice_areas: ["Litigation", "Corporate"],
    integrations: ["Clio", "n8n"],
    onboarding_complete: true,
  };

  const demoUser: MockUserRecord = {
    id: DEMO_USER_ID,
    email: DEMO_EMAIL,
    full_name: "Demo Attorney",
    password: DEMO_PASSWORD,
    firm_id: DEMO_FIRM_ID,
    role: "owner",
  };

  const demoClient: Client = {
    id: DEMO_CLIENT_ID,
    name: "Riverside Manufacturing",
    company: "Riverside Manufacturing Ltd.",
    email: "legal@riverside-mfg.example",
    phone: "+44 20 7946 0958",
    notes: "Manufacturing sector client — corporate and employment work.",
    status: "active",
    created_at: ts,
    updated_at: ts,
    matter_count: 1,
  };

  const demoMatter: Matter = {
    id: DEMO_MATTER_ID,
    client_id: DEMO_CLIENT_ID,
    title: "Senior Employment Agreement — CFO",
    matter_type: "employment_contract",
    status: "active",
    current_step_key: "revision_negotiation",
    summary:
      "Executive employment contract for incoming CFO with restrictive covenants and KPI bonus.",
    created_at: ts,
    updated_at: ts,
    client_name: demoClient.name,
  };

  const workflowTemplates: WorkflowTemplate[] = [
    {
      id: WORKFLOW_IDS.clientIntake,
      slug: "client-intake-automation",
      name: "Client Intake Automation",
      description: "Zero-touch intake pipelines mapping to your CMS.",
    },
    {
      id: WORKFLOW_IDS.contractDrafting,
      slug: "contract-drafting-pipeline",
      name: "Contract Drafting Pipeline",
      description: "Parametric template injection via LLMs.",
    },
    {
      id: WORKFLOW_IDS.caseSummarization,
      slug: "case-summarization",
      name: "Case Summarization",
      description: "Discovery ingest, timelines, and entity mapping.",
    },
  ];

  const threadId = "thread-demo-001";
  const threads: ChatThread[] = [
    {
      id: threadId,
      title: "CFO contract — restrictive covenants",
      created_at: ts,
      updated_at: ts,
    },
  ];

  const messages: Record<string, ChatMessage[]> = {
    [threadId]: [
      {
        id: "msg-001",
        role: "user",
        content: "What is our position on the 9-month non-compete?",
        created_at: ts,
      },
      {
        id: "msg-002",
        role: "assistant",
        content:
          "Based on indexed matter documents, the draft proposes a 9-month UK non-compete for the CFO role, supported by garden leave and legitimate interest in trade secrets. Client counter-proposal requests 12 months — recommend 9-month non-compete with 15-month non-solicit of key accounts.",
        citations: [
          {
            document_id: "doc-demo-001",
            filename: "Prior_CFO_Contract_Redacted.pdf",
            excerpt: "Prior contract used 6-month non-compete; board now seeks 9 months.",
          },
        ],
        created_at: ts,
      },
    ],
  };

  const documents: DocumentSummary[] = [
    {
      id: "doc-demo-001",
      filename: "Prior_CFO_Contract_Redacted.pdf",
      status: "ready",
      created_at: ts,
      chunk_count: 42,
      matter_id: DEMO_MATTER_ID,
      folder: "intake",
    },
    {
      id: "doc-demo-002",
      filename: "Riverside_Org_Chart_2026.pdf",
      status: "ready",
      created_at: ts,
      chunk_count: 12,
      matter_id: DEMO_MATTER_ID,
      folder: "intake",
    },
    {
      id: "doc-demo-003",
      filename: "Employment_Law_Overview.pdf",
      status: "ready",
      created_at: ts,
      chunk_count: 28,
      matter_id: null,
      folder: "general",
    },
  ];

  const completedRun: WorkflowRun = {
    id: "run-demo-completed",
    workflow_id: WORKFLOW_IDS.caseSummarization,
    status: "completed",
    input_payload: { query: "CFO employment matter summary", matter_id: DEMO_MATTER_ID },
    output_summary:
      "Ingest matter context: Indexed 3 documents.\nSummarize discovery: Key negotiation on non-compete duration.\nBuild timeline: Offer (May 1) → Draft v1 (May 10) → v2 (May 15).",
    created_at: ts,
    completed_at: ts,
    steps: [
      { id: "rs-1", step_order: 1, name: "Ingest matter context", status: "completed", log: "Loaded Riverside CFO matter context." },
      { id: "rs-2", step_order: 2, name: "Summarize discovery", status: "completed", log: "Non-compete negotiation is primary open item." },
      { id: "rs-3", step_order: 3, name: "Build timeline", status: "completed", log: "Timeline generated through v2 draft." },
    ],
  };

  return {
    users: [demoUser],
    firms: [demoFirm],
    sessions: {},
    leads: [],
    documents,
    threads,
    messages,
    workflowTemplates,
    workflowRuns: [completedRun],
    clients: [demoClient],
    matters: [demoMatter],
    matterSteps: { [DEMO_MATTER_ID]: buildDemoSteps(DEMO_MATTER_ID) },
  };
}

let memoryStore: MockStore | null = null;

function hydrate(): MockStore {
  if (typeof window === "undefined") return buildInitialStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as MockStore;
  } catch {
    /* ignore */
  }
  return buildInitialStore();
}

export function getStore(): MockStore {
  if (!memoryStore) memoryStore = hydrate();
  return memoryStore;
}

export function persistStore() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getStore()));
}

export function resetMockStore() {
  memoryStore = buildInitialStore();
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function resolveSessionUser(access: string | null): MockUserRecord | null {
  if (!access) return null;
  const store = getStore();
  const userId = store.sessions[access];
  if (userId) return store.users.find((u) => u.id === userId) ?? null;
  if (access === "mock-access" || access.startsWith("mock-")) {
    return store.users.find((u) => u.email === DEMO_EMAIL) ?? store.users[0] ?? null;
  }
  return null;
}

export function authMeForUser(user: MockUserRecord): AuthMeResponse {
  const store = getStore();
  const firm = user.firm_id
    ? store.firms.find((f) => f?.id === user.firm_id) ?? null
    : null;
  return {
    user: { id: user.id, email: user.email, full_name: user.full_name },
    firm,
    role: user.role,
  };
}

export function createMatterSteps(matterId: string): MatterStep[] {
  return MATTER_STEP_ORDER.map((key) => {
    const def = MATTER_STEP_DEFS[key];
    return {
      id: `step-${matterId}-${key}`,
      matter_id: matterId,
      step_key: key,
      label: STEP_LABELS[key],
      status: key === "client_intake" ? "in_progress" : "pending",
      assigned_role: def.assigned_role,
      assigned_role_label: ROLE_LABELS[def.assigned_role] ?? def.assigned_role,
      content: {},
      ai_log: null,
      updated_at: nowIso(),
    };
  });
}

export function matterDetail(matterId: string) {
  const store = getStore();
  const matter = store.matters.find((m) => m.id === matterId);
  if (!matter) return null;
  const client = store.clients.find((c) => c.id === matter.client_id);
  const steps = store.matterSteps[matterId] ?? [];
  return {
    ...matter,
    client_name: client?.name ?? matter.client_name,
    steps,
    phases: MATTER_PHASES,
  };
}

export function issueTokens(userId: string): { access_token: string; refresh_token: string } {
  const access = mockId("mock-access");
  const refresh = mockId("mock-refresh");
  getStore().sessions[access] = userId;
  getStore().sessions[refresh] = userId;
  persistStore();
  return { access_token: access, refresh_token: refresh };
}

export function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
