Status: Active
Last Reviewed: 2026-06-09

# Agent Instructions

This repository has completed the phase-1 rebuild from the archived MVP into an Electron-wrapped teaching product that still uses Docker Desktop for the first distributable implementation. The active project phase is whole-product QA.

Start with these files before implementing or testing:

- `docs/SPEC.md` for product intent and user workflows.
- `docs/ARCH.md` for module boundaries and migration direction.
- `docs/RULES.md` for coding, testing, security, and review rules.
- `docs/CONTRACTS/` for stable interfaces.
- `docs/IMPLEMENTATION_SUMMARY.md` for the completed development ledger.
- `docs/QA_PLAN.md` for the QA phase order, ownership, and report format.
- `docs/TASKS/` for the active bounded QA unit.

## Current Direction

- Development is complete for the phase-1 implementation queue. Old implementation task files were removed from `docs/TASKS/` on 2026-06-03 and summarized in `docs/IMPLEMENTATION_SUMMARY.md`.
- The pre-QA `/api/uploads` blocker, agent QA phases, and first human-selected E2E usability fixes were completed and recorded under `docs/QA_REPORTS/`.
- On 2026-06-05 the human completed manual E2E functional testing. All generation functions passed, but the human promoted three high-priority product blockers into the active repair queue: truthful running/complete status motion with a comfort progress bar, real generated-output previews, and LaTeX diagram-placeholder/complex-diagram avoidance.
- Medium-priority follow-up work now covers optional course context containers and performance bottleneck triage. Low-priority onboarding/tutorial work is recorded in `docs/SPEC.md` as future product direction, not an active implementation task.
- On 2026-06-09 the human decided to migrate all PDF-producing pipelines from LaTeX to HTML-native generation with Playwright HTML-to-PDF conversion (see `docs/DECISIONS/009-html-native-artifact-generation.md`). The active task queue has been replaced with a phased migration plan.
- Active work starts at `docs/TASKS/README.md`. The migration covers: cleanup of the old LaTeX toolchain, rewrite of pipelines to HTML, Docker image rebuild, test migration, and Electron packaging. See `docs/TASKS/README.md` for the full queue.
- Preserve the core idea: a teaching-oriented artifact generator for homework code, essay PDFs, HTML slide decks, and dense cheat sheets.
- Preserve CUHK-style weak auth: `@cuhk.edu.hk` and `@link.cuhk.edu.hk` registration/login remain part of the product and should be shaped so stronger auth can replace it later.
- Replace the default model path with Qwen through an OpenAI-compatible provider abstraction. Do not hard-code development API keys.
- Use SQLite as the local default datastore. Generated files belong on disk; SQLite stores metadata and status.
- First packaged target: Electron desktop shell plus Docker Desktop backend/runtime. Native no-host-dependency apps, signed macOS `.app`, and server deployments are future targets that must stay portable. However, Electron packaging is the last QA phase; all functional work targets the web layer first.
- Frontend direction: the authenticated product surface should feel like a conversational artifact workbench, with a production console beside a persistent preview panel. It should support polished preview-only rendering for code, notebooks, PDFs, Beamer slides, and cheat sheets.
- Visual direction: the workbench should feel warm, elegant, and editorial rather than sci-fi or dashboard-like. Use serif-led typography, warm graphite/ink surfaces, parchment/ivory artifact previews, clay/terracotta primary accents, restrained sage/amber/coral state color, and purposeful motion. Claude-like warmth and restraint are acceptable references, but do not copy proprietary brand assets, proprietary typefaces, exact palettes, or distinctive layouts.
- Locale direction: the workbench must support English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) UI copy through a locale catalog or equivalent boundary. Chinese copy should use serious written language and fit controls at 100% browser zoom without overflow.
- Current frontend appearance is disposable. Rebuild frontend visuals and component structure freely when tasked, but preserve backend contracts and phase-1 capabilities.

## Commands

