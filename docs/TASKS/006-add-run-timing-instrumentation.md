# Task: Add Run Timing Instrumentation

## Goal

Measure generation-stage wall time well enough to distinguish local bottlenecks from external model-provider latency.

## Source Context

- `docs/SPEC.md`: performance optimization starts with timing; do not optimize if provider dominates.
- `docs/CONTRACTS/generation-pipeline.md`: optional timing fields in status events.
- `docs/CONTRACTS/artifact-filesystem.md`: optional `manifest.timings`.
- `docs/RULES.md`: performance triage discipline.

## Scope

- Touch: backend run orchestration, shared pipeline timing helpers, manifest/log writing, focused backend tests.
- Do not touch: frontend progress UI, provider implementation internals, optimization/refactor work, live Qwen credentials.

## Requirements

- Use monotonic wall-clock timing around major stages: preparation/context, search, provider generation, LaTeX compile, repair generation if attempted, artifact persistence, and total run time.
- Persist timing summaries in `manifest.json` and sanitized logs without raw prompts, uploaded text, API keys, or bearer tokens.
- Expose optional timing info in the latest status event when practical.
- Keep timing instrumentation lightweight and deterministic in mocked tests.

## Acceptance Criteria

- Mocked code and PDF pipeline tests can assert provider-generation and local-stage timing entries exist.
- Failed runs still write timing information for completed stages where a manifest/log exists.
- Timings are approximate diagnostics and are not used as exact progress percentages.
- Existing run status event tests still pass.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_run_timing_instrumentation.py -q`
- `.venv/bin/python -m pytest backend/tests/test_run_status_events.py backend/tests/test_runs_api.py -q`

## Handoff Notes

- Cursor should review: use of monotonic clocks, absence of sensitive text in logs, and whether timing labels match the generation contract.
- Human should decide: no decision expected unless instrumentation shows a surprising local bottleneck.
