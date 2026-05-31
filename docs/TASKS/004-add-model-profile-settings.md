# Task: Add Model Profile Settings

## Goal

Add backend support for user-configurable Qwen/OpenAI-compatible model profiles without committing secrets.

## Source Context

- `docs/SPEC.md`: Goals, Functional Requirements
- `docs/RULES.md`: Security And Safety Rules
- `docs/CONTRACTS/model-settings.md`
- `docs/DECISIONS/003-qwen-provider-default.md`

## Scope

### Touch

- Model settings service.
- Settings API routes.
- Provider profile tests.

### Do Not Touch

- Do not wire generation pipelines to real model calls yet.
- Do not build the frontend settings panel.
- Do not hard-code real API keys.

## Requirements

- Read development defaults from untracked environment/config names in `model-settings.md`.
- Save and retrieve model profile metadata without echoing raw API keys.
- Add a mockable provider connectivity test endpoint.

## Acceptance Criteria

- API can create/update the default model profile.
- Settings responses redact or omit raw secrets.
- Missing credentials produce a clear error.
- Tests mock provider connectivity.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Secret persistence may need stronger OS keychain integration later. Keep the first version replaceable.

## Handoff Notes

- Cursor should review: secret redaction and provider abstraction boundaries.
- Human should decide: official default Qwen endpoint/model after docs verification.
