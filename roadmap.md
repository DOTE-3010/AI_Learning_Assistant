# Solver#42 — Implementation Roadmap (LLM-Ready)

> **Purpose**: Each phase in this document is a self-contained generation unit.
> A capable LLM should be able to generate every file in a phase in a single pass
> without making assumptions, using only the information in this document plus the
> source files referenced as examples.

---

## 0. Frozen Constraints

> These values are fixed across all phases. Never deviate from them.

### Directory Tree

```
<repo_root>/
├── backend/
│   ├── __init__.py               (empty)
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py           (empty)
│   │   ├── config.py
│   │   └── auth.py
│   ├── app/
│   │   ├── __init__.py           (empty)
│   │   ├── database.py
│   │   ├── utils.py
│   │   ├── web_search.py
│   │   └── standard_answer_generator.py
│   ├── models/
│   │   ├── __init__.py           (empty)
│   │   ├── postgres.py
│   │   └── schemas.py
│   ├── scripts/
│   │   ├── __init__.py           (empty)
│   │   └── init_db.py
│   └── static/
│       └── index.html
├── demo_launcher.py
├── start_mvp.command
├── Makefile
├── docker-compose.yml
└── backend/requirements.txt
```

### Fixed Ports

| Service    | Host Port | Container Port |
|------------|-----------|----------------|
| Backend    | 14242     | 14242          |
| PostgreSQL | 15432     | 5432           |
| MongoDB    | 27017     | 27017          |

### Environment Variables (hardcoded defaults are acceptable for demo)

| Variable          | Default Value                                              |
|-------------------|------------------------------------------------------------|
| `BIANXIE_API_KEY` | `sk-lXrpvF2HGabKdbMmtF9R9rcjklOqpeA2TFmmsNKWbAUE3cnW`    |
| `BIANXIE_ENDPOINT`| `https://api.bianxie.ai/v1`                               |
| `MODEL_NAME`      | `gpt-5-mini`                                     |
| `POSTGRES_URL`    | `postgresql://postgres:postgres@localhost:15432/solver42`  |
| `MONGODB_URL`     | `mongodb://localhost:27017`                                |

> Note: `POSTGRES_URL` uses port **15432** (the host-mapped port), not 5432.

### Python Import Convention

All imports use the package path rooted at `<repo_root>`, e.g.:
- `from backend.core.config import BIANXIE_API_KEY`
- `from backend.app.database import get_db`
- `from backend.models.postgres import Base`

When running, `PYTHONPATH` must be set to `<repo_root>`.

### Python Dependencies (`backend/requirements.txt`)

```
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
pymongo==4.6.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
openai>=1.3.0
httpx>=0.25.0
jinja2==3.1.2
markdown==3.5.1
weasyprint==60.1
duckduckgo-search==3.9.6
nbformat==5.9.2
python-multipart==0.0.6
```

### Docker Compose (`docker-compose.yml`)

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: solver42-postgres
    ports:
      - "15432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=solver42
    volumes:
      - postgres_data:/var/lib/postgresql/data
  mongo:
    image: mongo:7.0
    container_name: solver42-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  postgres_data:
  mongo_data:
```

---

## Phase 1: Config & Data Models

**Files to generate**: `backend/core/config.py`, `backend/models/postgres.py`, `backend/models/schemas.py`

**Dependencies**: None. These files have no imports from other local modules.

---

### `backend/core/config.py`

**Purpose**: Load environment variables with hardcoded fallback defaults.

**Exact content spec**:
```python
import os
from dotenv import load_dotenv

load_dotenv()

BIANXIE_API_KEY  = os.getenv("BIANXIE_API_KEY",  "<default key>")
BIANXIE_ENDPOINT = os.getenv("BIANXIE_ENDPOINT", "https://api.bianxie.ai/v1")
MODEL_NAME       = os.getenv("MODEL_NAME",        "gemini-3-pro-preview")
POSTGRES_URL     = os.getenv("POSTGRES_URL",      "postgresql://postgres:postgres@localhost:15432/solver42")
MONGODB_URL      = os.getenv("MONGODB_URL",       "mongodb://localhost:27017")

def validate_config():
    """Print warning if API key appears unset. Does not raise."""
    if not BIANXIE_API_KEY:
        print("Warning: BIANXIE_API_KEY not set")
