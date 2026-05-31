# Task: Implement Code Homework Pipeline

## Goal

Implement the first artifact-specific pipeline for `.py` and `.ipynb` homework code outputs.

## Source Context

- `docs/SPEC.md`: Goals
- `docs/RULES.md`: Testing Rules
- `docs/CONTRACTS/generation-pipeline.md`
- `docs/CONTRACTS/artifact-filesystem.md`

## Scope

### Touch

- Code homework pipeline module.
- Notebook/script artifact writer integration.
- Pipeline tests with mocked model output.

### Do Not Touch

- Do not implement essay, slides, or cheat-sheet pipelines.
- Do not add frontend preview UI.
- Do not require real model credentials in tests.

## Requirements

- Generate complete script or notebook source from task/context.
- Save output through artifact filesystem writer.
- Validate notebook JSON when output preference is `ipynb`.
- Record artifacts in run metadata.

## Acceptance Criteria

- Mocked `.py` generation writes `solution.py`.
- Mocked notebook generation writes valid `.ipynb`.
- Manifest lists generated code artifact.
- Pipeline failures preserve logs and sanitized error metadata.

## Verification

- `.venv/bin/python -m pytest backend/tests -q`

## Risks

- Model output may include markdown fences. Add lightweight extraction/repair only for this pipeline.

## Handoff Notes

- Cursor should review: output validation and artifact writer usage.
- Human should decide: whether generated code should include tests by default.
