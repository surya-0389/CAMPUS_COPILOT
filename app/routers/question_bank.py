"""FastAPI router implementing all Question Bank and Exam Prep endpoints."""

import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.question_paper import QuestionPaper
from app.models.question import Question
from app.models.solution import Solution
from app.models.assignment import Assignment
from app.models.practice_attempt import PracticeAttempt, PracticeAnswer
from app.models.saved_question import SavedQuestion

from app.schemas.question_paper import (
    QuestionPaperCreate,
    QuestionPaperUpdate,
    QuestionPaperResponse,
)
from app.schemas.question import (
    QuestionCreate,
    QuestionResponse,
    QuestionExtractRequest,
)
from app.schemas.solution import (
    SolutionResponse,
    GenerateSolutionRequest,
)
from app.schemas.assignment import (
    AssignmentCreate,
    AssignmentResponse,
)
from app.schemas.practice import (
    PracticeStartRequest,
    PracticeSubmitRequest,
    PracticeAttemptResponse,
    SavedQuestionResponse,
    QuestionBankProgressAnalytics,
)

from app.services.question_search_service import QuestionSearchService
from app.services.question_extraction_service import QuestionExtractionService
from app.services.solution_service import SolutionService
from app.services.practice_service import PracticeService
from app.services.question_analytics_service import QuestionAnalyticsService

router = APIRouter(tags=["Question Bank"])


# ============================================================================
# QUESTION PAPERS ENDPOINTS
# ============================================================================

