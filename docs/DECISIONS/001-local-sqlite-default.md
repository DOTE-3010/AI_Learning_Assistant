<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Decision: Use SQLite As Local Default Storage

## Status

Accepted for the Electron plus Docker Desktop first phase.

## Date

2026-05-31

## Context

The archived MVP uses Postgres for relational metadata and Mongo for artifacts/history. The rebuilt product is local-first and should be distributed through an Electron shell that depends only on Docker Desktop. Two database services raise packaging cost and host complexity for a single-user/offline product.

## Decision

Use SQLite as the local default datastore for users, sessions, model profiles, projects, runs, uploads, artifacts, citations, and settings metadata. Store large files on disk through the artifact filesystem contract.

## Consequences

- Positive:
  - Local runtime loses two database services and becomes easier to package.
  - Metadata becomes portable as one database file.
  - Hosted server deployment can later swap repositories to Postgres behind the same storage interface.
- Negative:
  - Concurrent multi-writer/hosted scale is not supported by this default.
- Follow-up:
  - Keep repositories behind an interface so a Postgres implementation can be added without touching pipelines.
  - Mongo must not be reintroduced for the local desktop runtime without a new decision record.

## Alternatives Considered

- Keep Postgres + Mongo: rejected because it forces extra services into the desktop package.
- Postgres only: rejected because it still needs a server process for a single-user local app.

## Supersedes

None.
