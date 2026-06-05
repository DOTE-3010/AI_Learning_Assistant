# Task: Render Real Artifact Preview Content

## Goal

Replace static post-generation demo previews with real generated code, source, logs, and manifest content in the frontend workbench.

## Source Context

- `docs/CONTRACTS/ui-workbench.md`: Preview Tabs And File Views.
- `docs/CONTRACTS/artifact-access.md`: authenticated artifact metadata and byte endpoints.
- `docs/SPEC.md`: real generated-output preview requirement.
- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: preview blocker.

## Scope

- Touch: `frontend/src/app.js`, `frontend/src/locales.js`, `frontend/src/styles.css`, focused frontend tests if needed.
- Do not touch: backend artifact access implementation except to adapt to the documented contract through a separate task; PDF.js/page-canvas rendering belongs to task `004`.

## Requirements

- After a run reaches `succeeded` or `failed`, fetch artifact metadata for the run and read text artifacts through authenticated artifact access.
- Code/homework primary preview must show generated `solution.py` or a notebook-derived read-only preview when available.
- Source, logs, and manifest tabs must show actual generated files when available; skeleton/demo content is allowed only before output exists or when a renderer fails with a clear fallback.
- PDF-producing primary previews may still use a clear PDF-renderer-pending fallback until task `004`, but they must not pretend a skeleton is the real generated PDF.

## Acceptance Criteria

- A succeeded code run displays the generated code, not the pre-seeded sample snippet.
- Source/log/manifest tabs visibly change to real artifact content after artifact metadata loads.
- Failed LaTeX runs show preserved `.tex` and log content when those files exist.
- Renderer failures show a safe localized error while keeping open/copy/reveal affordances visible.

## Verification

- `npm --prefix frontend run test`
- `npm --prefix frontend run build`

## Handoff Notes

- Cursor should review: auth header handling for artifact fetches, stale-run race conditions, and secret-safe display of logs.
- Human should decide: whether the interim PDF fallback is acceptable before task `004` lands.
