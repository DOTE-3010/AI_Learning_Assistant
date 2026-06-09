<!--
Owner: project-maintainer
Status: Pending
Phase: 2 — Pipeline Migration
Depends: 001, 002
-->

# Task 005: Rewrite Slides Pipeline to HTML

## Goal

Replace `backend/pipelines/beamer_slides.py` with a new slides pipeline that generates an HTML slide deck following the `slides_html/shared/deck.css` layout system and converts it to PDF via Playwright.

## Scope

### Touch

- `backend/pipelines/beamer_slides.py`: rewrite as `backend/pipelines/slides_html.py` (or rename in place).
- `backend/pipelines/deck_css.py`: use the deck CSS content from task 002.
- `backend/pipelines/router.py`: update the `beamer_slides` intent to use the new pipeline.
- `backend/core/runs.py`: update `execute_beamer_slides_run` to call the new pipeline.

### Do Not Touch

- Essay or cheat-sheet pipelines.
- Frontend code (task 009).
- Database schema.
- The `intent` enum value `beamer_slides` stays unchanged.

## Steps

1. Create `backend/pipelines/slides_html.py` with a `run_slides_html_pipeline()` function:
   - Same interface pattern as other pipelines.
   - Replace `latex_compiler` with `pdf_converter`.

2. Write `build_slides_html_prompt()`:
   - System prompt: expert teaching assistant creating presentation slide decks as HTML.
   - Output contract instructs the model to return a complete HTML document that:
     - Uses `<!doctype html>`, inline `<style>` containing the deck.css vocabulary.
     - Each slide is a `<section class="slide">` with a `<div class="content">` inside.
     - First slide should be `class="slide title-slide"` with course-kicker, lecture-title, instructor.
     - Uses the CSS class vocabulary from deck.css: `.grid-2`, `.grid-3`, `.card`, `.callout`, `.code-box`, `.prompt-box`, `.table`, `.flow`, `.flow-box`, `.number-list`, `.number-row`, etc.
     - NO `<link>` to external stylesheets. ALL CSS is inline in `<style>`.
     - NO external images or remote URLs. Diagrams use CSS-based layouts (`.is-diagram`, `.flow`, SVG inline).
     - NO CUHK logo or `.cuhk-mark` class.
     - KaTeX inline for any math content.
     - CSS print pagination: `@page { size: 10in 5.625in; margin: 0; }` with `page-break-after: always` on each `.slide`.
   - Include a condensed version of the deck.css classes in the prompt as reference (the agent should embed the key layout classes).

3. Pipeline flow:
   - Call model provider to generate HTML.
   - Extract HTML from model output.
   - Write `slides.html` to `artifact_run` output.
   - Call `pdf_converter.convert(html_path=..., pdf_path=..., page_config=SLIDES_PAGE)`.
   - On failure: write `convert.log`, raise `PipelineError("convert_failed", ...)`.
   - On success: write `slides.pdf`, return `PipelineResult`.

4. Update router and run orchestration.

## Reference: Key deck.css Classes to Include in Prompt

```
.slide { width: 960px; height: 540px; overflow: hidden; background: white; page-break-after: always; }
.content { position: absolute; inset: 54px 54px 44px 54px; }
.title-slide .content { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.card { border: 1px solid #d9dce3; background: #f7f8fb; border-radius: 6px; padding: 14px 15px; }
.callout { border-left: 7px solid #d88a19; background: #fff9ef; padding: 15px 18px; }
.code-box { border: 1px solid #c8cbd5; background: #f8f8fa; border-radius: 6px; padding: 16px 18px; font-family: monospace; white-space: pre-wrap; }
.flow { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.flow-box { flex: 1; border: 1px solid #d9dce3; border-radius: 6px; padding: 14px; text-align: center; font-weight: 700; }
.number-list { counter-reset: item; display: grid; gap: 12px; }
.number-row { display: grid; grid-template-columns: 36px 1fr; gap: 12px; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { border: 1px solid #d9dce3; padding: 9px 10px; }
```

## Verification Commands

```bash
.venv/bin/python -c "from backend.pipelines.slides_html import run_slides_html_pipeline; print('OK')"
```

## Acceptance Criteria

- `beamer_slides` intent routes to the HTML slides pipeline.
- Generated HTML follows the deck.css slide structure (960×540, sections, content areas).
- `slides.html` is written as the source artifact.
- `slides.pdf` is written with correct 10in × 5.625in pages on success.
- No CUHK branding or logo in generated output.
- No external CSS links or remote image URLs.
- CSS print media rules produce correct slide pagination.

## Non-Goals

- Do not change the `beamer_slides` intent enum value.
- Do not delete old `beamer_slides.py` yet (task 007).
- Do not write tests yet (task 010).
