# Roadmap: Demo Branch Context Management Integration

## 1. Goal

Implement a **demo-branch-safe**, **one-pass** feature that adds:

- Multi-turn iterative assignment generation.
- LangChain-based context management behind interfaces.
- Explicit context window estimation output per generation job.
- Stack swappability via adapter + technical description, without changing orchestration flow.

This roadmap is intentionally scoped to the current `demo` branch baseline.

---

## 2. Constraints for Demo Branch

1. Keep existing API routes and frontend contract stable unless required by this feature.
2. Avoid broad refactors from `main`; migrate only feature-critical code.
3. Preserve existing defaults in `backend/core/config.py` (model and database defaults), then add new context controls.
4. Keep PDF conversion behavior unchanged in demo to reduce integration risk.
5. Treat frontend-demo regressions as first-class acceptance criteria for this feature.

---

## 3. Target Files and Required Changes

## 3.1 New Module (Add)

Create and wire a decoupled iterative module in:

- `backend/app/iterative_generation/__init__.py`
- `backend/app/iterative_generation/contracts.py`
- `backend/app/iterative_generation/prompt_schema.py`
- `backend/app/iterative_generation/orchestrator.py`
- `backend/app/iterative_generation/adapters.py`

### Required capabilities

- Prompt contract dataclasses and interfaces (`ContextManager`, `PromptCompiler`, `ModelGateway`, `TokenEstimator`, `TelemetrySink`).
- LangChain context adapter as default.
- Native adapter scaffold for future swap validation.
- Token estimator with section-level breakdown and utilization ratio.
- Orchestrator guardrails (`ok`, `warning`, `critical`) and retry guidance fallback.
- In-memory telemetry sink with `context_window_estimate` events.

## 3.2 Existing Backend Integration (Update)

- `backend/app/standard_answer_generator.py`
  - Replace single-shot prompt with sectioned prompt orchestration.
  - Inject iterative generation pipeline.
  - Keep existing output conversion behavior for demo compatibility.
  - Add `return_details=True` support to return context telemetry to caller.

- `backend/main.py`
  - In generation job worker, call iterative generator with `return_details=True`.
  - Store latest context estimate in in-memory map by `job_id`.
  - Extend `/jobs/{job_id}` response to include `context_window_estimate`.
  - Add `iteration_turns` form field to `/generate-answer`.

- `backend/core/config.py`
  - Add:
    - `CONTEXT_ADAPTER`
    - `ITERATION_TURNS`
    - `CONTEXT_WINDOW_LIMIT`
    - `TARGET_OUTPUT_TOKENS`
  - Do not change existing demo-specific defaults unrelated to this feature.

- `backend/requirements.txt`
  - Keep resolver-stable versions for demo integration.
  - Ensure iterative module imports are satisfied without long dependency backtracking.

## 3.3 Frontend and Static Runtime Integration (Update)

- `frontend/src/app.js`
  - Ensure assignment list filtering is type-safe (`course_id` comparison).
  - Unhide newly created assignment IDs from local hidden cache when reused.
  - Add persistent context-window panel updater with:
    - local estimate fallback
    - backend polling override from `/jobs/{job_id}.context_window_estimate`
  - Clear `custom-question` and file attachment label/input after generation request is accepted.

- `frontend/index.html`
  - Add persistent context-window panel container and fields:
    - source, warning level, estimated input, estimated total, limit, utilization.

- `backend/static/index.html` and `backend/static/assets/*`
  - Rebuild frontend bundle so `/ui` serves latest behavior.
  - Do not leave source and static runtime out of sync.

---

## 4. Prompt Contract for Iterative Pipeline

Use immutable sections:

- `task_definition`
- `technical_description`
- `iteration_state`
- `quality_bar`
- `output_contract`
- `context_bundle`

Swappability rule:

- Stack swap should require only:
  - adapter selection/config change
  - technical description text change
- Must not require orchestrator flow rewrite.

---

## 5. Implementation Sequence (One Pass)

1. Add iterative contracts/schema/orchestrator/adapters module.
2. Add config constants and dependency entries.
3. Refactor standard answer generator to use orchestrator.
4. Update background job path and job status response in `main.py`.
5. Apply frontend regression fixes (assignment visibility, persistent context panel, input clearing).
6. Build frontend into backend static runtime.
7. Run lightweight verification commands for import/runtime sanity.

---

## 6. Verification Checklist

Run in demo branch after implementation:

1. Install dependencies from `backend/requirements.txt`.
2. Start backend and trigger one generation request with `iteration_turns=3`.
3. Query `/jobs/{job_id}` and verify:
   - `status` returns normally.
   - `context_window_estimate` exists and includes:
     - `estimated_input_tokens`
     - `estimated_output_tokens`
     - `estimated_total_tokens`
     - `context_window_limit`
     - `utilization_ratio`
     - `safety_margin_tokens`
     - `warning_level`
4. Validate frontend behavior in `/ui`:
   - Creating assignment shows it immediately in sidebar.
   - Context window panel is visible persistently and updates during polling.
   - Input box and attachment label clear after request acceptance.
5. Rebuild frontend and verify `backend/static/index.html` references current asset bundle.
6. Confirm existing output formats still work as before.

---

## 7. Risks and Mitigations (Demo-Scoped)

- **Risk:** Merge conflicts in `main.py` and `standard_answer_generator.py`  
  **Mitigation:** perform manual integration, keep non-feature logic unchanged.

- **Risk:** LangChain dependency mismatch in local demo environment  
  **Mitigation:** pin minimum versions and verify imports before runtime.

- **Risk:** Context estimate not visible to frontend polling path  
  **Mitigation:** include estimate directly in `/jobs/{job_id}` response payload.

- **Risk:** Frontend source fixes not reflected in `/ui` runtime  
  **Mitigation:** enforce `frontend` build step and verify updated static asset reference in `backend/static/index.html`.

- **Risk:** Assignment created but hidden due to stale local hide cache or id-type mismatch  
  **Mitigation:** normalize id comparison and unhide newly created assignment ID after successful create.

---

## 8. Definition of Done

Done when all are true:

1. Demo backend uses iterative context pipeline through adapters.
2. Generation job response explicitly returns context-window estimate data.
3. Feature runs end-to-end without requiring main-branch-only refactors.
4. Frontend `/ui` shows persistent context panel and clears input after accepted generation request.
5. Assignment creation is immediately visible in sidebar after integration run.
6. Stack swap path remains open via adapter/config and technical description updates.
