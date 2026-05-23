# Software Requirements Specification — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Standard:** ISO/IEC/IEEE 29148:2018
**Preceded by:** TRD (Technical Requirements Document)

---

## 1. Introduction

### 1.1 Purpose

LegisFlow is a web-based legal practice management system that helps law firms manage client matters through a structured 12-step workflow. It replaces ad-hoc processes (email, spreadsheets, file folders) with a centralized digital workspace.

The system serves three primary functions:
1. **Matter management** — Track every legal matter from intake to closing through standardized steps
2. **AI-assisted document analysis** — Upload documents, ask questions, get AI-generated answers with citations
3. **Workflow automation** — Trigger automated processes for intake, drafting, and case summarization

### 1.2 Scope

This document covers all functional and non-functional requirements for LegisFlow v0.1.0. It describes what the system does and the quality standards it must meet.

### 1.3 Definitions

| Term | Definition |
|------|-----------|
| **Matter** | A legal case or engagement for a client |
| **Step** | One of 12 predefined stages a matter progresses through |
| **Phase** | A group of related steps (Intake, Research & Plan, Draft, Review, Close) |
| **RAG** | Retrieval-Augmented Generation — AI technique that searches documents before answering |
| **LLM** | Large Language Model — the AI engine (e.g., Ollama, GPT) |
| **Embedding** | A mathematical representation of text used for semantic search |
| **Mock Mode** | Running the frontend with simulated data, no backend needed |
| **Firm** | A law firm using LegisFlow (single tenant) |

### 1.4 References

| Document | Location |
|----------|----------|
| Low-Level Design | `docs/project-documentation/07-low-level-design.md` |
| High-Level Design | `docs/project-documentation/06-high-level-design.md` |
| Technical Requirements | `docs/project-documentation/05-technical-requirements.md` |

---

## 2. Overall Description

### 2.1 Product Perspective

LegisFlow is a **standalone web application** that does not depend on any legacy system. It can run in two modes:

- **Live Mode** — Connects to a backend server with PostgreSQL database and AI engine
- **Mock Mode** — All data simulated in the browser (no backend, no database, no AI needed)

The system is designed as a **single-tenant** application per firm. Each firm has its own data isolated within the shared database (logical multi-tenancy via `firm_id`).

### 2.2 User Classes

| User Class | Description | Permissions |
|-----------|-------------|-------------|
| **Owner** | Firm administrator who set up the account | Full access to all features, settings, and team management |
| **Admin** | Senior staff who manage operations | Full access except cannot delete firm |
| **Member** | Regular attorney or staff | Can view/edit clients, matters, documents, chat, workflows assigned to them |
| **Client Stakeholder** | External client who reviews documents | Can view and comment on their matters (future scope) |
| **Visitor (unauthenticated)** | Person browsing the marketing site | Can view marketing pages and book a consultation |

### 2.3 Operating Environment

| Environment | Specification |
|-------------|--------------|
| **Browser** | Modern browsers (Chrome, Firefox, Safari, Edge — latest 2 versions) |
| **Mobile** | Not optimized for mobile (desktop-first) |
| **Screen resolution** | Minimum 1024x768 (designed for 1366x768+) |
| **Internet** | Required for live mode; offline mode not supported |

### 2.4 Constraints

| Constraint | Description |
|-----------|-------------|
| **Technology** | Frontend is Next.js, backend is FastAPI/Python, database is PostgreSQL |
| **AI dependency** | AI features require a running LLM (local or cloud) |
| **File size** | Document uploads limited to 25MB |
| **Dark theme only** | No light theme available |
| **Desktop-first** | No responsive mobile layout |
| **Local file storage** | Uploaded files stored on server disk (not S3) |
| **Single language** | UI supports i18n framework but only English content exists |

### 2.5 Assumptions

- Users have basic computer literacy and web browser familiarity
- Each firm has at least one attorney who serves as the account owner
- The firm provides its own AI infrastructure (Ollama) or pays for cloud LLM access
- Internet connectivity is available for live mode
- PDF and DOCX are the primary document formats

---

## 3. System Features

Each feature is identified by a unique requirement ID for traceability.

### 3.1 Authentication & Account Management

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-001** | User Registration | High | User can create an account with email and password (min 8 characters) |
| **FR-002** | User Login | High | User can log in with email and password |
| **FR-003** | Session Management | High | User stays logged in across page refreshes (tokens in localStorage) |
| **FR-004** | Token Refresh | High | Access tokens are automatically refreshed when expired |
| **FR-005** | Logout | High | User can log out, which clears session tokens |
| **FR-006** | Mock Auto-Login | Medium | In mock mode, user is automatically logged in as demo user |
| **FR-007** | Password Validation | Medium | Password must be at least 8 characters |
| **FR-008** | Forgot Password | Low | Placeholder page — no actual password reset flow |

### 3.2 Firm Onboarding & Settings

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-010** | Firm Onboarding Wizard | High | After registration, user sets firm name, size, practice areas, and integrations |
| **FR-011** | Firm Settings | Medium | Firm owner can update firm name, size, practice areas, integrations |
| **FR-012** | Team Membership | Low | View firm team members (future: invite/remove) |

