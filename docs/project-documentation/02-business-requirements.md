# Business Requirements Document — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** Business context, objectives, personas, process mapping
**Preceded by:** FRD (Functional Requirements Document)

---

## 1. Project Overview

### 1.1 Executive Summary

LegisFlow is a **legal practice management web application** designed for small to mid-size law firms (5-50 lawyers). It addresses a common problem: **law firms rely on ad-hoc tools** (email, spreadsheets, shared drives, paper files) to manage client matters, resulting in:

- Lost time searching for documents and case context
- Inconsistent matter handling across different attorneys
- No centralized view of firm activity and matter progress
- Difficulty onboarding new team members onto existing matters

LegisFlow replaces these fragmented tools with a **structured digital workspace** that guides every matter through a standardized 12-step workflow from intake to closing, augmented by AI-powered document analysis and content generation.

### 1.2 Vision Statement

*"Every law firm, regardless of size, should have the same structured case management capability as a top-tier firm — without requiring expensive IT infrastructure or dedicated software teams."*

### 1.3 Product Name & Brand

| Aspect | Detail |
|--------|--------|
| **Product Name** | LegisFlow |
| **Tagline** | (not yet defined) |
| **Domain** | Legal-tech SaaS |
| **Target Market** | Small to mid-size law firms (5-50 lawyers) |
| **Deployment** | Self-hosted (Docker) or cloud-managed |

---

## 2. Business Objectives

### 2.1 Primary Objectives

| ID | Objective | Measurable Outcome | Priority |
|----|-----------|-------------------|----------|
| **BO-001** | Reduce time spent searching for case information | Decrease document lookup time by 50% (from ~15 min to ~5 min per search) | High |
| **BO-002** | Standardize matter handling across the firm | 100% of matters follow the 12-step workflow within 3 months of adoption | High |
| **BO-003** | Reduce administrative overhead on lawyers | Decrease time spent on status reporting by 30% (dashboard provides instant visibility) | High |
| **BO-004** | Enable AI-assisted legal work | Lawyers use AI for research, drafting, and review on at least 50% of matters | Medium |
| **BO-005** | Improve client responsiveness | Decrease average response time to client questions by 40% (AI finds answers faster) | Medium |

### 2.2 Secondary Objectives

| ID | Objective | Rationale |
|----|-----------|-----------|
| **BO-010** | Provide demo/trial capability without backend setup | Allow potential customers to evaluate the product without technical support |
| **BO-011** | Support multiple AI providers | Avoid vendor lock-in, allow firms to choose their preferred AI (local or cloud) |
| **BO-012** | Enable workflow automation | Reduce manual repetitive tasks (intake, document routing) |

---

## 3. Target Audience & Personas

### 3.1 Primary Target Market

| Segment | Description | Size | Pain Points |
|---------|-------------|------|-------------|
| **Boutique law firms** | Specialized firms (corporate, employment, litigation) with 5-20 lawyers | Large market | Need structured workflows without enterprise software complexity |
| **Mid-size firms** | Full-service firms with 20-50 lawyers across multiple practice areas | Growing | Need standardization across practice groups; current solutions are either too basic (spreadsheets) or too expensive (PracticePanther, Clio) |
| **Solo practitioners** | Independent lawyers with 1-5 support staff | Very large | Need affordable case management; current options are either expensive or feature-poor |

### 3.2 Detailed Personas

#### Persona 1: Sarah Chen — Managing Partner

| Attribute | Detail |
|-----------|--------|
| **Role** | Managing Partner at a 25-lawyer corporate firm |
| **Age** | 45 |
| **Technical skill** | Moderate — comfortable with web apps, not technical |
| **Daily tools** | Outlook, Word, Excel, WhatsApp with clients |
| **Pain points** | "I spend 2 hours every Monday morning reading status reports from my associates. I need a dashboard that shows me at a glance what's happening." |
| **Goals** | Standardize matter handling, reduce status meeting overhead, ensure quality control |
| **Quote** | *"I can't bill for management overhead. Every hour I spend chasing status updates is an hour I'm not serving clients."* |

#### Persona 2: James Okonkwo — Senior Associate

