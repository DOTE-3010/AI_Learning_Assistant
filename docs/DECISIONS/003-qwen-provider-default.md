<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Decision: Use Qwen Through A Provider Abstraction

## Status

Accepted. Default non-secret values were verified against official Alibaba Cloud Model Studio documentation on 2026-06-03.

## Date

2026-05-31

## Context

The archived MVP defaults to Bianxie/OpenAI-style configuration and includes an unsafe hard-coded API key. The rebuilt product needs compliance-friendly, user-supplied model settings and faster direct provider access, without locking pipelines to one vendor.

## Decision

Use a provider profile abstraction with Qwen via an OpenAI-compatible client as the default. Users can edit API key, base URL, and model. Development credentials live only in untracked local config. Pipelines depend on the provider interface, not on environment variables or vendor constants.

Default non-secret values for phase 1 are:

- `provider`: `openai_compatible`
- `base_url`: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- `model`: `qwen-plus`
- `context_window_hint`: `1000000`
- `supports_streaming`: `true`
- API key: no default

Official references checked on 2026-06-03:

- `https://www.alibabacloud.com/help/en/model-studio/qwen-api-via-openai-chat-completions`
- `https://www.alibabacloud.com/help/en/model-studio/use-qwen-by-calling-api`
- `https://www.alibabacloud.com/help/en/model-studio/models`

## Consequences

- Positive:
  - The first implementation can reuse an OpenAI-compatible client if Qwen endpoint compatibility holds.
  - A native provider SDK can be added later without changing pipeline contracts.
- Negative:
  - Regional API keys differ. The default China (Beijing) endpoint is wrong for Singapore/international keys, so the settings editor must keep base URL editable and make region mismatch/provider failures clear.
- Follow-up:
  - Re-verify official Qwen defaults before future tracked default changes.
  - No real API key may appear in tracked source.

## Alternatives Considered

- Hard-code a single vendor SDK: rejected because it reduces portability and risks committing secrets.
- Keep Bianxie defaults: rejected because the embedded key is unsafe and the dependency is not the new direction.

## Supersedes

None.
