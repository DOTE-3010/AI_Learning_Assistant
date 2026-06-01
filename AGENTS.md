Status: Active
Last Reviewed: 2026-06-01

# Agent Instructions

This repository is being rebuilt from the archived MVP into an Electron-wrapped teaching product that still uses Docker Desktop for the first distributable implementation.

Start with these files before implementing:

- `docs/SPEC.md` for product intent and user workflows.
- `docs/ARCH.md` for module boundaries and migration direction.
- `docs/RULES.md` for coding, testing, security, and review rules.
- `docs/CONTRACTS/` for stable interfaces.
- `docs/TASKS/` for the next bounded implementation unit.

## Current Direction

- Preserve the core idea: a teaching-oriented artifact generator for homework code, essay PDFs, Beamer slides, and dense cheat sheets.
- Preserve CUHK-style weak auth: `@cuhk.edu.hk` and `@link.cuhk.edu.hk` registration/login remain part of the product and should be shaped so stronger auth can replace it later.
- Replace the default model path with Qwen through an OpenAI-compatible provider abstraction. Do not hard-code development API keys.
- Use SQLite as the local default datastore. Generated files belong on disk; SQLite stores metadata and status.
- First packaged target: Electron desktop shell plus Docker Desktop backend/runtime. Native no-host-dependency apps, signed macOS `.app`, and server deployments are future targets that must stay portable.
- Frontend direction: the authenticated product surface should feel like a conversational artifact workbench, with a production console beside a persistent preview panel. It should support polished preview-only rendering for code, notebooks, PDFs, Beamer slides, and cheat sheets.
- Visual direction: the workbench should feel warm, elegant, and editorial rather than sci-fi or dashboard-like. Use serif-led typography, warm graphite/ink surfaces, parchment/ivory artifact previews, clay/terracotta primary accents, restrained sage/amber/coral state color, and purposeful motion. Claude-like warmth and restraint are acceptable references, but do not copy proprietary brand assets, proprietary typefaces, exact palettes, or distinctive layouts.
- Locale direction: the workbench must support English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) UI copy through a locale catalog or equivalent boundary. Chinese copy should use serious written language and fit controls at 100% browser zoom without overflow.
- Current frontend appearance is disposable. Rebuild frontend visuals and component structure freely when tasked, but preserve backend contracts and phase-1 capabilities.

## Commands

- Backend dev env bootstrap: `python3 -m venv .venv && .venv/bin/python -m pip install --upgrade pip && .venv/bin/python -m pip install -r backend/requirements-dev.txt`
- Backend tests: `.venv/bin/python -m pytest backend/tests -q`
- Frontend build: `npm --prefix frontend run build`
- Frontend dev: `npm --prefix frontend run dev`
- Docker config check: `docker compose config`
- Docker runtime smoke: `docker compose up --build -d && curl -fsS http://localhost:14242/health`
- Governance check: `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

Commands may change during the rewrite. Update this file and the matching task when a command becomes stale.

## Canonical Phase-1 Layout

- `backend/`: FastAPI API/runtime, SQLite repositories, artifact writer, model provider, context builder, and pipelines.
- `frontend/`: web workbench renderer built by Vite.
- `apps/desktop/`: Electron shell only.
- `workspace/`: generated artifact roots and run folders.
- `data/`: local runtime metadata such as SQLite when mounted outside Docker.
- `docs/`: governance, contracts, task queue, decisions, and future asset prompts.

Do not create `apps/web/` or `services/api/` in phase 1 unless a new decision record supersedes this layout.

## Sensitive Surfaces

- Auth/session behavior requires explicit task coverage and tests.
- API key storage, `.env`, local settings files, and model provider defaults require care; never commit real secrets.
- Filesystem writes under `workspace/` or future project output folders must follow `docs/CONTRACTS/artifact-filesystem.md`.
- Docker/Electron startup scripts can delete or recreate containers only when the task explicitly says so.
- Do not restore the deleted legacy PDF/no-code materials unless the human asks; those deletions are intentional cleanup.

## Implementation Discipline

- Work from one `docs/TASKS/NNN-*.md` at a time.
- Keep implementation slices small enough for one agent pass and one review pass.
- Prefer contracts and tests before broad rewrites.
- Use repo-native patterns only when they still match the new architecture; legacy course/assignment/chat structure is not authoritative.
- Do not treat chat UI as a generic support widget. For frontend tasks, follow `docs/CONTRACTS/ui-workbench.md`: production console, side artifact preview, explicit artifact type, preview-only outputs, professional code/PDF renderers, and purposeful motion.
- For task 018, do not touch backend code or backend contracts. Adapt the frontend to existing documented APIs and record backend gaps separately.
- For task 018, partial frontend refactor is acceptable: preserve working API/auth/model/upload/run-status logic, then rebuild visual shell, design tokens, locale catalog, production console, preview surfaces, and motion to match `docs/CONTRACTS/ui-workbench.md`, `docs/CONTRACTS/visual-assets.md`, `docs/ASSET_PROMPTS/`, and the generated assets under `frontend/src/assets/`.
- Large local cleanup is allowed when scoped by a task, because remote `archived` branches preserve the old MVP.

## Handoff Notes

Every implementation handoff should state:

- Which task file was executed.
- Files changed.
- Verification commands and results.
- Any contract, SPEC, ARCH, or RULES updates required by what was learned.
- Remaining human decisions, especially around auth, secrets, model defaults, and distribution.
