# Roadmap for Solver#42

## 1. Scope & Assumptions

### In-Scope
- Local-first MVP runnable on a single machine.
- Teacher/student role assignment by CUHK email domain.
- Teacher generation workflow with web-augmented LLM context.
- Async job execution with status polling.
- Dual-write persistence:
  - metadata in PostgreSQL
  - artifacts/logs in MongoDB
  - generated files in local `workspace/`
- Static web UI served by backend.
- One-click startup flow for non-technical demo users.

### Out-of-Scope
- Production-grade auth (JWT refresh, OAuth, SSO).
- Multi-tenant security hardening and audit compliance.
- Cloud deployment, autoscaling, CI/CD pipelines.
- Advanced frontend framework migration.
- Full grading pipeline and LMS integration.
- Deterministic LLM outputs across internet changes.

### Assumptions
- Docker Desktop is installed and usable.
- Python 3.11 is available.
- Internet access is available for DuckDuckGo and LLM API calls.
- Valid LLM API credentials are available.
- Demo runs on macOS-like local environment.

---

## 2. Environment Lock

- OS: macOS (Darwin)
- Python: 3.11.x
- Docker: Docker Desktop with Compose support
- PostgreSQL: 15
- MongoDB: 6
- Backend framework: FastAPI
- ORM: SQLAlchemy
- Search: `duckduckgo-search`
- LLM SDK: OpenAI-compatible client

### Fixed Ports
- Backend: `14242`
- PostgreSQL: `15432`
- MongoDB: `27017` (or explicit mapped value in compose)

### Directory Convention
- Project root: `<repo_root>/`
- Backend code: `<repo_root>/backend/`
- Local output: `<repo_root>/workspace/{Course}/{Assignment}/`
- Startup script: `<repo_root>/start_mvp.command`

### Environment Variables (example)
- `BIANXIE_API_KEY` (required) = `sk-xxxx`
- `BIANXIE_BASE_URL` (required) = `https://...`
- `BIANXIE_MODEL` (required) = `...`
- `DATABASE_URL` (required) = `postgresql+psycopg2://...`
- `MONGODB_URL` (required) = `mongodb://...`
- `APP_PORT` (optional) = `14242`

---

## 3. Phase Plan

### Phase 1: Core Generation Engine

- Goal:
  - Build the minimal LLM generation pipeline with web-context injection and multi-format output normalization.

- Inputs:
  - PRD feature requirements for teacher generation.
  - LLM API credentials and model selection.
  - Search integration requirement (Top-3 web context).

- Tasks (max 7):
  1. Implement LLM client wrapper using OpenAI-compatible interface.
  2. Implement `StandardAnswerGenerator` orchestration logic.
  3. Implement `perform_web_search` for query extraction and result cleanup.
  4. Define output formatter for `.md`, `.py`, `.ipynb`.
  5. Add minimal error handling for API/search failures.
  6. Add CLI invocation path for local smoke testing.

- Outputs/Artifacts:
  - `backend/app/standard_answer_generator.py`
  - CLI smoke-run script (or callable entrypoint)
  - Structured output format contract (internal)

- Interface Contract (API/schema/state flow):
  - Input: `{prompt, format, optional_file_context}`
  - Output: `{content, format, source_context, token_usage_estimate, error?}`
  - Failure modes: `llm_unavailable`, `search_timeout`, `format_conversion_error`

- Gate Checks (command + expected result):
  - Run CLI generation command -> returns non-empty content in requested format.
  - Force no-search mode (or simulate search failure) -> generation still succeeds with fallback prompt context.

- Risks:
  - Search latency causes timeout spikes.
  - LLM response may violate expected format blocks.

- Rollback/Recovery:
  - Disable web search and run prompt-only generation path.
  - Force output to markdown when format conversion fails.

- Handoff Notes:
  - Keep generator entrypoint stable; downstream API layer must call one canonical method.
  - Preserve output object keys exactly for persistence phase.

---

### Phase 2: Hybrid Persistence Layer

- Goal:
  - Persist metadata, documents, and local files with a clear separation of concerns.

