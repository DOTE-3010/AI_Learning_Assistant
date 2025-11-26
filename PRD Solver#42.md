# PRD: Solver#42

# Overview

A role-based, LLM-powered assignment assistant for business education that ingests course materials and produces guided study aids for students and standard answers for instructors. Built as a demo project with simplified, production-ready architecture: **email-based authentication** (no self-service registration), **dual-database design** (PostgreSQL for metadata, MongoDB for documents), and **Docker-portable deployment** supporting both local school servers and cloud infrastructure (AWS/Azure). The system provides a chat-style React frontend and a Python/FastAPI backend.

---

### Key Simplifications for Demo Project

1. **No Self-Service Registration**: Admin pre-registers all users in PostgreSQL via command-line scripts
2. **Email-Domain Authentication**: Role inferred from email suffix (@cuhk.edu.hk = teacher, @link.cuhk.edu.hk = student)
3. **Dual-Database Separation**: PostgreSQL handles metadata; MongoDB handles all I/O (files, artifacts, logs)
4. **Docker-First Deployment**: Single `docker-compose.yml` works on school servers and cloud with only environment variable changes
5. **Multi-Provider LLM Support**: BianxieAI aggregated API supports OpenAI, Anthropic, and other models via `BIANXIE_ENDPOINT`
6. **No Task Queue**: FastAPI async/await sufficient for demo; Celery/RQ can be added later

---

### Goals

- Enable teachers to generate standard answer for an assignment from class materials.
- Enable students to receive guidance, study plans, and solution ideation without revealing final answers.
- Provide an admin panel for configuration, deployment targets, model selection, and role management.

---

## 🔄 UPDATED: Architecture & Implementation Strategy (Based on Demo Project Requirements)

---

### User Roles and Permissions (SIMPLIFIED FOR DEMO)

**Registration Model: No Self-Service Registration**

- **Admin** (Single predefined account)
    - Pre-registers all teachers and students directly in PostgreSQL via command-line scripts or database manipulation
    - No web-based admin console for user management (can add later in GA)
    - Server-level access only (SSH + direct database operations)
    
- **Teacher** (Email domain: `@cuhk.edu.hk`)
    - Role is **automatically inferred from email domain** at request time
    - Pre-registered by Admin with email, course assignments, and permissions in SQL
    - No self-registration or invite flow in MVP
    
- **Student** (Email domain: `@link.cuhk.edu.hk`)
    - Role is **automatically inferred from email domain** at request time
    - Pre-registered by Admin in SQL with course enrollments
    - No self-registration

**Authentication Mechanism**
- Email domain suffix is the sole identifier of role; hard-coded in API middleware
- No JWT tokens or complex OAuth; email passed in request header or body
- API middleware validates: `if email.endswith("@cuhk.edu.hk") → role="teacher"`
- All session/permission checks happen at application layer, not database layer

---

### Data Storage Architecture (DUAL-DATABASE MODEL)

**PostgreSQL (Structured Data Only)**
- User registrations (email, role, course assignments)
- Course metadata (id, title, term, teacher_email)
- Assignment definitions (title, instructions, guidance policies)
- Generation jobs metadata (status, timestamps, model config)
- Audit events (for compliance and tracking)

**MongoDB (Unstructured Data - All I/O Flow)**
- Raw uploaded files (PDFs, images, notebooks, code)
- Extracted text and embeddings from materials
- Intermediate processing results (chunked documents, embeddings vectors)
- Generated artifacts (standard answers, student guidance)
- Generation job outputs and logs

**Rationale**: Separation of concerns. Admin manages SQL; LLM and scripts manage MongoDB autonomously. Different scaling and access patterns.

---

### Admin Operations (Server-Level)

Admin interacts **only via server terminal** (SSH + scripts):

1. **User Management**: 
   - SQL insert/update/delete scripts for users
   - Example: `INSERT INTO users (email, role, course_ids) VALUES ('prof@cuhk.edu.hk', 'teacher', ARRAY[1,2]);`
   
2. **Course/Assignment Setup**:
   - SQL scripts to initialize courses, assignments, policies
   
3. **Material Cleanup**:
   - Direct MongoDB queries to purge expired or failed generation artifacts
   
4. **Monitor Job Status**:
   - SQL queries on `generation_jobs` table for status and cost tracking

**No web-based admin dashboard** in MVP (reduces complexity).

---

### Deployment & Portability

**Docker Composition**:
- Backend (FastAPI + Python dependencies)
- PostgreSQL container
- MongoDB container (or connection string to Atlas)
- Unified `docker-compose.yml` for local and cloud deployment

