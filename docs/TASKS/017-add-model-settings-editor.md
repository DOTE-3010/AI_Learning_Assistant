# Task: Add Model Settings Editor UI

## Goal

Add the model settings editor to the workbench so a user can configure base URL, model, and API key without ever exposing the saved key.

## Source Context

- `docs/SPEC.md`: UX Requirements, Functional Requirements
- `docs/CONTRACTS/ui-workbench.md`: Required Controls, Error And Empty States
- `docs/CONTRACTS/model-settings.md`
- `docs/CONTRACTS/errors.md`
- `docs/DECISIONS/004-local-secret-storage.md`

## Scope

### Touch

- Frontend model settings component.
- API integration for the settings read/update and connectivity-test endpoints.

### Do Not Touch

- Do not build the context dial (separate task).
- Do not implement the Electron shell.
- Do not display, log, or cache the raw API key after save.

## Requirements

- Editor supports base URL, model, and API key input.
- Saved settings responses never display the raw API key.
- The connectivity test surfaces `missing_api_key`, `provider_auth_failed`, and `provider_unavailable` via the canonical error envelope.
- Validation errors map `fields[*]` back to the offending inputs.

## Acceptance Criteria

- Model settings can be saved and reloaded without showing the raw key.
- A missing or bad key shows a clear, secret-free error message.
- A successful connectivity test is reflected in the UI.
- Field-level validation errors are shown next to their inputs.

## Verification

- `npm --prefix frontend run build`

## Risks

- Secret handling in client state is sensitive: never persist the raw key in local/session storage or in component state after save.

## Handoff Notes

- Cursor should review: secret handling in UI state (no raw key retained) and canonical error-envelope consumption.
- Human should decide: whether multiple named profiles are needed in phase 1 or a single default profile suffices.
