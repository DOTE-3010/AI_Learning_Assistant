<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Product Specification

## Product Intent

AI Learning Assistant is being rebuilt as a teaching-oriented artifact studio. It helps a CUHK teaching context generate complete academic deliverables from a short task, optional reference files, and optional web search.

The primary product surface is a conversational production workbench: a prompt/control console sits beside a persistent artifact preview panel. Users should not have to hunt through a long chat transcript to find the current result. The latest code, PDF, slides, or cheat sheet should always be visible as a polished preview next to the conversation.

The current frontend appearance is not a compatibility target. The phase-1 frontend may be visually and structurally rebuilt from scratch so long as the product capabilities and backend-facing contracts remain intact.

The target aesthetic is warm, elegant, and editorial rather than sci-fi or dashboard-like. The workbench may take inspiration from modern warm AI tools and literary product surfaces, but it must remain original: warm graphite, parchment, clay/terracotta accents, readable serif typography, and product-state previews should define the experience. Do not copy proprietary brand assets, proprietary typefaces, or exact visual identity from another product.

The product should feel like a polished consumer creative tool, not a generic admin dashboard. The first production-shaped implementation is an Electron desktop shell that depends on Docker Desktop to run the local backend, LaTeX runtime, and file processing stack.

## Current Phase

The phase-1 implementation queue is complete as of 2026-06-03 and has been summarized in `docs/IMPLEMENTATION_SUMMARY.md`. Human review then identified the missing backend upload API as a pre-QA blocker because uploads are part of the phase-1 product acceptance criteria.

The upload blocker was resolved on 2026-06-03 by `docs/TASKS/000-resolve-upload-api-pre-qa-blocker.md`. Whole-product QA is now governed by `docs/QA_PLAN.md` and begins with `docs/TASKS/001-qa-agent-module-smoke-tests.md`. QA must validate this specification before release readiness is declared. Known gaps or risks found during QA should be reported to the human, then either fixed, accepted as risk, or moved to future-phase scope by explicit human decision.

## Users

- CUHK teachers using `@cuhk.edu.hk` accounts who create model answers, code solutions, slides, and course cheat sheets.
- CUHK students using `@link.cuhk.edu.hk` accounts who use the same artifact studio workflows as teachers in phase 1.
- The developer/operator who needs local `.env` or equivalent secret injection for smoke testing without committing secrets.
- Future deployment agents that may package the same product as a native app, signed macOS `.app`, or hosted server.

## Goals

- Generate complete homework code as `.py` or `.ipynb` from a task, optional reference code, and optional supporting material.
- Generate essay-style assignments as full LaTeX source plus compiled PDF.
- Generate presentation slides as LaTeX Beamer source plus compiled PDF.
- Generate dense A4 cheat-sheet PDFs from many course slide PDFs and a requested page count.
- Let users explicitly choose one of the four artifact modes and route to the selected pipeline.
- Treat uploads as optional and web search as `auto`, `on`, or `off`.
- Let users configure their own Qwen/OpenAI-compatible API key, base URL, and model, with development defaults only in untracked local files.
- Persist local history and settings without requiring Postgres or Mongo for the desktop product.
- Produce explicit project/output folders that users and agents can inspect, copy, diff, and package.
- Present generated artifacts in a side-by-side workbench inspired by the "chat plus artifact panel" pattern: conversation and controls on one side, current artifact preview on the other.
- Make chat feel like a production console, not a customer-support widget: user requests, run stages, warnings, and follow-up refinements should appear as actionable work history.
- Provide professional preview renderers for code, notebooks, PDFs, Beamer slides, and dense cheat sheets even when phase 1 does not allow direct editing.
- Support English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) UI copy for the authenticated workbench, using serious written language rather than casual marketing or support-chat phrasing.

## Non-Goals

- Do not build the no-host-dependency native Electron distribution in the first phase.
- Do not implement macOS code signing, notarization, hosted server deployment, billing, or organization administration in the first phase.
- Do not keep the legacy course/assignment/chat UI as the primary product model.
- Do not preserve the current frontend's visual treatment, layout, components, placeholder art, or styling merely for continuity.
- Do not store generated PDFs, notebooks, or large uploads inside the database.
- Do not optimize for multi-tenant hosted scale until the local Electron plus Docker implementation is stable.

