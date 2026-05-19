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
}

export const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";
