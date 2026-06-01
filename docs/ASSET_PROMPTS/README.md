Status: Active
Last Reviewed: 2026-05-31

# Asset Prompts

Store prompts and generation notes for product visual assets here.

Each prompt file should follow `docs/CONTRACTS/visual-assets.md` and point to the intended output path under `frontend/src/assets/`.

Do not store real API keys, paid asset credentials, or private uploaded course materials in this folder.

## Product Direction

AI Learning Assistant should feel like a precise academic artifact studio: warm graphite surfaces, paper-like preview textures, crisp editor details, and restrained status color. It should not look like a generic dark SaaS dashboard, a course admin panel, or a marketing landing page.

Use assets to reveal product state:

- context budget and warning level
- artifact type and output format
- source-to-output generation progress
- preserved files after success or failure

Avoid vague abstract blobs, decorative gradients, fake charts, stock classroom imagery, private course material, real student names, or real university marks.

## Initial Prompt Briefs

- `visual-system.md` -> stable direction for colors, typography, spacing, and asset use
- `workbench-background-texture.md` -> `frontend/src/assets/textures/workbench-background-texture.webp`
- `context-budget-dial-states.md` -> `frontend/src/assets/previews/context-budget-dial-{ok,warning,critical}.webp`
- `artifact-preview-visuals.md` -> `frontend/src/assets/previews/artifact-preview-{code,essay,slides,cheat-sheet}.webp`

Motion assets are deferred until the static workbench and context dial are validated.
