# QA Report: Task 013 Beamer Slides Compile Guards

## Scope

- Task file: `docs/TASKS/013-fix-beamer-slides-latex-compile-guards.md`
- Modules covered: shared LaTeX visual sanitizer, Beamer slides pipeline, LaTeX pipeline contract.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| Human pasted E2E log review | Failed before fix | `slides.tex` failed with `LaTeX Error: Not allowed in LR mode` at line 58/59; model repair also failed. |
| `.venv/bin/python -m pytest backend/tests/test_latex_diagram_policy.py backend/tests/test_beamer_slides_pipeline.py -q` | Passed after fix | 13 tests passed. |
| `.venv/bin/python -m pytest backend/tests/test_essay_latex_pipeline.py backend/tests/test_beamer_slides_pipeline.py backend/tests/test_cheat_sheet_pipeline.py backend/tests/test_latex_diagram_policy.py -q` | Passed after fix | 18 tests passed. |
| Docker compile of sanitized copy of failed `slides.tex` | Passed after fix | `latexmk` produced `slides.pdf` with 14 pages inside the backend container. |

## Blockers

- Fixed: model-produced TikZ nodes such as `{Input\\Image}` did not include `align=` or `text width`, causing Beamer/TikZ compilation to fail in LR mode.
- Fixed: model output can use remote HTTP(S) images in `\includegraphics`, which `pdflatex` cannot fetch in the Docker runtime.

## Risks

- Residual risk: very complex TikZ can still fail for reasons outside multiline node alignment. Existing one-pass model repair remains the fallback.
- Residual risk: the remote-image replacement is intentionally conservative and does not download external assets; visual fidelity may be lower, but compilation reliability improves.

## Fixes Applied

- `backend/pipelines/latex_diagrams.py`: added sanitizer handling for multiline TikZ nodes and remote HTTP(S) `\includegraphics`.
- `backend/tests/test_latex_diagram_policy.py`: added focused coverage for multiline TikZ node alignment and remote image replacement.
- `docs/CONTRACTS/generation-pipeline.md`: recorded the remote-image compile rule.

## Retest Results

- The real failed Beamer source from run `f7448207-7962-45fa-8933-134bf7285f42` compiled successfully after sanitizer processing in the Docker backend container.
- Focused and broader LaTeX pipeline tests passed.

## Human Decisions Needed

- None for this repair. Future richer diagram/image generation remains a separate product decision.
