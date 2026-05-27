# High-Level Design Document — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** System Architecture Overview
**Preceded by:** LLD (Low-Level Design)

---

## 1. System Philosophy

LegisFlow is designed as a **three-tier web application**:

```
[Browser / Client Tier] ←→ [Application / Server Tier] ←→ [Data Tier]
```

Each tier is independent and communicates over a network. This means:
- **Lawyers only need a browser** — no software to install
- **The server handles all complex logic** — AI processing, file storage, data management
- **The database is the single source of truth** — all firm data lives here

The architecture follows a **modular monolith** pattern: one backend application that serves all features, organized into clear internal modules. This keeps deployment simple while maintaining clean separation between features.

---

## 2. System Modules (What Each Part Does)

### 2.1 Frontend Web Application (Next.js)

The frontend is a **single-page application** (SPA) with server-side rendering. It's organized into these layers:

```
┌────────────────────────────────────────────────────────┐
│                    PAGES (App Router)                    │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│  │Public│ │ Auth │ │Portal│ │Matter│ │Admin │ │  AI  ││
│  │Pages │ │Pages │ │Shell │ │Worksp│ │Pages │ │ Chat ││
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
├────────────────────────────────────────────────────────┤
│                  COMPONENT LAYER                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Marketing│ │  Portal  │ │  Matter  │ │   UI     │   │
│  │Components│ │  Layout  │ │Workflow  │ │Elements  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├────────────────────────────────────────────────────────┤
│                    CLIENT LAYER                          │
│  ┌──────────────────┐ ┌──────────────────────────┐      │
│  │  API Client      │ │  Auth Provider           │      │
│  │  (HTTP or Mock)  │ │  (Login/Session)         │      │
│  └──────────────────┘ └──────────────────────────┘      │
│  ┌──────────────────┐ ┌──────────────────────────┐      │
│  │  Mock API        │ │  i18n / Locale           │      │
│  │  (Demo Mode)     │ │  (Multi-language)        │      │
│  └──────────────────┘ └──────────────────────────┘      │
└────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **App Router (Next.js 15)** — Each folder under `app/` becomes a URL route automatically. The `(portal)` group protects routes behind authentication.
- **Mock Layer** — A complete in-browser mock API that mirrors every real endpoint. Switched via environment variable. Enables demos without a backend.
- **Client Components** — All interactive parts use `"use client"` for browser interactivity. Static content uses server components for speed.
- **Dark theme by default** — The UI uses a dark color scheme with a Material Design-inspired component library.

### 2.2 Backend API (FastAPI)

The backend is a **Python web server** organized into these modules:

```
┌────────────────────────────────────────────────────────┐
│                    API ROUTERS                           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌──┐│
│  │Auth│ │Firm│ │Clnt│ │Mttr│ │Doc │ │Chat│ │Wkfl│ │Dsh││
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └──┘│
├────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐│
│  │ Demo Seed    │ │ Workflow     │ │ Matter Steps     ││
│  │ (Test Data)  │ │ Orchestrator │ │ Generator        ││
│  └──────────────┘ └──────────────┘ └──────────────────┘│
├────────────────────────────────────────────────────────┤
│                    AGENT LAYER (AI)                      │
│  ┌──────────────────┐ ┌──────────────────────────────┐  │
│  │ Firm Assistant   │ │ Matter Step Agent            │  │
│  │ (Chatbot)        │ │ (Generates step content)     │  │
│  └──────────────────┘ └──────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Workflow Agent (orchestrates automated flows)   │   │
│  └──────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────┤
│                    DATA & AI INFRASTRUCTURE              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ SQLAlchemy│ │ PgVector │ │ LLM      │ │ Document │   │
│  │ (ORM)    │ │ (Vector) │ │ Client   │ │ Ingest   │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├────────────────────────────────────────────────────────┤
│                    CONFIG & MIDDLEWARE                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ Settings │ │   CORS   │ │   Auth   │ │ Database │   │
│  │ (.env)   │ │Middleware│ │   JWT    │ │ Connection│   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
└────────────────────────────────────────────────────────┘
```

**Key design decisions:**
- **FastAPI** — A modern Python web framework chosen for its performance (async support), automatic API documentation (Swagger UI at `/docs`), and Pydantic integration (type validation).
- **SQLAlchemy ORM** — Maps database tables to Python objects. Changes to the database schema are managed through Alembic migrations.
- **Pydantic AI** — A framework for building AI agents with structured outputs. Each AI agent (Firm Assistant, Matter Step Agent, Workflow Agent) is a separate module that can be developed and tested independently.
- **Multiple LLM providers** — The system can switch between Ollama (free/local), OpenAI, Anthropic, or OpenRouter without code changes (just environment variables).

---

## 3. Data Flow (How a Request Travels Through the System)

### 3.1 A Lawyer Opens a Matter

```
Browser                         Backend Server                    Database
──────                         ──────────────                    ────────
  │                                  │                              │
  │ 1. GET /matters/{id}             │                              │
  │   (with Bearer token)            │                              │
  │ ──────────────────────────────►  │                              │
  │                                  │                              │
  │                                  │ 2. Verify JWT token          │
  │                                  │    (is the user logged in?)  │
  │                                  │                              │
  │                                  │ 3. Query matter + client     │
  │                                  │    ────────────────────────► │
  │                                  │                              │
  │                                  │ 4. Return matter data        │
  │                                  │    ◄──────────────────────── │
  │                                  │                              │
  │                                  │ 5. Query all steps for this  │
  │                                  │    matter                    │
  │                                  │    ────────────────────────► │
  │                                  │                              │
  │                                  │ 6. Return steps              │
  │                                  │    ◄──────────────────────── │
  │                                  │                              │
  │ 7. MatterDetail JSON             │                              │
  │   (matter + client + steps)      │                              │
  │ ◄─────────────────────────────   │                              │
  │                                  │                              │
  │ 8. Browser renders the           │                              │
  │    Matter Workspace page         │                              │