| Attribute | Detail |
|-----------|--------|
| **Role** | Senior Associate, Employment Law |
| **Age** | 34 |
| **Technical skill** | High — tech-savvy, uses productivity tools |
| **Daily tools** | Outlook, Word, LinkedIn, legal research databases |
| **Pain points** | "When I get a new matter transferred from another attorney, I spend half a day reading through email chains to understand what's been done." |
| **Goals** | Quick matter context at handover, structured drafting process, AI-assisted research |
| **Quote** | *"The most expensive part of legal work is getting up to speed. If the system captures the context, I can start adding value immediately."* |

#### Persona 3: Priya Patel — Junior Lawyer

| Attribute | Detail |
|-----------|--------|
| **Role** | Junior Lawyer, 2 years PQE |
| **Age** | 27 |
| **Technical skill** | High — grew up with technology |
| **Daily tools** | Word, legal databases, Google |
| **Pain points** | "I'm not sure what 'good' looks like for each matter step. I waste time figuring out what research is needed or how to structure a draft." |
| **Goals** | Clear guidance on what each step requires, AI-generated starting points, mentorship without constant supervision |
| **Quote** | *"If the AI can generate a first draft of the research memo, I can focus on refining it instead of starting from blank."* |

#### Persona 4: Mike Davies — Paralegal

| Attribute | Detail |
|-----------|--------|
| **Role** | Paralegal supporting 3 attorneys |
| **Age** | 29 |
| **Technical skill** | Moderate |
| **Daily tools** | Outlook, Excel, document management system |
| **Pain points** | "I track document collection in a spreadsheet. Half the time I forget what's been requested and what's been received." |
| **Goals** | Clear checklists, document tracking within the matter, automated reminders |
| **Quote** | *"I need a system that tells me what's missing, not a spreadsheet I have to remember to update."* |

---

## 4. Business Process Mapping

### 4.1 As-Is (Current State): How Firms Work Now

**The Current Reality for Most Small to Mid-Size Firms:**

```
1. CLIENT ENGAGEMENT
   ┌─────────────────────────────────────────────────────┐
   │ Partner gets a call from a potential client         │
   │ → Takes notes on paper / email                      │
   │ → Asks assistant to open a "file"                   │
   │ → File created in: shared drive / paper folder /    │
   │   practice management system (if they have one)     │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
2. INTAKE
   ┌─────────────────────────────────────────────────────┐
   │ Paralegal sends document request list via email      │
   │ → Client sends documents as email attachments        │
   │ → Paralegal saves to shared drive (or forgets to)    │
   │ → No centralized checklist of what's been received   │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
3. RESEARCH & DRAFTING
   ┌─────────────────────────────────────────────────────┐
   │ Junior lawyer researches via legal databases         │
   │ → Saves notes as Word doc on their local machine     │
   │ → Senior associate reviews via email attachment      │
   │ → Comments come back as Track Changes or email       │
   │ → Multiple versions proliferate (v1_final, v2_final) │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
4. REVIEW & REVISION
   ┌─────────────────────────────────────────────────────┐
   │ Draft sent to client via email (often without        │
   │   proper document controls)                          │
   │ → Client sends back comments in email                │
   │ → Paralegal tracks changes in... a spreadsheet?      │
   │ → No version history, no audit trail                 │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
5. CLOSING & STORAGE
   ┌─────────────────────────────────────────────────────┐
   │ Final documents signed (physically or via Docusign)  │
   │ → Filed in shared drive / physical cabinet           │
   │ → No renewal reminders, no monitoring                │
   │ → When matter needs to be reopened, context is lost  │
   └─────────────────────────────────────────────────────┘
```

**Key Problems With the As-Is State:**

| Problem | Impact |
|---------|--------|
| **No centralized matter view** | Status requires asking people, not checking a system |
| **Information scattered** | Emails, shared drives, local machines, paper — hard to find anything |
| **Inconsistent processes** | Every attorney handles matters differently |
| **No AI assistance** | Research and drafting start from scratch every time |
| **No context preservation** | Matter handover requires hours of knowledge transfer |

