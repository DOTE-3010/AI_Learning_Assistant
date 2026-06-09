# Task 008 QA Report: Context Builder and Run Orchestration

Date: 2026-06-09
Owner: Agent
Task: `docs/TASKS/008-update-context-builder-and-orchestration.md`
Status: Completed

## Scope Executed

- Updated backend run orchestration to use `pdf_converter` and the Playwright converter path instead of LaTeX compiler naming.
- Added app-level `PlaywrightPdfConverter` initialization during FastAPI lifespan and wired API run execution to reuse it.
- Updated timing stage names for HTML-to-PDF conversion from `compile_pdf` to `convert_pdf`.
- Removed LaTeX-specific context assumptions from backend context budget, extraction, and revision-source handling.
- Updated the mock model provider to return self-contained HTML for essay, slide, and cheat-sheet prompts.

## Files Changed

- `backend/api/runs.py`
- `backend/context/budget.py`
- `backend/context/builder.py`
- `backend/context/extraction.py`
- `backend/core/runs.py`
- `backend/main.py`
- `backend/providers/mock.py`
- `backend/pipelines/essay_html.py`
- `backend/pipelines/slides_html.py`
- `backend/pipelines/cheat_sheet_html.py`
- `docs/TASKS/008-update-context-builder-and-orchestration.md`
- `docs/TASKS/README.md`

## Verification

Passed:

```bash
.venv/bin/python -c "from backend.main import app; print('FastAPI app OK')"
.venv/bin/python -c "from backend.core.runs import create_run; print('runs OK')"
rg -n "LatexMk|latex_compiler|LatexCompil" backend --glob '*.py' --glob '!backend/tests/**'
rg -n "compile_pdf|repair_source|latex\.log|kind=\"latex\"|\"latex\"" backend --glob '*.py' --glob '!backend/tests/**'
python3 -m py_compile backend/api/runs.py backend/main.py backend/core/runs.py backend/context/budget.py backend/context/builder.py backend/context/extraction.py backend/providers/mock.py backend/pipelines/essay_html.py backend/pipelines/slides_html.py backend/pipelines/cheat_sheet_html.py
```

Also passed a temp SQLite/workspace smoke run through the public `create_run()` path using the `essay_latex` compatibility intent. The run routed to `essay_html`, wrote `output/main.html` and `output/main.pdf`, and wrote `convert_pdf` rather than `compile_pdf` in `logs/generation.log`.

## Blockers

None.

## Risks and Follow-Up

- Existing backend tests still reference old LaTeX modules and log names. This is expected until task 010 migrates the pipeline unit tests.
- Frontend copy and preview behavior may still mention LaTeX-oriented artifact assumptions. That is intentionally left for task 009.

## Contract Notes

- External intent names were preserved for API compatibility.
- Internal pipeline routing now maps PDF-producing teaching artifacts to HTML-native pipeline names.
- No database schema or frontend code was changed.
