# PRD: Solver#42 (Local MVP)

## 1. Product Overview

**Solver#42** is a **localized, low-cost, Minimum Viable Product (MVP)** designed for the CUHK Business School. It leverages Large Language Models (LLMs) to assist teachers in generating standard answers (Python code, Markdown explanations) from course materials and provides guided learning support for students.

The core design philosophy is **"Zero Infrastructure Cost"** and **"Plug and Play"**. It requires no expensive cloud server clusters and runs entirely on the user's local machine (e.g., MacBook), utilizing Docker containerization for databases and a native Python environment for a hybrid deployment.

---

## 2. Core Design Decisions

To deliver a high-value product within a short timeframe and minimal budget, the following architectural decisions were made:

### 2.1. Local-First Architecture
- **Deployment Mode**: The application does not rely on AWS/Azure. It starts directly locally via a Shell script (`start_mvp.command`).
- **Hybrid Runtime**:
    - **Backend**: Runs in the host's native Python environment for easier debugging and file system interaction.
    - **Database**: Runs in Docker containers (PostgreSQL + MongoDB) to ensure data consistency and isolation.
- **File Delivery**: Generated results are not only stored in the database but are also written directly to the local `workspace/` folder. Users can access `.py` or `.md` files directly without needing to download them through the UI.

### 2.2. Minimal Cost Control
- **Search Engine**: Uses **DuckDuckGo** (via `duckduckgo-search`) instead of paid Bing/Google APIs, achieving free real-time context retrieval.
- **LLM Integration**: Connects via the `Bianxie` interface (OpenAI protocol compatible), supporting pay-as-you-go with no fixed monthly fees.
- **Zero Ops**: No Kubernetes, no CI/CD pipelines. Lifecycle management is handled via simple Makefiles and startup scripts.

### 2.3. Adaptive Identity Authentication (Domain-Based Auth)
- **Automatic Role Assignment**:
    - Email ends with `@cuhk.edu.hk` -> **Teacher** (Generation permissions).
    - Email ends with `@link.cuhk.edu.hk` -> **Student** (View/Guidance mode only).
- **Simple Token**: Uses Base64-encoded emails as session credentials. This avoids complex JWT issuance/refresh mechanisms while being secure enough for a local demo environment.

---

## 3. System Architecture

### 3.1. Tech Stack
- **Backend**: Python 3.11, FastAPI (Async/Await)
- **Database (Meta)**: PostgreSQL 15 (Users, Courses, Jobs)
- **Database (Docs)**: MongoDB 6 (Artifacts, Logs)
- **Search**: DuckDuckGo (Real-time web context)
- **Frontend**: HTML5/JS (Static), Glassmorphism UI, Fetch API

### 3.2. Data Flow
1. **Input**: User uploads a question or file via the Web UI.
2. **Retrieval**: Backend generates search keywords from the question and calls DuckDuckGo for the latest web information.
3. **Generation**: Combines `Prompt + Context + Search Results` and sends them to the LLM.
4. **Storage (Dual-Write)**:
   - JSON results stored in MongoDB (for history tracking).
   - Physical files (`.md`, `.py`) written to local `workspace/` directory (for direct usage).
5. **Metadata**: Task status and cost estimates stored in PostgreSQL.

---

## 4. Feature List

### 4.1. Teacher
- **Course/Assignment Management**: Create course containers and specific assignment entries.
- **Standard Answer Generation**:
    - Supports **Markdown** (Text explanation).
    - Supports **Python** (Executable code).
    - Supports **LaTeX/PDF** (Source files).
    - Supports **Jupyter Notebook** (Interactive documents).
- **Smart Enhancement**: Automatically searches online for relevant cases or definitions to augment the Prompt and improve answer quality.
- **History Playback**: Review past generation records and cost estimates.

### 4.2. Student
- **Assignment View**: Browse published assignment instructions.
- **Guidance Mode**: *(Architecture ready; logic reuses the generation pipeline but restricts output via Prompt engineering to provide hints instead of solutions).*

### 4.3. System
- **One-Click Launcher**: Intelligently detects port occupancy, auto-starts Docker containers, and initializes database tables.
- **Async Task Queue**: Uses `BackgroundTasks` to handle long-running generation jobs, with frontend polling for status.

---

## 5. Acceptance Criteria

| Module | Feature | Status | Description |
|---|---|---|---|
| **Startup** | `start_mvp.command` execution | ✅ Done | Launches all services automatically without errors |
| **Auth** | CUHK email role recognition | ✅ Done | Distinguishes between Teacher and Student permissions |
| **Generation** | Python code output in < 30s | ✅ Done | Includes Web Search context |
| **Storage** | Local `workspace` file saving | ✅ Done | Clear directory structure |
| **UI** | Responsive Dark UI | ✅ Done | Smooth interaction, supports file uploads |

---

## 6. Project Summary

This project successfully verifies the feasibility of building a high-availability educational assistant using **container technology** and **LLM APIs** without **server infrastructure investment**. By Dockerizing the data layer while keeping the application layer local, we achieved database stability alongside script tool flexibility. It is a "lightweight" solution highly suitable for university environments.
