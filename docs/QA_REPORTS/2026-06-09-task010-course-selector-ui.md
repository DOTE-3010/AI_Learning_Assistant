# QA Report: Task 010 Course Selector Workbench UI

## Scope

- Task file: `docs/TASKS/010-add-course-selector-workbench-ui.md`
- Modules covered: frontend course state/API integration, localized workbench control, run request payload, responsive styling, focused frontend tests

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `npm --prefix frontend run test` | Baseline passed | 9 existing frontend tests passed before implementation. |
| `npm --prefix frontend run build` | Baseline passed | Existing frontend built successfully before implementation. |
| `npm --prefix frontend run test` | Passed | 10 tests passed, including course normalization, archived-course filtering, default fallback, locale keys, and `course_id` payload coverage. |
| `npm --prefix frontend run build` | Passed | Vite production build completed successfully. |
| Browser functional QA | Passed | Created and selected an ordinary course, submitted a successful mocked run, renamed the course, and soft-archived it. |
| SQLite run check | Passed | The submitted run stored the selected course id in `runs.project_id`. |
| Browser visual QA | Passed | English, Simplified Chinese, and Traditional Chinese fit at desktop and 390 px narrow width without course-control or page overflow. |
| Browser console check | Passed | No warnings or errors were recorded during final visual QA. |

## Blockers

- None.

## Risks

- Course management is intentionally compact and inline. A larger management surface remains out of scope to avoid returning to a course-dashboard product model.
- Course context content is not yet generated or included in model input; that remains task 011.

## Fixes Applied

- Added authenticated course loading, selection, creation, rename, and soft-archive flows to the production console.
- Kept the default course always selectable, non-editable, and visibly context-disabled.
- Localized the default course as `Just Asking`, `随便问问`, and `隨便問問` while preserving backend behavior by id and flags.
- Added the selected `course_id` to every run creation payload.
- Filtered archived courses from the selector and returned selection to the default course after archive.
- Added responsive course-control styling and focused test coverage.

## Retest Results

- Frontend tests and build passed after the final localization correction.
- Browser functional, persistence, responsive, three-locale, and console checks passed.

## Human Decisions Needed

- None. The task's suggested Chinese default labels were adopted in the frontend only; the backend canonical title remains unchanged.
