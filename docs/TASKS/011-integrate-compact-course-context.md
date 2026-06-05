# Task: Integrate Compact Course Context

## Goal

Use non-default course summaries as optional low-priority generation context and update those summaries after successful course runs.

## Source Context

- `docs/CONTRACTS/course-context.md`: compact `course_context.md` summary rules.
- `docs/CONTRACTS/generation-pipeline.md`: course context request and estimate behavior.
- `docs/CONTRACTS/artifact-filesystem.md`: course context file location.
- `docs/TASKS/008-add-course-container-api.md` and `docs/TASKS/009-attach-runs-to-courses.md`: prerequisites.

## Scope

- Touch: backend context builder, run completion/course context update logic, artifact/filesystem helpers if needed, focused backend tests.
- Do not touch: frontend selector, course API shape, hard deletion, raw upload storage, long transcript persistence.

## Requirements

- Include compact `course_context.md` as low-priority reference only for selected non-default context-enabled courses.
- Default "Just Asking" runs must never include course context.
- After successful non-default course runs, update `course_context.md` to a compact Markdown summary capped around 8 KB.
- Course context updates must avoid raw uploads, full prompts, secrets, long verbatim excerpts, and unbounded transcript storage.
- Count included course context in context estimates and timing instrumentation.

## Acceptance Criteria

- A non-default course run can include an existing summary in the prepared context.
- A default-course run includes no course summary even when prior uncategorized runs exist.
- Successful non-default runs update a compact Markdown summary and `context_updated_at`.
- Tests prove the summary cap and sensitive-text exclusions are enforced.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_course_context_builder.py -q`
- `.venv/bin/python -m pytest backend/tests/test_intent_router_context.py backend/tests/test_runs_api.py -q`

## Handoff Notes

- Cursor should review: token/character caps, ownership checks, and whether summary updates add unacceptable latency.
- Human should decide: whether future users should be allowed to manually edit course summaries.
