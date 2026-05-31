<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Contract: Visual Assets And Product Aesthetic

## Purpose

Prevent the rebuilt UI from drifting into a generic SaaS dashboard. The product should feel like a refined consumer artifact studio for academic work: calm, precise, premium, and visually memorable.

## Asset Locations

```text
frontend/src/assets/
  brand/
  icons/
  motion/
  textures/
  previews/
docs/ASSET_PROMPTS/
  README.md
  <asset-name>.md
```

Generated bitmap assets belong in `frontend/src/assets/` when they are part of the product UI. Prompts, generation notes, and source references belong in `docs/ASSET_PROMPTS/`.

## Naming Rules

Use lowercase kebab-case names:

```text
artifact-studio-hero.webp
context-budget-dial-idle.webp
context-budget-dial-warning.webp
latex-preview-paper-texture.webp
pipeline-stage-code.svg
pipeline-stage-latex.svg
run-status-orbit.json
```

Asset names should describe product meaning, not generation technique.

## Visual System

- UI should be premium and consumer-grade, not admin-heavy.
- Avoid one-note dark blue/slate SaaS styling.
- Use restrained but distinctive color contrast across surfaces, controls, previews, and status.
- Use visual assets to reveal the actual product state: documents, code, slides, context budget, run status, output files.
- Do not use decorative gradient blobs, vague abstract background art, or giant marketing hero sections as the primary experience.
- Keep cards limited to tools, repeated items, modals, or previews. Do not nest cards inside cards.

## Context Dial

The context budget indicator is a signature visual element.

Default state:

- graphical dial, ring, or compact gauge
- no large numeric panel
- color/status conveys `ok`, `warning`, or `critical`

Hover/focus state:

- show exact estimated input, output, total, limit, utilization, warning level, and source
- do not resize surrounding layout

## Asset Prompt Format

Each generated asset prompt file should include:

```markdown
# Asset: <filename>

## Purpose
<where it appears and what it communicates>

## Prompt
<prompt to use in the image/video/motion generation tool>

## Constraints
- size/aspect ratio
- transparent or opaque background
- color/style notes
- forbidden motifs

## Output
- target path
- target format
```

## Visual QA

Before a UI task is complete:

- build must pass
- desktop and mobile-width layouts must avoid text overlap
- context dial hover/focus must reveal numbers without moving layout
- uploaded/generated preview areas must show real product state or deliberate placeholders

## Compatibility

- Additive: new named assets, new state variants, new prompt briefs.
- Breaking (review required): renaming an asset already referenced in code, or changing the context-dial state vocabulary (`ok`/`warning`/`critical`), which must stay aligned with `generation-pipeline.md`.

## Acceptance Checks

- Every committed nontrivial generated asset has a matching prompt note.
- Workbench UI uses the visual system instead of default dashboard composition.
- Context dial states are visually distinct and contract-compatible.
- Asset names are stable and meaningful.

## Open Questions

- Whether motion assets (`.json`/Lottie) are in phase-1 scope or deferred until the static visual system is validated.
