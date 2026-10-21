"""Pydantic schemas for Assignment."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from app.schemas.question import QuestionResponse


class AssignmentBase(BaseModel):
    subject_id: str
    semester: str
    title: str
    assignment_number: int = 1
    description: str
    academic_year: str
    max_marks: Optional[int] = None
    due_date: Optional[str] = None
    reference_material: Optional[str] = None
    uploaded_by: str = "Faculty"
    visibility: str = "public"
    verification_status: str = "verified"


class AssignmentCreate(AssignmentBase):
    file_storage_key: Optional[str] = None


class AssignmentResponse(AssignmentBase):
    id: str
    file_storage_key: Optional[str] = None
    question_count: int = 0
    questions: Optional[List[QuestionResponse]] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