### 4.2 To-Be (Future State): How LegisFlow Changes the Workflow

```
1. CLIENT ENGAGEMENT
   ┌─────────────────────────────────────────────────────┐
   │ Partner receives call → opens LegisFlow              │
   │ → Creates client record (2 minutes)                  │
   │ → Creates matter (1 minute)                          │
   │ → System automatically creates all 12 steps          │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
2. INTAKE (Steps 1-3)
   ┌─────────────────────────────────────────────────────┐
   │ Senior lawyer fills Client Intake step               │
   │ → Identifies risks, goals, key facts                 │
   │ → [AI can help generate risk analysis]               │
   │                                                      │
   │ Paralegal opens Document Collection step             │
   │ → System shows checklist of what's needed            │
   │ → Client uploads documents directly to matter        │
   │ → System tracks received vs pending                  │
   │                                                      │
   │ Evidence Collection step has built-in checklists     │
   │ → Paralegal marks items as verified                  │
   │ → Flags anomalies for senior review                  │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
3. RESEARCH & DRAFTING (Steps 4-6)
   ┌─────────────────────────────────────────────────────┐
   │ Junior lawyer opens Legal Research step              │
   │ → [Run AI] → System generates research citations    │
   │   based on matter context                            │
   │ → Junior lawyer reviews, adds own research           │
   │                                                      │
   │ Senior lawyer reviews Strategy & Structure step      │
   │ → [Run AI] → System suggests document structure     │
   │ → Senior lawyer approves/modifies                    │
   │                                                      │
   │ Junior lawyer creates Draft                         │
   │ → [Run AI] → System generates initial draft         │
   │ → Junior lawyer refines based on research            │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
4. REVIEW (Steps 7-9)
   ┌─────────────────────────────────────────────────────┐
   │ Compliance team opens Internal Review                │
   │ → [Run AI] → System runs compliance checks          │
   │ → Compares draft to prior versions                   │
   │ → Flags issues for attention                         │
   │                                                      │
   │ Client Review step captures client feedback          │
   │ → Comments tracked per clause                        │
   │ → Resolved vs pending comments visible               │
   │                                                      │
   │ Revision & Negotiation step                          │
   │ → Version history maintained                         │
   │ → [Run AI] suggests revision responses               │
   └─────────────────────────────────────────────────────┘
                              │
                              ▼
5. CLOSING (Steps 10-12)
   ┌─────────────────────────────────────────────────────┐
   │ Final Legal Approval step                             │
   │ → Senior lawyer does final review                    │
   │ → One click to approve                               │
   │                                                      │
   │ Execution / Filing step                              │
   │ → Track signing status                               │
   │ → Filing checklist                                   │
   │                                                      │
   │ Storage & Monitoring step                            │
   │ → System sets renewal reminders                      │
   │ → Key dates and obligations tracked                  │
   │ → Pre-expiry alerts configured                       │
   └─────────────────────────────────────────────────────┘
```

**Key Improvements in the To-Be State:**

| Improvement | Benefit |
|-------------|---------|
| **Centralized matter workspace** | All information in one place — no more hunting through emails and drives |
| **Standardized 12-step workflow** | Every matter follows the same process — consistent quality, measurable progress |
| **AI-assisted content generation** | Junior lawyers start from AI drafts — faster, more consistent |
| **AI-powered document search** | Find answers in documents in seconds, not hours |
| **Checklists for every step** | No more spreadsheets — system tracks what's done and what's pending |
| **Status at a glance** | Dashboard shows firm-wide activity — fewer status meeting hours |

### 4.3 Business Process Impact Summary

| Metric | As-Is | To-Be | Improvement |
|--------|-------|-------|-------------|
| Time to find case information | ~15 minutes | ~2 minutes | 87% faster |
| Matter handover time | ~4 hours | ~15 minutes | 94% faster |
| Draft creation time | ~8 hours | ~4 hours | 50% faster |
| Status reporting time | ~2 hours/week | ~5 minutes/week | 96% faster |
| Document request tracking | Spreadsheet (manual) | Automated checklist | Eliminates manual tracking |
| Audit trail | None | Complete step history | Compliance-ready |

---

