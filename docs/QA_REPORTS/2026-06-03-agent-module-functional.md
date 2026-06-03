<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# QA Report: Agent Module Functional Tests

## Scope

- Task file: `docs/TASKS/002-qa-agent-module-functional-tests.md`
- Modules covered: Backend API, SQLite storage, artifact filesystem, model settings/provider boundary, context/search/revision helpers, artifact pipelines, frontend workbench build, desktop/runtime build and smoke scripts.
- Prior phase: `docs/TASKS/001-qa-agent-module-smoke-tests.md` completed with no blockers in `docs/QA_REPORTS/2026-06-03-agent-module-smoke.md`.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests -q` | Passed | Initial run: 61 tests passed, with FastAPI `on_event` and httpx `app=` deprecation warnings. Retest after fix: 61 tests passed with no warning summary. |
| `npm --prefix frontend run test` | Passed | Added after human approved fixing missing frontend unit/interaction coverage. Covers locale catalog keys, workbench interaction state transitions, run payload contract fields, and submission helpers. |
| `npm --prefix frontend run build` | Passed | Initial and post-fix Vite production builds completed and emitted static workbench assets under `backend/static/`. |
| `npm --prefix apps/desktop run build && npm --prefix apps/desktop run smoke` | Passed | Desktop shell build checks and mocked runtime smoke checks passed. |
| `npm --prefix apps/desktop install` | Passed with warning | Installed Electron dependencies from the existing lockfile so launch-smoke could run. npm reported one high-severity audit finding. |
| `npm --prefix apps/desktop install electron@42.3.2 --save-dev` | Passed | Human approved following Electron security best practice and npm audit's fix. Updated Electron from 33 to 42.3.2; npm reported `found 0 vulnerabilities`. |
| `npm --prefix apps/desktop run launch-smoke` | Passed | Added after human approved fixing desktop GUI launch coverage. Launches Electron, creates/displays the BrowserWindow shell page, skips Docker startup, and exits automatically. |
| `npm --prefix apps/desktop audit --json` | Passed after fix | Initial audit reported one high-severity direct `electron` finding. Retest after upgrading to Electron 42.3.2 reported no vulnerabilities. |
| `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .` | Passed | Governance check reported `OK` after task/report updates. |

## Blockers

- None found.

## Risks

- Fixed by human request: missing frontend unit/interaction coverage. Added Node test-runner coverage without introducing a new external frontend dependency.
- Fixed by human request: backend dependency deprecation warnings. FastAPI startup now uses lifespan and backend tests use an httpx ASGI transport path without deprecated `TestClient` shortcuts.
- Fixed by human request: desktop GUI launch not exercised. Added `launch-smoke`, which starts Electron and verifies the BrowserWindow shell page is displayed before automatic exit.
- Fixed by human request: Electron dependency audit finding. Upgraded the desktop shell baseline from Electron 33 to Electron 42.3.2 and updated `docs/ARCH.md`.

## Fixes Applied

- `backend/main.py`: replaced deprecated FastAPI `@app.on_event("startup")` with an application lifespan handler while preserving the testing bypass and SQLite initialization behavior.
- `backend/tests/conftest.py`: replaced FastAPI `TestClient` usage with a small synchronous wrapper over `httpx.AsyncClient` and `ASGITransport`, removing the deprecated `app=` shortcut warning path.
- `frontend/src/workbench-core.js`: added testable workbench interaction and run-payload helpers for artifact intent, search mode, output preference, target pages, and run submission eligibility.
- `frontend/src/app.js`: wired artifact/search/output/page interactions and run payload construction through the testable workbench core.
- `frontend/tests/workbench-core.test.js`: added Node test-runner coverage for locale keys, interaction state transitions, run payloads, and submission helpers.
- `frontend/package.json`: added `type: module` and `npm --prefix frontend run test`.
- `apps/desktop/src/main.js`: added an environment-gated Electron launch-smoke path that verifies BrowserWindow shell display and skips Docker startup for module-level QA.
- `apps/desktop/scripts/launch-smoke.js`: added an automated Electron launch smoke runner.
- `apps/desktop/package.json` and `apps/desktop/scripts/build.js`: added launch-smoke script and syntax checks.
- `apps/desktop/package.json` and `apps/desktop/package-lock.json`: upgraded Electron to `42.3.2` to clear the direct high-severity audit finding.
- `docs/ARCH.md`: updated the desktop shell baseline from Electron 33 to Electron 42.
- `AGENTS.md` and `docs/TASKS/002-qa-agent-module-functional-tests.md`: added the new frontend and desktop verification commands.

## Retest Results

- `.venv/bin/python -m pytest backend/tests -q`: passed, 61 tests, no warning summary.
- `npm --prefix frontend run test`: passed, 4 tests.
- `npm --prefix frontend run build`: passed.
- `npm --prefix apps/desktop run build && npm --prefix apps/desktop run smoke`: passed.
- `npm --prefix apps/desktop run launch-smoke`: passed.
- `npm --prefix apps/desktop audit --json`: passed, no vulnerabilities.
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`: passed.

## Human Decisions Needed

- None for task002 after the approved Electron 42 security upgrade.
