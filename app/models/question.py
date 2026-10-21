"""Question SQLAlchemy Model."""

import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, index=True)
    question_paper_id = Column(String(64), ForeignKey("question_papers.id", ondelete="CASCADE"), nullable=True, index=True)
    assignment_id = Column(String(64), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=True, index=True)
    subject_id = Column(String(128), nullable=False, index=True)
    topic_id = Column(String(128), nullable=True, index=True)
    question_text = Column(Text, nullable=False)
    question_number = Column(String(16), nullable=True)  # e.g., "1(a)", "Q2"
    marks = Column(Integer, nullable=True)
    question_type = Column(String(32), default="descriptive")  # mcq, descriptive, numerical, coding, short_answer
    difficulty = Column(String(32), default="Medium")  # Easy, Medium, Hard
    extracted_text = Column(Text, nullable=True)
    extraction_status = Column(String(32), default="manual_verified")  # pending, extracted, manual_verified, failed
    options_json = Column(Text, nullable=True)  # JSON serialized options for MCQs
    correct_option = Column(Integer, nullable=True)  # Index for MCQ correct choice
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    paper = relationship("QuestionPaper", back_populates="questions")
    assignment = relationship("Assignment", back_populates="questions")
    solutions = relationship("Solution", back_populates="question", cascade="all, delete-orphan")
    saved_by_students = relationship("SavedQuestion", back_populates="question", cascade="all, delete-orphan")
    practice_answers = relationship("PracticeAnswer", back_populates="question")

    __table_args__ = (
        Index("idx_question_topic", "subject_id", "topic_id", "difficulty"),
    )
