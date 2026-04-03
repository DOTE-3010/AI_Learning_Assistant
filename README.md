# Solver#42

**Solver#42** is an LLM-powered assignment assistant for CUHK Business School. It generates standard answers from course materials and provides masked guidance to students.

---

## Versions

### Demo — Mac (Development)

A local development build for Mac, intended for internal testing and demonstration.

**Prerequisites**: Docker Desktop (running), Python 3.10+

**Start**:
1. Double-click `start_demo.command`
2. The script creates a `venv`, starts Docker DBs, and launches the Web UI

**Default Login**:
- Email: `teacher@cuhk.edu.hk`
- Password: `Aa12345678`

---

### Distribution — Offline Standalone Edition

A self-contained offline package that bundles all Docker images, requiring no internet connection after setup. Supports both Mac and Windows.

**Prerequisites**: Docker Desktop (running) — no Python or other dependencies needed.

**Mac**:
1. Right-click `start_dist_mac.command` > Open
   *(If it says "Unidentified Developer", click Open again in the dialog)*
2. On first run, you will be prompted for your API Key
3. Wait 1–2 minutes for initialization; the browser opens automatically at `http://localhost:14242`

**Windows**:
1. Double-click `start_dist_win.bat`
2. If Windows SmartScreen appears, click "More Info" > "Run Anyway"
3. Follow the on-screen prompts; the browser opens automatically at `http://localhost:14242`

> The `Solver42_Dist/images/` directory contains pre-exported Docker image tarballs and is excluded from git. Obtain the full distribution package separately.

---

## Features (v0.6 MVP)

- **Authentication**: Secure Login/Register with persistence and token validation
- **Dynamic Course Management**: Create new courses and assignments directly in the UI
- **Reference Upload**: Attach text/markdown files as context for answer generation
- **Local Storage**: Generated answers are automatically saved to the `workspace/` directory
- **History Playback**: View past generation results directly in the assignment chat
- **Model Config**: Configurable LLM backend (default: `gemini-2.5-pro-preview`)

## Workspace & Artifacts

When you generate an answer, the system:
1. Saves the record to **MongoDB** (history)
2. Writes the file to local disk at:
   `workspace/{Course_Title}/{Assignment_Title}/solution_{timestamp}.{ext}`

## Troubleshooting

- **"Docker not running"**: Launch Docker Desktop and wait for it to fully start
- **"This site can't be reached"**: The system may still be initializing — wait 10 seconds and refresh
- **Reset** (Demo only): Run `make demo-reset` to wipe the database and start fresh *(deletes all registered users)*

---

