<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: Resolve Upload API Pre-QA Blocker

## Goal

Implement the backend upload API required by `docs/CONTRACTS/uploads.md` so whole-product QA can start without carrying a known phase-1 acceptance gap.

## Source Context

- `docs/SPEC.md`: uploads are first-class phase-1 inputs and part of artifact-generation acceptance criteria.
- `docs/ARCH.md`: API Backend, Storage Layer, Artifact Filesystem, and Context Builder ownership.
- `docs/RULES.md`: security, filesystem, testing, and QA blocker rules.
- `docs/CONTRACTS/uploads.md`: upload API request/response, limits, validation, errors, and acceptance checks.
- `docs/CONTRACTS/sqlite-schema.md`: upload metadata table.
- `docs/CONTRACTS/artifact-filesystem.md`: safe file storage and run/input layout rules.
- `docs/CONTRACTS/errors.md`: canonical error envelope.

## Scope

### Touch

- Backend upload API route and registration.
- Backend storage/artifact helpers needed to persist upload metadata and bytes.
- Backend config only for upload limits defined by the contract.
- Backend tests for upload success and validation/error behavior.
- Smoke script only to stop intentionally avoiding upload coverage and add a minimal mocked upload check.
- README/docs only to remove stale "upload API not implemented" wording after implementation lands.

### Do Not Touch

- Do not change frontend visual design or workbench layout.
- Do not change auth semantics beyond requiring bearer auth for uploads.
- Do not change model provider, run pipeline behavior, or revision budgeting except where existing run context needs to read uploaded metadata.
- Do not add OCR for scanned PDFs; it remains out of scope in phase 1.
- Do not store upload bytes in SQLite.
- Do not start agent QA tasks `001`-`003` until this task passes verification.

## Requirements

- Add authenticated `POST /api/uploads` multipart handling for repeatable `files` fields.
- Add authenticated `GET /api/uploads/{id}` metadata lookup that never returns raw bytes.
- Accept phase-1 file types from `docs/CONTRACTS/uploads.md`: text/Markdown, Python, notebooks, and PDFs.
- Enforce configured limits for max single file size, max files per request, and max total request size.
- Sanitize original names, prevent path traversal, compute `sha256`, write upload bytes on disk, and store metadata in SQLite.
- Return canonical error envelopes for unauthorized, missing files, unsupported media type, and oversized uploads.
- Preserve ownership checks so a user cannot retrieve another user's upload metadata.
- Add tests that exercise contract acceptance checks and representative failure paths.

## Acceptance Criteria

- A CUHK-authenticated user can upload one `.md` file and receive a metadata `id`.
- A CUHK-authenticated user can upload multiple `.pdf` files in one request for cheat-sheet inputs.
- Unsupported file types return `unsupported_media_type` through the canonical error envelope.
- Oversized uploads return `upload_too_large` through the canonical error envelope.
- `GET /api/uploads/{id}` returns only metadata for the authenticated owner and returns `not_found` or `unauthorized` for inaccessible uploads.
- The smoke path includes at least one upload check and no longer documents avoiding uploads.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run build`
- `./scripts/smoke_e2e.sh`

## Completion Results

- 2026-06-03: `.venv/bin/python -m pytest backend/tests -q` passed with upload API coverage included.
- 2026-06-03: `npm --prefix frontend run build` passed.
- 2026-06-03: `./scripts/smoke_e2e.sh` passed with a multipart Markdown upload feeding a mocked generation run.

## Handoff Notes

- Cursor should review: path traversal protection, media-type validation, upload ownership checks, SQLite-vs-filesystem separation, and canonical error codes.
- Human should decide: whether OCR, upload retention/garbage collection, and live large-PDF stress tests remain future-phase work.
