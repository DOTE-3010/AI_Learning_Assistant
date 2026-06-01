# Task: Build Generation Run API Skeleton

## Goal

Add the rebuilt generation run API and lifecycle state without implementing artifact-specific pipelines.

## Source Context

- `docs/SPEC.md`: Core Workflows
- `docs/ARCH.md`: Module Boundaries
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/auth.md`

## Scope

### Touch

- Run API routes.
- Run service/repository integration.
- API tests with mocked pipeline execution.

### Do Not Touch

- Do not implement real model calls.
- Do not build UI submission flow.
- Do not remove the old `/generate-answer` endpoint yet unless the task is expanded.

## Requirements

- Add `POST /api/runs` for request creation.
- Add `GET /api/runs/{run_id}` for status lookup.
- Persist run metadata in SQLite.
- Require auth for run APIs.

## Acceptance Criteria

- Authenticated teacher can create a queued run.
- Run status can be retrieved.
- Request fields follow `generation-pipeline.md`.
- Tests cover success and unauthorized access.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- This skeleton should not pretend to generate final artifacts. Keep responses honest.

## Handoff Notes

- Cursor should review: API shape and lifecycle names.
- Human decided: student users are not blocked at the generation API layer in phase 1.
