# PRD: {{APP_NAME}} (Local Demo MVP)

> **How to use**: Fill every `{{PLACEHOLDER}}` below with your project-specific content.
> Fixed sections (Design Decisions, Tech Stack, Auth Pattern, System Features) are identical for all demo-class LLM web apps — do not change them.
> The filled PRD is designed to be fed directly into `roadmap_template.md` for slot-filling.

---

## 1. Product Identity

| Field | Value |
|---|---|
| **App Name** | {{APP_NAME}} |
| **Display Title** | {{APP_TITLE}} |
| **Tagline** | {{APP_TAGLINE}} |
| **Database Name** | {{DB_NAME}} |
| **Demo Account (Role 1)** | {{DEMO_EMAIL_ROLE_1}} / {{DEMO_PASSWORD}} |
| **Target Environment** | macOS local machine, single user |

> **FILL** `{{APP_NAME}}`: Short product name used in code and file paths (e.g. `Solver42`, `CodeReview`).
>
> **FILL** `{{APP_TITLE}}`: Display name shown in the navbar (e.g. `Solver#42`, `CodeReview AI`).
>
> **FILL** `{{APP_TAGLINE}}`: One-line subtitle under the title in the navbar (e.g. `your private study nomenclator`).
>
> **FILL** `{{DB_NAME}}`: Lowercase, no spaces (e.g. `solver42`, `codereview`).
>
> **FILL** `{{DEMO_EMAIL_ROLE_1}}`: Pre-filled demo email for the primary role on the login screen (e.g. `teacher@cuhk.edu.hk`).
>
> **FILL** `{{DEMO_PASSWORD}}`: Pre-filled demo password (e.g. `Aa12345678`).

---

## 2. Product Overview

**{{APP_NAME}}** is a localized, low-cost demo MVP for {{TARGET_AUDIENCE}}. It uses LLMs to {{PRODUCT_VALUE_PROPOSITION}}. The product runs entirely on a local machine with no cloud infrastructure.

Core design philosophy: **"Zero Infrastructure Cost"** and **"Plug and Play"** — starts with one double-click, no deployment needed.

> **FILL** `{{TARGET_AUDIENCE}}`: Who this demo is for (e.g. `the CUHK Business School`).
>
> **FILL** `{{PRODUCT_VALUE_PROPOSITION}}`: What the product does in one sentence (e.g. `help teachers generate standard answers from course assignments`).

---

## 3. Core Design Decisions

### 3.1. Local-First Architecture — Fixed
- Starts via `start_mvp.command` (double-click on macOS). No AWS/Azure.
- Backend runs in host Python environment; databases run in Docker containers.
- Generated files written to MongoDB (history) and to `workspace/PRIMARY_ENTITY/SECONDARY_ENTITY/` (direct file access).

### 3.2. Minimal Cost Control — Fixed
- Web search via **DuckDuckGo** (`duckduckgo-search` library) — free, no API key.
- LLM via **Bianxie API** (OpenAI-protocol compatible) — pay-as-you-go.
- No Kubernetes, no CI/CD. Managed by Makefile + shell script.

### 3.3. Identity & Authentication — Fixed Pattern, Variable Domains

**Registration**: Users self-register with email + password. Role is inferred from email domain at registration.

**Role mapping**:
- Email ends with `{{DOMAIN_ROLE_1}}` → **{{ROLE_1}}** ({{ROLE_1_CAPABILITIES}})
- Email ends with `{{DOMAIN_ROLE_2}}` → **{{ROLE_2}}** ({{ROLE_2_CAPABILITIES}})

**Session token**: `base64(email)` — stateless, demo-grade. Sent as `X-User-Token` + `X-User-Email` headers.

**Password storage**: `hash_{password}` (demo-grade — not for production).

