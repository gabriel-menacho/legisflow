# LegisFlow — frontend-only demo

Run the full product UI without Docker, Postgres, FastAPI, or Ollama. All API calls are handled by an in-memory mock layer.

## Quick start

```bash
git checkout feat/frontend-mock-demo
npm install
npm run dev:web:mock
```

Open [http://localhost:3000](http://localhost:3000). You should land in the portal automatically (mock auto-login).

Alternative from the web package:

```bash
cd packages/web
npm run dev
```

## Demo credentials

| Field | Value |
|-------|-------|
| Email | `demo@legisflow.com` |
| Password | `Demo123!` |

Any email/password also works for ad-hoc testing after sign-out, except duplicate registration emails.

## Reset demo data

In the browser console:

```javascript
localStorage.removeItem('legisflow_mock_store');
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
location.reload();
```

Or call `resetMockStore()` from `@/mocks/store` in dev tools if imported.

## Feature tour

1. **Marketing** — `/` landing, `/book` consultation lead form
2. **Portal (auto)** — `/dashboard` with stats and demo matter quick link
3. **Matter workspace** — `/clients/demo-client-riverside/matters/demo-matter-cfo?step=revision_negotiation` — all 12 workflow steps, edit, AI generate, document upload
4. **Documents** — `/documents` — list, upload (processing → ready), delete
5. **Assistant** — `/assistant` — threads, send message (citations included)
6. **Workflows** — `/workflows` — trigger a template, watch run progress (~4s polling)
7. **Workflow run** — open a run from the list for step logs
8. **Clients** — `/clients`, create at `/clients/new`, detail and new matter
9. **Auth flows** — sign out → `/login` (demo fill) or `/register` → `/onboarding` → portal
10. **Settings** — `/settings`, `/settings/team` (static)
11. **Legal pages** — `/security`, `/terms`, `/privacy`

## Environment variables

| Variable | Default on this branch | Purpose |
|----------|------------------------|---------|
| `NEXT_PUBLIC_MOCK_API` | `true` | Use in-memory mock instead of HTTP API |
| `NEXT_PUBLIC_MOCK_AUTO_LOGIN` | `true` | Inject demo session on first load |

Set `NEXT_PUBLIC_MOCK_AUTO_LOGIN=false` to start on the marketing site and sign in manually.

## Production / real API

Use a `.env.local` without mock flags (or set `NEXT_PUBLIC_MOCK_API=false`) and point `NEXT_PUBLIC_API_URL` at your API (default `http://localhost:8000`).
