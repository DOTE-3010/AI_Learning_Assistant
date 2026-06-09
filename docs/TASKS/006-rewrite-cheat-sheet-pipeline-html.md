<!--
Owner: project-maintainer
Status: Pending
Phase: 2 — Pipeline Migration
Depends: 001, 002
-->

# Task 006: Rewrite Cheat-Sheet Pipeline to HTML

## Goal

Replace `backend/pipelines/cheat_sheet.py` with a new cheat-sheet pipeline that generates a dense multi-column HTML document targeting A4 at the requested page count and converts it to PDF via Playwright.

## Scope

### Touch

- `backend/pipelines/cheat_sheet.py`: rewrite as `backend/pipelines/cheat_sheet_html.py` (or rename in place).
- `backend/pipelines/router.py`: update the `cheat_sheet` intent to use the new pipeline.
- `backend/core/runs.py`: update `execute_cheat_sheet_run` to call the new pipeline.

### Do Not Touch

- Essay or slides pipelines.
- Frontend code.
- Database schema.
- The `intent` enum value `cheat_sheet` stays unchanged.

## Steps

1. Create `backend/pipelines/cheat_sheet_html.py` with a `run_cheat_sheet_html_pipeline()` function:
   - Same interface pattern, replacing `latex_compiler` with `pdf_converter`.
   - Keep the `uploads: tuple[UploadExtraction, ...]` parameter for PDF slide extraction.

2. Write `build_cheat_sheet_html_prompt()`:
   - System prompt: expert teaching assistant compressing course material into dense print-ready HTML cheat sheets.
   - Output contract instructs the model to return a complete HTML document that:
     - Is self-contained with inline `<style>`.
     - Uses CSS multi-column layout (`column-count`, `column-gap`) or CSS Grid for dense content.
     - Targets `@page { size: A4; margin: 8mm; }` for aggressive use of page real estate.
     - Uses small but readable font sizes (10–11px for body, 8–9px minimum).
     - Uses CSS `break-inside: avoid` on logical sections to prevent awkward column breaks.
     - Includes KaTeX inline for math formulas.
     - Targets exactly N pages (from `options.target_pages`) — instruct the model to fill pages densely.
     - Uses compact sectioning, tables, definition lists, and code blocks.
     - No external stylesheets or remote images.
   - Include extraction summary and context bundle in the user prompt.

3. Pipeline flow:
   - Format extraction log (reuse `format_extraction_log` from old cheat_sheet.py).
   - Call model provider.
   - Extract HTML.
   - Write `cheat-sheet.html` to output.
   - Call `pdf_converter.convert(html_path=..., pdf_path=..., page_config=A4_NO_MARGIN)` (use minimal margin since the HTML itself specifies margins via @page).
   - On failure: write `convert.log`, raise PipelineError.
   - On success: write `cheat-sheet.pdf`, return PipelineResult.

4. Update router and run orchestration.

## Verification Commands

```bash
.venv/bin/python -c "from backend.pipelines.cheat_sheet_html import run_cheat_sheet_html_pipeline; print('OK')"
```

## Acceptance Criteria

- `cheat_sheet` intent routes to the HTML cheat-sheet pipeline.
- Generated HTML uses CSS multi-column or grid layout for density.
- `cheat-sheet.html` is written as the source artifact.
- `cheat-sheet.pdf` targets A4 with the requested page count.
- KaTeX is available for math content.
- Dense typography is achieved via CSS (small fonts, tight margins, multi-column).
- No external stylesheets or remote images.

## Non-Goals

- Do not change the `cheat_sheet` intent enum value.
- Do not delete old `cheat_sheet.py` yet (task 007).
- Do not guarantee exact page count (it's a target/instruction to the model, not a hard constraint).
