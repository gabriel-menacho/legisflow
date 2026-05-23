# Functional Requirements Document — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** Detailed functional specifications, user stories, workflows
**Preceded by:** SRS (Software Requirements Specification)

---

## 1. Functional Overview

LegisFlow provides law firm professionals with a centralized web platform to:

| Capability | Summary |
|-----------|---------|
| **Matter Lifecycle Management** | Track each legal matter through 12 standardized steps from intake to closing |
| **Client Relationship Management** | Store client details, link matters to clients, manage contact information |
| **AI-Assisted Document Analysis** | Upload documents and ask questions; the AI finds answers in your documents |
| **AI Step Generation** | Generate step content (research, drafts, checklists) with one click |
| **Workflow Automation** | Trigger automated processes for intake, drafting, and summarization |
| **Practice Analytics** | View key metrics on the dashboard (matters, clients, documents) |

The system can run in **two modes**:
- **Live mode** — Full stack with backend, database, and AI engine
- **Mock/demo mode** — All data simulated in-browser for presentations and testing

---

## 2. User Personas & Roles

### 2.1 Personas

| Persona | Description | Goals & Pain Points |
|---------|-------------|-------------------|
| **Sarah — Firm Owner / Managing Partner** | Runs a mid-size law firm (11-50 lawyers). Concerned with practice efficiency, client satisfaction, and firm growth. | **Goal:** Standardize matter workflows across the firm. **Pain:** Junior attorneys lose time tracking down documents and case context. |
| **James — Senior Associate** | Handles complex corporate matters. Oversees junior lawyers and paralegals. | **Goal:** Stay on top of matter progress without micromanaging. **Pain:** Status update meetings waste billable hours. |
| **Priya — Junior Lawyer** | Does legal research and draft creation under supervision. | **Goal:** Get up to speed quickly on new matters. **Pain:** Scrambling to find relevant precedents and case law. |
| **Mike — Paralegal** | Handles document collection, filing, and administrative tasks. | **Goal:** Clear checklists and structured workflows. **Pain:** Chasing clients for documents with no tracking system. |
| **David — Compliance / QC** | Reviews drafts for regulatory compliance and internal standards. | **Goal:** Systematic review process with audit trail. **Pain:** No standardized checklist for compliance review. |

### 2.2 Role-Based Permissions

| Feature | Owner | Admin | Member |
|---------|-------|-------|--------|
| View dashboard | ✅ | ✅ | ✅ |
| Manage clients | ✅ Full CRUD | ✅ Full CRUD | ✅ Create/View/Edit |
| Manage matters | ✅ Full CRUD | ✅ Full CRUD | ✅ Create/View/Edit |
| Run AI on steps | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ✅ | ✅ |
| Chat with AI Assistant | ✅ | ✅ | ✅ |
| Trigger workflows | ✅ | ✅ | ✅ |
| Update firm settings | ✅ | ❌ | ❌ |
| Manage team members | ✅ | ❌ | ❌ |
| Delete firm | ✅ | ❌ | ❌ |

---

## 3. User Stories

### 3.1 Authentication & Onboarding

| ID | Story |
|----|-------|
| **US-001** | As a **new user**, I want to **create an account with my email and password** so that I can access the firm portal. |
| **US-002** | As a **returning user**, I want to **log in with my email and password** so that I can access my firm's data. |
| **US-003** | As a **user**, I want to **stay logged in** so that I don't have to re-enter my credentials on every page. |
| **US-004** | As a **new firm owner**, I want to **set up my firm profile** (name, size, practice areas) after first login so that the system is configured for my firm. |
| **US-005** | As a **user**, I want to **log out** so that I can secure my session when leaving my computer. |

### 3.2 Dashboard

| ID | Story |
|----|-------|
| **US-010** | As a **firm owner**, I want to **see key statistics** (client count, active matters, documents, chat threads) so that I can get a quick overview of firm activity. |
| **US-011** | As a **new user**, I want to **see quick-start links** so that I know what to do first. |

