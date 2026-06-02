# Task: Add Dynamic Revision Context Budget

## Goal

Replace fixed revision-context source/log caps with a profile-aware bounded policy.

## Source Context

- `docs/SPEC.md`: Core Workflows, UX Requirements
- `docs/ARCH.md`: Module Boundaries, Dependency Rules
- `docs/RULES.md`: Security And Safety Rules
- `docs/CONTRACTS/generation-pipeline.md`: Context Estimation, Revision Context Budgeting
- `docs/CONTRACTS/model-settings.md`: Model Profile, Provider Rules
- `docs/TASKS/019-add-revision-run-support.md`

## Scope

### Touch

- Backend context builder budget policy.
- Focused backend tests for 128k fallback and larger profile windows.
- Governance checks affected by the new policy.

### Do Not Touch

- Do not change run API request/response shapes.
- Do not change SQLite schema.
- Do not change frontend appearance or Electron shell.
- Do not commit provider API keys or live model defaults.

## Requirements

- Revision source inclusion scales from the resolved model profile's `context_window_hint`.
- The policy preserves output budget and safety margin before allocating prior generated source.
- Logs stay capped separately and lower than source.
- Sanitization still runs before truncation.
- The backend context estimate counts the exact revision text included.

## Acceptance Criteria

- A 128k/default profile remains conservative and does not regress task 019 ownership/non-overwrite behavior.
- A larger profile hint includes substantially more prior generated source than the previous 24k-character total cap.
- Revision logs remain bounded and sanitized.
- Missing or invalid context hints fall back to the conservative backend default.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`
- `npm --prefix frontend run build`
- `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .`

## Handoff Notes

- Cursor should review: budget math, sanitization-before-truncation, and whether large-window profiles can accidentally push ordinary follow-ups into warning/critical context states.
- Human should decide: exact default Qwen model/window values after provider documentation is pinned.
