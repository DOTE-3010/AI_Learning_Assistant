# AI Learning Assistant

A local-first academic artifact studio.

Generate homework code, essay PDFs, presentation slides, and dense cheat sheets
from a warm, editorial conversational workbench — powered by Qwen and delivered
through Docker Desktop.

---

## Overview

AI Learning Assistant is a teaching-oriented artifact generator. It takes a short
assignment description, optional reference files, and optional web search context,
then produces polished academic deliverables through four specialized pipelines:

| Artifact | Output Files | Generation |
| --- | --- | --- |
| **Homework Code** | `.py` or `.ipynb` | Direct model generation |
| **Essay** | `.html` + `.pdf` | Self-contained HTML → Playwright PDF |
| **Presentation Slides** | `.html` deck + `.pdf` | Slide HTML → Playwright PDF |
| **Dense Cheat Sheet** | `.html` + `.pdf` | Multi-column HTML → Playwright PDF |

The product surface is a split conversational workbench: a production console for
prompts and controls on the left, a persistent artifact preview panel on the right.
Users choose an artifact type explicitly, enter a task, optionally attach files, and
receive rendered output with syntax highlighting, inline HTML preview, or PDF pages.

The workbench supports English, Simplified Chinese, and Traditional Chinese.

## Architecture

```text
Browser / Electron ──HTTP/SSE──▶ Docker Container
                                       │
                                  FastAPI Backend
                                  ├── SQLite (metadata)
                                  ├── workspace/ (generated artifacts)
                                  ├── Playwright · Chromium (HTML → PDF)
                                  └── Qwen / OpenAI-compatible API
```

| Layer | Technology | Role |
| --- | --- | --- |
| Runtime | Python 3.12, FastAPI, Uvicorn | Backend API and pipeline orchestration |
| Storage | SQLite 3 via SQLAlchemy 2 | Local metadata (users, runs, artifacts) |
| Filesystem | `workspace/` on host | Generated source, PDFs, manifests, logs |
| Model | OpenAI-compatible client → Qwen | Configurable provider, base URL, model |
| PDF | Playwright headless Chromium | Self-contained HTML → print-quality PDF |
| Frontend | Vite 6, vanilla JS, CSS | Workbench renderer served at `/ui/` |
| Desktop | Electron 42 | Docker detection, window lifecycle |
| Auth | CUHK email (`@cuhk.edu.hk`) | Weak local auth, isolated for replacement |

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — the only host dependency.

### macOS One-Click

Double-click **`run_web.command`** in Finder. The launcher checks Docker, starts
the backend container, waits for health, and opens the workbench in your browser
at `http://127.0.0.1:14242/ui/`.

### Manual Launch

```bash
docker compose -p ai-learning-assistant up --build -d
curl -fsS http://127.0.0.1:14242/health
open http://127.0.0.1:14242/ui/
```

### Model Configuration

The workbench ships with non-secret Qwen defaults pre-filled. Provide your API key
through the in-app model settings editor, or pass it as an environment variable:

```bash
MODEL_API_KEY=sk-... docker compose -p ai-learning-assistant up --build -d
```

Real credentials are never committed. They live in untracked `.env` files, the
in-app editor, or the container-local `data/model-secrets.env`.

## Development

### Backend

```bash
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip
.venv/bin/python -m pip install -r backend/requirements-dev.txt
.venv/bin/python -m pytest backend/tests -q
```

### Frontend

```bash
npm --prefix frontend install
npm --prefix frontend run build
npm --prefix frontend run test
npm --prefix frontend run dev          # Vite dev server
```

### End-to-End Smoke

The smoke script uses a mocked model provider — no API credentials needed:

```bash
./scripts/smoke_e2e.sh
```

### Desktop Shell

```bash
npm --prefix apps/desktop run build
npm --prefix apps/desktop run smoke
```

## Project Layout

```text
backend/            FastAPI API, SQLite storage, artifact pipelines, model provider
  api/              HTTP routes: auth, settings, uploads, runs, courses
  core/             Business logic: auth, runs, model settings, artifact access
  pipelines/        Code homework, essay, slides, cheat sheet (all HTML-native)
  providers/        OpenAI-compatible and mock model providers
  context/          Upload extraction, search policy, context budgeting
  storage/          SQLite repositories
  artifacts/        Run folder creation, manifest writer, path safety

frontend/           Vite workbench renderer
  src/              App shell, design tokens, locale catalog, styles

apps/desktop/       Electron shell (Docker detection, health polling, window)

scripts/            macOS launchers, E2E smoke, bless utility
workspace/          Generated artifact output (gitignored)
data/               SQLite database, model secrets (gitignored)
docs/               Governance files (see below)
slides_html/        Reference slide deck layout vocabulary
```

## Governance

The project uses structured governance files so any agent or contributor can
understand the system without chat history:

| File | Purpose |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Entry point for AI agents — commands, layout, rules |
| [`docs/SPEC.md`](docs/SPEC.md) | Product intent, user workflows, acceptance criteria |
| [`docs/ARCH.md`](docs/ARCH.md) | Architecture, module boundaries, dependency rules |
| [`docs/RULES.md`](docs/RULES.md) | Coding, testing, security, and review rules |
| [`docs/CONTRACTS/`](docs/CONTRACTS/) | Stable API, data, and UI contracts |
| [`docs/DECISIONS/`](docs/DECISIONS/) | Architecture decision records (ADRs) |
| [`docs/IMPLEMENTATION_SUMMARY.md`](docs/IMPLEMENTATION_SUMMARY.md) | Development completion ledger |
| [`docs/QA_REPORTS/`](docs/QA_REPORTS/) | QA findings, fixes, and human decisions |

## License

MIT License. Created by CUHK Business School. All rights reserved.
