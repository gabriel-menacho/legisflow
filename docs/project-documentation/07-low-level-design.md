# Low-Level Design Document — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** Web Frontend + API Backend
**Status:** As-Is (current codebase)

---

## 1. What LegisFlow Does (Executive Summary)

LegisFlow is a legal-tech platform that helps law firms manage client matters from intake through to closing. It replaces manual spreadsheets, email chains, and file folders with a structured digital workspace that:

- **Tracks each legal matter through 12 standard steps** (from Client Intake to Storage & Monitoring)
- **Provides an AI Assistant** that answers questions based on uploaded case documents
- **Automates workflow triggers** (client intake, contract drafting, case summarization)
- **Manages client relationships** with contact details, history, and linked matters

The system runs as two parts:
- **Frontend (Web):** A web application lawyers interact with in their browser
- **Backend (API):** A server that stores data, handles file uploads, and powers AI features

---

## 2. System Architecture (Simplified)

```
┌─────────────────────────────────────────────────┐
│                 LAWYER'S BROWSER                 │
│  ┌─────────────────────────────────────────────┐ │
│  │         Next.js Web Application              │ │
│  │  (React components, pages, mock layer)      │ │
│  └──────────┬──────────────────────┬──────────┘ │
│             │ Mock Mode            │ Live Mode   │
│             ▼                      ▼             │
│  ┌──────────────────┐  ┌──────────────────┐     │
│  │  Mock API Layer   │  │  HTTP API Client  │     │
│  │  (in-browser)     │  │  (fetch calls)    │     │
│  └──────────────────┘  └────────┬─────────┘     │
└─────────────────────────────────────────────────┘
                                  │
                                  ▼
                     ┌──────────────────────┐
                     │   FastAPI Backend     │
                     │  (Python server)      │
                     ├──────────┬───────────┤
                     │PostgreSQL│  Ollama    │
                     │ Database │  AI Engine │
                     └──────────┴───────────┘
```

**Two ways to run:**
1. **Mock/Demo Mode** — All data is simulated in your browser. No server needed. Ideal for demonstrations and testing.
2. **Live Mode** — Connects to a real backend server with a PostgreSQL database and an AI engine (Ollama).

---

## 3. Core Business Concepts (Data Model)

These are the key concepts LegisFlow manages, explained in legal practice terms:

### 3.1 Firm
A law firm that uses LegisFlow. Each firm has:
- A name, size (number of lawyers), practice areas (e.g., Litigation, Corporate)
- Integrations with external tools (Clio, n8n)
- An onboarding status (completed once the firm sets up its profile)

### 3.2 User (Attorney/Staff)
A person working at the firm. Each user has:
- Email and password for login
- A role: Owner, Admin, or Member (determines what they can do)
- Membership in one firm

### 3.3 Client
A person or company the firm represents. Each client record tracks:
- Name, company, email, phone
- Status (Active or Archived)
- Notes (free-text case context)
- How many open matters they have

### 3.4 Matter (Legal Case)
A specific legal matter for a client. Each matter:
- Belongs to one client
- Has a type (e.g., Employment Contract, Litigation)
- Moves through **12 predefined steps** in sequence
- Tracks its current position in the step workflow

### 3.5 Matter Steps (The 12-Stage Workflow)

Every matter progresses through these stages in order. Each step has an assigned role (who is responsible):

| # | Step | Who Handles It | Description |
|---|------|---------------|-------------|
| 1 | **Client Intake** | Senior Lawyer | Gather initial information, identify risks and goals |
| 2 | **Document Collection** | Paralegal | Collect relevant documents from client |
| 3 | **Evidence Collection** | Paralegal | Gather evidence, verify facts |
| 4 | **Legal Research** | Junior Lawyer | Research applicable law and precedents |
| 5 | **Strategy & Structure** | Senior Lawyer | Plan approach and document structure |
| 6 | **Draft Creation** | Junior Lawyer | Create initial draft of the document |
| 7 | **Internal Review / QC** | Compliance Team | Quality check and compliance review |
| 8 | **Client Review** | Client Stakeholder | Client reviews and provides feedback |
| 9 | **Revision & Negotiation** | Senior Lawyer | Incorporate feedback, negotiate terms |
| 10 | **Final Legal Approval** | Senior Lawyer | Final sign-off |
| 11 | **Execution / Filing** | Paralegal | Sign documents, file with authorities |
| 12 | **Storage & Monitoring** | Paralegal | Archive, set renewal reminders |

Each step can be:
- **Pending** — Not yet started
- **In Progress** — Being worked on (AI can help generate content)
- **Completed** — Finished and approved

