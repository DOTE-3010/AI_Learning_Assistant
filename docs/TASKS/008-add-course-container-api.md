# Task: Add Course Container API

## Goal

Add backend support for lightweight course containers with an undeletable context-disabled default course and soft archive for ordinary courses.

## Source Context

- `docs/CONTRACTS/course-context.md`: course API, default course, and archive behavior.
- `docs/CONTRACTS/sqlite-schema.md`: `projects` table as phase-1 course storage.
- `docs/SPEC.md`: course management product boundary.
- `docs/ARCH.md`: Course Context module boundary.

## Scope

- Touch: SQLite schema/repository, backend course API/core modules, backend route registration, backend tests.
- Do not touch: frontend course selector, generation run `course_id` routing, context-builder inclusion, hard deletion behavior.

## Requirements

- Add forward-only migration/backfill for project/course fields: `is_default`, `is_archived`, `context_enabled`, `context_path`, and `context_updated_at`.
- Add authenticated course endpoints for list, create, rename, and archive as defined in `course-context.md`.
- Ensure each authenticated user has exactly one default "Just Asking" course that is visible, undeletable, unarchivable, and context-disabled.
- Ordinary course archive must be soft deletion only.

## Acceptance Criteria

- A new user listing courses receives the default context-disabled course.
- Ordinary courses can be created and renamed.
- Archiving an ordinary course hides it from normal list results without deleting the row.
- Attempts to archive or context-enable the default course fail with a safe canonical error.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_course_context_api.py -q`
- `.venv/bin/python -m pytest backend/tests/test_sqlite_storage.py backend/tests/test_auth_sqlite.py -q`

## Handoff Notes

- Cursor should review: migration/backfill safety and whether archive behavior avoids hard deletion.
- Human should decide: whether the default course label should be localized entirely in frontend or stored per user later.