> **FILL** `{{DOMAIN_ROLE_1}}`: Email domain for the primary role, include `@` (e.g. `@cuhk.edu.hk`).
>
> **FILL** `{{ROLE_1}}`: Primary role name, lowercase (e.g. `teacher`).
>
> **FILL** `{{ROLE_1_CAPABILITIES}}`: One line (e.g. `can create courses, assignments, generate answers`).
>
> **FILL** `{{DOMAIN_ROLE_2}}`: Email domain for the secondary role, include `@` (e.g. `@link.cuhk.edu.hk`).
>
> **FILL** `{{ROLE_2}}`: Secondary role name, lowercase (e.g. `student`).
>
> **FILL** `{{ROLE_2_CAPABILITIES}}`: One line (e.g. `can view assignments only; generation blocked with 403`).

---

## 4. System Architecture

### 4.1. Tech Stack — Fixed
- **Backend**: Python 3.11, FastAPI (async)
- **Database (Metadata)**: PostgreSQL 15 — users, {{PRIMARY_ENTITY_LOWER}}s, {{SECONDARY_ENTITY_LOWER}}s, generation jobs
- **Database (Artifacts)**: MongoDB 7 — generated content and logs
- **Search**: DuckDuckGo (top-3 web results per query)
- **LLM**: Bianxie API, model `gpt-5-mini` (OpenAI-compatible)
- **Frontend**: Single-file HTML5/JS, Tailwind CSS (CDN), marked.js (CDN), dark glassmorphism UI

### 4.2. Data Entities

#### Primary Entity: `{{PRIMARY_ENTITY}}`

> **FILL** `{{PRIMARY_ENTITY}}` / `{{PRIMARY_ENTITY_LOWER}}`: Top-level grouping entity. Examples: `Course`/`course`, `Project`/`project`.

| Field | Type | Notes |
|---|---|---|
| id | Integer PK | auto |
{{PRIMARY_ENTITY_FIELDS}}
| created_at | DateTime | auto |

Create request fields (Pydantic schema): `{{CREATE_PRIMARY_ENTITY_FIELDS}}`

Function params (includes server-side owner): `{{CREATE_PRIMARY_ENTITY_PARAMS}}`

> **FILL** `{{PRIMARY_ENTITY_FIELDS}}`: SQLAlchemy column rows, one per line: `| field_name | Type | notes |`. Always include an owner email field (e.g. `| teacher_email | String | owner |`).
>
> **FILL** `{{CREATE_PRIMARY_ENTITY_FIELDS}}`: Pydantic fields the user provides (e.g. `title: str`, `term: str`).
>
> **FILL** `{{CREATE_PRIMARY_ENTITY_PARAMS}}`: Full DB function params including owner (e.g. `title, term, teacher_email`).

#### Secondary Entity: `{{SECONDARY_ENTITY}}`

> **FILL** `{{SECONDARY_ENTITY}}` / `{{SECONDARY_ENTITY_LOWER}}`: Sub-level work item, direct input to the LLM. Examples: `Assignment`/`assignment`, `Task`/`task`.

| Field | Type | Notes |
|---|---|---|
| id | Integer PK | auto |
| {{PRIMARY_ENTITY_LOWER}}_id | Integer FK | → {{PRIMARY_ENTITY_LOWER}}s.id |
{{SECONDARY_ENTITY_FIELDS}}
| created_at | DateTime | auto |

Create request fields (Pydantic schema): `{{CREATE_SECONDARY_ENTITY_FIELDS}}`

Function params: `{{CREATE_SECONDARY_ENTITY_PARAMS}}`

> **FILL** `{{SECONDARY_ENTITY_FIELDS}}`: Always include `| title | String | display name |` and `| instructions | String | LLM input |`.
>
> **FILL** `{{CREATE_SECONDARY_ENTITY_FIELDS}}`: Pydantic fields (e.g. `course_id: int`, `title: str`, `instructions: str`, `due_at: Optional[datetime]`).
>
> **FILL** `{{CREATE_SECONDARY_ENTITY_PARAMS}}`: Full DB function params (e.g. `course_id, title, instructions, teacher_email, due_at`).

