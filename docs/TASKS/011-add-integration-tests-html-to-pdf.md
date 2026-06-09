<!--
Owner: project-maintainer
Status: Pending
Phase: 3 — Testing
Depends: 010
-->

# Task 011: Add Integration Tests for HTML-to-PDF

## Goal

Create integration tests that verify real HTML-to-PDF conversion inside the Docker container with Playwright/Chromium, ensuring the full pipeline produces valid PDFs.

## Scope

### Touch

- `backend/tests/test_html_to_pdf_integration.py` (new): real Playwright conversion tests.
- `backend/tests/integration/` (new directory if needed): integration test fixtures.
- `backend/tests/fixtures/` (new or existing): sample HTML files for testing.

### Do Not Touch

- Production pipeline code.
- Unit tests (task 010).
- Frontend code.

## Steps

1. Create sample HTML fixture files under `backend/tests/fixtures/`:
   - `sample_essay.html`: minimal academic essay HTML with KaTeX math, print CSS.
   - `sample_slides.html`: 3-slide deck using deck.css layout (960×540, section.slide structure).
   - `sample_cheat_sheet.html`: dense multi-column A4 HTML with small fonts and grid layout.

2. Create `backend/tests/test_html_to_pdf_integration.py`:
   - Mark tests with `@pytest.mark.integration` (or `@pytest.mark.skipif` when Playwright/Chromium is unavailable).
   - Test essay conversion:
     - Convert `sample_essay.html` to PDF with A4 page config.
     - Verify output file exists and starts with `%PDF`.
     - Verify file size is reasonable (> 1KB).
   - Test slides conversion:
     - Convert `sample_slides.html` to PDF with SLIDES_PAGE config.
     - Verify output PDF exists.
     - Optionally verify page count matches slide count (using pypdf).
   - Test cheat-sheet conversion:
     - Convert `sample_cheat_sheet.html` to PDF with A4 config.
     - Verify output PDF exists.
   - Test error handling:
     - Convert a non-existent HTML file → should raise ConvertError.
     - Convert empty HTML → should still produce a (possibly empty) PDF or raise gracefully.

3. Add a pytest marker configuration in `pytest.ini` or `pyproject.toml`:
   ```ini
   [pytest]
   markers =
       integration: tests requiring Playwright/Chromium (may be skipped locally)
   ```

4. Run integration tests inside Docker:
   ```bash
   docker compose -p ai-learning-assistant run --rm backend python -m pytest backend/tests/test_html_to_pdf_integration.py -v
   ```

## Verification Commands

```bash
# Inside Docker (where Chromium is available):
docker compose -p ai-learning-assistant run --rm backend python -m pytest backend/tests/test_html_to_pdf_integration.py -v

# Locally (skip if no Chromium):
.venv/bin/python -m pytest backend/tests/test_html_to_pdf_integration.py -v -m "not integration" || echo "Integration tests skipped (no Chromium)"
```

## Acceptance Criteria

- Sample HTML fixtures exist for all three document types.
- Integration tests pass inside the Docker container.
- Tests verify real PDF output (file exists, starts with `%PDF`, reasonable size).
- Tests can be skipped gracefully when run locally without Chromium.
- Error handling is tested (missing file, empty input).

## Non-Goals

- Do not test visual PDF correctness (pixel comparison is out of scope).
- Do not test with real LLM output (that's E2E scope).
- Do not modify production code.