- Backend dev env bootstrap: `python3 -m venv .venv && .venv/bin/python -m pip install --upgrade pip && .venv/bin/python -m pip install -r backend/requirements-dev.txt`
- Backend tests: `.venv/bin/python -m pytest backend/tests -q`
- Frontend tests: `npm --prefix frontend run test`
- Frontend build: `npm --prefix frontend run build`
- Frontend dev: `npm --prefix frontend run dev`
- Desktop checks: `npm --prefix apps/desktop run build && npm --prefix apps/desktop run smoke`
- Desktop launch smoke: `npm --prefix apps/desktop run launch-smoke`
- Desktop dependency audit: `npm --prefix apps/desktop audit --json`
- Docker config check: `docker compose -p ai-learning-assistant config`
- Docker runtime smoke: `docker compose -p ai-learning-assistant up --build -d && curl -fsS http://localhost:14242/health`
- Web browser launch (macOS dev/QA): `./run_web.command` (stable stub; real logic in `scripts/launcher-web.sh`)
- End-to-end smoke: `./scripts/smoke_e2e.sh`
- Electron launch (macOS packaging phase): `./run_desktop.command` (stable stub; real logic in `scripts/launcher-desktop.sh`)
- Launcher re-bless (run from human Terminal.app only, if a `.command` stub was rewritten by Cursor): `bash scripts/bless-launchers.sh`
- Governance check: `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

Commands may change during QA. Update this file and the matching QA task when a command becomes stale.

## Canonical Phase-1 Layout

- `backend/`: FastAPI API/runtime, SQLite repositories, artifact writer, model provider, context builder, and pipelines.
- `frontend/`: web workbench renderer built by Vite.
- `apps/desktop/`: Electron shell only.
- `scripts/`: dev/QA helpers and the real macOS launcher logic invoked by the `.command` stubs.
- `workspace/`: generated artifact roots and run folders.
- `data/`: local runtime metadata such as SQLite when mounted outside Docker.
- `docs/`: governance, contracts, task queue, decisions, and future asset prompts.

Do not create `apps/web/` or `services/api/` in phase 1 unless a new decision record supersedes this layout.

## Sensitive Surfaces

- Auth/session behavior requires explicit task coverage and tests.
- API key storage, `.env`, local settings files, and model provider defaults require care; never commit real secrets.
- Filesystem writes under `workspace/` or future project output folders must follow `docs/CONTRACTS/artifact-filesystem.md`.
- Docker/Electron startup scripts can delete or recreate containers only when the task explicitly says so.
- The macOS launcher stubs `run_web.command` and `run_desktop.command` are stable by design and MUST NOT be edited from Cursor or any other GUI app. macOS attaches `com.apple.provenance` to any file a GUI app writes, and `AppleSystemPolicy` then SIGKILLs the stub on Finder double-click before the launcher log is even created. Edit `scripts/launcher-web.sh` / `scripts/launcher-desktop.sh` instead. See `docs/DECISIONS/008-launcher-stub-split.md` and `.cursor/rules/launcher-stability.mdc`.
- Do not restore the deleted legacy PDF/no-code materials unless the human asks; those deletions are intentional cleanup.

## Implementation Discipline

- Work from one `docs/TASKS/NNN-*.md` QA task at a time.
- Keep fixes small enough for one agent pass and one review pass.
- Prefer contracts and tests before broad rewrites.
- Use repo-native patterns only when they still match the new architecture; legacy course/assignment/chat structure is not authoritative.
- Do not treat chat UI as a generic support widget. For frontend tasks, follow `docs/CONTRACTS/ui-workbench.md`: production console, side artifact preview, explicit artifact type, preview-only outputs, professional code/PDF renderers, and purposeful motion.
- During QA, run the tests/checks first, report blockers and risks to the human, then fix blockers and only the risks the human asks to fix.
- Do not add new product features during QA unless the human turns a QA finding into an explicit follow-up task.
- Large local cleanup is not part of QA unless a QA task or human-approved fix explicitly scopes it.

## Handoff Notes

Every QA or fix handoff should state:

- Which task file was executed.
- Files changed.
- Verification commands and results.
- Blockers found, blockers fixed, and retest results.
- Risks found and the human disposition for each risk.
- Any contract, SPEC, ARCH, or RULES updates required by what was learned.
- Remaining human decisions, especially around auth, secrets, model defaults, and distribution.
