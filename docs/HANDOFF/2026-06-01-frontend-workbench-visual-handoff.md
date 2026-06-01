# Handoff: Frontend Workbench Visual Rebuild

Status: Ready For Next Agent
Last Reviewed: 2026-06-01

## Summary

The frontend visual direction is ready for task 018 implementation. Governance now requires a warm editorial artifact studio rather than a sci-fi/dashboard surface: serif-led headings, warm graphite/ink shell, parchment/ivory preview surfaces, clay/terracotta primary accents, muted sage/amber/coral state color, purposeful motion, and English/Simplified Chinese/Traditional Chinese UI copy.

## Start Here

- `AGENTS.md`
- `docs/SPEC.md`
- `docs/ARCH.md`
- `docs/RULES.md`
- `docs/CONTRACTS/ui-workbench.md`
- `docs/CONTRACTS/visual-assets.md`
- `docs/ASSET_PROMPTS/README.md`
- `docs/TASKS/018-redesign-conversational-preview-workbench.md`

## Implementation Guidance

- Implement task 018 only; do not touch backend code or backend contracts.
- Partial refactor is acceptable. Preserve working frontend API/auth/model/upload/run-status logic when it follows documented contracts.
- Add a locale catalog or equivalent boundary for `en`, `zh-Hans`, and `zh-Hant` before moving large UI copy. Chinese copy should be serious written language.
- Rework design tokens around serif/sans/mono font stacks and the warm editorial palette before polishing components.
- Rebuild the current UI into production console plus persistent artifact preview. Avoid support-chat bubbles, course dashboards, sci-fi glow, and generic SaaS cards.
- Keep generated artifacts preview-only. Copy/open/reveal/regenerate/follow-up are allowed; direct saved editing is not.
- Use CSS/Web Animations first for motion; only add JSON/Lottie/Rive if clearly justified and reduced-motion-aware.

## Generated Static Assets

These PNG assets are present and ready to use as placeholders or visual references:

- `frontend/src/assets/textures/workbench-background-texture.png`
- `frontend/src/assets/previews/artifact-preview-code.png`
- `frontend/src/assets/previews/artifact-preview-essay.png`
- `frontend/src/assets/previews/artifact-preview-slides.png`
- `frontend/src/assets/previews/artifact-preview-cheat-sheet.png`
- `frontend/src/assets/previews/context-budget-dial-ok.png`
- `frontend/src/assets/previews/context-budget-dial-warning.png`
- `frontend/src/assets/previews/context-budget-dial-critical.png`
- `frontend/src/assets/previews/auth-entry-preview.png`
- `frontend/src/assets/previews/empty-workbench-preview.png`

The three context dial assets were normalized to 512x512 RGBA PNGs with transparent backgrounds and matching geometry. The artifact/auth/empty preview images are good first-pass placeholders, though several contain English-like UI chrome; prefer rendering real localized UI text in the frontend rather than relying on embedded image text.

## Verification Expected For Task 018

- `npm --prefix frontend run build`
- Visual QA at 100% browser zoom for desktop and narrow widths in `en`, `zh-Hans`, and `zh-Hant`
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Human Decisions

- Exact syntax-highlighting/editor renderer remains open.
- Exact PDF renderer remains open.
- Motion assets can remain deferred unless implementation proves they improve preview hydration or revision replacement.