### 3.3 Clients

| ID | Story |
|----|-------|
| **US-020** | As a **user**, I want to **view a list of all clients** so that I can find and open a client's profile. |
| **US-021** | As a **user**, I want to **add a new client** with their contact details so that I can create matters for them. |
| **US-022** | As a **user**, I want to **view a client's details** and all their matters so that I can understand our relationship with them. |
| **US-023** | As a **user**, I want to **edit a client's information** so that I can keep records current. |
| **US-024** | As a **user**, I want to **delete a client** so that I can remove outdated or incorrect records. |

### 3.4 Matters & Steps

| ID | Story |
|----|-------|
| **US-030** | As a **user**, I want to **create a new matter** for a client so that I can start tracking a legal engagement. |
| **US-031** | As a **user**, I want to **view the full matter workspace** so that I can see all steps, their status, and current progress. |
| **US-032** | As a **user**, I want to **see which phase the matter is in** (Intake, Research, Draft, Review, Close) so that I understand progress at a glance. |
| **US-033** | As a **user**, I want to **click on a step to see its content** so that I can review or work on it. |
| **US-034** | As a **user**, I want to **mark a step as complete** so that the matter progresses to the next step. |
| **US-035** | As a **user**, I want to **click "Run AI" on a step** so that the system generates content for that step automatically. |
| **US-036** | As a **paralegal**, I want to **see which role is assigned to each step** so that I know who is responsible. |

### 3.5 Documents

| ID | Story |
|----|-------|
| **US-040** | As a **user**, I want to **upload a PDF or Word document** so that the system can index it for AI search. |
| **US-041** | As a **user**, I want to **see a list of all uploaded documents** so that I can find and manage files. |
| **US-042** | As a **user**, I want to **see a document's processing status** so that I know when it's ready for AI queries. |
| **US-043** | As a **user**, I want to **delete a document** so that I can remove incorrect or sensitive files. |

### 3.6 AI Assistant

| ID | Story |
|----|-------|
| **US-050** | As a **user**, I want to **start a new chat conversation** so that I can ask the AI questions. |
| **US-051** | As a **user**, I want to **ask a question about my case documents** so that I can quickly find information without reading through every file. |
| **US-052** | As a **user**, I want the **AI to cite which documents it used** so that I can verify the source of the information. |
| **US-053** | As a **user**, I want to **see my chat history** so that I can refer back to previous answers. |

### 3.7 Workflows

| ID | Story |
|----|-------|
| **US-060** | As a **user**, I want to **see available workflow templates** so that I know what automated processes are available. |
| **US-061** | As a **user**, I want to **trigger a workflow** so that automated processing starts. |
| **US-062** | As a **user**, I want to **check the status of a running workflow** so that I know when it's complete. |

### 3.8 Marketing & Leads

| ID | Story |
|----|-------|
| **US-070** | As a **potential customer**, I want to **learn about LegisFlow** on the landing page so that I can decide if it's right for my firm. |
| **US-071** | As a **potential customer**, I want to **book a consultation** so that I can discuss pricing and implementation. |

---

## 4. Functional Requirements ("System Shall" Statements)

### 4.1 Authentication

| ID | Requirement |
|----|------------|
| **SF-001** | The system shall register a new user with email, password (min 8 characters), and optional full name. |
| **SF-002** | The system shall reject registration if the email is already registered. |
| **SF-003** | The system shall authenticate a user with email and password. |
| **SF-004** | The system shall reject login with invalid credentials and display "Invalid credentials" error. |
| **SF-005** | The system shall return an access token (15 min expiry) and refresh token (7 day expiry) on successful login or registration. |
| **SF-006** | The system shall store tokens in the browser's localStorage. |
| **SF-007** | The system shall automatically refresh the access token when it expires, using the refresh token. |
| **SF-008** | The system shall redirect the user to the login page if token refresh fails (session expired). |
| **SF-009** | The system shall clear all tokens on logout. |

### 4.2 Firm Onboarding