#### Fixed Entities (do not modify)
- **User**: id, email (unique), role, course_ids (Array), created_at, password_hash
- **GenerationJob**: id, {{SECONDARY_ENTITY_LOWER}}_id (FK), requested_by_email, role, model_config (JSON), status, started_at, completed_at, cost_estimate

### 4.3. Data Flow — Fixed Pattern
1. {{ROLE_1}} selects a {{SECONDARY_ENTITY_LOWER}} and submits a generation request (optional: custom context + file).
2. Backend creates a `GenerationJob` (`queued`) and returns `job_id` immediately.
3. Background task: DuckDuckGo search → build prompt → call LLM.
4. Result written to MongoDB + `workspace/PRIMARY/SECONDARY/solution_{timestamp}.{ext}`.
5. Frontend polls `GET /jobs/{job_id}` every 2 seconds until `succeeded`.

---

## 5. Generation Engine Specification

### 5.1. Module
- **File**: `backend/app/{{GENERATION_ENGINE_FILE}}`
- **File (no extension)**: `{{GENERATION_ENGINE_FILE_NO_EXT}}`
- **Main function**: `{{GENERATION_FUNCTION_NAME}}`
- **Input parameters**: `{{GENERATION_INPUT_PARAMS}}`, `custom_context: str = None`, `use_search: bool = True`
- **What it generates**: {{GENERATION_SUBJECT}}

> **FILL** `{{GENERATION_ENGINE_FILE}}`: Python filename (e.g. `standard_answer_generator.py`).
>
> **FILL** `{{GENERATION_ENGINE_FILE_NO_EXT}}`: Same without `.py` (e.g. `standard_answer_generator`).
>
> **FILL** `{{GENERATION_FUNCTION_NAME}}`: Main function name (e.g. `generate_answer_logic`).
>
> **FILL** `{{GENERATION_INPUT_PARAMS}}`: Python-style params from the secondary entity (e.g. `assignment_title: str, instructions: str`).
>
> **FILL** `{{GENERATION_SUBJECT}}`: Plain-language description (e.g. `a standard answer for the given assignment`).

### 5.2. LLM Prompts

**System prompt**:
```
{{LLM_SYSTEM_PROMPT}}
```

**User prompt template**:
```
{{LLM_USER_PROMPT_TEMPLATE}}
```

> **FILL** `{{LLM_SYSTEM_PROMPT}}`: 1-2 sentence system message (e.g. `You are a helpful academic assistant.`).
>
> **FILL** `{{LLM_USER_PROMPT_TEMPLATE}}`: Full user prompt with `{variable}` slots for generation input params, plus `{web_search_context}` and `{custom_context}`. Must specify expected output format at the end.

### 5.3. Search Query

```python
{{SEARCH_QUERY_TEMPLATE}}
```

> **FILL**: Python f-string using input params (e.g. `f"{assignment_title} solution"`).

### 5.4. Output Formats

**Format list** (comma-separated IDs for API validation): `{{OUTPUT_FORMAT_LIST}}`

**HTML select options** (for frontend dropdown):
```html
{{OUTPUT_FORMAT_OPTIONS_HTML}}
```

**Conversion rules** (Python logic per format):
```python
{{FORMAT_CONVERSION_RULES}}
```

