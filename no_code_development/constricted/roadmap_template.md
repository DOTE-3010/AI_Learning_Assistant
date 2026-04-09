# Demo Roadmap Template — LLM Fill-in

> **How to use**: Feed this template + a PRD to an LLM.
> The LLM's only job is to replace every `{{PLACEHOLDER}}` with project-specific content extracted from the PRD.
> All infrastructure code (ports, Docker, FastAPI patterns, auth flow, launch scripts) is fixed — do not change it.
> The output is a complete, LLM-ready implementation roadmap identical in structure to the reference implementation.

---

## PRD → Placeholder Mapping

Before filling, extract the following from the PRD and map them to placeholders:

| What to extract from PRD | Placeholder(s) to fill |
|---|---|
| App name | `{{APP_NAME}}`, `{{APP_TITLE}}`, `{{APP_TAGLINE}}`, `{{DB_NAME}}` |
| User roles and their email domains | `{{ROLE_1}}`, `{{DOMAIN_ROLE_1}}`, `{{ROLE_2}}`, `{{DOMAIN_ROLE_2}}` |
| Demo credentials | `{{DEMO_EMAIL_ROLE_1}}`, `{{DEMO_PASSWORD}}` |
| Top-level domain entity (e.g. Course, Project, Document) | `{{PRIMARY_ENTITY}}`, `{{PRIMARY_ENTITY_LOWER}}`, `{{PRIMARY_ENTITY_FIELDS}}` |
| Sub-level domain entity (e.g. Assignment, Task, Section) | `{{SECONDARY_ENTITY}}`, `{{SECONDARY_ENTITY_LOWER}}`, `{{SECONDARY_ENTITY_FIELDS}}` |
| What the LLM generates | `{{GENERATION_SUBJECT}}`, `{{GENERATION_ENGINE_FILE}}`, `{{GENERATION_FUNCTION_NAME}}` |
| LLM prompt logic | `{{LLM_SYSTEM_PROMPT}}`, `{{LLM_USER_PROMPT_TEMPLATE}}`, `{{SEARCH_QUERY_TEMPLATE}}` |
| Output formats supported | `{{OUTPUT_FORMAT_LIST}}`, `{{OUTPUT_FORMAT_OPTIONS_HTML}}`, `{{FORMAT_CONVERSION_RULES}}` |
| API actions per role | `{{ENDPOINT_TABLE}}`, `{{ROLE_1_GENERATE_ENDPOINT}}` |
| UI copy | `{{PRIMARY_ACTION_LABEL}}`, `{{INPUT_PLACEHOLDER_TEXT}}` |

---

## 0. Frozen Constraints

> These values are identical for all demo-class apps. Do not change ports, Docker config, auth pattern, or launch scripts.

### Directory Tree

```
<repo_root>/
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── auth.py
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── utils.py
│   │   ├── web_search.py
│   │   └── {{GENERATION_ENGINE_FILE}}
│   ├── models/
│   │   ├── __init__.py
│   │   ├── postgres.py
│   │   └── schemas.py
│   ├── scripts/
│   │   ├── __init__.py
│   │   └── init_db.py
│   └── static/
│       └── index.html
├── demo_launcher.py
├── start_mvp.command
├── Makefile
├── docker-compose.yml
├── .env
└── backend/requirements.txt
```

> **FILL** `{{GENERATION_ENGINE_FILE}}`: filename for the LLM generation module (e.g. `answer_generator.py`, `summarizer.py`, `reviewer.py`)

### Fixed Ports

| Service    | Host Port | Container Port |
|------------|-----------|----------------|
| Backend    | 14242     | 14242          |
| PostgreSQL | 15432     | 5432           |
| MongoDB    | 27017     | 27017          |

### Environment Variables

| Variable           | Default Value                                           |
|--------------------|---------------------------------------------------------|
| `BIANXIE_API_KEY`  | `sk-...` (fill with actual key)                        |
| `BIANXIE_ENDPOINT` | `https://api.bianxie.ai/v1`                            |
| `MODEL_NAME`       | `gpt-5-mini`                                 |
| `POSTGRES_URL`     | `postgresql://postgres:postgres@localhost:15432/{{DB_NAME}}` |
| `MONGODB_URL`      | `mongodb://localhost:27017`                            |

