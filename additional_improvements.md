# Backlog & Improvements

## 1. Interactive Setup for First-Time Run
- **Current Status**: Users must manually create a `.env` file or configure environment variables in `docker-compose.yml`.
- **Goal**: Achieve a "Zero Configuration" startup experience.
- **Proposed Solution**: 
  - Modify the startup script (`start_mvp.command` / `start_win.bat`) to include logic for detecting the `.env` file.
  - If the `.env` file is missing, the script should pause and prompt the user: "Please enter your OpenAI API Key: ".
  - The script then generates a local `.env` file with the provided key.
  - Finally, the script executes `docker-compose up`.

## 2. Automatic Port Conflict Detection
- **Goal**: Prevent startup failures due to port conflicts.
- **Proposed Solution**: 
  - Before starting containers, check if ports 8000 (Backend), 5432 (Postgres), and 27017 (Mongo) are in use.
  - If a conflict is detected, prompt the user or attempt to automatically switch to an available port (updating the configuration accordingly).