### 3.6 Documents & AI (RAG)
Files uploaded to a matter (PDFs, Word docs). The system:
- Stores the file
- Chunks it into segments
- Generates AI embeddings (mathematical representations of the text)
- Uses these embeddings to find relevant passages when the AI Assistant answers questions

### 3.7 Chat Threads & Messages
Conversations with the AI Assistant. Each thread:
- Has a title and belongs to a firm
- Contains messages (user questions and AI responses)
- AI responses can include citations pointing to specific uploaded documents

### 3.8 Workflows
Automated processes that can be triggered:
- **Client Intake Automation** — Validates intake data, structures it, routes to CMS
- **Contract Drafting Pipeline** — Parses requirements, generates draft, quality checks
- **Case Summarization** — Ingests matter context, summarizes discovery, builds timeline

---

## 4. Web Frontend — Component Map

### 4.1 Page Structure

```
/ (Landing / Marketing)
├── /login                        — Sign in page
├── /register                     — Create account
├── /forgot-password              — Reset password (placeholder)
├── /book                         — Book consultation (lead form)
├── /onboarding                   — Post-registration firm setup wizard
├── /security                     — Security page
├── /terms                        — Terms of service
├── /privacy                      — Privacy policy
├── /dashboard                    — Main dashboard with stats
├── /clients                      — Client list
│   ├── /clients/new              — Add a client
│   └── /clients/[id]             — Client detail + matters list
│       ├── /clients/[id]/matters/new       — Create new matter
│       └── /clients/[id]/matters/[matterId] — Matter workspace with steps
├── /assistant                    — AI chat assistant
├── /documents                    — Document management
├── /workflows                    — Workflow templates
│   └── /workflows/[id]           — Workflow detail + runs
│       └── /workflows/[id]/runs/[runId] — Run status
└── /settings                     — Firm settings
    └── /settings/team            — Team management
```

### 4.2 Auth Flow (How Login Works)

```
User visits /dashboard
        │
        ▼
AuthProvider checks browser storage
        │
        ├── No tokens found → PortalShell redirects to /login
        │                           │
        │                           ▼
        │                     User enters email + password
        │                           │
        │                           ▼
        │                     API login() called
        │                           │
        │                           ▼
        │                     Tokens stored in browser
        │                           │
        │                           ▼
        │                     Redirected to /dashboard
        │
        ├── Tokens found → API me() called to verify
        │                           │
        │                           ├── Valid → Show dashboard
        │                           └── Invalid → Clear tokens, redirect to /login
        │
        └── Mock Mode active → Auto-inject demo tokens
                                │
                                ▼
                            Auto-logged in as "Demo Attorney"
```

**For demo/training:** When `NEXT_PUBLIC_MOCK_API=true` is set, the system bypasses the real backend entirely. All data is simulated in the browser. The user is automatically logged in as a demo attorney without needing credentials.

### 4.3 Matter Workspace (The Core Screen)

When a lawyer opens a matter, they see:

```
┌──────────────────────────────────────────────────┐
│  ← Back to Client Name                            │
│  Senior Employment Agreement — CFO                │
│  Employment Contract · Active                     │
├──────────────────────────────────────────────────┤
│  Phase 1: Intake    Phase 2: Research   Phase 3.. │
│  [●] [●] [●]        [○] [○]            [○]       │
│  Clnt Doc  Evid     Legal Strat         Draft     │
│  Intake Coll Coll   Rsrch &Str                   │
├──────────────────────────────────────────────────┤
│                                                    │
│  Current Step: Client Intake                       │
│  ┌──────────────────────────────────────────────┐ │
│  │  Fields:                                     │ │
│  │  • Client Name: Riverside Manufacturing Ltd.  │ │
│  │  • Executive Role: Chief Financial Officer    │ │
│  │  • Proposed Start Date: 1 September 2026      │ │
│  │  • Base Salary: £185,000 + 20% bonus          │ │
│  │                                               │ │
│  │  [Run AI to generate content]  [Mark Complete] │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
│  Step Sidebar (all steps listed):                  │
│  ✓ Client Intake — Completed                       │
│  ○ Document Collection — Pending (Paralegal)       │
│  ○ Evidence Collection — Pending (Paralegal)       │
│  ○ Legal Research — Pending (Junior Lawyer)        │
│  ...                                               │
└──────────────────────────────────────────────────┘
```

The **Phase Stepper** at the top groups related steps into phases (Intake, Research & Plan, Draft, Review, Close). The **Step Sidebar** on the right shows every step's status and who is responsible.