## 5. High-Level Functional Needs

These are the business capabilities LegisFlow must provide, organized by priority:

### 5.1 Must-Have (Core MVP)

| Capability | Business Justification |
|-----------|----------------------|
| **Matter workflow management** | The core value proposition — standardize matter handling across the firm |
| **Client management** | Prerequisite for matter management — every matter belongs to a client |
| **Document upload and AI indexing** | Required for the AI assistant to work with firm documents |
| **AI chat assistant with RAG** | Primary AI feature — answers questions based on uploaded documents |
| **AI step content generation** | Key differentiator — reduces drafting and research time |
| **User authentication** | Required for any multi-user system |
| **Firm onboarding** | Configures the system for each firm's practice areas |
| **Dashboard with key metrics** | Provides instant firm-wide visibility |

### 5.2 Should-Have (Phase 2)

| Capability | Business Justification |
|-----------|----------------------|
| **Workflow automation** | Reduces manual repetitive tasks |
| **Mock/demo mode** | Enables evaluation without technical setup (critical for sales) |
| **Team management** | Add and manage firm members |
| **Multi-language support** | Enables international firms and non-English-speaking users |

### 5.3 Could-Have (Phase 3)

| Capability | Business Justification |
|-----------|----------------------|
| **Search across clients and matters** | Faster navigation for firms with many clients |
| **Audit logging** | Compliance and internal governance |
| **Client portal** | Clients can view matter progress and upload documents |
| **E-signature integration** | Complete the closing workflow digitally |

---

## 6. Constraints

### 6.1 Business Constraints

| Constraint | Impact |
|-----------|--------|
| **No dedicated IT staff at target firms** | Must be easy to deploy (Docker compose) or fully managed |
| **Budget-sensitive market** | Must offer a free tier (self-hosted with Ollama) to reduce barrier to entry |
| **Data privacy concerns** | Must support on-premise/local AI (Ollama) so sensitive data never leaves the firm |
| **No sales team (initial phase)** | Must be self-service — demo mode enables evaluation without human assistance |

### 6.2 Technical Constraints

| Constraint | Decision |
|-----------|----------|
| **Must work without internet** | Local AI (Ollama) support, self-hosted deployment |
| **Must work on modest hardware** | Default LLM is lightweight (llama3.2), PostgreSQL runs on small instances |
| **No third-party auth dependency** | Custom JWT authentication, no external auth provider |
| **Single database for all tenants** | Logical multi-tenancy with `firm_id` isolation |

### 6.3 Regulatory Constraints

| Constraint | Compliance Approach |
|-----------|-------------------|
| **GDPR — Right to deletion** | Permanent delete implementation (no soft deletes) |
| **GDPR — Data minimization** | Only essential data collected (name, email) |
| **GDPR — Cookie consent** | Cookie banner on first visit |
| **Lawyer-client confidentiality** | Local AI option ensures data never leaves firm infrastructure |

---

## 7. Glossary

| Term | Definition |
|------|-----------|
| **Matter** | A legal case, transaction, or engagement that a firm handles for a client |
| **Step** | One stage in the 12-stage matter lifecycle workflow |
| **Phase** | A group of related steps (Intake, Research & Plan, Draft, Review, Close) |
| **RAG** | Retrieval-Augmented Generation — AI technique that searches documents before generating answers |
| **LLM** | Large Language Model — the AI engine (e.g., Ollama's llama3.2, OpenAI's GPT) |
| **Embedding** | A numerical vector representation of text used for semantic similarity search |
| **Mock Mode** | Frontend-only mode where all data is simulated in-browser (no backend needed) |
| **Firm** | A law firm — the tenant/account in the system |
| **Single tenant** | Each firm has its own isolated data within the shared database |
| **Ollama** | Free, locally-run AI platform that hosts LLMs on the firm's own hardware |
| **Pgvector** | PostgreSQL extension for storing and searching AI embeddings |
| **Multi-tenancy** | A single system instance serving multiple firms with data isolation |
| **CORS** | Cross-Origin Resource Sharing — a browser security mechanism |
| **JWT** | JSON Web Token — a standard for securely transmitting authentication data |
