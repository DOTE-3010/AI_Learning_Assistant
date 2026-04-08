from fastapi import FastAPI, Request, Depends, HTTPException, BackgroundTasks, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.core.config import validate_config
from backend.core.auth import email_auth_middleware
from backend.app.database import get_db, create_job, update_job_status, save_artifact, get_assignment, get_artifact_by_job, create_course, create_assignment
from backend.models.schemas import GenerateAnswerRequest, RequestGuidanceRequest, CreateCourseRequest, CreateAssignmentRequest, UserRegisterRequest, UserLoginRequest
from backend.app.standard_answer_generator import generate_answer_logic, convert_to_format
from backend.models.postgres import User
from datetime import datetime
import time
import shutil
import os
import base64
import io
import json

from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from pypdf import PdfReader

app = FastAPI(title="Solver#42 MVP Backend")
MAX_REFERENCE_CHARS = 20000
JOB_CONTEXT_ESTIMATES = {}


def _truncate_reference_text(text: str, max_chars: int = MAX_REFERENCE_CHARS) -> str:
    if len(text) <= max_chars:
        return text
    return f"{text[:max_chars]}\n\n[Truncated to {max_chars} characters.]"


def _parse_ipynb_reference(content_bytes: bytes) -> str:
    decoded = content_bytes.decode("utf-8", errors="replace")
    data = json.loads(decoded)
    cells = data.get("cells", [])
    extracted_chunks = []

    for idx, cell in enumerate(cells, 1):
        cell_type = cell.get("cell_type", "unknown")
        if cell_type not in ("markdown", "code"):
            continue
        source = cell.get("source", "")
        if isinstance(source, list):
            source = "".join(source)
        source = str(source).strip()
        if not source:
            continue
        label = "Markdown" if cell_type == "markdown" else "Code"
        extracted_chunks.append(f"[{label} Cell {idx}]\n{source}")

    if not extracted_chunks:
        return "[Notebook uploaded, but no markdown/code cell content was found.]"

    return "\n\n".join(extracted_chunks)


def _parse_pdf_reference(content_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(content_bytes))
    pages = []
    for page_index, page in enumerate(reader.pages, 1):
        page_text = (page.extract_text() or "").strip()
        if page_text:
            pages.append(f"[Page {page_index}]\n{page_text}")

    if not pages:
        return "[PDF uploaded, but no extractable text was found.]"

    return "\n\n".join(pages)


def _extract_reference_text(file: UploadFile, content_bytes: bytes) -> str:
    filename = (file.filename or "").lower()
    _, ext = os.path.splitext(filename)

    if ext == ".ipynb":
        return _truncate_reference_text(_parse_ipynb_reference(content_bytes))

    if ext == ".pdf":
        return _truncate_reference_text(_parse_pdf_reference(content_bytes))

    try:
        return _truncate_reference_text(content_bytes.decode("utf-8"))
    except UnicodeDecodeError:
        return f"[Binary file uploaded: {file.filename}. Parsing not supported in this MVP version.]"

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files (Frontend)
import os
static_path = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_path):
    os.makedirs(static_path)
app.mount("/ui", StaticFiles(directory=static_path, html=True), name="ui")

# Auth Middleware (Register middleware globally)
app.middleware("http")(email_auth_middleware)

@app.get("/")
def root():
    return RedirectResponse(url="/ui")

@app.on_event("startup")
async def startup_event():
    # Check if we are in testing mode
    if os.getenv("TESTING"):
        return

    validate_config()
    # Ensure DB tables exist on startup
    from backend.app.database import engine, Base
    
    # Retry logic for DB connection
    max_retries = 10
    retry_interval = 2
    
    for i in range(max_retries):
        try:
            # Try to create tables (which connects to DB)
            print(f"🔄 Attempting to connect to database ({i+1}/{max_retries})...")
            Base.metadata.create_all(bind=engine)
            print("✅ Database connection successful.")
            break
        except Exception as e:
            if i == max_retries - 1:
                print(f"❌ Failed to connect to database after {max_retries} attempts.")
                raise e
            print(f"⚠️ Database not ready yet. Retrying in {retry_interval}s...")
            time.sleep(retry_interval)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# --- Registration API ---
