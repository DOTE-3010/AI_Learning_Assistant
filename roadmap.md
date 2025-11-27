# Solver#42 Roadmap

## 📅 Project Overview

**Goal**: Build a locally deployable "Standard Answer Generator" MVP for CUHK Business School.
**Core Value**: Allow teachers to generate coding assignment solutions (Python/Jupyter) and explanations (PDF/Markdown) using private LLMs, with support for local reference files.

---

## ✅ Phase 1: Core Engine & CLI (Completed)

**Objective**: Build the Python backend logic to wrap LLM APIs and handle prompt engineering.

**Deliverables**:
- [x] `StandardAnswerGenerator` class.
- [x] Integration with Bianxie (OpenAI-compatible) API.
- [x] Basic prompt templates for Code, Math, and Explanation.
- [x] CLI tool for testing generation.

---

## ✅ Phase 2: Backend API & Database (Completed)

**Objective**: Expose core logic via FastAPI and manage state.

**Deliverables**:
- [x] FastAPI app structure.
- [x] PostgreSQL (Metadata): Users, Courses, Assignments, Jobs.
- [x] MongoDB (Artifacts): Large text storage for generated content.
- [x] Background Task Queue for long-running generations.

---

## ✅ Phase 3: Frontend & UX (Completed)

**Objective**: A modern, usable web interface for teachers.

**Deliverables**:
- [x] **Tech-Savvy UI**: Dark mode, glassmorphism, responsive layout.
- [x] **Authentication**: Login/Register overlay with token-based auth.
- [x] **Interactive Workspace**: Chat-like interface with file upload and instruction override.
- [x] **Dynamic Management**: UI for creating Courses and Assignments.

---

## ✅ Phase 4: Local Mac MVP (Completed)

**Objective**: Package the system for easy local distribution and demonstration on Mac.

**Deliverables**:
- [x] **Hybrid Architecture**: Native Python Backend + Docker Databases.
- [x] **One-Click Launcher**: `start_demo.command` / `demo_launcher.py`.
- [x] **Port Robustness**: Moved to ports 14242 (App) and 15432 (PG) to avoid conflicts.
- [x] **Local Workspace**: Generated files saved to `workspace/` for easy access.
- [x] **Persistence**: User registration and history are persisted across restarts.
- [x] **History Playback**: Read-only view of past generations.

---

## ✅ Phase 5: Containerization & Deployment (Completed)

**Objective**: Fully containerize the application for server deployment.

**Deliverables**:
- [x] Dockerize Backend (Python/FastAPI).
- [x] Orchestration via `docker-compose` (All-in-One).
- [x] Distribution Scripts (`start_mvp_mac.command`, `start_mvp_win.bat`).
