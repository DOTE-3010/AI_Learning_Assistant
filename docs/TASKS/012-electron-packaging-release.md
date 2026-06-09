<!--
Owner: agent/human
Last Reviewed: 2026-06-09
Status: Blocked (on tasks 000–011 and human QA approval)
-->

# Task 012: Electron Packaging for Release

## Goal

After the web product passes human E2E QA in the browser, re-wrap into the Electron desktop shell and verify Electron-specific behavior. Prepare the packaged desktop application for release.

## Source Context

- `docs/TASKS/README.md`: three-phase queue strategy.
- `docs/IMPLEMENTATION_SUMMARY.md`: task 020 (Electron scaffold) and task 021 (Compose/launchers).
- `docs/ARCH.md`: Electron shell as distribution wrapper.
- `AGENTS.md`: desktop checks and launch smoke commands.

## Prerequisite

Phase 2 (human E2E on web) must be declared complete by the human before this task begins. All web-layer functional issues must be resolved first.

## Scope

### Touch

- `apps/desktop/`: Electron main process, preload, window behavior.
- Electron launcher scripts: `run_desktop.command` (macOS), `run_desktop.bat` (Windows).
- Docker detection and startup from Electron.
- Electron-specific test and smoke commands.

### Do Not Touch

- Backend logic, API contracts, or pipelines. These are validated in Phase 2.
- Frontend rendering logic. The web workbench must remain identical in Electron.
- Auth, storage, or model provider behavior.

## Verification

1. Electron smoke and build checks:

```bash
npm --prefix apps/desktop run build && npm --prefix apps/desktop run smoke
```

2. Electron launch smoke:

```bash
npm --prefix apps/desktop run launch-smoke
```

3. Manual Electron verification:
   - Double-click launcher script starts Docker and opens the Electron window.
   - Workbench renders identically to the browser version.
   - Docker detection handles Docker-not-running gracefully.
   - Window menu and close behavior work correctly.
   - Desktop launcher log file is created under `data/logs/`.
   - Browser-only QA remains available through `run_web.command` and does not depend on Electron.

4. Desktop dependency audit:

```bash
npm --prefix apps/desktop audit --json
```

## Acceptance Criteria

- Electron shell starts, detects/launches Docker, and loads the workbench.
- All Electron smoke and build checks pass.
- Workbench behavior in Electron matches the browser-verified behavior from Phase 2.
- Launcher scripts work on macOS (`.command`) without Gatekeeper issues.
- No new security audit findings above accepted thresholds.
- Desktop-specific packaging is ready for human review.

## Non-Goals

- Signed macOS `.app` distribution (future phase).
- Native no-Docker packaging (future phase).
- Server deployment (future phase).
- Windows testing unless the human explicitly requests it.
