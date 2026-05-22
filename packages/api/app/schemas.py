from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str | None

    model_config = {"from_attributes": True}


class FirmOut(BaseModel):
    id: str
    name: str
    size: str | None
    practice_areas: list[str]
    integrations: list[str]
    onboarding_complete: bool

    model_config = {"from_attributes": True}


class AuthMeResponse(BaseModel):
    user: UserOut
    firm: FirmOut | None
    role: str | None


class OnboardingRequest(BaseModel):
    name: str
    size: str | None = None
    practice_areas: list[str] = []
    integrations: list[str] = []


class FirmUpdateRequest(BaseModel):
    name: str | None = None
    size: str | None = None
    practice_areas: list[str] | None = None
    integrations: list[str] | None = None


class LeadCreate(BaseModel):
    email: EmailStr
    name: str | None = None
    message: str | None = None


class LeadOut(BaseModel):
    id: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class DocumentOut(BaseModel):
    id: str
    filename: str
    status: str
    created_at: datetime
    chunk_count: int = 0
    matter_id: str | None = None
    folder: str = "general"

    model_config = {"from_attributes": True}


class ClientCreate(BaseModel):
    name: str
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    notes: str | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    company: str | None = None
    email: str | None = None
    phone: str | None = None
    notes: str | None = None
    status: str | None = None


class ClientOut(BaseModel):
    id: str
    name: str
    company: str | None
    email: str | None
    phone: str | None
    notes: str | None
    status: str
    created_at: datetime
    updated_at: datetime
    matter_count: int = 0

    model_config = {"from_attributes": True}


class MatterCreate(BaseModel):
    title: str
    matter_type: str = "employment_contract"
    summary: str | None = None


class MatterUpdate(BaseModel):
    title: str | None = None
    matter_type: str | None = None
    status: str | None = None
    current_step_key: str | None = None
    summary: str | None = None


class MatterOut(BaseModel):
    id: str
    client_id: str
    title: str
    matter_type: str
    status: str
    current_step_key: str
    summary: str | None
    created_at: datetime
    updated_at: datetime
    client_name: str | None = None

    model_config = {"from_attributes": True}


class MatterStepOut(BaseModel):
    id: str
    matter_id: str
    step_key: str
    label: str
    status: str
    assigned_role: str
    assigned_role_label: str
    content: dict[str, Any]
    ai_log: str | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class MatterStepUpdate(BaseModel):
    status: str | None = None
    content: dict[str, Any] | None = None


class MatterDetailOut(MatterOut):
    steps: list[MatterStepOut] = []
    phases: list[dict[str, Any]] = []


class ChatThreadOut(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CitationOut(BaseModel):
    document_id: str
    filename: str
    excerpt: str


class ChatMessageOut(BaseModel):
    id: str
    role: str
    content: str
    citations: list[CitationOut] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ThreadCreate(BaseModel):
    title: str = "New conversation"


class MessageCreate(BaseModel):
    content: str


class WorkflowTemplateOut(BaseModel):
    id: str
    slug: str
    name: str
    description: str

    model_config = {"from_attributes": True}


class WorkflowTriggerRequest(BaseModel):
    payload: dict[str, Any] = {}


class WorkflowRunStepOut(BaseModel):
    id: str
    step_order: int
    name: str
    status: str
    log: str | None

    model_config = {"from_attributes": True}


class WorkflowRunOut(BaseModel):
    id: str
    workflow_id: str
    status: str
    input_payload: dict[str, Any]
    output_summary: str | None
    created_at: datetime
    completed_at: datetime | None
    steps: list[WorkflowRunStepOut] = []

    model_config = {"from_attributes": True}


class DashboardStats(BaseModel):
    documents_indexed: int
    chat_threads: int
    workflow_runs: int
    documents_processing: int
    clients_count: int = 0
    active_matters: int = 0
    demo_matter_id: str | None = None
    demo_client_id: str | None = None


class LLMConfigOut(BaseModel):
    provider: str
    chat_model: str
    embed_model: str
