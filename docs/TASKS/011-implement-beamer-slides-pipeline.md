# Task: Implement Beamer Slides Pipeline

## Goal

Generate presentation slides as full LaTeX Beamer source and compiled PDF when possible.

## Source Context

- `docs/SPEC.md`: Goals
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/artifact-filesystem.md`

## Scope

### Touch

- Beamer slides pipeline module.
- Beamer template/style asset if needed.
- Pipeline tests with mocked model and compile behavior.

### Do Not Touch

- Do not implement essay or cheat-sheet pipelines in this task.
- Do not add visual slide editor UI.

## Requirements

- Generate complete Beamer `.tex`, not frame fragments only.
- Save `slides.tex` before compilation.
- Compile to `slides.pdf` when possible.
- Record artifacts and logs.

## Acceptance Criteria

- Mocked Beamer output writes `slides.tex`.
- Successful compile records `slides.pdf`.
- Failed compile preserves source and logs.
- Manifest identifies intent as `beamer_slides`.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Beamer templates can overfit one style. Keep first style simple and replaceable.

## Handoff Notes

- Cursor should review: full-document LaTeX contract.
- Human should decide: visual slide theme direction later.
