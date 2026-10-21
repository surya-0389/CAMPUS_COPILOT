"""Pydantic schemas for Practice and Mock Exams."""

from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel


class PracticeStartRequest(BaseModel):
    student_id: str
    subject_id: Optional[str] = None
    question_paper_id: Optional[str] = None
    practice_mode: str = "practice"  # practice or mock_exam
    duration_minutes: Optional[int] = 60
    topic_id: Optional[str] = None
    question_limit: Optional[int] = 10


class PracticeAnswerSubmit(BaseModel):
    question_id: str
    answer_text: Optional[str] = None
    selected_option: Optional[int] = None
    time_spent_seconds: int = 0


class PracticeSubmitRequest(BaseModel):
    answers: List[PracticeAnswerSubmit]


class PracticeAttemptResponse(BaseModel):
    id: str
    student_id: str
    question_paper_id: Optional[str] = None
    practice_mode: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    total_questions: int
    correct_answers: int
    score_percentage: Optional[float] = None
    time_spent_seconds: int
    status: str
    subject_id: Optional[str] = None

    class Config:
        from_attributes = True


class SavedQuestionResponse(BaseModel):
    id: str
    student_id: str
    question_id: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class QuestionBankProgressAnalytics(BaseModel):
    student_id: str
    total_attempts: int
    total_questions_practiced: int
    total_correct: int
    overall_accuracy_percentage: float
    subject_performance: Dict[str, Any]
    topic_breakdown: Dict[str, Any]
    weak_topics: List[str]
    strong_topics: List[str]
    recommended_pyqs: List[Dict[str, Any]]
    repeated_questions: List[Dict[str, Any]]