> **FILL** `{{DB_NAME}}`: lowercase database name, no spaces (e.g. `solver42`, `codereview`, `docsum`)

### Docker Compose (`docker-compose.yml`) — Fixed

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: {{DB_NAME}}-postgres
    ports:
      - "15432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB={{DB_NAME}}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  mongo:
    image: mongo:7.0
    container_name: {{DB_NAME}}-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  postgres_data:
  mongo_data:
```

### Python Dependencies (`backend/requirements.txt`) — Fixed

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
duckduckgo-search==3.9.6
nbformat==5.9.2
python-multipart==0.0.6
```

> Add project-specific packages here if the PRD requires additional processing (e.g. `pypdf` for PDF parsing, `pillow` for image handling).

### Python Import Convention — Fixed

All imports rooted at `<repo_root>`, e.g. `from backend.core.config import BIANXIE_API_KEY`. `PYTHONPATH` must be set to `<repo_root>` at runtime.

---

## Phase 1: Config & Data Models

**Files to generate**: `backend/core/config.py`, `backend/models/postgres.py`, `backend/models/schemas.py`

**Dependencies**: None.

---

### `backend/core/config.py` — Fixed structure

```python
import os
from dotenv import load_dotenv
load_dotenv()

BIANXIE_API_KEY  = os.getenv("BIANXIE_API_KEY",  "sk-...")
BIANXIE_ENDPOINT = os.getenv("BIANXIE_ENDPOINT", "https://api.bianxie.ai/v1")
MODEL_NAME       = os.getenv("MODEL_NAME",        "gpt-5-mini")
POSTGRES_URL     = os.getenv("POSTGRES_URL",      "postgresql://postgres:postgres@localhost:15432/{{DB_NAME}}")
MONGODB_URL      = os.getenv("MONGODB_URL",       "mongodb://localhost:27017")

def validate_config():
    if not BIANXIE_API_KEY:
        print("Warning: BIANXIE_API_KEY not set")
```

---

### `backend/models/postgres.py`

**Fixed tables** (identical for all projects — do not modify):

```
Table: users
  id, email (unique), role, course_ids (ARRAY Integer),
  created_at, password_hash

Table: generation_jobs
  id, {{SECONDARY_ENTITY_LOWER}}_id (FK→{{SECONDARY_ENTITY_LOWER}}s.id),
  requested_by_email, role, model_config (JSON),
  status ("queued"|"running"|"succeeded"|"failed"),
  started_at, completed_at, cost_estimate (Float)
```

**Variable tables** (fill from PRD entities):

```
Table: {{PRIMARY_ENTITY_LOWER}}s
{{PRIMARY_ENTITY_FIELDS}}
```

> **FILL** `{{PRIMARY_ENTITY}}` / `{{PRIMARY_ENTITY_LOWER}}`: The top-level grouping entity from the PRD (e.g. Course/course, Project/project, Document/document).
>
> **FILL** `{{PRIMARY_ENTITY_FIELDS}}`: SQLAlchemy column definitions for this entity. Always include: `id (Integer PK)`, `title (String)`, `created_at (DateTime)`, `owner_email (String)`. Add any PRD-specific fields.

```
Table: {{SECONDARY_ENTITY_LOWER}}s
{{SECONDARY_ENTITY_FIELDS}}
```

> **FILL** `{{SECONDARY_ENTITY}}` / `{{SECONDARY_ENTITY_LOWER}}`: The sub-level work item entity (e.g. Assignment/assignment, Task/task, Section/section).
>
> **FILL** `{{SECONDARY_ENTITY_FIELDS}}`: Always include: `id (Integer PK)`, `{{PRIMARY_ENTITY_LOWER}}_id (Integer FK)`, `title (String)`, `instructions (String)`, `created_at (DateTime)`. Add PRD-specific fields.

---

