# Task: Implement Weak Auth Contract On SQLite

## Goal

Rebuild local CUHK weak auth on top of SQLite with opaque tokens and future stronger-auth boundaries.

## Source Context

- `docs/SPEC.md`: Users, Functional Requirements
- `docs/ARCH.md`: Module Boundaries
- `docs/RULES.md`: Security And Safety Rules
- `docs/CONTRACTS/auth.md`
- `docs/CONTRACTS/sqlite-schema.md`

## Scope

### Touch

- Auth service/middleware.
- Auth API routes.
- Auth tests.

### Do Not Touch

- Do not implement model settings UI.
- Do not implement artifact generation.
- Do not expose token generation internals to the frontend contract.

## Requirements

- Support teacher and student domain registration/login.
- Store user/session metadata in SQLite.
- Use `Authorization: Bearer <token>` for protected rebuilt APIs.
- Keep token generation opaque to clients.

## Acceptance Criteria

- Teacher email can register, log in, and call `/api/auth/me`.
- Student email can register, log in, and call `/api/auth/me`.
- Unknown domains are rejected.
- Missing/invalid token is rejected by protected rebuilt APIs.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Weak auth is not production auth. Keep implementation isolated and documented as replaceable.

## Handoff Notes

- Cursor should review: auth boundary isolation and lack of raw token/password leakage.
- Human should decide: whether students can run generation in the first release.
