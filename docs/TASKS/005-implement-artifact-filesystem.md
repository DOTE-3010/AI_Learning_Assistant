# Task: Implement Artifact Filesystem Writer

## Goal

Create the filesystem writer that produces run folders, manifests, logs, and output file paths.

## Source Context

- `docs/ARCH.md`: Data Ownership
- `docs/RULES.md`: Coding Rules, Security And Safety Rules
- `docs/CONTRACTS/artifact-filesystem.md`
- `docs/CONTRACTS/sqlite-schema.md`

## Scope

### Touch

- Backend artifact filesystem module.
- Path/sanitization helpers.
- Artifact writer tests.

### Do Not Touch

- Do not implement model generation.
- Do not compile LaTeX in this task.
- Do not build Electron reveal-in-folder UI yet.

## Requirements

- Create run folders under a configurable workspace root.
- Write `input/task.md`, `manifest.json`, logs, and placeholder output files through a safe API.
- Prevent path traversal outside the configured root.
- Record artifact metadata through SQLite repository functions if available.

## Acceptance Criteria

- Writer creates the folder shape from `artifact-filesystem.md`.
- Manifest JSON conforms to the documented fields.
- Unsafe path segments are sanitized.
- Tests verify files are written under a temporary workspace root.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Filesystem behavior differs across macOS/Windows containers. Use portable path handling.

## Handoff Notes

- Cursor should review: path safety and manifest compatibility.
- Human should decide: final visible workspace root naming if product copy matters.
