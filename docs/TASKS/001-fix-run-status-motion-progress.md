# Task: Fix Run Status Motion And Comfort Progress

## Goal

Make run status motion truthful and add an approximate comfort progress bar for long-running generation.

## Source Context

- `docs/QA_REPORTS/2026-06-05-human-e2e-completion.md`: human-reported high-priority status blocker.
- `docs/SPEC.md`: run status and comfort progress product requirements.
- `docs/CONTRACTS/ui-workbench.md`: Run Status Presentation.
- `docs/CONTRACTS/visual-assets.md`: warm editorial motion rules.
- `docs/RULES.md`: frontend status-motion discipline.

## Scope

- Touch: `frontend/src/app.js`, `frontend/src/styles.css`, `frontend/src/locales.js`, focused frontend tests if needed.
- Do not touch: backend run lifecycle, API shape, generation pipelines, model provider code.

## Requirements

- Idle/ready, succeeded, failed, and cancelled states must display static status indicators.
- Only queued/running generation states may use looping spinner/progress motion.
- Add an approximate comfort progress bar in the composer/status area while generation is queued/running, replacing the idle brief note area where appropriate.
- The progress bar must be localized for English, `zh-Hans`, and `zh-Hant`, respect reduced-motion settings, and avoid claiming exact provider progress.

## Acceptance Criteria

- A fresh idle workbench shows no endlessly spinning run icon.
- A queued/running run shows active motion and an approximate comfort progress bar.
- A succeeded or failed run returns to a static indicator while preserving status text and preview access.
- English, Simplified Chinese, and Traditional Chinese labels fit without overflow in the run-note/progress area.

## Verification

- `npm --prefix frontend run test`
- `npm --prefix frontend run build`

## Handoff Notes

- Cursor should review: whether CSS selectors tie animation strictly to run status and whether progress copy avoids implying exact measurement.
- Human should decide: whether the comfort progress pacing feels calming enough after visual review.
