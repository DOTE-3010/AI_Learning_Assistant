<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: Fix Human E2E Workbench Usability Findings

## Goal

Resolve the first human E2E workbench usability blockers without adding new phase-1 product features.

## Source Context

- `docs/QA_PLAN.md`
- `docs/QA_REPORTS/2026-06-03-human-e2e.md`
- `docs/SPEC.md`
- `docs/RULES.md`
- `docs/CONTRACTS/model-settings.md`
- `docs/CONTRACTS/ui-workbench.md`
- `docs/CONTRACTS/generation-pipeline.md`

## Scope

### Touch

- Frontend model settings defaults and settings copy.
- Frontend locale catalog entries for English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`).
- Frontend run/status stage presentation.
- Frontend preview tab/file-view behavior for Code, Source, Logs, and Manifest.
- Frontend tests or smoke fixtures that cover the changed interactions.
- Docker LaTeX runtime dependencies required by normal phase-1 PDF generation.
- `docs/QA_REPORTS/2026-06-03-human-e2e.md` retest notes after the fix.

### Do Not Touch

- Do not change auth semantics, secret storage, backend route shapes, generation request/response contracts, artifact manifest schema, or SQLite schema.
- Do not add new artifact types, direct in-app artifact editing, generated-code execution, new provider SDKs, or native packaging behavior.
- Do not store or commit real API keys.
- Do not rework unrelated frontend visuals beyond what the three findings require.

## Requirements

- The model settings editor pre-populates every non-secret default from `docs/CONTRACTS/model-settings.md`: provider `openai_compatible`, base URL `https://dashscope.aliyuncs.com/compatible-mode/v1`, model `qwen-plus`, context window hint `1000000`, and streaming support `true`. The API key remains the only empty required field.
- Existing saved model settings and untracked `MODEL_*` environment overrides still take precedence over tracked defaults.
- Backend runtime defaults and Docker Compose defaults use the same documented non-secret Qwen defaults as the frontend.
- Missing API key states remain explicit and helpful; no raw key is echoed in the UI, logs, or API responses.
- The run/status stage surface uses localized human-readable labels and visual grouping that makes the row clearly read as progress/status, or makes each interactive item reveal real details.
- Bare backend stage identifiers may remain only as secondary technical detail, not as the primary UI copy.
- Code, Source, Logs, and Manifest controls are never enabled silent no-ops. Selecting an enabled control changes the preview to generated content, a purpose-specific empty/running state, a demo/skeleton, or a clear unavailable state.
- The changed UI fits at 100% browser zoom in English, Simplified Chinese, and Traditional Chinese without obvious overflow or overlap.
- The saved local default profile uses the China-site Qwen endpoint when the human confirms the real API key belongs to the China site.
- Human E2E essay/PDF generation must not fail because the Docker runtime is missing common LaTeX dependencies such as `lmodern.sty`.
- Human E2E essay/PDF generation should make one bounded repair attempt when the model returns LaTeX source with ordinary compile errors such as table alignment mismatches.

## Acceptance Criteria

- A first-time user can open model settings and only needs to provide an API key to try the documented Qwen default profile.
- Backend default profile creation and Docker Compose defaults match the documented Qwen base URL, model, context window, and streaming settings.
- `/api/settings/model-profiles/test` succeeds with the saved China-site Qwen key reference after the endpoint correction.
- The run/status strip is understandable as progress/status in all supported locales and no longer resembles unexplained inert navigation.
- Clicking Code, Source, Logs, and Manifest either updates visible preview content or is visibly disabled with a clear reason.
- No backend API shape, secret-storage behavior, or artifact contract changes are required.
- Human E2E report is updated with fixes applied and retest results.
- A real `essay_latex` run that already produced source can compile inside the rebuilt Docker runtime when the generated source requires `lmodern.sty`.
- Pipeline tests cover a first LaTeX compile failure followed by successful model-assisted source repair.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_model_settings.py -q`
- `npm --prefix frontend run test`
- `npm --prefix frontend run build`
- `docker compose -p ai-learning-assistant up --build -d`
- `docker compose -p ai-learning-assistant exec -T backend kpsewhich lmodern.sty`
- Direct repair-and-compile retest against a temporary copy of the failed human E2E run source.

## Handoff Notes

- Cursor should review: contract compliance for model defaults, no secret leakage, locale coverage, whether preview controls are genuinely non-inert, and whether the Docker LaTeX dependency change is minimal.
- Human should decide: whether live China-site Qwen provider testing must pass before release readiness.
