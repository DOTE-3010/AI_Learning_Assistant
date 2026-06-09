<!--
Owner: project-maintainer
Status: Pending
Phase: 3 — Testing
Depends: 004, 005, 006, 007, 008
-->

# Task 010: Migrate Pipeline Unit Tests

## Goal

Rewrite the pipeline unit tests to cover the new HTML generation and PDF conversion pipelines, replacing the old LaTeX compilation tests.

## Scope

### Touch

- `backend/tests/test_essay_pipeline.py` (or equivalent): rewrite for HTML pipeline.
- `backend/tests/test_beamer_pipeline.py` (or equivalent): rewrite for slides HTML pipeline.
- `backend/tests/test_cheat_sheet_pipeline.py` (or equivalent): rewrite for cheat-sheet HTML pipeline.
- `backend/tests/test_latex_diagram_policy.py`: delete entirely (LaTeX sanitizer removed).
- `backend/tests/test_html_to_pdf.py` (new): unit tests for the Playwright converter module.
- `backend/tests/conftest.py`: add mock PDF converter fixture.

### Do Not Touch

- `backend/tests/test_code_homework_pipeline.py` (code pipeline unchanged).
- Frontend tests (separate task).
- Production pipeline code (already done in tasks 004–008).

## Steps

1. Delete `backend/tests/test_latex_diagram_policy.py`.

2. Create a mock PDF converter for testing:
   ```python
   class MockPdfConverter:
       def __init__(self, *, should_fail=False):
           self.should_fail = should_fail
           self.calls = []

       def convert(self, *, html_path, pdf_path, page_config):
           self.calls.append({"html_path": html_path, "pdf_path": pdf_path})
           if self.should_fail:
               raise ConvertError("Mock conversion failure", log_text="mock error log")
           pdf_path.write_bytes(b"%PDF-1.4 mock")
           return ConvertResult(pdf_path=pdf_path, log_text="mock convert OK")
   ```
   Add this to `conftest.py` as a fixture.

3. Rewrite essay pipeline tests:
   - Test successful generation: mock model returns HTML, mock converter produces PDF.
   - Test conversion failure: mock converter raises ConvertError.
   - Test model provider failure: mock raises ModelProviderError.
   - Verify `main.html` and `main.pdf` are written on success.
   - Verify `convert.log` is written on failure.

4. Rewrite slides pipeline tests:
   - Same pattern as essay tests.
   - Verify `slides.html` and `slides.pdf` are written.
   - Verify the page config uses SLIDES_PAGE (10in × 5.625in).

5. Rewrite cheat-sheet pipeline tests:
   - Same pattern.
   - Verify `cheat-sheet.html` and `cheat-sheet.pdf` are written.
   - Verify target_pages validation still works.
   - Verify extraction log is still produced.

6. Create `test_html_to_pdf.py`:
   - Test the converter with a minimal HTML file (requires Playwright to be installed, may skip in CI without browser).
   - Test ConvertError is raised on invalid input.
   - Test page config is applied correctly.

7. Run all tests:
   ```bash
   .venv/bin/python -m pytest backend/tests -q
   ```

## Verification Commands

```bash
.venv/bin/python -m pytest backend/tests -q
.venv/bin/python -m pytest backend/tests/test_essay_pipeline.py -v
.venv/bin/python -m pytest backend/tests/test_html_to_pdf.py -v
```

## Acceptance Criteria

- All pipeline tests pass with mock model provider and mock PDF converter.
- No test references LaTeX, TeX, or latexmk.
- `test_latex_diagram_policy.py` is deleted.
- The mock converter fixture is available in conftest.
- Tests cover: success path, conversion failure, provider failure for each pipeline.
- `test_html_to_pdf.py` covers the converter module interface.

## Non-Goals

- Do not require Playwright/Chromium in the local test environment (mock the converter for unit tests).
- Do not test the actual Chromium rendering (that's integration testing in task 011).
