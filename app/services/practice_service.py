import uuid
import datetime
from typing import List, Dict, Any, Optional

try:
    from sqlalchemy.orm import Session
    from app.models.practice_attempt import PracticeAttempt, PracticeAnswer
    from app.models.question import Question
except ImportError:
    Session = Any  # type: ignore
    PracticeAttempt = None  # type: ignore
    PracticeAnswer = None  # type: ignore
    Question = None  # type: ignore


class PracticeService:
    @staticmethod
    def start_practice(
        db: Session,
        student_id: str,
        subject_id: Optional[str] = "Database Management Systems",
        question_paper_id: Optional[str] = None,
        practice_mode: str = "practice",
        question_limit: int = 10
    ) -> PracticeAttempt:
        attempt_id = f"att-{uuid.uuid4().hex[:8]}"

        # Count questions
        query = db.query(Question)
        if question_paper_id:
            query = query.filter(Question.question_paper_id == question_paper_id)
        elif subject_id:
            query = query.filter(Question.subject_id.ilike(f"%{subject_id}%"))

        questions = query.limit(question_limit).all()

        attempt = PracticeAttempt(
            id=attempt_id,
            student_id=student_id,
            question_paper_id=question_paper_id,
            subject_id=subject_id,
            practice_mode=practice_mode,
            started_at=datetime.datetime.utcnow(),
            total_questions=len(questions),
            correct_answers=0,
            status="in_progress"
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return attempt

    @staticmethod
    def submit_practice(
        db: Session,
        attempt_id: str,
        answers: List[Dict[str, Any]]
    ) -> PracticeAttempt:
        attempt = db.query(PracticeAttempt).filter(PracticeAttempt.id == attempt_id).first()
        if not attempt:
            raise ValueError(f"Attempt {attempt_id} not found")

        correct_count = 0
        total_time = 0

        for ans in answers:
            q_id = ans.get("question_id")
            selected_opt = ans.get("selected_option")
            ans_text = ans.get("answer_text", "")
            time_spent = ans.get("time_spent_seconds", 0)
            total_time += time_spent

            question = db.query(Question).filter(Question.id == q_id).first()
            is_correct = False
            feedback = ""

            if question:
                # If MCQ
                if question.correct_option is not None:
                    is_correct = (selected_opt == question.correct_option)
                    feedback = "Correct selection" if is_correct else f"Incorrect. Correct option was {question.correct_option + 1}"
                else:
                    # Descriptive length / keyword check
                    is_correct = len(ans_text.strip().split()) >= 15
                    feedback = "Answer submitted for academic review"

            if is_correct:
                correct_count += 1

            p_ans = PracticeAnswer(
                id=f"pa-{uuid.uuid4().hex[:8]}",
                attempt_id=attempt_id,
                question_id=q_id,
                answer_text=ans_text,
                selected_option=selected_opt,
                is_correct=is_correct,
                time_spent_seconds=time_spent,
                evaluated_by="auto_grader",
                evaluation_feedback=feedback
            )
            db.add(p_ans)

        attempt.submitted_at = datetime.datetime.utcnow()
        attempt.status = "completed"
        attempt.correct_answers = correct_count
        attempt.time_spent_seconds = total_time
        attempt.score_percentage = (correct_count / attempt.total_questions * 100) if attempt.total_questions > 0 else 0.0

        db.commit()
        db.refresh(attempt)
        return attempt