## Core Workflows

1. User signs in or registers with the weak CUHK email auth flow.
2. User opens the desktop app and configures a model profile, or relies on a local development profile when present.
3. User lands in a split workbench with the production console on the left and artifact preview on the right.
4. User chooses the desired artifact type from an explicit control.
5. User enters the assignment/task text and optionally attaches files.
6. The app estimates context budget, decides whether web search is useful, and shows a compact visual status indicator.
7. The backend runs the selected artifact pipeline and streams stage status to the UI.
8. The right-side artifact panel moves from placeholder, to running preview state, to generated code/PDF/slides/cheat-sheet preview.
9. User asks for follow-up refinements in the console; the app creates a new run or revision while preserving the previous output in history.
   Revision runs should carry enough prior artifact context to support meaningful refinements, with the included prior source/log budget adapting to the selected model profile's context window rather than a fixed legacy cap.
10. The app writes a structured output folder containing source files, PDFs when applicable, metadata, citations, and logs.
11. User reviews, opens, copies, downloads, reveals, or regenerates the artifact. Direct in-app editing is out of scope for phase 1.

## Functional Requirements

- Weak auth must support registration and login for `@cuhk.edu.hk` and `@link.cuhk.edu.hk`.
- Teacher and student roles both have full artifact generation capability in phase 1.
- Model settings must allow user-supplied API key, base URL, and model name.
- Default model settings must target Qwen-compatible usage and be overridable by untracked local config.
- File upload parsing must support text, Markdown, Python, notebooks, and PDF text extraction as first-class inputs.
- Cheat-sheet generation must accept multiple slide PDFs and a target A4 page count.
- LaTeX pipelines must save `.tex` even when PDF compilation fails.
- Every run must create durable metadata that links inputs, model profile, search mode, output files, and status.
- The Electron shell must detect Docker Desktop availability and guide startup without requiring Python or Node on the host.

## UX Requirements

- First screen should be the usable artifact studio, not a marketing page or admin dashboard.
- The UI should feel like a warm editorial conversational workbench while remaining preview-only in phase 1.
- The UI should feel warm, elegant, and scholarly: an artifact studio with editorial typography, paper-like previews, clay/terracotta accents, and restrained motion. Avoid neon, glow-heavy, cyberpunk, blue-purple sci-fi, or generic dashboard styling.
- Serif typography is required as a visible part of the product voice. Use serif display/text treatment for brand, pane titles, preview titles, empty states, and longer artifact-adjacent prose; use sans-serif for dense controls and mono for code, paths, model IDs, and run stages.
- English, Simplified Chinese, and Traditional Chinese UI strings must be supported through a locale catalog or equivalent localization boundary. Do not scatter hard-coded user-facing strings through components when implementing the redesigned workbench.
- Chinese translations must use formal written language. They should be concise enough for 100% browser zoom in desktop and narrow layouts, with controls designed to wrap or abbreviate intentionally rather than overflow colored blocks.
- The main layout should pair a chat-like production console with an independent artifact side panel.
- Chat messages should feel like commands, run logs, and refinement requests, not generic support bubbles.
- The artifact side panel should always show the current output state, not only a file list after generation.
- Artifact type must be selected through an explicit UI control such as a dropdown, segmented selector, or tabs; the backend must not infer the pipeline solely from prompt text.
- The context/token indicator should be graphical and compact by default, with exact numbers shown on hover or focused inspection.
- Avoid course-management-heavy navigation in the primary flow.
- Output should be visible as files and as an in-app preview wherever feasible.
- Code and notebook previews should have editor-grade presentation: syntax highlighting, file tabs, line numbers when useful, copy affordances, run/test/status panels, and error cards. They are renderers, not editable source editors in phase 1.
- PDF-producing artifacts should show a PDF-like preview inside the workbench. Essay, Beamer, and cheat-sheet outputs should not degrade to plain text unless PDF rendering fails.
- Slide previews should communicate deck structure and current page/slide position.
- Cheat-sheet previews should emphasize dense A4 pagination and scale, including target page count.
- Motion should be polished but purposeful: transitions can smooth preview replacement, stage changes, panel focus, and regenerated output, while respecting reduced-motion settings.
- Visual assets should have a deliberate system: named generated images, motion briefs, texture/background assets, and a compact visual language for artifact states.
- Existing frontend visuals are disposable. Preserve user-facing capabilities and backend integration behavior, not old component structure or appearance.

