# Technical Requirements Document — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** Technology decisions, infrastructure, security, and performance
**Preceded by:** HLD (High-Level Design)

---

## 1. System Architecture Pattern

**Pattern:** Modular Monolith with Tiered Separation

LegisFlow uses a **three-tier modular monolith** architecture:

| Tier | Technology | Hosting | Scalability |
|------|-----------|---------|-------------|
| **Presentation (Frontend)** | Next.js 15 | Docker / Standalone | Horizontally scalable (stateless) |
| **Application (Backend)** | FastAPI (Python) | Docker | Horizontally scalable (stateless) |
| **Data (Database)** | PostgreSQL 16 + pgvector | Docker | Vertically scalable, read replicas |

**Why modular monolith instead of microservices?**
- The firm is a single tenant — there's no need for independently deployable services
- One codebase is easier for a small team to maintain
- All features share the same database and authentication context
- When needed, modules can be extracted into microservices later (the router layer already separates concerns)

---

## 2. Technology Stack

### 2.1 Frontend

| Requirement | Choice | Version | Rationale |
|-------------|--------|---------|-----------|
| Framework | **Next.js** | 15.5.15 | Server-side rendering for marketing pages, client-side interactivity for portal, file-based App Router |
| Language | **TypeScript** | 5.x | Type safety, better developer experience, catches errors at compile time |
| UI Styling | **Tailwind CSS** | 4.x | Utility-first, fast iteration, small production CSS |
| i18n | **next-intl** | 4.12 | Built for Next.js App Router, lightweight, no external dependencies |
| Fonts | **Inter** (body) + **Space Grotesk** (headlines) | Google Fonts | Legible on screens, professional appearance |
| Icons | **Material Symbols** | Google Fonts CDN | Consistent iconography, searchable icon names |
| Font loading | **next/font** | Built-in | Optimized font loading, no layout shift |

**Non-negotiable constraints:**
- Must support **dark theme only** (the current design system)
- Must be deployable as a **standalone application** (`output: "standalone"` in next.config.ts)
- Must support **i18n** for future multi-language expansion

### 2.2 Backend

| Requirement | Choice | Version | Rationale |
|-------------|--------|---------|-----------|
| Framework | **FastAPI** | 0.115+ | Async support, auto-generated OpenAPI docs, Pydantic validation |
| Language | **Python** | 3.12+ | Rich AI/ML ecosystem, Pydantic AI compatibility |
| ASGI Server | **Uvicorn** | 0.32+ | Fast async server, production-ready |
| ORM | **SQLAlchemy** | 2.0.36 | Mature, well-documented, Alembic for migrations |
| Validation | **Pydantic** | 2.10+ | Runtime type validation, integrates with FastAPI |
| AI Framework | **Pydantic AI** | 0.0.39 | Structured agent outputs, multi-provider support |
| PDF Processing | **PyMuPDF (fitz)** | 1.25+ | Extract text from PDF documents |
| DOCX Processing | **python-docx** | 1.1.2 | Extract text from Word documents |
| Auth | **python-jose** + **passlib** + **bcrypt** | Latest | JWT token handling, password hashing |

**Non-negotiable constraints:**
- Must support **multiple LLM providers** (Ollama, OpenAI, Anthropic, OpenRouter) via environment variable switching
- Must support **vector search** via pgvector for RAG
- Must handle **file uploads up to 25MB**

### 2.3 Database

| Requirement | Choice | Version | Rationale |
|-------------|--------|---------|-----------|
| Relational DB | **PostgreSQL** | 16 | Reliable, feature-rich, strong ecosystem |
| Vector Extension | **pgvector** | pg16 image | Store and search AI embeddings natively in PostgreSQL |
| Connection | **psycopg** | 3.2+ | Async-compatible PostgreSQL driver |
| Migrations | **Alembic** | 1.14+ | Version-controlled database schema changes |

**Embedding dimension:** 768 (matching `nomic-embed-text` model)

### 2.4 AI / LLM

