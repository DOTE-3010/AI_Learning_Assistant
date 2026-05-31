# Task: Add Run Status Streaming

## Goal

Expose stage-level run progress and context estimates to the UI through SSE or a documented polling fallback.

## Source Context

- `docs/SPEC.md`: Core Workflows, UX Requirements
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/ui-workbench.md`

## Scope

### Touch

- Run status event service.
- API endpoint for SSE or polling.
- Tests for event shape.

### Do Not Touch

- Do not redesign the web UI.
- Do not implement Electron startup.
- Do not change pipeline internals beyond emitting events.

## Requirements

- Emit lifecycle stages from `generation-pipeline.md`.
- Include context estimate payload when available.
- Provide a reliable fallback if SSE is not chosen.

## Acceptance Criteria

- A running job exposes current stage and status.
- Event payload matches documented shape.
- Completed and failed runs expose final status.
- Tests cover at least queued, running, succeeded, and failed shapes.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Background execution model may change later. Keep event service separate from pipeline logic.

## Handoff Notes

- Cursor should review: event contract stability.
- Human should decide: SSE vs polling if implementation tradeoffs emerge.