**Multi-Provider LLM Support**:
- `BIANXIE_ENDPOINT` environment variable: `https://api.bianxie.ai/v1`
- Flexible model selection via `BIANXIE_MODEL` (gpt-4o, gpt-4o-mini, claude-sonnet, etc.)
- Switched at deployment time via `.env` or environment variables
- No hardcoding in code

**Deployment Options**:
1. **Local (School Server)**: `docker-compose up`, MongoDB on-premises
2. **Cloud (AWS/Azure)**: Containerized on EC2, MongoDB Atlas
3. **Hybrid**: MongoDB Atlas (remote) + FastAPI on school server

---

### Budget & Infrastructure ($1000 USD allocation)

| Component | Option | Est. Cost/Month |
|-----------|--------|-----------------|
| MongoDB (if cloud) | MongoDB Atlas M10 | $57–$150 |
| Compute (if cloud) | AWS t3.small EC2 | $5–$10 |
| Network/Backups | Misc. | $50–$100 |
| **Total** | | **~$100–$150/month** |

**Local deployment** (school server) has **zero incremental cost** for databases; MongoDB Docker is free.

---

### Key Use Cases

1) Teacher creates an assignment and generates the standard answer

- Upload or select course materials → configure output format (.md, .tex, .py, .ipynb) → generate → review → publish to teacher-only space or share selectively.

2) Student requests guidance

- Provide assignment prompt → upload allowed materials → receive outline, references, and step-by-step plan without final solution.

3) Admin configures environment

- Select cloud target, set model providers and keys, define rate limits, usage policies, and logging retention.

---

### Functional Requirements

- Input
    - Supported inputs: .txt, .pdf, .tex, .md, .jpg, .png, .ipynb, .py.
    - OCR for images and scanned PDFs. Extract text, equations, and basic layout.
    - Notebook and code parsing for semantic chunks.
    - Deduplication and versioning of materials with metadata: course, module, week, owner, checksum.
- Retrieval and Contexting
    - Chunking with semantic embeddings, hierarchical indexing by course and topic.
    - Teacher-configurable context windows and priority sources.
    - Citations: maintain source pointers for transparency.
    - **Web Search Integration** (NEW): Optional retrieval of real-time information from the internet to supplement course materials.
      - Triggered during answer generation when teacher requests supplementary current information.
      - Search queries auto-generated from assignment context; teacher can customize.
      - Results ranked by relevance and filtered for academic credibility (prioritize educational domains, peer-reviewed sources).
      - Integration point: happens in contexting phase before LLM generation.
- Answer Generation for teacher
    - Output formats: .md, .tex (essays or slides), .py, .ipynb.
    - Deterministic and creative modes with temperature/top‑p controls.
    - Template library for common assignment types: case analysis, memo, slide deck outline, quant problem sets, Python notebooks.
    - Style controls: tone, structure, citation style (APA/MLA/Chicago), LaTeX preamble templates.
- Guidance Guardrails for student
    - Masking rules prevent final numeric answers, full proofs, or full executable notebooks where restricted.
    - Provide structured hints, decomposition, reference sections, and "check-your-work" rubrics.
- Export and Delivery
    - File exports in target formats. Option to store to course folder.
    - Versioning with immutable audit references.

---

### Web Search Integration (NEW Feature)

**Purpose**: Enable real-time information retrieval to supplement static course materials, particularly useful for case studies, industry examples, policy changes, and current events relevant to business education.

**Scope**:
- Optional feature, disabled by default for privacy; teacher can enable per assignment
- Integrated into the contexting layer (`backend/app/contexting.py`)
- Supplements but does not replace course materials (course materials remain primary source)
- Applies to both standard answer generation and student guidance (with masking)

**Search Providers** (supported via aggregated API gateway):
- Primary: Perplexity API (AI-powered search with synthesis)
- Secondary: Google Search API + LLM synthesis
- Fallback: Local course materials only (if search fails)

**Query Generation**:
- Automatic: Extract key topics and assignment scope, formulate search queries
- Manual override: Teacher can edit or specify custom search queries
- Constraints: Max 5 parallel searches per generation to avoid rate limits

**Result Processing**:
- Rank by relevance to assignment context (semantic similarity)
- Filter for academic credibility:
  - Prioritize: .edu domains, peer-reviewed journals, government/official sources, reputable news outlets
  - Exclude: Social media, personal blogs, unverified sources
  - Allow-list: Teacher can configure trusted domains per course
- Deduplicate and summarize redundant results
- Cache search results (1-hour TTL) to avoid repeated queries

