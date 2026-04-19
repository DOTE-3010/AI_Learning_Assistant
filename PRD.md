# PRD: AI Learning Assistant (Local Demo MVP)

## 1. Product Identity

| Field | Value |
|---|---|
| **App Name** | AI Learning Assistant (Local Demo MVP) |
| **Display Title** | AI Learning Assistant (Local Demo MVP) |
| **Tagline** | your private study nomenclator |
| **Database Name** | ai_learning_assistant |
| **Demo Account (Teacher)** | teacher@cuhk.edu.hk / Aa12345678 |
| **Target Environment** | macOS local machine, single user |

---

## 2. Product Overview

**AI Learning Assistant** is a localized, low-cost demo MVP for the CUHK Business School. It uses LLMs to help teachers generate standard answers from course assignments and allows students to view assignment instructions. The product runs entirely on a local machine with no cloud infrastructure.

Core design philosophy: **"Zero Infrastructure Cost"** and **"Plug and Play"** — starts with one double-click, no deployment needed.

---

## 3. Core Design Decisions

### 3.1. Local-First Architecture
- Starts via `start_mvp.command` (double-click on macOS). No AWS/Azure.
- Backend runs in host Python environment; databases run in Docker containers.
- Generated files are written both to MongoDB (for history) and to `workspace/{Course}/{Assignment}/` (for direct file access).

### 3.2. Minimal Cost Control
- Web search via **DuckDuckGo** (`duckduckgo-search` library) — free, no API key.
- LLM via **Bianxie API** (OpenAI-protocol compatible) — pay-as-you-go.
- No Kubernetes, no CI/CD. Managed by Makefile + shell script.

### 3.3. Identity & Authentication

**Registration**: Users self-register with email + password. Role is inferred automatically from email domain at registration time and cannot be changed.

**Role mapping**:
- Email ends with `@cuhk.edu.hk` → **teacher** (can create courses, assignments, generate answers)
- Email ends with `@link.cuhk.edu.hk` → **student** (can view assignments only; generation is blocked with 403)

**Session token**: `base64(email)` — stateless, demo-grade. Sent as `X-User-Token` header alongside `X-User-Email` on every protected request.

**Password storage**: `hash_{password}` (demo-grade fake hash — not for production).

---

## 4. System Architecture

### 4.1. Tech Stack
- **Backend**: Python 3.11, FastAPI (async)
- **Database (Metadata)**: PostgreSQL 15 — stores users, courses, assignments, generation jobs
- **Database (Artifacts)**: MongoDB 7 — stores generated content and logs
- **Search**: DuckDuckGo (top-3 web results per query)
- **LLM**: Bianxie API, model `gemini-3-pro-preview` (OpenAI-compatible)
- **Frontend**: Single-file HTML5/JS, Tailwind CSS (CDN), marked.js (CDN), dark glassmorphism UI

### 4.2. Data Entities

#### Primary Entity: `Course`

| Field | Type | Notes |
|---|---|---|
| id | Integer PK | auto |
| title | String | e.g. "FINA 4020 Deep Learning" |
| term | String | e.g. "2025-Spring" |
| teacher_email | String | owner |
| created_at | DateTime | auto |

Create request fields: `title` (required), `term` (required)

#### Secondary Entity: `Assignment`

| Field | Type | Notes |
|---|---|---|
| id | Integer PK | auto |
| course_id | Integer FK | → courses.id |
| title | String | e.g. "Assignment 1: Backpropagation" |
| instructions | String | full assignment description |
| due_at | DateTime | optional |
| guidance_policy | JSON | hardcode `{"mask_code": true}` |
| output_formats | Array(String) | hardcode `["md", "py", "ipynb", "pdf"]` |
| created_at | DateTime | auto |

Create request fields: `course_id` (required), `title` (required), `instructions` (required), `due_at` (optional)

#### Fixed Entities (same for all projects)

- **User**: id, email (unique), role, course_ids (Array), created_at, password_hash
- **GenerationJob**: id, assignment_id (FK), requested_by_email, role, model_config (JSON), status, started_at, completed_at, cost_estimate

### 4.3. Data Flow

