<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# Task Queue: Web-First QA and Electron Packaging

## Goal

Validate the phase-1 product through a web-browser QA cycle before packaging into Electron for release. All functional QA happens at the Docker plus browser level; the Electron shell is a distribution wrapper tested last.

## Source Context

- `AGENTS.md`: QA discipline and handoff rules.
- `docs/IMPLEMENTATION_SUMMARY.md`: historical implementation ledger.
- `docs/QA_PLAN.md`: QA entry gates, required phase order, and report format.
- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: completed human E2E results and the new blocker/risk queue.
- `docs/SPEC.md`: phase-1 product acceptance criteria.
- `docs/RULES.md`: testing, safety, and review rules.

## Three-Phase Strategy

On 2026-06-09 the human restructured the queue into three sequential phases. The existing post-human-E2E repair tasks (001–011) remain intact; a web-browser baseline step is prepended and Electron packaging is appended.

### Phase A — Web Browser QA Baseline

Regress to Docker plus browser. Verify that the full product works correctly at `http://127.0.0.1:14242/ui/` in a standard browser, without any Electron dependency. This establishes the primary development and QA surface.

**Task:** `000-web-browser-qa-baseline.md`

### Phase B — Post-Human-E2E Repair Queue (existing tasks)

Complete the prioritized repair and follow-up tasks identified during the 2026-06-05 human E2E completion. Issues found during subsequent human E2E passes are filed as additional bounded fix tasks. This phase loops until the human declares the web product acceptable.

**Tasks:** `001` through `011` (see queue table below), plus additional fix tasks created on demand.

### Phase C — Electron Packaging for Release

After the web product passes human QA, re-wrap into Electron. QA at this phase covers Electron-specific concerns only: window behavior, Docker detection/startup, menu integration, launcher scripts, and platform packaging.

**Task:** `012-electron-packaging-release.md`

## Scope

### Touch

- This queue index.
- Task files under `docs/TASKS/`.
- QA reports under `docs/QA_REPORTS/` when a QA phase completes.

### Do Not Touch

- Do not restore old completed pre-QA, agent QA, or first human E2E fix tasks into the active queue.
- Do not add new implementation tasks except human-approved blockers/risks converted into bounded follow-up fix tasks.
- Do not mark a repair task complete without verification results and human risk disposition.

## Queue Status

| # | Task | Phase | Priority | State | Owner |
| --- | --- | --- | --- | --- | --- |
| 000 | Web browser QA baseline | A | — | Pending | Agent |
| 001 | Fix run status motion and comfort progress | B | High | Pending | Agent |
| 002 | Add authenticated artifact access API | B | High | Pending | Agent |
| 003 | Render real artifact preview content | B | High | Pending | Agent |
| 004 | Add PDF page preview renderer | B | High | Pending | Agent |
| 005 | Harden LaTeX diagram policy | B | High | Pending | Agent |
| 006 | Add run timing instrumentation | B | Medium | Pending | Agent |
| 007 | Run performance bottleneck triage | B | Medium | Pending | Agent |
| 008 | Add course container API | B | Medium | Pending | Agent |
| 009 | Attach runs to courses | B | Medium | Pending | Agent |
| 010 | Add course selector workbench UI | B | Medium | Pending | Agent |
| 011 | Integrate compact course context | B | Medium | Pending | Agent |
| — | Additional human E2E fix tasks | B | On demand | Created as needed | Agent/Human |
| 012 | Electron packaging for release | C | — | Blocked on Phase B | Agent/Human |
| — | Onboarding/tutorial | Deferred | Low | No task until human chooses form | Human/Agent |

## Completed History

| Phase | Summary | Records |
| --- | --- | --- |
| Implementation | Tasks 000–023 completed the phase-1 rebuild. | `docs/IMPLEMENTATION_SUMMARY.md` |
| Pre-QA blocker | Upload API resolved. | `docs/IMPLEMENTATION_SUMMARY.md` |
| Agent QA (smoke, functional, integration) | All agent QA phases passed. | `docs/QA_REPORTS/2026-06-03-agent-*.md` |
| First human E2E fixes | Workbench usability, provider, and LaTeX fixes applied. | `docs/QA_REPORTS/2026-06-03-human-e2e.md` |
| Pre-E2E runtime/contract repairs | CORS, run lifecycle, and smoke friction fixed. | `docs/QA_REPORTS/2026-06-05-pre-e2e-runtime-contract-repairs.md` |
| Human E2E completion | All generation functions pass; repair queue populated. | `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md` |

## Acceptance Criteria

- A fresh agent can identify the three-phase structure and execute tasks in order (Phase A first, then Phase B by priority, Phase C last).
- Old completed tasks are absent from `docs/TASKS/`.
- Completed QA history remains recoverable from `docs/QA_REPORTS/`.
- Each active task is bounded, has explicit non-goals, and names verification commands.
- Phase C does not begin until the human explicitly declares Phase B complete.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether active tasks remain bounded and whether Phase A baseline is verified before Phase B repair work begins.
- Human decided on 2026-06-09: regress to browser-level QA first; defer Electron packaging until after web product passes human E2E.
- Human decided on 2026-06-05: all generation functions pass, but release readiness requires high-priority repair tasks or explicit human waiver.
