# Business Case & Project Charter — LegisFlow

**Version:** 0.1.0
**Audience:** Lawyers / Legal Operations
**Scope:** Strategic justification, project planning, and governance
**Preceded by:** BRD (Business Requirements Document)

---

## PART 1: BUSINESS CASE

---

## 1. Executive Summary

LegisFlow is a **self-hosted legal practice management web application** designed for small to mid-size law firms (5-50 lawyers). It provides a structured 12-step matter workflow, AI-powered document analysis, and workflow automation — all running on the firm's own infrastructure with no monthly subscription fees.

**The Problem:**
Most small to mid-size law firms manage client matters using ad-hoc tools — email, spreadsheets, shared drives, and paper files. This results in:
- Inconsistent matter handling across attorneys
- Hours wasted searching for case information
- No centralized visibility into firm activity
- No AI assistance for research, drafting, or review
- Painful matter handovers when attorneys change

**The Solution:**
LegisFlow provides a centralized digital workspace where every matter follows a standardized 12-step workflow. Key features include:
- **Matter lifecycle management** — Track every legal matter from intake to closing
- **AI-assisted document analysis** — Upload documents and ask questions in plain English
- **AI step generation** — Generate research, drafts, and checklists with one click
- **Workflow automation** — Automate repetitive processes (intake, drafting, summarization)

**Why Self-Hosted?**
- No monthly fees — run on existing hardware
- Data never leaves the firm's infrastructure (critical for client confidentiality)
- No vendor lock-in — full control over AI provider (Ollama, OpenAI, Anthropic, etc.)
- Customizable and extensible

**Project Status:** v0.1.0 — Functional MVP with core features implemented. Ready for evaluation and testing.

---

## 2. Problem Statement

### 2.1 The Current State

Small to mid-size law firms face a persistent challenge: **the tools they use to manage matters are not designed for legal workflows.**

Email, spreadsheets, and shared drives are general-purpose tools that require manual organization. The typical workflow looks like this:

| Activity | Current Tool | Time Spent | Pain Point |
|----------|-------------|------------|------------|
| Matter setup | Email + manual folder creation | 30-60 min | Information scattered from the start |
| Document collection | Email requests + shared drive | Ongoing tracking | No centralized checklist |
| Legal research | Legal databases + local files | 4-8 hours | No context preservation |
| Draft creation | Word + email reviews | 4-12 hours | Multiple versions, no audit trail |
| Status reporting | Manual updates + meetings | 2+ hours/week | Checking with people, not the system |
| Matter handover | Knowledge transfer | 2-4 hours | Context lost when attorney changes |
| Closing & archiving | Shared drive + paper | Variable | No renewal tracking |

**The cumulative cost:** A mid-size firm wastes an estimated **15-20 hours per week** across all attorneys on administrative overhead that a structured system could eliminate or reduce.

### 2.2 The Market Gap

The legal-tech market offers two extremes:
1. **Enterprise solutions** (Clio, PracticePanther, NetDocuments) — Powerful but expensive ($50-200+/user/month) and complex to configure
2. **No solution** — Spreadsheets, email, and paper — free but inefficient and inconsistent

LegisFlow fills the gap: **a professional-grade system that runs on your own infrastructure with no ongoing fees, designed for firms that want structure without enterprise complexity or cost.**

---

## 3. Strategic Alignment

| Firm Priority | How LegisFlow Supports It |
|--------------|--------------------------|
| **Improve efficiency** | Standardized workflows reduce administrative overhead by an estimated 40-60% |
| **Ensure quality & consistency** | 12-step workflow ensures every matter follows the same rigorous process |
| **Protect client confidentiality** | Self-hosted AI (Ollama) means sensitive data never leaves firm infrastructure |
| **Attract and retain talent** | Modern AI-assisted tools appeal to younger lawyers who expect technology |
| **Scale without proportional overhead** | Digital processes scale better than manual ones — handle more matters without more staff |
| **Competitive differentiation** | AI-powered document analysis and drafting is a differentiator when pitching to clients |

---

## 4. Cost-Benefit Analysis

### 4.1 Costs

| Cost Category | Estimated Amount | Notes |
|--------------|-----------------|-------|
| **Hardware (one-time)** | £2,000-£5,000 | Server or workstation for hosting (or use existing hardware) |
| **Setup time (one-time)** | 4-8 hours | Docker setup, configuration, initial data seeding |
| **Maintenance (annually)** | £0-£2,000 | Hardware maintenance, backups, updates |
| **AI costs (if using cloud)** | £50-£500/month | OpenAI/Anthropic usage fees (optional — Ollama is free) |
| **Training (one-time)** | 2-4 hours per user | Familiarization with the matter workspace and AI features |

**Total first-year cost for a 20-lawyer firm:** £3,000-£10,000 (depending on hardware and AI choices)

