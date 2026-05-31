# Task: Implement Essay LaTeX Pipeline

## Goal

Generate full LaTeX essay/report source and compile PDF when possible.

## Source Context

- `docs/SPEC.md`: Goals
- `docs/RULES.md`: Coding Rules
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/artifact-filesystem.md`

## Scope

### Touch

- Essay LaTeX pipeline module.
- LaTeX compile wrapper if needed.
- Pipeline tests with mocked model output and compile behavior.

### Do Not Touch

- Do not implement Beamer slides.
- Do not implement cheat-sheet dense layout.
- Do not redesign UI.

## Requirements

- Prompt/model layer produces a full compilable `.tex` document.
- Save `main.tex` before compilation.
- Attempt PDF compilation inside backend runtime.
- Save compiler logs and keep source on failure.

## Acceptance Criteria

- Mocked LaTeX output writes `main.tex`.
- Successful compile records `main.pdf`.
- Failed compile keeps `.tex` and log artifact.
- Manifest status reflects success or failure honestly.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Full LaTeX compile may be slow in tests. Mock compile for unit tests and reserve real compile for smoke tests.

## Handoff Notes

- Cursor should review: source-first behavior and log preservation.
- Human should decide: default LaTeX document style.
