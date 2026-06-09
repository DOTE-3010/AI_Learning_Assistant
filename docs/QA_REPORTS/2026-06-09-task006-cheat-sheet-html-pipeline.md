<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# QA Report: Task 006 Cheat-Sheet HTML Pipeline

## Scope

- Task file: `docs/TASKS/006-rewrite-cheat-sheet-pipeline-html.md`
- Modules covered: HTML cheat-sheet pipeline, `cheat_sheet` compatibility intent routing, run orchestration, and PDF extraction log preservation.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `python3 -m py_compile backend/pipelines/cheat_sheet_html.py backend/pipelines/router.py backend/pipelines/__init__.py backend/core/runs.py` | Passed | Syntax check for modified Python modules. |
| `.venv/bin/python -c "from backend.pipelines.cheat_sheet_html import run_cheat_sheet_html_pipeline; print('OK')"` | Passed | Printed `OK`. |
| `python3 -c "from backend.pipelines.router import route_intent; ..."` | Passed | Confirmed `cheat_sheet` routes to `cheat_sheet_html` with `cheat-sheet.html` and `cheat-sheet.pdf` primary outputs. |
| Fake provider + fake converter success smoke through `create_run(...)` | Passed | Run succeeded, wrote `output/cheat-sheet.html`, `output/cheat-sheet.pdf`, and manifest outputs for source/pdf. Converter received `A4_NO_MARGIN`. |
| Fake provider + failing converter smoke through `create_run(...)` | Passed | Run failed with `convert_failed`, preserved `output/cheat-sheet.html`, and wrote `logs/convert.log`. |

## Blockers

- Fixed: the `cheat_sheet` compatibility intent still routed to the old LaTeX pipeline before this task.

## Risks

- Existing cheat-sheet unit tests still expect `.tex`, LaTeX repair behavior, and `latex.log`. They are intentionally not migrated in this task; task 010 owns test migration.
- Exact page count remains model-directed rather than programmatically guaranteed, as stated in the task non-goals.
- Real Playwright rendering of dense model-generated cheat-sheet HTML should receive integration coverage in task 011 and visual review in later preview/frontend work.

## Fixes Applied

- Added `backend/pipelines/cheat_sheet_html.py` with `run_cheat_sheet_html_pipeline()` and `build_cheat_sheet_html_prompt()`.
- The cheat-sheet prompt now asks for self-contained HTML, inline CSS, CSS multi-column or grid density, `@page { size: A4; margin: 8mm; }`, 10-11px body text, 8-9px minimum labels/table text, `break-inside: avoid`, compact tables/definition lists/code blocks, no external assets, and inline math styling.
- Updated router metadata so the `cheat_sheet` API intent maps internally to `cheat_sheet_html` and advertises `cheat-sheet.html` plus `cheat-sheet.pdf`.
- Updated run orchestration so `execute_cheat_sheet_run()` keeps the compatibility name but calls the HTML cheat-sheet pipeline with an `HtmlToPdfConverter`.
- Reused the existing `format_extraction_log()` function so PDF extraction summaries remain durable under `logs/extraction.log`.
- Kept the old LaTeX cheat-sheet executor as legacy code for task 007 cleanup.

## Retest Results

- Import and syntax checks passed.
- Success-path smoke confirmed generated cheat-sheet HTML and PDF artifacts are persisted and listed in the manifest.
- Failure-path smoke confirmed conversion failures use `convert_failed`, write `convert.log`, and keep `cheat-sheet.html`.

## Human Decisions Needed

- None.
