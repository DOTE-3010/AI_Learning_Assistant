<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: Maintain Pre-QA And QA Task Queue Index

## Goal

Keep the active task queue focused on the resolved pre-QA upload gate and whole-product QA after completion of the phase-1 implementation queue.

## Source Context

- `AGENTS.md`: QA discipline and handoff rules.
- `docs/IMPLEMENTATION_SUMMARY.md`: historical implementation ledger.
- `docs/QA_PLAN.md`: pre-QA entry gate, required QA sequence, and report format.
- `docs/SPEC.md`: phase-1 product acceptance criteria.
- `docs/RULES.md`: testing, safety, and review rules.

## Scope

### Touch

- This queue index.
- Pre-QA and QA task files under `docs/TASKS/`.
- QA reports under `docs/QA_REPORTS/` when a QA phase completes.

### Do Not Touch

- Do not restore the old implementation tasks into the active queue.
- Do not add new implementation tasks except the human-approved pre-QA upload blocker.
- Do not mark a QA task complete without verification results and human risk disposition.

## Queue Status

| State | Tasks | Owner | Notes |
| --- | --- | --- | --- |
| Resolved pre-QA gate | `000-resolve-upload-api-pre-qa-blocker` | Agent | Verified on 2026-06-03; upload API blocker no longer prevents QA start. |
| Current QA phase | `001-qa-agent-module-smoke-tests` | Agent | Establish that modules/build/runtime config can start. |
| Next | `002-qa-agent-module-functional-tests` | Agent | Run after smoke blockers are fixed or waived. |
| Next | `003-qa-agent-integration-tests` | Agent | Run after module functional blockers are fixed or waived. |
| Final QA gate | `004-qa-human-e2e-functional-tests` | Human | Human executes product workflows; agents only prepare checklist and fix reported issues. |

## Acceptance Criteria

- A fresh agent can identify the active QA phase without relying on chat history.
- Old completed implementation tasks are absent from `docs/TASKS/`.
- The resolved backend upload API gate is represented before QA tasks, not as an accepted QA risk.
- The QA queue preserves the required order: agent smoke, agent unit/functional, agent integration, human E2E.
- Agent-executed QA tasks require blocker/risk reporting before fixes and retests after fixes.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether the queue matches `docs/QA_PLAN.md`, keeps the resolved upload gate ahead of QA, and avoids reintroducing old implementation backlog.
- Human should decide: which reported QA risks deserve fixes before the human E2E gate.
