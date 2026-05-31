<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Contract: Model Settings

## Purpose

Allow users to bring their own Qwen/OpenAI-compatible API credentials while keeping local development credentials untracked.

## Model Profile

```json
{
  "id": "default-qwen",
  "display_name": "Qwen Default",
  "provider": "openai_compatible",
  "base_url": "https://example-compatible-endpoint/v1",
  "model": "qwen-model-name",
  "api_key_ref": "local-secret-reference",
  "context_window_hint": 128000,
  "supports_streaming": true,
  "is_default": true
}
```

## Secret Handling

The concrete phase-1 storage mechanism is pinned in `docs/DECISIONS/004-local-secret-storage.md`. Summary:

- Tracked files may contain placeholder defaults but never real API keys.
- Development credentials belong in `.env`, `.env.local`, or another untracked local settings file.
- The actual secret lives in an untracked local secret store (file or environment), not in SQLite. The `model_profiles.api_key_ref` column holds only a key name/handle into that store, never the raw key or a recoverable ciphertext.
- A request may submit a raw API key; the backend resolves it into the secret store and persists only the `api_key_ref`. No endpoint echoes the raw key back.
- Logs must redact API keys and `Authorization` headers.

## Environment Inputs

Supported local development variables:

```text
MODEL_PROVIDER=openai_compatible
MODEL_BASE_URL=<provider endpoint>
MODEL_NAME=<model name>
MODEL_API_KEY=<secret>
MODEL_CONTEXT_WINDOW=128000
MODEL_SUPPORTS_STREAMING=true
```

Legacy `BIANXIE_*` variables should not be the new canonical names.

## API Surface

### `GET /api/settings/model-profiles`

Returns saved profiles without raw secrets.

### `PUT /api/settings/model-profiles/default`

Creates or updates the default local profile. Request may include a raw API key, but response must not echo it.

### `POST /api/settings/model-profiles/test`

Runs a minimal provider connectivity check using the submitted or saved profile.

## Provider Rules

- First implementation should use an OpenAI-compatible adapter for Qwen unless official docs require otherwise.
- Exact Qwen default endpoint/model must be verified before code implementation.
- Pipelines depend on the provider interface, not on environment variables directly.

## Errors

Uses the canonical envelope (`errors.md`). Failure cases:

| Scenario | HTTP | Code |
| --- | --- | --- |
| Save profile with malformed `base_url`/missing `model` | 400 | `validation_error` |
| `test` with no resolvable key | 400 | `missing_api_key` |
| `test` where provider rejects the key | 502 | `provider_auth_failed` |
| `test` where provider/network is unreachable | 502 | `provider_unavailable` |

## Validation Rules

- `base_url` must be an absolute `https`/`http` URL; `model` must be non-empty.
- Exactly one profile may have `is_default = true`.
- The `test` endpoint performs a single minimal completion/models call and must time out quickly.

## Compatibility

- Additive: new optional profile fields (e.g. extra capability hints), new providers behind `provider`.
- Breaking (ADR required): renaming `api_key_ref` semantics, returning raw keys, or changing the `MODEL_*` env contract.

## Versioning

- Settings endpoints live under `/api/settings`. The `model_profiles` shape is versioned with `sqlite-schema.md`.

## Acceptance Checks

- A user can set base URL, model, and API key.
- The API key is not returned by any settings endpoint.
- A missing key gives a clear `missing_api_key` error.
- Provider calls can be mocked in tests.

## Open Questions

- Whether to support multiple named profiles per user in phase 1 or only one default profile.