| ID | Requirement |
|----|------------|
| **SF-010** | The system shall prompt the user to complete firm onboarding after first registration. |
| **SF-011** | The onboarding wizard shall collect: firm name, size (dropdown: Solo, 2-10, 11-50, 51-200, 200+), practice areas (multi-select), integrations (multi-select). |
| **SF-012** | The system shall redirect to the dashboard after onboarding is complete. |
| **SF-013** | The system shall prevent access to portal pages until onboarding is complete. |

### 4.3 Dashboard

| ID | Requirement |
|----|------------|
| **SF-020** | The system shall display the following metrics on the dashboard: clients count, active matters count, indexed documents count, chat thread count. |
| **SF-021** | The system shall display quick-start links: open demo matter, add client, upload documents, ask assistant. |
| **SF-022** | The system shall show a demo mode banner when running in mock mode. |

### 4.4 Clients

| ID | Requirement |
|----|------------|
| **SF-030** | The system shall display a list of all clients for the current firm. |
| **SF-031** | The system shall allow creating a client with: name (required), company, email, phone, notes. |
| **SF-032** | The system shall validate email format when provided. |
| **SF-033** | The system shall display client detail including: name, company, email, phone, notes, status, and all associated matters. |
| **SF-034** | The system shall allow updating client name, company, email, phone, notes, and status. |
| **SF-035** | The system shall permanently delete a client and all associated matters when delete is confirmed. |

### 4.5 Matters

| ID | Requirement |
|----|------------|
| **SF-040** | The system shall allow creating a matter for a client with: title (required), matter type, summary. |
| **SF-041** | The system shall automatically create all 12 steps when a new matter is created. |
| **SF-042** | The system shall set the first step (Client Intake) as the current step when a matter is created. |
| **SF-043** | The matter workspace shall display all steps grouped by phase. |
| **SF-044** | Each step shall display: label, status (pending/in-progress/completed), assigned role. |
| **SF-045** | The system shall allow the user to click any step to view its content. |
| **SF-046** | The system shall show a "Run AI" button on each step. |
| **SF-047** | When "Run AI" is clicked, the system shall generate content for that step and set its status to "in-progress". |
| **SF-048** | The system shall allow the user to mark a step as complete. |
| **SF-049** | When a step is marked complete, the system shall advance the matter to the next step. |

### 4.6 Documents

| ID | Requirement |
|----|------------|
| **SF-050** | The system shall accept file uploads in PDF and DOCX formats. |
| **SF-051** | The system shall reject files larger than 25MB. |
| **SF-052** | The system shall display uploaded documents in a list with: filename, status (processing/ready/failed), upload date. |
| **SF-053** | The system shall allow deleting a document. |
| **SF-054** | In mock mode, the system shall simulate document processing (status changes from processing to ready after a short delay). |

### 4.7 AI Assistant

| ID | Requirement |
|----|------------|
| **SF-060** | The system shall display a list of chat threads for the current firm. |
| **SF-061** | The system shall allow creating a new chat thread with a title. |
| **SF-062** | The system shall display all messages in a thread, with user messages right-aligned and assistant messages left-aligned. |
| **SF-063** | The system shall send the user's message to the AI and display the response. |
| **SF-064** | AI responses shall include citations with document name and excerpt when relevant. |
| **SF-065** | The system shall show a loading indicator while waiting for the AI response. |

### 4.8 Workflows

| ID | Requirement |
|----|------------|
| **SF-070** | The system shall display a list of available workflow templates with name and description. |
| **SF-071** | The system shall allow the user to trigger a workflow with optional input payload. |
| **SF-072** | The system shall display a list of past workflow runs with status. |
| **SF-073** | The system shall display the steps of a running workflow with individual step statuses. |

---

## 5. Workflow & Logic

### 5.1 Matter Lifecycle Flow

