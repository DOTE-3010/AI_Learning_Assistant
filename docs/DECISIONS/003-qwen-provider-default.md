<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Decision: Use Qwen Through A Provider Abstraction

## Status

Accepted pending official default model/endpoint verification.

## Date

2026-05-31

## Context

The archived MVP defaults to Bianxie/OpenAI-style configuration and includes an unsafe hard-coded API key. The rebuilt product needs compliance-friendly, user-supplied model settings and faster direct provider access, without locking pipelines to one vendor.

## Decision

Use a provider profile abstraction with Qwen via an OpenAI-compatible client as the default. Users can edit API key, base URL, and model. Development credentials live only in untracked local config. Pipelines depend on the provider interface, not on environment variables or vendor constants.

## Consequences

- Positive:
  - The first implementation can reuse an OpenAI-compatible client if Qwen endpoint compatibility holds.
  - A native provider SDK can be added later without changing pipeline contracts.
- Negative:
  - The exact default Qwen endpoint/model is unverified and must be confirmed before implementation; shipping a wrong default would fail silently.
- Follow-up:
  - Verify the official Qwen base URL and model id; until then ship a placeholder default plus a clear setup error rather than guessing a live endpoint.
  - No real API key may appear in tracked source.

## Alternatives Considered

- Hard-code a single vendor SDK: rejected because it reduces portability and risks committing secrets.
- Keep Bianxie defaults: rejected because the embedded key is unsafe and the dependency is not the new direction.

## Supersedes

None.
