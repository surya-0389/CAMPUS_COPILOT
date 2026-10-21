"""PracticeAttempt and PracticeAnswer SQLAlchemy Models."""

import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(String(64), primary_key=True, index=True)
    student_id = Column(String(128), nullable=False, index=True)
    question_paper_id = Column(String(64), ForeignKey("question_papers.id", ondelete="SET NULL"), nullable=True, index=True)
    practice_mode = Column(String(32), default="practice")  # practice (untimed, hints), mock_exam (timed, scored)
    started_at = Column(DateTime, default=datetime.datetime.utcnow)
    submitted_at = Column(DateTime, nullable=True)
    total_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    score_percentage = Column(Float, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    status = Column(String(32), default="in_progress")  # in_progress, completed, abandoned
    subject_id = Column(String(128), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    paper = relationship("QuestionPaper", back_populates="practice_attempts")
    answers = relationship("PracticeAnswer", back_populates="attempt", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_attempt_student", "student_id", "status", "created_at"),
    )


class PracticeAnswer(Base):
    __tablename__ = "practice_answers"

    id = Column(String(64), primary_key=True, index=True)
    attempt_id = Column(String(64), ForeignKey("practice_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    answer_text = Column(Text, nullable=True)
    selected_option = Column(Integer, nullable=True)  # For MCQs
    is_correct = Column(Boolean, nullable=True)
    time_spent_seconds = Column(Integer, default=0)
    evaluated_by = Column(String(64), default="auto_grader")  # auto_grader, ai_evaluator, self_rated
    evaluation_feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    attempt = relationship("PracticeAttempt", back_populates="answers")
    question = relationship("Question", back_populates="practice_answers")
