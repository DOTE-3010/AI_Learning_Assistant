# Task: Harden LaTeX Diagram Policy

## Goal

Prevent generated PDFs from showing non-rendered diagram placeholders and avoid complex diagrams that are unlikely to compile reliably.

## Source Context

- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: PDF diagram blocker.
- `docs/CONTRACTS/generation-pipeline.md`: LaTeX diagram and compile rules.
- `docs/RULES.md`: LaTeX placeholder and complex-diagram discipline.
- `docs/SPEC.md`: PDF output quality expectations.

## Scope

- Touch: LaTeX pipeline prompts/guards in `backend/pipelines/`, shared pipeline helpers, focused backend tests.
- Do not touch: frontend preview rendering, multimodal image generation, model settings defaults, Docker LaTeX package installation unless a test proves a package blocker.

## Requirements

- Update essay, Beamer, and cheat-sheet output contracts to forbid visible placeholder text such as `[Diagram: ...]`.
- Add a bounded guard or sanitizer that converts detected diagram placeholders into concise prose or removes them before compile.
- Treat complex precision diagrams, including transformer encoder-decoder architecture, as prose/omitted unless a full compiling TikZ representation is generated.
- Preserve simple compiling TikZ diagrams when they are present and pass the existing LaTeX compile flow.

## Acceptance Criteria

- Pipeline tests cover removal or prose conversion of bracketed diagram placeholders.
- A complex transformer/encoder-decoder diagram request does not result in visible placeholder text in generated source/PDF.
- Existing successful LaTeX compile and repair tests still pass.
- Simple valid TikZ source is not stripped solely because it contains a diagram environment.

## Verification

- `.venv/bin/python -m pytest backend/tests/test_essay_latex_pipeline.py backend/tests/test_beamer_slides_pipeline.py backend/tests/test_cheat_sheet_pipeline.py -q`
- `.venv/bin/python -m pytest backend/tests/test_latex_diagram_policy.py -q`

## Handoff Notes

- Cursor should review: false positives that remove legitimate academic content and whether sanitizer behavior is deterministic enough for tests.
- Human should decide: whether future multimodal image generation should become a separate product feature after phase 1.
