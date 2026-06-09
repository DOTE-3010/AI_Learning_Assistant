# QA Report: Task 008 Course Container API

## Scope

- Task file: `docs/TASKS/008-add-course-container-api.md`
- Modules covered: SQLite migration/repository, course core service, authenticated course API, route registration, focused backend tests

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests/test_sqlite_storage.py backend/tests/test_auth_sqlite.py -q` | Baseline passed | 8 existing storage and auth tests passed before implementation. |
| `.venv/bin/python -m pytest backend/tests/test_course_context_api.py -q` | Passed | 5 course API tests passed. |
| `.venv/bin/python -m pytest backend/tests/test_sqlite_storage.py backend/tests/test_auth_sqlite.py -q` | Passed | 9 storage, migration, and auth tests passed after implementation. |
| `.venv/bin/python -m pytest backend/tests -q` | Passed | 88 backend tests passed. |
| Governance check | Passed | Repository governance check returned OK. |

## Blockers

- None.

## Risks

- The backend stores the canonical default title `Just Asking`. Frontend localization remains task 010 work; backend behavior is keyed by `is_default` and `context_enabled`, not title text.
- Course root paths are metadata-only in task 008. Context file creation and updates remain bounded to task 011.

## Fixes Applied

- Added SQLite schema version 4 with course metadata columns and a forward-only version 3 migration.
- Backfilled existing project rows as ordinary courses and created one context-disabled default course for every existing user.
- Added a partial unique index so each user can have at most one default course.
- Made new user creation atomically create the default course.
- Added authenticated list, create, rename, context-toggle, and soft-archive course operations with ownership isolation and canonical errors.
- Prevented modification of the default course and hid archived ordinary courses from normal list results without deleting rows.

## Retest Results

- Focused course API, migration, storage, auth, and full backend checks passed.

## Human Decisions Needed

- Decide whether task 010 should localize the default label entirely in the frontend while retaining the backend title `Just Asking` as the canonical stored value. This is the recommended phase-1 approach.
