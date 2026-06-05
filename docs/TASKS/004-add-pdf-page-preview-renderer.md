# Task: Add PDF Page Preview Renderer

## Goal

Render real generated PDF pages for essay, Beamer slides, and cheat-sheet artifacts inside the workbench.

## Source Context

- `docs/CONTRACTS/ui-workbench.md`: Artifact Preview Modes and PDF fallback order.
- `docs/CONTRACTS/artifact-access.md`: authenticated PDF byte access.
- `docs/CONTRACTS/visual-assets.md`: PDF, slide, and cheat-sheet preview surfaces.
- PDF.js official documentation: `https://mozilla.github.io/pdf.js/getting_started/`.
- Vite worker/static asset documentation: `https://vite.dev/guide/features.html`.

## Scope

- Touch: frontend PDF preview code, frontend package files if a dependency such as `pdfjs-dist` is added, styles/locales/tests.
- Do not touch: backend generation pipelines, artifact filesystem layout, LaTeX compilation, Electron shell.

## Requirements

- Fetch generated PDF bytes through the authenticated artifact access API and render page previews in-app.
- Use PDF.js display APIs or an equivalent safe blob/canvas renderer; configure the worker/static assets so Vite dev and production builds both work.
- Provide page count/position controls for essay PDFs, slide position for Beamer, and dense A4 scale cues for cheat sheets.
- If PDF rendering fails, show a clear localized renderer error and preserve source/log/open/reveal affordances.

## Acceptance Criteria

- A succeeded essay run displays at least the first real PDF page in the preview panel.
- Beamer and cheat-sheet previews render real PDF pages with artifact-specific chrome instead of static skeletons.
- Renderer failure is distinct from generation failure and does not hide available files.
- Frontend build succeeds with the chosen PDF renderer and worker configuration.

## Verification

- `npm --prefix frontend run test`
- `npm --prefix frontend run build`

## Handoff Notes

- Cursor should review: dependency size/licensing, worker bundling, object URL cleanup, and behavior in Electron-served `/ui/`.
- Human should decide: whether thumbnail navigation or first-page-only rendering is sufficient for phase 1.
