<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# QA Report: Task 002 Playwright HTML-to-PDF Infrastructure

## Scope

- Task file: `docs/TASKS/002-add-playwright-infrastructure.md`
- Modules covered: Docker runtime image, backend requirements, shared HTML-to-PDF converter, shared slide deck CSS loader.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `python3 -c "from backend.pipelines.html_to_pdf import PlaywrightPdfConverter, SLIDES_PAGE, A4_PAGE; from backend.pipelines.deck_css import get_deck_css; print('OK', SLIDES_PAGE.width, A4_PAGE.height, len(get_deck_css()))"` | Passed | Local import printed `OK 10in 297mm 14457`. |
| `docker compose -p ai-learning-assistant build` | Passed after fix | First build failed on `python:3.12-slim` because the floating tag resolved to Debian trixie and Playwright's dependency installer requested unavailable legacy font packages. Retest passed after pinning `python:3.12-slim-bookworm`. |
| `docker compose -p ai-learning-assistant run --rm backend python -c "from backend.pipelines.html_to_pdf import PlaywrightPdfConverter; from backend.pipelines.deck_css import get_deck_css; print('OK', PlaywrightPdfConverter.__name__, len(get_deck_css()))"` | Passed | Container import printed `OK PlaywrightPdfConverter 14457`. |
| `docker compose -p ai-learning-assistant run --rm backend python -c "... PlaywrightPdfConverter().convert(...)"` | Passed | Container conversion smoke generated `/tmp/task002-smoke.pdf` with size 10,953 bytes. |
| `docker compose -p ai-learning-assistant down` | Passed | Removed the temporary compose network created by the import check. |

## Blockers

- Fixed: Playwright `install --with-deps chromium` failed on the floating `python:3.12-slim` image after it resolved to Debian trixie; unavailable packages included `ttf-unifont` and `ttf-ubuntu-font-family`.

## Risks

- Residual build-time risk: first Docker builds now download Chromium and browser dependencies, so fresh builds are significantly slower and depend on Playwright CDN availability.
- No pipeline behavior risk was introduced yet; existing LaTeX pipelines are intentionally untouched until later migration tasks.

## Fixes Applied

- Added `playwright==1.49.1` to backend runtime requirements.
- Added Docker Playwright Chromium installation with `python -m playwright install --with-deps chromium`.
- Pinned the Docker base image to `python:3.12-slim-bookworm` so Playwright dependency installation uses a supported Debian package set.
- Copied `slides_html/` into the backend image so the shared deck CSS reference is available in containerized pipeline code.
- Added `backend/pipelines/html_to_pdf.py` with page config dataclasses, conversion result/error types, the converter protocol, predefined slide/A4 page configs, and a Playwright-backed converter.
- Added `backend/pipelines/deck_css.py` for reading `slides_html/shared/deck.css`.

## Retest Results

- Docker image build passed after the bookworm base-image fix.
- Container import check passed and confirmed the deck CSS is readable inside the image.
- Container conversion smoke passed and confirmed Chromium can launch and write a PDF.

## Human Decisions Needed

- None.