```
START: New matter created for client
         │
         ▼
    Phase 1: Intake
         │
         ├── Client Intake (Senior Lawyer)
         │    → Fill intake fields, identify risks/goals
         │    → Mark complete
         │
         ├── Document Collection (Paralegal)
         │    → Upload/receive documents from client
         │    → Mark complete
         │
         └── Evidence Collection (Paralegal)
              → Gather and verify evidence
              → Mark complete
         │
         ▼
    Phase 2: Research & Plan
         │
         ├── Legal Research (Junior Lawyer)
         │    → Research applicable law and precedents
         │    → [Run AI] generates research citations
         │
         └── Strategy & Structure (Senior Lawyer)
              → Plan approach and document structure
              → [Run AI] generates strategy suggestions
         │
         ▼
    Phase 3: Draft
         │
         └── Draft Creation (Junior Lawyer)
              → Create initial draft
              → [Run AI] generates draft sections
         │
         ▼
    Phase 4: Review
         │
         ├── Internal Review / QC (Compliance)
         │    → Quality check, compliance review
         │    → [Run AI] generates compliance checks
         │
         ├── Client Review (Client Stakeholder)
         │    → Client reviews and provides feedback
         │
         └── Revision & Negotiation (Senior Lawyer)
              → [Run AI] tracks versions and comments
              → Finalize terms
         │
         ▼
    Phase 5: Close
         │
         ├── Final Legal Approval (Senior Lawyer)
         │    → Final sign-off
         │
         ├── Execution / Filing (Paralegal)
         │    → Sign documents, file with authorities
         │
         └── Storage & Monitoring (Paralegal)
              → Archive, set renewal reminders
         │
         ▼
    END: Matter complete
```

### 5.2 Step Unlocking Logic

A step is available/unlocked when:
1. It is the first step (Client Intake), OR
2. The previous step is marked as "completed"

Steps cannot be skipped — each step must be completed before the next becomes available.

### 5.3 AI Step Generation Flow

```
User clicks "Run AI" on a step
         │
         ▼
System checks: is this the first time running AI on this step?
         │
         ├── Yes → Generate fresh content based on matter context
         │         (client intake data, previous step outputs)
         │
         └── No → Generate additional content, append to existing
         │
         ▼
Step status set to "in-progress"
Content displayed in step panel
```

### 5.4 AI Chat Flow

```
User types a question
         │
         ▼
System embeds the question (converts to mathematical vector)
         │
         ▼
System searches document_chunks for semantically similar content
         │
         ▼
System sends: question + top 5 relevant chunks to the LLM
         │
         ▼
LLM generates answer with citations pointing to specific documents
         │
         ▼
Answer displayed in chat thread with clickable citation links
```

### 5.5 Navigation Flow

```
Landing Page (/)
   │
   ├── Not logged in → /login or /register
   │                       │
   │                       ▼
   │                   /dashboard
   │
   └── Logged in (or mock mode) → /dashboard
                                      │
                               ┌──────┼──────────┐
                               ▼      ▼          ▼
                          /clients  /assistant  /documents
                             │
                             ▼
                     /clients/{id}
                             │
                             ▼
              /clients/{id}/matters/{matterId}
```

---

## 6. Data Requirements & Validation Rules

### 6.1 Field Definitions

| Entity | Field | Type | Required | Validation |
|--------|-------|------|----------|------------|
| **User** | email | String (255) | Yes | Valid email format, unique |
| | password | String | Yes | Minimum 8 characters |
| | full_name | String (255) | No | — |
| **Firm** | name | String (255) | Yes | — |
| | size | Enum | No | Solo, 2-10, 11-50, 51-200, 200+ |
| | practice_areas | Array | No | Predefined list |
| | integrations | Array | No | Predefined list |
| **Client** | name | String (255) | Yes | — |
| | company | String (255) | No | — |
| | email | String (255) | No | Valid email format |
| | phone | String (64) | No | — |
| | notes | Text | No | — |
| | status | Enum | Default | Active, Archived |
| **Matter** | title | String (512) | Yes | — |
| | matter_type | String (128) | Default | Predefined types |
| | summary | Text | No | — |
| | status | Enum | Default | Active, Closed |
| **Document** | filename | String (512) | Yes | — |
| | file | Binary | Yes | Max 25MB, PDF/DOCX only |

