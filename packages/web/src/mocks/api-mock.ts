import type {
  AuthMeResponse,
  ChatMessage,
  ChatThread,
  Client,
  DashboardStats,
  DocumentSummary,
  LeadCreate,
  Matter,
  MatterDetail,
  MatterDocumentFolder,
  MatterStep,
  MatterStepKey,
  WorkflowRun,
} from "@legisflow/shared";
import { ApiError } from "@/lib/api-client";
import {
  DEMO_EMAIL,
  DEMO_MATTER_ID,
  DEMO_PASSWORD,
  mockId,
  nowIso,
} from "@/mocks/fixtures";
import { GENERATE_SNIPPETS } from "@/mocks/matter-step-content";
import {
  assistantCitations,
  assistantReplyText,
  simulateDocumentReady,
  simulateWorkflowRun,
} from "@/mocks/simulations";
import {
  authMeForUser,
  createMatterSteps,
  delay,
  getStore,
  issueTokens,
  matterDetail,
  persistStore,
  resolveSessionUser,
  type MockUserRecord,
} from "@/mocks/store";
import { getTokens } from "@/lib/auth-tokens";
import { MATTER_STEP_ORDER } from "@/lib/matter-workflow";

function currentUser(): MockUserRecord {
  const { access } = getTokens();
  const user = resolveSessionUser(access);
  if (!user) throw new ApiError("Not authenticated", 401);
  return user;
}

function requireFirm(user: MockUserRecord) {
  if (!user.firm_id) throw new ApiError("Complete onboarding first", 400);
}

