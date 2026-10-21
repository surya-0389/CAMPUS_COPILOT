"""QuestionPaper SQLAlchemy Model."""

import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Index
from sqlalchemy.orm import relationship
from app.database import Base


class QuestionPaper(Base):
    __tablename__ = "question_papers"

    id = Column(String(64), primary_key=True, index=True)
    university_name = Column(String(255), nullable=False, index=True)
    college_name = Column(String(255), nullable=True, index=True)
    course = Column(String(128), nullable=False, index=True)
    branch = Column(String(128), nullable=False, index=True)
    semester = Column(String(32), nullable=False, index=True)
    subject_id = Column(String(128), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    exam_category = Column(String(64), nullable=False, index=True)  # pyq, internal_test, mid_term, practice
    exam_session = Column(String(64), nullable=False)  # Fall, Spring, Winter, Regular, Supplementary
    academic_year = Column(String(32), nullable=False, index=True)  # e.g., 2024-2025
    exam_date = Column(String(32), nullable=True)
    total_marks = Column(Integer, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    file_path = Column(String(512), nullable=True)
    source_description = Column(String(255), nullable=False, default="Faculty / Department Upload")
    verification_status = Column(String(32), nullable=False, default="verified")  # verified, unverified, under_review
    uploaded_by = Column(String(128), nullable=False, default="admin")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    questions = relationship("Question", back_populates="paper", cascade="all, delete-orphan")
    practice_attempts = relationship("PracticeAttempt", back_populates="paper")

    __table_args__ = (
        Index("idx_paper_search", "subject_id", "semester", "exam_category", "academic_year"),
    )