```

### 3.2 A Lawyer Clicks "Run AI" on a Step

```
Browser                         Backend Server                    LLM (AI)
──────                         ──────────────                    ────────
  │                                  │                              │
  │ 1. POST /matters/{id}/steps/     │                              │
  │      {key}/generate              │                              │
  │ ──────────────────────────────►  │                              │
  │                                  │                              │
  │                                  │ 2. Fetch matter context      │
  │                                  │    (client info, intake      │
  │                                  │     data, previous steps)    │
  │                                  │                              │
  │                                  │ 3. Build prompt for the step │
  │                                  │    (e.g., "Generate legal    │
  │                                  │     research citations for   │
  │                                  │     this CFO contract...")   │
  │                                  │                              │
  │                                  │ 4. Send prompt to LLM      ► │
  │                                  │                              │
  │                                  │ 5. LLM returns generated   ◄│
  │                                  │    content                   │
  │                                  │                              │
  │                                  │ 6. Save content to step      │
  │                                  │    ────────────────────────► │
  │                                  │                              │
  │ 7. Updated step returned         │                              │
  │ ◄─────────────────────────────   │                              │
  │                                  │                              │
  │ 8. Step panel updates with new   │                              │
  │    AI-generated content          │                              │
```

### 3.3 A Lawyer Asks the AI Assistant a Question

```
Browser                         Backend Server                    LLM + Database
──────                         ──────────────                    ─────────────
  │                                  │                              │
  │ 1. POST /chat/threads/{id}/msg   │                              │
  │    { content: "What are the      │                              │
  │      restrictive covenants?" }   │                              │
  │ ──────────────────────────────►  │                              │
  │                                  │                              │
  │                                  │ 2. Generate embedding for    │
  │                                  │    the question              │
  │                                  │    ────────────────────────► │
  │                                  │                              │
  │                                  │ 3. Search document_chunks    │
  │                                  │    for semantically similar  │
  │                                  │    content (pgvector)        │
  │                                  │    ────────────────────────► │
  │                                  │                              │
  │                                  │ 4. Return top 5 most         │
  │                                  │    relevant chunks ◄──────── │
  │                                  │                              │
  │                                  │ 5. Build prompt: question +  │
  │                                  │    relevant chunks           │
  │                                  │                              │
  │                                  │ 6. Send to LLM             ►│
  │                                  │                              │
  │                                  │ 7. LLM returns answer with ◄│
  │                                  │    citations                 │
  │                                  │                              │
  │ 8. AI response + citations       │                              │
  │ ◄─────────────────────────────   │                              │
  │                                  │                              │
  │ 9. Chat shows answer with        │                              │
  │    clickable document references  │                              │
```

### 3.4 File Upload Flow

```
1. Lawyer selects a PDF/DOCX file
2. File is uploaded to POST /documents/upload
3. Backend saves the file to disk (/app/uploads/)
4. Backend creates a Document record in the database (status: "processing")
5. Backend extracts text from the file (PDF via PyMuPDF, DOCX via python-docx)
6. Text is split into chunks (~500-1000 characters each)
7. Each chunk generates an embedding vector via the LLM
8. DocumentChunk records are saved to the database with their embeddings
9. Document status is updated to "ready"
10. Frontend shows the document as available for search/AI queries
```

---

## 4. AI Architecture (How the "Brain" Works)

### 4.1 RAG (Retrieval-Augmented Generation)

The AI Assistant uses a technique called RAG. Instead of the AI answering from its general knowledge (which might be wrong or outdated), it:

1. **Retrieves** — Searches the firm's uploaded documents for relevant passages
2. **Augments** — Adds those passages to the question as context  
3. **Generates** — The AI answers based on the actual documents, with citations

This means answers are **grounded in the firm's actual case documents**, not general AI knowledge. Every answer includes references to specific document names.

### 4.2 AI Agents

LegisFlow uses three specialized AI agents, each with a different job:

| Agent | Job | How It Works |
|-------|-----|-------------|
| **Firm Assistant** | Answers lawyer questions | RAG + conversational chat. Searches documents, generates answers with citations. |
| **Matter Step Agent** | Generates step content | Takes matter context + step type, produces relevant content (research, drafts, review comments, etc.) |
| **Workflow Agent** | Runs automated workflows | Orchestrates multi-step processes (intake validation → data structuring → CMS routing) |

Each agent is a Pydantic AI agent with a defined output schema — this means the AI's response is validated and structured, not free-form text.

### 4.3 LLM Provider Abstraction

```
               ┌─────────────────────┐
               │   LLM Client        │
               │  (Common Interface) │
               └────────┬────────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   ┌──────────┐ ┌──────────┐ ┌──────────────┐
   │ Ollama   │ │ OpenAI   │ │  Anthropic   │
   │ (Local)  │ │ (Cloud)  │ │  (Cloud)     │
   └──────────┘ └──────────┘ └──────────────┘
```

Switching providers requires only changing environment variables. The system handles different APIs transparently.

---

## 5. External Integrations

| System | Integration Point | Purpose |
|--------|-----------------|---------|
| **n8n (workflow automation)** | Webhook POST to configured URL | Triggers external workflows (e.g., create a record in practice management software) |
| **Clio (practice management)** | Listed as integration option | Future: sync client/matter data |
| **Unsplash** | Image CDN (Next.js config) | Marketing page images |
| **Google Fonts / Material Icons** | External CDN | UI icons and typography |

---

## 6. Infrastructure & Deployment

### 6.1 Development Environment (Docker Compose)

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Web     │────►│  API     │────►│PostgreSQL│     │  Ollama  │
│ :3000    │     │ :8000    │     │ :5432    │     │ :11434   │
│ Next.js  │     │ FastAPI  │     │ pgvector │     │ LLM      │
│ Standalone│    │ Uvicorn  │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                        │
                        ▼
                  ┌──────────┐
                  │  Uploads │
                  │  Volume  │
                  └──────────┘
```

All four services are defined in `docker-compose.yml` and can be started with one command. Volumes persist database data, AI models, and uploaded files between restarts.

### 6.2 Frontend-Only Demo Mode

```
┌──────────────────────────────────┐
│         Browser                  │
│  ┌────────────────────────────┐ │
│  │  Next.js Dev Server :3000   │ │
│  │  ┌──────────────────────┐  │ │
│  │  │  Mock API Layer      │  │ │
│  │  │  (in-memory store)   │  │ │
│  │  └──────────────────────┘  │ │
│  └────────────────────────────┘ │
└──────────────────────────────────┘
```

No Docker, no database, no AI engine needed. All data is generated and stored in the browser's memory (with localStorage persistence). This is the recommended way to evaluate the system.

### 6.3 Production Deployment (Future)

```
                          ┌──────────────┐
                          │  Load        │
                          │  Balancer    │
                          └──────┬───────┘
                                 │
                  ┌──────────────┼──────────────┐
                  ▼              ▼              ▼
           ┌──────────┐  ┌──────────┐  ┌──────────┐
           │  Web     │  │  Web     │  │  Web     │
           │ Instance │  │ Instance │  │ Instance │
           └──────────┘  └──────────┘  └──────────┘
                                 │
                  ┌──────────────┼──────────────┐
                  ▼              ▼              ▼
           ┌──────────┐  ┌──────────┐  ┌──────────┐
           │  API     │  │  API     │  │  API     │
           │ Instance │  │ Instance │  │ Instance │
           └──────────┘  └──────────┘  └──────────┘
                                 │
                  ┌──────────────┴──────────────┐
                  ▼                             ▼
           ┌──────────────┐           ┌──────────────────┐
           │  PostgreSQL  │           │  Object Store    │
           │  Primary     │           │  (S3-compatible) │
           │  + Replica   │           │  for file uploads│
           └──────────────┘           └──────────────────┘
```

The frontend can be deployed as a standalone Next.js app (static files). The API can be scaled horizontally behind a load balancer. PostgreSQL would use read replicas. File storage would move from local disk to S3-compatible object storage.

---

## 7. Cross-Cutting Concerns

### 7.1 Authentication & Authorization
- **Authentication** is handled by JWT tokens (JSON Web Tokens)
- **Session duration:** Access tokens expire after 15 minutes; refresh tokens after 7 days
- **Authorization** is role-based: Owner, Admin, Member
- Each request to the API must include a valid token in the `Authorization` header

### 7.2 Error Handling
- **API errors** return structured JSON with HTTP status codes (400, 401, 404, 500)
- **Frontend errors** show toast notifications to the user
- **AI failures** are caught gracefully — the system shows an error message rather than crashing

### 7.3 Logging
- The API logs requests and errors to stdout (captured by Docker)
- The frontend does not send client-side logs to the server (privacy-conscious)

### 7.4 Security
- Passwords are hashed with bcrypt (never stored in plain text)
- Database credentials are configured via environment variables (never committed to git)
- CORS is configured to restrict API access to the web frontend's domain
- File uploads are limited to 25MB
- All HTTP traffic is plain HTTP in development; production should use HTTPS

### 7.5 Internationalization
- All user-facing text is stored in translation files
- Currently configured for one language direction (LTR)
- Locale selection is persisted in a browser cookie

---

## 8. Key Architectural Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | Next.js 15 | Server-side rendering for SEO (marketing pages), client-side interactivity for portal, file-based routing |
| Backend framework | FastAPI | Fast, auto-documenting, native async support |
| Database | PostgreSQL + pgvector | Vector embeddings for semantic search, strong relational data support |
| ORM | SQLAlchemy | Mature, well-documented, Alembic for migrations |
| AI framework | Pydantic AI | Structured agent outputs, multi-provider support |
| Default AI engine | Ollama (local) | Free, private, no data leaves the firm's infrastructure |
| Auth | JWT (custom) | Simple, no external dependency, stateless |
| Monorepo | Lerna + npm workspaces | Shared TypeScript types, single build pipeline |
| i18n | next-intl | Lightweight, built for Next.js App Router |
| Mock mode | In-browser mock API | Zero-dependency demos, instant testing |
