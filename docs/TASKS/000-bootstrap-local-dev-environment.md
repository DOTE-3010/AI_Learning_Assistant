# Task: Bootstrap Local Dev Environment

## Goal

Make backend and frontend verification commands runnable from a fresh checkout before feature work begins.

## Source Context

- `AGENTS.md`: Commands
- `docs/RULES.md`: Testing Rules
- `docs/ARCH.md`: Canonical Phase-1 Layout

## Scope

### Touch

- Development dependency files.
- Makefile or lightweight setup notes if needed.
- No product source code unless a test bootstrap import is broken.

### Do Not Touch

- Do not implement product features.
- Do not change runtime Docker dependencies unless tests require a separated dev dependency.
- Do not restore the legacy `venv/`; use `.venv/`.

## Requirements

- Provide a repo-local backend dev environment path using `.venv/`.
- Ensure pytest is installed through a tracked dev dependency path.
- Ensure frontend build dependencies remain installable through `frontend/package-lock.json`.
- Keep `.venv/` untracked.

## Acceptance Criteria

- Backend dev env can be created with the command in `AGENTS.md`.
- Backend tests run through `.venv/bin/python -m pytest backend/tests -q`.
- Frontend build still runs through `npm --prefix frontend run build`.
- No command depends on the stale legacy `venv/` path.

## Verification

- `python3 -m venv .venv && .venv/bin/python -m pip install --upgrade pip && .venv/bin/python -m pip install -r backend/requirements-dev.txt`
- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run build`

## Risks

- Dependency installation may need network access. If it cannot run in a sandboxed agent session, record the blocker and the exact command that needs approval.

## Handoff Notes

- Cursor should review: whether dev dependencies stay out of production Docker runtime.
- Human should decide: whether to delete the stale `venv/` folder locally after `.venv/` is confirmed.
