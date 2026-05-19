"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-05-19

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "firms",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("size", sa.String(64)),
        sa.Column("practice_areas", sa.JSON()),
        sa.Column("integrations", sa.JSON()),
        sa.Column("onboarding_complete", sa.Boolean(), default=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "firm_memberships",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("role", sa.String(32)),
        sa.UniqueConstraint("user_id", "firm_id", name="uq_user_firm"),
    )

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("token_hash", sa.String(255), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True)),
        sa.Column("revoked", sa.Boolean(), default=False),
    )
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"], unique=True)

    op.create_table(
        "leads",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("name", sa.String(255)),
        sa.Column("message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_leads_email", "leads", ["email"])

    op.create_table(
        "documents",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("filename", sa.String(512)),
        sa.Column("storage_path", sa.String(1024)),
        sa.Column("status", sa.String(32)),
        sa.Column("error_message", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_documents_firm_id", "documents", ["firm_id"])

    op.create_table(
        "document_chunks",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("document_id", sa.String(36), sa.ForeignKey("documents.id", ondelete="CASCADE")),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("chunk_index", sa.Integer()),
        sa.Column("content", sa.Text()),
        sa.Column("embedding", Vector(768)),
    )
    op.create_index("ix_document_chunks_firm_id", "document_chunks", ["firm_id"])
    op.create_index("ix_document_chunks_document_id", "document_chunks", ["document_id"])

    op.create_table(
        "chat_threads",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE")),
        sa.Column("title", sa.String(255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "chat_messages",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("thread_id", sa.String(36), sa.ForeignKey("chat_threads.id", ondelete="CASCADE")),
        sa.Column("role", sa.String(32)),
        sa.Column("content", sa.Text()),
        sa.Column("citations", sa.JSON()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "workflow_templates",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("slug", sa.String(128), unique=True),
        sa.Column("name", sa.String(255)),
        sa.Column("description", sa.Text()),
    )
    op.create_index("ix_workflow_templates_slug", "workflow_templates", ["slug"], unique=True)

    op.create_table(
        "workflow_runs",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("workflow_id", sa.String(36), sa.ForeignKey("workflow_templates.id")),
        sa.Column("status", sa.String(32)),
        sa.Column("input_payload", sa.JSON()),
        sa.Column("output_summary", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("completed_at", sa.DateTime(timezone=True)),
    )

    op.create_table(
        "workflow_run_steps",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("run_id", sa.String(36), sa.ForeignKey("workflow_runs.id", ondelete="CASCADE")),
        sa.Column("step_order", sa.Integer()),
        sa.Column("name", sa.String(255)),
        sa.Column("status", sa.String(32)),
        sa.Column("log", sa.Text()),
    )


def downgrade() -> None:
    for t in [
        "workflow_run_steps",
        "workflow_runs",
        "workflow_templates",
        "chat_messages",
        "chat_threads",
        "document_chunks",
        "documents",
        "leads",
        "refresh_tokens",
        "firm_memberships",
        "firms",
        "users",
    ]:
        op.drop_table(t)