```

---

### `backend/models/postgres.py`

**Purpose**: SQLAlchemy ORM table definitions. All tables live in the default schema.

**Exact table definitions**:

```
Table: users
  id            Integer, PK, index
  email         String, unique, index
  role          String          ("teacher" | "student")
  course_ids    ARRAY(Integer)
  created_at    DateTime, default=datetime.utcnow
  password_hash String, nullable

Table: courses
  id            Integer, PK, index
  title         String
  term          String
  teacher_email String
  created_at    DateTime, default=datetime.utcnow

Table: assignments
  id              Integer, PK, index
  course_id       Integer
  title           String
  instructions    String
  due_at          DateTime
  guidance_policy JSON
  output_formats  ARRAY(String)
  created_at      DateTime, default=datetime.utcnow

Table: generation_jobs
  id                  Integer, PK, index
  assignment_id       Integer
  requested_by_email  String
  role                String
  model_config        JSON
  status              String   ("queued" | "running" | "succeeded" | "failed")
  started_at          DateTime
  completed_at        DateTime
  cost_estimate       Float

Table: audit_events
  id            Integer, PK, index
  actor_email   String
  action        String
  resource_type String
  resource_id   Integer
  timestamp     DateTime, default=datetime.utcnow
  metadata_info JSON
```

**Required imports**: `sqlalchemy`, `sqlalchemy.ext.declarative.declarative_base`, `datetime`

Use `Base = declarative_base()` at module level. All models inherit from `Base`.

---

### `backend/models/schemas.py`

**Purpose**: Pydantic v2 request/response models used by FastAPI endpoints.

**Exact models**:

```
GenerateAnswerRequest
  assignment_id: int
  output_format: str = "md"
  custom_context: Optional[str] = None

RequestGuidanceRequest
  assignment_id: int
  question: Optional[str] = None

JobStatusResponse
  status: str
  cost: Optional[float] = None
  output: Optional[str] = None

CreateCourseRequest
  title: str
  term: str

CreateAssignmentRequest
  course_id: int
  title: str
  instructions: str
  due_at: Optional[datetime] = None

UserRegisterRequest
  email: str
  password: str
  confirm_password: str

UserLoginRequest
  email: str
  password: str
```

**Gate check**: `python -c "from backend.models.schemas import GenerateAnswerRequest; print('OK')"` → prints `OK`

---

## Phase 2: Frontend

**File to generate**: `backend/static/index.html`

**Dependencies**: API contract table in Section 0 (Frozen Constraints) + Phase 1 data models (to understand what data exists). No backend implementation needed — the frontend is a pure HTML/JS file that communicates with the backend via HTTP fetch calls.

> **Why Phase 2?** Non-engineering readers naturally reason from what they see on screen. Writing the UI first clarifies all product interactions and user actions, which in turn drives the API design in Phase 5. The frontend can be written and visually inspected as a static file before any backend code exists.

### Visual Design

- **Theme**: Dark glassmorphism. Base: `bg-slate-900`. Glass panels: `rgba(30,41,59,0.7)` with `backdrop-filter: blur(10px)`.
- **Fonts**: Inter (body) + JetBrains Mono (code/mono elements), loaded from Google Fonts CDN.
- **CDN scripts** (load in `<head>`):
  - `https://cdn.tailwindcss.com`
  - `https://cdn.jsdelivr.net/npm/marked/marked.min.js`
- **Color palette**: slate-900 background, blue-600 teacher accent, cyan-400 AI label accent, green-500 status dot.

### Layout Structure (3 regions)

```
┌─────────────────── Navbar (h-16, sticky, glass) ──────────────────────┐
│  Solver#42   [subtitle]                    [+New Course] [●] [email]  │
├─ Sidebar (w-72) ───────────┬──── Main Workspace ──────────────────────┤
│  Course selector (dropdown)│  [Login/Register overlay, z-50]          │
│  [X delete course]         │                                           │
│  ─────────────────         │  Chat area (scrollable, flex-col)         │
│  Assignment list           │    - AI bubbles (left-aligned, slate-700) │
│    [#1 title] [X]          │    - Teacher bubbles (right-aligned,      │
│    [#2 title] [X]          │      blue-600 gradient)                   │
│  ─────────────────         │                                           │
│  [+ Create Assignment]     │  Input panel (glass, bottom)              │
│                            │    [textarea] [file upload]               │
│  System v0.6.0 ● Local     │    [format selector] [Execute Generation] │
└────────────────────────────┴───────────────────────────────────────────┘
```

### State Variables (JS)

