<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: QA Agent Module Functional Tests

## Goal

Run unit and module-level functional tests for the completed backend, frontend, and desktop modules after smoke testing passes.

## Source Context

- `docs/QA_PLAN.md`
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/SPEC.md`
- `docs/ARCH.md`
- `docs/RULES.md`
- `docs/CONTRACTS/`
- `docs/TASKS/001-qa-agent-module-smoke-tests.md`

## Scope

### Touch

- Existing tests and narrowly scoped fixes for module-level blockers after reporting.
- `docs/QA_REPORTS/` for the module functional report.
- Governance updates only if testing reveals durable mismatch between docs and implementation.

### Do Not Touch

- Do not broaden into cross-service integration debugging until task `003`.
- Do not introduce a new frontend test framework unless the human accepts that as a risk fix.
- Do not change public API contracts without a separate human-approved follow-up.

## Requirements

- Run the backend unit/functional test suite.
- Verify frontend workbench build behavior and record the current frontend unit-test gap if no test framework exists.
- Run desktop build/smoke checks available without launching the full GUI.
- Map results to the module map in `docs/QA_PLAN.md`.
- Report blockers and risks to the human after testing and before fixes.
- Fix blockers after the report. Fix risks only when the human asks for that risk to be fixed.
- Rerun the failed module test and the nearest broader module suite after any fix.

## Acceptance Criteria

- Backend tests for auth, settings, storage, artifacts, context, runs, status events, and pipelines pass or failures are reported as blockers.
- Frontend build passes or failures are reported as blockers.
- Desktop smoke/build checks pass or failures are reported as blockers.
- Any missing frontend unit coverage is explicitly recorded as risk, accepted risk, or human-approved fix.
- Retest results are recorded after every module-functional fix.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run test`
- `npm --prefix frontend run build`
- `npm --prefix apps/desktop run build && npm --prefix apps/desktop run smoke`
- `npm --prefix apps/desktop run launch-smoke`
- `npm --prefix apps/desktop audit --json`

## Handoff Notes

- Cursor should review: whether fixes respect `docs/ARCH.md` module ownership and whether backend contracts still match tests.
- Human should decide: none remaining for task002 after approving frontend coverage, backend warning cleanup, desktop launch smoke, and Electron 42 security upgrade.
