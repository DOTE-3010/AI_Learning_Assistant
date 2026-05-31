<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Decision: Adopt One Canonical Error Envelope

## Status

Accepted.

## Date

2026-05-31

## Context

Early contract drafts defined an error shape only for auth (`{error, message}`) and left run/settings/upload failures unspecified. The skill's anti-patterns call out "No Error Contract" as a primary failure mode because divergent error shapes make clients and the Electron shell handle failures inconsistently and tempt agents to invent fields.

## Decision

All backend APIs and run failures use one envelope: a top-level `error` object with a stable machine `code` (from a shared catalog), a human-readable `message`, and optional `fields` (validation) and `details`. The full schema and catalog live in `docs/CONTRACTS/errors.md`. Run-time failures persist the same `code`/`message` and surface them in the status event.

## Consequences

- Positive:
  - Clients branch on one stable shape; the UI can map `validation_error.fields` back to inputs.
  - Adding a failure mode means adding a catalog code, not a new shape.
- Negative:
  - Existing auth examples had to migrate from `{error, message}` to the nested `error.code`/`error.message` form.
- Follow-up:
  - New endpoints reference `errors.md`; new codes are added to the catalog in the same task.

## Alternatives Considered

- Per-endpoint ad hoc error shapes: rejected because they diverge and break shared client handling.
- Raw provider/framework errors passed through: rejected because they leak internals and secrets.

## Supersedes

None.
