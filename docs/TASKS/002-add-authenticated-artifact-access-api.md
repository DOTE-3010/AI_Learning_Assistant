# Task: Add Authenticated Artifact Access API

## Goal

Expose generated artifact metadata and bytes through authenticated backend endpoints so the workbench can preview real outputs.

## Source Context

- `docs/CONTRACTS/artifact-access.md`: new artifact metadata and file-byte API.
- `docs/CONTRACTS/artifact-filesystem.md`: run folder and manifest shape.
- `docs/CONTRACTS/errors.md`: canonical error envelope.
- `docs/ARCH.md`: Artifact Access module boundary.
- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: real preview blocker.

## Scope

- Touch: backend API/core artifact access code, storage/artifact helper methods if needed, backend tests.
- Do not touch: frontend preview rendering, generation pipeline output formats, Electron reveal behavior, SQLite schema unless a missing helper can be solved without schema changes.

## Requirements

- Add `GET /api/runs/{run_id}/artifacts` for owned run artifact metadata.
- Add `GET /api/runs/{run_id}/artifacts/files/{relative_path:path}` for owned generated file bytes.
- Allow only paths recorded in the run manifest or SQLite artifact rows and only after ownership is verified.
- Reject traversal, absolute paths, unrecorded files, and cross-user access with safe canonical errors.

## Acceptance Criteria

- The run owner can list manifest/artifact metadata for a succeeded run.
- The run owner can fetch generated source, logs, manifest, and PDF bytes by run-relative path.
- A different user receives `not_found` for the same run and artifact paths.
- Path traversal attempts do not expose host path details.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_artifact_access_api.py -q`
- `.venv/bin/python -m pytest backend/tests/test_runs_api.py backend/tests/test_artifact_filesystem.py -q`

## Handoff Notes

- Cursor should review: ownership checks before path resolution and path normalization edge cases.
- Human should decide: whether HTTP range support for large PDFs is needed immediately or can remain deferred.
