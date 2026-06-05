<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# Task: Maintain Pre-E2E Repair Task Queue

## Goal

Keep the active task queue empty after completion of the phase-1 implementation queue, agent QA phases, first human-selected E2E usability fixes, and the pre-E2E runtime/contract repair pass.

## Source Context

- `AGENTS.md`: QA discipline and handoff rules.
- `docs/IMPLEMENTATION_SUMMARY.md`: historical implementation ledger.
- `docs/QA_PLAN.md`: QA entry gates, required phase order, and report format.
- `docs/QA_REPORTS/2026-06-03-human-e2e.md`: completed human-selected fixes and remaining E2E retest context.
- `docs/SPEC.md`: phase-1 product acceptance criteria.
- `docs/RULES.md`: testing, safety, and review rules.

## Scope

### Touch

- This queue index.
- Pre-E2E repair task files under `docs/TASKS/`.
- QA reports under `docs/QA_REPORTS/` when a QA phase completes.

### Do Not Touch

- Do not restore old completed pre-QA, agent QA, or first human E2E fix tasks into the active queue.
- Do not add new implementation tasks except human-approved pre-E2E blockers/risks converted into bounded follow-up fix tasks.
- Do not mark a repair task complete without verification results and human risk disposition.

## Queue Status

| State | Tasks | Owner | Notes |
| --- | --- | --- | --- |
| Archived history | Completed pre-QA and agent QA tasks | Agent | The old numbered task queue was cleared on 2026-06-05 by human decision. Durable results remain in `docs/QA_REPORTS/` and `docs/IMPLEMENTATION_SUMMARY.md`. |
| Completed first human-selected fix pass | Workbench usability/provider/LaTeX fixes | Agent/Human | Recorded in `docs/QA_REPORTS/2026-06-03-human-e2e.md`; human will continue manual E2E from product knowledge rather than a checklist task. |
| Completed pre-E2E repair | Cleared from active task files | Agent | Completed on 2026-06-05. Fixed CORS scope, run lifecycle contract truthfulness, and automated smoke rerun friction; results are recorded in `docs/QA_REPORTS/2026-06-05-pre-e2e-runtime-contract-repairs.md`. |
| Next phase | Human E2E continuation | Human | Resume manual E2E from the product workflows and completed QA history in `docs/QA_REPORTS/`. |

## Acceptance Criteria

- A fresh agent can identify that there are no active numbered tasks and that the next step is human E2E continuation.
- Old completed implementation, pre-QA, agent QA, and first human E2E fix tasks are absent from `docs/TASKS/`.
- Completed QA history remains recoverable from `docs/QA_REPORTS/`.
- The repair task was bounded, had explicit non-goals, and did not require secret handling.
- Agent-executed repair work recorded verification commands and residual-risk handoff before human E2E resumes.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether the queue is empty except for this index and avoids reintroducing old backlog.
- Human decided on 2026-06-05: phase 1 may continue with request-synchronous run execution for release readiness.
