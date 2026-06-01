# Visual System: Artifact Studio

## Purpose

This file gives implementation tasks a stable visual system before the workbench rebuild. Use it with `frontend/src/design-tokens.css` and the prompt briefs in this folder.

## Product Feel

The app is a focused artifact studio for academic work. It should feel tactile, precise, and calm: closer to a premium code editor plus document studio than a course dashboard. The first screen should show usable creation controls, context state, and output previews, not a marketing hero.

## Palette

Use the CSS variables in `frontend/src/design-tokens.css` as the source of truth.

- Base: graphite green-black surfaces, not default slate-blue dashboard panels.
- Text: soft off-white for primary text, muted sage-gray for secondary text.
- Product accents: teal for active/good state, restrained blue for selection, amber for warning, coral for critical/failure, plum only as a small secondary accent.
- Paper/code contrast: warm paper for essay/PDF previews, dark green-black code surfaces for code and notebook previews.

Avoid single-hue palettes. A screen should never read as all blue, all purple, all beige, or all dark slate.

## Typography

- Sans: Inter for interface copy.
- Mono: JetBrains Mono for tokens, file paths, model ids, run stages, and code affordances.
- Keep labels compact and tool-like. Avoid large explanatory panels inside the app.
- Do not use viewport-scaled type. Keep letter spacing at `0` except tiny uppercase metadata labels where existing UI requires it.

## Spacing And Shape

- Use 8px as the primary spacing rhythm.
- Cards and framed tools should use 6px or 8px radius by default; 12px is reserved for larger preview panes or modals.
- Do not nest cards inside cards.
- Keep controls dense enough for repeated work: segmented controls, icon buttons, menus, toggles, and compact file rows over decorative panels.

## Context Dial

The context dial is a signature product element.

- State vocabulary is fixed: `ok`, `warning`, `critical`.
- Geometry stays stable across states; color and intensity change.
- Default view is a compact dial/gauge with no large numeric table.
- Hover/focus reveals exact estimated input, output, total, limit, utilization, warning level, and source without resizing the layout.
- Use `--context-ok`, `--context-warning`, and `--context-critical`.

## Named Assets

- `textures/workbench-background-texture.webp`
- `previews/context-budget-dial-ok.webp`
- `previews/context-budget-dial-warning.webp`
- `previews/context-budget-dial-critical.webp`
- `previews/artifact-preview-code.webp`
- `previews/artifact-preview-essay.webp`
- `previews/artifact-preview-slides.webp`
- `previews/artifact-preview-cheat-sheet.webp`

## Asset Discipline

- Prompt notes live in `docs/ASSET_PROMPTS/`.
- Generated UI assets live in `frontend/src/assets/`.
- Do not include private course materials, real student names, real university marks, API keys, or paid asset credentials.
- Prefer UI-native CSS/SVG/canvas for simple icons and state diagrams; use bitmap generation for textures, rich previews, and visual references.
