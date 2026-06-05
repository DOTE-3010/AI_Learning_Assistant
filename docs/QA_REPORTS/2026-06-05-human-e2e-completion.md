<!--
Owner: project-maintainer
Last Reviewed: 2026-06-05
Status: Active
-->

# QA Report: Human E2E Completion

## Scope

- Task file: human-executed E2E continuation after completed agent QA and pre-E2E repairs.
- Modules covered: whole product through authenticated generation workflows.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| Human end-to-end functional generation | Passed | All generation functions worked: code homework, essay/PDF, Beamer slides/PDF, and cheat-sheet/PDF. |
| Human visual/usability inspection | Blockers found | Status motion, real preview, and PDF diagram handling require repair before release readiness. |

## Blockers

- High priority: run status motion is misleading. Idle/ready and completed states show a continuously rotating circle; only active queued/running generation should animate.
- High priority: long-running generation needs an approximate comfort progress bar in the workbench status/composer area. It should replace the idle prompt-note space while generation is active and should match the warm editorial visual system.
- High priority: artifact previews are not real after generation. The current workbench continues to show pre-seeded demo code/PDF skeletons instead of generated code and rendered PDFs.
- High priority: generated PDFs can contain non-rendered diagram placeholder text such as an encoder-decoder schematic note. Complex precision diagrams should be omitted or converted to prose unless a reliable compiling LaTeX/TikZ representation exists.

## Risks

- Medium priority: course-level context is needed. Users should be able to create named course containers, while an undeletable default "Just Asking" course catches uncategorized requests and never contributes context.
- Medium priority: generation feels slow. The first step is bottleneck identification; if more than half of live wall time is model-provider generation, local optimization should not be pursued without a separate local bottleneck.
- Low priority: a future release should include an onboarding/tutorial experience. The form is undecided and not part of the active repair queue.

## Human Decisions

- PDF rendering difficulty should be assessed before requiring the full implementation. Code inspection found the current Vite frontend has no PDF renderer dependency and no authenticated artifact byte endpoint; PDF rendering is moderate difficulty and should be split after artifact access exists.
- Multimodal image generation is not required for phase 1. Complex diagrams such as Transformer encoder-decoder schematics should be avoided rather than rendered as placeholders.
- Course deletion should be soft archive, not hard database deletion. Archived courses disappear from the frontend but preserve rows, runs, uploads, and context files.
- Course context summaries should stay compact. Default target is about 8 KB Markdown per course unless later measurement changes the cap.
- Real Qwen timing may be used when local untracked credentials are available, but performance acceptance should not require live credentials.

## Fixes Applied

- None in product code. Governance documents and bounded tasks were updated to hand off implementation.

## Retest Results

- Pending execution of the numbered post-human-E2E repair tasks under `docs/TASKS/`.

## Human Decisions Needed

- None before starting the generated repair queue.
