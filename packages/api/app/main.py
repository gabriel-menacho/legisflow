from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import auth, chat, clients, dashboard, documents, firms, leads, matters, workflows
from app.services.demo_seed import seed_demo_client_matter
from app.services.workflows import seed_workflow_templates

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    from app.database import SessionLocal

    db = SessionLocal()
    try:
        seed_workflow_templates(db)
        seed_demo_client_matter(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(firms.router, prefix="/api/v1")
app.include_router(leads.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")
app.include_router(clients.router, prefix="/api/v1")
app.include_router(matters.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(workflows.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.app_name}
