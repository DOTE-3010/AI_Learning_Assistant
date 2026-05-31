# Task: Add Intent Router And Context Builder

## Goal

Implement intent classification and context preparation with mockable model/search dependencies.

## Source Context

- `docs/SPEC.md`: Goals, Core Workflows
- `docs/ARCH.md`: Module Boundaries
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/model-settings.md`

## Scope

### Touch

- Backend intent router.
- Context builder/file extraction coordinator.
- Unit tests for routing and token estimates.

### Do Not Touch

- Do not implement web search provider calls beyond policy hooks.
- Do not implement artifact-specific generation.
- Do not build UI context dial.

## Requirements

- Support explicit intents and `auto`.
- Produce context budget estimates consumable by the UI.
- Parse or summarize uploaded text/PDF/notebook metadata through isolated helpers.
- Return a structured routing decision for the run service.

## Acceptance Criteria

- Explicit intent bypasses classifier.
- `auto` intent returns one of the four supported intents in mocked tests.
- Context estimate includes utilization ratio and warning level.
- Oversized context produces a controlled warning or rejection.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- File extraction can grow large. Keep detailed parsers behind helpers and test with small fixtures.

## Size Justification

This task spans two `docs/ARCH.md` modules (Context Builder and intent routing), which crosses one soft sizing limit. They are kept together because intent classification consumes the same extracted context and budget estimate that the builder produces; splitting them would force a throwaway interface and a half-built first slice. Single backend concern, mockable, no UI, no schema change. If implementation exceeds ~300 lines, split classifier and extractor into 007a/007b.

## Handoff Notes

- Cursor should review: classifier boundaries and context estimate shape.
- Human should decide: default behavior when classifier confidence is low.