### 3.3 Client Management

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-020** | List Clients | High | User can view a list of all clients for their firm |
| **FR-021** | Create Client | High | User can add a new client with name, company, email, phone, notes |
| **FR-022** | View Client Detail | High | User can view a client's details and all their matters |
| **FR-023** | Update Client | High | User can edit client information |
| **FR-024** | Delete Client | High | User can delete a client (permanently removes client + all matters) |
| **FR-025** | Client Count | Medium | Client list shows how many matters each client has |

### 3.4 Matter Management

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-030** | Create Matter | High | User can create a new matter for a client with title, type, summary |
| **FR-031** | View Matter Detail | High | User can view the full matter workspace with all 12 steps |
| **FR-032** | Update Matter | High | User can edit matter title, type, status, summary |
| **FR-033** | Matter Progress Tracking | High | The workspace shows which step the matter is currently on |
| **FR-034** | Phase Grouping | Medium | Steps are grouped into 5 phases (Intake, Research & Plan, Draft, Review, Close) |
| **FR-035** | Step Navigation | High | User can navigate between steps and see step status (pending/in-progress/completed) |
| **FR-036** | Mark Step Complete | High | User can mark a step as completed |
| **FR-037** | AI Step Generation | High | User can click "Run AI" to generate content for any step |
| **FR-038** | Step Content Editing | Medium | User can manually edit step content |
| **FR-039** | Step Assignment Information | Medium | Each step shows which role is responsible |

### 3.5 Document Management

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-040** | Upload Document | High | User can upload PDF or DOCX files (up to 25MB) |
| **FR-041** | List Documents | High | User can view all uploaded documents |
| **FR-042** | Document Status | Medium | Documents show processing status (processing/ready/failed) |
| **FR-043** | Delete Document | Medium | User can delete uploaded documents |
| **FR-044** | Document Folder Organization | Low | Documents can be organized into folders (general, intake, evidence, research, draft, executed) |
| **FR-045** | Document-Matter Association | Medium | Documents can be linked to a specific matter |

### 3.6 AI Assistant

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-050** | Chat Thread Management | High | User can create, view, and select conversation threads |
| **FR-051** | Send Message | High | User can send a message to the AI assistant |
| **FR-052** | AI Response with Citations | High | AI responses include citations pointing to specific source documents |
| **FR-053** | Conversation History | High | User can scroll through past messages in a thread |
| **FR-054** | Thread Auto-Titling | Medium | Thread title is automatically set to the first message |

### 3.7 Workflow Automation

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-060** | List Workflow Templates | High | User can view available workflow templates |
| **FR-061** | View Workflow Detail | Medium | User can view a workflow template's description |
| **FR-062** | Trigger Workflow | High | User can trigger a workflow run |
| **FR-063** | View Workflow Runs | Medium | User can view history of workflow runs |
| **FR-064** | Run Status Tracking | Medium | User can view the current status and steps of a running workflow |

### 3.8 Dashboard & Analytics

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-070** | Dashboard Statistics | High | Dashboard shows key metrics: clients count, active matters, documents indexed, chat threads |
| **FR-071** | Quick Start Links | Medium | Dashboard provides quick links to common actions (open demo matter, add client, upload docs, ask assistant) |
| **FR-072** | LLM Configuration Display | Low | Dashboard shows which AI provider and model is currently configured |

### 3.9 Marketing & Lead Generation

| ID | Requirement | Priority | Description |
|----|------------|----------|-------------|
| **FR-080** | Landing Page | High | Public-facing marketing site describing LegisFlow features |
| **FR-081** | Book Consultation | High | Visitors can submit a contact form to book a consultation |
| **FR-082** | Legal Pages | Medium | Public pages for terms of service, privacy policy, security information |
| **FR-083** | Cookie Banner | Medium | GDPR-compliant cookie consent banner |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

| Interface | Technology | Description |
|-----------|-----------|-------------|
| **Web Application** | Next.js 15 (React 19) | Full browser-based UI, dark theme, responsive down to 1024px |
| **API Documentation** | Swagger UI (auto-generated) | Available at `/docs` when backend is running |
| **Public Pages** | Server-side rendered | Marketing, login, register, legal pages load fast for SEO |

**UI Components:** The system uses a custom design system built with Tailwind CSS. Key reusable components include:
- Button, Icon, LanguageSwitcher, SkipLink (accessibility)
- Toast notifications for feedback
- CookieBanner for GDPR compliance

### 4.2 Software Interfaces

| Interface | Protocol | Data Format | Description |
|-----------|----------|-------------|-------------|
| **REST API** | HTTP/1.1 | JSON | All frontend-to-backend communication |
| **Database** | PostgreSQL wire protocol | SQL | Backend-to-database communication via SQLAlchemy |
| **LLM Provider** | HTTP (REST) | JSON | Backend-to-AI-engine communication via httpx |
| **n8n Webhook** | HTTP POST | JSON | Backend triggers external workflow automation |

