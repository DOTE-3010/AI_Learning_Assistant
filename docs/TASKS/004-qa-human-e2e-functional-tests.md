<!--
Owner: project-maintainer
Last Reviewed: 2026-06-03
Status: Active
-->

# Task: QA Human E2E Functional Tests

## Goal

Guide the human through final end-to-end functional testing after agent smoke, module functional, and integration phases have no open blockers.

## Source Context

- `docs/QA_PLAN.md`
- `docs/IMPLEMENTATION_SUMMARY.md`
- `docs/SPEC.md`
- `docs/ARCH.md`
- `docs/RULES.md`
- `docs/CONTRACTS/`
- Agent QA reports under `docs/QA_REPORTS/`

## Scope

### Touch

- Human E2E notes and reports under `docs/QA_REPORTS/`.
- Follow-up fix tasks only after the human reports blockers or selects risks to fix.

### Do Not Touch

- Agents do not execute this task as the final authority.
- Do not mark human E2E complete based only on automated smoke tests.
- Do not treat future-phase native packaging, code signing, hosted deployment, billing, or organization administration as phase-1 blockers.

## Requirements

- Human verifies registration/login with allowed CUHK domains and rejected non-CUHK domains.
- Human verifies model settings with approved local credentials or accepts mocked-provider limitation.
- Human verifies the workbench first screen, explicit artifact type selection, search mode control, context dial, run status, artifact preview, generated file affordances, and revision/follow-up flow.
- Human verifies all four artifact modes: code homework, essay LaTeX/PDF, Beamer slides/PDF, and cheat sheet/PDF.
- Human verifies English, Simplified Chinese (`zh-Hans`), and Traditional Chinese (`zh-Hant`) copy at 100% browser zoom without obvious overflow or overlap.
- Human records blockers and risks, then tells an agent which risks should be fixed before release.

## Acceptance Criteria

- Human E2E report exists or the human gives an explicit written pass/fail handoff in the thread.
- Every phase-1 product acceptance criterion in `docs/SPEC.md` is marked pass, blocker, accepted risk, or future-phase non-goal.
- Agent-owned QA reports from tasks `001`, `002`, and `003` have no open blockers before human E2E starts.
- Human-selected blockers/risks are converted into follow-up tasks or fixed by a designated agent.

## Verification

- Manual: launch the product through `./run_desktop.command` or the documented Docker plus workbench URL path.
- Manual: complete the E2E checklist in this task and save/report results.
- Manual: retest any human-selected blocker or risk fix before release approval.

## Handoff Notes

- Cursor should review: human-selected fixes for contract drift, security regressions, and frontend locale/preview regressions.
- Human should decide: final release readiness, accepted risks, and whether live-provider/web-search gaps block phase 1.