### 4.2 Benefits (Estimated Annual Savings)

| Benefit Source | Hours Saved (per lawyer/year) | Monetary Value (at £250/hr billable) |
|---------------|------------------------------|--------------------------------------|
| Reduced document search time | 40 hours | £10,000 |
| Faster draft creation (AI-assisted) | 60 hours | £15,000 |
| Eliminated status meeting prep | 50 hours | £12,500 |
| Faster matter handover | 20 hours | £5,000 |
| Reduced administrative tracking | 30 hours | £7,500 |
| **Total per lawyer** | **200 hours** | **£50,000** |

**Firm-wide benefit (20 lawyers):** £1,000,000/year in recovered billable time

### 4.3 ROI Summary

| Metric | Value |
|--------|-------|
| **First-year investment** | ~£5,000 (typical, with existing hardware) |
| **First-year savings** | ~£500,000 (conservative, at 10 hours/week/lawyer recovered) |
| **ROI** | **~10,000%** |
| **Payback period** | **< 1 month** |
| **Ongoing annual cost** | ~£500-£6,000 (maintenance + optional AI fees) |
| **Ongoing annual savings** | ~£1,000,000 |

---

## 5. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Low adoption by attorneys** | Medium | High | Demo mode for evaluation, intuitive UI, clear productivity benefits |
| **AI quality insufficient** | Medium | Medium | Multiple LLM providers supported; switch to better model anytime |
| **Hardware requirements underestimated** | Low | Medium | Can run on modest hardware; cloud AI option reduces local requirements |
| **Data migration from existing systems** | Medium | Medium | Start with new matters in LegisFlow; run legacy systems in parallel |
| **Security concerns with self-hosting** | Low | High | Docker deployment with standard security practices; local AI avoids data transmission |
| **Feature gaps vs enterprise solutions** | Medium | Low | Focus on core workflow; extend based on firm-specific needs |

---

## PART 2: PROJECT CHARTER

---

## 6. SMART Objectives

| ID | Objective | Key Result | Timeline |
|----|-----------|-----------|----------|
| **SMART-01** | Implement structured matter management | 100% of new matters use the 12-step workflow | Month 1 |
| **SMART-02** | Deploy AI document assistant | 80% of attorneys use AI chat at least once per week | Month 2 |
| **SMART-03** | Achieve AI step generation | AI generates content for at least 5 of 12 steps | Month 2 |
| **SMART-04** | Enable workflow automation | At least 3 workflow templates available and triggerable | Month 3 |
| **SMART-05** | Ensure zero-dependency demo mode | Frontend runs fully with mock data, no backend needed | Complete (v0.1.0) |

---

## 7. Project Scope

### 7.1 In Scope

| Category | Included |
|----------|----------|
| **Authentication** | Email/password registration, login, JWT session management |
| **Firm management** | Firm onboarding, profile settings |
| **Client management** | CRUD operations, client list and detail view |
| **Matter management** | 12-step workflow, phase grouping, step navigation, status tracking |
| **AI step generation** | One-click content generation for any matter step |
| **Document management** | Upload (PDF/DOCX), listing, deletion, status tracking |
| **AI chat assistant** | Conversational Q&A with document citations (RAG) |
| **Workflow automation** | Template listing, triggering, run status tracking |
| **Dashboard** | Key metrics, quick-start links, demo mode banner |
| **Mock/demo mode** | Full in-browser data simulation with auto-login |
| **Marketing site** | Landing page, consultation booking, legal pages |
| **i18n framework** | Multi-language infrastructure (English content) |

### 7.2 Out of Scope

| Category | Excluded | Future Consideration |
|----------|----------|---------------------|
| **Billing/subscriptions** | ❌ | v2.0 — Stripe integration |
| **Team invites** | ❌ | v1.1 — Add team member flow |
| **Forgot password** | ❌ | v1.1 — Email-based reset |
| **Client portal** | ❌ | v2.0 — Client-facing access |
| **E-signature** | ❌ | v2.0 — DocuSign integration |
| **Calendar integration** | ❌ | v2.0 |
| **Email integration** | ❌ | v2.0 |
| **Mobile app** | ❌ | Not planned (responsive web only) |
| **Real-time collaboration** | ❌ | Not planned |
| **Advanced analytics** | ❌ | v2.0 — Reporting dashboards |
| **API for third parties** | ❌ | v2.0 — Public API |
| **Light theme** | ❌ | Not planned |

---

## 8. Key Stakeholders

