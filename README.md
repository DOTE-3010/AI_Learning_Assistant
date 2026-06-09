# AI Learning Assistant

AI Learning Assistant is being rebuilt as a local-first academic artifact studio. The phase-1 product is a warm editorial workbench for generating homework code, essay PDFs, Beamer slides, and dense cheat sheets from an authenticated CUHK teaching workflow.

The first distributable runtime is an Electron shell plus Docker Desktop backend. Docker runs the FastAPI service, SQLite metadata store, LaTeX toolchain, and artifact filesystem; Electron only detects/starts Docker and loads the web workbench.

## Current Phase-1 Runtime

- Backend: `backend/`, FastAPI under `/api`, SQLite metadata, generated files on disk.
- Frontend: `frontend/`, Vite workbench served from `/ui/` by the backend container.
- Desktop shell: `apps/desktop/`, Electron startup wrapper for Docker Desktop.
- Runtime data: `data/app.sqlite` and `workspace/` by default; both are ignored local state.
- Compose file: root `compose.yml`, project name `ai-learning-assistant` for the desktop shell.

The rebuilt local runtime does not require Postgres or Mongo. The old course/assignment/chat MVP is no longer the active product surface.

## Local Setup

Backend development environment:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r backend/requirements-dev.txt
```

Verification:

```bash
.venv/bin/python -m pytest backend/tests -q
npm --prefix frontend run build
./scripts/smoke_e2e.sh
```

Docker/browser runtime:

```bash
docker compose -p ai-learning-assistant config
docker compose -p ai-learning-assistant up --build -d
curl -fsS http://127.0.0.1:14242/health
./run_web.command
```

Desktop launcher:

```bash
./run_desktop.command
npm --prefix apps/desktop run smoke
```

Use `run_web.command` for web-first development and QA. It starts the Docker runtime and opens the browser workbench without Electron. Use `run_desktop.command` only when testing the Electron packaging layer. On Windows, use `run_desktop.bat`.

## Model Settings And Secrets

Tracked source contains only placeholder model defaults. Real Qwen/OpenAI-compatible credentials belong in untracked local settings or the in-app model settings editor. In Docker, saved model keys are written to `/app/data/model-secrets.env`, which is mounted from local `data/` by default.

The end-to-end smoke script sets `AILA_MOCK_MODEL_PROVIDER=1` and uses temporary data/workspace mounts, so it exercises the real API and artifact pipeline without live model credentials.

## QA Entry

- Current QA starts with `docs/TASKS/000-web-browser-qa-baseline.md`.
- Functional QA uses the Docker plus browser workflow at `http://127.0.0.1:14242/ui/`.
- Electron packaging QA is deferred until the web product passes human review.

## Known Gaps

- Native no-Docker packaging, signed macOS app distribution, and hosted deployment remain future phases.

Read `AGENTS.md`, `docs/SPEC.md`, `docs/ARCH.md`, `docs/RULES.md`, and `docs/CONTRACTS/` before implementing a task.
