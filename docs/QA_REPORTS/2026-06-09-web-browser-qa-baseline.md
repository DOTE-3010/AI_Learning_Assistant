# QA Report: Web Browser QA Baseline

## Scope

- Task file: `docs/TASKS/000-web-browser-qa-baseline.md`
- Modules covered: Docker Compose runtime, backend health/static serving, browser workbench, frontend upload control, automated backend/frontend tests, mocked E2E smoke.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `docker compose -p ai-learning-assistant config` | Pass | Backend-only Compose config, port `14242`, no Postgres/Mongo. |
| `.venv/bin/python -m pytest backend/tests -q` | Pass | 65 passed. |
| `npm --prefix frontend run test` | Pass | 6 passed after upload accept regression test was added. |
| `npm --prefix frontend run build` | Pass | Vite built static workbench into `backend/static`. |
| `docker compose -p ai-learning-assistant up --build -d` | Pass | Backend image built and container started healthy. |
| `curl -fsS http://127.0.0.1:14242/health` | Pass | Returned `{"status":"ok"}`. |
| `curl -fsS http://127.0.0.1:14242/ui/` | Pass | Backend served workbench HTML with current Vite bundle. |
| Browser open `http://127.0.0.1:14242/ui/` | Pass | Workbench loaded without console errors. Locale switching worked for EN, `zh-Hans`, and `zh-Hant` with no detected control overflow. |
| Browser model settings check | Pass | Settings modal opened; Qwen non-secret defaults were present and API key remained empty. |
| Browser upload/prompt check | Pass after fix | File input is multiple and advertises `.txt`, `.md`, `.py`, `.ipynb`, `.pdf`, and matching media types. Prompt entry enabled run submission. |
| `./scripts/smoke_e2e.sh` | Pass | Mocked Docker E2E exercised auth, uploads, model settings, run creation, manifest creation, and workbench assets. |

## Blockers

- Fixed: browser file picker did not advertise phase-1 accepted file types, even though backend upload validation accepted them.

## Risks

- Real generated-output preview and truthful progress remain known post-human-E2E blockers owned by tasks `001` through `004`; they do not block task 000 because the baseline only verifies the web runtime surface.
- Live provider generation was not tested; task 000 allows mocked paths, and smoke used `AILA_MOCK_MODEL_PROVIDER=1`.

## Fixes Applied

- `frontend/src/workbench-core.js`: added `UPLOAD_ACCEPT_ATTRIBUTE` for phase-1 accepted extensions and media types.
- `frontend/src/app.js`: wired the upload file input to the accept attribute while preserving multi-file upload.
- `frontend/tests/workbench-core.test.js`: added coverage for phase-1 upload accept types.
- Governance docs: marked task 000 complete, recorded this report, and clarified that active functional QA is Docker plus browser before Electron packaging.

## Retest Results

- `npm --prefix frontend run test`: 6 passed.
- `npm --prefix frontend run build`: passed.
- `.venv/bin/python -m pytest backend/tests -q`: 65 passed.
- `docker compose -p ai-learning-assistant up --build -d`: passed.
- `curl -fsS http://127.0.0.1:14242/health`: passed.
- Browser reload of `/ui/`: no console errors; upload `accept` attribute present.
- `./scripts/smoke_e2e.sh`: passed.

## Human Decisions Needed

- None for task 000. Phase B may begin at `docs/TASKS/001-fix-run-status-motion-progress.md`.
