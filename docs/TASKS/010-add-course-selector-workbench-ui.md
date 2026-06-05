# Task: Add Course Selector To Workbench UI

## Goal

Expose lightweight course selection and management in the workbench without turning the product into a course dashboard.

## Source Context

- `docs/CONTRACTS/ui-workbench.md`: lightweight course selector requirement.
- `docs/CONTRACTS/course-context.md`: course list/create/rename/archive API.
- `docs/TASKS/008-add-course-container-api.md`: prerequisite backend API.
- `docs/TASKS/009-attach-runs-to-courses.md`: prerequisite run `course_id` support.

## Scope

- Touch: `frontend/src/app.js`, `frontend/src/locales.js`, `frontend/src/styles.css`, focused frontend tests if needed.
- Do not touch: backend course API, context summarization, old legacy course/assignment/chat UI, primary workbench navigation structure.

## Requirements

- Show the default "Just Asking" course as always available and context-disabled.
- Let users create, rename, select, and archive ordinary courses from a lightweight control.
- Hide archived ordinary courses from the primary selector.
- Include the selected `course_id` in run creation payloads.
- Localize all new copy in English, `zh-Hans`, and `zh-Hant`.

## Acceptance Criteria

- A new user can run generation with the default course selected and no course context implied.
- A user can create/select an ordinary course and submit a run with its `course_id`.
- Archiving an ordinary course removes it from the primary selector without deleting historical run access.
- The selector fits desktop and narrow layouts without becoming primary navigation.

## Verification

- `npm --prefix frontend run test`
- `npm --prefix frontend run build`

## Handoff Notes

- Cursor should review: localization, disabled/default-course affordances, and avoiding course-dashboard drift.
- Human should decide: whether the Chinese default label should be `随便问问`/`隨便問問` in the UI.
