# QA Report: Task 009 Attach Runs To Courses

## Scope

- Task file: `docs/TASKS/009-attach-runs-to-courses.md`
- Modules covered: run request model, run orchestration/course validation, run serialization, focused backend tests

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests/test_runs_course_selection.py -q` | Baseline blocked | The task-specific test file did not exist before implementation. |
| `.venv/bin/python -m pytest backend/tests/test_runs_api.py -q` | Baseline passed | 15 existing run API tests passed before implementation. |
| `.venv/bin/python -m pytest backend/tests/test_runs_course_selection.py -q` | Passed | 4 course-selection tests passed after implementation. |
| `.venv/bin/python -m pytest backend/tests/test_runs_api.py -q` | Passed | 15 existing run API tests passed after implementation. |
| `.venv/bin/python -m pytest backend/tests/test_course_context_api.py backend/tests/test_sqlite_storage.py -q` | Passed | 10 course API and SQLite tests passed. |
| `.venv/bin/python -m pytest backend/tests -q` | Passed | 92 backend tests passed. |

## Blockers

- The missing task-specific test file blocked the first verification command. It was added with the implementation and now passes.

## Risks

- None. Existing legacy runs with `project_id = null` remain readable because run serialization continues to accept null and returns `course_id: null`.

## Fixes Applied

- Added optional `course_id` to the run creation request.
- Assigned the authenticated user's default context-disabled course when `course_id` is omitted.
- Rejected missing, foreign-owned, and archived courses with the canonical `not_found` response.
- Persisted the selected course in `runs.project_id` without changing explicit artifact intent routing.
- Exposed the persisted selection as `course_id` in run responses.
- Added focused tests for default assignment, ordinary-course selection, ownership isolation, archive rejection, and unchanged code-homework routing.

## Retest Results

- Focused run/course tests, existing run API tests, neighboring course/storage tests, and the full backend suite passed.

## Human Decisions Needed

- None.