### `backend/models/schemas.py`

**Fixed schemas** (keep verbatim):
- `UserRegisterRequest`: `email`, `password`, `confirm_password`
- `UserLoginRequest`: `email`, `password`
- `JobStatusResponse`: `status`, `cost?`, `output?`

**Variable schemas** (fill from PRD):

```
Create{{PRIMARY_ENTITY}}Request:
{{CREATE_PRIMARY_ENTITY_FIELDS}}

Create{{SECONDARY_ENTITY}}Request:
  {{PRIMARY_ENTITY_LOWER}}_id: int
{{CREATE_SECONDARY_ENTITY_FIELDS}}
```

> **FILL** `{{CREATE_PRIMARY_ENTITY_FIELDS}}`: Pydantic fields the user must provide when creating this entity (e.g. `title: str`, `term: str`).
>
> **FILL** `{{CREATE_SECONDARY_ENTITY_FIELDS}}`: Pydantic fields for creating the sub-entity (e.g. `title: str`, `instructions: str`, `due_at: Optional[datetime]`).

**Gate check**: `python -c "from backend.models.schemas import UserRegisterRequest; print('OK')"`

---

## Phase 2: Frontend

**File to generate**: `backend/static/index.html`

**Dependencies**: API contract table in Section 0 + Phase 1 data models. No backend implementation needed.

> **Why Phase 2?** Writing the UI first makes the product intent concrete. Non-engineering PMs can review the interface before any backend is built.

### Visual Design — Fixed

- Dark glassmorphism. Tailwind CSS via CDN + marked.js via CDN.
- Fonts: Inter (body) + JetBrains Mono (mono), Google Fonts CDN.
- Base: `bg-slate-900`. Glass: `rgba(30,41,59,0.7)` + `backdrop-filter: blur(10px)`.
- CSS classes to define: `.glass`, `.chat-bubble`, `.teacher`, `.ai`, `.modal-backdrop`, `.glow-text`.

### Layout — Fixed Structure, Variable Copy

```
Navbar:   {{APP_TITLE}}  /  {{APP_TAGLINE}}         [+ New {{PRIMARY_ENTITY}}] [●] [email]
Sidebar:  {{PRIMARY_ENTITY}} selector (dropdown)
          {{SECONDARY_ENTITY}} list
          [+ Create {{SECONDARY_ENTITY}}]
Main:     Login overlay (default visible)
          Chat area (AI bubbles left, {{ROLE_1}} bubbles right)
          Input panel: [{{INPUT_PLACEHOLDER_TEXT}}] [file upload]
                       [format selector] [{{PRIMARY_ACTION_LABEL}}]
```

> **FILL** `{{APP_TITLE}}`: Display name shown in navbar (e.g. `Solver#42`, `CodeReview AI`).
>
> **FILL** `{{APP_TAGLINE}}`: Subtitle shown below app title in navbar (e.g. `your private study nomenclator`).
>
> **FILL** `{{PRIMARY_ACTION_LABEL}}`: The main submit button text (e.g. `Execute Generation`, `Analyze Code`, `Summarize`).
>
> **FILL** `{{INPUT_PLACEHOLDER_TEXT}}`: Textarea placeholder (e.g. `Ask your question here...`, `Paste code to review...`).

### JS State Variables — Fixed

```javascript
const API_URL = "http://localhost:14242";
let currentUser = null;         // {email, role, token}
let currentCourse = null;       // primary entity object
let allCourses = [];            // filtered primary entities
let currentAssignmentId = null; // active secondary entity id
let activeJobInterval = null;
let activeJobId = null;
```

### Auth Flow — Fixed Pattern

- Login overlay visible on load. Two tabs: Login / Register.
- Pre-filled demo credentials: `{{DEMO_EMAIL_ROLE_1}}` / `{{DEMO_PASSWORD}}`.
- `POST /auth/login` → store `{email, role, token}` → hide overlay → `loadCourses()`.
- All protected requests send headers: `X-User-Email` + `X-User-Token`.