## Constraints

- First implementation may depend on Docker Desktop as the only host-level runtime prerequisite.
- Local development secrets must remain untracked.
- Generated artifacts must remain portable across Electron, native desktop, and hosted server variants.
- Web search must be explicit in metadata and configurable because academic and compliance expectations differ by task.
- The old MVP is preserved remotely on `archived` and `archiveddemo`; local `main` can be aggressively rebuilt.
- Frontend rebuild tasks should keep backend behavior and API contracts stable. If an API mismatch is discovered, adapt the frontend or create a separate backend-contract task rather than folding backend changes into the appearance rebuild.

## Acceptance Criteria

Product-observable outcomes for the first phase:

- A teacher or student can register and log in with a CUHK email and land directly in the artifact studio.
- A teacher or student can generate each artifact type -- homework code (`.py`/`.ipynb`), essay LaTeX + PDF, Beamer slides + PDF, and a dense A4 cheat sheet -- from a task and optional uploads.
- The authenticated first screen uses a split production workbench: prompt/control console beside a persistent artifact preview panel.
- The selected artifact type is recorded in run metadata; prompt-only intent guessing is not part of the first-phase product.
- Every run produces an inspectable output folder with `manifest.json`, source files, and a compiled PDF when applicable; `.tex` source survives even if PDF compilation fails.
- Code artifacts preview with syntax highlighting and copy/file affordances; PDF-producing artifacts preview as rendered pages or PDF-like pages before falling back to file-only output.
- Web search mode (`auto`, `on`, `off`) is honored and recorded, with citations when search is used.
- With Docker Desktop running, the Electron shell launches services and opens the workbench; without it, the shell shows a clear, actionable failure state.

## Governance Acceptance

Process outcomes that make the rebuild safe for rotating agents (verified by `scripts/check-governance.sh`):

- A fresh agent can understand the rebuild from `AGENTS.md`, `docs/SPEC.md`, `docs/ARCH.md`, `docs/RULES.md`, and `docs/CONTRACTS/` without chat history.
- Each task in `docs/TASKS/` has a single goal, bounded scope, acceptance criteria, and verification commands.
- Auth, model settings, uploads, artifact files, runtime startup, and generation pipelines have explicit contracts before implementation.

## Assumptions

- Governance files are written in English for cross-agent reliability.
- The phase-1 workbench supports English, Simplified Chinese, and Traditional Chinese UI copy; generated artifact content remains whatever language the user asks for.
- The user will provide real Qwen API credentials through untracked local config or in-app settings.
- Docker Desktop is acceptable for the first packaged implementation.
- Phase-1 code stays in `backend/`, `frontend/`, and `apps/desktop/`.
- Student accounts have the same phase-1 artifact generation capability as teacher accounts.
- Generated artifacts default to `workspace/`.
- If Qwen defaults are not yet verified, implementation should ship placeholder defaults plus a clear setup error rather than guessing a live endpoint.

## Open Questions

- Exact default Qwen model and endpoint should be verified against current official documentation before implementation.
- None for first-phase student generation; students have full generation capability.

## Changelog

- 2026-05-31: Rebuild specification authored; split product vs. governance acceptance criteria; added uploads as a first-class input.
- 2026-05-31: Updated phase-1 decisions: students get full generation access; artifact type must be explicitly selected rather than inferred from prompt text.
- 2026-06-01: Strengthened frontend direction around a conversational production console plus persistent artifact preview panel, preview-only phase-1 behavior, editor-grade code rendering, PDF-like previews, and purposeful motion.
- 2026-06-01: Clarified that the existing frontend appearance is disposable; upcoming frontend work should fully rebuild the product surface while preserving backend-facing contracts and capabilities.
- 2026-06-01: Added warm editorial visual direction, required serif typography, and English/Simplified Chinese/Traditional Chinese workbench localization requirements.
- 2026-06-03: Marked the implementation queue complete, moved active work to whole-product QA, and added implementation-summary and QA-plan governance assets.
- 2026-06-03: Promoted missing backend upload API from QA risk to pre-QA blocker by human decision.
- 2026-06-03: Resolved the upload pre-QA blocker and moved the active queue to agent module smoke QA.
