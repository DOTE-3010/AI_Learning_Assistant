# Task: Add Context Budget Dial

## Goal

Add the compact graphical context budget indicator to the workbench, driven by a local pre-run estimate and updated by backend run events.

## Source Context

- `docs/SPEC.md`: UX Requirements
- `docs/CONTRACTS/ui-workbench.md`: Context Indicator
- `docs/CONTRACTS/visual-assets.md`: Context Dial
- `docs/CONTRACTS/generation-pipeline.md`: Context Estimation, Status Event Shape

## Scope

### Touch

- Frontend context dial component.
- Frontend wiring that consumes the run status `context` payload.
- Client-side pre-run estimate helper.

### Do Not Touch

- Do not build the model settings editor (separate task).
- Do not implement the Electron shell.
- Do not change backend estimation logic beyond consuming the documented payload.

## Requirements

- Context numbers are hidden until hover/focus.
- Dial states map to `ok`, `warning`, and `critical` using the thresholds in `generation-pipeline.md`.
- Dial visual states follow the asset names and style rules from task 014.
- A local estimate renders before a run; backend events update the dial during a run.
- Hover/focus reveals exact numbers without moving surrounding layout.

## Acceptance Criteria

- Local estimate renders before a run starts.
- Backend estimate updates the dial during a run.
- Hover/focus reveals exact input/output/total/limit/utilization and the `source` label.
- `ok`/`warning`/`critical` states are visually distinct and match the contract thresholds.

## Verification

- `npm --prefix frontend run build`

## Risks

- Visual polish may require generated assets. Use the task 014 prompt briefs and keep placeholders contract-compatible if generation is deferred.

## Handoff Notes

- Cursor should review: context dial contract alignment (state vocabulary, hidden-by-default numbers, no layout shift on hover).
- Human should decide: whether the dial needs generated bitmap/motion assets before Electron packaging.
