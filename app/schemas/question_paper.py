"""Pydantic schemas for QuestionPaper."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class QuestionPaperBase(BaseModel):
    university_name: str
    college_name: Optional[str] = None
    course: str
    branch: str
    semester: str
    subject_id: str
    title: str
    exam_category: str = Field(..., description="pyq, internal_test, mid_term, practice")
    exam_session: str
    academic_year: str
    exam_date: Optional[str] = None
    total_marks: Optional[int] = None
    duration_minutes: Optional[int] = None
    source_description: str = "Faculty / Department Upload"
    verification_status: str = "verified"


class QuestionPaperCreate(QuestionPaperBase):
    file_path: Optional[str] = None
    uploaded_by: str = "faculty"


class QuestionPaperUpdate(BaseModel):
    title: Optional[str] = None
    total_marks: Optional[int] = None
    duration_minutes: Optional[int] = None
    source_description: Optional[str] = None
    verification_status: Optional[str] = None


class QuestionPaperResponse(QuestionPaperBase):
    id: str
    file_path: Optional[str] = None
    uploaded_by: str
    question_count: Optional[int] = 0
    solution_available: Optional[bool] = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestionPaperFilterParams(BaseModel):
    university: Optional[str] = None
    college: Optional[str] = None
    course: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[str] = None
    subject_id: Optional[str] = None
    academic_year: Optional[str] = None
    exam_category: Optional[str] = None
    exam_session: Optional[str] = None
    page: int = 1
    page_size: int = 20
