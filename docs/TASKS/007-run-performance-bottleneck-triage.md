# Task: Run Performance Bottleneck Triage

## Goal

Use timing instrumentation to determine whether generation slowness is mostly local or mostly external model-provider latency.

## Source Context

- `docs/TASKS/006-add-run-timing-instrumentation.md`: prerequisite timing data.
- `docs/SPEC.md`: provider-dominant runs should not trigger speculative local optimization.
- `docs/RULES.md`: performance measurement before optimization.
- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: human-reported medium-priority performance concern.

## Scope

- Touch: `docs/QA_REPORTS/` for a performance triage report; optional small test/smoke helper only if existing commands cannot surface timings.
- Do not touch: provider defaults, prompt strategy, schema, frontend UI, broad local optimization, live API secrets.

## Requirements

- Run mocked timing checks and the nearest existing E2E smoke that can expose timing output.
- If local untracked Qwen credentials are available, run a minimal live timing smoke and summarize only aggregate durations; if not available, record the skip as an accepted non-blocking limitation.
- Classify total wall time into provider generation, LaTeX compile/repair, context/upload/search, and artifact persistence.
- If provider generation is more than half of total live wall time, recommend no local optimization unless another local stage is independently large.

## Acceptance Criteria

- A dated performance QA report exists under `docs/QA_REPORTS/`.
- The report states whether the observed bottleneck is provider-dominant, LaTeX-dominant, context/upload-dominant, or inconclusive.
- The report proposes a follow-up task only for a measured local bottleneck.
- No raw prompts, uploaded document text, API keys, or bearer tokens are recorded.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_run_timing_instrumentation.py -q`
- `./scripts/smoke_e2e.sh`

## Handoff Notes

- Cursor should review: whether the conclusion follows the timing data rather than intuition.
- Human should decide: whether to accept provider-dominant slowness as a release risk if live timing shows Qwen is the main bottleneck.