```javascript
const API_URL = "http://localhost:14242";
let currentUser = null;       // {email, role, token}
let currentCourse = null;     // course object from API
let allCourses = [];          // filtered (non-hidden) courses
let currentAssignmentId = null;
let activeJobInterval = null; // setInterval handle for polling
let activeJobId = null;
```

### Login / Register Screen

- Full-screen overlay (`absolute inset-0 z-50`) visible on load, hidden after successful login.
- Two tabs: "Login" / "Register" (switchable, `switchAuthMode(mode)`).
- Login form prefilled with: email=`teacher@cuhk.edu.hk`, password=`Aa12345678`.
- On `login()`:
  1. `POST /auth/login` with `{email, password}`
  2. On success: store `currentUser = {email, role, token}`, hide overlay, show sidebar + workspace + nav controls, call `loadCourses()`.
- On `register()`:
  1. Client-side check: all fields required, passwords match.
  2. `POST /auth/register` with `{email, password, confirm_password}`
  3. On success: switch to login tab with credentials prefilled.

### Auth Headers (sent on all protected requests)

```javascript
headers: {
    "X-User-Email": currentUser.email,
    "X-User-Token": currentUser.token
}
```

### Course Management

- `loadCourses(preferredCourseId?)`:
  - `GET /courses` with auth headers.
  - Filter out IDs stored in `localStorage` key `hidden_courses_{email}` (soft delete).
  - Populate `<select id="course-selector">`. Select: preferredCourseId > currentCourse > first.
  - Call `loadAssignments()`.
- `createCourse()`:
  - Read `#course-title`, `#course-term`. Both required.
  - `POST /courses` with `{title, term}`.
  - Optimistically update `allCourses`, set `currentCourse`, call `renderCourseOptions()` + `loadAssignments()`.
  - Background sync: call `loadCourses(newCourse.id)`.
- `deleteCurrentCourse()`:
  - Confirm dialog. Add ID to `localStorage` hidden set. Remove from `allCourses`. Re-render.

### Assignment Management

- `loadAssignments()`:
  - `GET /assignments` with auth headers.
  - Client-side filter: `a.course_id === currentCourse.id` AND not in `hidden_assignments_{email}` localStorage set.
  - Render list items with click handler `selectAssignment(a)` and delete button `deleteAssignmentLocally(a)`.
- `createAssignment()`:
  - Read `#assign-title`, `#assign-instr`. Both required.
  - `POST /assignments` with `{course_id: currentCourse.id, title, instructions}`.
  - Reload assignments on success.
- `deleteAssignmentLocally(assignment)`:
  - Confirm dialog. Add ID to localStorage hidden set. Reload assignments.

### Chat & Generation

- `selectAssignment(assignment)`:
  - Set `currentAssignmentId = assignment.id`.
  - Clear `#chat-history`.
  - Add AI bubble showing assignment title + instructions.
  - Call `fetchAssignmentHistory(assignment.id)`.

- `fetchAssignmentHistory(assignmentId)`:
  - `GET /assignments/{assignmentId}/history` with auth headers.
  - If history array non-empty, render the **last** item via `renderLatestOutput()` with a "Restored from {timestamp}" note appended.

- `generateAnswer()`:
  - Guard: `currentAssignmentId` must be set.
  - Read: `#output-format`, `#custom-question`, `#file-upload`.
  - Add teacher bubble summarizing the request (format, constraints, attachment name if any).
  - Build `FormData`: `assignment_id`, `output_format`, optional `custom_context`, optional `file`.
  - `POST /generate-answer` with auth headers (no `Content-Type` header — let browser set multipart boundary).
  - On success: clear previous `activeJobInterval`, store `activeJobId = data.job_id`.
  - Add AI bubble with `<span id="job-status-{job_id}" class="animate-pulse text-cyan-400">Generating...</span>`.
  - Call `pollJob(data.job_id)`.

- `pollJob(jobId)`:
  - `setInterval` every **2000ms**.
  - `GET /jobs/{jobId}` with auth headers.
  - On `status === "succeeded"`: clear interval, update status span to "Finished" (green), call `renderLatestOutput(data.output)`.
  - On `status === "failed"`: clear interval, add AI bubble with red error text.

- `renderLatestOutput(content)`:
  - Remove all existing `[data-generated-output="true"]` elements.
  - Add new AI bubble via `addMessage('ai', content)`. Mark with `data-generated-output="true"`.

