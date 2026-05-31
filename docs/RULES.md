<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Engineering Rules

These are repo-specific rules. General programming hygiene and anything a linter/formatter can enforce is intentionally omitted.

## Coding Rules

- Implement one `docs/TASKS/NNN-*.md` at a time unless the human explicitly broadens scope.
- Keep module boundaries from `docs/ARCH.md` intact.
- Prefer small repository/service interfaces over direct cross-module imports.
- Do not add hard-coded API keys, default personal credentials, or real secrets.
- Preserve `.tex` source even when PDF compilation fails.
- Use structured parsers for PDFs, notebooks, JSON, and LaTeX manifests when available.
- Do not keep new product behavior only in chat; update SPEC, ARCH, RULES, or CONTRACTS when durable knowledge changes.

## Architecture Rules

- Respect the `Owns`/`Must Not Own` columns in `docs/ARCH.md`; a module reaching into another's owned surface is flagged in review.
- Electron must reach the backend only over HTTP/SSE; it must not import backend Python.
- UI and Electron must not read secrets or the SQLite file directly.
- Pipelines depend on the model provider interface and artifact writer, never on env vars or HTTP objects directly.
- Adding a new top-level app root (e.g. `apps/web/`, `services/api/`) requires a decision record first.

## Testing Rules

- Backend behavior needs focused tests for auth, settings, storage repositories, artifact writing, and pipeline routing.
- Frontend UI changes need at least build verification and targeted component/interaction checks when a test framework exists.
- Electron runtime tasks need explicit smoke checks for Docker detection, backend health, and window startup.
- Pipeline tasks may mock model provider calls; real API smoke tests must use untracked credentials and must not be required in CI.
- If a task removes legacy code, tests should verify the replacement path rather than preserving legacy behavior.

## Security And Safety Rules

- Weak auth is allowed only as local/teaching auth and must be isolated so stronger auth can replace it later.
- Never log raw API keys, uploaded private documents, or full prompts by default.
- Persist only references and metadata in SQLite; do not store large uploaded files or generated PDFs in database rows.
- Web search must be recorded in run metadata as `auto`, `on`, or `off`, with citations when used.
- Any destructive filesystem cleanup must be scoped to generated runtime folders and described in the active task.
- `.env`, `.env.*`, local settings containing secrets, Docker volumes, and generated workspaces remain untracked.

## Dependency Rules

- Local default datastore is SQLite.
- Do not add Postgres or Mongo back to the local desktop runtime without a decision record.
- Qwen integration should use an OpenAI-compatible adapter first unless official documentation proves a native SDK is required.
- New frontend dependencies should serve the polished workbench experience or Electron packaging; avoid dashboard-heavy component kits unless they fit the product aesthetic.
- New LaTeX or PDF tooling must work inside the Docker runtime.

## Contract Rules

- Any change to a file under `docs/CONTRACTS/` requires the matching code and test change in the same task.
- Every API error response and run failure uses the envelope in `docs/CONTRACTS/errors.md`; new machine codes are added to that catalog in the same task.
- Treat contract changes as breaking unless they are additive under the file's `## Compatibility` section; breaking changes require an ADR under `docs/DECISIONS/`.

## Review Rules

- Cursor review should check task size, module boundary drift, and whether contracts were followed.
- Human review is required for auth semantics, default model/provider choice, secret storage changes, and distribution behavior.
- Every task handoff must include verification commands and any residual risk.
