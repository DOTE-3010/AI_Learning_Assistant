# QA Report: Task 007 Performance Bottleneck Triage

## Scope

- Task file: `docs/TASKS/007-run-performance-bottleneck-triage.md`
- Modules covered: timing instrumentation tests and mocked Docker end-to-end generation

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests/test_run_timing_instrumentation.py -q` | Passed | 4 focused timing tests passed. |
| `./scripts/smoke_e2e.sh` | Passed | Mocked Docker run completed and emitted an aggregate timing summary. |
| Local credential availability check | No credential found | Live Qwen timing smoke skipped without reading or recording secret values. |

## Timing Classification

The mocked code-homework E2E run recorded:

| Category | Duration | Share of total |
| --- | ---: | ---: |
| Provider generation | 0 ms | 0% |
| LaTeX compile/repair | 0 ms | 0% |
| Context/upload/search | 1 ms | 8% |
| Artifact persistence | 3 ms | 25% |
| Other local orchestration/validation | 8 ms | 67% |
| Total generation time | 12 ms | 100% |

The Docker image metadata lookup took about 66 seconds before the application
run. This is container build/startup work, not generation pipeline wall time,
and is excluded from the generation classification.

## Blockers

- None. The required mocked checks completed.

## Risks

- Live performance remains **inconclusive** because no local untracked Qwen
  credential was available. Mock-provider measurements cannot represent network
  latency, provider queueing, model inference, or streamed response duration.
- The mocked run shows no independently large local generation stage. Its entire
  instrumented generation path completed in 12 ms, so these measurements do not
  justify a local optimization task.

## Fixes Applied

- Updated `scripts/smoke_e2e.sh` to print aggregate timing categories from the
  generated manifest before temporary smoke data is removed. The summary
  contains only stage durations and no prompts, uploaded content, credentials,
  or bearer tokens.

## Retest Results

- The focused timing suite passed.
- The updated Docker E2E smoke passed and reported the aggregate timing values
  above.

## Human Decisions Needed

- Accept live-generation performance as an unmeasured release risk for now, or
  rerun this triage later with a local Qwen credential.
- No local optimization follow-up is recommended from current evidence. If a
  future live run shows provider generation above 50% of total wall time, accept
  provider-dominant latency unless another local stage is independently large.