- `addMessage(role, content)`:
  - Create `<div class="chat-bubble {role}">`.
  - For `role === 'ai'`: prepend a header bar `<div>…Solver#42 Core…</div>`.
  - Set `innerHTML = marked.parse(content)` (markdown rendering via marked.js).
  - Append to `#chat-history`, scroll to bottom.

### Output Format Selector Options

```html
<select id="output-format">
  <option value="md">Markdown Report</option>
  <option value="pdf">LaTeX PDF Source</option>
  <option value="py">Python Script</option>
  <option value="ipynb">Jupyter Notebook</option>
</select>
```

### Keyboard Shortcut

`Enter` (without Shift) in `#custom-question` textarea → trigger `generateAnswer()`.

### Modals

Two absolute-positioned modals (z-40) with `modal-backdrop` (rgba black + blur):
- `#new-course-modal`: inputs `#course-title`, `#course-term`. Buttons: Cancel / Create.
- `#new-assign-modal`: inputs `#assign-title`, textarea `#assign-instr`. Buttons: Cancel / Create.

### CSS Classes to Define (in `<style>` block, supplement Tailwind)

```css
.glass       { background: rgba(30,41,59,0.7); backdrop-filter: blur(10px);
               border: 1px solid rgba(255,255,255,0.1); }
.chat-bubble { max-width:85%; padding:12px 16px; border-radius:12px;
               margin-bottom:12px; line-height:1.6; animation: fadeIn 0.3s ease-out; }
.teacher     { background: linear-gradient(135deg,#2563eb,#1d4ed8); color:white;
               align-self:flex-end; border-bottom-right-radius:2px; }
.ai          { background:#334155; color:#e2e8f0; align-self:flex-start;
               border:1px solid #475569; border-bottom-left-radius:2px; }
.modal-backdrop { background-color:rgba(0,0,0,0.5); backdrop-filter:blur(4px); }
.glow-text   { text-shadow: 0 0 20px rgba(59,130,246,0.5); }
@keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
```

Also define markdown render styles for `.chat-bubble pre`, `.chat-bubble code`, `.chat-bubble h1/h2/h3`, `.chat-bubble ul/ol`.

