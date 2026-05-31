# Task: Implement Cheat Sheet Pipeline

## Goal

Generate dense A4 cheat-sheet LaTeX/PDF from multiple course slide PDFs and a requested page count.

## Source Context

- `docs/SPEC.md`: Goals, Functional Requirements
- `docs/RULES.md`: Testing Rules
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/artifact-filesystem.md`

## Scope

### Touch

- Cheat-sheet pipeline module.
- PDF text extraction/context packing for multiple files.
- Pipeline tests with small fixtures and mocked model output.

### Do Not Touch

- Do not build advanced visual QA.
- Do not implement frontend multi-upload UI in this task.
- Do not tune final typography beyond a first dense A4 layout.

## Requirements

- Accept multiple PDF uploads.
- Require `target_pages` for cheat-sheet intent.
- Generate full LaTeX source targeting A4 page count.
- Save extraction notes/logs when PDF text is incomplete.

## Acceptance Criteria

- Multiple uploaded PDFs are accepted by the pipeline.
- Missing `target_pages` returns a validation error.
- Mocked generation writes `cheat-sheet.tex`.
- Compile success records `cheat-sheet.pdf`; failure preserves source/logs.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Matching exact page count may need iterative layout repair. Document residual mismatch rather than hiding it.

## Handoff Notes

- Cursor should review: page-count option validation and source/log preservation.
- Human should decide: acceptable tolerance if compiled PDF page count differs from requested N.
