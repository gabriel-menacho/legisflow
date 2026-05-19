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

    model_config = {"from_attributes": True}


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


class LLMConfigOut(BaseModel):
    provider: str
    chat_model: str
    embed_model: str
