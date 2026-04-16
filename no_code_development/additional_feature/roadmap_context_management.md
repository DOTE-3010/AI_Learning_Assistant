# Roadmap: Context Management and Iterative Generation (One-Pass)

## 1) Goal and Constraints

This roadmap defines a **single implementation run** to deliver multi-turn iterative assignment generation with explicit context-window statistics, while preserving existing behavior and minimizing unrelated refactors.

Hard constraints for this run:
- Keep architecture decoupled via interfaces in `backend/app/iterative_generation/contracts.py`.
- Use LangChain as default context manager (`CONTEXT_ADAPTER=langchain`) while preserving swappability (`native` or future adapters).
- Preserve current API behavior unless changes are strictly required for this feature.
- Ensure integrated `/ui` demo flow regressions are prevented:
  1. New assignments appear immediately in sidebar.
  2. Context-window statistics panel is persistently visible and updated by local estimate + backend polling.
  3. Input box and attachment label clear after generation request is accepted.
  4. Frontend source changes are built into backend static assets served at `/ui`.

## 2) Current-Codebase Fit (Why this is low-risk)

The codebase already contains the core building blocks:
- Adapter contracts and orchestrator: `backend/app/iterative_generation/contracts.py`, `orchestrator.py`, `adapters.py`.
- Generation pipeline entrypoint: `backend/app/standard_answer_generator.py`.
- Job polling endpoint with estimate field: `backend/main.py` (`/jobs/{job_id}`).
- Demo UI flow and local estimate logic: `frontend/src/app.js`.
- Frontend build output directly to backend static directory: `frontend/vite.config.js` (`outDir` -> `../backend/static`).

Therefore the implementation run should focus on **hardening and wiring completeness**, not broad redesign.

## 3) One-Pass Implementation Plan (File-Level)

### Phase A - Backend context-window telemetry contract hardening

#### A1. `backend/app/iterative_generation/contracts.py`
- Add explicit typed shape for context-window telemetry payload (either dedicated dataclass or documented dict schema near `TokenEstimate`).
- Keep existing interfaces (`ContextManager`, `PromptCompiler`, `ModelGateway`, `TokenEstimator`, `TelemetrySink`) unchanged to preserve adapter swappability.
- No API-facing schema changes here.

#### A2. `backend/app/iterative_generation/orchestrator.py`
- Keep existing turn loop and warning-level thresholds.
- Ensure each turn emits telemetry payload with stable keys used by UI/backend:
  - `estimated_input_tokens`
  - `estimated_output_tokens`
  - `estimated_total_tokens`
  - `context_window_limit`
  - `utilization_ratio`
  - `safety_margin_tokens`
  - `warning_level`
  - `section_breakdown`
- Keep compression flow (`warning`/`critical`) and retry guidance behavior unchanged.
- Avoid changing turn semantics or output contract behavior.

#### A3. `backend/app/iterative_generation/adapters.py`
- Keep `LangChainContextAdapter` as default-ready implementation.
- Preserve `NativeAPIContextAdapter` as swappable fallback.
- Confirm no direct coupling from adapter internals to API layer.
- Keep compression behaviors adapter-specific to maintain stack swappability.

### Phase B - Stack swappability and technical-description swap point

#### B1. `backend/app/standard_answer_generator.py`
- Keep adapter selection centralized in `_select_context_adapter()`.
- Keep `technical_description` generation as swap point (`_technical_description_for(output_format, adapter_name)`), so stack changes can be reflected without touching orchestrator or API routes.
- Preserve return shape when `return_details=True`; continue surfacing latest `context_window_estimate`.
- Do not alter public function signature of `generate_answer_logic(...)`.

#### B2. `backend/core/config.py`
- Keep `CONTEXT_ADAPTER` environment switch and defaults.
- Ensure default remains `"langchain"` to satisfy feature requirement.
- No unrelated config refactors.

### Phase C - API integration (behavior-preserving)

#### C1. `backend/main.py`
- Keep existing endpoints and request/response structure.
- Confirm `process_generation_job(...)` stores latest estimate in `JOB_CONTEXT_ESTIMATES[job_id]`.
- Keep `/jobs/{job_id}` response backward-compatible and include `context_window_estimate` (already present).
- Preserve `POST /generate-answer` behavior; only ensure estimate lifecycle is reliable:
  - initialize estimate slot when queued/running,
  - update when generation returns details,
  - clear on failure.
- No new route required; no breaking shape changes.

### Phase D - Demo UI regression prevention and persistent stats UX

#### D1. `frontend/src/app.js` (assignment immediacy)
- Keep optimistic/near-immediate assignment refresh path in `createAssignment()`:
  - close modal,
  - clear fields,
  - `await loadAssignments()` immediately.
- Ensure no later async call overwrites this state unexpectedly.

