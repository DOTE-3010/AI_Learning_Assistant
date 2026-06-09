<!--
Owner: agent
Last Reviewed: 2026-06-09
Status: Pending
-->

# Task 000: Web Browser QA Baseline

## Goal

Verify that the full phase-1 product works correctly when accessed through Docker Compose plus a standard browser at `http://127.0.0.1:14242/ui/`, without any Electron dependency. Establish the Docker plus browser workflow as the primary development and QA surface.

## Source Context

- `docs/TASKS/README.md`: three-phase queue strategy.
- `docs/SPEC.md`: phase-1 product acceptance criteria.
- `docs/CONTRACTS/ui-workbench.md`: workbench layout and behavior contract.
- `docs/ARCH.md`: module boundaries.
- `AGENTS.md`: agent discipline.

## Scope

### Touch

- Docker Compose configuration and backend startup.
- Frontend static serving through the backend at `/ui/`.
- Verify all core web workflows work in browser (auth, settings, upload, run, preview).
- Document the standard browser-based dev/QA workflow.

### Do Not Touch

- Electron shell code (`apps/desktop/`). Do not modify or test Electron in this task.
- Launcher scripts (`run_desktop.command`, `run_desktop.bat`). These are Phase 3 concerns.
- Backend logic, pipelines, or storage. Only verify they work; do not change them unless a blocker is found.

## Verification Steps

1. Start the Docker runtime:

```bash
docker compose -p ai-learning-assistant up --build -d
```

2. Confirm backend health:

```bash
curl -fsS http://127.0.0.1:14242/health
```

3. Open workbench in browser and verify:

```bash
open http://127.0.0.1:14242/ui/
```

4. Verify these browser-level behaviors:
   - Workbench loads without console errors.
   - Registration and login flow works.
   - Locale switching (EN / zh-Hans / zh-Hant) works without layout overflow.
   - Model settings editor opens and saves.
   - File upload control accepts phase-1 file types.
   - Run creation with explicit artifact type submits and shows status.
   - Artifact preview panel renders results.
   - Context budget dial reflects input state.

5. Run backend and frontend automated tests:

```bash
.venv/bin/python -m pytest backend/tests -q
npm --prefix frontend run test
```

6. Run end-to-end smoke:

```bash
./scripts/smoke_e2e.sh
```

## Acceptance Criteria

- Docker runtime starts and serves the workbench at `/ui/` in a browser.
- All automated tests pass.
- E2E smoke passes.
- No Electron dependency is required for any verification step.
- Human can begin Phase 2 E2E testing directly in the browser.

## Non-Goals

- Fixing Electron-specific issues.
- Adding new product features.
- Live model provider testing (mocked paths are sufficient).
