# Task: Rebuild Web Workbench Shell

## Goal

Replace the legacy dashboard/chat UI with the first artifact studio workbench shell.

## Source Context

- `docs/SPEC.md`: UX Requirements
- `docs/ARCH.md`: Module Boundaries
- `docs/CONTRACTS/ui-workbench.md`
- `docs/CONTRACTS/visual-assets.md`
- `docs/CONTRACTS/auth.md`

## Scope

### Touch

- Frontend app structure.
- Auth screens.
- Workbench layout shell.
- Frontend build configuration if needed.

### Do Not Touch

- Do not generate large polished binary assets in this task.
- Do not implement Electron shell.
- Do not wire every generation pipeline control if backend endpoints are not ready.

## Requirements

- First authenticated screen is the artifact studio, not a course dashboard.
- Provide task input, intent selector, upload area placeholder, search mode control, run button placeholder, and output panel placeholder.
- Preserve weak auth UI flow.
- Use the visual system and asset names defined by task 014.

## Acceptance Criteria

- Frontend builds successfully.
- User can see login/register and workbench shell.
- Workbench shell matches `ui-workbench.md` control inventory at placeholder level.
- Workbench shell avoids generic admin/dashboard composition.
- Legacy course/assignment-first navigation is no longer primary in the rebuilt UI path.

## Verification

- `npm --prefix frontend run build`

## Risks

- Design can sprawl. Keep this task structural; polish and context dial are separate tasks.

## Handoff Notes

- Cursor should review: product flow, not pixel polish.
- Human should decide: whether visual asset generation should happen before the context dial task.