**Gate check**: Open `backend/static/index.html` directly in a browser (file:// or via any static server). Page renders without JS console errors. The login overlay is visible. *(Full login flow requires Phase 5 backend to be running.)*

---

## Phase 3: Persistence Layer

**Files to generate**: `backend/app/utils.py`, `backend/app/database.py`

**Dependencies**: Phase 1 (`backend.core.config`, `backend.models.postgres`)

---

### `backend/app/utils.py`

**Purpose**: Filesystem helper. Single function.

**Exact function signature**:
```python
def sanitize_filename(name: str) -> str:
```
**Behavior**: Replace `\ / : * ? " < > |` with `_`, replace spaces with `_`, strip leading/trailing dots and spaces. Return safe string.

---

### `backend/app/database.py`

**Purpose**: All database read/write operations. No business logic here.

**Exact imports required**:
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from backend.core.config import POSTGRES_URL, MONGODB_URL
from backend.models.postgres import Base, GenerationJob, Assignment, User, Course
from backend.app.utils import sanitize_filename
from datetime import datetime
import os
```

**Module-level singletons** (instantiated at import time):
```python
engine       = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
mongo_client = MongoClient(MONGODB_URL)
mongo_db     = mongo_client["solver42"]   # database name: solver42
```

**Exact function signatures and behavior**:

```python
def get_db() -> Generator[Session, None, None]:
    # FastAPI dependency. Yields a Session, closes it in finally.

def get_assignment(db: Session, assignment_id: int) -> Assignment | None:
    # Query Assignment by PK.

def get_course(db: Session, course_id: int) -> Course | None:
    # Query Course by PK.

def create_course(db: Session, title: str, term: str, teacher_email: str) -> Course:
    # Insert Course row, commit, refresh, return.

def create_assignment(
    db: Session,
    course_id: int,
    title: str,
    instructions: str,
    teacher_email: str,
    due_at=None
) -> Assignment:
    # Insert Assignment row.
    # Hardcode: guidance_policy={"mask_code": True}, output_formats=["md","py","ipynb","pdf"]
    # due_at defaults to datetime.utcnow() if None.

def create_job(db: Session, assignment_id: int, email: str, role: str) -> GenerationJob:
    # Insert GenerationJob with status="queued", started_at=datetime.utcnow().

def update_job_status(db: Session, job_id: int, status: str, cost: float = None):
    # Update job.status. If cost provided, set job.cost_estimate.
    # If status == "succeeded", set job.completed_at = datetime.utcnow().

def save_local_file(course_title: str, assignment_title: str, content: str, fmt: str) -> str:
    # Build path: <cwd>/workspace/<safe_course>/<safe_assign>/solution_<YYYYMMDD_HHMMSS>.<ext>
    # ext_map: {"md":"md", "pdf":"tex", "py":"py", "ipynb":"ipynb"}, default "txt"
    # os.makedirs(base_dir, exist_ok=True). Write content as UTF-8. Return absolute file_path.

def save_artifact(job_id: int, content: str, fmt: str, visibility: str, db_session=None) -> str:
    # 1. Insert into mongo_db.artifacts: {job_id, content, format:fmt, visibility, created_at}
    # 2. If db_session provided: look up job → assignment → course, call save_local_file.
    # Return str(inserted_id).

def get_artifact_by_job(job_id: int) -> dict | None:
    # Return mongo_db.artifacts.find_one({"job_id": job_id})
```

**Gate check**:
```bash
docker-compose up -d postgres mongo
# wait ~5s
PYTHONPATH=. python -c "
from backend.app.database import engine, Base
Base.metadata.create_all(bind=engine)
print('Tables created OK')
"
```
Expected: `Tables created OK`

---

## Phase 4: Generation Engine

**Files to generate**: `backend/app/web_search.py`, `backend/app/standard_answer_generator.py`

**Dependencies**: Phase 1 (`backend.core.config`)

---

### `backend/app/web_search.py`

**Purpose**: DuckDuckGo search wrapper.

**Exact function**:
```python
from duckduckgo_search import DDGS

def perform_web_search(query: str, max_results: int = 3) -> list[dict]:
    # Use DDGS as context manager: list(ddgs.text(query, max_results=max_results))
    # On any exception, print error and return [].
    # Each result dict has keys: title, body, href (from duckduckgo-search library).
```

---

### `backend/app/standard_answer_generator.py`

**Purpose**: LLM generation and format conversion.

**Exact imports**:
```python
from openai import OpenAI
from backend.core.config import BIANXIE_API_KEY, BIANXIE_ENDPOINT, MODEL_NAME
from backend.app.web_search import perform_web_search
```

**Module-level singleton**:
```python
client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)
```

**Exact functions**:

```python
def generate_answer_logic(
    assignment_title: str,
    instructions: str,
    custom_context: str = None,
    use_search: bool = True
) -> str:
    # 1. If use_search: call perform_web_search(f"{assignment_title} solution")
    #    Build context string: "\n\nWeb Search Context:\n" + "- {title}: {body}\n" per result
    # 2. If custom_context: append "\n\nAdditional Teacher Instructions/Context:\n{custom_context}\n"
    # 3. Build prompt:
    #    "You are an expert teaching assistant. Create a standard answer for the following assignment.
    #     Assignment: {assignment_title}
    #     Instructions: {instructions}
    #     {context}
    #     Please provide the answer in Markdown format. Include code blocks if necessary."
    # 4. Call client.chat.completions.create(
    #      model=MODEL_NAME,
    #      messages=[
    #        {"role": "system", "content": "You are a helpful academic assistant."},
    #        {"role": "user",   "content": prompt}
    #      ]
    #    )
    # 5. Return completion.choices[0].message.content
    # On exception: print error, return "Error generating answer: {str(e)}"

def convert_to_format(content: str, fmt: str) -> str:
    # "md"    → return content as-is
    # "txt"   → return content as-is
    # "py"    → extract ```python...``` blocks with re.findall(r'```python(.*?)```', content, re.DOTALL)
    #           join with "\n\n", or return "# No python code found in solution" if empty
    # "ipynb" → use nbformat.v4.new_notebook(), add one markdown cell with content, return nbformat.writes(nb)
    # "pdf"   → return LaTeX wrapper: "\\documentclass{article}\n\\begin{document}\n{content}\n\\end{document}"
    # default → return content as-is
