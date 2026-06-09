<!--
Owner: project-maintainer
Status: Completed
Phase: 1 — Cleanup
-->

# Task 002: Add Playwright HTML-to-PDF Infrastructure

## Goal

Install Playwright with Chromium inside the Docker container and create a reusable HTML-to-PDF conversion module that all pipelines will use.

## Scope

### Touch

- `Dockerfile`: add Playwright installation and Chromium browser download.
- `backend/requirements.txt`: add `playwright` package.
- `backend/pipelines/html_to_pdf.py` (new): create the shared conversion module.
- `backend/pipelines/__init__.py`: export if needed.

### Do Not Touch

- Existing LaTeX pipeline files (removed in task 007).
- Frontend code.
- Database schema.

## Steps

1. Add `playwright` to `backend/requirements.txt`.
2. Update `Dockerfile`:
   ```dockerfile
   # After pip install
   RUN python -m playwright install --with-deps chromium
   ```
   This installs Chromium and all required system dependencies (libgbm, libasound, etc.) in one command.
3. Create `backend/pipelines/html_to_pdf.py` with:
   - A `HtmlToPdfConverter` protocol/interface:
     ```python
     class HtmlToPdfConverter(Protocol):
         def convert(self, *, html_path: Path, pdf_path: Path, page_config: PageConfig) -> ConvertResult: ...
     ```
   - A `PageConfig` dataclass with fields:
     - `width: str` (e.g. `"10in"`, `"210mm"`)
     - `height: str` (e.g. `"5.625in"`, `"297mm"`)
     - `margin: str` (e.g. `"0"`, `"20mm"`)
     - `landscape: bool` (default False)
   - A `PlaywrightPdfConverter` implementation that:
     - Launches a headless Chromium browser.
     - Opens the HTML file via `file://` URL.
     - Calls `page.pdf()` with the configured page dimensions.
     - Returns a `ConvertResult` with `pdf_path` and `log_text`.
   - A `ConvertError` exception with `message` and `log_text`.
   - Predefined page configs:
     - `SLIDES_PAGE = PageConfig(width="10in", height="5.625in", margin="0")` (matches deck.css @page)
     - `A4_PAGE = PageConfig(width="210mm", height="297mm", margin="20mm")`
     - `A4_NO_MARGIN = PageConfig(width="210mm", height="297mm", margin="0")`
4. Add a `backend/pipelines/deck_css.py` module that reads and returns the content of `slides_html/shared/deck.css` as a string constant (bundled at import time or read from a known path).
5. Verify the Docker build succeeds and the converter can be imported.

## Verification Commands

```bash
docker compose -p ai-learning-assistant build
docker compose -p ai-learning-assistant run --rm backend python -c "from backend.pipelines.html_to_pdf import PlaywrightPdfConverter; print('OK')"
docker compose -p ai-learning-assistant down
```

## Acceptance Criteria

- `playwright` is in `requirements.txt`.
- Chromium is installed in the Docker image.
- `backend/pipelines/html_to_pdf.py` exists with the converter protocol and Playwright implementation.
- The module is importable inside the Docker container.
- Predefined page configs for slides (10in × 5.625in) and A4 are defined.

## Non-Goals

- Do not write pipeline prompt code yet (tasks 004–006).
- Do not handle KaTeX embedding yet (part of pipeline tasks).
- Do not remove old LaTeX modules yet (task 007).
