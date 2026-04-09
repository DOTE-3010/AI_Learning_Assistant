from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from backend.core.config import POSTGRES_URL, MONGODB_URL
from backend.models.postgres import Base, GenerationJob, Assignment, User, Course
from backend.app.utils import sanitize_filename
from datetime import datetime
from bson.objectid import ObjectId
import os
import json
from backend.app.latex_renderer import compile_latex
from sqlalchemy.exc import DataError

# Postgres
engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Mongo
mongo_client = MongoClient(MONGODB_URL)
mongo_db = mongo_client["ai_learning_assistant"]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_assignment(db, assignment_id: int):
    return db.query(Assignment).filter(Assignment.id == assignment_id).first()

def get_course(db, course_id: int):
    return db.query(Course).filter(Course.id == course_id).first()

def create_course(db, title, term, teacher_email):
    course = Course(
        title=title,
        term=term,
        teacher_email=teacher_email,
        created_at=datetime.utcnow()
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def create_assignment(db, course_id, title, instructions, teacher_email, due_at=None):
    # Simple validation: check if teacher owns course (skipped for demo simplicity, or we can query)
    assignment = Assignment(
        course_id=course_id,
        title=title,
        instructions=instructions,
        due_at=due_at or datetime.utcnow(),
        guidance_policy={"mask_code": True},
        output_formats=["md", "py", "ipynb", "pdf"],
        created_at=datetime.utcnow()
    )
    db.add(assignment)
    try:
        db.commit()
    except DataError as exc:
        # Backward-compatible fallback: some existing Postgres schemas still use text[].
        db.rollback()
        if "output_formats" not in str(exc):
            raise
        now = datetime.utcnow()
        insert_sql = text("""
            INSERT INTO assignments (
                course_id, title, instructions, due_at, guidance_policy, output_formats, created_at
            )
            VALUES (
                :course_id, :title, :instructions, :due_at, CAST(:guidance_policy AS jsonb), :output_formats, :created_at
            )
            RETURNING id
        """)
        result = db.execute(
            insert_sql,
            {
                "course_id": course_id,
                "title": title,
                "instructions": instructions,
                "due_at": due_at or now,
                "guidance_policy": json.dumps({"mask_code": True}),
                "output_formats": ["md", "py", "ipynb", "pdf"],
                "created_at": now,
            }
        )
        db.commit()
        assignment_id = result.scalar_one()
        assignment = db.query(Assignment).filter(Assignment.id == assignment_id).first()

    db.refresh(assignment)
    return assignment

def create_job(db, assignment_id, email, role):
    job = GenerationJob(
        assignment_id=assignment_id,
        requested_by_email=email,
        role=role,
        status="queued",
        started_at=datetime.utcnow()
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def update_job_status(db, job_id, status, cost=None):
    job = db.query(GenerationJob).filter(GenerationJob.id == job_id).first()
    if job:
        job.status = status
        if cost:
            job.cost_estimate = cost
        if status == "succeeded":
            job.completed_at = datetime.utcnow()
        db.commit()

def _resolve_available_filename_base(base_dir: str, preferred_base: str, extensions: list[str]) -> str:
    """
    Return a non-conflicting filename base using common suffix style: name, name(1), name(2)...
    """
    candidate = preferred_base
    index = 1

    def has_conflict(name_base: str) -> bool:
        return any(os.path.exists(os.path.join(base_dir, f"{name_base}.{ext}")) for ext in extensions)

    while has_conflict(candidate):
        candidate = f"{preferred_base}({index})"
        index += 1

    return candidate

def save_local_file(course_title: str, assignment_title: str, content: str, fmt: str) -> str:
    """Save generated content to local filesystem under course/assignment directory"""
    # Sanitize names
    safe_course = sanitize_filename(course_title)
    safe_assign = sanitize_filename(assignment_title)
    
    # Base directory (relative to backend root for demo)
    base_dir = os.path.join(os.getcwd(), "workspace", safe_course, safe_assign)
    os.makedirs(base_dir, exist_ok=True)
    
    # Filename: assignment title first, append (1), (2)... when conflict exists.
    ext_map = {"md": "md", "pdf": "tex", "py": "py", "ipynb": "ipynb"} 
    ext = ext_map.get(fmt, "txt")
    check_exts = ["tex", "pdf"] if fmt == "pdf" else [ext]
    filename_base = _resolve_available_filename_base(base_dir, safe_assign or "assignment", check_exts)
    filename = f"{filename_base}.{ext}"
    file_path = os.path.join(base_dir, filename)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    
    # If PDF format, attempt to compile
    if fmt == "pdf":
        try:
            pdf_path = compile_latex(content, base_dir, filename_base)
            print(f"Compiled PDF at: {pdf_path}")
        except Exception as e:
            print(f"PDF Compilation failed: {e}")
        
    return file_path

def save_artifact(job_id, content, fmt, visibility, db_session=None):
    # 1. Save to Mongo
    artifact = {
        "job_id": job_id,
        "content": content,
        "format": fmt,
        "visibility": visibility,
        "created_at": datetime.utcnow()
    }
    result = mongo_db.artifacts.insert_one(artifact)
    
    # 2. Save to Local File (if we have context)
    if db_session:
        job = db_session.query(GenerationJob).filter(GenerationJob.id == job_id).first()
        if job:
            assign = get_assignment(db_session, job.assignment_id)
            if assign:
                course = get_course(db_session, assign.course_id)
                if course:
                    try:
                        local_path = save_local_file(course.title, assign.title, content, fmt)
                        print(f"Saved local file: {local_path}")
                    except Exception as e:
                        print(f"Failed to save local file: {e}")

    return str(result.inserted_id)

def get_artifact_by_job(job_id):
    return mongo_db.artifacts.find_one({"job_id": job_id})
