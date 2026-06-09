<!--
Owner: project-maintainer
Status: Pending
Phase: 3 — Testing
Depends: 008, 010, 011
-->

# Task 012: Update E2E Smoke Script

## Goal

Update `scripts/smoke_e2e.sh` to verify the full HTML-native pipeline round-trip: auth → run creation → HTML generation → PDF conversion → manifest verification.

## Scope

### Touch

- `scripts/smoke_e2e.sh`: update assertions and expected file extensions.
- Backend mock model provider (if used by smoke): verify it returns HTML instead of LaTeX.

### Do Not Touch

- Production pipeline code.
- Frontend code.
- Database schema.

## Steps

1. Review current `scripts/smoke_e2e.sh` and identify LaTeX-specific assertions:
   - Check for `.tex` file expectations → change to `.html`.
   - Check for `latex.log` references → change to `convert.log` or remove.
   - Check for `compile_failed` error codes → change to `convert_failed`.
   - Check for `latexmk` or `pdflatex` references → remove.

2. Update the mock model provider response:
   - If the smoke test uses a mock model that returns LaTeX source, update it to return HTML source.
   - The mock HTML should be a minimal valid document:
     ```html
     <!doctype html><html><head><style>body{font-family:serif;}</style></head><body><h1>Test</h1><p>Content</p></body></html>
     ```

3. Update manifest assertions:
   - Expected outputs should reference `.html` and `.pdf` files.
   - The intent values remain unchanged (`essay_latex`, `beamer_slides`, `cheat_sheet`).

4. Run the smoke script:
   ```bash
   ./scripts/smoke_e2e.sh
   ```

5. Verify all assertions pass.

## Verification Commands

```bash
./scripts/smoke_e2e.sh
echo "Exit code: $?"
```

## Acceptance Criteria

- `scripts/smoke_e2e.sh` passes end-to-end.
- No references to `.tex`, `latexmk`, or `latex.log` in the smoke script.
- Mock model responses produce valid HTML.
- Run manifests contain `.html` source and `.pdf` output entries.
- The smoke script exercises at least one PDF-producing intent (e.g. `essay_latex`).

## Non-Goals

- Do not test all four intents exhaustively (that's human E2E scope).
- Do not add real LLM API credentials to the smoke script.
- Do not modify the smoke script's auth or model settings verification logic (those are unchanged).