@router.get("/api/question-bank/papers", response_model=List[QuestionPaperResponse])
def get_papers(
    university: Optional[str] = None,
    college: Optional[str] = None,
    course: Optional[str] = None,
    branch: Optional[str] = None,
    semester: Optional[str] = None,
    subject_id: Optional[str] = None,
    academic_year: Optional[str] = None,
    exam_category: Optional[str] = None,
    exam_session: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Browse and filter question papers by category (PYQ, Internal Test, Mid-Term, Practice)."""
    papers = QuestionSearchService.filter_papers(
        db=db,
        university=university,
        college=college,
        course=course,
        branch=branch,
        semester=semester,
        subject_id=subject_id,
        academic_year=academic_year,
        exam_category=exam_category,
        exam_session=exam_session,
        skip=skip,
        limit=limit
    )

    results = []
    for p in papers:
        q_count = len(p.questions)
        has_sol = any(len(q.solutions) > 0 for q in p.questions)
        item = QuestionPaperResponse.from_orm(p)
        item.question_count = q_count
        item.solution_available = has_sol
        results.append(item)
    return results


@router.get("/api/question-bank/papers/{paper_id}", response_model=QuestionPaperResponse)
def get_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail=f"Question paper {paper_id} not found")
    resp = QuestionPaperResponse.from_orm(paper)
    resp.question_count = len(paper.questions)
    resp.solution_available = any(len(q.solutions) > 0 for q in paper.questions)
    return resp


@router.post("/api/question-bank/papers", response_model=QuestionPaperResponse, status_code=status.HTTP_201_CREATED)
def create_paper(data: QuestionPaperCreate, db: Session = Depends(get_db)):
    paper_id = f"qp-{uuid.uuid4().hex[:8]}"
    paper = QuestionPaper(
        id=paper_id,
        university_name=data.university_name,
        college_name=data.college_name,
        course=data.course,
        branch=data.branch,
        semester=data.semester,
        subject_id=data.subject_id,
        title=data.title,
        exam_category=data.exam_category,
        exam_session=data.exam_session,
        academic_year=data.academic_year,
        exam_date=data.exam_date,
        total_marks=data.total_marks,
        duration_minutes=data.duration_minutes,
        file_path=data.file_path,
        source_description=data.source_description,
        verification_status=data.verification_status,
        uploaded_by=data.uploaded_by,
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)
    return QuestionPaperResponse.from_orm(paper)


@router.patch("/api/question-bank/papers/{paper_id}", response_model=QuestionPaperResponse)
def update_paper(paper_id: str, data: QuestionPaperUpdate, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    for key, value in data.dict(exclude_unset=True).items():
        setattr(paper, key, value)
    db.commit()
    db.refresh(paper)
    return QuestionPaperResponse.from_orm(paper)


@router.get("/api/question-bank/papers/{paper_id}/questions", response_model=List[QuestionResponse])
def get_paper_questions(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    results = []
    for q in paper.questions:
        item = QuestionResponse.from_orm(q)
        item.has_solution = len(q.solutions) > 0
        results.append(item)
    return results


# ============================================================================
# SOLUTIONS & QUESTIONS
# ============================================================================

@router.get("/api/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: str, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    resp = QuestionResponse.from_orm(q)
    resp.has_solution = len(q.solutions) > 0
    return resp


@router.get("/api/questions/{question_id}/solution", response_model=SolutionResponse)
def get_question_solution(question_id: str, db: Session = Depends(get_db)):
    sol = db.query(Solution).filter(Solution.question_id == question_id).first()
    if not sol:
        # Fallback to AI generation
        q = db.query(Question).filter(Question.id == question_id).first()
        if not q:
            raise HTTPException(status_code=404, detail="Question not found")
        generated = SolutionService.generate_solution_for_question(q.question_text, q.subject_id, q.topic_id or "")
        new_sol = Solution(
            id=generated["id"],
            question_id=question_id,
            solution_text=generated["solution_text"],
            short_answer=generated["short_answer"],
            detailed_explanation=generated["detailed_explanation"],
            hint_text=generated["hint_text"],
            code_snippet=generated["code_snippet"],
            diagram_description=generated["diagram_description"],
            solution_type="ai_generated",
            verification_status="ai_provisional",
            generated_by_model="gemini-3.8-flash"
        )
        db.add(new_sol)
        db.commit()
        db.refresh(new_sol)
        return SolutionResponse.from_orm(new_sol)
    return SolutionResponse.from_orm(sol)


@router.post("/api/questions/{question_id}/generate-solution", response_model=SolutionResponse)
def generate_ai_solution(question_id: str, req: GenerateSolutionRequest, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    generated = SolutionService.generate_solution_for_question(q.question_text, q.subject_id, q.topic_id or "")
    sol_id = f"sol-{uuid.uuid4().hex[:8]}"
    sol = Solution(
        id=sol_id,
        question_id=question_id,
        solution_text=generated["solution_text"],
        short_answer=generated["short_answer"],
        detailed_explanation=generated["detailed_explanation"],
        hint_text=generated["hint_text"],
        code_snippet=generated["code_snippet"],
        diagram_description=generated["diagram_description"],
        solution_type="ai_generated",
        explanation_level=req.preferred_level,
        verification_status="ai_provisional",
        generated_by_model="gemini-3.8-flash"
    )
    db.add(sol)
    db.commit()
    db.refresh(sol)
    return SolutionResponse.from_orm(sol)


# ============================================================================
# ASSIGNMENTS
# ============================================================================

@router.get("/api/question-bank/assignments", response_model=List[AssignmentResponse])
def get_assignments(
    subject_id: Optional[str] = None,
    semester: Optional[str] = None,
    academic_year: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Assignment)
    if subject_id:
        query = query.filter(Assignment.subject_id.ilike(f"%{subject_id}%"))
    if semester:
        query = query.filter(Assignment.semester.ilike(f"%{semester}%"))
    if academic_year:
        query = query.filter(Assignment.academic_year == academic_year)

    assignments = query.all()
    results = []
    for a in assignments:
        resp = AssignmentResponse.from_orm(a)
        resp.question_count = len(a.questions)
        results.append(resp)
    return results


@router.get("/api/question-bank/assignments/{assignment_id}", response_model=AssignmentResponse)
def get_assignment(assignment_id: str, db: Session = Depends(get_db)):
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    resp = AssignmentResponse.from_orm(a)
    resp.question_count = len(a.questions)
    resp.questions = [QuestionResponse.from_orm(q) for q in a.questions]
    return resp


@router.post("/api/question-bank/assignments", response_model=AssignmentResponse, status_code=status.HTTP_201_CREATED)
def create_assignment(data: AssignmentCreate, db: Session = Depends(get_db)):
    a_id = f"asgn-{uuid.uuid4().hex[:8]}"
    assign = Assignment(
        id=a_id,
        subject_id=data.subject_id,
        semester=data.semester,
        title=data.title,
        assignment_number=data.assignment_number,
        description=data.description,
        academic_year=data.academic_year,
        max_marks=data.max_marks,
        due_date=data.due_date,
        file_storage_key=data.file_storage_key,
        reference_material=data.reference_material,
        uploaded_by=data.uploaded_by,
        visibility=data.visibility,
        verification_status=data.verification_status,
    )
    db.add(assign)
    db.commit()
    db.refresh(assign)
    return AssignmentResponse.from_orm(assign)


@router.get("/api/question-bank/assignments/{assignment_id}/questions", response_model=List[QuestionResponse])
def get_assignment_questions(assignment_id: str, db: Session = Depends(get_db)):
    a = db.query(Assignment).filter(Assignment.id == assignment_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return [QuestionResponse.from_orm(q) for q in a.questions]


# ============================================================================
# QUESTION EXTRACTION
# ============================================================================

@router.post("/api/question-bank/papers/{paper_id}/extract-questions")
def extract_questions_for_paper(paper_id: str, req: QuestionExtractRequest, db: Session = Depends(get_db)):
    paper = db.query(QuestionPaper).filter(QuestionPaper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    text = req.raw_text or paper.title
    extracted = QuestionExtractionService.extract_questions_from_text(text, paper.subject_id)

    created_questions = []
    for item in extracted:
        q = Question(
            id=item["id"],
            question_paper_id=paper_id,
            subject_id=item["subject_id"],
            topic_id=item["topic_id"],
            question_text=item["question_text"],
            question_number=item["question_number"],
            marks=item["marks"],
            question_type=item["question_type"],
            difficulty=item["difficulty"],
            extraction_status=item["extraction_status"],
        )
        db.add(q)
        created_questions.append(q)

    db.commit()
    return {"extracted_count": len(created_questions), "paper_id": paper_id}


# ============================================================================
# PRACTICE & MOCK EXAMS
# ============================================================================

@router.post("/api/question-bank/practice/start", response_model=PracticeAttemptResponse)
def start_practice(data: PracticeStartRequest, db: Session = Depends(get_db)):
    attempt = PracticeService.start_practice(
        db=db,
        student_id=data.student_id,
        subject_id=data.subject_id,
        question_paper_id=data.question_paper_id,
        practice_mode=data.practice_mode,
        question_limit=data.question_limit or 10
    )
    return PracticeAttemptResponse.from_orm(attempt)


@router.get("/api/question-bank/practice/{attempt_id}", response_model=PracticeAttemptResponse)
def get_practice_attempt(attempt_id: str, db: Session = Depends(get_db)):
    att = db.query(PracticeAttempt).filter(PracticeAttempt.id == attempt_id).first()
    if not att:
        raise HTTPException(status_code=404, detail="Attempt not found")
    return PracticeAttemptResponse.from_orm(att)


@router.post("/api/question-bank/practice/{attempt_id}/submit", response_model=PracticeAttemptResponse)
def submit_practice(attempt_id: str, req: PracticeSubmitRequest, db: Session = Depends(get_db)):
    try:
        answers_data = [a.dict() for a in req.answers]
        result = PracticeService.submit_practice(db, attempt_id, answers_data)
        return PracticeAttemptResponse.from_orm(result)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ============================================================================
# SAVED QUESTIONS (BOOKMARKS)
# ============================================================================

@router.post("/api/questions/{question_id}/save")
def save_question(question_id: str, student_id: str = "alex_cse_3", notes: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    existing = db.query(SavedQuestion).filter(
        SavedQuestion.student_id == student_id,
        SavedQuestion.question_id == question_id
    ).first()

    if existing:
        return {"status": "already_saved", "id": existing.id}

    saved = SavedQuestion(
        id=f"sq-{uuid.uuid4().hex[:8]}",
        student_id=student_id,
        question_id=question_id,
        notes=notes
    )
    db.add(saved)
    db.commit()
    return {"status": "saved", "id": saved.id}


@router.delete("/api/questions/{question_id}/save")
def remove_saved_question(question_id: str, student_id: str = "alex_cse_3", db: Session = Depends(get_db)):
    existing = db.query(SavedQuestion).filter(
        SavedQuestion.student_id == student_id,
        SavedQuestion.question_id == question_id
    ).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Saved question not found")
    db.delete(existing)
    db.commit()
    return {"status": "removed"}


@router.get("/api/students/{student_id}/saved-questions")
def get_student_saved_questions(student_id: str, db: Session = Depends(get_db)):
    saved = db.query(SavedQuestion).filter(SavedQuestion.student_id == student_id).all()
    results = []
    for s in saved:
        if s.question:
            q_resp = QuestionResponse.from_orm(s.question)
            q_resp.is_saved = True
            q_resp.has_solution = len(s.question.solutions) > 0
            results.append({
                "saved_id": s.id,
                "notes": s.notes,
                "created_at": s.created_at,
                "question": q_resp
            })
    return results


# ============================================================================
# ANALYTICS & WEAK TOPIC RECOMMENDATIONS
# ============================================================================

@router.get("/api/students/{student_id}/question-bank/progress")
def get_progress_analytics(student_id: str, db: Session = Depends(get_db)):
    return QuestionAnalyticsService.get_student_analytics(db, student_id)


@router.get("/api/students/{student_id}/question-bank/weak-topics")
def get_weak_topics(student_id: str, db: Session = Depends(get_db)):
    data = QuestionAnalyticsService.get_student_analytics(db, student_id)
    return {
        "student_id": student_id,
        "weak_topics": data["weak_topics"],
        "mentor_recommendation": data["mentor_recommendation"],
        "recommended_pyqs": data["recommended_pyqs"]
    }


@router.get("/api/students/{student_id}/question-bank/repeated-questions")
def get_repeated_questions(student_id: str, subject_id: str = "Database Management Systems", db: Session = Depends(get_db)):
    return QuestionSearchService.find_repeated_questions(db, subject_id)
