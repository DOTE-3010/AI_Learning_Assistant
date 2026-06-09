<!--
Owner: project-maintainer
Status: Completed
Phase: 2 — Pipeline Migration
Depends: 004, 005, 006
-->

# Task 007: Remove LaTeX Sanitizer and Repair Modules

## Goal

Delete all LaTeX-specific pipeline code that is no longer needed after the HTML migration. This includes the diagram sanitizer, TikZ fixups, LaTeX compiler interface, and repair pass.

## Scope

### Touch

- `backend/pipelines/essay_latex.py`: delete entirely (replaced by `essay_html.py`).
- `backend/pipelines/beamer_slides.py`: delete entirely (replaced by `slides_html.py`).
- `backend/pipelines/cheat_sheet.py`: delete entirely (replaced by `cheat_sheet_html.py`).
- `backend/pipelines/latex_diagrams.py`: delete entirely (no longer needed).
- `backend/pipelines/common.py`: review and keep only utilities still used by new pipelines (`extract_fenced_or_raw`, `format_log`, `format_citations`, `PipelineResult`, `PipelineError`).
- Any imports in `backend/pipelines/__init__.py` that reference deleted modules.

### Do Not Touch

- `backend/pipelines/code_homework.py` (unchanged, outputs .py/.ipynb).
- `backend/pipelines/html_to_pdf.py` (new, from task 002).
- Frontend code.
- Database schema.

## Steps

1. Verify tasks 004, 005, 006 are complete and the new pipelines are working.
2. Delete the old pipeline files:
   ```bash
   rm backend/pipelines/essay_latex.py
   rm backend/pipelines/beamer_slides.py
   rm backend/pipelines/cheat_sheet.py
   rm backend/pipelines/latex_diagrams.py
   ```
3. Update `backend/pipelines/__init__.py` to remove any references to deleted modules.
4. Update `backend/pipelines/common.py`:
   - Keep: `PipelineError`, `PipelineResult`, `extract_fenced_or_raw`, `format_log`, `format_citations`.
   - Remove: any LaTeX-specific helpers if present.
5. Search for remaining imports of deleted modules across the codebase:
   ```bash
   grep -r "latex_diagrams\|essay_latex\|beamer_slides\|cheat_sheet" backend/ --include="*.py" | grep -v "__pycache__"
   ```
   Fix any remaining references.
6. Verify the backend still starts:
   ```bash
   .venv/bin/python -c "import backend.pipelines; print('OK')"
   ```

## Verification Commands

```bash
# No old modules importable
.venv/bin/python -c "
try:
    from backend.pipelines import essay_latex
    raise AssertionError('essay_latex should be deleted')
except (ImportError, ModuleNotFoundError):
    print('essay_latex: deleted OK')

try:
    from backend.pipelines import latex_diagrams
    raise AssertionError('latex_diagrams should be deleted')
except (ImportError, ModuleNotFoundError):
    print('latex_diagrams: deleted OK')
"

# New modules work
.venv/bin/python -c "from backend.pipelines.essay_html import run_essay_html_pipeline; print('OK')"
.venv/bin/python -c "from backend.pipelines.slides_html import run_slides_html_pipeline; print('OK')"
.venv/bin/python -c "from backend.pipelines.cheat_sheet_html import run_cheat_sheet_html_pipeline; print('OK')"
```

## Acceptance Criteria

- No files named `essay_latex.py`, `beamer_slides.py`, `cheat_sheet.py`, or `latex_diagrams.py` exist in `backend/pipelines/`.
- No Python imports reference the deleted modules.
- `backend/pipelines/common.py` retains only shared utilities used by the new HTML pipelines.
- The backend starts without import errors.

## Non-Goals

- Do not modify the code_homework pipeline.
- Do not update tests yet (task 010).
