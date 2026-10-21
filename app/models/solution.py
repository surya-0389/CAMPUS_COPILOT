"""Solution SQLAlchemy Model."""

import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base


class Solution(Base):
    __tablename__ = "solutions"

    id = Column(String(64), primary_key=True, index=True)
    question_id = Column(String(64), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    solution_text = Column(Text, nullable=False)
    short_answer = Column(Text, nullable=True)  # Concise exam-oriented answer
    detailed_explanation = Column(Text, nullable=True)  # Deep explanation with steps, code, formulas
    hint_text = Column(Text, nullable=True)  # Pedagogical hint for students before revealing solution
    code_snippet = Column(Text, nullable=True)  # Formatted code for programming questions
    diagram_description = Column(Text, nullable=True)  # Truth table, diagram, or circuit description
    solution_type = Column(String(32), default="verified")  # verified, faculty_provided, ai_generated
    explanation_level = Column(String(32), default="detailed")  # short, detailed, step_by_step
    source_description = Column(String(255), default="University Official Scheme / Verified Faculty")
    verification_status = Column(String(32), default="verified")  # verified, unverified, ai_provisional
    generated_by_model = Column(String(64), nullable=True)  # e.g., "gemini-3.8-flash"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    question = relationship("Question", back_populates="solutions")

    __table_args__ = (
        Index("idx_solution_question", "question_id", "solution_type"),
    )
