<!--
Owner: project-maintainer
Last Reviewed: 2026-06-01
Status: Active
-->

# Decision: Fully Rebuild Frontend Appearance While Preserving Backend Contracts

## Status

Accepted.

## Date

2026-06-01

## Context

After task 017, the frontend was functionally useful but not visually or experientially aligned with the desired product. The target is a warm editorial conversational artifact workbench that previews generated slides, homework answers, code, and cheat sheets. Incrementally polishing the existing frontend risks preserving the wrong product shape.

At the same time, the backend contracts already define the phase-1 product behavior: weak CUHK auth, model settings, uploads, run creation/status, artifact manifests, context estimates, and canonical errors. Reworking appearance should not destabilize those interfaces.

## Decision

Treat the existing frontend appearance as disposable. Task 018 may replace the frontend app shell, component structure, styling, placeholder previews, visual assets, and local UI state organization wholesale inside `frontend/`.

Preserve backend-facing behavior and contracts. Backend code, database schema, generation pipelines, and API contracts are not part of the appearance rebuild. If the frontend discovers an API gap, it should adapt to the documented contract or create a separate backend task rather than changing backend code in the same work.

## Consequences

- Positive:
  - Implementation agents can make a decisive product-surface change instead of trying to rescue the old UI.
  - Backend stability keeps the rewrite reviewable and reduces regression risk.
  - The next frontend can be designed around the conversation-plus-preview model from first principles.
- Negative:
  - The frontend diff may be larger than a normal bounded task.
  - Some old frontend code may be deleted even if it still worked visually or structurally.
  - Feature parity must be checked deliberately because old components are not being preserved.
- Follow-up:
  - Task 018 is allowed to be frontend-heavy, but it must still verify build and governance.
  - Backend changes for revision support remain task 019.

## Alternatives Considered

- Light restyle of the existing frontend: rejected because it keeps too much of the current product feel.
- Backend-plus-frontend rewrite in one task: rejected because it expands risk and blurs stable interface boundaries.
- Full direct-editing workbench: deferred because phase 1 remains preview-only.

## Supersedes

None.