> **FILL** `{{DEMO_EMAIL_ROLE_1}}`: Pre-filled email in login form (e.g. `teacher@cuhk.edu.hk`).
>
> **FILL** `{{DEMO_PASSWORD}}`: Pre-filled password in login form (e.g. `Aa12345678`).

### CRUD + Generation Flow — Fixed Pattern

- `loadCourses()` → `GET /{{PRIMARY_ENTITY_LOWER}}s` → filter localStorage hidden set → render dropdown.
- `loadAssignments()` → `GET /{{SECONDARY_ENTITY_LOWER}}s` → client-filter by current primary entity id.
- `generateAnswer()` → `POST /{{ROLE_1_GENERATE_ENDPOINT}}` (multipart) → poll `GET /jobs/{id}` every 2000ms.
- On `succeeded`: render `data.output` via `marked.parse()` in AI bubble.

> **FILL** `{{ROLE_1_GENERATE_ENDPOINT}}`: The API path for the main generation action (e.g. `generate-answer`, `analyze-code`, `summarize`).

### Output Format Selector — Variable

```html
<select id="output-format">
{{OUTPUT_FORMAT_OPTIONS_HTML}}
</select>
```

> **FILL** `{{OUTPUT_FORMAT_OPTIONS_HTML}}`: One `<option value="...">...</option>` per output format from the PRD. Always include at least `<option value="md">Markdown Report</option>`.

**Gate check**: Open `backend/static/index.html` in browser → page renders, login overlay visible, no JS console errors.

---

## Phase 3: Persistence Layer

**Files to generate**: `backend/app/utils.py`, `backend/app/database.py`

**Dependencies**: Phase 1

---

### `backend/app/utils.py` — Fixed

```python
def sanitize_filename(name: str) -> str:
    # Replace \ / : * ? " < > | with _, spaces with _, strip leading/trailing dots/spaces
```

### `backend/app/database.py`

**Fixed infrastructure** (identical for all projects):
```python
engine       = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
mongo_client = MongoClient(MONGODB_URL)
mongo_db     = mongo_client["{{DB_NAME}}"]
```

**Fixed utility functions** (keep verbatim):
```python
def get_db() -> Generator          # FastAPI dependency, yields Session
def create_job(db, secondary_entity_id, email, role) -> GenerationJob
def update_job_status(db, job_id, status, cost=None)
def save_local_file(primary_title, secondary_title, content, fmt) -> str
def save_artifact(job_id, content, fmt, visibility, db_session=None) -> str
def get_artifact_by_job(job_id) -> dict | None
```

**Variable CRUD functions** (fill from PRD entities):

```python
def get_{{PRIMARY_ENTITY_LOWER}}(db, id) -> {{PRIMARY_ENTITY}} | None
def create_{{PRIMARY_ENTITY_LOWER}}(db, {{CREATE_PRIMARY_ENTITY_PARAMS}}) -> {{PRIMARY_ENTITY}}

def get_{{SECONDARY_ENTITY_LOWER}}(db, id) -> {{SECONDARY_ENTITY}} | None
def create_{{SECONDARY_ENTITY_LOWER}}(db, {{CREATE_SECONDARY_ENTITY_PARAMS}}) -> {{SECONDARY_ENTITY}}
```

> **FILL** `{{CREATE_PRIMARY_ENTITY_PARAMS}}` / `{{CREATE_SECONDARY_ENTITY_PARAMS}}`: Function parameters matching the Create*Request schemas from Phase 1.

**Gate check**:
```bash
docker-compose up -d postgres mongo && sleep 5
PYTHONPATH=. python -c "from backend.app.database import engine, Base; Base.metadata.create_all(bind=engine); print('OK')"
```

---

## Phase 4: Generation Engine

**Files to generate**: `backend/app/web_search.py`, `backend/app/{{GENERATION_ENGINE_FILE}}`

**Dependencies**: Phase 1

---

### Output Exposure Rule — Fixed

- The UI/API must expose **final answer only**.
- If the generation strategy uses multi-round refinement (draft/self-critique/rewrite), all intermediate rounds are internal-only.
- Never return intermediate rounds in chat bubbles, `/jobs/{job_id}` output, MongoDB artifact content, or `workspace/` files.

