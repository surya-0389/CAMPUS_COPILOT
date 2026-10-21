import re
from typing import List, Dict, Any

try:
    from sqlalchemy.orm import Session
    from app.models.question_paper import QuestionPaper
    from app.models.question import Question
except ImportError:
    Session = Any  # type: ignore
    QuestionPaper = None  # type: ignore
    Question = None  # type: ignore


class QuestionSearchService:
    @staticmethod
    def filter_papers(
        db: Session,
        university: str = None,
        college: str = None,
        course: str = None,
        branch: str = None,
        semester: str = None,
        subject_id: str = None,
        academic_year: str = None,
        exam_category: str = None,
        exam_session: str = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[QuestionPaper]:
        query = db.query(QuestionPaper)

        if university:
            query = query.filter(QuestionPaper.university_name.ilike(f"%{university}%"))
        if college:
            query = query.filter(QuestionPaper.college_name.ilike(f"%{college}%"))
        if course:
            query = query.filter(QuestionPaper.course.ilike(f"%{course}%"))
        if branch:
            query = query.filter(QuestionPaper.branch.ilike(f"%{branch}%"))
        if semester:
            query = query.filter(QuestionPaper.semester.ilike(f"%{semester}%"))
        if subject_id:
            query = query.filter(QuestionPaper.subject_id.ilike(f"%{subject_id}%"))
        if academic_year:
            query = query.filter(QuestionPaper.academic_year == academic_year)
        if exam_category:
            query = query.filter(QuestionPaper.exam_category == exam_category)
        if exam_session:
            query = query.filter(QuestionPaper.exam_session.ilike(f"%{exam_session}%"))

        return query.order_by(QuestionPaper.academic_year.desc(), QuestionPaper.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def find_repeated_questions(db: Session, subject_id: str = "Database Management Systems") -> List[Dict[str, Any]]:
        """Identify questions that appear repeatedly in historical university papers.
        
        Uses text normalization and token similarity. Returns exact matching and similar question groups.
        """
        questions = db.query(Question).filter(Question.subject_id.ilike(f"%{subject_id}%")).all()

        repeated_groups = []
        seen = set()

        def normalize(t: str) -> str:
            return re.sub(r'[^a-z0-9 ]', '', t.lower()).strip()

        for i, q1 in enumerate(questions):
            if q1.id in seen:
                continue

            matches = []
            q1_norm = normalize(q1.question_text)
            q1_tokens = set(q1_norm.split())

            for j, q2 in enumerate(questions):
                if i == j:
                    continue
                q2_norm = normalize(q2.question_text)
                q2_tokens = set(q2_norm.split())

                # Jaccard token overlap
                if len(q1_tokens) > 0 and len(q2_tokens) > 0:
                    intersection = len(q1_tokens.intersection(q2_tokens))
                    union = len(q1_tokens.union(q2_tokens))
                    sim = intersection / union if union > 0 else 0

                    if sim > 0.45 or q1_norm in q2_norm or q2_norm in q1_norm:
                        matches.append({
                            "question_id": q2.id,
                            "question_text": q2.question_text,
                            "paper_title": q2.paper.title if q2.paper else "Internal Assessment",
                            "academic_year": q2.paper.academic_year if q2.paper else "2025",
                            "match_type": "Exact Repeat" if sim > 0.85 else "High Similarity Variant"
                        })
                        seen.add(q2.id)

            if matches:
                repeated_groups.append({
                    "primary_question_id": q1.id,
                    "topic": q1.topic_id or "Core Topic",
                    "question_text": q1.question_text,
                    "paper_title": q1.paper.title if q1.paper else "University Exam",
                    "academic_year": q1.paper.academic_year if q1.paper else "2024",
                    "occurrence_count": len(matches) + 1,
                    "historical_occurrences": matches
                })
                seen.add(q1.id)

        return repeated_groups