| Stakeholder | Role | Interest | Success Criteria |
|-------------|------|----------|-----------------|
| **Firm Owner / Managing Partner** | Decision maker, sponsor | ROI, efficiency gains, quality control | Dashboard shows measurable productivity improvement |
| **Senior Associates** | Primary users, workflow owners | Matter visibility, reduced admin, AI assistance | 50% less time spent on administrative tasks |
| **Junior Lawyers** | Heavy users | Structured guidance, AI drafts, learning tool | AI generates useful content for >50% of steps |
| **Paralegals** | Heavy users | Checklists, document tracking, clear workflows | 100% of document requests tracked in system |
| **IT / Office Manager** | Deployment and maintenance | Easy setup, low maintenance, security | Docker deployment in <4 hours |
| **Clients (indirect)** | Beneficiary | Faster response, better quality, confidentiality | (Not system users) |

---

## 9. Milestone Schedule

| Milestone | Target Date | Status | Deliverable |
|-----------|-------------|--------|-------------|
| M1: Core architecture complete | Month 1 | ✅ Complete | Next.js + FastAPI monorepo, PostgreSQL schema, Docker setup |
| M2: Authentication & onboarding | Month 1 | ✅ Complete | Register, login, JWT session, firm onboarding |
| M3: Client & matter CRUD | Month 2 | ✅ Complete | Full CRUD for clients and matters with 12-step workflow |
| M4: AI assistant (chat) | Month 2 | ✅ Complete | RAG-powered chat with document citations |
| M5: AI step generation | Month 2 | ✅ Complete | "Run AI" button on each step generates content |
| M6: Document management | Month 2 | ✅ Complete | Upload, index, list, delete documents |
| M7: Workflow automation | Month 3 | ✅ Complete | Template listing, trigger, run tracking |
| M8: Mock/demo mode | Month 2 | ✅ Complete | Full in-browser mock API with auto-login |
| M9: Dashboard & analytics | Month 3 | ✅ Complete | Key metrics, quick-start links |
| M10: Marketing pages | Month 3 | ✅ Complete | Landing page, booking, legal pages |
| M11: Documentation complete | Month 3 | ✅ Complete | LLD, HLD, TRD, SRS, FRD, BRD, Business Case |
| **MVP v1.0 Release** | **Month 3** | **✅ Complete** | **Fully functional MVP ready for evaluation** |

---

## 10. Budget Estimate

### 10.1 Development Costs (Actual)

| Resource | Effort | Cost |
|----------|--------|------|
| Frontend development (Next.js) | ~400 hours | N/A (internal) |
| Backend development (FastAPI) | ~300 hours | N/A (internal) |
| Database design + AI integration | ~200 hours | N/A (internal) |
| Docker + DevOps | ~50 hours | N/A (internal) |
| **Total development** | **~950 hours** | **N/A (internal)** |

### 10.2 Deployment Costs (Estimated)

| Item | Monthly | Annual |
|------|---------|--------|
| Server hosting (cloud, if not self-hosted) | £50-£150 | £600-£1,800 |
| OpenAI API usage (optional, estimated) | £50-£500 | £600-£6,000 |
| Domain + SSL | £5 | £60 |
| Backup storage | £10 | £120 |
| **Total (with cloud AI)** | **£115-£665** | **£1,380-£7,980** |
| **Total (self-hosted, local AI)** | **~£15** | **~£180** |

---

## 11. Risk Log

| ID | Risk | Probability | Impact | Owner | Status | Mitigation |
|----|------|------------|--------|-------|--------|------------|
| **R-001** | AI feature quality doesn't meet expectations | Medium | Medium | Dev team | Active | Multiple LLM providers supported; configure better models |
| **R-002** | User adoption lower than expected | Medium | High | Product owner | Active | Demo mode for evaluation; clear onboarding flow |
| **R-003** | Performance issues with large datasets | Low | Medium | Dev team | Open | No pagination yet; will add when needed |
| **R-004** | Security vulnerabilities in self-hosted deployment | Low | High | IT team | Open | Docker security best practices; regular updates |
| **R-005** | Database migration complexity | Low | Low | Dev team | Open | Alembic handles schema migrations |

---

## 12. Success Criteria

### 12.1 Technical Success Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| **System uptime** | 99.9% | Server monitoring |
| **API response time (CRUD)** | < 200ms | Backend logs |
| **Page load time** | < 3 seconds | Lighthouse |
| **Mock mode functionality** | 100% of features work without backend | Manual testing |
| **AI response time** | < 30 seconds | Client-side timer |

### 12.2 Business Success Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| **Firm onboarding completion** | 100% of registered firms | Database |
| **Active matter creation** | At least 5 matters per attorney in first 3 months | Database |
| **AI feature usage** | 60%+ of matters have at least one AI step generation | Database |
| **Document upload rate** | At least 10 documents per matter | Database |
| **User satisfaction** | Positive feedback from pilot users | User interviews |

---

## 13. Sign-Off

(This section documents formal project approval.)

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Sponsor | | | |
| Product Owner | | | |
| Lead Developer | | | |
| QA Lead | | | |

---

**Document Status:** ✅ Draft — Pending Review  
**Next Steps:** Review and approve project charter. Proceed with implementation of remaining features and production deployment.
