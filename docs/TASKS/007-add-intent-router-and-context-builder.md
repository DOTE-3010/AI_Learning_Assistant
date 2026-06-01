# Task: Add Explicit Intent Router And Context Builder

## Goal

Implement explicit intent routing and context preparation with mockable model/search dependencies.

## Source Context

- `docs/SPEC.md`: Goals, Core Workflows
- `docs/ARCH.md`: Module Boundaries
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/model-settings.md`

## Scope

### Touch

- Backend explicit intent router.
- Context builder/file extraction coordinator.
- Unit tests for routing and token estimates.

### Do Not Touch

- Do not implement web search provider calls beyond policy hooks.
- Do not implement artifact-specific generation.
- Do not build UI context dial.

## Requirements

- Support only explicit artifact intents: `code_homework`, `essay_latex`, `beamer_slides`, and `cheat_sheet`.
- Reject `auto` or missing intent with the canonical `unsupported_intent` error.
- Produce context budget estimates consumable by the UI.
- Parse or summarize uploaded text/PDF/notebook metadata through isolated helpers.
- Return a structured routing decision for the run service.

## Acceptance Criteria

- Explicit intent routes to exactly one supported pipeline target.
- `auto` intent is rejected; prompt-only guessing is not part of phase 1.
- Context estimate includes utilization ratio and warning level.
- Oversized context produces a controlled warning or rejection.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- File extraction can grow large. Keep detailed parsers behind helpers and test with small fixtures.

## Size Justification

This task spans two `docs/ARCH.md` modules (Context Builder and intent routing), which crosses one soft sizing limit. They are kept together because routing consumes the same extracted context and budget estimate that the builder produces. Single backend concern, mockable, no UI, no schema change. If implementation exceeds ~300 lines, split router and extractor into 007a/007b.

## Handoff Notes

- Cursor should review: explicit routing boundaries and context estimate shape.
- Human should decide: no remaining low-confidence classifier behavior; artifact type is selected by UI.
