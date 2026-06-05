<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# Task: Maintain Post-Human-E2E Repair Task Queue

## Goal

Keep the active task queue aligned with the 2026-06-05 human E2E completion findings and the durable governance contracts.

## Source Context

- `AGENTS.md`: QA discipline and handoff rules.
- `docs/IMPLEMENTATION_SUMMARY.md`: historical implementation ledger.
- `docs/QA_PLAN.md`: QA entry gates, required phase order, and report format.
- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: completed human E2E results and the new blocker/risk queue.
- `docs/SPEC.md`: phase-1 product acceptance criteria.
- `docs/RULES.md`: testing, safety, and review rules.

## Scope

### Touch

- This queue index.
- Pre-E2E repair task files under `docs/TASKS/`.
- QA reports under `docs/QA_REPORTS/` when a QA phase completes.

### Do Not Touch

- Do not restore old completed pre-QA, agent QA, or first human E2E fix tasks into the active queue.
- Do not add new implementation tasks except human-approved post-human-E2E blockers/risks converted into bounded follow-up fix tasks.
- Do not mark a repair task complete without verification results and human risk disposition.

## Queue Status

| State | Tasks | Owner | Notes |
| --- | --- | --- | --- |
| Active high priority | `001`-`005` | Agent | Fix truthful status/progress, artifact access, real previews, PDF page preview, and LaTeX diagram handling. |
| Active medium priority | `006`-`011` | Agent | Add timing instrumentation/triage and course context containers. |
| Deferred low priority | Onboarding/tutorial | Human/Agent | Recorded in `docs/SPEC.md`; no implementation task until the human chooses a tutorial form. |
| Archived history | Completed implementation, pre-QA, agent QA, first E2E fixes, and pre-E2E repair tasks | Agent | Durable results remain in `docs/QA_REPORTS/` and `docs/IMPLEMENTATION_SUMMARY.md`. |

## Acceptance Criteria

- A fresh agent can identify the active post-human-E2E numbered tasks and execute them in priority order.
- Old completed implementation, pre-QA, agent QA, first human E2E fix, and pre-E2E repair tasks are absent from `docs/TASKS/`.
- Completed QA history remains recoverable from `docs/QA_REPORTS/`.
- Each active repair/follow-up task is bounded, has explicit non-goals, and names verification commands.
- Agent-executed repair work records verification commands and residual-risk handoff before release readiness is claimed.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether active tasks remain bounded and whether high-priority blockers are completed before medium-priority follow-ups.
- Human decided on 2026-06-05: all generation functions pass, but release readiness requires high-priority repair tasks or explicit human waiver.
