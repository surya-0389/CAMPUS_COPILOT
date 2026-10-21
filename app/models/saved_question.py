"""SavedQuestion SQLAlchemy Model for student bookmarks."""

import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class SavedQuestion(Base):
    __tablename__ = "saved_questions"

    id = Column(String(64), primary_key=True, index=True)
    student_id = Column(String(128), nullable=False, index=True)
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    notes = Column(String(512), nullable=True)  # Personal notes for this question
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    question = relationship("Question", back_populates="saved_by_students")

    __table_args__ = (
        UniqueConstraint("student_id", "question_id", name="uq_student_question_save"),
        Index("idx_saved_student", "student_id", "created_at"),
    )
