# Task: Implement Web Search Policy

## Goal

Add `auto`, `on`, and `off` web search policy handling with citation metadata.

## Source Context

- `docs/SPEC.md`: Goals, Constraints
- `docs/RULES.md`: Security And Safety Rules
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/artifact-filesystem.md`

## Scope

### Touch

- Backend search policy module.
- Search adapter wrapper.
- Citation persistence tests.

### Do Not Touch

- Do not make every generation run search by default.
- Do not build UI controls.
- Do not require live internet for unit tests.

## Requirements

- Respect `search_mode = off`.
- Search when `search_mode = on`.
- Let `auto` consume intent/context decision and record whether search was used.
- Persist citations in SQLite and manifest data.

## Acceptance Criteria

- Tests verify `off` performs no search call.
- Tests verify `on` calls the mocked search adapter.
- `auto` records a decision.
- Citations have title/url/snippet fields when available.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Search providers are unstable. Keep adapter failures non-fatal unless the user forced `on`.

## Handoff Notes

- Cursor should review: no live network dependency in tests.
- Human should decide: preferred search provider before production packaging.