1. Teacher selects an assignment and submits a generation request (optional: custom context text + reference file attachment).
2. Backend creates a `GenerationJob` (status: `queued`) and returns `job_id` immediately.
3. Background task: searches DuckDuckGo for top-3 results using `f"{assignment_title} solution"`, builds prompt, calls LLM.
4. Result is written to MongoDB (`artifacts` collection) and to `workspace/{Course}/{Assignment}/solution_{timestamp}.{ext}`.
5. Frontend polls `GET /jobs/{job_id}` every 2 seconds until `succeeded`, then renders output in the chat area.

---

## 5. Generation Engine Specification

### 5.1. Module
- **File**: `backend/app/standard_answer_generator.py`
- **Main function**: `generate_answer_logic`
- **Input parameters**: `assignment_title: str`, `instructions: str`, `custom_context: str = None`, `use_search: bool = True`
- **What it generates**: a standard answer for the given assignment

### 5.2. LLM Prompts

**System prompt**:
```
You are a helpful academic assistant.
```

**User prompt template**:
```
You are an expert teaching assistant. Create a standard answer for the following assignment.

Assignment: {assignment_title}
Instructions: {instructions}

{web_search_context}

{custom_context}

Please provide the answer in Markdown format. Include code blocks if necessary.
```

Where `{web_search_context}` is built as:
```
Web Search Context:
- {title}: {body}
- {title}: {body}
...
```

### 5.3. Search Query
```python
f"{assignment_title} solution"
```

### 5.4. Output Formats

| Format ID | Display Name | File Extension | Conversion Rule |
|---|---|---|---|
| `md` | Markdown Report | `.md` | Return LLM output as-is |
| `py` | Python Script | `.py` | Extract all ```python``` code blocks; join with `\n\n`; fallback: `# No python code found in solution` |
| `ipynb` | Jupyter Notebook | `.ipynb` | Wrap full LLM output in a single markdown cell using `nbformat.v4` |
| `pdf` | LaTeX PDF Source | `.tex` | Wrap in `\documentclass{article}\n\begin{document}\n...\n\end{document}` |

Gate check sample call:
```python
generate_answer_logic('Test Assignment', 'Write hello world in Python', use_search=False)
```

---

## 6. API Surface

### 6.1. Fixed Endpoints (same for all projects)

| Method | Path | Auth | Role Guard | Description |
|--------|------|------|------------|-------------|
| GET | `/` | No | — | Redirect to `/ui` |
| GET | `/health` | No | — | Returns `{"status": "ok"}` |
| POST | `/auth/register` | No | — | Create user, return `{status, email, role}` |
| POST | `/auth/login` | No | — | Validate credentials, return `{token, role, email}` |
| GET | `/jobs/{job_id}` | Yes | — | Poll job status, return `{status, cost, output}` |

### 6.2. Project-Specific Endpoints

| Method | Path | Auth | Role Guard | Description |
|--------|------|------|------------|-------------|
| POST | `/courses` | Yes | teacher | Create course, return `{id, title}` |
| GET | `/courses` | Yes | — | List all courses |
| POST | `/assignments` | Yes | teacher | Create assignment, return `{id, title}` |
| GET | `/assignments` | Yes | — | List all assignments |
| POST | `/generate-answer` | Yes | teacher | Submit generation job (multipart/form-data), return `{job_id, status}` |
| GET | `/assignments/{assignment_id}/history` | Yes | — | List succeeded jobs for this assignment with content |

### 6.3. Generation Endpoint Detail

`POST /generate-answer` — multipart/form-data

| Field | Type | Required | Notes |
|---|---|---|---|
| assignment_id | int | Yes | |
| output_format | str | Yes | one of: `md`, `py`, `ipynb`, `pdf` |
| custom_context | str | No | Additional teacher instructions or question |
| file | UploadFile | No | Reference file (text/utf-8; binary files get a placeholder message) |

Background task arguments passed from `assignment` object: `assignment.title`, `assignment.instructions`

---

## 7. Feature List

### 7.1. Teacher

