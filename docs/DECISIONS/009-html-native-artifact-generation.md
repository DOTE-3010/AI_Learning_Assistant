<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Accepted
-->

# ADR 009: HTML-Native Artifact Generation

## Context

The phase-1 implementation used LaTeX (TeX Live + latexmk inside Docker) to generate PDF artifacts for essays, Beamer slides, and cheat sheets. This approach introduced significant complexity:

- A ~400 MB TeX Live distribution in the Docker image.
- Frequent compile failures from LLM-generated LaTeX requiring a model-assisted repair pass.
- Specialized sanitization code for diagram placeholders, remote images, and TikZ node alignment.
- Cryptic error messages that make automated repair fragile.
- Long compile times (seconds per document) adding to user-perceived latency.

## Decision

Replace LaTeX-based PDF generation with HTML-native rendering and HTML-to-PDF conversion using Playwright (headless Chromium).

- **Essay** pipeline generates a self-contained HTML document styled for academic print layout, converted to PDF via Playwright's `page.pdf()`.
- **Slides** pipeline generates a multi-slide HTML deck following the `slides_html/shared/deck.css` layout system (960×540 px slides, CSS print pagination at 10in × 5.625in), converted to PDF via Playwright.
- **Cheat sheet** pipeline generates a dense multi-column HTML document with CSS `@page` targeting A4 at the requested page count, converted to PDF via Playwright.
- **Code homework** pipeline is unchanged: it outputs `.py` or `.ipynb` natively.

The generated HTML intermediate is the source artifact (replacing `.tex`). The PDF is the compiled output (same role as before). Both are persisted.

## Slide Layout Reference

Generated slides must follow the deck structure demonstrated in `slides_html/`:

- Each slide is a `<section class="slide">` with fixed 960×540 px dimensions.
- A shared CSS vocabulary provides grids, cards, callouts, code boxes, tables, flow diagrams, and number lists.
- Print media uses `@page { size: 10in 5.625in; margin: 0; }` with `page-break-after: always` between slides.
- No CUHK branding or logo in generated output. The accent color and course-kicker line are task-driven.

## Consequences

- Docker image loses ~400 MB of TeX Live packages and gains a Playwright/Chromium runtime (~300 MB for the browser binary, but shared with potential future uses).
- The entire LaTeX repair pass, diagram sanitizer, and TikZ node fixup code can be removed.
- HTML is vastly more tolerant of imperfect LLM output; compile failures become near-impossible.
- Math rendering uses KaTeX (included as inline CSS/JS in generated HTML); quality is high for typical academic content.
- The generated `.html` source is directly previewable in the workbench browser panel without PDF.js.
- PDF output remains the final deliverable; users also receive the `.html` intermediate for inspection.
- Frontend preview becomes trivial: serve the HTML in an iframe or render inline.
- Existing pipeline tests and contracts need migration.
- The `intent` enum values remain unchanged (`essay_latex` → may be renamed `essay` in a future breaking change, but the current migration keeps the enum stable and changes only the internal implementation).

## Alternatives Considered

- **Typst**: Most elegant single-binary typesetter with sub-30ms compilation. Rejected for phase-1 migration because LLM training data coverage is still limited compared to HTML, and the product gains more from HTML's browser-native preview integration.
- **WeasyPrint**: Lighter Python-native HTML-to-PDF (~50 MB). Rejected because CSS Grid support is incomplete and cheat-sheet dense layouts require full CSS3.
- **Keep LaTeX with better sanitization**: Rejected because the fundamental problem (LLMs produce syntactically fragile LaTeX) is structural, not solvable by more regex passes.

## Status

Accepted by human decision on 2026-06-09.
