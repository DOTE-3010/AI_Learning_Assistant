<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: QA Agent Integration Tests

## Goal

Run agent-owned integration checks for the rebuilt Electron plus Docker product path before human E2E testing.

## Source Context

- `docs/QA_PLAN.md`
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/SPEC.md`
- `docs/ARCH.md`
- `docs/RULES.md`
- `docs/CONTRACTS/`
- `docs/TASKS/001-qa-agent-module-smoke-tests.md`
- `docs/TASKS/002-qa-agent-module-functional-tests.md`

## Scope

### Touch

- Integration test execution.
- `docs/QA_REPORTS/` for the integration report.
- Narrow fixes for integration blockers after reporting.
- Smoke scripts or launchers only when the failure is inside their documented responsibility.

### Do Not Touch

- Do not require live model credentials for the default integration gate.
- Do not perform human E2E workflow judgment in this task.
- Do not add new product workflows to make integration tests pass.
- Do not delete Docker volumes, generated workspaces, or containers outside the documented smoke script behavior without human approval.

## Requirements

- Validate Docker Compose config and the mocked end-to-end smoke script.
- Confirm the backend health endpoint, `/ui/` static serving, auth, redacted model settings, run creation, status/event response, manifest creation, and at least one pipeline output through the smoke path.
- If practical, inspect generated smoke output folders for manifest and artifact shape against `docs/CONTRACTS/artifact-filesystem.md`.
- Report blockers and risks to the human after testing and before fixes.
- Fix blockers after the report. Fix risks only when the human asks for that risk to be fixed.
- Rerun the failed integration check after any fix.

## Acceptance Criteria

- Docker Compose config is valid.
- The mocked E2E smoke script passes or failures are reported as blockers.
- Integration report names any remaining risks around upload edge cases, live provider behavior, web search provider behavior, Docker Desktop availability, visual QA, and human E2E coverage.
- Retest results are recorded after every integration fix.

## Verification

- `docker compose -p ai-learning-assistant config`
- `./scripts/smoke_e2e.sh`
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether smoke script changes hide failures instead of exercising real contracts.
- Human should decide: whether to run a live-provider integration check before starting human E2E.
