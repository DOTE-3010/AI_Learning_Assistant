<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Architecture

## Architecture Summary

The rebuild uses a local-first architecture: Electron provides the desktop shell, a web renderer provides the artifact studio UI, Docker Desktop runs the backend/runtime container, SQLite stores local metadata, and generated artifacts are written to explicit filesystem folders.

The system is intentionally portable. The same API, storage interfaces, and artifact contracts should later support a native no-Docker desktop build or a hosted server deployment without rewriting product logic. The shell talks to the backend only over HTTP/SSE so the runtime underneath can change.

```text
[Electron shell]  --detect/start-->  [Docker Desktop]
       |                                   |
       | loads window                      | docker compose up
       v                                   v
[Web Workbench] --HTTP/SSE--> [Backend API container]
                                   |--> SQLite file (metadata)
                                   |--> workspace/ (artifact bytes)
                                   |--> Qwen / OpenAI-compatible API
                                   |--> optional web search
                                   |--> LaTeX toolchain (in container)
```

## Technology Stack

Major versions below are the supported baseline; exact patch versions live in lockfiles (`backend/requirements*.txt`, `frontend/package-lock.json`, `apps/desktop/package-lock.json`).

- Runtime/language: Python 3.12 (backend), Node.js 22 LTS (frontend build + Electron).
- Backend framework: FastAPI with Uvicorn; Pydantic v2 for request/response models.
- Storage: SQLite via SQLAlchemy 2.x (stdlib `sqlite3` driver). No Postgres/Mongo in the local runtime.
- Frontend: Vite 6 + vanilla/lightweight component layer (no heavy admin-dashboard kit); CSS-driven visual system.
- Desktop shell: Electron 33 (Chromium renderer + Node main process), packaging via electron-builder (future-phase).
- Model client: `openai` Python SDK in OpenAI-compatible mode, pointed at a configurable Qwen base URL.
- Document tooling: TeX Live 2024 (scheme-medium) + `latexmk` inside the container for LaTeX/PDF; `nbformat` for `.ipynb` validation; `pypdf` for PDF text extraction (OCR/scanned PDFs are out of scope in phase 1).
- Web search: pluggable provider behind an adapter; concrete provider is an open question (see below).
- Container runtime: Docker Desktop (Compose v2) as the only host prerequisite for the packaged build.

## Module Boundaries

| Module | Owns | Must Not Own | Initial Location | Key Contracts |
| --- | --- | --- | --- | --- |
| Desktop Shell | Electron startup, Docker Desktop detection, backend health polling, window lifecycle, reveal-in-folder | Backend business logic, Python imports, SQLite access, model calls | `apps/desktop/` | `runtime-electron-docker.md` |
| Web Workbench | Artifact studio UI, upload controls, model settings UI, context dial, run preview, client state | Local secrets, direct filesystem/SQLite access, token-generation internals | `frontend/` | `ui-workbench.md`, `visual-assets.md` |
| API Backend | HTTP routes, auth/session, run orchestration, request validation, static serving | SQL details, LaTeX internals, Electron lifecycle, raw secret persistence | `backend/` | `auth.md`, `generation-pipeline.md`, `errors.md` |
| Storage Layer | SQLite repositories, migrations, transactions for users/sessions/settings/runs/uploads/artifacts/citations | HTTP shapes, business rules, artifact bytes, prompt content | backend storage package | `sqlite-schema.md` |
| Artifact Filesystem | Run/project folder creation, safe filenames, manifests, PDF/source persistence | Metadata-of-record (rows), HTTP concerns, model calls | backend artifact package | `artifact-filesystem.md` |
| Model Provider | OpenAI-compatible client, profile validation, secret loading, redaction | Pipeline/business logic, HTTP routes, SQLite schema | backend provider package | `model-settings.md` |
| Context Builder | File extraction, context-budget estimation, web-search policy decision | Artifact generation, model-call orchestration, UI rendering | backend context package | `generation-pipeline.md`, `uploads.md` |
| Artifact Pipelines | Code/essay/Beamer/cheat-sheet generation + repair, intent routing | Secret loading, Electron internals, HTTP transport, raw SQL | backend pipeline package | `generation-pipeline.md`, `artifact-filesystem.md` |

Legacy modules under `backend/` and `frontend/` are not authoritative if they conflict with these boundaries. They may be deleted, moved, or mined for useful parsing/LaTeX patterns during scoped tasks.

## Canonical Phase-1 Layout

The first rewrite keeps the existing `backend/` and `frontend/` roots to reduce migration noise. Electron is the only new top-level app root.

```text
backend/            FastAPI API/runtime and backend modules
frontend/           Vite web workbench renderer
apps/desktop/       Electron shell
workspace/          generated artifacts
data/               local SQLite and runtime metadata when mounted on host
docs/               governance, contracts, task queue, decisions, asset briefs
```

Do not create `apps/web/` or `services/api/` during phase 1. If a later task wants that layout, it must add a decision record and update this file, `AGENTS.md`, and affected task verification commands first.

## Data Model

- `users`, `sessions` -- identity and weak local auth.
- `model_profiles` -- provider profile metadata; secret material is referenced, never stored raw (see `model-settings.md` and `docs/DECISIONS/004-local-secret-storage.md`).
- `projects`, `runs` -- generation requests and their lifecycle/status.
- `uploads` -- references to user-supplied input bytes on disk.
- `artifacts`, `citations` -- references to generated output files and recorded sources.

