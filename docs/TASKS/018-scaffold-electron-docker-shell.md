# Task: Scaffold Electron Docker Shell

## Goal

Create the Electron shell that detects Docker Desktop, starts/checks services, and opens the workbench.

## Source Context

- `docs/SPEC.md`: Product Intent, Core Workflows
- `docs/ARCH.md`: Runtime Topology
- `docs/CONTRACTS/runtime-electron-docker.md`
- `docs/CONTRACTS/ui-workbench.md`

## Scope

### Touch

- Electron app package/config.
- Main process startup logic.
- Docker/backend health check helpers.
- Minimal desktop smoke test or script.

### Do Not Touch

- Do not implement native no-Docker runtime.
- Do not package signed macOS app.
- Do not modify generation pipelines.

## Requirements

- Detect Docker availability.
- Start or connect to the Docker Compose app.
- Wait for backend `/health`.
- Load the local workbench URL/bundle.
- Show failure state when Docker/backend is unavailable.
- Keep Electron source under `apps/desktop/`.

## Acceptance Criteria

- Electron starts and reaches a ready state when Docker/backend are available.
- Electron shows a clear failed state when Docker is missing.
- Startup states match `runtime-electron-docker.md`.
- No host Python or Node requirement is introduced for the eventual packaged app beyond Electron packaging itself.

## Verification

- `npm --prefix apps/desktop run build`
- `npm --prefix apps/desktop run smoke`

## Risks

- Docker CLI behavior differs by platform. Keep platform-specific shell calls isolated.

## Handoff Notes

- Cursor should review: process boundaries and failure states.
- Human should decide: exact app name/icon assets.