| Provider | Default | Model | Embedding Model | Cost |
|----------|---------|-------|-----------------|------|
| **Ollama** (default) | Yes | llama3.2 | nomic-embed-text | Free (local) |
| **OpenAI** | No | gpt-4o-mini | text-embedding-3-small | Pay-per-token |
| **Anthropic** | No | claude-3-5-haiku | N/A | Pay-per-token |
| **OpenRouter** | No | meta-llama/llama-3.2-3b | N/A | Pay-per-token / Free options |

---

## 3. Data Architecture

### 3.1 Database Schema Summary

The database uses a **multi-tenant logical model** where every data record belongs to a firm:

```
Firm ──┬── Users (via FirmMembership)
       ├── Clients
       │    └── Matters
       │         ├── MatterSteps
       │         └── Documents
       │              └── DocumentChunks (with embeddings)
       ├── ChatThreads
       │    └── ChatMessages
       ├── WorkflowRuns
       │    └── WorkflowRunSteps
       └── WorkflowTemplates (shared reference data)
```

### 3.2 Key Database Design Decisions

| Decision | Implementation | Rationale |
|----------|---------------|-----------|
| Primary keys | UUID v4 (strings) | Non-guessable, merge-safe across systems |
| Soft deletes | Not used | GDPR compliance — data is permanently removed on delete |
| Document embeddings | pgvector `Vector(768)` column | Native PostgreSQL vector search, no separate vector database needed |
| Timestamps | `DateTime(timezone=True)` with `server_default` | Consistent timezone handling, server-authoritative timestamps |
| JSON fields | `JSON` column type (practice_areas, integrations, content) | Flexible schema for variable data shapes |
| File storage | Local filesystem (`/app/uploads/`) | Simple for MVP; S3-compatible storage for production |

### 3.3 Indexing Strategy

| Table | Indexes | Purpose |
|-------|---------|---------|
| `users` | `email` (unique) | Fast login lookup |
| `firm_memberships` | `(user_id, firm_id)` (unique composite) | Prevent duplicate memberships |
| `refresh_tokens` | `token_hash` (unique) | Fast token validation |
| `clients` | `firm_id` | List all clients for a firm |
| `matters` | `firm_id`, `client_id` | List matters by firm or client |
| `matter_steps` | `matter_id`, `(matter_id, step_key)` (unique) | Matter steps access |
| `documents` | `firm_id` | List firm documents |
| `document_chunks` | `document_id`, `firm_id` + vector index on `embedding` | Semantic search queries |
| `chat_threads` | `firm_id` | List firm threads |
| `chat_messages` | `thread_id` | Fast message history loading |

---

## 4. API Design

### 4.1 Protocol & Conventions

| Aspect | Standard |
|--------|----------|
| Protocol | **REST over HTTP** |
| Base URL | `/api/v1/` |
| Request body | **JSON** |
| Response format | **JSON** |
| Authentication | **Bearer JWT** in `Authorization` header |
| Pagination | Not yet implemented (future: cursor-based) |
| Error format | `{ "detail": "error message" }` |

### 4.2 Response Codes

| Code | Meaning | When |
|------|---------|------|
| **200** | Success | GET, PATCH, DELETE |
| **201** | Created | POST (resource created) |
| **400** | Bad Request | Validation failure, duplicate email |
| **401** | Unauthorized | Missing or invalid token |
| **403** | Forbidden | Valid token but insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **413** | Payload Too Large | File exceeds 25MB |
| **500** | Internal Server Error | Unhandled exception |

### 4.3 Third-Party Integrations

| Integration | Method | Purpose | Config |
|-------------|--------|---------|--------|
| **n8n webhook** | HTTP POST | Trigger external workflows on intake/event | `N8N_WEBHOOK_SECRET` env var |
| **LLM Provider API** | HTTP (via httpx) | All LLM calls (chat, embeddings, agents) | Provider-specific env vars |
| **Unsplash** | External CDN | Marketing page imagery | `images.remotePatterns` in next.config |

---

## 5. Infrastructure Requirements

### 5.1 Development Environment

| Requirement | Specification | Purpose |
|-------------|--------------|---------|
| Node.js | >= 20 | Local frontend development |
| Python | >= 3.12 | Local backend development |
| Docker | Latest | Run full stack (PostgreSQL, Ollama, API, Web) |
| RAM | >= 8GB (16GB recommended) | Run Ollama + PostgreSQL + dev servers |
| Disk | >= 10GB free | Docker images, AI models (llama3.2 ~4GB, nomic-embed ~0.5GB) |
| Network | Internet (first run) | Pull Docker images, AI models |

