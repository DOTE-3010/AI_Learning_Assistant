from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from backend.core.config import POSTGRES_URL, MONGODB_URL
from backend.models.postgres import Base, GenerationJob, Assignment, User, Course
from backend.app.utils import sanitize_filename
from datetime import datetime
from bson.objectid import ObjectId
import os

# Postgres
engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Mongo
mongo_client = MongoClient(MONGODB_URL)
mongo_db = mongo_client["solver42"]

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
    db.commit()
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

def save_local_file(course_title: str, assignment_title: str, content: str, fmt: str) -> str:
    """Save generated content to local filesystem under course/assignment directory"""
    # Sanitize names
    safe_course = sanitize_filename(course_title)
    safe_assign = sanitize_filename(assignment_title)
    
    # Base directory (relative to backend root for demo)
    base_dir = os.path.join(os.getcwd(), "workspace", safe_course, safe_assign)
    os.makedirs(base_dir, exist_ok=True)
    
    # Filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    ext_map = {"md": "md", "pdf": "tex", "py": "py", "ipynb": "ipynb"} # PDF saves as tex source in this demo
    ext = ext_map.get(fmt, "txt")
    filename = f"solution_{timestamp}.{ext}"
    file_path = os.path.join(base_dir, filename)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
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
