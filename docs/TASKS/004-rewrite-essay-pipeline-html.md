<!--
Owner: project-maintainer
Status: Completed
Phase: 2 — Pipeline Migration
Depends: 001, 002
-->

# Task 004: Rewrite Essay Pipeline to HTML

## Goal

Replace `backend/pipelines/essay_latex.py` with a new essay pipeline that generates a self-contained HTML document and converts it to PDF via Playwright.

## Scope

### Touch

- `backend/pipelines/essay_latex.py`: rewrite as `backend/pipelines/essay_html.py` (or rename in place).
- `backend/pipelines/router.py`: update the `essay_latex` intent to use the new pipeline.
- `backend/core/runs.py`: update `execute_essay_latex_run` to call the new pipeline.

### Do Not Touch

- Slides or cheat-sheet pipelines (tasks 005, 006).
- Frontend code (task 009).
- Database schema.
- The `intent` enum value `essay_latex` stays unchanged for API compatibility.

## Steps

1. Create `backend/pipelines/essay_html.py` with a `run_essay_html_pipeline()` function:
   - Accept the same interface as the old pipeline: `artifact_run`, `model_profile`, `model_provider`, `task_text`, `context_bundle`, `output_preference`, `options`, `search`, `max_output_tokens`, `emit_event`, `timing`.
   - Replace `latex_compiler` parameter with `pdf_converter` (the Playwright converter from task 002).
   
2. Write `build_essay_html_prompt()`:
   - System prompt: expert teaching assistant writing academic essays as self-contained HTML.
   - Output contract instructs the model to return:
     - A complete HTML document with `<!doctype html>`, `<html>`, `<head>`, `<body>`.
     - Inline `<style>` for academic print layout: serif font, proper margins, heading hierarchy.
     - KaTeX CSS/JS inline for math (provide a KaTeX CDN snippet or inline the minimal CSS).
     - No external stylesheet links, no remote images.
     - CSS `@page { size: A4; margin: 20mm; }` for print.
   - User prompt format: same `[Assignment Task]`, `[Prepared Context]`, `[Search Citations]`, `[Options]`, `[Output Contract]` structure.

3. Pipeline flow:
   - Call model provider to generate HTML.
   - Extract HTML from model output (use `extract_fenced_or_raw` with `accepted_languages={"html", "htm"}`).
   - Write `main.html` to `artifact_run` output.
   - Call `pdf_converter.convert(html_path=..., pdf_path=..., page_config=A4_PAGE)`.
   - On conversion failure: write `convert.log`, raise `PipelineError("convert_failed", ...)`.
   - On success: write `main.pdf` to output, return `PipelineResult`.

4. Update `backend/pipelines/router.py` to import and route to the new pipeline.

5. Update `backend/core/runs.py` `execute_essay_latex_run()` to pass the `pdf_converter` instead of `latex_compiler`.

## Verification Commands

```bash
.venv/bin/python -c "from backend.pipelines.essay_html import run_essay_html_pipeline; print('OK')"
```

## Acceptance Criteria

- `essay_latex` intent routes to the HTML pipeline.
- The pipeline generates a self-contained HTML file and converts to PDF.
- `main.html` is written as the source artifact.
- `main.pdf` is written on successful conversion.
- On conversion failure, `convert.log` is written and the run fails with `convert_failed`.
- The model prompt instructs HTML output with inline styles and KaTeX math.
- No LaTeX-specific code in the new pipeline module.

## Non-Goals

- Do not change the `essay_latex` intent enum value (API compatibility).
- Do not delete the old `essay_latex.py` yet (task 007 handles cleanup).
- Do not write tests yet (task 010).