### 5.2 Production Server Minimum

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 2 cores | 4 cores |
| RAM | 4GB (no local LLM) | 16GB (with local Ollama) |
| Disk | 20GB SSD | 50GB SSD |
| Network | 100 Mbps | 1 Gbps |

### 5.3 Docker Images Required

| Service | Image | Size (approx) |
|---------|-------|--------------|
| PostgreSQL + pgvector | `pgvector/pgvector:pg16` | 400MB |
| Ollama | `ollama/ollama:latest` | 2GB |
| Python (API) | Custom (Python 3.12 slim) | 500MB |
| Node (Web) | Custom (Node 20) | 1GB |
| Curl (ollama-init) | `curlimages/curl:8.5.0` | 10MB |
| **Ollama models** | (pulled at runtime) | ~4.5GB (llama3.2 + nomic-embed-text) |

**Total first-run disk space:** ~8-9GB

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
1. User submits email + password
2. Backend hashes the password with bcrypt and compares to stored hash
3. If matching:
   a. Create a JWT access token (expires 15 minutes)
      - Payload: { sub: user_id, exp: timestamp }
      - Signed with: HS256 using JWT_SECRET
   b. Create a refresh token (expires 7 days)
      - Stored in database as SHA-256 hash
      - Can be revoked (deleted or marked revoked)
   c. Return both tokens to the frontend
4. Frontend stores tokens in localStorage
5. Every API request includes the access token in the Authorization header
6. When access token expires, frontend uses refresh token to get a new one
7. If refresh token is expired/revoked, user must log in again
```

### 6.2 Password Requirements

| Requirement | Rule |
|-------------|------|
| Minimum length | 8 characters |
| Hashing algorithm | bcrypt (passlib) |
| Storage | Never stored in plain text |

### 6.3 Token Security

| Token | Lifetime | Storage | Validation |
|-------|----------|---------|------------|
| Access token | 15 minutes | Client (localStorage), signed JWT | Stateless (JWT signature) |
| Refresh token | 7 days | Client (localStorage) + DB (SHA-256 hash) | Stateful (DB lookup) |

### 6.4 CORS Configuration

| Setting | Value |
|---------|-------|
| Allowed origins | `http://localhost:3000` (configurable via `CORS_ORIGINS`) |
| Allow credentials | True |
| Allowed methods | All |
| Allowed headers | All |

### 6.5 Data Protection

| Category | Measure |
|----------|---------|
| Passwords | bcrypt hashed |
| Database credentials | Environment variables only |
| Secrets | `.env` files, never committed to git |
| File uploads | 25MB limit |
| Transport | HTTP (dev only — production should use HTTPS) |
| API access | Bearer token required for all authenticated endpoints |

---

## 7. Performance & Scalability

### 7.1 Current Performance Characteristics

| Operation | Expected Time | Notes |
|-----------|--------------|-------|
| Page load (first visit) | 1-3 seconds | Server-side rendered, depends on network |
| Page navigation (SPA) | < 500ms | Client-side navigation, pre-fetched routes |
| API call (CRUD) | 50-200ms | Database query time |
| Mock API call | 100-1500ms | Simulated delay built into mocks |
| AI chat response | 5-30 seconds | Depends on LLM provider and model size |
| AI step generation | 10-30 seconds | Depends on LLM provider and step complexity |
| File upload + processing | 2-10 seconds | Depends on file size and PDF/DOCX parsing |
| Document AI indexing | 5-30 seconds | Text extraction + chunking + embedding generation |

### 7.2 Scalability Approach

| Component | Strategy |
|-----------|----------|
| Frontend | **Stateless** — deploy multiple instances behind a load balancer. Each instance is identical |
| Backend API | **Stateless** — scale horizontally. No server-side sessions (JWT handles auth) |
| Database | **Vertical** (bigger instance) first, then **read replicas** for query offloading |
| File storage | **Local disk** (MVP) → **S3-compatible** (production) for shared access across instances |
| AI | **Provider switching** — Ollama for dev/local, cloud providers for production scale |

