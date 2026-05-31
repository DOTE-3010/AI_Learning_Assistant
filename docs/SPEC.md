<!--
Owner: project-maintainer
Last Reviewed: 2026-05-31
Status: Active
-->

# Product Specification

## Product Intent

AI Learning Assistant is being rebuilt as a teaching-oriented artifact studio. It helps a CUHK teaching context generate complete, editable academic deliverables from a short task, optional reference files, and optional web search.

The product should feel like a polished consumer creative tool, not a generic admin dashboard. The first production-shaped implementation is an Electron desktop shell that depends on Docker Desktop to run the local backend, LaTeX runtime, and file processing stack.

## Users

- CUHK teachers using `@cuhk.edu.hk` accounts who create model answers, code solutions, slides, and course cheat sheets.
- CUHK students using `@link.cuhk.edu.hk` accounts when student-facing workflows are enabled later.
- The developer/operator who needs local `.env` or equivalent secret injection for smoke testing without committing secrets.
- Future deployment agents that may package the same product as a native app, signed macOS `.app`, or hosted server.

## Goals

- Generate complete homework code as `.py` or `.ipynb` from a task, optional reference code, and optional supporting material.
- Generate essay-style assignments as full LaTeX source plus compiled PDF.
- Generate presentation slides as LaTeX Beamer source plus compiled PDF.
- Generate dense A4 cheat-sheet PDFs from many course slide PDFs and a requested page count.
- Recognize intent before generation and route to the correct artifact pipeline.
- Treat uploads as optional and web search as `auto`, `on`, or `off`.
- Let users configure their own Qwen/OpenAI-compatible API key, base URL, and model, with development defaults only in untracked local files.
- Persist local history and settings without requiring Postgres or Mongo for the desktop product.
- Produce explicit project/output folders that users and agents can inspect, copy, diff, and package.

## Non-Goals

- Do not build the no-host-dependency native Electron distribution in the first phase.
- Do not implement macOS code signing, notarization, hosted server deployment, billing, or organization administration in the first phase.
- Do not keep the legacy course/assignment/chat UI as the primary product model.
- Do not store generated PDFs, notebooks, or large uploads inside the database.
- Do not optimize for multi-tenant hosted scale until the local Electron plus Docker implementation is stable.

## Core Workflows

1. User signs in or registers with the weak CUHK email auth flow.
2. User opens the desktop app and configures a model profile, or relies on a local development profile when present.
3. User chooses or lets the app infer the desired artifact type.
4. User enters the assignment/task text and optionally attaches files.
5. The app classifies intent, estimates context budget, decides whether web search is useful, and shows a compact visual status indicator.
6. The backend runs the selected artifact pipeline and streams stage status to the UI.
7. The app writes a structured output folder containing source files, PDFs when applicable, metadata, citations, and logs.
8. User reviews, opens, or regenerates the artifact.

## Functional Requirements

- Weak auth must support registration and login for `@cuhk.edu.hk` and `@link.cuhk.edu.hk`.
- Model settings must allow user-supplied API key, base URL, and model name.
- Default model settings must target Qwen-compatible usage and be overridable by untracked local config.
- File upload parsing must support text, Markdown, Python, notebooks, and PDF text extraction as first-class inputs.
- Cheat-sheet generation must accept multiple slide PDFs and a target A4 page count.
- LaTeX pipelines must save `.tex` even when PDF compilation fails.
- Every run must create durable metadata that links inputs, model profile, search mode, output files, and status.
- The Electron shell must detect Docker Desktop availability and guide startup without requiring Python or Node on the host.

## UX Requirements

- First screen should be the usable artifact studio, not a marketing page or admin dashboard.
- The UI should feel refined, visual, and consumer-grade while keeping interactions direct.
- The context/token indicator should be graphical and compact by default, with exact numbers shown on hover or focused inspection.
- Avoid course-management-heavy navigation in the primary flow.
- Output should be visible as files and as an in-app preview where feasible.
- Visual assets should have a deliberate system: named generated images, motion briefs, texture/background assets, and a compact visual language for artifact states.

## Constraints

- First implementation may depend on Docker Desktop as the only host-level runtime prerequisite.
- Local development secrets must remain untracked.
- Generated artifacts must remain portable across Electron, native desktop, and hosted server variants.
- Web search must be explicit in metadata and configurable because academic and compliance expectations differ by task.
- The old MVP is preserved remotely on `archived` and `archiveddemo`; local `main` can be aggressively rebuilt.

## Acceptance Criteria

Product-observable outcomes for the first phase:

- A teacher can register and log in with a CUHK email and land directly in the artifact studio.
- A teacher can generate each artifact type -- homework code (`.py`/`.ipynb`), essay LaTeX + PDF, Beamer slides + PDF, and a dense A4 cheat sheet -- from a task and optional uploads.
- `intent = auto` resolves to exactly one of the four pipelines and records the chosen intent in run metadata.
- Every run produces an inspectable output folder with `manifest.json`, source files, and a compiled PDF when applicable; `.tex` source survives even if PDF compilation fails.
- Web search mode (`auto`, `on`, `off`) is honored and recorded, with citations when search is used.
- With Docker Desktop running, the Electron shell launches services and opens the workbench; without it, the shell shows a clear, actionable failure state.

## Governance Acceptance

Process outcomes that make the rebuild safe for rotating agents (verified by `scripts/check-governance.sh`):

- A fresh agent can understand the rebuild from `AGENTS.md`, `docs/SPEC.md`, `docs/ARCH.md`, `docs/RULES.md`, and `docs/CONTRACTS/` without chat history.
- Each task in `docs/TASKS/` has a single goal, bounded scope, acceptance criteria, and verification commands.
- Auth, model settings, uploads, artifact files, runtime startup, and generation pipelines have explicit contracts before implementation.

## Assumptions

- Governance files are written in English for cross-agent reliability.
- UI copy can become bilingual later, but it is not required for the first implementation slice.
- The user will provide real Qwen API credentials through untracked local config or in-app settings.
- Docker Desktop is acceptable for the first packaged implementation.
- Phase-1 code stays in `backend/`, `frontend/`, and `apps/desktop/`.
- Student accounts can register and log in, but generation is disabled for students until a task explicitly enables a student workflow.
- Generated artifacts default to `workspace/`.
- If Qwen defaults are not yet verified, implementation should ship placeholder defaults plus a clear setup error rather than guessing a live endpoint.

## Open Questions

- Exact default Qwen model and endpoint should be verified against current official documentation before implementation.
- Whether students get any generation capability in the first release, or remain login-only.

## Changelog

- 2026-05-31: Rebuild specification authored; split product vs. governance acceptance criteria; added uploads as a first-class input.