> **FILL** `{{OUTPUT_FORMAT_LIST}}`: Comma-separated format IDs (e.g. `md, py, ipynb, pdf`).
>
> **FILL** `{{OUTPUT_FORMAT_OPTIONS_HTML}}`: One `<option value="ID">Display Name</option>` per format. Always include `<option value="md">Markdown Report</option>`.
>
> **FILL** `{{FORMAT_CONVERSION_RULES}}`: One `if fmt == "X": ...` branch per format. Always include `if fmt == "md": return content`. Example:
> ```python
> if fmt == "md":   return content
> if fmt == "py":   # extract ```python blocks via re.findall
> if fmt == "ipynb": # wrap in nbformat.v4 markdown cell
> if fmt == "pdf":  # wrap in \documentclass{article}...\end{document}
> ```

**Gate check sample call**:
```python
{{GENERATION_FUNCTION_NAME}}({{GATE_CHECK_SAMPLE_ARGS}}, use_search=False)
```

> **FILL** `{{GATE_CHECK_SAMPLE_ARGS}}`: Minimal positional args for smoke test (e.g. `'Test Assignment', 'Write hello world in Python'`).

---

## 6. API Surface

### 6.1. Fixed Endpoints (do not modify)

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
{{ENDPOINT_TABLE}}

> **FILL** `{{ENDPOINT_TABLE}}`: One row per project-specific endpoint. Must include:
> - `POST /{{PRIMARY_ENTITY_LOWER}}s` — {{ROLE_1}} only
> - `GET  /{{PRIMARY_ENTITY_LOWER}}s` — all authenticated users
> - `POST /{{SECONDARY_ENTITY_LOWER}}s` — {{ROLE_1}} only
> - `GET  /{{SECONDARY_ENTITY_LOWER}}s` — all authenticated users
> - `POST /{{ROLE_1_GENERATE_ENDPOINT}}` — {{ROLE_1}} only, multipart/form-data
> - `GET  /{{SECONDARY_ENTITY_LOWER}}s/{id}/history` — all authenticated users
>
> **FILL** `{{ROLE_1_GENERATE_ENDPOINT}}`: URL path for the main generation action (e.g. `generate-answer`, `analyze-code`).

### 6.3. Generation Endpoint Detail

`POST /{{ROLE_1_GENERATE_ENDPOINT}}` — multipart/form-data

| Field | Type | Required | Notes |
|---|---|---|---|
| {{SECONDARY_ENTITY_LOWER}}_id | int | Yes | |
| output_format | str | Yes | one of: {{OUTPUT_FORMAT_LIST}} |
| custom_context | str | No | Additional {{ROLE_1}} instructions |
| file | UploadFile | No | Reference file (UTF-8 text) |

Background task call: `{{GENERATION_FUNCTION_NAME}}({{BACKGROUND_TASK_CALL_ARGS}}, custom_context=..., use_search=True)`

> **FILL** `{{BACKGROUND_TASK_CALL_ARGS}}`: Fields from the secondary entity object passed into the generation function (e.g. `assignment.title, assignment.instructions`).

---

## 7. Feature List

### 7.1. {{ROLE_1}} (Primary Role)
- **Registration & Login**: Register with `{{DOMAIN_ROLE_1}}` email; role assigned automatically.
- **{{PRIMARY_ENTITY}} Management**: {{PRIMARY_ENTITY_MANAGEMENT_DESCRIPTION}}
- **{{SECONDARY_ENTITY}} Management**: {{SECONDARY_ENTITY_MANAGEMENT_DESCRIPTION}}
- **{{GENERATION_SUBJECT_TITLE}}**: {{GENERATION_FEATURE_DESCRIPTION}}
- **Web Search Augmentation**: Backend auto-searches DuckDuckGo using `{{SEARCH_QUERY_TEMPLATE}}` and injects top-3 results into the LLM prompt.
- **History**: Past successful generations for each {{SECONDARY_ENTITY_LOWER}} are restored automatically on selection.

> **FILL** `{{PRIMARY_ENTITY_MANAGEMENT_DESCRIPTION}}`: What the {{ROLE_1}} can do (e.g. `Create courses with title + term. Soft-delete locally via localStorage.`).
>
> **FILL** `{{SECONDARY_ENTITY_MANAGEMENT_DESCRIPTION}}`: What the {{ROLE_1}} can do (e.g. `Create assignments with title + instructions within a course.`).
>
> **FILL** `{{GENERATION_SUBJECT_TITLE}}`: Feature section heading (e.g. `Standard Answer Generation`, `Code Review`).
>
> **FILL** `{{GENERATION_FEATURE_DESCRIPTION}}`: UX flow description (e.g. `Select assignment, optionally enter custom context, optionally attach file. Choose output format. Submit → result in chat within ~30s.`).

### 7.2. {{ROLE_2}} (Secondary Role)
- **Registration & Login**: Register with `{{DOMAIN_ROLE_2}}` email.
- {{ROLE_2_FEATURE_DESCRIPTION}}
- **Generation blocked**: HTTP 403 on `/{{ROLE_1_GENERATE_ENDPOINT}}`.

> **FILL** `{{ROLE_2_FEATURE_DESCRIPTION}}`: What this role can do (e.g. `Assignment View: Browse assignment list and instructions.`).

### 7.3. System — Fixed
- **One-Click Launcher**: `start_mvp.command` — checks Docker, creates venv, starts DBs, seeds demo user, launches uvicorn, opens browser.
- **Async Job Queue**: `FastAPI BackgroundTasks`. Frontend polls every 2 seconds.
- **Dual-Write Storage**: MongoDB (artifact) + `workspace/` (local file) per successful generation.

---

## 8. UI Specification

### 8.1. Fixed Visual Design
- Dark glassmorphism. `bg-slate-900` base. Glass panels: `rgba(30,41,59,0.7)` + `backdrop-filter: blur(10px)`.
- 3-panel layout: sticky navbar / left sidebar (entity management) / main workspace (chat + input).
- Chat metaphor: {{ROLE_1}} messages right-aligned blue; AI responses left-aligned dark with product label.
- Login overlay full-screen on load. Pre-filled: `{{DEMO_EMAIL_ROLE_1}}` / `{{DEMO_PASSWORD}}`.
- `marked.js` renders LLM output inside chat bubbles. `Enter` key submits.

### 8.2. Variable Copy
- **Primary action button**: `{{PRIMARY_ACTION_LABEL}}`
- **Main textarea placeholder**: `{{INPUT_PLACEHOLDER_TEXT}}`

> **FILL** `{{PRIMARY_ACTION_LABEL}}`: Main submit button text (e.g. `Execute Generation`, `Analyze Code`).
>
> **FILL** `{{INPUT_PLACEHOLDER_TEXT}}`: Textarea placeholder (e.g. `Ask your question here...`).

---

## 9. Acceptance Criteria

| Module | Feature | Status | Description |
|---|---|---|---|
| **Startup** | `start_mvp.command` execution | ⬜ | All services launch; browser opens |
| **Auth** | Registration + domain role assignment | ⬜ | `{{DOMAIN_ROLE_1}}` → {{ROLE_1}}, `{{DOMAIN_ROLE_2}}` → {{ROLE_2}} |
| **Auth** | Login + token session | ⬜ | base64 token on every request |
| **{{PRIMARY_ENTITY}}** | Create and list | ⬜ | Soft-delete via localStorage |
| **{{SECONDARY_ENTITY}}** | Create and list | ⬜ | Soft-delete via localStorage |
| **Generation** | {{GENERATION_SUBJECT_TITLE}} output in < 60s | ⬜ | Includes web search context |
| **Generation** | File attachment support | ⬜ | UTF-8 text injected as reference context |
| **Storage** | Dual-write (MongoDB + workspace/) | ⬜ | `workspace/primary/secondary/solution_{ts}.{ext}` |
| **History** | Restore last generation on {{SECONDARY_ENTITY_LOWER}} select | ⬜ | Via `/history` endpoint |
| **Role Guard** | {{ROLE_2}} blocked from generation | ⬜ | HTTP 403 on `/{{ROLE_1_GENERATE_ENDPOINT}}` |
| **UI** | Dark glassmorphism chat interface | ⬜ | Markdown rendering, file upload, format selector |
{{ADDITIONAL_ACCEPTANCE_CRITERIA}}

> **FILL** `{{ADDITIONAL_ACCEPTANCE_CRITERIA}}`: Any project-specific rows in `| Module | Feature | Status | Description |` format. Leave empty if none.

---

## 10. Project Summary

{{PROJECT_SUMMARY}}

> **FILL**: 2-3 sentences on what this demo validates and its value.
