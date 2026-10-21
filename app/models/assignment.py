"""Assignment SQLAlchemy Model."""

import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(String(64), primary_key=True, index=True)
    subject_id = Column(String(128), nullable=False, index=True)
    semester = Column(String(32), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    assignment_number = Column(Integer, nullable=False, default=1)
    description = Column(Text, nullable=False)
    academic_year = Column(String(32), nullable=False, index=True)
    max_marks = Column(Integer, nullable=True)
    due_date = Column(String(32), nullable=True)
    file_storage_key = Column(String(512), nullable=True)
    reference_material = Column(Text, nullable=True)
    uploaded_by = Column(String(128), default="Faculty / Department")
    visibility = Column(String(32), default="public")  # public, student_only, faculty_only
    verification_status = Column(String(32), default="verified")  # verified, unverified
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    questions = relationship("Question", back_populates="assignment", cascade="all, delete-orphan")

    __table_args__ = (
        Index("idx_assignment_filter", "subject_id", "semester", "academic_year"),
    )
