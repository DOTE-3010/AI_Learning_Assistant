<!--
Owner: project-maintainer
Last Reviewed: 2026-06-01
Status: Active
-->

# Decision: Adopt A Conversational Preview Workbench

## Status

Accepted.

## Date

2026-06-01

## Context

The phase-1 frontend implementation after task 017 was structurally functional but did not yet match the desired product feel. The product needs to generate slides, homework answers, code, and cheat sheets from conversation-like instructions, while keeping the generated artifact visible and inspectable. A normal chat transcript hides results in long text; a normal admin dashboard undersells the artifact-generation workflow; a full editor would expand phase-1 scope and persistence risk.

The desired direction combines three reusable interaction patterns:

- chat plus artifact side panel
- chat as a production console for generation and refinement
- professional code/document preview surfaces

## Decision

Use a split conversational workbench as the canonical frontend model.

The left side is a production console for prompts, explicit artifact selection, uploads, model/search controls, run status, warnings, and follow-up refinements. The right side is a persistent artifact preview panel for the current generated output. Phase 1 remains preview-only: users can copy, open, reveal, download, regenerate, and ask for revisions, but they cannot directly edit generated source as saved frontend state.

Code output must use syntax highlighting and editor-grade preview chrome. PDF-producing outputs should lead with rendered or PDF-like previews. Motion is allowed when it clarifies generation, preview hydration, or revision replacement, and must respect reduced-motion settings.

## Consequences

- Positive:
  - Users can keep the current artifact in view while iterating through conversation.
  - The UI can feel like a modern production tool without taking on full IDE/editor responsibilities.
  - The backend artifact filesystem remains the source of truth for generated files.
- Negative:
  - Frontend implementation needs more careful layout, preview renderer, and animation work than a simple form/chat UI.
  - PDF and syntax-highlighting dependencies must be chosen deliberately.
- Follow-up:
  - Task 018 should refactor the current frontend into the split production-console plus artifact-preview model before Electron shell work continues.
  - The appearance rebuild scope is clarified by `docs/DECISIONS/007-full-frontend-appearance-rebuild.md`: frontend visuals are disposable; backend contracts are stable.
  - Future direct editing or generated-code execution requires a new task, contract update, and security review.

## Alternatives Considered

- Generic chat-only UI: rejected because generated artifacts become hard to find and compare.
- Admin dashboard with a generation form: rejected because it does not match the conversational iteration workflow.
- Full in-app source editor in phase 1: deferred because persistence, conflict handling, and execution safety need a separate contract.

## Supersedes

None.
