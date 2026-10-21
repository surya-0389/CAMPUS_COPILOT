"""Schemas export package."""

from app.schemas.question_paper import (
    QuestionPaperBase,
    QuestionPaperCreate,
    QuestionPaperUpdate,
    QuestionPaperResponse,
    QuestionPaperFilterParams,
)
from app.schemas.question import (
    QuestionBase,
    QuestionCreate,
    QuestionResponse,
    QuestionExtractRequest,
)
from app.schemas.solution import (
    SolutionBase,
    SolutionCreate,
    SolutionResponse,
    GenerateSolutionRequest,
)
from app.schemas.assignment import (
    AssignmentBase,
    AssignmentCreate,
    AssignmentResponse,
)
from app.schemas.practice import (
    PracticeStartRequest,
    PracticeAnswerSubmit,
    PracticeSubmitRequest,
    PracticeAttemptResponse,
    SavedQuestionResponse,
    QuestionBankProgressAnalytics,
)

__all__ = [
    "QuestionPaperBase",
    "QuestionPaperCreate",
    "QuestionPaperUpdate",
    "QuestionPaperResponse",
    "QuestionPaperFilterParams",
    "QuestionBase",
    "QuestionCreate",
    "QuestionResponse",
    "QuestionExtractRequest",
    "SolutionBase",
    "SolutionCreate",
    "SolutionResponse",
    "GenerateSolutionRequest",
    "AssignmentBase",
    "AssignmentCreate",
    "AssignmentResponse",
    "PracticeStartRequest",
    "PracticeAnswerSubmit",
    "PracticeSubmitRequest",
    "PracticeAttemptResponse",
    "SavedQuestionResponse",
    "QuestionBankProgressAnalytics",
]