Source of truth for metadata is the SQLite file. Source of truth for bytes (uploads, generated source, PDFs, notebooks, logs, manifests) is the artifact filesystem. See `docs/CONTRACTS/sqlite-schema.md` and `docs/CONTRACTS/artifact-filesystem.md`.

## Interfaces

- Internal: pipelines depend on the Model Provider interface and Artifact Filesystem writer, never on env vars or HTTP objects directly.
- External APIs: REST under `/api`, SSE/polling for run status. See `docs/CONTRACTS/auth.md`, `docs/CONTRACTS/model-settings.md`, `docs/CONTRACTS/generation-pipeline.md`, `docs/CONTRACTS/uploads.md`.
- Error envelope: every API error uses the canonical shape in `docs/CONTRACTS/errors.md`.
- Files/artifacts: run folder shape and `manifest.json` per `docs/CONTRACTS/artifact-filesystem.md`.
- Desktop/runtime: Electron-to-backend handshake and startup states per `docs/CONTRACTS/runtime-electron-docker.md`.

## Dependency Rules

- Electron may depend on Docker CLI/Compose availability and backend HTTP health endpoints; it must not import backend Python code.
- Web UI may call backend APIs and consume server-sent events or polling; it must not read local secrets directly.
- Backend owns SQLite, filesystem artifacts, model provider calls, web search, and LaTeX compilation.
- SQLite stores metadata only. Large uploads, generated source, notebooks, PDFs, logs, and manifests stay on disk.
- Model provider code must depend on an abstract provider profile, not hard-coded Bianxie/OpenAI/Qwen constants.
- Pipeline code may call context builder, artifact writer, and model provider; it must not know Electron internals.
- Context Builder may read uploads through the storage/filesystem layer; it must not generate final artifacts.

## Runtime Topology

```text
Electron shell
  -> starts/checks Docker Desktop
  -> docker compose up local services
  -> opens Web Workbench window
Web Workbench
  -> HTTP/SSE calls to Backend API
Backend API container
  -> SQLite volume/file
  -> workspace/output volume
  -> Qwen/OpenAI-compatible remote API
  -> optional web search
  -> local LaTeX toolchain inside container
```

Future runtimes must preserve the same contracts:

- Native desktop may replace Docker with bundled backend binaries.
- Hosted server may replace SQLite repositories with Postgres repositories.
- Signed macOS `.app` may reuse Electron shell and artifact contracts.

## Operational Concerns

- Configuration: backend reads runtime config from environment variables; local development values live in untracked `.env`/`.env.local`. Model variables use the `MODEL_*` names in `model-settings.md` (legacy `BIANXIE_*` names are not canonical). No secrets in tracked source.
- Observability: structured logs to stdout from the container; run progress is exposed via the status event shape in `generation-pipeline.md`. API keys, Authorization headers, raw prompts, and uploaded document contents are never logged by default.
- Failure handling: web-search and PDF-compile failures are non-fatal unless the user forced the behavior; failures are recorded in run metadata and `manifest.json` with a sanitized message. `.tex` source is always preserved even when PDF compilation fails.
- Backups/migrations: SQLite uses explicit, forward-only schema migrations with a `schema_version`; the database file and `workspace/` are the two artifacts a user must back up. Both must survive container/app restarts.
- Security: weak auth is local/teaching only and isolated behind middleware so stronger auth can replace it; tokens are opaque to clients; secret storage follows `docs/DECISIONS/004-local-secret-storage.md`.

## Migration Strategy

1. Establish contracts and task queue.
2. Introduce new storage and settings foundations alongside or in place of legacy code.
3. Build generation pipeline contracts and one pipeline at a time.
4. Replace UI with the new workbench.
5. Add Electron shell and Docker runtime management.
6. Remove legacy Postgres/Mongo/course/chat surfaces after their replacements are verified.

## Tradeoffs

- **SQLite over Postgres/Mongo**: chosen for the local desktop product because it removes Docker services, improves portability, and matches single-user/offline usage. Hosted scale is deferred. See `docs/DECISIONS/001-local-sqlite-default.md`.
- **Electron + Docker Desktop over native bundling**: accepted for speed and runtime consistency even though it is not the final native distribution. See `docs/DECISIONS/002-electron-docker-first.md`.
- **OpenAI-compatible Qwen client over native SDK**: keeps provider code small and portable. See `docs/DECISIONS/003-qwen-provider-default.md`.
- **Artifact-specific pipelines over one generic endpoint**: trades more pipeline code for reliable, intent-shaped outputs.

Rejected alternatives:

- Keeping the legacy role/course/chat model as the product center -- rejected because artifact generation, not classroom administration, is the product.
- Storing generated PDFs/notebooks in the database -- rejected because artifacts must stay portable on disk.

## Open Technical Questions

- Exact default Qwen model id and base URL must be verified against current official documentation before implementation (mirrors `docs/SPEC.md` open question).
- Concrete web-search provider and its rate/cost limits are undecided; the adapter boundary lets the choice land later.
- Whether SQLite secret columns should be encrypted at rest in phase 1 or deferred to an OS keychain in a later phase (see `docs/DECISIONS/004-local-secret-storage.md`).
- Background execution model for runs (in-process tasks vs a worker) may evolve; the status event contract must stay stable regardless.
