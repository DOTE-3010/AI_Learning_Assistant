from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class GenerateAnswerRequest(BaseModel):
    assignment_id: int
    output_format: str = "md"
    custom_context: Optional[str] = None

class RequestGuidanceRequest(BaseModel):
    assignment_id: int
    question: Optional[str] = None

class JobStatusResponse(BaseModel):
    status: str
    cost: Optional[float] = None
    output: Optional[str] = None

class CreateCourseRequest(BaseModel):
    title: str
    term: str

class CreateAssignmentRequest(BaseModel):
    course_id: int
    title: str
    instructions: str
    due_at: Optional[datetime] = None

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    confirm_password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

