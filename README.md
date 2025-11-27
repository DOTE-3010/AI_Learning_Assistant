<<<<<<< HEAD
# Solver#42: Standard Answer Generator

> **Project Code**: Solver#42  
> **Status**: MVP (Phase 5 - Dockerized)  
> **Target**: CUHK Business School  
=======
# Solver#42: Your Personal Nomenclator

>>>>>>> main

**Solver#42** is a locally deployable, privacy-focused solution designed to assist teachers in generating standard answers (Python code, Jupyter Notebooks) and detailed explanations (Markdown, PDF) for coding assignments. It leverages private LLM APIs to ensure data security while providing a modern, chat-based workflow.

---

## 🌟 Key Features

*   **Local-First Architecture**: Runs entirely on your local machine (Mac/Windows) via Docker. No data leaves your environment except for the LLM API call.
*   **Hybrid Generation**:
    *   **Code**: Generates executable Python scripts (`.py`) and Jupyter Notebooks (`.ipynb`).
    *   **Documents**: Renders professional PDF reports using LaTeX/Beamer templates and Markdown.
*   **Context-Aware**: Supports uploading local reference files (e.g., previous assignments, data specs) to guide the generation.
*   **Modern UI**: A responsive, dark-mode web interface built for productivity.
*   **Robust Backend**:
    *   **FastAPI**: High-performance async Python API.
    *   **PostgreSQL**: Relational data for courses, assignments, and user management.
    *   **MongoDB**: Document store for large text artifacts and generation history.

---

## 🛠 Tech Stack

### Backend
*   **Language**: Python 3.11
*   **Framework**: FastAPI
*   **Database**: PostgreSQL 15 (Metadata), MongoDB 7.0 (Artifacts)
*   **AI Engine**: OpenAI-compatible API Client (Configurable endpoint)
*   **PDF Engine**: LaTeX (TexLive), WeasyPrint

### Frontend
*   **Tech**: HTML5, TailwindCSS, Vanilla JS (No build step required)
*   **Style**: Glassmorphism, Dark Mode

### Infrastructure
*   **Containerization**: Docker, Docker Compose
*   **Distribution**: Offline Image Loading (No `docker build` required for end-users)

---

## 🚀 Quick Start (For Developers)

### Prerequisites
*   Docker Desktop installed and running.
*   Python 3.11+ (optional, for local debugging).

### Run Locally (Source Mode)
If you are developing or debugging the source code:

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/your-repo/solver42.git
    cd solver42
    ```

2.  **Start via Docker Compose**:
    ```bash
    # This builds the image locally from source
    docker compose up -d --build
    ```

3.  **Access**: Open `http://localhost:14242`

### Build Distribution Package
To generate the offline installer folder (`Solver42_Dist`) for end-users:

```bash
./package_app.sh
```
This will create a folder containing all docker images and startup scripts.

---

## 📦 Distribution (For End Users)

End users receive a zip file containing the `Solver42_Dist` folder. They do **not** need to install Python or Git.

**Steps for Users:**
1.  Install **Docker Desktop**.
2.  Unzip the package.
3.  **Mac**: Double-click `start_dist_mac.command`.
4.  **Windows**: Double-click `start_dist_win.bat`.
5.  The system auto-loads necessary images and launches the browser.

---

## 📂 Project Structure

```
Solver42/
├── backend/                 # Python Backend Source
│   ├── app/                 # Core Application Logic
│   ├── core/                # Config & Auth
│   ├── models/              # Database Schemas
│   ├── static/              # Frontend Assets (HTML/JS/CSS)
│   └── templates/           # LaTeX/Prompt Templates
├── workspace/               # Generated outputs (PDFs, Code)
├── Dockerfile               # Backend Container Definition
├── docker-compose.yml       # Dev Orchestration
├── docker-compose-dist.yml  # Distribution Orchestration
├── package_app.sh           # Packaging Script
├── start_mvp_mac.command    # Dev Launcher (Mac)
└── start_mvp_win.bat        # Dev Launcher (Win)
```

---

## 📝 License
<<<<<<< HEAD
Proprietary - CUHK Business School Internal Use Only.
=======
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
>>>>>>> main