export const mockApi = {
  register: async (email: string, _password: string, full_name?: string) => {
    await delay(300);
    const store = getStore();
    if (store.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new ApiError("Email already registered", 400);
    }
    const userId = mockId("user");
    const firmId = mockId("firm");
    store.users.push({
      id: userId,
      email,
      full_name: full_name ?? null,
      password: _password,
      firm_id: firmId,
      role: "owner",
    });
    store.firms.push({
      id: firmId,
      name: "",
      size: null,
      practice_areas: [],
      integrations: [],
      onboarding_complete: false,
    });
    persistStore();
    return issueTokens(userId);
  },

  login: async (email: string, password: string) => {
    await delay(300);
    const store = getStore();
    const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        const demo = store.users.find((u) => u.email === DEMO_EMAIL);
        if (demo) return issueTokens(demo.id);
      }
      throw new ApiError("Invalid credentials", 401);
    }
    if (user.password !== password && !(email === DEMO_EMAIL && password === DEMO_PASSWORD)) {
      throw new ApiError("Invalid credentials", 401);
    }
    return issueTokens(user.id);
  },

  logout: async () => {
    await delay(100);
    return undefined;
  },

  me: async (): Promise<AuthMeResponse> => {
    await delay(150);
    return authMeForUser(currentUser());
  },

  onboarding: async (data: {
    name: string;
    size?: string;
    practice_areas: string[];
    integrations: string[];
  }) => {
    await delay(400);
    const user = currentUser();
    requireFirm(user);
    const store = getStore();
    const firm = store.firms.find((f) => f?.id === user.firm_id);
    if (!firm) throw new ApiError("Firm not found", 404);
    firm.name = data.name;
    firm.size = data.size ?? null;
    firm.practice_areas = data.practice_areas;
    firm.integrations = data.integrations;
    firm.onboarding_complete = true;
    persistStore();
    return authMeForUser(user);
  },

  createLead: async (data: LeadCreate) => {
    await delay(300);
    getStore().leads.push({
      email: data.email,
      name: data.name,
      message: data.message,
      created_at: nowIso(),
    });
    persistStore();
    return { ok: true };
  },

  dashboardStats: async (): Promise<DashboardStats> => {
    await delay(200);
    const store = getStore();
    currentUser();
    const activeMatters = store.matters.filter((m) => m.status === "active").length;
    return {
      documents_indexed: store.documents.filter((d) => d.status === "ready").length,
      chat_threads: store.threads.length,
      workflow_runs: store.workflowRuns.length,
      documents_processing: store.documents.filter((d) => d.status === "processing").length,
      clients_count: store.clients.length,
      active_matters: activeMatters,
      demo_matter_id: store.matters.some((m) => m.id === DEMO_MATTER_ID)
        ? DEMO_MATTER_ID
        : store.matters[0]?.id ?? null,
      demo_client_id: store.clients[0]?.id ?? null,
    };
  },

  llmConfig: async () => {
    await delay(150);
    return {
      provider: "ollama (mock)",
      chat_model: "llama3.2",
      embed_model: "nomic-embed-text",
    };
  },

  listDocuments: async (params?: { matter_id?: string; folder?: string }) => {
    await delay(150);
    currentUser();
    let docs = getStore().documents;
    if (params?.matter_id) docs = docs.filter((d) => d.matter_id === params.matter_id);
    if (params?.folder) docs = docs.filter((d) => d.folder === params.folder);
    return docs;
  },

  uploadDocument: async (
    file: File,
    opts?: { matterId?: string; folder?: MatterDocumentFolder },
  ) => {
    await delay(200);
    currentUser();
    const doc: DocumentSummary = {
      id: mockId("doc"),
      filename: file.name,
      status: "processing",
      created_at: nowIso(),
      chunk_count: 0,
      matter_id: opts?.matterId ?? null,
      folder: opts?.folder ?? "general",
    };
    getStore().documents.unshift(doc);
    persistStore();
    simulateDocumentReady(doc.id);
    return doc;
  },

  deleteDocument: async (id: string) => {
    await delay(150);
    currentUser();
    const store = getStore();
    store.documents = store.documents.filter((d) => d.id !== id);
    persistStore();
    return undefined;
  },

  listThreads: async () => {
    await delay(150);
    currentUser();
    return [...getStore().threads].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
  },

  createThread: async (title = "New conversation") => {
    await delay(200);
    currentUser();
    const thread: ChatThread = {
      id: mockId("thread"),
      title,
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    getStore().threads.unshift(thread);
    getStore().messages[thread.id] = [];
    persistStore();
    return thread;
  },

  listMessages: async (threadId: string) => {
    await delay(150);
    currentUser();
    return getStore().messages[threadId] ?? [];
  },

  sendMessage: async (threadId: string, content: string) => {
    await delay(800);
    currentUser();
    const store = getStore();
    const thread = store.threads.find((t) => t.id === threadId);
    if (!thread) throw new ApiError("Thread not found", 404);

    const userMsg: ChatMessage = {
      id: mockId("msg"),
      role: "user",
      content,
      created_at: nowIso(),
    };
    const list = store.messages[threadId] ?? [];
    list.push(userMsg);

    const reply: ChatMessage = {
      id: mockId("msg"),
      role: "assistant",
      content: assistantReplyText(content),
      citations: assistantCitations(),
      created_at: nowIso(),
    };
    list.push(reply);
    store.messages[threadId] = list;
    thread.updated_at = nowIso();
    thread.title =
      thread.title === "New conversation" ? content.slice(0, 48) : thread.title;
    persistStore();
    return reply;
  },

  listWorkflows: async () => {
    await delay(150);
    currentUser();
    return getStore().workflowTemplates;
  },

  getWorkflow: async (id: string) => {
    await delay(150);
    currentUser();
    const t = getStore().workflowTemplates.find((w) => w.id === id);
    if (!t) throw new ApiError("Workflow not found", 404);
    return t;
  },

  triggerWorkflow: async (id: string, payload: Record<string, unknown>) => {
    await delay(300);
    currentUser();
    const template = getStore().workflowTemplates.find((w) => w.id === id);
    if (!template) throw new ApiError("Workflow not found", 404);

    const run: WorkflowRun = {
      id: mockId("run"),
      workflow_id: id,
      status: "pending",
      input_payload: payload,
      output_summary: null,
      created_at: nowIso(),
      completed_at: null,
      steps: [],
    };
    getStore().workflowRuns.unshift(run);
    persistStore();
    simulateWorkflowRun(run.id);
    return run;
  },

  listWorkflowRuns: async () => {
    await delay(150);
    currentUser();
    return [...getStore().workflowRuns].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },

  getWorkflowRun: async (id: string) => {
    await delay(150);
    currentUser();
    const run = getStore().workflowRuns.find((r) => r.id === id);
    if (!run) throw new ApiError("Run not found", 404);
    return run;
  },

  listClients: async () => {
    await delay(150);
    currentUser();
    return getStore().clients;
  },

  createClient: async (data: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) => {
    await delay(300);
    currentUser();
    const ts = nowIso();
    const client: Client = {
      id: mockId("client"),
      name: data.name,
      company: data.company ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      notes: data.notes ?? null,
      status: "active",
      created_at: ts,
      updated_at: ts,
      matter_count: 0,
    };
    getStore().clients.push(client);
    persistStore();
    return client;
  },

  getClient: async (id: string) => {
    await delay(150);
    currentUser();
    const c = getStore().clients.find((x) => x.id === id);
    if (!c) throw new ApiError("Client not found", 404);
    return c;
  },

  updateClient: async (id: string, data: Partial<Client>) => {
    await delay(200);
    currentUser();
    const c = getStore().clients.find((x) => x.id === id);
    if (!c) throw new ApiError("Client not found", 404);
    Object.assign(c, data, { updated_at: nowIso() });
    persistStore();
    return c;
  },

  deleteClient: async (id: string) => {
    await delay(200);
    currentUser();
    const store = getStore();
    const removedMatterIds = store.matters
      .filter((m) => m.client_id === id)
      .map((m) => m.id);
    store.clients = store.clients.filter((c) => c.id !== id);
    store.matters = store.matters.filter((m) => m.client_id !== id);
    for (const mid of removedMatterIds) delete store.matterSteps[mid];
    persistStore();
    return undefined;
  },

  listClientMatters: async (clientId: string) => {
    await delay(150);
    currentUser();
    return getStore().matters.filter((m) => m.client_id === clientId);
  },

  createMatter: async (
    clientId: string,
    data: { title: string; matter_type?: string; summary?: string },
  ) => {
    await delay(300);
    currentUser();
    const client = getStore().clients.find((c) => c.id === clientId);
    if (!client) throw new ApiError("Client not found", 404);

    const ts = nowIso();
    const matterId = mockId("matter");
    const matter: Matter = {
      id: matterId,
      client_id: clientId,
      title: data.title,
      matter_type: data.matter_type ?? "general",
      status: "active",
      current_step_key: "client_intake",
      summary: data.summary ?? null,
      created_at: ts,
      updated_at: ts,
      client_name: client.name,
    };
    getStore().matters.push(matter);
    getStore().matterSteps[matterId] = createMatterSteps(matterId);
    client.matter_count += 1;
    persistStore();
    return matter;
  },

  getMatter: async (matterId: string) => {
    await delay(200);
    currentUser();
    const detail = matterDetail(matterId);
    if (!detail) throw new ApiError("Matter not found", 404);
    return detail as MatterDetail;
  },

  updateMatter: async (matterId: string, data: Partial<Matter>) => {
    await delay(200);
    currentUser();
    const m = getStore().matters.find((x) => x.id === matterId);
    if (!m) throw new ApiError("Matter not found", 404);
    Object.assign(m, data, { updated_at: nowIso() });
    persistStore();
    return m;
  },

  generateMatterStep: async (matterId: string, stepKey: MatterStepKey) => {
    await delay(1500);
    currentUser();
    const steps = getStore().matterSteps[matterId];
    if (!steps) throw new ApiError("Matter not found", 404);
    const step = steps.find((s) => s.step_key === stepKey);
    if (!step) throw new ApiError("Step not found", 404);

    const snippet = GENERATE_SNIPPETS[stepKey] ?? {
      aiGenerated: true,
      generatedAt: nowIso(),
    };
    step.content = { ...step.content, ...snippet };
    step.ai_log = `[Mock AI] Generated content for ${stepKey} at ${nowIso()}`;
    step.status = "in_progress";
    step.updated_at = nowIso();

    const matter = getStore().matters.find((m) => m.id === matterId);
    if (matter) matter.current_step_key = stepKey;
    persistStore();
    return step;
  },

  updateMatterStep: async (
    matterId: string,
    stepKey: MatterStepKey,
    data: { status?: string; content?: Record<string, unknown> },
  ) => {
    await delay(250);
    currentUser();
    const steps = getStore().matterSteps[matterId];
    if (!steps) throw new ApiError("Matter not found", 404);
    const step = steps.find((s) => s.step_key === stepKey);
    if (!step) throw new ApiError("Step not found", 404);

    if (data.content) step.content = { ...step.content, ...data.content };
    if (data.status) step.status = data.status as MatterStep["status"];
    step.updated_at = nowIso();

    const matter = getStore().matters.find((m) => m.id === matterId);
    if (matter && data.status === "completed") {
      const idx = MATTER_STEP_ORDER.indexOf(stepKey);
      if (idx >= 0 && idx < MATTER_STEP_ORDER.length - 1) {
        matter.current_step_key = MATTER_STEP_ORDER[idx + 1];
      }
    }
    if (matter) matter.updated_at = nowIso();
    persistStore();
    return step;
  },
};
