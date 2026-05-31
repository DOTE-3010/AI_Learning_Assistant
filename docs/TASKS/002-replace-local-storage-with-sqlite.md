# Task: Replace Local Storage With SQLite Foundation

## Goal

Introduce the SQLite repository foundation for local metadata while leaving legacy Postgres/Mongo paths untouched until cutover.

## Source Context

- `docs/ARCH.md`: Data Ownership, Dependency Rules
- `docs/RULES.md`: Testing Rules, Dependency Rules
- `docs/CONTRACTS/sqlite-schema.md`
- `docs/DECISIONS/001-local-sqlite-default.md`

## Scope

### Touch

- Backend storage module.
- SQLite connection/config module.
- Focused repository tests.

### Do Not Touch

- Do not rewrite auth endpoints.
- Do not remove Docker Compose Postgres/Mongo services yet.
- Do not move generated files into SQLite.

## Requirements

- Create/open a local SQLite database file from configurable path.
- Implement migrations or schema initialization for the first schema version.
- Add repository functions for users, sessions, model profiles, runs, uploads, artifacts, and citations where practical.

## Acceptance Criteria

- A fresh SQLite database can be initialized from code.
- Metadata tables from `sqlite-schema.md` exist.
- Repository tests can insert and read representative rows.
- No Postgres or Mongo connection is required for the new storage tests.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- The legacy app may still import Postgres models. Keep new storage isolated until later cutover tasks.

## Handoff Notes

- Cursor should review: schema alignment with `docs/CONTRACTS/sqlite-schema.md`.
- Human should decide: final on-disk SQLite path if the implementation needs a product-facing location.
