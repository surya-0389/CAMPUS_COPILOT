"""Pydantic schemas for Solution."""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class SolutionBase(BaseModel):
    solution_text: str
    short_answer: Optional[str] = None
    detailed_explanation: Optional[str] = None
    hint_text: Optional[str] = None
    code_snippet: Optional[str] = None
    diagram_description: Optional[str] = None
    solution_type: str = "verified"  # verified, faculty_provided, ai_generated
    explanation_level: str = "detailed"
    source_description: str = "University Official Scheme / Verified Faculty"
    verification_status: str = "verified"
    generated_by_model: Optional[str] = None


class SolutionCreate(SolutionBase):
    question_id: str


class SolutionResponse(SolutionBase):
    id: str
    question_id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GenerateSolutionRequest(BaseModel):
    preferred_level: str = "detailed"  # short, detailed, step_by_step
    include_code: bool = True
    include_diagram: bool = True
    custom_context: Optional[str] = None
