@AGENTS.md

# Claude Code Adapter

Follow `AGENTS.md` as the canonical project instruction source. Use `docs/TASKS/` as the execution queue and keep changes bounded to one task unless the human explicitly asks for a larger migration.

When reviewing or implementing, pay special attention to:

- Whether the change preserves the Electron plus Docker Desktop first-stage target.
- Whether local auth and API key storage can later be replaced by stronger hosted equivalents.
- Whether generated artifacts remain portable filesystem outputs instead of being trapped in the database.
