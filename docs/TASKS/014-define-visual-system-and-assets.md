# Task: Define Visual System And Asset Briefs

## Goal

Create the first concrete visual system for the consumer-grade artifact studio before rebuilding the workbench UI.

## Source Context

- `docs/SPEC.md`: UX Requirements
- `docs/ARCH.md`: Module Boundaries, Canonical Phase-1 Layout
- `docs/RULES.md`: Coding Rules
- `docs/CONTRACTS/ui-workbench.md`
- `docs/CONTRACTS/visual-assets.md`

## Scope

### Touch

- `frontend/src/assets/` directory structure.
- `docs/ASSET_PROMPTS/` prompt briefs.
- Optional lightweight design-token file in `frontend/` if the selected frontend stack supports it.

### Do Not Touch

- Do not implement the full workbench UI.
- Do not wire backend APIs.
- Do not add large binary assets unless the task explicitly generates or receives them.

## Requirements

- Define a warm editorial product visual direction that avoids generic SaaS dashboard styling, sci-fi styling, and brand-copying.
- Create prompt briefs for the first required static/dynamic assets.
- Define initial asset naming, warm color palette, serif/sans/mono typography, locale-aware CJK font fallback, spacing, and context dial state guidance.
- Keep generated asset files optional; prompt briefs are enough if generation is deferred.

## Acceptance Criteria

- `docs/ASSET_PROMPTS/` contains prompt briefs for the workbench background/texture, context dial states, and artifact preview visuals.
- `frontend/src/assets/` has the agreed folder structure or documented equivalent.
- UI implementation tasks can reference concrete names and design constraints.
- No real secrets or private course materials appear in prompts.

## Verification

- `npm --prefix frontend run build`
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Risks

- Visual direction can become too decorative. Keep assets tied to product state and artifact creation.

## Handoff Notes

- Cursor should review: whether the asset system blocks generic SaaS drift without over-constraining implementation.
- Human should decide: whether Codex should generate bitmap assets directly or provide prompts for manual generation.
