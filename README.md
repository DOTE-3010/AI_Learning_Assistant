# Solver#42 MVP

**Solver#42** is an LLM-powered assignment assistant for CUHK Business School. It generates standard answers from course materials and provides masked guidance to students.

## 🚀 Quick Start (Mac MVP)

1.  **Prerequisites**: Docker Desktop (running), Python 3.10+.
2.  **Start**: Double-click `start_demo.command` (Script name preserved for compatibility).
    *   This creates a `venv`, starts Docker DBs, and launches the Web UI.
3.  **Login**:
    *   Email: `teacher@cuhk.edu.hk`
    *   Password: `Aa12345678`

## ✨ Features (v0.6 MVP)

*   **Authentication**: Secure Login/Register with persistence and token validation.
*   **Dynamic Course Management**: Create new courses and assignments directly in the UI.
*   **Reference Upload**: Attach text/markdown files as context for answer generation.
*   **Local Storage**: Generated answers are automatically saved to the `workspace/` directory.
*   **History Playback**: View past generation results directly in the assignment chat.
*   **Model Config**: Configurable LLM backend (default: `gemini-3-pro-preview`).

## 📂 Workspace & Artifacts

When you generate an answer, the system does two things:
1.  Saves the record to **MongoDB** (MVP history).
2.  Writes the file to your local disk under:
    `workspace/{Course_Title}/{Assignment_Title}/solution_{timestamp}.{ext}`

## 🛠️ Troubleshooting

*   **"Docker not running"**: Launch Docker Desktop.
*   **Reset**: Run `make demo-reset` to wipe the database and start fresh. (Warning: deletes all registered users).

---

**Status**: Phase 4 Complete (Local Mac MVP)
**Last Updated**: December 2025
