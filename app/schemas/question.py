"""Pydantic schemas for Question."""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel


class QuestionBase(BaseModel):
    subject_id: str
    topic_id: Optional[str] = None
    question_text: str
    question_number: Optional[str] = None
    marks: Optional[int] = None
    question_type: str = "descriptive"  # mcq, descriptive, numerical, coding, short_answer
    difficulty: str = "Medium"
    options: Optional[List[str]] = None
    correct_option: Optional[int] = None


class QuestionCreate(QuestionBase):
    question_paper_id: Optional[str] = None
    assignment_id: Optional[str] = None
    extracted_text: Optional[str] = None
    extraction_status: str = "manual_verified"


class QuestionResponse(QuestionBase):
    id: str
    question_paper_id: Optional[str] = None
    assignment_id: Optional[str] = None
    extraction_status: str
    has_solution: bool = False
    is_saved: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class QuestionExtractRequest(BaseModel):
    raw_text: Optional[str] = None
    detect_marks: bool = True
    split_subparts: bool = True
