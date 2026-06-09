<!--
Owner: project-maintainer
Status: Completed
Phase: 2 — Pipeline Migration
Depends: 004, 005, 006, 007
-->

# Task 008: Update Context Builder and Run Orchestration

## Goal

Update the run orchestration layer and context builder to work cleanly with the new HTML pipelines, removing any LaTeX-specific references while preserving course context, revision context, and timing instrumentation.

## Scope

### Touch

- `backend/core/runs.py`: ensure all execute functions pass `pdf_converter` instead of `latex_compiler`. Remove any `LatexMkCompiler` instantiation. Clean up imports.
- `backend/context/builder.py`: verify no LaTeX-specific assumptions. Should work as-is since it builds context bundles agnostic to output format.
- `backend/pipelines/router.py`: verify routing is clean after task 004–006 updates.
- `backend/main.py`: update the app startup to instantiate the Playwright converter (singleton or per-request) instead of any LaTeX compiler.
- `backend/timing.py`: verify timing stages use updated names (e.g. `convert_pdf` instead of `compile_pdf`).

### Do Not Touch

- Frontend code.
- Database schema.
- Storage layer.

## Steps

1. In `backend/core/runs.py`:
   - Remove imports of `LatexMkCompiler`, `LatexCompiler`, `LatexCompileError`.
   - Add import of `PlaywrightPdfConverter` (or the converter protocol).
   - In `create_run()` or the run executor factory, instantiate the converter.
   - Update `execute_essay_latex_run`, `execute_beamer_slides_run`, `execute_cheat_sheet_run` to pass `pdf_converter=converter` instead of `latex_compiler=compiler`.
   - Rename timing stage constants: `compile_pdf` → `convert_pdf` where applicable.

2. In `backend/main.py`:
   - Remove any LaTeX compiler setup.
   - Add Playwright converter initialization (consider lifecycle: create once at startup, reuse for all runs).

3. In `backend/pipelines/router.py`:
   - Verify the intent-to-pipeline mapping uses the new function names.

4. In `backend/timing.py` (if it has stage name constants):
   - Update stage names from LaTeX terminology to HTML terminology.

5. Verify the full import chain works:
   ```bash
   .venv/bin/python -c "from backend.main import app; print('OK')"
   ```

## Verification Commands

```bash
.venv/bin/python -c "from backend.main import app; print('FastAPI app OK')"
.venv/bin/python -c "from backend.core.runs import create_run; print('runs OK')"
grep -r "LatexMk\|latex_compiler\|LatexCompil" backend/ --include="*.py" | grep -v "__pycache__" | grep -v test
```

## Acceptance Criteria

- No references to `LatexMkCompiler`, `LatexCompiler`, or `latex_compiler` in non-test backend code.
- The Playwright converter is instantiated at app startup or on demand.
- Timing stages use `convert_pdf` instead of `compile_pdf` for HTML-to-PDF steps.
- `backend/main.py` imports and starts without errors.
- Context builder remains unchanged (it's format-agnostic).

## Non-Goals

- Do not change the external API contract (intent names, request/response shapes).
- Do not modify frontend or database.
- Do not update tests (task 010).