@app.post("/auth/register")
async def register_user(req: UserRegisterRequest, db: Session = Depends(get_db)):
    # 1. Validate
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    if not req.email.endswith("@cuhk.edu.hk") and not req.email.endswith("@link.cuhk.edu.hk"):
        raise HTTPException(status_code=400, detail="Invalid domain. Must be @cuhk.edu.hk or @link.cuhk.edu.hk")
    
    # 2. Check existing
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 3. Determine role
    role = "teacher" if req.email.endswith("@cuhk.edu.hk") else "student"
    
    # 4. Create User (In a real app, hash password!)
    # For demo, we store simple hash or raw if just showing data persistence.
    # Let's do a simple fake hash to show intent.
    fake_hash = f"hash_{req.password}" 
    
    user = User(
        email=req.email,
        role=role,
        password_hash=fake_hash,
        course_ids=[], # Empty initially
        created_at=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    
    return {"status": "success", "email": user.email, "role": user.role}

@app.post("/auth/login")
async def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify simple fake hash
    expected_hash = f"hash_{req.password}"
    if user.password_hash != expected_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate Simple Token: base64(email)
    # Just for demo proof of concept
    token = base64.b64encode(user.email.encode('utf-8')).decode('utf-8')
    
    return {"token": token, "role": user.role, "email": user.email}

# ... (Existing Generation Logic) ...

def process_generation_job(
    job_id: int,
    assignment,
    output_format: str,
    custom_context: str = None,
    file_content: str = None,
    iteration_turns: int = 3,
):
    # Background task
    db = next(get_db()) # Manual session for background task
    try:
        update_job_status(db, job_id, "running")
        JOB_CONTEXT_ESTIMATES[job_id] = None
        
        # Append file content to context if exists
        full_context = custom_context or ""
        if file_content:
            full_context += f"\n\n[Attached Reference Content]:\n{file_content}\n"

        # Real Call
        generation_result = generate_answer_logic(
            assignment.title,
            assignment.instructions,
            custom_context=full_context,
            use_search=True,
            output_format=output_format,
            turns=iteration_turns,
            return_details=True,
        )
        content = generation_result.get("final_output", "")
        JOB_CONTEXT_ESTIMATES[job_id] = generation_result.get("context_window_estimate")
        
        # Format
        formatted_content = convert_to_format(content, output_format)
        
        # Save Artifact (Pass DB session to enable local file saving)
        save_artifact(job_id, formatted_content, output_format, "teacher", db_session=db)
        
        update_job_status(db, job_id, "succeeded", cost=0.05) # Mock cost
        
    except Exception as e:
        print(f"Job failed: {e}")
        JOB_CONTEXT_ESTIMATES[job_id] = None
        update_job_status(db, job_id, "failed")
    finally:
        db.close()

@app.post("/generate-answer")
async def generate_answer(
    request: Request,
    background_tasks: BackgroundTasks,
    assignment_id: int = Form(...),
    output_format: str = Form(...),
    custom_context: str = Form(None),
    iteration_turns: int = Form(3),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    email = request.state.email
    role = request.state.role
    
    if role != "teacher":
        raise HTTPException(status_code=403, detail="Teachers only")
    
    assignment = get_assignment(db, assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    # Process File
    file_text = None
    if file:
        try:
            content_bytes = await file.read()
            file_text = _extract_reference_text(file, content_bytes)
        except Exception as e:
            print(f"File upload parsing error: {e}")
    
    job = create_job(db, assignment_id, email, role)
    
    background_tasks.add_task(
        process_generation_job,
        job.id,
        assignment,
        output_format,
        custom_context,
        file_text,
        iteration_turns,
    )
    
    return {"job_id": job.id, "status": "queued"}

@app.post("/courses")
async def create_new_course(req: CreateCourseRequest, request: Request, db: Session = Depends(get_db)):
    email = request.state.email
    if request.state.role != "teacher":
        raise HTTPException(status_code=403, detail="Teachers only")
    course = create_course(db, req.title, req.term, email)
    return {"id": course.id, "title": course.title}

@app.post("/assignments")
async def create_new_assignment(req: CreateAssignmentRequest, request: Request, db: Session = Depends(get_db)):
    email = request.state.email
    if request.state.role != "teacher":
        raise HTTPException(status_code=403, detail="Teachers only")
    assignment = create_assignment(db, req.course_id, req.title, req.instructions, email, req.due_at)
    return {"id": assignment.id, "title": assignment.title}

@app.get("/jobs/{job_id}")
async def get_job_status(job_id: int, db: Session = Depends(get_db)):
    from backend.models.postgres import GenerationJob
    job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    output = None
    if job.status == "succeeded":
        artifact = get_artifact_by_job(job_id)
        if artifact:
            output = artifact["content"]
            
    return {
        "status": job.status,
        "cost": job.cost_estimate,
        "output": output,
        "context_window_estimate": JOB_CONTEXT_ESTIMATES.get(job_id),
    }

@app.get("/assignments/{assignment_id}/history")
async def get_assignment_history(assignment_id: int, request: Request, db: Session = Depends(get_db)):
    email = request.state.email
    
    from backend.models.postgres import GenerationJob
    # Get all succeeded jobs for this assignment by this user
    jobs = db.query(GenerationJob).filter(
        GenerationJob.assignment_id == assignment_id,
        GenerationJob.requested_by_email == email,
        GenerationJob.status == "succeeded"
    ).order_by(GenerationJob.started_at.asc()).all() # Oldest first
    
    history = []
    for job in jobs:
        artifact = get_artifact_by_job(job.id)
        if artifact:
            history.append({
                "job_id": job.id,
                "content": artifact["content"],
                "format": artifact["format"],
                "timestamp": job.completed_at.isoformat() if job.completed_at else None
            })
            
    return history

@app.get("/assignments")
async def list_assignments(db: Session = Depends(get_db)):
    from backend.models.postgres import Assignment
    return db.query(Assignment).all()

@app.get("/courses")
async def list_courses(db: Session = Depends(get_db)):
    from backend.models.postgres import Course
    return db.query(Course).all()
