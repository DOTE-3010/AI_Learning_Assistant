---
description: Broad project governance for Claude Code
---

`AGENTS.md` is canonical. Do not duplicate long project rules here.

Before implementation, identify the active task file in `docs/TASKS/` and the contract files it cites. If a task requires touching more than its declared scope, stop and update the task or ask the human.

For frontend work, treat `docs/CONTRACTS/ui-workbench.md` and `docs/CONTRACTS/visual-assets.md` as required reading. The phase-1 product is a preview-only conversational workbench: production console beside artifact preview.

For task 018, the old frontend appearance is disposable, but backend code and contracts are stable boundaries. Do not change backend files to satisfy visual/product-surface work.