### `backend/app/web_search.py` — Fixed

```python
from duckduckgo_search import DDGS

def perform_web_search(query: str, max_results: int = 3) -> list[dict]:
    # DDGS context manager, return [] on any exception
    # Result keys: title, body, href
```

### `backend/app/{{GENERATION_ENGINE_FILE}}`

**Fixed infrastructure**:
```python
from openai import OpenAI
from backend.core.config import BIANXIE_API_KEY, BIANXIE_ENDPOINT, MODEL_NAME
from backend.app.web_search import perform_web_search

client = OpenAI(api_key=BIANXIE_API_KEY, base_url=BIANXIE_ENDPOINT)
```

**Variable: main generation function**:

```python
def {{GENERATION_FUNCTION_NAME}}(
    {{GENERATION_INPUT_PARAMS}},
    custom_context: str = None,
    use_search: bool = True
) -> str:
    # 1. If use_search: perform_web_search("{{SEARCH_QUERY_TEMPLATE}}")
    #    Append results as "\n\nWeb Search Context:\n- {title}: {body}\n"
    # 2. If custom_context: append it to context
    # 3. Build prompt:
    #    System: "{{LLM_SYSTEM_PROMPT}}"
    #    User:   "{{LLM_USER_PROMPT_TEMPLATE}}"
    # 4. Call client.chat.completions.create(model=MODEL_NAME, messages=[...])
    # 5. Return final-answer text only (no explicit round/iteration traces)
    # On exception: return "Error: {str(e)}"
```

> **FILL** `{{GENERATION_FUNCTION_NAME}}`: Function name (e.g. `generate_answer_logic`, `analyze_code`, `summarize_document`).
>
> **FILL** `{{GENERATION_INPUT_PARAMS}}`: Parameters extracted from the secondary entity fields that go into the prompt (e.g. `assignment_title: str, instructions: str` or `code: str, language: str`).
>
> **FILL** `{{SEARCH_QUERY_TEMPLATE}}`: Python f-string for the search query (e.g. `f"{assignment_title} solution"` or `f"{language} code review best practices"`).
>
> **FILL** `{{LLM_SYSTEM_PROMPT}}`: System message describing the LLM's role (e.g. `"You are an expert teaching assistant."`, `"You are a senior software engineer performing code review."`).
>
> **FILL** `{{LLM_USER_PROMPT_TEMPLATE}}`: User prompt template with `{variable}` slots matching `{{GENERATION_INPUT_PARAMS}}` and context. Must specify expected output format.

**Variable: format conversion function**:

```python
def convert_to_format(content: str, fmt: str) -> str:
    {{FORMAT_CONVERSION_RULES}}
```