**"Run AI" button** — For any step, clicking this calls the API to generate relevant content (research citations, draft clauses, compliance checks, etc.) using the AI engine.

### 4.4 Mock/Demo Mode Architecture

When running in demo mode (no backend needed):

```
User Action                     Mock Layer (in browser)
─────────────                   ──────────────────────
Login       →  Mock login validates email/password
                 against in-memory user store
Dashboard   →  Returns pre-computed stats from mock store
List Clients → Returns seeded demo clients
Open Matter  → Returns seed data with pre-populated step content
Run AI Step  → Generates mock AI response with simulated delay
Chat Message → Returns pre-written mock assistant reply
Upload Doc   → Adds to mock store, simulates processing
Trigger Workflow → Creates mock run, simulates step completion
```

The **Mock Store** is a JavaScript object in the browser that holds all the data. It's initialized with demo data (one firm, one attorney, one client, one matter with all 12 steps, documents, chat threads, and workflow runs). The store is persisted in `localStorage` so data survives page reloads. It can be reset via browser console.

---

## 5. API Endpoints (How the Frontend Talks to the Server)

The frontend communicates with the backend through these endpoints (all under `/api/v1`):

### 5.1 Auth
| What | Method | Path | Purpose |
|------|--------|------|---------|
| Register | POST | `/auth/register` | Create a new account |
| Login | POST | `/auth/login` | Sign in |
| Refresh Token | POST | `/auth/refresh` | Extend session |
| Logout | POST | `/auth/logout` | Sign out |
| Get My Profile | GET | `/auth/me` | Get current user + firm info |

### 5.2 Firm
| What | Method | Path | Purpose |
|------|--------|------|---------|
| Complete Onboarding | POST | `/firms/onboarding` | Set up firm profile after registration |
| Update Firm | PATCH | `/firms/me` | Change firm settings |

### 5.3 Clients
| What | Method | Path | Purpose |
|------|--------|------|---------|
| List Clients | GET | `/clients` | View all clients |
| Create Client | POST | `/clients` | Add a client |
| Get Client | GET | `/clients/{id}` | View client details |
| Update Client | PATCH | `/clients/{id}` | Edit client info |
| Delete Client | DELETE | `/clients/{id}` | Remove a client |

### 5.4 Matters
| What | Method | Path | Purpose |
|------|--------|------|---------|
| List Matters for Client | GET | `/clients/{id}/matters` | View all matters for a client |
| Create Matter | POST | `/clients/{id}/matters` | Open a new matter |
| Get Matter Detail | GET | `/matters/{id}` | View full matter with steps |
| Update Matter | PATCH | `/matters/{id}` | Edit matter info |
| Generate Step Content | POST | `/matters/{id}/steps/{key}/generate` | "Run AI" button — generates step content |
| Update Step | PATCH | `/matters/{id}/steps/{key}` | Mark step complete, edit content |

### 5.5 Documents
| What | Method | Path | Purpose |
|------|--------|------|---------|
| List Documents | GET | `/documents` | View all documents |
| Upload Document | POST | `/documents/upload` | Upload a file |
| Delete Document | DELETE | `/documents/{id}` | Remove a document |

### 5.6 Chat (AI Assistant)
| What | Method | Path | Purpose |
|------|--------|------|---------|
| List Threads | GET | `/chat/threads` | View conversation history |
| Create Thread | POST | `/chat/threads` | Start new conversation |
| List Messages | GET | `/chat/threads/{id}/messages` | View conversation |
| Send Message | POST | `/chat/threads/{id}/messages` | Ask the AI a question |

### 5.7 Workflows
| What | Method | Path | Purpose |
|------|--------|------|---------|
| List Templates | GET | `/workflows` | View available workflow templates |
| Get Template | GET | `/workflows/{id}` | View workflow details |
| Trigger Workflow | POST | `/workflows/{id}/trigger` | Start a workflow run |
| List Runs | GET | `/workflows/runs` | View workflow execution history |
| Get Run | GET | `/workflows/runs/{id}` | View run status and steps |

### 5.8 Dashboard & Leads
| What | Method | Path | Purpose |
|------|--------|------|---------|
| Dashboard Stats | GET | `/dashboard` | Summary statistics for home page |
| Create Lead | POST | `/leads` | Book a consultation (public) |

---

## 6. Database Structure (How Data Is Stored)

The backend uses PostgreSQL with these tables:

