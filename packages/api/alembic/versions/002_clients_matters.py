"""clients and matters

Revision ID: 002
Revises: 001
Create Date: 2026-05-21

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "clients",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("company", sa.String(255)),
        sa.Column("email", sa.String(255)),
        sa.Column("phone", sa.String(64)),
        sa.Column("notes", sa.Text()),
        sa.Column("status", sa.String(32)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_clients_firm_id", "clients", ["firm_id"])

    op.create_table(
        "matters",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("firm_id", sa.String(36), sa.ForeignKey("firms.id", ondelete="CASCADE")),
        sa.Column("client_id", sa.String(36), sa.ForeignKey("clients.id", ondelete="CASCADE")),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("matter_type", sa.String(128)),
        sa.Column("status", sa.String(32)),
        sa.Column("current_step_key", sa.String(64)),
        sa.Column("summary", sa.Text()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_matters_firm_id", "matters", ["firm_id"])
    op.create_index("ix_matters_client_id", "matters", ["client_id"])

    op.create_table(
        "matter_steps",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("matter_id", sa.String(36), sa.ForeignKey("matters.id", ondelete="CASCADE")),
        sa.Column("step_key", sa.String(64), nullable=False),
        sa.Column("status", sa.String(32)),
        sa.Column("assigned_role", sa.String(64)),
        sa.Column("content", sa.JSON()),
        sa.Column("ai_log", sa.Text()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint("matter_id", "step_key", name="uq_matter_step_key"),
    )
    op.create_index("ix_matter_steps_matter_id", "matter_steps", ["matter_id"])

    op.add_column("documents", sa.Column("matter_id", sa.String(36), nullable=True))
    op.add_column("documents", sa.Column("folder", sa.String(32), server_default="general"))
    op.create_foreign_key(
        "fk_documents_matter_id",
        "documents",
        "matters",
        ["matter_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_documents_matter_id", "documents", ["matter_id"])


def downgrade() -> None:
    op.drop_index("ix_documents_matter_id", table_name="documents")
    op.drop_constraint("fk_documents_matter_id", "documents", type_="foreignkey")
    op.drop_column("documents", "folder")
    op.drop_column("documents", "matter_id")
    op.drop_table("matter_steps")
    op.drop_table("matters")
    op.drop_table("clients")