> **FILL** `{{FORMAT_CONVERSION_RULES}}`: One branch per output format from the PRD.
> Always include: `"md" → return as-is`. Add `"py"` (extract ```python blocks), `"ipynb"` (nbformat), `"pdf"` (LaTeX wrap) only if those formats appear in the PRD.

**Gate check**:
```bash
PYTHONPATH=. python -c "
from backend.app.{{GENERATION_ENGINE_FILE_NO_EXT}} import {{GENERATION_FUNCTION_NAME}}
result = {{GENERATION_FUNCTION_NAME}}({{GATE_CHECK_SAMPLE_ARGS}}, use_search=False)
print(result[:100])
"
```

> **FILL** `{{GENERATION_ENGINE_FILE_NO_EXT}}`: filename without `.py`.
>
> **FILL** `{{GATE_CHECK_SAMPLE_ARGS}}`: Minimal sample arguments for the gate check call (e.g. `'Test Assignment', 'Write hello world'`).

---

## Phase 5: Auth Middleware & API

**Files to generate**: `backend/core/auth.py`, `backend/main.py`

**Dependencies**: Phases 1, 3, 4

---

### `backend/core/auth.py` — Fixed Pattern, Variable Domains

**Bypass paths** (fixed):
```
/ | /health | /docs | /openapi.json | /auth/register | /auth/login | /ui*
```

**Auth flow** (fixed):
1. Read `X-User-Email` header (fallback: query param).
2. Read `X-User-Token` header. Validate: `base64.decode(token) == email`.
3. Domain → role mapping:

```python
if email.endswith("{{DOMAIN_ROLE_1}}"): role = "{{ROLE_1}}"
elif email.endswith("{{DOMAIN_ROLE_2}}"): role = "{{ROLE_2}}"
else: return 403 Unauthorized domain
```

> **FILL** `{{DOMAIN_ROLE_1}}` / `{{ROLE_1}}`: First domain-role pair (e.g. `@cuhk.edu.hk` / `teacher`).
>
> **FILL** `{{DOMAIN_ROLE_2}}` / `{{ROLE_2}}`: Second domain-role pair (e.g. `@link.cuhk.edu.hk` / `student`).

### `backend/main.py`

**Fixed app init** (keep verbatim): FastAPI, CORSMiddleware (allow_origins=["*"]), StaticFiles mount at `/ui`, middleware registration, startup event with `Base.metadata.create_all`.

**Fixed endpoints** (identical for all projects):

| Method | Path | Auth | Guard | Description |
|--------|------|------|-------|-------------|
| GET | `/` | No | — | Redirect to `/ui` |
| GET | `/health` | No | — | `{"status": "ok"}` |
| POST | `/auth/register` | No | — | Create user, return role |
| POST | `/auth/login` | No | — | Validate, return base64 token |

**Variable endpoints** (fill from PRD feature list):

```
{{ENDPOINT_TABLE}}
```

> **FILL** `{{ENDPOINT_TABLE}}`: A Markdown table with columns `Method | Path | Auth | Guard | Description` for all project-specific endpoints. Must include at minimum:
> - `POST /{{PRIMARY_ENTITY_LOWER}}s` → create primary entity ({{ROLE_1}} only)
> - `GET  /{{PRIMARY_ENTITY_LOWER}}s` → list all
> - `POST /{{SECONDARY_ENTITY_LOWER}}s` → create sub-entity ({{ROLE_1}} only)
> - `GET  /{{SECONDARY_ENTITY_LOWER}}s` → list all
> - `POST /{{ROLE_1_GENERATE_ENDPOINT}}` → submit generation job ({{ROLE_1}} only, multipart/form-data)
> - `GET  /jobs/{job_id}` → poll status + output
> - `GET  /{{SECONDARY_ENTITY_LOWER}}s/{id}/history` → list succeeded jobs with content

**Fixed request/response patterns** (keep verbatim):

```
POST /auth/register: {email, password, confirm_password}
  → domain check → role inference → password_hash=f"hash_{password}" → {"status","email","role"}

POST /auth/login: {email, password}
  → hash check → token=base64(email) → {"token","role","email"}

POST /{{ROLE_1_GENERATE_ENDPOINT}} (multipart):
  → guard role == "{{ROLE_1}}" → create_job() → BackgroundTasks → {"job_id","status":"queued"}

GET /jobs/{job_id}:
  → get_artifact_by_job() if succeeded → {"status","cost","output"}  # output must be final answer only
```

**Fixed background task function** (keep verbatim, only change function/variable names):

```python
def process_generation_job(job_id, secondary_entity, output_format, custom_context=None, file_content=None):
    db = next(get_db())
    try:
        update_job_status(db, job_id, "running")
        full_context = (custom_context or "") + (f"\n\n[Attached]:\n{file_content}" if file_content else "")
        content = {{GENERATION_FUNCTION_NAME}}({{BACKGROUND_TASK_CALL_ARGS}}, custom_context=full_context, use_search=True)
        formatted = convert_to_format(content, output_format)
        save_artifact(job_id, formatted, output_format, "{{ROLE_1}}", db_session=db)
        update_job_status(db, job_id, "succeeded", cost=0.05)
    except Exception as e:
        update_job_status(db, job_id, "failed")
    finally:
        db.close()
```

> **FILL** `{{BACKGROUND_TASK_CALL_ARGS}}`: Arguments passed from `secondary_entity` fields into `{{GENERATION_FUNCTION_NAME}}` (e.g. `secondary_entity.title, secondary_entity.instructions`).

**Gate check**:
```bash
PYTHONPATH=. venv/bin/python -m uvicorn backend.main:app --port 14242 &
sleep 3
curl http://localhost:14242/health
# Expected: {"status":"ok"}
curl -s -X POST http://localhost:14242/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"{{DEMO_EMAIL_ROLE_1}}","password":"{{DEMO_PASSWORD}}","confirm_password":"{{DEMO_PASSWORD}}"}'
# Expected: {"status":"success","role":"{{ROLE_1}}"}
```

---

## Phase 6: Launch Scripts

**Files to generate**: `demo_launcher.py`, `start_mvp.command`, `Makefile`, `backend/scripts/init_db.py`

**Dependencies**: All previous phases.

All four files are **fixed in structure** — copy verbatim from reference implementation. Only replace:
- `{{APP_NAME}}` in print/banner strings
- `{{DB_NAME}}` in the POSTGRES_URL passed to `init_db`
- `{{DEMO_EMAIL_ROLE_1}}` and `{{DEMO_PASSWORD}}` in `init_db.py` seed user

### `backend/scripts/init_db.py` — seed data only varies

```python
# 1. Base.metadata.create_all(bind=engine)  ← fixed
# 2. Seed default demo user if not exists:
#    email={{DEMO_EMAIL_ROLE_1}}, role={{ROLE_1}}, password_hash=f"hash_{{DEMO_PASSWORD}}"
```

### `demo_launcher.py`, `start_mvp.command`, `Makefile` — fully fixed

Copy verbatim from reference. Replace app name in banner strings only.

**Gate check** (final E2E):
```bash
./start_mvp.command
# Browser opens at http://localhost:14242/ui
# Login with {{DEMO_EMAIL_ROLE_1}} / {{DEMO_PASSWORD}}
# Create a {{PRIMARY_ENTITY_LOWER}} → create a {{SECONDARY_ENTITY_LOWER}} → submit generation
# Expected: job reaches "succeeded", chat shows final answer only, file in workspace/
# Intermediate iteration text (e.g. "Round 1/2/3", "Draft v1") must not appear
```

---

## Integration Sequence

```
Phase 1 (Config + Models)  →  gate: import check
         ↓
Phase 2 (Frontend)         →  gate: static page renders in browser
         ↓
Phase 3 (Persistence)      →  gate: Base.metadata.create_all succeeds
         ↓
Phase 4 (Generation)       →  gate: LLM returns non-empty string
         ↓
Phase 5 (Auth + API)       →  gate: /health OK + /auth/register returns role
         ↓                         (Phase 2 frontend now fully testable)
Phase 6 (Launch Scripts)   →  gate: start_mvp.command → full E2E flow succeeds
```

---

## Definition of Done

- [ ] `start_mvp.command` runs to completion on a clean machine (Docker + Python 3.11 installed).
- [ ] `{{DEMO_EMAIL_ROLE_1}}` can log in with `{{DEMO_PASSWORD}}`.
- [ ] `{{ROLE_1}}` can create a `{{PRIMARY_ENTITY_LOWER}}` and a `{{SECONDARY_ENTITY_LOWER}}`.
- [ ] `{{ROLE_1}}` can submit a generation job and receive output within 60 seconds.
- [ ] Chat/API/file outputs contain final answer only; no explicit intermediate iteration rounds.
- [ ] `{{ROLE_2}}` domain receives 403 on the generation endpoint.
- [ ] Each successful job produces three artifacts:
  - PostgreSQL `generation_jobs` row with `status="succeeded"`.
  - MongoDB `artifacts` document.
  - Local file under `workspace/{{PRIMARY_ENTITY_LOWER}}/{{SECONDARY_ENTITY_LOWER}}/solution_{timestamp}.{ext}`.
- [ ] System remains functional after `docker-compose stop` + restart.
