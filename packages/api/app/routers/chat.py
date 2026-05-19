from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.agents.firm_assistant import run_firm_assistant
from app.auth import get_current_firm
from app.database import get_db
from app.models import ChatMessage, ChatThread, Firm, FirmMembership, User
from app.rag.ingest import search_chunks_async
from app.schemas import ChatMessageOut, ChatThreadOut, CitationOut, MessageCreate, ThreadCreate

router = APIRouter(prefix="/threads", tags=["chat"])


@router.get("", response_model=list[ChatThreadOut])
def list_threads(
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    user, firm, _ = ctx
    threads = db.scalars(
        select(ChatThread)
        .where(ChatThread.firm_id == firm.id, ChatThread.user_id == user.id)
        .order_by(ChatThread.updated_at.desc())
    ).all()
    return [ChatThreadOut.model_validate(t) for t in threads]


@router.post("", response_model=ChatThreadOut, status_code=201)
def create_thread(
    body: ThreadCreate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    user, firm, _ = ctx
    thread = ChatThread(firm_id=firm.id, user_id=user.id, title=body.title)
    db.add(thread)
    db.commit()
    db.refresh(thread)
    return ChatThreadOut.model_validate(thread)


@router.get("/{thread_id}/messages", response_model=list[ChatMessageOut])
def list_messages(
    thread_id: str,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    user, firm, _ = ctx
    thread = db.get(ChatThread, thread_id)
    if not thread or thread.firm_id != firm.id or thread.user_id != user.id:
        raise HTTPException(404, "Thread not found")
    messages = db.scalars(
        select(ChatMessage).where(ChatMessage.thread_id == thread_id).order_by(ChatMessage.created_at)
    ).all()
    return [ChatMessageOut.model_validate(m) for m in messages]


@router.post("/{thread_id}/messages", response_model=ChatMessageOut)
async def send_message(
    thread_id: str,
    body: MessageCreate,
    ctx: tuple[User, Firm, FirmMembership] = Depends(get_current_firm),
    db: Session = Depends(get_db),
):
    user, firm, _ = ctx
    thread = db.get(ChatThread, thread_id)
    if not thread or thread.firm_id != firm.id or thread.user_id != user.id:
        raise HTTPException(404, "Thread not found")

    user_msg = ChatMessage(thread_id=thread_id, role="user", content=body.content)
    db.add(user_msg)
    db.commit()

    hits = await search_chunks_async(db, firm.id, body.content, limit=5)
    context_blocks = [f"[{doc.filename}] {chunk.content[:600]}" for chunk, doc, _ in hits]
    citations = [
        CitationOut(document_id=doc.id, filename=doc.filename, excerpt=chunk.content[:300])
        for chunk, doc, _ in hits
    ]

    reply_text = await run_firm_assistant(body.content, context_blocks)
    assistant_msg = ChatMessage(
        thread_id=thread_id,
        role="assistant",
        content=reply_text,
        citations=[c.model_dump() for c in citations] if citations else None,
    )
    db.add(assistant_msg)
    if thread.title == "New conversation":
        thread.title = body.content[:60]
    db.commit()
    db.refresh(assistant_msg)
    return ChatMessageOut.model_validate(assistant_msg)