- Inputs:
  - Phase 1 generation output schema.
  - Data entities required by PRD (User, Course, Assignment, GenerationJob).

- Tasks (max 7):
  1. Define SQLAlchemy models for relational metadata.
  2. Implement Postgres engine/session setup.
  3. Implement Mongo client and `artifacts` write logic.
  4. Implement local file writer with deterministic path strategy.
  5. Add `GenerationJob` status fields and timestamps.
  6. Add persistence transaction flow (best-effort dual write with error capture).

- Outputs/Artifacts:
  - `backend/app/database.py`
  - `backend/models/*`
  - `docker-compose.yml`
  - Local file persistence utility

- Interface Contract (API/schema/state flow):
  - Job states: `queued -> running -> succeeded | failed`
  - SQL stores: user/course/assignment/job metadata
  - Mongo stores: generated body, context, logs
  - Filesystem stores: final export files in `workspace/`

- Gate Checks (command + expected result):
  - Start databases via compose -> both services become healthy.
  - Execute one generation persistence path -> SQL row created, Mongo doc inserted, local file exists at expected path.

- Risks:
  - Dual-write partial failure creates inconsistency.
  - Path naming collisions in repeated runs.

- Rollback/Recovery:
  - Mark job as `failed` with reason if any storage target fails.
  - Retry failed storage step with same `job_id` idempotency key.

- Handoff Notes:
  - API layer must only consume persistence via service functions, not direct DB calls.
  - Keep job status transitions centralized.

---

### Phase 3: API Service and Auth

- Goal:
  - Expose HTTP APIs for auth, generation submission, and job status polling.

- Inputs:
  - Stable generator and persistence services from Phases 1-2.
  - Role rules from PRD domain-based auth.

- Tasks (max 7):
  1. Initialize FastAPI app and CORS policy.
  2. Implement email-based auth middleware.
  3. Implement role mapping:
     - `@cuhk.edu.hk` -> teacher
     - `@link.cuhk.edu.hk` -> student
  4. Implement generation submit endpoint with `BackgroundTasks`.
  5. Implement job status endpoint.
  6. Implement upload-file parsing and context merge.
  7. Add consistent error responses.

- Outputs/Artifacts:
  - `backend/main.py`
  - API endpoint set for submit/status/auth checks
  - Error response schema

- Interface Contract (API/schema/state flow):
  - `POST /api/generate` -> returns `job_id`
  - `GET /api/jobs/{job_id}` -> returns state and result/error
  - Auth token: base64 email (demo-only)
  - Authorization: teacher can generate; student restricted

- Gate Checks (command + expected result):
  - Submit generation as teacher -> receives valid `job_id`, job reaches `succeeded` or documented `failed`.
  - Submit generation as student -> receives permission denial response.

- Risks:
  - Background task crashes may leave stale `running` jobs.
  - Uploaded file parsing edge cases break prompt assembly.

- Rollback/Recovery:
  - Add startup reconciliation: stale `running` -> `failed` with system reason.
  - If upload parsing fails, continue with text-only prompt and warning.

- Handoff Notes:
  - Frontend assumes stable response keys for job polling.
  - Keep endpoint names unchanged after this phase.

---

### Phase 4: Static Frontend & UX

- Goal:
  - Deliver minimal usable UI for role-aware generation and status polling.

- Inputs:
  - API contracts finalized in Phase 3.
  - Required UI interactions from PRD.

- Tasks (max 7):
  1. Serve static assets from backend.
  2. Build single-page UI layout (navigation + interaction panel).
  3. Implement login/session handling using demo token strategy.
  4. Implement generate flow: submit -> poll -> render output.
  5. Implement file upload interaction path.
  6. Implement teacher/student view restrictions.
  7. Add basic error and loading states.

- Outputs/Artifacts:
  - `backend/static/index.html`
  - frontend JS polling logic
  - role-based UI behavior

- Interface Contract (API/schema/state flow):
  - UI depends on `job_id`, `state`, `result`, `error`.
  - Polling interval default: 1 second.
  - Student mode hides or disables generation action.