```

**Gate check**:
```bash
PYTHONPATH=. python -c "
from backend.app.standard_answer_generator import generate_answer_logic
result = generate_answer_logic('Test', 'Write hello world in Python', use_search=False)
print(result[:100])
"
```
Expected: Non-empty string (LLM response).

---

## Phase 5: Auth Middleware & API

**Files to generate**: `backend/core/auth.py`, `backend/main.py`

**Dependencies**: Phases 1, 3, 4 (Config/Models → Persistence → Generation Engine)

---

### `backend/core/auth.py`

**Purpose**: FastAPI HTTP middleware for email/token authentication.

**Exact function signature**:
```python
async def email_auth_middleware(request: Request, call_next) -> Response:
```

**Exact bypass paths** (no auth required):
- `request.url.path in ["/", "/health", "/docs", "/openapi.json", "/auth/register", "/auth/login"]`
- `request.url.path.startswith("/ui")`

**Auth flow**:
1. Read `X-User-Email` from headers. Fallback: `request.query_params.get("email")`.
2. If missing email → `JSONResponse(status_code=400, {"error": "X-User-Email header required"})`
3. Read `X-User-Token` from headers.
4. If missing token → `JSONResponse(status_code=401, {"error": "Authentication required (Missing Token)"})`
5. `decoded = base64.b64decode(token).decode('utf-8')`. If `decoded != email` → 403 Invalid Token. On exception → 403 Malformed Token.
6. Domain check:
   - `email.endswith("@cuhk.edu.hk")` → `role = "teacher"`
   - `email.endswith("@link.cuhk.edu.hk")` → `role = "student"`
   - else → `JSONResponse(status_code=403, {"error": "Unauthorized domain"})`
7. Set `request.state.email = email` and `request.state.role = role`.
8. `return await call_next(request)`

---

### `backend/main.py`

**Purpose**: FastAPI application with all HTTP endpoints.

**Exact imports**:
```python
from fastapi import FastAPI, Request, Depends, HTTPException, BackgroundTasks, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from backend.core.config import validate_config
from backend.core.auth import email_auth_middleware
from backend.app.database import (get_db, create_job, update_job_status, save_artifact,
                                   get_assignment, get_artifact_by_job, create_course,
                                   create_assignment)
from backend.models.schemas import (GenerateAnswerRequest, RequestGuidanceRequest,
                                     CreateCourseRequest, CreateAssignmentRequest,
                                     UserRegisterRequest, UserLoginRequest)
from backend.app.standard_answer_generator import generate_answer_logic, convert_to_format
from backend.models.postgres import User
from datetime import datetime
import base64, os
```

**App init**:
```python
app = FastAPI(title="Solver#42 MVP Backend")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

static_path = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_path, exist_ok=True)
app.mount("/ui", StaticFiles(directory=static_path, html=True), name="ui")

app.middleware("http")(email_auth_middleware)
```

**Startup event**:
```python
@app.on_event("startup")
async def startup_event():
    validate_config()
    from backend.app.database import engine, Base
    Base.metadata.create_all(bind=engine)
```

**Exact endpoint list**:

| Method | Path                              | Auth Required | Role Guard | Description                         |
|--------|-----------------------------------|---------------|------------|-------------------------------------|
| GET    | `/`                               | No            | —          | RedirectResponse to `/ui`           |
| GET    | `/health`                         | No            | —          | Returns `{"status": "ok"}`          |
| POST   | `/auth/register`                  | No            | —          | Create user                         |
| POST   | `/auth/login`                     | No            | —          | Return token + role                 |
| POST   | `/courses`                        | Yes           | teacher    | Create course                       |
| GET    | `/courses`                        | Yes           | —          | List all courses                    |
| POST   | `/assignments`                    | Yes           | teacher    | Create assignment                   |
| GET    | `/assignments`                    | Yes           | —          | List all assignments                |
| POST   | `/generate-answer`                | Yes           | teacher    | Submit generation job (background)  |
| GET    | `/jobs/{job_id}`                  | Yes           | —          | Poll job status + output            |
| GET    | `/assignments/{assignment_id}/history` | Yes      | —          | List succeeded jobs with content    |

**Exact request/response schemas**:

```
POST /auth/register
  Body: UserRegisterRequest {email, password, confirm_password}
  Validation:
    - password != confirm_password → 400 "Passwords do not match"
    - domain not @cuhk.edu.hk or @link.cuhk.edu.hk → 400 "Invalid domain..."
    - email already exists → 400 "Email already registered"
  Role: "teacher" if @cuhk.edu.hk else "student"
  Password storage: password_hash = f"hash_{password}"  (demo-only fake hash)
  Returns: {"status": "success", "email": str, "role": str}

