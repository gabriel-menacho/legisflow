import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, Query, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth import get_current_firm
from app.config import get_settings
from app.database import get_db
from app.models import Document, DocumentFolder, Firm, FirmMembership, Matter, User
from app.rag.ingest import document_chunk_count, ingest_document
from app.schemas import DocumentOut

router = APIRouter(prefix="/documents", tags=["documents"])
settings = get_settings()


async def _process_document(document_id: str) -> None:
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        doc = db.get(Document, document_id)
        if doc:
            await ingest_document(db, doc)
    finally:
        db.close()


@router.get("", response_model=list[DocumentOut])
def list_documents(
    matter_id: str | None = Query(None),
    folder: str | None = Query(None),
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    q = select(Document).where(Document.firm_id == firm.id)
    if matter_id:
        q = q.where(Document.matter_id == matter_id)
    if folder:
        q = q.where(Document.folder == folder)
    docs = db.scalars(q.order_by(Document.created_at.desc())).all()
    return [
        DocumentOut(
            id=d.id,
            filename=d.filename,
            status=d.status,
            created_at=d.created_at,
            chunk_count=document_chunk_count(db, d.id),
            matter_id=d.matter_id,
            folder=d.folder,
        )
        for d in docs
    ]


@router.post("/upload", response_model=DocumentOut, status_code=201)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    matter_id: str | None = Form(None),
    folder: str = Form("general"),
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    if matter_id:
        matter = db.get(Matter, matter_id)
        if not matter or matter.firm_id != firm.id:
            raise HTTPException(404, "Matter not found")
    valid_folders = {f.value for f in DocumentFolder}
    if folder not in valid_folders:
        folder = DocumentFolder.general.value
    if not file.filename:
        raise HTTPException(400, "Filename required")
    suffix = Path(file.filename).suffix.lower()
    if suffix not in (".pdf", ".docx", ".doc", ".txt"):
        raise HTTPException(400, "Supported: PDF, DOCX, TXT")

    upload_root = Path(settings.upload_dir) / firm.id
    upload_root.mkdir(parents=True, exist_ok=True)
    safe_name = f"{uuid.uuid4()}{suffix}"
    dest = upload_root / safe_name

    size = 0
    with dest.open("wb") as f:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > settings.max_upload_bytes:
                dest.unlink(missing_ok=True)
                raise HTTPException(413, "File too large (max 25MB)")
            f.write(chunk)

    doc = Document(
        firm_id=firm.id,
        matter_id=matter_id,
        folder=folder,
        filename=file.filename,
        storage_path=str(dest),
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    background_tasks.add_task(_process_document, doc.id)
    return DocumentOut(
        id=doc.id,
        filename=doc.filename,
        status=doc.status,
        created_at=doc.created_at,
        chunk_count=0,
        matter_id=doc.matter_id,
        folder=doc.folder,
    )


@router.delete("/{document_id}")
def delete_document(
    document_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    _, firm, _ = ctx
    doc = db.get(Document, document_id)
    if not doc or doc.firm_id != firm.id:
        raise HTTPException(404, "Document not found")
    Path(doc.storage_path).unlink(missing_ok=True)
    db.delete(doc)
    db.commit()
    return {"ok": True}