- Gate Checks (command + expected result):
  - Open `/ui` -> page loads without JS runtime errors.
  - Generate from UI as teacher -> result appears and corresponding local file exists.

- Risks:
  - Polling loop leakage on repeated submissions.
  - UI assumptions drift from backend response shape.

- Rollback/Recovery:
  - If JS polling fails, expose manual refresh button for job status.
  - If role detection fails, default to safest (student) mode.

- Handoff Notes:
  - Packaging phase should not alter API routes used by frontend.
  - Keep static asset paths stable.

---

### Phase 5: Local Packaging & Demo Launch

- Goal:
  - Enable one-click local startup and reproducible demo run.

- Inputs:
  - Working backend, DB compose, and frontend from previous phases.

- Tasks (max 7):
  1. Finalize `start_mvp.command` orchestration.
  2. Add Docker startup checks and health wait.
  3. Add Python venv bootstrap and dependency install flow.
  4. Launch `uvicorn` on fixed port.
  5. Auto-open browser to `/ui`.
  6. Add startup diagnostics for common failures.
  7. Validate persistence survives restart.

- Outputs/Artifacts:
  - `start_mvp.command`
  - `demo_launcher.py`
  - startup logs/messages for troubleshooting

- Interface Contract (API/schema/state flow):
  - Startup sequence:
    1) infra ready
    2) app ready
    3) browser open
  - Exit behavior should expose actionable error causes.

- Gate Checks (command + expected result):
  - Run startup script on clean machine state -> all required services become reachable.
  - Restart machine/services and rerun -> prior DB/workspace data remains accessible.

- Risks:
  - Docker Desktop not running blocks startup.
  - Dependency install drift breaks launcher reliability.

- Rollback/Recovery:
  - If compose fails, print exact service health and stop early.
  - If venv install fails, print missing tool hint and retry command.

- Handoff Notes:
  - This is the final handoff phase; keep script output user-readable.
  - Avoid hidden assumptions outside documented env variables.

---

## 4. Integration & E2E

### Integration Sequence
1. Validate generator standalone.
2. Attach persistence services.
3. Expose generation via API.
4. Connect static frontend to APIs.
5. Validate startup packaging and persistence restart behavior.

### Minimum End-to-End User Flow
1. User opens `/ui`.
2. User logs in with CUHK email token.
3. Teacher submits question (optional file upload).
4. Backend creates job and returns `job_id`.
5. Frontend polls job status until `succeeded`.
6. Result displayed in UI and file written to `workspace/`.
7. Metadata visible via DB records (job state, timestamps, usage estimate).

### Verification Commands and Pass Criteria
- Infra up command -> Postgres + Mongo healthy.
- App launch command -> backend responds on `http://localhost:14242`.
- API smoke call for generate/status -> valid JSON and state progression.
- UI flow smoke test -> successful render and persisted artifact.
- Restart verification -> previous data still present.

Pass criteria: all checks pass without manual code edits during run.

---

## 5. Reproducibility Checklist

### Fresh-Machine Rerun Steps
1. Install Docker Desktop and Python 3.11.
2. Clone repository.
3. Configure required environment variables.
4. Run one-click startup script.
5. Open UI and perform one teacher generation.
6. Confirm SQL/Mongo/file outputs are all present.
7. Restart services and repeat one generation to validate persistence.

### Common Failures & Troubleshooting
- Docker unavailable:
  - Start Docker Desktop and rerun launcher.
- Port conflict:
  - Verify fixed ports are free or adjust mapping in one place only.
- LLM auth failure:
  - Re-check API key/base URL/model env vars.
- Search timeout:
  - Retry once; fallback to no-search generation path.
- DB connection error:
  - Verify compose service health and connection strings.

### Definition of Done (all must pass)
- One-click startup succeeds on a fresh machine.
- Teacher can submit and receive generation output.
- Student role cannot access restricted generation action.
- Each successful job produces:
  - SQL metadata
  - Mongo artifact/log
  - local file in `workspace/`
- System remains functional after restart with persisted data intact.