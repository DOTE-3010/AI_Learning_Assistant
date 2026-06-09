@AGENTS.md

# Claude Code Adapter

Follow `AGENTS.md` as the canonical project instruction source. Use `docs/TASKS/` as the execution queue and keep changes bounded to one task unless the human explicitly asks for a larger migration.

When reviewing or implementing, pay special attention to:

- The project is migrating from LaTeX to HTML-native artifact generation with Playwright HTML-to-PDF. Read `docs/DECISIONS/009-html-native-artifact-generation.md` and `docs/TASKS/README.md` for the migration queue.
- Whether the change preserves the Docker plus browser development surface and the Electron packaging target in Phase 4 (task 013).
- Whether local auth and API key storage can later be replaced by stronger hosted equivalents.
- Whether generated artifacts remain portable filesystem outputs instead of being trapped in the database.
- Whether frontend changes preserve the split production-console plus artifact-preview workbench and keep generated artifacts preview-only in phase 1.
- Whether generated HTML is self-contained (inline CSS, no external resources) for reliable Playwright PDF conversion.
