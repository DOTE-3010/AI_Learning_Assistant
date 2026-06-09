<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# Product Specification

## Product Intent

AI Learning Assistant is being rebuilt as a teaching-oriented artifact studio. It helps a CUHK teaching context generate complete academic deliverables from a short task, optional reference files, and optional web search.

The primary product surface is a conversational production workbench: a prompt/control console sits beside a persistent artifact preview panel. Users should not have to hunt through a long chat transcript to find the current result. The latest code, PDF, slides, or cheat sheet should always be visible as a polished preview next to the conversation.

The current frontend appearance is not a compatibility target. The phase-1 frontend may be visually and structurally rebuilt from scratch so long as the product capabilities and backend-facing contracts remain intact.

The target aesthetic is warm, elegant, and editorial rather than sci-fi or dashboard-like. The workbench may take inspiration from modern warm AI tools and literary product surfaces, but it must remain original: warm graphite, parchment, clay/terracotta accents, readable serif typography, and product-state previews should define the experience. Do not copy proprietary brand assets, proprietary typefaces, or exact visual identity from another product.

The product should feel like a polished consumer creative tool, not a generic admin dashboard. The active QA and repair surface is the web workbench served by the Docker runtime at `/ui/`; the Electron shell remains a later packaging wrapper for the same backend and frontend contracts.

## Current Phase

The phase-1 implementation queue is complete as of 2026-06-03 and has been summarized in `docs/IMPLEMENTATION_SUMMARY.md`. Human review then identified the missing backend upload API as a pre-QA blocker because uploads are part of the phase-1 product acceptance criteria.

The upload blocker was resolved on 2026-06-03. Whole-product QA is governed by `docs/QA_PLAN.md`; agent QA phases and the first human-selected E2E usability fix pass were completed and recorded under `docs/QA_REPORTS/`. On 2026-06-05 the human completed manual E2E functional testing: all four generation capabilities passed, but three high-priority product blockers and two medium-priority follow-up areas were identified. On 2026-06-09 task 000 re-established Docker plus browser as the active functional QA baseline at `http://127.0.0.1:14242/ui/`, with Electron packaging deferred until the web product is accepted. Active work now follows the post-human-E2E repair queue in `docs/TASKS/`, with the human findings recorded in `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`.

Release readiness requires the high-priority blockers to be fixed or explicitly waived by the human: truthful run status motion plus a comfort progress bar, real generated-output previews, and LaTeX diagram-placeholder/complex-diagram avoidance. Medium-priority course context and performance bottleneck work may proceed after the high-priority queue unless the human reorders it.

## Users

- CUHK teachers using `@cuhk.edu.hk` accounts who create model answers, code solutions, slides, and course cheat sheets.
- CUHK students using `@link.cuhk.edu.hk` accounts who use the same artifact studio workflows as teachers in phase 1.
- The developer/operator who needs local `.env` or equivalent secret injection for smoke testing without committing secrets.
- Future deployment agents that may package the same product as a native app, signed macOS `.app`, or hosted server.

## Goals

