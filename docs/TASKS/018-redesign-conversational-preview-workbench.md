# Task: Fully Rebuild Frontend Appearance Workbench

## Goal

Replace the current frontend appearance with a polished split production-console plus artifact-preview experience while preserving backend-facing behavior.

## Source Context

- `docs/SPEC.md`: Product Intent, Core Workflows, UX Requirements
- `docs/ARCH.md`: Workbench Interaction Model
- `docs/RULES.md`: Frontend Experience Rules
- `docs/CONTRACTS/ui-workbench.md`
- `docs/CONTRACTS/visual-assets.md`
- `docs/ASSET_PROMPTS/README.md`
- `docs/DECISIONS/006-conversational-preview-workbench.md`
- `docs/DECISIONS/007-full-frontend-appearance-rebuild.md`

## Scope

### Touch

- Frontend app shell, component hierarchy, layout, and styling.
- Frontend design tokens, icons, placeholder previews, and local visual assets as needed.
- Frontend locale catalog or equivalent localization boundary for English, Simplified Chinese, and Traditional Chinese.
- Prompt/run history presentation.
- Artifact preview panel components.
- Code/PDF-like preview placeholders or renderers.
- Motion/transition styles for generation and revision states.
- Frontend API client shape only when needed to preserve existing backend contracts or carry `revision_of_run_id` when supported.

### Do Not Touch

- Do not touch `backend/`.
- Do not implement Electron shell.
- Do not change backend API contracts.
- Do not add direct editing of generated artifacts.
- Do not execute generated code, notebooks, shell commands, or arbitrary HTML in the renderer.
- Do not add broad legacy cleanup.
- Do not preserve old frontend visuals, course/dashboard surfaces, placeholder cards, or chat styling for continuity.
- Do not copy proprietary typefaces, exact palettes, icons, brand marks, or distinctive layouts from Claude/Anthropic or any other product.

## Requirements

- Treat the existing frontend appearance as disposable, but preserve working backend-facing logic when it follows documented contracts. This task may be a partial refactor of the current frontend instead of a full code rewrite if the final experience satisfies the contract.
- Replace generic dashboard/chat composition with a split workbench: production console beside persistent artifact preview.
- Replace the visual system with the warm editorial direction: serif-led headings, warm graphite/ink shell, parchment/ivory preview surfaces, clay/terracotta primary accents, sage/amber/coral state color, and restrained non-sci-fi motion.
- Use serif typography as a visible product feature for brand, pane titles, preview titles, empty states, and artifact-adjacent prose. Use sans-serif for dense controls and monospace for code, run stages, model IDs, paths, and context numbers.
- Add English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) UI support through a locale catalog or equivalent boundary. New user-facing strings should not be scattered directly through view code.
- Chinese translations must use serious written language and must be checked for layout fit at 100% browser zoom.
- Keep artifact type explicit: `code_homework`, `essay_latex`, `beamer_slides`, or `cheat_sheet`.
- Preserve backend integration behavior for auth, model settings, upload, search mode, run creation/status, context budget, error envelopes, and artifact files.
- Adapt frontend request/response handling to the documented contracts instead of changing backend code.
- Present chat/history as commands, run stages, warnings, and follow-up refinements rather than support-style bubbles.
- Provide preview states for all four artifact modes.
- Code preview must use syntax highlighting or a deliberate syntax-highlight skeleton; it must include file tabs or equivalent, copy affordance, and status/error treatment.
- PDF-producing previews must look like rendered pages or PDF-like skeleton pages by default; raw LaTeX is secondary inspection.
- Add tasteful motion for run start, preview hydration, and revision replacement, with reduced-motion fallback.
- Prefer CSS transitions/Web Animations for pane focus, preview hydration, run stage changes, and revision replacement. Add Lottie/Rive/JSON motion assets only if they are clearly useful, non-blocking, and covered by prompt notes.
- Add a follow-up/refinement composer that can associate a new request with the prior run; full backend revision-context support is task 019.
- Preserve model settings, context dial, upload controls, search mode, and run actions as capabilities; do not preserve their old visual treatment unless it fits the new system.
- Keep the frontend preview-only in phase 1: copy/open/reveal/regenerate/follow-up are allowed; direct saved editing is not.

