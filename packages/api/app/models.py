import uuid
from datetime import datetime
from enum import Enum

from pgvector.sqlalchemy import Vector
from sqlalchemy import (
    JSON,
    DateTime,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

EMBED_DIM = 768


def uuid_pk() -> str:
    return str(uuid.uuid4())


class UserRole(str, Enum):
    owner = "owner"
    admin = "admin"
    member = "member"


class DocumentStatus(str, Enum):
    processing = "processing"
    ready = "ready"
    failed = "failed"


class WorkflowRunStatus(str, Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    memberships: Mapped[list["FirmMembership"]] = relationship(back_populates="user")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")


class Firm(Base):
    __tablename__ = "firms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    name: Mapped[str] = mapped_column(String(255))
    size: Mapped[str | None] = mapped_column(String(64), nullable=True)
    practice_areas: Mapped[list] = mapped_column(JSON, default=list)
    integrations: Mapped[list] = mapped_column(JSON, default=list)
    onboarding_complete: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    memberships: Mapped[list["FirmMembership"]] = relationship(back_populates="firm")
    documents: Mapped[list["Document"]] = relationship(back_populates="firm")
    threads: Mapped[list["ChatThread"]] = relationship(back_populates="firm")
    workflow_runs: Mapped[list["WorkflowRun"]] = relationship(back_populates="firm")


class FirmMembership(Base):
    __tablename__ = "firm_memberships"
    __table_args__ = (UniqueConstraint("user_id", "firm_id", name="uq_user_firm"),)

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    firm_id: Mapped[str] = mapped_column(ForeignKey("firms.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String(32), default=UserRole.member.value)

    user: Mapped["User"] = relationship(back_populates="memberships")
    firm: Mapped["Firm"] = relationship(back_populates="memberships")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    revoked: Mapped[bool] = mapped_column(default=False)

    user: Mapped["User"] = relationship(back_populates="refresh_tokens")


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    email: Mapped[str] = mapped_column(String(255), index=True)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    firm_id: Mapped[str] = mapped_column(ForeignKey("firms.id", ondelete="CASCADE"), index=True)
    filename: Mapped[str] = mapped_column(String(512))
    storage_path: Mapped[str] = mapped_column(String(1024))
    status: Mapped[str] = mapped_column(String(32), default=DocumentStatus.processing.value)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    firm: Mapped["Firm"] = relationship(back_populates="documents")
    chunks: Mapped[list["DocumentChunk"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    document_id: Mapped[str] = mapped_column(ForeignKey("documents.id", ondelete="CASCADE"), index=True)
    firm_id: Mapped[str] = mapped_column(ForeignKey("firms.id", ondelete="CASCADE"), index=True)
    chunk_index: Mapped[int] = mapped_column()
    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(EMBED_DIM), nullable=True)

    document: Mapped["Document"] = relationship(back_populates="chunks")


class ChatThread(Base):
    __tablename__ = "chat_threads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    firm_id: Mapped[str] = mapped_column(ForeignKey("firms.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    title: Mapped[str] = mapped_column(String(255), default="New conversation")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    firm: Mapped["Firm"] = relationship(back_populates="threads")
    messages: Mapped[list["ChatMessage"]] = relationship(back_populates="thread", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    thread_id: Mapped[str] = mapped_column(ForeignKey("chat_threads.id", ondelete="CASCADE"), index=True)
    role: Mapped[str] = mapped_column(String(32))
    content: Mapped[str] = mapped_column(Text)
    citations: Mapped[list | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    thread: Mapped["ChatThread"] = relationship(back_populates="messages")


class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    firm_id: Mapped[str] = mapped_column(ForeignKey("firms.id", ondelete="CASCADE"), index=True)
    workflow_id: Mapped[str] = mapped_column(ForeignKey("workflow_templates.id"))
    status: Mapped[str] = mapped_column(String(32), default=WorkflowRunStatus.pending.value)
    input_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    output_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    firm: Mapped["Firm"] = relationship(back_populates="workflow_runs")
    workflow: Mapped["WorkflowTemplate"] = relationship()
    steps: Mapped[list["WorkflowRunStep"]] = relationship(back_populates="run", cascade="all, delete-orphan")


class WorkflowRunStep(Base):
    __tablename__ = "workflow_run_steps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_pk)
    run_id: Mapped[str] = mapped_column(ForeignKey("workflow_runs.id", ondelete="CASCADE"), index=True)
    step_order: Mapped[int] = mapped_column()
    name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(32), default=WorkflowRunStatus.pending.value)
    log: Mapped[str | None] = mapped_column(Text, nullable=True)

    run: Mapped["WorkflowRun"] = relationship(back_populates="steps")
