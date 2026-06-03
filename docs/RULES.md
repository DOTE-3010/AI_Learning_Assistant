<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Engineering Rules

These are repo-specific rules. General programming hygiene and anything a linter/formatter can enforce is intentionally omitted.

## Coding Rules

- Implement or test one `docs/TASKS/NNN-*.md` at a time unless the human explicitly broadens scope.
- Keep module boundaries from `docs/ARCH.md` intact.
- Prefer small repository/service interfaces over direct cross-module imports.
- Do not add hard-coded API keys, default personal credentials, or real secrets.
- Preserve `.tex` source even when PDF compilation fails.
- Use structured parsers for PDFs, notebooks, JSON, and LaTeX manifests when available.
- Do not keep new product behavior only in chat; update SPEC, ARCH, RULES, or CONTRACTS when durable knowledge changes.
- During the QA phase, run the active QA checks first, report blockers and risks, then fix blockers and only human-approved risks.
- Do not add new feature work during QA unless the human converts a QA finding into a follow-up task.

## Frontend Experience Rules

- The existing frontend appearance is disposable. Do not preserve old component structure, styling, placeholder art, or dashboard/chat composition unless it actively serves the new workbench contract.
- Preserve frontend capabilities and backend-facing behavior, not old visuals. Auth, model settings, upload, search mode, run creation/status, context dial, and artifact file access should survive the rebuild.
- Frontend appearance rebuild tasks must not touch backend code. If the existing API is awkward, adapt the frontend client first; if the API is truly insufficient, create a separate backend task and contract update.
- Treat the workbench as a production console plus artifact preview, not as a generic chatbot, support widget, course dashboard, or form-only generator.
- The target visual language is warm, elegant, and editorial. Prefer warm graphite, ink, parchment, clay/terracotta, sage, amber, and coral over blue-purple sci-fi palettes, neon glows, generic dark SaaS surfaces, or dashboard-heavy styling.
- Serif typography is a product requirement, not decoration. Use a serif display/text stack for brand, pane titles, preview titles, empty states, and artifact-adjacent prose; keep dense controls in sans-serif and code/run metadata in monospace.
- Do not copy another product's proprietary brand assets, proprietary typefaces, or exact visual identity. References such as Claude can guide warmth, restraint, and editorial typography, but the product must remain original.
- The redesigned workbench must support English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) UI copy through a locale catalog or equivalent boundary. Do not add new hard-coded user-facing strings directly inside view code when implementing task 018.
- Chinese UI copy must use serious written language. Controls, chips, segmented buttons, tabs, and colored state blocks must fit at 100% browser zoom in English, Simplified Chinese, and Traditional Chinese; use stable dimensions, wrapping, concise labels, or tooltips instead of overflow.
- Keep generated artifacts preview-only in phase 1. Add copy/open/reveal/regenerate affordances, but do not add direct source editing without a new task and contract update.
- Code previews must use a real syntax-highlighting renderer and professional code chrome: file tabs, line numbers or stable gutters when useful, copy buttons, status/error panels, and readable monospace typography.
- PDF-producing artifacts should lead with rendered/PDF-like previews. Raw LaTeX is an inspectable secondary file view, not the default artifact experience.
- Motion is allowed when it clarifies generation state, panel focus, preview replacement, or refinement flow. Respect reduced-motion settings and keep animations from blocking task completion.
- Do not execute generated JavaScript, notebooks, shell commands, or arbitrary HTML in the frontend renderer unless a later sandbox contract explicitly allows it.
- Avoid UI text that explains the product in marketing language. The interface should show the workbench through controls, status, previews, and artifacts.

## Architecture Rules

- Respect the `Owns`/`Must Not Own` columns in `docs/ARCH.md`; a module reaching into another's owned surface is flagged in review.
- Electron must reach the backend only over HTTP/SSE; it must not import backend Python.
- UI and Electron must not read secrets or the SQLite file directly.
- Pipelines depend on the model provider interface and artifact writer, never on env vars or HTTP objects directly.
- Adding a new top-level app root (e.g. `apps/web/`, `services/api/`) requires a decision record first.

## Testing Rules

- Whole-product QA follows this order: agent module smoke tests, agent module unit/functional tests, agent integration tests, then human E2E functional tests.
- Agent-executed QA must report blockers and risks to the human after testing and before fixes. Agents then fix blockers and only the risks the human asks to fix.
- A QA phase cannot advance while open blockers remain unless the human explicitly waives them.
- Every QA fix must rerun the failed check and the nearest broader check that could catch a regression.
- Save durable QA findings under `docs/QA_REPORTS/` when a phase finds blockers, risks, fixes, or human decisions.
- Backend behavior needs focused tests for auth, settings, storage repositories, artifact writing, and pipeline routing.
- Frontend UI changes need at least build verification and targeted component/interaction checks when a test framework exists.
- Frontend experience changes that affect layout, typography, localization, or preview rendering need desktop and narrow-width visual QA, preferably through the in-app Browser or Playwright screenshots when available.
- Workbench visual QA must include English, Simplified Chinese, and Traditional Chinese at 100% browser zoom and confirm that labels, buttons, chips, preview headers, and artifact type controls do not overflow or overlap.
- Electron runtime tasks need explicit smoke checks for Docker detection, backend health, and window startup.
- Pipeline tasks may mock model provider calls; real API smoke tests must use untracked credentials and must not be required in CI.
- If a task removes legacy code, tests should verify the replacement path rather than preserving legacy behavior.
- For task 018, frontend build and visual QA are required; backend tests are not required unless the frontend rebuild unexpectedly changes backend-facing contracts, which it should avoid.

## Security And Safety Rules

- Weak auth is allowed only as local/teaching auth and must be isolated so stronger auth can replace it later.
- Never log raw API keys, uploaded private documents, or full prompts by default.
- Persist only references and metadata in SQLite; do not store large uploaded files or generated PDFs in database rows.
- Web search must be recorded in run metadata as `auto`, `on`, or `off`, with citations when used.
- Revision/follow-up context must be ownership-checked, sanitized, and bounded by a policy tied to the selected model profile's `context_window_hint`; do not replace this with a fixed large prompt dump.
- Any destructive filesystem cleanup must be scoped to generated runtime folders and described in the active task.
- `.env`, `.env.*`, local settings containing secrets, Docker volumes, and generated workspaces remain untracked.

## Dependency Rules

- Local default datastore is SQLite.
- Do not add Postgres or Mongo back to the local desktop runtime without a decision record.
- Qwen integration should use an OpenAI-compatible adapter first unless official documentation proves a native SDK is required.
- New frontend dependencies should serve the polished workbench experience or Electron packaging; avoid dashboard-heavy component kits unless they fit the product aesthetic.
- Syntax highlighting, PDF preview, and animation dependencies are acceptable when they replace fragile homegrown renderers and stay inside the frontend boundary.
- Do not add backend dependencies to satisfy frontend appearance work.
- New LaTeX or PDF tooling must work inside the Docker runtime.

## Contract Rules

- Any change to a file under `docs/CONTRACTS/` requires the matching code and test change in the same task.
- Every API error response and run failure uses the envelope in `docs/CONTRACTS/errors.md`; new machine codes are added to that catalog in the same task.
- Treat contract changes as breaking unless they are additive under the file's `## Compatibility` section; breaking changes require an ADR under `docs/DECISIONS/`.

## Review Rules

- Cursor review should check task size, module boundary drift, and whether contracts were followed.
- Human review is required for auth semantics, default model/provider choice, secret storage changes, and distribution behavior.
- Every task handoff must include verification commands and any residual risk.
