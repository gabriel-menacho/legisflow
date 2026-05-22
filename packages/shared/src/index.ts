export type UserRole = "owner" | "admin" | "member";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
}

export interface Firm {
  id: string;
  name: string;
  size: string | null;
  practice_areas: string[];
  integrations: string[];
  onboarding_complete: boolean;
}

export interface AuthMeResponse {
  user: User;
  firm: Firm | null;
  role: UserRole | null;
}

export interface LeadCreate {
  email: string;
  name?: string;
  message?: string;
}

export interface DocumentSummary {
  id: string;
  filename: string;
  status: "processing" | "ready" | "failed";
  created_at: string;
  chunk_count: number;
  matter_id?: string | null;
  folder?: string;
}

export type MatterStepKey =
  | "client_intake"
  | "document_collection"
  | "evidence_collection"
  | "legal_research"
  | "strategy_structure"
  | "draft_creation"
  | "internal_review"
  | "client_review"
  | "revision_negotiation"
  | "final_approval"
  | "execution_filing"
  | "storage_monitoring";

export type MatterDocumentFolder =
  | "general"
  | "intake"
  | "evidence"
  | "research"
  | "draft"
  | "executed";

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  matter_count: number;
}

export interface Matter {
  id: string;
  client_id: string;
  title: string;
  matter_type: string;
  status: string;
  current_step_key: MatterStepKey;
  summary: string | null;
  created_at: string;
  updated_at: string;
  client_name?: string | null;
}

export interface MatterStep {
  id: string;
  matter_id: string;
  step_key: MatterStepKey;
  label: string;
  status: "pending" | "in_progress" | "completed";
  assigned_role: string;
  assigned_role_label: string;
  content: Record<string, unknown>;
  ai_log: string | null;
  updated_at: string;
}

export interface MatterPhase {
  key: string;
  label: string;
  steps: MatterStepKey[];
}

export interface MatterDetail extends Matter {
  steps: MatterStep[];
  phases: MatterPhase[];
}

export interface ChatThread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  created_at: string;
}

export interface Citation {
  document_id: string;
  filename: string;
  excerpt: string;
}

export interface WorkflowTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface WorkflowRunStep {
  id: string;
  step_order: number;
  name: string;
  status: string;
  log: string | null;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: "pending" | "running" | "completed" | "failed";
  input_payload: Record<string, unknown>;
  output_summary: string | null;
  created_at: string;
  completed_at: string | null;
  steps?: WorkflowRunStep[];
}

export interface DashboardStats {
  documents_indexed: number;
  chat_threads: number;
  workflow_runs: number;
  documents_processing: number;
  clients_count: number;
  active_matters: number;
  demo_matter_id: string | null;
  demo_client_id: string | null;
}

export const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";
