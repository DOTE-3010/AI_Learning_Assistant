---
description: Broad project governance for Claude Code
---

`AGENTS.md` is canonical. Do not duplicate long project rules here.

Before implementation or QA, identify the active task file in `docs/TASKS/` and the contract files it cites. The project is at the pre-QA gate, so read `docs/IMPLEMENTATION_SUMMARY.md` and `docs/QA_PLAN.md` first, then complete `docs/TASKS/000-resolve-upload-api-pre-qa-blocker.md` before running QA tasks.

For frontend work, treat `docs/CONTRACTS/ui-workbench.md` and `docs/CONTRACTS/visual-assets.md` as required reading. The phase-1 product is a preview-only conversational workbench: production console beside artifact preview.

Run QA checks before fixes, report blockers and risks to the human, then fix blockers and only human-approved risks. If a task requires touching more than its declared scope, stop and update the task or ask the human.
