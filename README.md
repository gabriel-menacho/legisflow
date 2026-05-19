# LegisFlow

Legal-tech SaaS monorepo: marketing site, firm portal, AI assistant (RAG), and workflow automation.

## Stack

- **Monorepo:** Lerna + npm workspaces
- **Frontend:** Next.js 15 (`packages/web`) — LegisFlow design system from `designs/`
- **API:** FastAPI + Pydantic AI + pgvector (`packages/api`)
- **LLM (default):** Ollama (`llama3.2` + `nomic-embed-text`) — free/local
- **Database:** PostgreSQL 16 + pgvector

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up --build
```

Wait for `ollama-init` to pull models (first run may take several minutes).

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

### Demo credentials

- Email: `demo@legisflow.com`
- Password: `Demo123!`

## Demo script

1. Open http://localhost:3000 — marketing funnel
2. Sign in with demo credentials (or register + onboarding)
3. **Documents** — upload a PDF/TXT
4. **Assistant** — ask a question (requires Ollama healthy)
5. **Workflows** — trigger Case Summarization
6. **Book consultation** on `/book` — creates a lead via API

## Switching LLM provider

Set in `.env` / `docker-compose.yml`:

```bash
# OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Anthropic
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=...

# OpenRouter
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=...
```

Restart the `api` service after changes.

## Local development (without Docker)

### API

```bash
cd packages/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Start Postgres + Ollama separately
alembic upgrade head
python -m app.scripts.seed
uvicorn app.main:app --reload
```

### Web

```bash
npm install
npm run dev --workspace=@legisflow/web
```

## Project structure

```
packages/web/     Next.js frontend
packages/api/     FastAPI backend
packages/shared/  Shared TypeScript types
designs/          Source design tokens + landing HTML reference
infra/docker/     DB init scripts
```

## Environment

See [.env.example](.env.example) for all variables.

## Notes

- Ollama needs ~8GB RAM for `llama3.2`; use `llama3.2:1b` on smaller machines
- Document upload limit: 25MB
- Team invites and billing are v2 scope
