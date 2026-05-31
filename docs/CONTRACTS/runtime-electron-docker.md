<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Contract: Electron Plus Docker Runtime

## Purpose

Define the first distributable runtime: an Electron desktop shell that depends on Docker Desktop for backend services.

## Host Requirement

Docker Desktop must be installed and running. Python, Node, LaTeX, Postgres, and Mongo must not be required on the host for the packaged build.

## Desktop Shell Responsibilities

- Detect whether Docker Desktop is available.
- Start the Docker Compose project for the app when needed.
- Wait for backend health.
- Open the workbench window.
- Show actionable error states when Docker or backend startup fails.
- Preserve user data volumes across restarts.
- Provide a way to reveal generated artifact folders.

## Backend Runtime Responsibilities

- Expose `GET /health`.
- Serve API under `/api`.
- Serve the web workbench or allow Electron to load the local renderer bundle.
- Mount a data volume for SQLite.
- Mount a workspace volume for generated artifacts.
- Include LaTeX/PDF runtime dependencies inside the container.

## Compose Requirements

First-phase compose should include:

- backend API/runtime service
- persistent data volume/path
- persistent workspace volume/path

It should not include Postgres or Mongo for the rebuilt local runtime.

## Startup States

| State | Meaning |
| --- | --- |
| `checking_docker` | Shell is detecting Docker availability |
| `starting_services` | Compose project is being started |
| `waiting_for_backend` | Health endpoint not ready yet |
| `ready` | UI can load |
| `failed` | User-visible remediation required |

## Failure Modes

| Failure | Shell Behavior | User-Visible Outcome |
| --- | --- | --- |
| Docker Desktop not installed | Stop at `checking_docker` | Actionable message with install/start guidance |
| Docker installed but not running | Offer to start, then poll | `starting_services` with a retry affordance |
| Compose up fails (port/image) | Capture sanitized log tail | `failed` with the failing service named |
| Backend `/health` never ready within timeout | Stop polling, show diagnostics | `failed` with a "view logs" affordance |
| Backend crashes after ready | Surface health-lost state | Non-destructive prompt to restart services |

Shell errors are presented to the user; they are not the API error envelope (that governs backend HTTP responses).

## Launcher Scripts

`.command` and `.bat` launchers may remain as quasi-double-click entry points. They should eventually call or launch the Electron app, not replace it.

## Acceptance Checks

- With Docker Desktop running, Electron can start services and load the workbench.
- Without Docker Desktop, Electron shows a clear failure state.
- Restarting the app preserves SQLite data and workspace files.
- Compose no longer requires Postgres or Mongo for the rebuilt runtime.

## Open Questions

- Whether the shell should pin a specific compose project name/version to avoid colliding with other local Docker projects.