**Citations and Attribution**:
- Maintain source URLs and publication dates for all search results
- Generate formatted citations (APA/MLA/Chicago per teacher preference)
- Append "Sources Retrieved" section with URLs and access dates
- Clear distinction between course material sources and web search sources in output

**Student Guidance with Web Search**:
- Search results are included in student guidance only if teacher enables it per assignment
- Results are treated as supplementary hints (not final answers)
- URLs provided for student research, but specific content masking applies (no numeric conclusions from web)

**Data Storage**:
- MongoDB collection: `search_results` — cache indexed search queries, results, rank scores, source URLs
- PostgreSQL: `generation_jobs` extended with `use_web_search` flag and `search_query_count` metrics

**Privacy and Compliance**:
- No search queries logged separately; only aggregated in job metadata
- User queries do not leave system (Perplexity API key and search logic server-side only)
- Search results cached but not shared with other users
- GDPR-compliant: no personal data in search queries

**Error Handling**:
- If web search fails (quota exceeded, network error), generation continues with course materials only
- Admin monitoring: track search failures and quota usage in observability dashboard
- Graceful degradation: generation always completes even if search phase fails

**Performance**:
- Search latency: ~2–5 seconds per query (parallel execution up to 5 queries)
- Search results cached to avoid redundant network calls
- Generation time increase: +5–10 seconds when web search enabled

---

### Guardrails and Policy Engine

- Policy evaluation per request
    - Inputs: role, course policy, assignment policy, requested capability.
    - Outcomes: allow, allow-with-masking, deny.
- Student masking patterns
    - Suppress final numeric values
    - Withhold full code blocks beyond scaffolds
    - Provide pseudocode and verification tests without full implementations
- Teacher override controls with explicit justification and audit log.

---

### Frontend UX Flows

- Onboarding
    - Admin: set environment, connect model provider, create teacher invites.
    - Teacher: accept invite, create course, upload materials, create assignment.
    - Student: join course, view assignments, ask for guidance.
- Chat Workspace
    - Left: course and assignment navigator.
    - Center: chat thread with messages, citations, and artifact previews.
    - Right: job status panel, parameters, and policy indicators.
- Generation Review (Teacher)
    - Diff viewer, rubric alignment checklist, one-click export.

---

### File Handling and Conversion

- PDF and image OCR with math support (LaTeX extraction where possible).
- LaTeX to Markdown pipeline for preview; retain original .tex.
- Notebook conversion utilities for .ipynb ↔ .py exporting.
- Virus scanning and type validation on upload.

---

### Observability and Cost Controls

- Per-role and per-course token and cost caps.
- Live usage dashboards and monthly budget alerts.
- Provider failover and automatic model downgrade when quota exceeded.

---

### Security and Compliance Details

- RBAC at API and storage layers; presigned download URLs with short TTL.
- PII redaction in logs and prompts where feasible.
- Data retention policies configurable per organization and course.

---

### Performance Targets

- Upload: 1 GB files supported, chunked and resumable.
- Indexing: 1,000-page corpus ingested under 15 minutes (asynchronous).
- Generation: 10–20 page essay draft in < 30 seconds P95 on high-capacity models.

---

### Risks and Mitigations

| **Risk** | **Mitigation** |
|---------|----------------|
| **No self-service auth** → friction in onboarding | Admin pre-registers all users; acceptable for demo. Full auth layer added in GA. |
| **Single admin account** → single point of failure | Admin credentials stored securely (SSH keys). Backup procedures documented. |
| **Email domain auth** → relies on email provider security | Acceptable for institutional demo. MFA/2FA added if production deployment. |
| **Model hallucinations** | Source-grounded retrieval + citations required. Teacher review flow mandatory. |
| **Sensitive data exposure** | Role-based access via email domain. PostgreSQL + MongoDB access restricted. |
| **Cost overruns (LLM API)** | Token counting per request. Admin monitors usage via PostgreSQL. Monthly alerts. |
| **MongoDB data loss** | Automated backups (MongoDB Atlas if cloud; cron scripts if local). |

---

### Rollout Plan

- Alpha: single institution, limited courses, gather feedback.
- Beta: multi-tenant support, broader model provider matrix.
- GA: hardened admin console, analytics, and compliance features.

---

### Success Metrics

- Teacher time saved per assignment created.
- Student satisfaction with guidance quality without answer leakage.
- Reduction in academic integrity incidents.
- System reliability, latency, and cost per assignment.

---

### Open Questions

- Preferred default deployment target and data residency requirements per tenant?
- Required LMS integrations (Canvas, Moodle, Blackboard) and timeline?
- Which citation styles and LaTeX preambles should be first-class presets?
- Institution policies on storage duration for generated artifacts?