- **Registration & Login**: Register with `@cuhk.edu.hk` email; role assigned automatically.
- **Course Management**: Create courses (title + term). Soft-delete locally (client-side hidden set via localStorage).
- **Assignment Management**: Create assignments (title + instructions) within a course. Soft-delete locally.
- **Standard Answer Generation**:
  - Select an assignment, optionally enter custom context/question, optionally attach a reference file.
  - Choose output format: Markdown, Python Script, Jupyter Notebook, or LaTeX source.
  - Submit → job queued → result appears in chat area within ~30 seconds.
  - Formats: **Markdown** (explanation), **Python** (executable code extracted from LLM output), **LaTeX** (source `.tex` for PDF compilation), **Jupyter Notebook** (interactive `.ipynb`).
- **Web Search Augmentation**: Backend auto-searches DuckDuckGo using `"{assignment_title} solution"` and injects top-3 results into the LLM prompt.
- **History**: Past successful generations for each assignment are restored automatically when the assignment is selected.

### 7.2. Student

- **Registration & Login**: Register with `@link.cuhk.edu.hk` email.
- **Assignment View**: Can see assignment list and instructions.
- **Generation blocked**: Attempting to generate returns HTTP 403. *(Full guidance mode — where the LLM provides hints instead of answers — is out of scope for this demo.)*

### 7.3. System

- **One-Click Launcher**: `start_mvp.command` — checks Docker, creates venv if needed, starts PostgreSQL + MongoDB via Docker Compose, seeds demo user, launches uvicorn, opens browser.
- **Async Job Queue**: `FastAPI BackgroundTasks` handles LLM calls. Frontend polls every 2 seconds.
- **Dual-Write Storage**: Every successful generation writes to MongoDB (artifact) + local filesystem (`workspace/`).

---

## 8. UI Specification

- **Theme**: Dark glassmorphism. Background `bg-slate-900`. Glass panels: `rgba(30,41,59,0.7)` + `backdrop-filter: blur(10px)`.
- **Layout**: 3-panel — sticky navbar / left sidebar (course + assignment management) / main workspace (chat area + input panel).
- **Chat metaphor**: Teacher messages appear as right-aligned blue bubbles; AI responses appear as left-aligned dark bubbles with "AI Learning Assistant Core" label.
- **Input panel**: Textarea (`Ask your question here...`) + file upload zone + format selector dropdown + `Execute Generation` button.
- **Login overlay**: Full-screen on load. Pre-filled with demo credentials `teacher@cuhk.edu.hk` / `Aa12345678`.
- **Markdown rendering**: `marked.js` renders LLM output (code blocks, headers, lists) inside AI bubbles.
- **Keyboard shortcut**: `Enter` (no Shift) in textarea submits generation.

---

## 9. Acceptance Criteria

| Module | Feature | Status | Description |
|---|---|---|---|
| **Startup** | `start_mvp.command` execution | ✅ Done | Launches all services automatically; opens browser |
| **Auth** | Registration + domain role assignment | ✅ Done | `@cuhk.edu.hk` → teacher, `@link.cuhk.edu.hk` → student |
| **Auth** | Login + token session | ✅ Done | base64 token sent on every request |
| **Course/Assignment** | Create and list entities | ✅ Done | Soft-delete via localStorage |
| **Generation** | Any-format output in < 60s | ✅ Done | Includes DuckDuckGo web search context |
| **Generation** | File attachment support | ✅ Done | UTF-8 text files injected as reference context |
| **Storage** | Dual-write (MongoDB + workspace/) | ✅ Done | `workspace/{Course}/{Assignment}/solution_{ts}.{ext}` |
| **History** | Restore last generation on assignment select | ✅ Done | Fetches from MongoDB via `/history` endpoint |
| **Role Guard** | Student blocked from generation | ✅ Done | HTTP 403 on `/generate-answer` |
| **UI** | Dark glassmorphism chat interface | ✅ Done | Markdown rendering, file upload, format selector |

---

## 10. Project Summary

AI Learning Assistant validates the feasibility of building a functional AI-assisted teaching tool using only local infrastructure (Docker + Python + LLM API). The demo covers the full user journey: account creation, course/assignment setup, LLM-powered answer generation with web context augmentation, multi-format output, and persistent history — all from a single double-click launcher, zero cloud cost.
