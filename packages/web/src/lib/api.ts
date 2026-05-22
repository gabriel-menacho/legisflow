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
  WorkflowTemplate,
} from "@legisflow/shared";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }
  if (auth) {
    const { access } = getTokens();
    if (access) headers.Authorization = `Bearer ${access}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401 && auth) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, options, auth);
    clearTokens();
    if (typeof window !== "undefined") window.location.href = "/login";
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new ApiError(err.detail || "Request failed", res.status);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const { refresh } = getTokens();
  if (!refresh) return false;
  try {
    const data = await request<{ access_token: string; refresh_token: string }>(
      "/api/v1/auth/refresh",
      { method: "POST", body: JSON.stringify({ refresh_token: refresh }) },
      false,
    );
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  register: (email: string, password: string, full_name?: string) =>
    request<{ access_token: string; refresh_token: string }>(
      "/api/v1/auth/register",
      { method: "POST", body: JSON.stringify({ email, password, full_name }) },
      false,
    ),

  login: (email: string, password: string) =>
    request<{ access_token: string; refresh_token: string }>(
      "/api/v1/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
      false,
    ),

  logout: () => {
    const { refresh } = getTokens();
    if (refresh) {
      return request("/api/v1/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refresh_token: refresh }),
      }, false);
    }
    return Promise.resolve();
  },

  me: () => request<AuthMeResponse>("/api/v1/auth/me"),

  onboarding: (data: {
    name: string;
    size?: string;
    practice_areas: string[];
    integrations: string[];
  }) =>
    request("/api/v1/firms/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createLead: (data: LeadCreate) =>
    request("/api/v1/leads", {
      method: "POST",
      body: JSON.stringify(data),
    }, false),

  dashboardStats: () => request<DashboardStats>("/api/v1/dashboard/stats"),

  llmConfig: () =>
    request<{ provider: string; chat_model: string; embed_model: string }>(
      "/api/v1/dashboard/llm-config",
    ),

  listDocuments: (params?: { matter_id?: string; folder?: string }) => {
    const q = new URLSearchParams();
    if (params?.matter_id) q.set("matter_id", params.matter_id);
    if (params?.folder) q.set("folder", params.folder);
    const suffix = q.toString() ? `?${q}` : "";
    return request<DocumentSummary[]>(`/api/v1/documents${suffix}`);
  },

  uploadDocument: (
    file: File,
    opts?: { matterId?: string; folder?: MatterDocumentFolder },
  ) => {
    const form = new FormData();
    form.append("file", file);
    if (opts?.matterId) form.append("matter_id", opts.matterId);
    if (opts?.folder) form.append("folder", opts.folder);
    return request<DocumentSummary>("/api/v1/documents/upload", {
      method: "POST",
      body: form,
    });
  },

  deleteDocument: (id: string) =>
    request(`/api/v1/documents/${id}`, { method: "DELETE" }),

  listThreads: () => request<ChatThread[]>("/api/v1/threads"),

  createThread: (title = "New conversation") =>
    request<ChatThread>("/api/v1/threads", {
      method: "POST",
      body: JSON.stringify({ title }),
    }),

  listMessages: (threadId: string) =>
    request<ChatMessage[]>(`/api/v1/threads/${threadId}/messages`),

  sendMessage: (threadId: string, content: string) =>
    request<ChatMessage>(`/api/v1/threads/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  listWorkflows: () => request<WorkflowTemplate[]>("/api/v1/workflows"),

  getWorkflow: (id: string) => request<WorkflowTemplate>(`/api/v1/workflows/${id}`),

  triggerWorkflow: (id: string, payload: Record<string, unknown>) =>
    request<WorkflowRun>(`/api/v1/workflows/${id}/trigger`, {
      method: "POST",
      body: JSON.stringify({ payload }),
    }),

  listWorkflowRuns: () => request<WorkflowRun[]>("/api/v1/workflows/runs/list"),

  getWorkflowRun: (id: string) =>
    request<WorkflowRun>(`/api/v1/workflows/runs/${id}`),

  listClients: () => request<Client[]>("/api/v1/clients"),

  createClient: (data: {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    notes?: string;
  }) =>
    request<Client>("/api/v1/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getClient: (id: string) => request<Client>(`/api/v1/clients/${id}`),

  updateClient: (id: string, data: Partial<Client>) =>
    request<Client>(`/api/v1/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteClient: (id: string) =>
    request(`/api/v1/clients/${id}`, { method: "DELETE" }),

  listClientMatters: (clientId: string) =>
    request<Matter[]>(`/api/v1/clients/${clientId}/matters`),

  createMatter: (
    clientId: string,
    data: { title: string; matter_type?: string; summary?: string },
  ) =>
    request<Matter>(`/api/v1/clients/${clientId}/matters`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMatter: (matterId: string) =>
    request<MatterDetail>(`/api/v1/matters/${matterId}`),

  updateMatter: (matterId: string, data: Partial<Matter>) =>
    request<Matter>(`/api/v1/matters/${matterId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  generateMatterStep: (matterId: string, stepKey: MatterStepKey) =>
    request<MatterStep>(`/api/v1/matters/${matterId}/steps/${stepKey}/generate`, {
      method: "POST",
    }),

  updateMatterStep: (
    matterId: string,
    stepKey: MatterStepKey,
    data: { status?: string; content?: Record<string, unknown> },
  ) =>
    request<MatterStep>(`/api/v1/matters/${matterId}/steps/${stepKey}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};