- Generate complete homework code as `.py` or `.ipynb` from a task, optional reference code, and optional supporting material.
- Generate essay-style assignments as self-contained HTML source plus compiled PDF.
- Generate presentation slides as HTML slide decks plus compiled PDF.
- Generate dense A4 cheat-sheet PDFs from many course slide PDFs and a requested page count.
- Let users explicitly choose one of the four artifact modes and route to the selected pipeline.
- Treat uploads as optional and web search as `auto`, `on`, or `off`.
- Let users configure their own Qwen/OpenAI-compatible API key, base URL, and model, with development defaults only in untracked local files.
- Persist local history and settings without requiring Postgres or Mongo for the desktop product.
- Produce explicit project/output folders that users and agents can inspect, copy, diff, and package.
- Present generated artifacts in a side-by-side workbench inspired by the "chat plus artifact panel" pattern: conversation and controls on one side, current artifact preview on the other.
- Make chat feel like a production console, not a customer-support widget: user requests, run stages, warnings, and follow-up refinements should appear as actionable work history.
- Provide professional preview renderers for code, notebooks, PDFs, Beamer slides, and dense cheat sheets even when phase 1 does not allow direct editing.
- Show real generated artifact content after a run completes. Code and source/log/manifest tabs must read generated files rather than leaving static demo content in place; PDF-producing artifacts should render real PDF pages where feasible.
- Present run status honestly: idle and completed states use static indicators, active generation uses motion, and long-running generation shows a warm editorial comfort progress indicator that is clearly approximate rather than a precise provider progress percentage.
- Support optional course containers that can add compact historical context to generation without making course management the primary navigation model.
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
5. User optionally selects a course context. If no real course is selected, the app uses the default "Just Asking" course without adding course memory to the model context.
6. User enters the assignment/task text and optionally attaches files.
7. The app estimates context budget, decides whether web search is useful, and shows a compact visual status indicator.
8. The backend runs the selected artifact pipeline and streams stage status to the UI.
9. The right-side artifact panel moves from placeholder, to running preview state with approximate comfort progress, to generated code/PDF/slides/cheat-sheet preview backed by real output files.
10. User asks for follow-up refinements in the console; the app creates a new run or revision while preserving the previous output in history.
   Revision runs should carry enough prior artifact context to support meaningful refinements, with the included prior source/log budget adapting to the selected model profile's context window rather than a fixed legacy cap.
11. The app writes a structured output folder containing source files, PDFs when applicable, metadata, citations, and logs.
12. For non-default selected courses, the app updates a compact `course_context.md` summary after successful runs so later runs may use prior questions and summarized materials as optional reference.
13. User reviews, opens, copies, downloads, reveals, or regenerates the artifact. Direct in-app editing is out of scope for phase 1.

## Functional Requirements

