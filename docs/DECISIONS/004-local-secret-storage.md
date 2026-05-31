<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Decision: Local Secret Storage For Phase 1

## Status

Accepted for the Electron plus Docker Desktop first phase.

## Date

2026-05-31

## Context

Users bring their own model API key. The SQLite metadata file is portable and may be copied or backed up, so it must not become a place where raw keys leak. `AGENTS.md` flags secret handling as a sensitive surface that needs explicit, tested coverage, and earlier drafts left "where the key actually lives" undecided, which would force each implementing agent to invent a mechanism.

## Decision

In phase 1, the raw API key lives only in an untracked local secret store: an environment variable (`MODEL_API_KEY`) or an untracked local settings file (e.g. `.env.local` / an app config file outside version control). SQLite stores only `model_profiles.api_key_ref`, a key name/handle pointing into that store. The backend resolves a submitted raw key into the store and persists only the reference. No endpoint, log, or manifest ever contains the raw key. The product makes no encryption-at-rest claim it cannot honor in phase 1.

## Consequences

- Positive:
  - Copying the SQLite file never leaks a usable key.
  - The mechanism is simple and replaceable.
- Negative:
  - The local secret file/env is only as protected as the host filesystem; this is acceptable for a local single-user tool but not for hosted multi-user use.
- Follow-up:
  - A later phase may move secrets into an OS keychain or a server-side secret manager; `api_key_ref` is the seam that makes this swappable.
  - Tests must assert that settings responses and logs never include the raw key.

## Alternatives Considered

- Store the key (or reversible ciphertext) in SQLite: rejected because the portable DB file would then carry a usable secret.
- OS keychain integration now: deferred because it is platform-specific work not required to ship phase 1.

## Supersedes

None.
