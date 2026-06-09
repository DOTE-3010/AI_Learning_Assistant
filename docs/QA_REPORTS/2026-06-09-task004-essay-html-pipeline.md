<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# QA Report: Task 004 Essay HTML Pipeline

## Scope

- Task file: `docs/TASKS/004-rewrite-essay-pipeline-html.md`
- Modules covered: essay generation pipeline, run orchestration routing for the `essay_latex` compatibility intent, and pipeline routing metadata.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `python3 -m py_compile backend/pipelines/essay_html.py backend/pipelines/router.py backend/pipelines/__init__.py backend/core/runs.py` | Passed | Syntax check for modified Python modules. |
| `.venv/bin/python -c "from backend.pipelines.essay_html import run_essay_html_pipeline; print('OK')"` | Passed | Printed `OK`. |
| `python3 -c "from backend.pipelines.router import route_intent; ..."` | Passed | Confirmed `essay_latex` routes to `essay_html` with `main.html` and `main.pdf` primary outputs. |
| Fake provider + fake converter success smoke through `create_run(...)` | Passed | Run succeeded, wrote `output/main.html`, `output/main.pdf`, and manifest outputs for source/pdf. |
| Fake provider + failing converter smoke through `create_run(...)` | Passed | Run failed with `convert_failed`, preserved `output/main.html`, and wrote `logs/convert.log`. |

## Blockers

- Fixed: the `essay_latex` compatibility intent still routed to the old LaTeX pipeline before this task.

## Risks

- Existing LaTeX-era unit tests for essay output still expect `.tex`, LaTeX repair, and `latex.log`. They are intentionally not migrated in this task; task 010 owns test migration.
- Real Playwright rendering of model-generated essay HTML is covered by the shared converter smoke from task 002 and will need broader pipeline integration coverage in task 011.

## Fixes Applied

- Added `backend/pipelines/essay_html.py` with `run_essay_html_pipeline()` and `build_essay_html_prompt()`.
- The essay prompt now asks for a complete self-contained HTML document, inline print CSS, A4 page setup, inline math styling when needed, no remote assets, and ordinary HTML references.
- Updated router metadata so the `essay_latex` API intent maps internally to `essay_html` and advertises `main.html` plus `main.pdf`.
- Updated run orchestration so `execute_essay_latex_run()` keeps the compatibility name but calls the HTML pipeline with an `HtmlToPdfConverter`.
- Added optional `pdf_converter` injection to `make_run_executor()` for focused smoke tests and future unit tests.

## Retest Results

- Import and syntax checks passed.
- Success-path smoke confirmed generated HTML and PDF artifacts are persisted and listed in the manifest.
- Failure-path smoke confirmed conversion failures use `convert_failed`, write `convert.log`, and keep `main.html`.

## Human Decisions Needed

- None.
