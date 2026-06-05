# Task: Attach Runs To Selected Courses

## Goal

Let generation runs record an optional selected course without yet adding course context to prompts.

## Source Context

- `docs/CONTRACTS/course-context.md`: generation request `course_id` semantics.
- `docs/CONTRACTS/generation-pipeline.md`: optional `course_id` request field.
- `docs/CONTRACTS/sqlite-schema.md`: `runs.project_id` stores selected course.
- `docs/TASKS/008-add-course-container-api.md`: prerequisite course API/storage.

## Scope

- Touch: run API request model, run orchestration/course validation, repository helpers if needed, backend tests.
- Do not touch: frontend selector, course context summary inclusion/update, artifact preview work, hard deletion behavior.

## Requirements

- Accept optional `course_id` on `POST /api/runs`.
- If absent, assign the user's default context-disabled course for metadata grouping.
- If present, validate that the course is owned by the user and selectable.
- Store the selected course id in `runs.project_id` without changing artifact intent behavior.

## Acceptance Criteria

- Run creation without `course_id` succeeds and records the default course.
- Run creation with an owned ordinary course records that course.
- Run creation with another user's course or an archived/unselectable course fails safely.
- Existing explicit artifact intent routing remains unchanged.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_runs_course_selection.py -q`
- `.venv/bin/python -m pytest backend/tests/test_runs_api.py -q`

## Handoff Notes

- Cursor should review: ownership checks and backward compatibility for older runs with null `project_id`.
- Human should decide: no decision expected unless default-course assignment changes visible run history unexpectedly.