#### D2. `frontend/src/app.js` (persistent context panel)
- Keep panel always visible via `updateContextWindowPanel(...)` + `refreshPersistentContextEstimate()`.
- Ensure local estimate updates on:
  - custom question input,
  - file select change,
  - output format change,
  - post-request input clearing.
- Keep backend polling override in `pollJob(jobId)`:
  - if backend estimate exists -> display source `BACKEND`,
  - else -> fallback to local estimate (`LOCAL`).

#### D3. `frontend/src/app.js` (clear inputs after acceptance)
- In `generateAnswer()`, preserve clearing logic only after backend accepted request (`data.job_id` exists):
  - clear `custom-question`,
  - clear file input,
  - reset attachment label text + style.
- Keep this behavior tied to acceptance to avoid data loss on failed requests.

#### D4. `frontend/src/styles.css` (if needed)
- Only add/adjust styles required for persistent context panel readability.
- No broad theme/layout refactor.

### Phase E - Static asset integration for `/ui`

#### E1. `frontend/vite.config.js`
- Keep build target:
  - `base: "/ui/"`
  - `outDir: "../backend/static"`
  - `emptyOutDir: true`
- This guarantees frontend source changes are deployed into backend static assets used by `/ui`.

#### E2. Build outputs (generated, not hand-edited)
- Regenerate:
  - `backend/static/index.html`
  - `backend/static/assets/*`
- Do not manually edit compiled asset files.

## 4) Dependency and Tooling Updates

### Backend (`backend/requirements.txt`)
- Ensure `langchain-core` remains present and pinned (currently `langchain-core==1.2.27`) because `LangChainContextAdapter` relies on it.
- No additional dependency is required for this feature unless adapter strategy changes.

### Frontend (`frontend/package.json`)
- Keep existing scripts (`dev`, `build`, `preview`).
- No package additions required for this run.

## 5) Single-Run Execution Order (Implementation + Build)

Run in this exact order to complete in one pass:

1. Implement backend hardening updates:
   - `contracts.py`, `orchestrator.py`, `adapters.py`, `standard_answer_generator.py`, `main.py`, and config checks.
2. Implement frontend regression-prevention updates:
   - `frontend/src/app.js` (and `styles.css` only if needed).
3. Install/update dependencies once:
   - `pip install -r backend/requirements.txt`
   - `cd frontend && npm install` (or `npm ci` in CI).
4. Build frontend into backend static:
   - `cd frontend && npm run build`
5. Start app stack and run integrated verification:
   - via existing local launcher or `uvicorn` flow.

## 6) Verification Checklist (Must Pass in Same Run)

### Backend verification
- `GET /health` returns OK.
- Trigger generation job and poll `/jobs/{job_id}`:
  - `context_window_estimate` appears when available.
  - status transitions `queued -> running -> succeeded/failed` remain unchanged.
- Non-estimate API fields remain backward-compatible.

### Frontend regression verification (required)
- **R1 Assignment sidebar immediacy**
  - Create assignment in selected course.
  - Confirm new assignment appears in sidebar immediately without manual refresh.

- **R2 Persistent context-window panel**
  - Before generation: panel visible with `LOCAL` estimate.
  - During polling: panel updates to `BACKEND` estimate when available.
  - If backend estimate absent: panel remains visible and uses `LOCAL` estimate fallback.

- **R3 Input/attachment clearing on acceptance**
  - Submit generation request with custom text + file.
  - After request accepted (`job_id` received), confirm:
    - custom input is empty,
    - file input is cleared,
    - attachment label resets to default.

- **R4 `/ui` static asset integration**
  - After frontend source edit + `npm run build`, open `/ui`.
  - Confirm new UI behavior is present (not stale old bundle).

### Non-regression checks
- Existing auth flow (`register/login`) still works.
- Course creation and assignment selection still work.
- Generation completion still renders final output in chat.

## 7) Rollout Strategy

### Local rollout
- Execute full one-pass implementation and verification on local dev environment first.
- Keep `CONTEXT_ADAPTER=langchain` default.
- Optionally run one smoke pass with `CONTEXT_ADAPTER=native` to validate swap safety.

### Release rollout
- Ship backend + rebuilt static assets together (single deploy unit), preventing `/ui` mismatch.
- Maintain API compatibility; no frontend contract migration required.

### Rollback plan
- Revert to previous commit/deploy artifact if:
  - `/jobs/{job_id}` polling breaks,
  - context panel becomes non-persistent,
  - `/ui` serves stale or broken assets.
- Since changes are localized, rollback scope is limited to touched files and generated static assets.

## 8) Definition of Done

Feature is complete when all are true:
- Multi-turn iterative generation runs through orchestrator with adapter-based context management.
- LangChain remains default context adapter; native adapter remains viable via configuration.
- Technical-description swap point remains centralized and adapter-aware.
- Context-window stats are visible in UI and update from both local estimate and backend polling.
- All four required demo-flow regressions are explicitly prevented and verified.
- Frontend source updates are reflected in backend static assets served from `/ui`.