POST /auth/login
  Body: UserLoginRequest {email, password}
  Validation:
    - user not found → 401 "Invalid credentials"
    - hash mismatch (f"hash_{password}") → 401 "Invalid credentials"
  Token: base64.b64encode(email.encode()).decode()
  Returns: {"token": str, "role": str, "email": str}

POST /generate-answer  (multipart/form-data)
  Form fields:
    assignment_id: int   (required)
    output_format: str   (required, one of: md | pdf | py | ipynb)
    custom_context: str  (optional)
    file: UploadFile     (optional)
  Guard: role != "teacher" → 403
  File handling: read bytes, decode as UTF-8; on UnicodeDecodeError use
    "[Binary file uploaded: {filename}. Parsing not supported in this MVP version.]"
  Background task: process_generation_job(job_id, assignment, output_format, custom_context, file_text)
  Returns: {"job_id": int, "status": "queued"}

GET /jobs/{job_id}
  If succeeded: fetch artifact via get_artifact_by_job(job_id), return artifact["content"] as output (final answer only)
  Returns: {"status": str, "cost": float|null, "output": str|null}

GET /assignments/{assignment_id}/history
  Query: GenerationJob WHERE assignment_id=X AND requested_by_email=email AND status="succeeded"
         ORDER BY created_at ASC
  For each job: fetch artifact, return {job_id, content, format, timestamp (ISO string)}
  Returns: list of above dicts
```

**Background task function** (defined in main.py, not a route):
```python
def process_generation_job(job_id, assignment, output_format, custom_context=None, file_content=None):
    db = next(get_db())
    try:
        update_job_status(db, job_id, "running")
        full_context = custom_context or ""
        if file_content:
            full_context += f"\n\n[Attached Reference Content]:\n{file_content}\n"
        content = generate_answer_logic(assignment.title, assignment.instructions,
                                        custom_context=full_context, use_search=True)
        formatted = convert_to_format(content, output_format)
        save_artifact(job_id, formatted, output_format, "teacher", db_session=db)
        update_job_status(db, job_id, "succeeded", cost=0.05)
    except Exception as e:
        print(f"Job failed: {e}")
        update_job_status(db, job_id, "failed")
    finally:
        db.close()
```

**Gate check**:
```bash
PYTHONPATH=. venv/bin/python -m uvicorn backend.main:app --host 0.0.0.0 --port 14242 &
sleep 3
curl http://localhost:14242/health
# Expected: {"status":"ok"}
curl -s -X POST http://localhost:14242/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@cuhk.edu.hk","password":"Aa12345678","confirm_password":"Aa12345678"}'
# Expected: {"status":"success","email":"teacher@cuhk.edu.hk","role":"teacher"}
```

---

## Phase 6: Launch Scripts

**Files to generate**: `demo_launcher.py`, `start_mvp.command`, `Makefile`, `backend/scripts/init_db.py`

**Dependencies**: All previous phases must be complete.

---

### `backend/scripts/init_db.py`

**Purpose**: Create all tables and seed one demo teacher account.

**Behavior**:
1. Import `engine`, `Base` from `backend.app.database`.
2. `Base.metadata.create_all(bind=engine)` — creates all tables (idempotent).
3. Check if `teacher@cuhk.edu.hk` already exists in `users` table. If not, insert:
   ```
   email=teacher@cuhk.edu.hk, role=teacher,
   password_hash="hash_Aa12345678", course_ids=[], created_at=datetime.utcnow()
   ```
4. Print confirmation messages.

---

### `demo_launcher.py`

**Purpose**: Python orchestration script at repo root. Manages DB startup, seeding, and uvicorn launch.

**Constants**:
```python
APP_PORT      = 14242
DB_PORT_PG    = 15432
DB_PORT_MONGO = 27017
```

**Helper functions**:
```python
def is_port_open(host: str, port: int) -> bool:
    # socket.connect_ex((host, port)) == 0

def run_command(cmd: str, cwd=None, env=None):
    # subprocess.check_call(cmd, shell=True, ...). On CalledProcessError: print + sys.exit(1).
