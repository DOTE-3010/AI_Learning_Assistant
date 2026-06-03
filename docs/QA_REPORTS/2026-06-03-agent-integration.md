<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# QA Report: Agent Integration Tests

## Scope

- Task file: `docs/TASKS/003-qa-agent-integration-tests.md`
- Modules covered: Docker Compose runtime, backend health/static serving, auth, uploads, model settings, mocked run creation/status/events, artifact manifest/output shape, desktop launcher smoke, governance.
- Prior phase: `docs/TASKS/002-qa-agent-module-functional-tests.md` completed with no blockers in `docs/QA_REPORTS/2026-06-03-agent-module-functional.md`.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `docker compose -p ai-learning-assistant config` | Passed | Compose renders one backend service with SQLite/data and workspace bind mounts, no Postgres/Mongo services. |
| `./scripts/smoke_e2e.sh` | Passed | Built and started the Docker backend with mocked model provider, then verified `/health`, auth register/login/me, upload create/get, redacted model settings, profile test, run creation/status/events, `/ui/`, workbench assets, `manifest.json`, and `output/solution.py`. The script inspected the temporary run folder before cleanup. |
| `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .` | Passed | Governance check reported `OK`. |
| `docker compose -p ai-learning-assistant ps` | Passed | Main Compose project had no running stale containers before handoff. |
| `docker ps --format ...` | Passed with elevated permission | No containers were running after smoke cleanup; confirms the human launcher will start a clean main project rather than attach to an old backend. |
| `AILA_DESKTOP_LAUNCH_SMOKE=1 AILA_DESKTOP_SKIP_RUNTIME=1 ./run_desktop.command` | Passed with elevated permission | Verified the clickable macOS launcher path reaches the Electron shell and displays the startup window. A sandboxed attempt failed because managed sandbox access to `docker info` was denied; the elevated run matched the real double-click permission model. |

## Blockers

- None found. The automated integration gate has no open internal blockers before human E2E.

## Risks

- Upload integration coverage is success-path only in `./scripts/smoke_e2e.sh`; validation and edge cases remain covered by module functional tests. Disposition: acceptable for integration; human E2E should still try representative upload types.
- Live Qwen/OpenAI-compatible provider behavior was not tested because real credentials are intentionally untracked. Disposition: external credentials-dependent risk; human should decide whether it blocks phase 1.
- Live web-search provider behavior was not tested because the concrete provider remains undecided. Disposition: known product/integration risk; human should decide whether mocked/off-mode coverage is enough for phase 1.
- Docker Desktop availability depends on the human machine state. Disposition: launcher and smoke checks pass with Docker Desktop available; human E2E should start from `./run_desktop.command` and observe the startup state.
- Visual, localization, and all-four-artifact workflow judgment are not agent integration authority. Disposition: task004 human E2E must cover English, Simplified Chinese, Traditional Chinese, and all four artifact modes.

## Fixes Applied

- None. No product-code or script blocker was found during task003.

## Retest Results

- No code-fix retest was required.
- Supplemental launcher retest after the sandbox-limited attempt: `AILA_DESKTOP_LAUNCH_SMOKE=1 AILA_DESKTOP_SKIP_RUNTIME=1 ./run_desktop.command` passed with elevated permission, showing `BrowserWindow displayed shell page`.

## Human Decisions Needed

- Decide whether live-provider integration with real local credentials is required before or during human E2E.
- Decide whether live web-search behavior blocks phase 1 or remains future/provider-dependent.
- Begin task004 from `./run_desktop.command`; agent-owned smoke, functional, and integration phases now have no open blockers.
