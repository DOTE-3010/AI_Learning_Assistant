# Task: Bootstrap Rebuild Skeleton

## Goal

Create the new repo skeleton for the Electron plus Docker rewrite without implementing product features.

## Source Context

- `docs/SPEC.md`: Product Intent, Constraints
- `docs/ARCH.md`: Module Boundaries, Canonical Phase-1 Layout, Migration Strategy
- `docs/RULES.md`: Coding Rules, Dependency Rules
- `docs/CONTRACTS/runtime-electron-docker.md`

## Scope

### Touch

- Root package/workspace files as needed.
- `apps/desktop/` for the Electron shell.
- Backend subpackages under `backend/` when placeholders are needed.
- Frontend subdirectories under `frontend/` when placeholders are needed.
- README/dev notes only if needed to explain the new skeleton.

### Do Not Touch

- Do not implement auth, generation, SQLite schema, or Electron startup logic.
- Do not delete legacy runtime files in this task unless they directly block skeleton creation.

## Requirements

- Establish a clear folder map matching `docs/ARCH.md`.
- Keep legacy code available until replacements land.
- Add minimal placeholder entrypoints only where build tools require them.
- Do not introduce `apps/web/` or `services/api/` in phase 1.

## Acceptance Criteria

- New folder layout exists and maps to Desktop Shell, Web Workbench, API Backend, and shared contracts if used.
- A fresh agent can identify where each future module should live.
- Existing tests are not broken by skeleton-only changes.

## Verification

- `git status --short`
- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Over-scaffolding can create unused abstractions. Keep placeholders minimal.

## Handoff Notes

- Cursor should review: whether the skeleton matches `docs/ARCH.md` without adding premature implementation.
- Human should decide: whether any future task needs to supersede the phase-1 layout with a decision record.
