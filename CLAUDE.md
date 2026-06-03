@AGENTS.md

# Claude Code Adapter

Follow `AGENTS.md` as the canonical project instruction source. Use `docs/TASKS/` as the execution queue and keep changes bounded to one task unless the human explicitly asks for a larger migration.

When reviewing or implementing, pay special attention to:

- The project is at the pre-QA gate. Read `docs/IMPLEMENTATION_SUMMARY.md`, `docs/QA_PLAN.md`, and complete `docs/TASKS/000-resolve-upload-api-pre-qa-blocker.md` before running QA tasks.
- Whether the change preserves the Electron plus Docker Desktop first-stage target.
- Whether local auth and API key storage can later be replaced by stronger hosted equivalents.
- Whether generated artifacts remain portable filesystem outputs instead of being trapped in the database.
- Whether frontend changes preserve the split production-console plus artifact-preview workbench and keep generated artifacts preview-only in phase 1.
- Whether QA findings are reported as blockers/risks before fixes, and whether risks have human disposition before being fixed.
