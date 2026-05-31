# Task: End-To-End Smoke And Legacy Cleanup

## Goal

Verify the rebuilt Electron plus Docker flow end to end, then remove obsolete legacy surfaces that are no longer used.

## Source Context

- `docs/SPEC.md`: Acceptance Criteria
- `docs/ARCH.md`: Migration Strategy
- `docs/RULES.md`: Review Rules
- All files under `docs/CONTRACTS/`

## Scope

### Touch

- End-to-end smoke tests/scripts.
- Legacy backend/frontend files that have confirmed replacements.
- README/runtime docs.

### Do Not Touch

- Do not delete governance files.
- Do not remove compatibility code still referenced by a passing flow.
- Do not make native no-Docker packaging in this task.

## Requirements

- Smoke test covers auth, model settings with mocked provider, run creation, one pipeline output, artifact manifest, and workbench visibility.
- Add or update one smoke script that runs the rebuilt end-to-end path without live model credentials.
- Remove or archive obsolete Postgres/Mongo/course/chat code after replacement paths pass.
- Update README to describe the new first-phase runtime.

## Acceptance Criteria

- End-to-end smoke path passes locally or has a documented Docker-related blocker.
- Obsolete legacy files are removed only after replacement verification.
- README no longer presents the old MVP as the current product.
- `git status --short` shows only intentional rewrite changes.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run build`
- `./scripts/smoke_e2e.sh`

## Risks

- Cleanup can become too broad. Split into more cleanup tasks if replacements are not obvious.

## Handoff Notes

- Cursor should review: accidental deletion of still-used runtime paths.
- Human should decide: when the new README should replace archived educational narrative entirely.
