<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# Task Queue: HTML-Native Migration and Electron Packaging

## Goal

Migrate all PDF-producing artifact pipelines from LaTeX (TeX Live + latexmk) to HTML-native generation with Playwright HTML-to-PDF conversion. Then verify the full product through Docker plus browser QA and package into Electron for release.

## Source Context

- `AGENTS.md`: project instructions and commands.
- `docs/DECISIONS/009-html-native-artifact-generation.md`: the ADR for this migration.
- `docs/IMPLEMENTATION_SUMMARY.md`: historical implementation ledger.
- `docs/SPEC.md`: product acceptance criteria (updated for HTML-native).
- `docs/ARCH.md`: module boundaries and technology stack (updated for Playwright).
- `docs/CONTRACTS/generation-pipeline.md`: pipeline rules (updated for HTML).
- `docs/CONTRACTS/artifact-filesystem.md`: output file shapes (updated for `.html`).
- `slides_html/shared/deck.css`: reference slide layout vocabulary.

## Four-Phase Strategy

### Phase 1 — Cleanup

Remove the LaTeX toolchain from Docker, clean up workspace/database artifacts from old LaTeX runs, and prepare the runtime for the new HTML-to-PDF approach.

### Phase 2 — Pipeline Migration (by module)

Rewrite essay, slides, and cheat-sheet pipelines to generate self-contained HTML and convert to PDF via Playwright. Remove LaTeX-specific code (sanitizers, repair pass, TikZ fixups). Update prompts for HTML output. Each pipeline is an independent task.

### Phase 3 — Testing

Migrate and extend unit tests and integration tests for the new pipelines. Verify the E2E smoke script works with the new toolchain.

### Phase 4 — Electron Packaging

Re-wrap the verified web product into the Electron shell for release distribution.

## Queue Status

| # | Task | Phase | State | Owner |
| --- | --- | --- | --- | --- |
| 001 | Remove LaTeX toolchain from Docker | 1 | Completed | Agent |
| 002 | Add Playwright HTML-to-PDF infrastructure | 1 | Completed | Agent |
| 003 | Clean workspace and database for fresh start | 1 | Completed | Agent |
| 004 | Rewrite essay pipeline to HTML | 2 | Completed | Agent |
| 005 | Rewrite slides pipeline to HTML | 2 | Completed | Agent |
| 006 | Rewrite cheat-sheet pipeline to HTML | 2 | Completed | Agent |
| 007 | Remove LaTeX sanitizer and repair modules | 2 | Completed | Agent |
| 008 | Update context builder and run orchestration | 2 | Completed | Agent |
| 009 | Update frontend preview for HTML artifacts | 2 | Completed | Agent |
| 010 | Migrate pipeline unit tests | 3 | Completed | Agent |
| 011 | Add integration tests for HTML-to-PDF | 3 | Completed | Agent |
| 012 | Update E2E smoke script | 3 | Pending | Agent |
| 013 | Electron packaging for release | 4 | Pending | Agent/Human |

## Completed History

| Phase | Summary | Records |
| --- | --- | --- |
| Phase-1 implementation | Tasks 000–023 completed the phase-1 rebuild with LaTeX pipelines. | `docs/IMPLEMENTATION_SUMMARY.md` |
| Post-human-E2E repair | Tasks 000–013 (old queue) completed QA repairs including status/progress, course context, and LaTeX sanitization. | `docs/QA_REPORTS/` |

## Task Dependencies

```text
001 (remove TeX Live) ──┐
                        ├──> 004, 005, 006 (pipeline rewrites, can be parallel)
002 (add Playwright)  ──┘         │
                                  ├──> 007 (remove LaTeX modules)
003 (clean workspace) ────────────┤
                                  ├──> 008 (update orchestration)
                                  │
                                  ├──> 009 (frontend preview)
                                  │
                                  └──> 010, 011, 012 (tests)
                                              │
                                              └──> 013 (Electron)
```

## Acceptance Criteria

- A fresh agent can identify the four-phase structure and execute tasks in dependency order.
- Each task file is self-contained with goal, scope, steps, verification commands, and non-goals.
- Phase 4 does not begin until the human explicitly declares the web product acceptable.
- No LaTeX tooling remains in the Docker image after Phase 1 completes.
- All four artifact intents produce correct output after Phase 2 completes.

## Verification

- `docker compose -p ai-learning-assistant config`
- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run test`
- `npm --prefix frontend run build`
- `./scripts/smoke_e2e.sh`