### 6.2 Matter Step Keys (Controlled Vocabulary)

```
client_intake        → "Client Intake"
document_collection  → "Document Collection"
evidence_collection  → "Evidence Collection"
legal_research       → "Legal Research"
strategy_structure   → "Strategy & Structure"
draft_creation       → "Draft Creation"
internal_review      → "Internal Review / QC"
client_review        → "Client Review"
revision_negotiation → "Revision & Negotiation"
final_approval       → "Final Legal Approval"
execution_filing     → "Execution / Filing"
storage_monitoring   → "Storage & Monitoring"
```

These 12 keys are hardcoded and cannot be customized. They form a linear progression.

### 6.3 Document Folders (Controlled Vocabulary)

```
general    → "General"
intake     → "Intake"
evidence   → "Evidence"
research   → "Research"
draft      → "Draft"
executed   → "Executed"
```

---

## 7. UI/UX Functional Specifications

### 7.1 Global Navigation

- **Public pages** (marketing, login, register): Full-width layout with marketing nav bar
- **Portal pages** (dashboard, clients, matters, etc.): Sidebar layout with:
  - Left sidebar (256px) with navigation links and user info
  - Mobile: Collapsed sidebar with dropdown navigation
  - Top demo mode banner (when applicable)

### 7.2 Sidebar Navigation Items

| Icon | Label | Route |
|------|-------|-------|
| dashboard | Dashboard | /dashboard |
| groups | Clients | /clients |
| smart_toy | Assistant | /assistant |
| folder | Documents | /documents |
| account_tree | Workflows | /workflows |
| settings | Settings | /settings |

### 7.3 Common UI Patterns

| Pattern | Behavior |
|---------|----------|
| **Loading state** | Centered spinner while data loads |
| **Error state** | Toast notification with error message |
| **Empty state** | Descriptive text and action button |
| **Form validation** | Inline error messages below fields |
| **Confirmation** | Confirmation dialog for destructive actions (delete) |
| **Navigation** | Current page highlighted in sidebar |

### 7.4 Theme

- **Color scheme:** Dark theme only (no light mode toggle)
- **Design system:** Custom Tailwind CSS with Material Design-inspired components
- **Typography:** Inter (body), Space Grotesk (headlines)
- **Icons:** Material Symbols outlined style

---

## 8. Exception Handling

### 8.1 Application Errors

| Scenario | User Sees | System Behavior |
|----------|-----------|-----------------|
| Invalid login credentials | Toast: "Invalid credentials" | No further action |
| Expired session | Redirect to /login | Tokens cleared from localStorage |
| Network error | Toast: error message | Retry option not implemented |
| API returns 500 | Toast: "Something went wrong" | Error logged to console |
| File too large | Toast error before upload | Upload prevented |
| Invalid file type | Toast error before upload | Upload prevented |
| AI times out | Toast: "AI response timed out" | No content generated |

### 8.2 Edge Cases

| Scenario | Behavior |
|----------|----------|
| User opens two tabs | Both tabs share the same localStorage tokens — both work |
| User clears browser data | Tokens lost, user redirected to login |
| AI returns empty response | Display "No content generated" message |
| Document processing fails | Document marked as "failed" with error message |
| Mock store persistence | Data survives page reload via localStorage |
| Mock store corruption | If localStorage data is corrupted, it resets to initial state |

---

## 9. Feature Flags & Configuration

| Flag | Type | Effect |
|------|------|--------|
| `NEXT_PUBLIC_MOCK_API=true` | Environment variable | Switches all API calls to in-browser mock |
| `NEXT_PUBLIC_MOCK_AUTO_LOGIN=true` | Environment variable | Auto-injects demo tokens in mock mode |
| `NEXT_PUBLIC_API_URL` | Environment variable | Backend API base URL (default: localhost:8000) |
