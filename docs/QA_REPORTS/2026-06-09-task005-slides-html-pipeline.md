<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# QA Report: Task 005 Slides HTML Pipeline

## Scope

- Task file: `docs/TASKS/005-rewrite-slides-pipeline-html.md`
- Modules covered: HTML slide deck pipeline, `beamer_slides` compatibility intent routing, run orchestration, and deck.css prompt integration.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `python3 -m py_compile backend/pipelines/slides_html.py backend/pipelines/router.py backend/pipelines/__init__.py backend/core/runs.py` | Passed | Syntax check for modified Python modules. |
| `.venv/bin/python -c "from backend.pipelines.slides_html import run_slides_html_pipeline; print('OK')"` | Passed | Printed `OK`. |
| `python3 -c "from backend.pipelines.router import route_intent; ..."` | Passed | Confirmed `beamer_slides` routes to `slides_html` with `slides.html` and `slides.pdf` primary outputs. |
| Fake provider + fake converter success smoke through `create_run(...)` | Passed | Run succeeded, wrote `output/slides.html`, `output/slides.pdf`, and manifest outputs for source/pdf. Converter received `SLIDES_PAGE` dimensions. |
| Fake provider + failing converter smoke through `create_run(...)` | Passed | Run failed with `convert_failed`, preserved `output/slides.html`, and wrote `logs/convert.log`. |

## Blockers

- Fixed: the `beamer_slides` compatibility intent still routed to the old LaTeX Beamer pipeline before this task.

## Risks

- Existing Beamer unit tests still expect `.tex`, LaTeX repair behavior, and `latex.log`. They are intentionally not migrated in this task; task 010 owns test migration.
- Real Playwright rendering of model-generated slide HTML should receive integration coverage in task 011 and visual review in later preview/frontend work.

## Fixes Applied

- Added `backend/pipelines/slides_html.py` with `run_slides_html_pipeline()` and `build_slides_html_prompt()`.
- The slides prompt now asks for a complete self-contained HTML deck with inline deck CSS, 960×540 `.slide` sections, `.content` containers, title-slide structure, deck.css layout classes, no external assets, no CUHK branding, and print pagination at `10in 5.625in`.
- Updated router metadata so the `beamer_slides` API intent maps internally to `slides_html` and advertises `slides.html` plus `slides.pdf`.
- Updated run orchestration so `execute_beamer_slides_run()` keeps the compatibility name but calls the HTML slides pipeline with an `HtmlToPdfConverter`.
- Kept the old Beamer LaTeX executor as legacy code for task 007 cleanup.

## Retest Results

- Import and syntax checks passed.
- Success-path smoke confirmed generated slide HTML and PDF artifacts are persisted and listed in the manifest.
- Failure-path smoke confirmed conversion failures use `convert_failed`, write `convert.log`, and keep `slides.html`.

## Human Decisions Needed

- None.