## Implementation Strategy

Use this order unless the existing code makes a different sequence clearly smaller:

1. Preserve API/auth/model/upload/run-status logic that already follows the documented contracts.
2. Add a locale catalog or equivalent `en`/`zh-Hans`/`zh-Hant` translation boundary and migrate visible strings for the workbench, auth, model settings, artifact controls, status chips, preview headers, and errors.
3. Rework design tokens around the warm editorial palette and serif/sans/mono font stacks, including locale-aware CJK serif fallbacks.
4. Rebuild the header, pane chrome, artifact type selector, composer, utility/status surfaces, and run history into the production-console model.
5. Rebuild preview surfaces for code, essay PDF, Beamer slides, and cheat sheet using named assets from `docs/ASSET_PROMPTS/` and `frontend/src/assets/` only as placeholders or references until real artifacts exist.
6. Add purposeful motion with reduced-motion fallback and stable dimensions for controls, tabs, chips, preview headers, and context dial popovers.

## Acceptance Criteria

- Authenticated first screen shows a production console and a persistent artifact preview panel at desktop/Electron width.
- The visible frontend appearance is recognizably rebuilt and does not retain the old dashboard/chat composition.
- The workbench visually reads as warm, elegant, editorial, and scholarly rather than sci-fi, dashboard-like, or generic dark SaaS.
- Serif typography is visible in brand/pane/preview/empty-state surfaces with appropriate CJK fallbacks.
- English, Simplified Chinese, and Traditional Chinese UI modes are available through a locale catalog or equivalent boundary.
- At 100% browser zoom, English, Simplified Chinese, and Traditional Chinese labels do not overflow or overlap in artifact controls, command buttons, status chips, tabs, preview headers, auth forms, or model settings.
- Backend code and backend contracts are unchanged.
- Narrow-width layout keeps both console and preview reachable without burying preview below a long chat transcript.
- Each artifact type has a distinct preview treatment that matches `ui-workbench.md`.
- Code preview is not a plain textarea and includes syntax color, file affordance, copy action, and status/error surface.
- Essay, slides, and cheat-sheet states show PDF-like page previews or rendered PDF previews when available.
- Follow-up/refinement UI visibly creates revision/run history and can pass the prior run id when starting a refinement.
- Animations are purposeful, non-blocking, and respect reduced-motion settings.
- Motion is implemented primarily with CSS/Web Animations unless a named motion asset is explicitly justified.
- No raw API key, stack trace, generated-code execution, or direct artifact editing is introduced.

## Verification

- `npm --prefix frontend run build`
- Visual QA at 100% browser zoom for desktop and narrow widths in `en`, `zh-Hans`, and `zh-Hant` using the in-app Browser or Playwright screenshots when available.
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Risks

- The redesign can sprawl into a full editor. Keep phase 1 preview-only and use regeneration/follow-up as the edit path.
- Backend changes can sneak in to support visual work. Do not do that in this task; record backend gaps separately.
- Visual polish can hide failure states. Preserve clear canonical error handling and file access.
- New preview dependencies can bloat the renderer. Prefer focused, proven libraries over dashboard kits.
- Localization can cause hidden layout regressions. Keep control dimensions stable and verify all three supported locales at 100% zoom.

## Handoff Notes

- Cursor should review: whether the implemented UI is a true frontend appearance rebuild, follows the split workbench contract, avoids support-chat/dashboard/sci-fi drift, preserves backend contracts, keeps generated artifacts preview-only, and passes locale/typography layout checks.
- Human should decide: exact PDF renderer and syntax-highlighting/editor renderer if the implementation agent finds multiple viable options.
