# Task: Add Revision Run Support

## Goal

Support follow-up refinement requests as independent revision runs that can reference prior generated artifacts.

## Source Context

- `docs/SPEC.md`: Core Workflows, UX Requirements
- `docs/ARCH.md`: Workbench Interaction Model
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/sqlite-schema.md`
- `docs/CONTRACTS/artifact-filesystem.md`
- `docs/CONTRACTS/ui-workbench.md`
- `docs/DECISIONS/006-conversational-preview-workbench.md`

## Scope

### Touch

- Backend run request/validation model.
- Run persistence/repository fields for `revision_of_run_id`.
- Context builder or run orchestration logic that loads safe prior-run metadata/source for revisions.
- Manifest writing for `revision_of_run_id`.
- Focused backend tests for revision ownership and non-overwrite behavior.
- Frontend API integration only if task 018 left the request field unwired.

### Do Not Touch

- Do not redesign the workbench layout; that belongs to task 018.
- Do not overwrite prior run folders or mutate prior manifests.
- Do not add direct in-app editing.
- Do not execute generated code or notebooks.
- Do not change auth semantics.

## Requirements

- `POST /api/runs` accepts optional `revision_of_run_id`.
- The referenced run must exist and belong to the authenticated user; otherwise return `not_found`.
- Revision runs create a new run row and a new run folder.
- Revision context may include prior manifest, generated source, output filenames, and sanitized logs, but should avoid leaking private content across users.
- `runs.revision_of_run_id` and `manifest.json.revision_of_run_id` are populated for revision runs.
- Previous run artifacts remain unchanged.

## Acceptance Criteria

- A user can create a revision run that references their own prior run.
- A user cannot reference another user's run.
- A missing prior run id returns the canonical `not_found` envelope.
- The new revision run has its own output folder and manifest.
- The prior run folder and manifest are not overwritten.
- Frontend refinement requests can send the prior run id when available.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run build`
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Risks

- Revision context can accidentally pull too much private data into a prompt. Keep cross-user ownership checks strict and logs sanitized.
- Revision support can drift into full editing/version control. Keep it to independent runs with a prior-run reference.

## Handoff Notes

- Cursor should review: ownership checks, non-overwrite guarantees, and whether revision context is bounded.
- Human should decide: how much prior generated content should be included in refinement prompts by default.
