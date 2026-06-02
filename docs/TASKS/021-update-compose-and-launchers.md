# Task: Update Compose And Launchers For Rebuilt Runtime

## Goal

Replace the old local runtime compose/launcher behavior with the SQLite-backed backend and Electron-oriented startup path.

## Source Context

- `docs/ARCH.md`: Runtime Topology
- `docs/RULES.md`: Dependency Rules
- `docs/CONTRACTS/runtime-electron-docker.md`
- `docs/DECISIONS/001-local-sqlite-default.md`
- `docs/DECISIONS/002-electron-docker-first.md`

## Scope

### Touch

- Dockerfile and compose files.
- `.command` and `.bat` launchers.
- Runtime packaging notes.

### Do Not Touch

- Do not change pipeline logic.
- Do not add Postgres or Mongo services.
- Do not implement native signed app packaging.

## Requirements

- Compose uses backend service plus mounted data/workspace paths.
- Compose does not require Postgres or Mongo for rebuilt local runtime.
- Launchers check Docker Desktop and start Electron or the rebuilt runtime path.
- Existing offline packaging assumptions are updated or clearly marked legacy.

## Acceptance Criteria

- `docker compose config` succeeds.
- Backend can start with SQLite and workspace mounts.
- Mac and Windows launchers reflect the Electron plus Docker direction.
- No real secrets are written by launchers.
- Smoke verification documents whether services are left running or cleaned up.

## Verification

- `docker compose -p ai-learning-assistant config`
- `docker compose -p ai-learning-assistant up --build -d`
- `curl -fsS http://localhost:14242/health`
- `docker compose -p ai-learning-assistant down`

## Risks

- Running compose may need local Docker access. If verification cannot run, record why. If services are started during verification, either stop them with `docker compose down` or state that they were intentionally left running.

## Handoff Notes

- Cursor should review: removal of Postgres/Mongo from local runtime and secret prompts.
- Human should decide: whether launchers should open Electron directly or remain service starters temporarily.
