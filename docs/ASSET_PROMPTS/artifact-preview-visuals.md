# Asset: artifact-preview-{code,essay,slides,cheat-sheet}.webp

## Purpose

Preview placeholders for the four artifact modes before real generated files are available. They should look like inspectable academic outputs, not marketing cards.

## Prompt

Create four coherent preview images for an academic AI artifact studio, each showing a realistic generated output surface. Use the same camera angle, lighting, and visual system across all four. `code` shows a compact Python/notebook workspace with syntax blocks and test notes. `essay` shows a LaTeX report page with section structure and bibliography hints. `slides` shows a Beamer slide stack with a title slide and dense diagram slide. `cheat-sheet` shows an A4 dense multi-column study sheet with formulas, tables, and compact diagrams. Use fictional unreadable microtext only; no real course content, no private data, no university branding. The previews should be crisp, product-state-oriented, and usable inside a workbench preview panel.

## Constraints

- 1600 x 1000 px per artifact type
- opaque background
- same layout family and lighting across all four previews
- content should be plausible but not readable enough to imply real private material
- include file/source cues through shapes and layout, not visible explanatory text
- forbidden motifs: stock students, campus photos, admin dashboards, generic charts, real assignments, real logos

## Output

- target paths:
  - `frontend/src/assets/previews/artifact-preview-code.webp`
  - `frontend/src/assets/previews/artifact-preview-essay.webp`
  - `frontend/src/assets/previews/artifact-preview-slides.webp`
  - `frontend/src/assets/previews/artifact-preview-cheat-sheet.webp`
- target format: WebP