- Weak auth must support registration and login for `@cuhk.edu.hk` and `@link.cuhk.edu.hk`.
- Teacher and student roles both have full artifact generation capability in phase 1.
- Model settings must allow user-supplied API key, base URL, and model name.
- Default model settings must target Qwen-compatible usage and be overridable by untracked local config.
- Model settings must prefill every non-secret Qwen default before the user enters an API key, so first-time users are not required to know the provider endpoint, model id, context window, or streaming capability.
- File upload parsing must support text, Markdown, Python, notebooks, and PDF text extraction as first-class inputs.
- Cheat-sheet generation must accept multiple slide PDFs and a target A4 page count.
- HTML-to-PDF pipelines must save the intermediate `.html` source even when PDF conversion fails.
- Generated HTML must not include remote image URLs unless the user uploaded a local image; diagrams should use inline SVG or CSS-based layouts that render reliably in headless Chromium.
- Every run must create durable metadata that links inputs, model profile, search mode, output files, and status.
- Runs may optionally belong to a course container. Non-default courses can provide a compact Markdown context summary as low-priority reference input; the default "Just Asking" course never contributes course context.
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
- Run status/stage indicators should be immediately legible as progress, not as an unlabeled row of technical values or inert navigation controls.
- Avoid course-management-heavy navigation in the primary flow.
- Course management, when present, is a lightweight workbench context selector. A default undeletable "Just Asking" course exists for unclassified requests and does not contribute course context; ordinary user-created courses can be archived so they disappear from the frontend without hard-deleting database rows.
- Output should be visible as files and as an in-app preview wherever feasible.
- Code and notebook previews should have editor-grade presentation: syntax highlighting, file tabs, line numbers when useful, copy affordances, run/test/status panels, and error cards. They are renderers, not editable source editors in phase 1.
- Preview tabs and file views must never be silent no-ops; before real output exists they should show useful empty, running, demo, or skeleton content, or be visibly disabled.
- PDF-producing artifacts should show a PDF-like preview inside the workbench. Essay, Beamer, and cheat-sheet outputs should not degrade to plain text unless PDF rendering fails.
- True PDF rendering is considered moderate engineering difficulty in the current Vite workbench: it needs an authenticated artifact file endpoint plus a browser renderer such as PDF.js or an equivalent safe blob-based renderer. Before that endpoint exists, showing copied absolute filesystem paths is not an acceptable substitute for in-app preview.
- Slide previews should communicate deck structure and current page/slide position.
- Cheat-sheet previews should emphasize dense A4 pagination and scale, including target page count.
- Motion should be polished but purposeful: transitions can smooth preview replacement, stage changes, panel focus, and regenerated output, while respecting reduced-motion settings.
- Visual assets should have a deliberate system: named generated images, motion briefs, texture/background assets, and a compact visual language for artifact states.
- Existing frontend visuals are disposable. Preserve user-facing capabilities and backend integration behavior, not old component structure or appearance.
- A future release should include a first-run/onboarding tutorial for new users. The exact form is intentionally undecided and is not part of the active post-human-E2E repair queue.

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
- A teacher or student can generate each artifact type -- homework code (`.py`/`.ipynb`), essay HTML + PDF, slides HTML + PDF, and a dense A4 cheat sheet -- from a task and optional uploads.
- The authenticated first screen uses a split production workbench: prompt/control console beside a persistent artifact preview panel.
- The selected artifact type is recorded in run metadata; prompt-only intent guessing is not part of the first-phase product.
- Every run produces an inspectable output folder with `manifest.json`, source files, and a compiled PDF when applicable; `.html` source survives even if PDF conversion fails.
- Code artifacts preview with syntax highlighting and copy/file affordances; HTML-producing artifacts preview as rendered HTML inline or as PDF pages before falling back to file-only output.
- Idle and completed runs show static status indicators; only active queued/running generation uses looping motion. Long-running generation shows an approximate comfort progress bar in the composer/status area without claiming exact provider progress.
- The artifact preview panel shows real generated code/source/log/manifest content after completion. Essay, slides, and cheat-sheet previews render the generated HTML inline or as PDF pages when the artifact byte endpoint is available, with a clear fallback when rendering fails.
- Web search mode (`auto`, `on`, `off`) is honored and recorded, with citations when search is used.
- With Docker Desktop running, the Electron shell launches services and opens the workbench; without it, the shell shows a clear, actionable failure state.
- A user can create and rename ordinary course containers, select one for generation, archive ordinary courses so they disappear from the frontend, and always fall back to the undeletable context-disabled "Just Asking" course.

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
- Qwen defaults are pinned in `docs/CONTRACTS/model-settings.md` as of 2026-06-03. The phase-1 default base URL targets the China (Beijing) DashScope endpoint because the human-confirmed release API key belongs to the China site. Future changes should be re-verified against current official provider documentation before tracked defaults are edited.
- Course context summaries are intentionally small by default: target about 8 KB of Markdown per course, treated as a tunable cap rather than a promise to preserve all prior conversation detail.
- Performance optimization should start with timing instrumentation. If measured live-generation time is dominated by the external model provider, especially more than half of total wall time, local optimization should not be pursued unless a separate local bottleneck is identified.

## Open Questions

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
- 2026-06-03: Pinned documented Qwen non-secret defaults for the China-site API and added human E2E usability requirements for legible run stages and non-inert preview tabs.
- 2026-06-05: Cleared the completed QA task queue by human decision and opened a narrow pre-E2E runtime/contract repair task before manual E2E resumes.
- 2026-06-05: Recorded completed human E2E results, promoted status/progress, real preview, and LaTeX diagram handling to high-priority repair work, and added medium-priority course context plus performance triage direction.
- 2026-06-09: Re-established Docker plus browser as the functional QA baseline and deferred Electron packaging until after web product acceptance.
