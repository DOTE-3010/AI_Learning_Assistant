# PRD: Solver#42 (As Built)

## Overview

Solver#42 is a role-based, LLM-powered assignment assistant for business education. It enables teachers to generate standard answers and explanations for assignments using private or public LLMs. The system features a **FastAPI backend**, a **lightweight Vanilla JS frontend**, and a **dual-database architecture** (PostgreSQL + MongoDB). It supports **local deployment** via Docker and includes features like **web search integration** (via DuckDuckGo) and **LaTeX PDF generation**.

---

## Key Simplifications & Design Choices

1.  **Self-Service Registration**: Unlike the initial plan, the MVP allows users to register via the UI. Roles are inferred from email domains:
    *   `@cuhk.edu.hk` -> **Teacher**
    *   `@link.cuhk.edu.hk` -> **Student** (Access restricted in current UI)
2.  **Simple Authentication**: Uses a lightweight token-based auth (Base64 encoded email) for simplicity in the MVP, avoiding complex OAuth/JWT setups.
3.  **Dual-Database Storage**:
    *   **PostgreSQL**: Stores relational metadata (Users, Courses, Assignments, Job Status).
    *   **MongoDB**: Stores unstructured data (Generated Artifacts, Logs).
4.  **Frontend**: A single-file, responsive web interface built with **HTML5, TailwindCSS (CDN), and Vanilla JavaScript**, ensuring zero build steps and easy modification.
5.  **Local Processing**:
    *   LaTeX compilation is handled locally via `pdflatex`.
    *   Files are saved to a local `workspace/` directory for easy access.

---

## Architecture

### 1. Tech Stack

*   **Backend**: Python 3.11+, FastAPI
*   **Frontend**: Static HTML/JS, TailwindCSS
*   **Database**:
    *   PostgreSQL (Metadata)
    *   MongoDB (Content Storage)
*   **LLM Integration**: OpenAI-compatible API (via Bianxie/DeepSeek/OpenAI)
*   **Search**: DuckDuckGo Search (`duckduckgo_search`) via Python
*   **Infrastructure**: Docker Compose

### 2. User Roles

*   **Teacher**:
    *   Create Courses and Assignments.
    *   Upload reference materials (PDF, TXT, etc.).
    *   Generate standard answers in multiple formats (Markdown, PDF/LaTeX, Python, Jupyter).
    *   Review and export generated content.
*   **Student**:
    *   (Limited in MVP) Intended to receive guided hints. Current implementation focuses on Teacher flows.

### 3. Data Flow

1.  **Request**: User initiates generation via Web UI.
2.  **Auth**: Middleware validates email-based token.
3.  **Job Queue**: Request is offloaded to a `BackgroundTasks` queue in FastAPI.
4.  **Generation**:
    *   System prompts the LLM with assignment details and optional web search results.
    *   **Web Search**: If enabled, performs a DuckDuckGo search to enrich context.
5.  **Storage**:
    *   Job status updated in **PostgreSQL**.
    *   Generated content (Artifact) saved to **MongoDB**.
    *   Files written to local disk (`workspace/Course/Assignment/`).
6.  **Response**: Frontend polls status endpoint until completion.

---

## Functional Features

### 1. Course & Assignment Management
*   Create and list Courses (e.g., "Deep Learning").
*   Create Assignments with detailed instructions.
*   Organized file structure in `workspace/`.

### 2. Generation Engine
*   **Multi-Format Output**:
    *   **Markdown**: For general reports.
    *   **Python/Jupyter**: For coding solutions.
    *   **PDF (LaTeX)**: For professional slides and documents (requires local TeX distribution).
*   **Context Awareness**:
    *   Accepts file uploads (text-based).
    *   Accepts "Instruction Overrides" (custom prompts).

### 3. Web Search Integration
*   Uses `duckduckgo-search` to retrieve real-time information.
*   Injects search results into the LLM context window to ground answers in current events or documentation.

### 4. Local Persistence
*   **History**: View past generation results in the chat interface.
*   **Files**: All generated files are physically saved to the `workspace` folder on the host machine.

---

## API Endpoints

### Auth
*   `POST /auth/register`: Create account (auto-role assignment).
*   `POST /auth/login`: Get session token.

### Content
*   `GET /courses`: List courses.
*   `POST /courses`: Create course.
*   `GET /assignments`: List assignments.
*   `POST /assignments`: Create assignment.

### Generation
*   `POST /generate-answer`: Start a background generation job.
*   `GET /jobs/{job_id}`: Check job status and retrieve output.
*   `GET /assignments/{id}/history`: Retrieve past generated artifacts.

---

## Deployment

### Docker (Recommended)
The system is fully containerized.
*   `docker-compose.yml`: Orchestrates Backend, Postgres, and MongoDB.
*   **Ports**:
    *   Backend/UI: `14242`
    *   Postgres: `15432`
    *   MongoDB: `27017` (internal)

### Local (Mac/Windows)
*   Requires Python 3.11+ and a local LaTeX distribution (MacTeX/TeXLive).
*   Scripts: `start_mvp.command` (Mac), `start_dist_win.bat` (Windows).
