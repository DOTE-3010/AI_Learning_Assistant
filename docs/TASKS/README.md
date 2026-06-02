<!--
Owner: project-maintainer
Last Reviewed: 2026-06-02
Status: Active
-->

# Task: Maintain Task Queue Index

## Goal

Keep the numbered task queue readable for rotating agents, especially when urgent tasks land out of numeric order.

## Source Context

- `AGENTS.md`: Implementation Discipline
- `docs/SPEC.md`: Governance Acceptance
- `docs/RULES.md`: Coding Rules
- `docs/TASKS/*.md`

## Scope

### Touch

- This queue index.
- Individual task files only when their source context, scope, or handoff notes become stale.

### Do Not Touch

- Do not replace the numbered task files.
- Do not mark implementation tasks complete without either verification results or an explicit human/agent handoff.
- Do not fold broad cleanup into a queue-index update.

## Queue Status

| State | Tasks | Notes |
| --- | --- | --- |
| Completed by queue position | `000`-`018` | Earlier rebuild foundations are treated as complete because the active queue has advanced past them. |
| Landed but uncommitted | `019`, `020`, `021`, `023` | Current workspace includes revision-run support, Electron Docker shell scaffold, Docker compose/launcher runtime wiring, and dynamic revision-context budgeting. Review or commit before broad cleanup if a cleaner diff stack is desired. |
| Completed in current workspace | `022-end-to-end-smoke-and-legacy-cleanup` | End-to-end smoke script, README/runtime docs, launcher health wait, persistent Docker model secret file, mock provider smoke mode, and confirmed legacy cleanup are landed but uncommitted. |
| Next | Future task | Implement backend upload API or split additional cleanup if review finds compatibility surfaces still needed. |

## Open Follow-Up Decisions

- Exact default Qwen endpoint/model/window values remain open until provider documentation is pinned.
- Web-search provider choice and rate/cost limits remain open.
- Native no-Docker packaging, signed macOS app distribution, and app icon/name polish are future-phase decisions.

## Acceptance Criteria

- A fresh agent can identify the next implementation task without relying on chat history.
- Out-of-order completed tasks are recorded without renumbering the queue.
- The index does not weaken the bounded scope of individual task files.

## Verification

- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: whether the queue status matches the actual diff stack before cleanup.
- Human should decide: whether to commit the landed `019`/`020`/`023` stack before or after task `021`.