```
users ──── firm_memberships ──── firms
  │                                │
  └── refresh_tokens               ├── clients ──── matters ──── matter_steps
                                   │       │                      │
                                   │       └── documents          │
                                   │            │                 │
                                   │            └── document_chunks
                                   │
                                   ├── chat_threads ──── chat_messages
                                   │
                                   ├── workflow_runs ──── workflow_run_steps
                                   │
                                   └── workflow_templates

leads (standalone — no firm association)
```

**Key design decisions:**
- **Primary keys** are UUIDs (universally unique IDs) — not sequential numbers. This prevents guessing and makes data merging across systems safer.
- **Documents are chunked** — When a file is uploaded, it's split into pieces. Each chunk gets an AI embedding (a mathematical fingerprint) stored in a `pgvector` column. This enables semantic search ("find documents similar to this concept").
- **Soft deletes are not used** — Deleting a client permanently removes it and all linked matters. This is intentional for data privacy compliance.

---

## 7. AI Engine (How the "Smart" Features Work)

### 7.1 AI Assistant (Chat)

```
Lawyer asks: "What are the restrictive covenants in the CFO contract?"
        │
        ▼
System finds relevant document chunks
  (searches embeddings in pgvector)
        │
        ▼
System sends question + relevant chunks to LLM
  (Ollama running llama3.2, or OpenAI/Anthropic)
        │
        ▼
AI crafts answer with citations pointing to
  specific documents + page references
```

### 7.2 AI Step Generator ("Run AI")

When a lawyer clicks "Run AI" on a matter step (like Legal Research or Draft Creation), the system:
1. Sends the client intake data and step context to the LLM
2. The LLM analyzes the facts and generates relevant content
3. The generated content appears directly in the step workspace
4. The step status changes to "In Progress"

### 7.3 Workflow Automation
Automated processes that run when triggered:
- **Client Intake:** Validates form data, structures it, routes to external CMS (n8n webhook)
- **Contract Drafting:** Parses requirements, generates outline, runs quality checks
- **Case Summarization:** Ingests matter context, summarizes discovery materials, builds a timeline

---

## 8. Security & Authentication

- **Passwords** are hashed using bcrypt (industry standard) — never stored in plain text
- **Sessions** use JWT tokens with short-lived access tokens (15 minutes) and longer-lived refresh tokens (7 days)
- **API calls** require a Bearer token in the HTTP header
- **CORS** is configured to only allow the web frontend's origin (localhost:3000 in development)
- **Document uploads** are limited to 25MB per file
- The system supports **multiple LLM providers** and can switch between Ollama (free/local), OpenAI, Anthropic, or OpenRouter by changing environment variables

---

## 9. Deployment Options

| Method | Command | What Runs | Use Case |
|--------|---------|-----------|----------|
| Full Docker | `docker compose up --build` | Web + API + DB + Ollama | Production-like setup |
| Frontend only (mock) | `npm run dev:web:mock` | Web only (no backend needed) | Demos, testing |
| Frontend only (live) | `npm run dev:web` | Web only (needs backend) | Frontend development |
| API only | `docker compose up api postgres ollama` | API + DB + AI | Backend development |

---

## 10. i18n (Internationalization)

The web app supports multiple languages using `next-intl`:
- Translations are stored in locale files
- The user can switch languages from the sidebar
- The locale is persisted in a cookie
- Currently configured for LTR (left-to-right) languages

---

## 11. Testing Strategy

- **Mock Mode** serves as the primary testing/demo environment — no backend needed
- The Mock Store can be reset from browser console: `localStorage.removeItem('legisflow_mock_store')` then reload
- The mock API simulates realistic delays (150ms–1500ms) to mimic real server behavior
- Backend has seed scripts that populate demo data for development and testing

---

## 12. Key Files Reference

| File | What It Does |
|------|-------------|
| `packages/web/src/app/(portal)/clients/[clientId]/matters/[matterId]/page.tsx` | The main matter workspace screen (the most complex page) |
| `packages/web/src/components/matter/step-panels.tsx` | Renders each step's content panel |
| `packages/web/src/components/matter/workflow-phase-stepper.tsx` | The phase progress bar at the top of the workspace |
| `packages/web/src/mocks/api-mock.ts` | Complete mock API (all endpoints simulated) |
| `packages/web/src/mocks/store.ts` | In-memory data store for mock mode |
| `packages/api/app/models.py` | Database models (all tables) |
| `packages/api/app/routers/matters.py` | Matter API endpoints (step generation, CRUD) |
| `packages/api/app/agents/matter_step_agent.py` | AI agent that generates step content |
| `packages/api/app/services/demo_seed_content.py` | Demo data content for database seeding |