### 7.3 Caching Strategy

| Cache Target | Method | Rationale |
|-------------|--------|-----------|
| API responses | Not yet implemented | Future: Redis for frequently accessed data (client lists, dashboard stats) |
| Frontend pages | Next.js automatic static optimization | Static marketing pages are cached at build time |
| LLM responses | Not yet implemented | Future: cache common questions in vector store |

---

## 8. Error Handling & Logging

### 8.1 Error Handling Strategy

| Layer | Strategy |
|-------|----------|
| API Routers | HTTP exceptions with structured error messages |
| Services | Raise domain-specific exceptions |
| AI Agents | Catch LLM failures, return structured error responses |
| Database | SQLAlchemy exceptions caught, rolled back on failure |
| Frontend API calls | Toast notifications for user-visible errors |
| File uploads | Validate file type and size before processing |

### 8.2 Logging

| Layer | Method | Content |
|-------|--------|---------|
| Backend | stdout (captured by Docker) | Request path, status code, error messages |
| Frontend | Console (dev only) | Debug logs, API call errors |
| AI | `ai_log` field on MatterStep | Tracks which AI agent generated content and when |
| Database | PostgreSQL logs | Database errors and slow queries |

### 8.3 Monitoring (Future)

| Metric | Tool | Purpose |
|--------|------|---------|
| API response times | Prometheus + Grafana | Track performance degradation |
| Error rates | Sentry / similar | Catch production bugs |
| LLM token usage | Custom tracking | Monitor AI costs |
| User activity | Database queries | Track adoption and feature usage |

---

## 9. Environment Configuration

### 9.1 Environment Files

| File | Location | Purpose | Git |
|------|----------|---------|-----|
| `.env.example` | Project root | Template with all variables documented | ✅ Committed |
| `.env` | Project root | Local development values | ❌ Ignored |
| `.env.local` | `packages/web/` | Frontend-specific env vars (mock mode) | ❌ Ignored |

### 9.2 Environment Variables

**Backend (API):**

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+psycopg://legisflow:legisflow@localhost:5432/legisflow` | PostgreSQL connection string |
| `JWT_SECRET` | `change-me-in-production` | Secret key for signing JWT tokens |
| `LLM_PROVIDER` | `ollama` | Which LLM provider to use |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2` | Ollama model for chat |
| `OLLAMA_EMBED_MODEL` | `nomic-embed-text` | Ollama model for embeddings |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
| `UPLOAD_DIR` | `./uploads` | Directory for uploaded files |
| `N8N_WEBHOOK_SECRET` | `legisflow-webhook-secret` | Secret for n8n webhook calls |

**Frontend (Web):**

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |
| `NEXT_PUBLIC_MOCK_API` | (not set) | Set to `"true"` for in-browser mock mode |
| `NEXT_PUBLIC_MOCK_AUTO_LOGIN` | (not set) | Set to `"true"` to auto-login in mock mode |

---

## 10. Constraints & Limitations

### 10.1 Current Constraints

| Constraint | Impact |
|------------|--------|
| **Single LLM provider at a time** | Cannot use OpenAI for chat and Ollama for embeddings simultaneously |
| **Local file storage** | Uploaded files are not shared across API instances |
| **No pagination API** | Large datasets (many clients, matters) will load all records at once |
| **No search API** | No dedicated endpoint for searching clients/matters by name |
| **No rate limiting** | API endpoints have no request throttling |
| **No audit logging** | User actions (who edited what, when) are not tracked |
| **HTTP only (dev)** | No TLS/SSL in development; production must configure HTTPS |

### 10.2 Known Gaps

| Gap | Status | Future Solution |
|-----|--------|----------------|
| Team invites | V2 scope | Invite flow for adding team members to a firm |
| Billing/subscriptions | V2 scope | Stripe integration |
| Forgot password functionality | Placeholder page | Email-based password reset flow |
| Production CI/CD pipeline | Not implemented | GitHub Actions → Docker build → deploy |
| Automated frontend tests | Not implemented | Playwright / Cypress for E2E testing |
| API versioning strategy | Not implemented | URL-based versioning (`/api/v2/`) when needed |
