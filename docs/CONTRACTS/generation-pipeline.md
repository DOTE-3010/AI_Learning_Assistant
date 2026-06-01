<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Contract: Generation Pipeline

## Purpose

Route user intent to reliable artifact-specific generation instead of one generic answer endpoint.

## Intents

| Intent | User Goal | Primary Outputs |
| --- | --- | --- |
| `code_homework` | Write assignment code from task/reference code | `.py` or `.ipynb` |
| `essay_latex` | Write essay/report style assignment | `.tex`, `.pdf` |
| `beamer_slides` | Create presentation slides | Beamer `.tex`, `.pdf` |
| `cheat_sheet` | Compress course slides into N dense A4 pages | `.tex`, `.pdf` |

## Request Shape

```json
{
  "task_text": "Write a two-page essay about ...",
  "intent": "essay_latex",
  "output_preference": "pdf",
  "search_mode": "auto",
  "model_profile_id": "default-qwen",
  "upload_ids": ["upload-1"],
  "options": {
    "target_pages": 2,
    "paper_size": "A4",
    "density": "dense"
  }
}
```

`intent` is selected by the UI through an explicit artifact-type control. The backend must not infer the pipeline solely from `task_text` in phase 1.

## Run Lifecycle

```text
queued -> running -> succeeded
queued -> running -> failed
queued -> cancelled
```

## Stages

1. Validate request and auth.
2. Resolve model profile.
3. Extract uploaded context.
4. Use the explicit selected intent to choose a pipeline.
5. Decide web search if `search_mode = auto`.
6. Estimate context budget and compress or reject if needed.
7. Generate artifact source.
8. Validate/repair source when feasible.
9. Compile PDF or notebook when applicable.
10. Write manifest, artifacts, citations, and logs.

## Status Event Shape

For SSE or polling responses:

```json
{
  "run_id": "01H...",
  "status": "running",
  "stage": "compile_pdf",
  "message": "Compiling LaTeX",
  "context": {
    "estimated_input_tokens": 12000,
    "estimated_output_tokens": 4000,
    "estimated_total_tokens": 16000,
    "context_window_limit": 128000,
    "utilization_ratio": 0.125,
    "warning_level": "ok",
    "source": "heuristic"
  }
}
```

## Context Estimation

The context dial and the `context` block in the status event are driven by an estimator, not by exact provider accounting.

- Method: use the provider tokenizer when one is available for the selected model; otherwise fall back to a heuristic (`ceil(chars / 4)` for prose, with a higher factor for code/LaTeX). Estimates are explicitly approximate.
- `utilization_ratio = estimated_total_tokens / context_window_limit`, where the limit comes from the profile `context_window_hint`.
- Warning levels are fixed thresholds on `utilization_ratio`:

| Level | Range |
| --- | --- |
| `ok` | `< 0.70` |
| `warning` | `0.70`–`0.85` |
| `critical` | `> 0.85` |

- Guardrail: at `warning`, the builder may compress/summarize low-priority context before sending; at `critical`, it compresses aggressively and, if still over the window, fails the run with `context_overflow` rather than silently truncating required input.
- The estimator backend (`provider` vs `heuristic`) is reported as `context.source` so the UI can label estimates honestly.

## Web Search Policy

- `off`: no search.
- `on`: search unless provider/config failure prevents it; a failure here is fatal and recorded as `search_unavailable`.
- `auto`: classifier decides and records `used = true/false`; a search failure is non-fatal.

Search citations must be stored in metadata and manifest when used.

## Pipeline Rules

- Pipelines produce source files first; compiled/rendered outputs are secondary.
- Code generation should prefer runnable, complete files over snippets.
- LaTeX generation should produce full compilable documents for essay, slides, and cheat-sheet intents.
- Cheat-sheet layout may use aggressive typography, columns, and small fonts, but must target the requested A4 page count.
- Model calls must be mockable in tests.

## Errors

Uses the canonical envelope (`errors.md`). `POST /api/runs` validation errors are synchronous; failures discovered while a run executes are reported through the status event with `status = failed` and the same `code`/`message`, and persisted to `runs.error_message`.

| Scenario | Surfaced as | Code |
| --- | --- | --- |
| Missing/unknown/unsupported `intent` | 400 sync | `unsupported_intent` |
| `cheat_sheet` without `options.target_pages` | 400 sync | `validation_error` |
| Referenced `upload_ids` missing | 400 sync | `not_found` |
| No usable model key | run `failed` | `missing_api_key` |
| Provider rejects key / unreachable | run `failed` | `provider_auth_failed` / `provider_unavailable` |
| Context too large after compression | run `failed` | `context_overflow` |
| LaTeX/notebook compile fails | run `failed` (source kept) | `compile_failed` |
| Forced `search_mode = on` but search fails | run `failed` | `search_unavailable` |

## Validation Rules

- `intent` is one of `code_homework`, `essay_latex`, `beamer_slides`, `cheat_sheet`.
- `search_mode` is one of `auto`, `on`, `off`.
- `cheat_sheet` requires `options.target_pages` (positive integer).
- Students and teachers can both create generation runs in phase 1.

## Compatibility

- Additive: new optional `options.*`, new status `stage` strings, new `context` fields.
- Breaking (ADR required): adding/removing an intent, changing the run lifecycle states, or changing the status event envelope.

## Versioning

- Run endpoints live under `/api/runs`. `manifest.json` carries its own `schema_version` (`artifact-filesystem.md`).

## Acceptance Checks

- A request records the explicitly selected intent in run metadata.
- Each intent has a pipeline entrypoint with mocked model tests.
- Failed generation records sanitized error metadata and any partial source/logs.
- Context stats can be consumed by the UI context dial.

## Open Questions

- None for prompt-based intent inference; phase 1 requires explicit artifact type selection.