### 4.3 Communication Interfaces

| Interface | Standard | Details |
|-----------|----------|---------|
| **HTTP** | HTTP/1.1 | Standard web communication |
| **CORS** | Cross-Origin Resource Sharing | Configured to allow frontend origin only |
| **Bearer Authentication** | RFC 6750 | JWT tokens passed in Authorization header |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement | Target | Measurement |
|----|-----------|--------|-------------|
| **NFR-001** | Page load time (first visit) | < 3 seconds | Lighthouse / browser DevTools |
| **NFR-002** | Page navigation (SPA) | < 500ms | Browser DevTools |
| **NFR-003** | API response time (CRUD) | < 200ms | Backend logs / APM |
| **NFR-004** | AI chat response time | < 30 seconds | Client-side timer |
| **NFR-005** | File upload processing | < 15 seconds | Client-side timer |
| **NFR-006** | Concurrent users | 50 (per firm) | Load testing |
| **NFR-007** | Mock mode response | < 100ms (non-AI) | Client-side timer |

### 5.2 Security Requirements

| ID | Requirement | Standard | Implementation |
|----|-----------|----------|---------------|
| **NFR-010** | Password hashing | bcrypt | passlib library |
| **NFR-011** | Token signing | HS256 | python-jose with configurable JWT_SECRET |
| **NFR-012** | Session expiry | 15 min (access) / 7 days (refresh) | JWT expiration claims |
| **NFR-013** | Data isolation | per-firm | All queries filtered by firm_id |
| **NFR-014** | File upload validation | Type + size check | Backend validates MIME type and max 25MB |
| **NFR-015** | API authentication | Required for all endpoints except register/login | Bearer token middleware |

### 5.3 Reliability & Availability

| ID | Requirement | Target | Notes |
|----|-----------|--------|-------|
| **NFR-020** | Uptime | 99.9% (production) | Deployment-dependent |
| **NFR-021** | Data persistence | Database backups configured | Deployment-dependent |
| **NFR-022** | Graceful degradation | AI features fail gracefully without crashing the UI | Error messages shown in toast notifications |
| **NFR-023** | Data loss prevention | Database transactions with rollback on failure | SQLAlchemy transaction management |

### 5.4 Maintainability & Scalability

| ID | Requirement | Implementation |
|----|-----------|---------------|
| **NFR-030** | Modular codebase | Separate routers, services, agents, and models in backend |
| **NFR-031** | Type safety | TypeScript for frontend, Pydantic + mypy for backend |
| **NFR-032** | Database migrations | Alembic for version-controlled schema changes |
| **NFR-033** | Environment-based configuration | All config via environment variables (pydantic-settings) |
| **NFR-034** | Frontend scalability | Stateless, can be deployed behind a load balancer |
| **NFR-035** | Backend scalability | Stateless, can be horizontally scaled |
| **NFR-036** | Mock mode for testing | Complete mock API enables testing without backend |

### 5.5 Usability Requirements

| ID | Requirement | Description |
|----|-----------|-------------|
| **NFR-040** | Dark theme | All UI uses a dark color scheme |
| **NFR-041** | Keyboard navigation | Skip link, focus indicators, ARIA labels |
| **NFR-042** | Loading states | Visual feedback while data loads (spinners, skeletons) |
| **NFR-043** | Error notifications | Toast messages for user-visible errors |
| **NFR-044** | Consistent navigation | Portal sidebar with clear section labels and icons |

### 5.6 Regulatory Compliance

| ID | Requirement | Status | Notes |
|----|-----------|--------|-------|
| **NFR-050** | GDPR — Right to deletion | Implemented | Deleting a client permanently removes all linked data |
| **NFR-051** | GDPR — Cookie consent | Implemented | Cookie banner on first visit |
| **NFR-052** | GDPR — Data minimization | Implemented | System only collects essential data (name, email) |
| **NFR-053** | Accessibility | Partial | Skip links, ARIA labels, keyboard navigation |
| **NFR-054** | Data encryption at rest | Not implemented (dev) | Database-level encryption depends on PostgreSQL configuration |
| **NFR-055** | Audit logging | Not implemented | Future: track who changed what and when |

---

## 6. Requirement Prioritization Summary

### Must-Have (v1.0 Release)

- User authentication (register, login, logout, session)
- Client CRUD (create, read, update, delete)
- Matter CRUD with 12-step workflow
- AI step generation ("Run AI")
- Document upload and listing
- AI Assistant with RAG (chat with citations)
- Workflow templating and triggering
- Dashboard with key metrics

### Should-Have (v1.1)

- Team management (invite members, roles)
- Document folders and matter-linking
- Workflow run history and status tracking
- Firm settings editing

### Could-Have (v2.0)

- Forgot password / password reset
- Audit logging
- Search across clients and matters
- Pagination for large lists
- API keys for external integrations
- Mobile-responsive layout

### Won't-Have (Out of Scope)

- Billing / subscription management
- Calendar integration
- Email integration
- Client portal (client-facing access)
- E-signature (DocuSign integration)
- Real-time collaboration
