<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: QA Agent Module Smoke Tests

## Goal

Run module-level smoke checks so the project enters QA with import/build/config failures surfaced before deeper testing.

## Source Context

- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/QA_PLAN.md`
- `docs/SPEC.md`
- `docs/ARCH.md`
- `docs/RULES.md`
- `docs/CONTRACTS/`
- `docs/TASKS/000-resolve-upload-api-pre-qa-blocker.md`

## Scope

### Touch

- Test execution only at first.
- `docs/QA_REPORTS/` for the smoke report.
- Minimal code or configuration fixes only after reporting blockers and receiving human direction on risks.

### Do Not Touch

- Do not add new product features.
- Do not change auth semantics, model defaults, secret storage, or distribution behavior without human approval.
- Do not execute the human E2E checklist in this task.
- Do not start this task until `000-resolve-upload-api-pre-qa-blocker` has passed verification.

## Requirements

- Run the governance check, backend test collection, frontend build, desktop smoke script, and Docker Compose config check.
- Confirm the upload pre-QA blocker has been resolved before running smoke checks.
- Classify each failure as blocker or risk using `docs/QA_PLAN.md`.
- Report blockers and risks to the human after testing and before fixes.
- Fix blockers after the report. Fix risks only when the human asks for that risk to be fixed.
- Rerun the failed smoke check and the nearest broader check after any fix.
- Save a durable smoke report under `docs/QA_REPORTS/` if any blocker, risk, or fix is found.

## Acceptance Criteria

- All smoke verification commands have run or each skipped command has a documented reason and blocker/risk classification.
- Open blockers are fixed or explicitly waived by the human.
- Risks are listed with human disposition.
- Retest results are recorded after every smoke-phase fix.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`
- `.venv/bin/python -m pytest backend/tests -q --collect-only && npm --prefix frontend run build && npm --prefix apps/desktop run smoke`
- `docker compose -p ai-learning-assistant config`

## Handoff Notes

- Cursor should review: stale governance references, module import/build failures, and whether any fix exceeds smoke scope.
- Human should decide: whether live-provider verification, frontend visual QA gaps, or Docker Desktop availability risks should block the next QA phase.
