<!--
Owner: project-maintainer
Last Reviewed: 2026-06-09
Status: Active
-->

# QA Report: Task 003 Clean Workspace And Database

## Scope

- Task file: `docs/TASKS/003-clean-workspace-and-database.md`
- Runtime data covered: `workspace/*/` generated run folders and `data/app.sqlite`.
- Preserved local data: `workspace/` directory shell, `data/model-secrets.env`, and `data/logs/`.

## Commands And Results

| Command/check | Result | Notes |
| --- | --- | --- |
| `docker compose -p ai-learning-assistant down` | Passed | No existing compose resources were running before cleanup. |
| `find workspace -type f \( -name '*.tex' -o -name '*.pdf' \) -print` | Found stale artifacts before cleanup | Old LaTeX-era `.tex` and `.pdf` files were present under generated run folders. |
| `rm -rf workspace/*/` | Passed | Removed generated workspace user/project folders; kept `workspace/` itself. |
| `rm -f data/app.sqlite` | Passed | Removed local SQLite database; kept model secret file and launcher logs. |
| `docker compose -p ai-learning-assistant up -d` | Passed | Backend container started and became healthy. |
| `curl -fsS http://localhost:14242/health` | Failed locally | The backend logs and Docker healthcheck showed `/health` 200, but this shell could not connect via `localhost`. |
| `curl -fsS http://127.0.0.1:14242/health` | Passed | Returned `{"status":"ok"}`. |
| `docker compose -p ai-learning-assistant logs backend --tail=20` | Passed | Logs showed `SQLite metadata store is ready.` and no startup errors. |
| `python3 -c "... sqlite3.connect('data/app.sqlite') ..."` | Passed | Fresh database reported `user_version 4`, `runs 0`, and `artifacts 0`. |
| `docker compose -p ai-learning-assistant down` | Passed | Stopped and removed the temporary backend container and network. |

## Blockers

- Fixed: stale LaTeX-era workspace artifacts and stale SQLite run/artifact records existed before cleanup.

## Risks

- Residual local-environment risk: `localhost:14242` failed from this shell while `127.0.0.1:14242` passed and Docker healthcheck/logs showed successful `/health` requests. Project verification should prefer `127.0.0.1` where launcher/browser QA already does.
- No user-data loss risk was identified within the task scope; deleted files were generated development/QA artifacts under ignored runtime folders.

## Fixes Applied

- Removed generated workspace user/project folders under `workspace/*/`.
- Removed `data/app.sqlite` and let backend startup recreate a fresh schema.
- Verified `backend/storage/sqlite.py` initializes schema version 4 on a missing database without code changes.

## Retest Results

- Backend restarted cleanly after cleanup.
- Fresh SQLite database exists, has schema version 4, and contains no run or artifact rows.
- No old `.tex` or `.pdf` files remain under `workspace/`.

## Human Decisions Needed

- None.
