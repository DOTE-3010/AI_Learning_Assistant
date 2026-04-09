from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from backend.core.config import POSTGRES_URL, MONGODB_URL
from backend.models.postgres import Base, GenerationJob, Assignment, User
from datetime import datetime
from bson.objectid import ObjectId

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

# Async wrappers (simulated for now as we use sync drivers, but FastAPI runs them in threadpool)
# For true async we'd use asyncpg and motor, but roadmap had standard drivers in requirements.

def get_assignment(db, assignment_id: int):
    return db.query(Assignment).filter(Assignment.id == assignment_id).first()

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

def save_artifact(job_id, content, fmt, visibility):
    artifact = {
        "job_id": job_id,
        "content": content,
        "format": fmt,
        "visibility": visibility,
        "created_at": datetime.utcnow()
    }
    result = mongo_db.artifacts.insert_one(artifact)
    return str(result.inserted_id)

def get_artifact_by_job(job_id):
    return mongo_db.artifacts.find_one({"job_id": job_id})

