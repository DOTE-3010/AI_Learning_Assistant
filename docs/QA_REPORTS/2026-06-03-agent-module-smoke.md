<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# QA Report: Agent Module Smoke Tests

## Scope

- Task file: `docs/TASKS/001-qa-agent-module-smoke-tests.md`
- Modules covered: governance/docs, backend test collection, frontend production build, desktop shell smoke checks, Docker Compose configuration.
- Entry gate: `docs/TASKS/000-resolve-upload-api-pre-qa-blocker.md` records passing backend tests, frontend build, and mocked E2E smoke with upload coverage on 2026-06-03.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .` | Passed | Governance check reported `OK`. |
| `.venv/bin/python -m pytest backend/tests -q --collect-only` | Passed | 61 tests collected. Pytest reported two FastAPI `on_event` deprecation warnings. |
| `npm --prefix frontend run build` | Passed | Vite build completed and emitted static assets under `backend/static/`. |
| `npm --prefix apps/desktop run smoke` | Passed | Desktop shell smoke script reported checks passed. |
| `docker compose -p ai-learning-assistant config` | Passed | Compose rendered one backend service with data/workspace bind mounts and healthcheck. |

## Blockers

- None found.

## Risks

- FastAPI startup hook deprecation warning: backend collection reports `@app.on_event("startup")` is deprecated in favor of lifespan handlers. Likelihood medium, impact low during phase-1 smoke; proposed disposition is to accept as non-blocking for task001 and consider a later maintenance fix.
- Live model-provider verification was not executed in this smoke phase. Likelihood medium, impact medium because real Qwen/OpenAI-compatible credentials are untracked and outside module smoke scope; proposed disposition is to defer until the human supplies credentials or requests a real-provider QA task.
- Frontend visual/localization QA was not executed in this smoke phase. Likelihood medium, impact medium because build success does not prove English, Simplified Chinese, and Traditional Chinese layouts are free of overflow; proposed disposition is to cover this in the later frontend/human E2E QA path.
- Docker Desktop runtime availability was not exercised beyond Compose configuration. Likelihood medium, impact medium because `docker compose config` validates shape but does not prove the local daemon can build and run services; proposed disposition is to cover runtime boot in the integration smoke phase.

## Fixes Applied

- None. No blockers were found, and risks await human disposition.

## Retest Results

- No retests were required because no fixes were applied.

## Human Decisions Needed

- Decide whether to accept the listed risks as non-blocking for advancing from agent module smoke tests to the next QA phase.
- Decide whether the FastAPI lifespan migration should become a follow-up maintenance task or remain deferred.
- Decide whether live-provider verification should be required before human E2E or remain an optional credentials-dependent check.
