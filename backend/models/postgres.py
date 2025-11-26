from sqlalchemy import Column, Integer, String, DateTime, JSON, ARRAY, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    course_ids = Column(ARRAY(Integer))
    created_at = Column(DateTime, default=datetime.utcnow)
    password_hash = Column(String, nullable=True) # Added for real auth demo

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    term = Column(String)
    teacher_email = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer)
    title = Column(String)
    instructions = Column(String)
    due_at = Column(DateTime)
    guidance_policy = Column(JSON)
    output_formats = Column(ARRAY(String))
    created_at = Column(DateTime, default=datetime.utcnow)

class GenerationJob(Base):
    __tablename__ = "generation_jobs"
    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer)
    requested_by_email = Column(String)
    role = Column(String)
    model_config = Column(JSON)  # Renamed from model_config to avoid conflict if any, but model_config is fine
    status = Column(String)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    cost_estimate = Column(Float)

class AuditEvent(Base):
    __tablename__ = "audit_events"
    id = Column(Integer, primary_key=True, index=True)
    actor_email = Column(String)
    action = Column(String)
    resource_type = Column(String)
    resource_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_info = Column(JSON)  # 'metadata' is reserved in Base

