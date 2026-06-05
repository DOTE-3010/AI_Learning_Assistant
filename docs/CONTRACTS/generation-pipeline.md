<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
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
  "revision_of_run_id": null,
  "upload_ids": ["upload-1"],
  "options": {
    "target_pages": 2,
    "paper_size": "A4",
    "density": "dense"
  }
}
```

`intent` is selected by the UI through an explicit artifact-type control. The backend must not infer the pipeline solely from `task_text` in phase 1.

For `code_homework`, `output_preference` defaults to `py` and may be either `py` or `ipynb`. The backend may normalize UI-friendly aliases such as `.py`, `python`, `script`, `.ipynb`, `notebook`, or `jupyter` into those canonical values. Unsupported code output preferences fail request validation with `validation_error`.

`revision_of_run_id` is optional. When present, the new run is a follow-up to a prior run owned by the same authenticated user. The backend may use the prior manifest, generated source, and output metadata as context for the revision, but the new run still produces its own run folder and manifest.

## Run Lifecycle

```text
queued -> running -> succeeded
queued -> running -> failed
queued -> cancelled
```

## Phase-1 Execution Semantics

`POST /api/runs` currently validates the request, creates a persisted run, emits the initial `queued` status event, creates the artifact folder, applies the selected search policy, and then executes the selected pipeline request-synchronously before returning the `202` response.

Because execution is synchronous in phase 1, the create-run response may already contain a terminal status such as `succeeded` or `failed`. The `queued` and `running` lifecycle states are still part of the contract: they are emitted during execution, may be observed by injected test executors, and remain the compatibility surface for a future background worker or job queue.

Clients must not rely on the create-run response being terminal. After a successful `POST /api/runs`, clients should continue to fetch the status/event endpoint until `status` is `succeeded`, `failed`, or `cancelled`. A later background executor may return from `POST /api/runs` while the run is still `queued` or `running` without changing the response envelope.

## Stages

1. Validate request and auth.
2. Resolve revision context if `revision_of_run_id` is present.
3. Resolve model profile.
4. Extract uploaded context.
5. Use the explicit selected intent to choose a pipeline.
6. Decide web search if `search_mode = auto`.
7. Estimate context budget and compress or reject if needed.
8. Generate artifact source.
9. Validate/repair source when feasible.
10. Compile PDF or notebook when applicable.
11. Write manifest, artifacts, citations, and logs.

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
    "context_window_limit": 1000000,
    "utilization_ratio": 0.016,
    "warning_level": "ok",
    "source": "heuristic"
  }
}
```

Phase-1 status/polling compatibility surface:

- `GET /api/runs/{run_id}/events` returns the latest status event object for the authenticated run owner.
- Clients poll this endpoint until `status` is `succeeded`, `failed`, or `cancelled`.
- When the in-memory event history is unavailable, the endpoint falls back to the persisted run status; `context` may be absent in that fallback case.

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

## Revision Context Budgeting

When `revision_of_run_id` is present, prior-run context is low-priority input. The builder may include prior manifest summary, output filenames, generated source, and sanitized logs, but must not use a single fixed prompt dump for every model.

- The selected model profile's `context_window_hint` drives the revision budget. The budget should preserve room for the new task, current uploads/options, and the expected output tokens.
- Prior generated source may scale upward for larger windows, but it remains bounded by a policy cap and is still included only from owned prior runs.
- Logs remain much more tightly capped than generated source because they are higher-risk and lower-value; sanitization must run before truncation.
- When the profile hint is missing or small, the current conservative fallback is acceptable. When the hint is large, the default revision source budget should be meaningfully larger than the legacy 24k-character cap while still keeping the context dial below warning thresholds for ordinary follow-ups.
- The status/context estimate must count the revision text that is actually included.

## Web Search Policy

- `off`: no search.
- `on`: search unless provider/config failure prevents it; a failure here is fatal and recorded as `search_unavailable`.
- `auto`: classifier decides and records `used = true/false`; a search failure is non-fatal.

Search citations must be stored in metadata and manifest when used.

## Pipeline Rules

- Pipelines produce source files first; compiled/rendered outputs are secondary.
- Code generation should prefer runnable, complete files over snippets.
- Code generation writes either `solution.py` or `solution.ipynb`; notebook output must validate as nbformat JSON.
- LaTeX generation should produce full compilable documents for essay, slides, and cheat-sheet intents.
- When LaTeX compilation fails after source generation, the pipeline may run one bounded model-assisted repair pass using the generated source and sanitized compiler log, then recompile. It must overwrite the generated `.tex` with the repaired source only when a repair is attempted, must not change the external run API shape, and must still fail as `compile_failed` if the repaired source does not compile.
- The Docker LaTeX runtime must include common article/Beamer dependencies used by phase-1 prompts and real model output, including `lmodern.sty`; missing runtime packages that make ordinary generated LaTeX fail are QA blockers, not accepted model-output risks.
- Cheat-sheet layout may use aggressive typography, columns, and small fonts, but must target the requested A4 page count.
- Revision runs must be independent persisted runs. They may reference prior run metadata and files, but must not overwrite the prior run folder.
- Model calls must be mockable in tests.

## Errors

Uses the canonical envelope (`errors.md`). `POST /api/runs` validation errors are synchronous; failures discovered while a run executes are reported through the status event with `status = failed` and the same `code`/`message`, and persisted to `runs.error_message`.

| Scenario | Surfaced as | Code |
| --- | --- | --- |
| Missing/unknown/unsupported `intent` | 400 sync | `unsupported_intent` |
| Unsupported `code_homework.output_preference` | 400 sync | `validation_error` |
| `cheat_sheet` without `options.target_pages` | 400 sync | `validation_error` |
| Referenced `upload_ids` missing | 400 sync | `not_found` |
| `revision_of_run_id` missing or not owned by caller | 404 sync | `not_found` |
| No usable model key | run `failed` | `missing_api_key` |
| Provider rejects key / unreachable | run `failed` | `provider_auth_failed` / `provider_unavailable` |
| Context too large after compression | run `failed` | `context_overflow` |
| LaTeX/notebook compile fails | run `failed` (source kept) | `compile_failed` |
| Forced `search_mode = on` but search fails | run `failed` | `search_unavailable` |

## Validation Rules

- `intent` is one of `code_homework`, `essay_latex`, `beamer_slides`, `cheat_sheet`.
- `search_mode` is one of `auto`, `on`, `off`.
- `code_homework.output_preference` is `py` or `ipynb` after normalization.
- `cheat_sheet` requires `options.target_pages` (positive integer).
- `revision_of_run_id`, when present, references a run owned by the authenticated user.
- Students and teachers can both create generation runs in phase 1.

## Compatibility

- Additive: new optional request fields, new optional `options.*`, new status `stage` strings, new `context` fields.
- Breaking (ADR required): adding/removing an intent, changing the run lifecycle states, or changing the status event envelope.

## Versioning

- Run endpoints live under `/api/runs`. `manifest.json` carries its own `schema_version` (`artifact-filesystem.md`).

## Acceptance Checks

- A request records the explicitly selected intent in run metadata.
- Each intent has a pipeline entrypoint with mocked model tests.
- Failed generation records sanitized error metadata and any partial source/logs.
- Context stats can be consumed by the UI context dial.
- The Docker runtime resolves common LaTeX dependencies required by phase-1 PDF outputs, including `kpsewhich lmodern.sty`.
- A LaTeX source-level compile error can be repaired once without adding duplicate source entries to the manifest or changing the run response contract.

## Open Questions

- None for prompt-based intent inference; phase 1 requires explicit artifact type selection.