```

**`main()` sequence**:
1. Print startup banner.
2. `docker ps` check. On failure → print error + `sys.exit(1)`.
3. `docker-compose up -d postgres mongo`.
4. Poll `is_port_open("localhost", DB_PORT_PG)` AND `is_port_open("localhost", DB_PORT_MONGO)` up to 30 retries (1s sleep each). Print "Waiting..." every 5 retries. On timeout → exit.
5. `time.sleep(2)` after ports open.
6. Build `env = os.environ.copy()`. Set:
   - `env["PYTHONPATH"] = os.getcwd()`
   - `env["POSTGRES_URL"] = f"postgresql://postgres:postgres@localhost:{DB_PORT_PG}/solver42"`
7. `run_command(f"{sys.executable} -m backend.scripts.init_db", env=env)`.
8. Start browser-open thread: poll `is_port_open("127.0.0.1", APP_PORT)` up to 20 retries, then `webbrowser.open(f"http://localhost:{APP_PORT}/ui")`.
9. `subprocess.call(f"{sys.executable} -m uvicorn backend.main:app --reload --host 0.0.0.0 --port {APP_PORT}", shell=True, env=env)`.
10. On `KeyboardInterrupt`: `docker-compose stop`.

**`argparse` actions**:
- `start` (default): call `main()`
- `reset`: `docker-compose down -v` then print instructions.

---

### `start_mvp.command`

**Purpose**: macOS double-clickable launcher (bash script).

**Behavior**:
1. `cd` to script's own directory (`DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"`).
2. Check `make` exists. If not → error + `read -p "Press any key to exit..."`.
3. Check `docker info` succeeds. If not → error + `read -p`.
4. If `venv/` directory does not exist → `make install`.
5. `make demo-start`.
6. `read -p "Press any key to exit..."` (prevent window flash-close on error).

---

### `Makefile`

```makefile
.PHONY: install demo-start demo-stop demo-reset clean

VENV_DIR = venv
PYTHON   = $(VENV_DIR)/bin/python
PIP      = $(VENV_DIR)/bin/pip

install:
	python3 -m venv $(VENV_DIR)
	$(PIP) install --upgrade pip
	$(PIP) install -r backend/requirements.txt
	@echo "✅ Environment set up! Run 'make demo-start' to launch."

demo-start:
	$(PYTHON) demo_launcher.py start

demo-reset:
	$(PYTHON) demo_launcher.py reset

clean:
	rm -rf $(VENV_DIR)
	find . -type d -name "__pycache__" -exec rm -rf {} +
```

**Gate check** (final E2E):
```bash
./start_mvp.command
# Browser opens at http://localhost:14242/ui
# Login with teacher@cuhk.edu.hk / Aa12345678
# Create a course → create an assignment → click Execute Generation
# Expected: job reaches "succeeded", chat renders final answer only, file appears in workspace/
# Intermediate iteration text (e.g. "Round 1/2/3", "Draft v1") must not appear
```

---

## Integration Sequence

Execute phases strictly in order. Each phase's gate check must pass before proceeding.

```
Phase 1 (Config + Models)  →  gate: import check
         ↓
Phase 2 (Frontend)         →  written & reviewed as static HTML   ← start here for product clarity
         ↓
Phase 3 (Persistence)      →  gate: Base.metadata.create_all succeeds
         ↓
Phase 4 (Generation)       →  gate: LLM returns non-empty string
         ↓
Phase 5 (Auth + API)       →  gate: /health OK, /auth/register returns success
         ↓                         (Phase 2 frontend now fully testable in browser)
Phase 6 (Launch Scripts)   →  gate: start_mvp.command → full E2E flow succeeds
```

> **Note on Phase 2**: The frontend is written at Phase 2 to clarify product intent early. Its full browser gate check (login + generation flow) can only pass once Phase 5 is running. The Phase 2 gate check verifies the static page renders correctly.

---

## Definition of Done

All of the following must be true simultaneously:

- [ ] `start_mvp.command` runs to completion on a fresh machine with Docker + Python 3.11 installed.
- [ ] `teacher@cuhk.edu.hk` can log in with password `Aa12345678`.
- [ ] Teacher can create a course and an assignment.
- [ ] Teacher can submit a generation job and receive output within 60 seconds.
- [ ] Chat/API/file outputs contain final answer only; no explicit intermediate iteration rounds.
- [ ] Student domain (`@link.cuhk.edu.hk`) receives 403 on `/generate-answer`.
- [ ] Each successful job produces three artifacts:
  - A row in PostgreSQL `generation_jobs` with `status="succeeded"`.
  - A document in MongoDB `artifacts` collection.
  - A file under `workspace/{Course}/{Assignment}/solution_{timestamp}.{ext}`.
- [ ] After `docker-compose stop` + restart + `make demo-start`, all prior data remains accessible.
