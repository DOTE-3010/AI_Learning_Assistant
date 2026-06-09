<!--
Owner: project-maintainer
Status: Pending
Phase: 2 — Pipeline Migration
Depends: 004, 005, 006
-->

# Task 009: Update Frontend Preview for HTML Artifacts

## Goal

Update the frontend workbench to preview generated HTML artifacts natively (via iframe or inline rendering) instead of relying solely on PDF.js for essay/slides/cheat-sheet previews.

## Scope

### Touch

- `frontend/src/app.js`: update artifact preview logic.
- `frontend/src/workbench-core.js`: update file extension handling and preview rendering.
- `frontend/src/styles.css`: add/update styles for HTML preview iframe.
- `frontend/src/locales.js`: update any locale strings that reference LaTeX.

### Do Not Touch

- Backend API contracts (no changes needed, just different file extensions in manifests).
- Database schema.
- Docker configuration.

## Steps

1. In the artifact preview component:
   - When a run succeeds and the manifest lists `.html` outputs, render the HTML in a sandboxed iframe.
   - The iframe should use `srcdoc` with the HTML content fetched from the artifact access API, or use `src` pointing to the artifact byte endpoint.
   - Apply `sandbox="allow-same-origin"` to prevent script execution while allowing CSS rendering.
   - For slides: the iframe naturally shows the deck layout. Consider adding slide navigation (previous/next) by scrolling the iframe to each `.slide` section.

2. Update file extension handling:
   - Where the code checks for `.tex` files as "source" artifacts, change to `.html`.
   - Where the code renders `.pdf` previews, keep that as a secondary option (PDF still exists).
   - The preview priority should be: HTML source (inline preview) > PDF (if HTML rendering fails).

3. Update locale strings:
   - Any references to "LaTeX source" → "HTML source".
   - Any references to "LaTeX compilation" → "PDF conversion".
   - Update all three locales (en, zh-Hans, zh-Hant).

4. Add iframe styling:
   - The preview iframe should fill the artifact preview panel.
   - Add a border/shadow to frame the content.
   - For slides: consider a slide-like aspect ratio container.

5. Build and verify:
   ```bash
   npm --prefix frontend run build
   ```

## Verification Commands

```bash
npm --prefix frontend run build
npm --prefix frontend run test
```

## Acceptance Criteria

- Generated HTML artifacts render inline in the preview panel via sandboxed iframe.
- Slides preview shows the deck layout with correct 960×540 slide dimensions.
- File tabs show `.html` source and `.pdf` output.
- No references to "LaTeX" in user-facing locale strings.
- Frontend builds without errors.
- Preview works in all three locales.

## Non-Goals

- Do not add direct HTML source editing (phase 1 is preview-only).
- Do not implement slide navigation controls (nice-to-have, not required).
- Do not change backend API endpoints.
