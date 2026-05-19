import re
from pathlib import Path

import fitz
from docx import Document as DocxDocument
from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.models import Document, DocumentChunk, DocumentStatus
from app.rag.embeddings import embed_texts


def extract_text(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        doc = fitz.open(path)
        return "\n".join(page.get_text() for page in doc)
    if suffix in (".docx", ".doc"):
        doc = DocxDocument(path)
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    if suffix == ".txt":
        return path.read_text(encoding="utf-8", errors="ignore")
    raise ValueError(f"Unsupported file type: {suffix}")


def chunk_text(text: str, chunk_size: int = 512, overlap: int = 64) -> list[str]:
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        return []
    words = text.split()
    chunks: list[str] = []
    i = 0
    while i < len(words):
        chunk_words = words[i : i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += chunk_size - overlap
    return chunks


async def ingest_document(db: Session, document: Document) -> None:
    path = Path(document.storage_path)
    try:
        text = extract_text(path)
        chunks = chunk_text(text)
        if not chunks:
            document.status = DocumentStatus.failed.value
            document.error_message = "No text extracted"
            db.commit()
            return

        db.execute(delete(DocumentChunk).where(DocumentChunk.document_id == document.id))
        embeddings = await embed_texts(chunks)

        for idx, (content, embedding) in enumerate(zip(chunks, embeddings, strict=True)):
            db.add(
                DocumentChunk(
                    document_id=document.id,
                    firm_id=document.firm_id,
                    chunk_index=idx,
                    content=content,
                    embedding=embedding,
                )
            )
        document.status = DocumentStatus.ready.value
        document.error_message = None
        db.commit()
    except Exception as e:
        document.status = DocumentStatus.failed.value
        document.error_message = str(e)[:500]
        db.commit()
        raise


def search_chunks(db: Session, firm_id: str, query: str, limit: int = 5) -> list[tuple[DocumentChunk, Document]]:
    """Sync search wrapper — embedding done in caller for async."""
    from sqlalchemy import text

    # Placeholder: caller should use search_chunks_with_embedding
    _ = query
    rows = db.scalars(
        select(DocumentChunk)
        .where(DocumentChunk.firm_id == firm_id)
        .limit(limit)
    ).all()
    results = []
    for chunk in rows:
        doc = db.get(Document, chunk.document_id)
        if doc:
            results.append((chunk, doc))
    return results


async def search_chunks_async(
    db: Session, firm_id: str, query: str, limit: int = 5
) -> list[tuple[DocumentChunk, Document, float]]:
    from sqlalchemy import text as sql_text

    vectors = await embed_texts([query])
    if not vectors:
        return []
    embedding = vectors[0]
    embedding_str = "[" + ",".join(str(x) for x in embedding) + "]"

    rows = db.execute(
        sql_text(
            """
            SELECT dc.id, dc.document_id, dc.content,
                   1 - (dc.embedding <=> CAST(:embedding AS vector)) AS score
            FROM document_chunks dc
            WHERE dc.firm_id = :firm_id AND dc.embedding IS NOT NULL
            ORDER BY dc.embedding <=> CAST(:embedding AS vector)
            LIMIT :limit
            """
        ),
        {"embedding": embedding_str, "firm_id": firm_id, "limit": limit},
    ).fetchall()

    results: list[tuple[DocumentChunk, Document, float]] = []
    for row in rows:
        chunk = db.get(DocumentChunk, row[0])
        doc = db.get(Document, row[1]) if chunk else None
        if chunk and doc:
            results.append((chunk, doc, float(row[3])))
    return results


def document_chunk_count(db: Session, document_id: str) -> int:
    return db.scalar(
        select(func.count()).select_from(DocumentChunk).where(DocumentChunk.document_id == document_id)
    ) or 0
