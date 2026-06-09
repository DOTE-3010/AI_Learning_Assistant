# QA Report: Task 005 LaTeX Diagram Policy

## Scope

- Task file: `docs/TASKS/005-harden-latex-diagram-policy.md`
- Modules covered: essay LaTeX, Beamer slides, cheat-sheet generation, shared
  LaTeX repair, and focused backend tests.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `.venv/bin/python -m pytest backend/tests/test_essay_latex_pipeline.py backend/tests/test_beamer_slides_pipeline.py backend/tests/test_cheat_sheet_pipeline.py -q` | Passed before fix | 7 tests passed; established the existing compile and repair baseline. |
| `.venv/bin/python -m pytest backend/tests/test_latex_diagram_policy.py -q` | Passed | 9 tests passed after the fix. |
| `.venv/bin/python -m pytest backend/tests -q` | Passed | 78 tests passed after the fix. |
| `/Users/myron/Desktop/constitution/coding_agent_constitution/constitution-skill/scripts/check-governance.sh .` | Passed | Governance check reported `OK`. |

## Blockers

- Fixed: explicit bracketed diagram placeholders could pass through successful
  LaTeX compilation and become visible PDF text.
- Fixed: the model-assisted LaTeX repair pass could preserve or reintroduce the
  same placeholders.

## Risks

- Residual risk: the deterministic sanitizer intentionally matches explicit
  English diagram markers and insertion instructions. Unusual or non-English
  placeholder phrasing relies on the strengthened generation and repair prompts.
- Human disposition from 2026-06-05: phase 1 should omit or summarize complex
  precision diagrams; multimodal image generation is not required.

## Fixes Applied

- Added `backend/pipelines/latex_diagrams.py` with one shared prompt policy and a
  conservative deterministic placeholder sanitizer.
- Applied the sanitizer before essay, Beamer, and cheat-sheet source is written
  or compiled.
- Applied the sanitizer after model-assisted LaTeX repair.
- Strengthened all three generation prompts and the repair prompt to prohibit
  visible placeholders, prefer prose for transformer-style precision diagrams,
  and allow only complete compiling TikZ.
- Added focused coverage for all three pipelines, repair output, placeholder
  variants, normal figure references, and complete TikZ preservation.

## Retest Results

- Explicit transformer encoder-decoder placeholders are replaced with concise
  prose before the compiler receives the source.
- Normal `[Figure 1]` references and complete `tikzpicture` source remain
  unchanged.
- Existing successful compile, failed compile, and one-pass repair tests remain
  green.

## Human Decisions Needed

- None for task 005. Any future multimodal diagram generation remains a separate
  post-phase-1 product decision.
