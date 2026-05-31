<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Decision: Ship Electron Shell With Docker Desktop Runtime First

## Status

Accepted for the first rebuild target.

## Date

2026-05-31

## Context

The final product may eventually become a native desktop app without host dependencies, a signed macOS `.app`, or a hosted server. Building all of that now would slow the rewrite and obscure the product contract. The backend needs Python and a full LaTeX toolchain, which are painful to install on every host.

## Decision

The first implementation uses Electron for the desktop shell and Docker Desktop for the backend, LaTeX, and processing runtime. Docker Desktop is the only host-level prerequisite for the packaged build.

## Consequences

- Positive:
  - Host prerequisites stay simple: Docker Desktop only.
  - Backend keeps Python and LaTeX dependencies inside containers.
- Negative:
  - End users must install Docker Desktop, which is heavier than a native app.
  - Electron must manage service health and present clear failure states when Docker is unavailable.
- Follow-up:
  - Future native/server builds must keep the API and artifact contracts stable so the runtime can change underneath them.

## Alternatives Considered

- Native bundled backend now: rejected because bundling Python + TeX Live across macOS/Windows is high-effort and premature.
- Pure hosted web app: rejected because the product is positioned as a local-first desktop tool in phase 1.

## Supersedes

None.
