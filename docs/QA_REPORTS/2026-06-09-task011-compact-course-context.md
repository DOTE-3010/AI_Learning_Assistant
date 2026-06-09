# QA Report: Task 011 Compact Course Context

## Scope

- Task file: `docs/TASKS/011-integrate-compact-course-context.md`
- Modules covered: backend context builder, compact course summary filesystem update, run success lifecycle, focused backend tests

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m py_compile backend/context/course_context.py backend/context/builder.py backend/core/runs.py` | Passed | Syntax check passed after implementation. |
| `.venv/bin/python -m pytest backend/tests/test_course_context_builder.py -q` | Passed | 3 tests passed for non-default inclusion, default exclusion, summary update, cap, sanitization, and timing. |
| `.venv/bin/python -m pytest backend/tests/test_intent_router_context.py backend/tests/test_runs_api.py -q` | Passed | 22 tests passed for existing context builder, revision context, and run API behavior. |
| `.venv/bin/python -m pytest backend/tests/test_runs_course_selection.py backend/tests/test_code_homework_pipeline.py -q` | Passed | 8 tests passed for selected-course run persistence and code pipeline success/failure behavior. |

## Blockers

- None.

## Risks

- Summary updates are deterministic and local, not model-summarized. This keeps latency and privacy risk low, but the summary is intentionally coarse until a future task adds a richer summarizer.
- The summary file is generated-only. Manual editing remains a human product decision for a future phase.

## Fixes Applied

- Added compact course context loading for selected non-default, context-enabled courses.
- Ensured default "Just Asking" courses never contribute course summary text, even if a context path exists.
- Added successful-run updates to `course_context.md` with an approximately 8 KB cap.
- Excluded raw upload text, generated source contents, full prompts, and sensitive-looking keys/tokens from stored summaries.
- Counted included course summaries in context estimates and recorded `course_context_update` in run timing manifests.
- Stored new course context files under the workspace course folder and persisted `context_path` plus `context_updated_at`.

## Retest Results

- The task's required backend test commands passed.
- Adjacent course-selection and code-pipeline tests passed after the run success lifecycle change.

## Human Decisions Needed

- Decide later whether users should be allowed to manually edit generated course summaries.
