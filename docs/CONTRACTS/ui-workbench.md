<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Contract: UI Workbench

## Purpose

Define the primary user experience for the rebuilt product.

## First Screen

After auth, the user lands directly in an artifact studio:

- task input
- artifact type selector or auto intent mode
- optional file upload area
- model/search controls
- run button
- visual context budget indicator
- output preview and file list

Do not make course administration the primary first screen.

## Visual Direction

- Consumer-grade, polished, modern Silicon Valley product feel.
- Avoid generic dark SaaS dashboard composition.
- Use rich static/dynamic assets when they support the artifact studio identity.
- Keep interactive controls focused; visual sophistication can come from prepared assets, motion, previews, and layout.
- Avoid text-heavy explanations of how the app works inside the UI.

## Context Indicator

Default state:

- compact graphical dial/gauge
- no large numeric panel
- color/state communicates safe/warning/critical

Hover/focus state:

- estimated input tokens
- estimated output tokens
- estimated total tokens
- context window limit
- utilization percentage
- source: local estimate or backend estimate

## Required Controls

- Auth/register/login views for CUHK weak auth.
- Model settings editor for base URL, model, and API key.
- Intent mode: `auto`, `code_homework`, `essay_latex`, `beamer_slides`, `cheat_sheet`.
- Search mode: `auto`, `on`, `off`.
- Upload control supporting multiple files for cheat sheets.
- Run status display with stage-level progress.
- Output file list with reveal/open affordance.

## API Expectations

The UI consumes:

- Auth endpoints from `auth.md`.
- Model settings endpoints from `model-settings.md`.
- Generation run endpoints/events from `generation-pipeline.md`.
- Artifact path/manifest outputs from `artifact-filesystem.md`.

## Error And Empty States

- The UI reads the canonical error envelope (`errors.md`) and shows `error.message`; it must never display raw API keys, tokens, or stack traces.
- `validation_error` maps `fields[*]` back to the offending inputs (e.g. highlight the missing `target_pages`).
- A `failed` run shows the failure `code`/`message` and still links any preserved source/logs.
- Empty states (no runs yet, no output yet) are deliberate product surfaces, not blank panels.

## Acceptance Checks

- UI can submit a run without required uploads.
- UI can submit multiple PDFs for cheat-sheet intent.
- Context dial updates from local estimate before run and backend events during run.
- Exact context numbers are hidden until hover/focus.
- Output files are discoverable after a succeeded run.
- A failed run surfaces a human-readable message without leaking secrets.

## Open Questions

- Whether in-app PDF/notebook preview is in scope for phase 1 or replaced by reveal-in-folder until later.
