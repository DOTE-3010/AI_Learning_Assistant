<!--
Owner: project-maintainer
Status: Completed
Phase: 1 — Cleanup
-->

# Task 003: Clean Workspace and Database for Fresh Start

## Goal

Remove stale LaTeX-era generated artifacts from workspace folders and reset the local SQLite database so the migration starts from a clean state.

## Scope

### Touch

- `workspace/`: delete all existing run folders (they contain `.tex` files from the old pipeline).
- `data/app.sqlite`: delete and let it be recreated on next startup (schema auto-init handles this).
- `backend/storage/sqlite.py`: verify schema initialization still works correctly after restart.

### Do Not Touch

- Schema migration code (no schema changes in this task).
- Pipeline code.
- Frontend code.
- Docker image.

## Steps

1. Stop any running Docker containers:
   ```bash
   docker compose -p ai-learning-assistant down
   ```
2. Remove generated workspace content:
   ```bash
   rm -rf workspace/*/
   ```
   Keep the `workspace/` directory itself (it's in `.gitignore`).
3. Remove the SQLite database:
   ```bash
   rm -f data/app.sqlite
   ```
4. Restart the backend and verify it initializes a fresh database:
   ```bash
   docker compose -p ai-learning-assistant up -d
   curl -fsS http://localhost:14242/health
   ```
5. Verify the database was recreated by checking the health endpoint responds and no errors in logs:
   ```bash
   docker compose -p ai-learning-assistant logs backend --tail=20
   ```

## Verification Commands

```bash
docker compose -p ai-learning-assistant down
rm -rf workspace/*/
rm -f data/app.sqlite
docker compose -p ai-learning-assistant up -d
curl -fsS http://localhost:14242/health
docker compose -p ai-learning-assistant logs backend --tail=20
docker compose -p ai-learning-assistant down
```

## Acceptance Criteria

- No `.tex` or `.pdf` files from old LaTeX runs remain in `workspace/`.
- SQLite database is fresh (no stale run records referencing old `.tex` artifacts).
- Backend starts cleanly with the fresh database.
- No data loss risk: the old artifacts are development/QA artifacts, not user data.

## Non-Goals

- Do not change the schema version or add migrations.
- Do not modify the SQLite initialization code unless it references LaTeX-specific defaults.
