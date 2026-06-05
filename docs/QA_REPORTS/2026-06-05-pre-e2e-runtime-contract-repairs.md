<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# QA Report: Pre-E2E Runtime And Contract Repairs

## Scope

- Task file: `docs/TASKS/001-pre-e2e-runtime-contract-repairs.md`
- Modules covered: backend CORS middleware, generation pipeline contract wording, Docker Compose host port mapping, mocked E2E smoke script, QA task queue.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests -q` | Passed before fix | Baseline backend suite passed: `63 passed`. |
| `npm --prefix frontend run test` | Passed before fix | Baseline frontend tests passed: `5 passed`. |
| `./scripts/smoke_e2e.sh` | Failed before fix | Reproduced the known port blocker: Docker could not bind `0.0.0.0:14242` while the product container was already using it. |
| `.venv/bin/python -m pytest backend/tests/test_cors.py -q` | Passed after fix | Focused CORS coverage passed: `2 passed`. |
| `bash -n scripts/smoke_e2e.sh` | Passed after fix | Smoke script syntax is valid. |
| `docker compose -p ai-learning-assistant config` | Passed after fix | Default product Compose configuration still publishes host port `14242`. |
| `.venv/bin/python -m pytest backend/tests -q` | Passed after fix | Full backend suite passed: `65 passed`. |
| `npm --prefix frontend run test` | Passed after fix | Frontend tests still passed: `5 passed`. |
| `./scripts/smoke_e2e.sh` | Passed after fix | Smoke selected a free local port and completed auth, upload, model settings, run creation, manifest, and workbench asset checks. |
| `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .` | Passed after fix | Governance check reported `OK`. |

## Blockers

- Fixed: Backend CORS used wildcard origins together with credentials, which violated the task security requirement.
- Fixed: `docs/CONTRACTS/generation-pipeline.md` did not explicitly state that phase-1 run execution is request-synchronous even though status polling remains the compatibility surface.
- Fixed: `./scripts/smoke_e2e.sh` could not run while the main product container occupied host port `14242`.

## Risks

- No open blocker remains for the pre-E2E automated smoke path.
- Accepted by human on 2026-06-05: phase 1 may continue using request-synchronous run execution for release readiness. A real background worker/job queue remains optional future work, not a pre-E2E blocker.
- Review risk: the CORS origin list is intentionally limited to local desktop/backend/dev origins. Future dev servers on other ports should be added deliberately rather than reintroducing wildcard credentialed CORS.

## Fixes Applied

- `backend/main.py`: replaced `allow_origins=["*"]` with an explicit local origin list while keeping credentials enabled.
- `backend/tests/test_cors.py`: added focused coverage for allowed local dev CORS preflight and rejected non-local origin preflight.
- `docs/CONTRACTS/generation-pipeline.md`: documented the request-synchronous phase-1 executor behavior and clarified the future-compatible status polling surface.
- `compose.yml`: made the host backend port configurable through `AILA_BACKEND_PORT` while preserving the default `14242`.
- `scripts/smoke_e2e.sh`: made smoke default to a free local host port and point its backend URL at that isolated runtime.
- `docs/CONTRACTS/runtime-electron-docker.md`: documented that smoke may override the host port while product defaults and in-container paths/ports remain stable.

## Retest Results

- Backend tests: passed, `65 passed`.
- Frontend tests: passed, `5 passed`.
- Mocked E2E smoke: passed on a dynamically selected local port while the product `14242` port remained available for the main container.
- Governance check: passed.

## Human Decisions Needed

- None for this repair. The human accepted phase-1 request-synchronous run execution on 2026-06-05.
