"""Seed database with realistic university PYQs, tests, assignments, questions, and solutions."""

from app.database import Base, engine, SessionLocal
from app.models.question_paper import QuestionPaper
from app.models.question import Question
from app.models.solution import Solution
from app.models.assignment import Assignment
from app.models.saved_question import SavedQuestion
from app.models.practice_attempt import PracticeAttempt, PracticeAnswer


def init_and_seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(QuestionPaper).first():
        db.close()
        return  # Already seeded

    # 1. UNIVERSITY PYQs
    pyq1 = QuestionPaper(
        id="pyq-dbms-2024",
        university_name="State Technological University",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Database Management Systems",
        title="DBMS University Mid-Term Examination (Fall 2024)",
        exam_category="pyq",
        exam_session="Fall Regular",
        academic_year="2024-2025",
        exam_date="2024-10-22",
        total_marks=50,
        duration_minutes=120,
        source_description="University Exam Cell Archive (Ref: EX-2024/CS301)",
        verification_status="verified",
        uploaded_by="Department of CSE"
    )

    pyq2 = QuestionPaper(
        id="pyq-dbms-2023",
        university_name="State Technological University",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Database Management Systems",
        title="DBMS End-Semester University Exam (Spring 2023)",
        exam_category="pyq",
        exam_session="Spring Regular",
        academic_year="2023-2024",
        exam_date="2023-05-18",
        total_marks=100,
        duration_minutes=180,
        source_description="Official State University Question Repository",
        verification_status="verified",
        uploaded_by="University Controller"
    )

    pyq3 = QuestionPaper(
        id="pyq-os-2024",
        university_name="State Technological University",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Operating Systems",
        title="Operating Systems University Mid-Term Examination (Fall 2024)",
        exam_category="pyq",
        exam_session="Fall Regular",
        academic_year="2024-2025",
        exam_date="2024-10-25",
        total_marks=50,
        duration_minutes=120,
        source_description="CSE Department Archive",
        verification_status="verified",
        uploaded_by="Faculty Coordinator"
    )

    # 2. INTERNAL CLASS TESTS
    ct1 = QuestionPaper(
        id="ct-dbms-1",
        university_name="Apex Institute of Science & Technology",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Database Management Systems",
        title="Class Test 1: ER Modeling & Relational Algebra",
        exam_category="internal_test",
        exam_session="Internal Assessment 1",
        academic_year="2026-2027",
        exam_date="2026-09-12",
        total_marks=20,
        duration_minutes=45,
        source_description="Uploaded by Prof. Ananya Roy (Course Instructor)",
        verification_status="verified",
        uploaded_by="Prof. Ananya Roy"
    )

    ct2 = QuestionPaper(
        id="ct-dbms-2",
        university_name="Apex Institute of Science & Technology",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Database Management Systems",
        title="Class Test 2: Normalization (1NF to BCNF)",
        exam_category="internal_test",
        exam_session="Internal Assessment 2",
        academic_year="2026-2027",
        exam_date="2026-10-04",
        total_marks=20,
        duration_minutes=45,
        source_description="Uploaded by Prof. Ananya Roy with Official Marking Scheme",
        verification_status="verified",
        uploaded_by="Prof. Ananya Roy"
    )

    # 3. MID-TERM EXAMINATIONS
    mid1 = QuestionPaper(
        id="mid-dbms-2025",
        university_name="Apex Institute of Science & Technology",
        college_name="Apex Institute of Science & Technology",
        course="B.Tech",
        branch="Computer Science & Engineering",
        semester="3rd Semester",
        subject_id="Database Management Systems",
        title="Mid-Term Examination 2025: DBMS Units 1-3",
        exam_category="mid_term",
        exam_session="Mid-Term",
        academic_year="2025-2026",
        exam_date="2025-10-21",
        total_marks=30,
        duration_minutes=90,
        source_description="Official College Exam Cell",
        verification_status="verified",
        uploaded_by="Exam Cell Coordinator"
    )

    db.add_all([pyq1, pyq2, pyq3, ct1, ct2, mid1])
    db.commit()

    # 4. QUESTIONS & SOLUTIONS
    # Question 1: 2NF Partial Dependency
    q1 = Question(
        id="q-dbms-101",
        question_paper_id="pyq-dbms-2024",
        subject_id="Database Management Systems",
        topic_id="Normalization",
        question_number="1(a)",
        marks=5,
        question_type="descriptive",
        difficulty="Medium",
        question_text="Define Second Normal Form (2NF). Given a relation R(A, B, C, D) with candidate key AB and functional dependency B -> C, state with reasons whether R is in 2NF."
    )

    sol1 = Solution(
        id="sol-101",
        question_id="q-dbms-101",
        solution_text=(
            "### Step-by-Step Verified Solution:\n\n"
            "**1. Definition of 2NF:**\n"
            "A relation R is in Second Normal Form (2NF) if and only if:\n"
            "- It is in First Normal Form (1NF), meaning all attribute values are atomic.\n"
            "- Every non-prime attribute is fully functionally dependent on every candidate key (no partial dependencies allowed).\n\n"
            "**2. Analysis of Relation R(A, B, C, D):**\n"
            "- Candidate Key: $AB$\n"
            "- Prime attributes: $A, B$\n"
            "- Non-prime attributes: $C, D$\n"
            "- Given FD: $B \\to C$\n\n"
            "**3. Evaluation:**\n"
            "Here, $B$ is a proper subset of candidate key $AB$. The FD $B \\to C$ implies non-prime attribute $C$ depends only on a part of the candidate key ($B$).\n"
            "This is a **partial dependency**, which directly violates 2NF.\n\n"
            "**Conclusion:** Relation R is NOT in 2NF. To decompose into 2NF, split into $R_1(B, C)$ with key $B$ and $R_2(A, B, D)$ with key $AB$."
        ),
        short_answer="R is NOT in 2NF because B -> C is a partial dependency (non-prime attribute C depends on a proper subset of candidate key AB).",
        hint_text="Check whether attribute B is a full candidate key or a proper subset of candidate key AB.",
        solution_type="verified",
        explanation_level="step_by_step",
        source_description="State University Model Answer Key Fall 2024",
        verification_status="verified"
    )

    # Question 2: 3NF vs BCNF
    q2 = Question(
        id="q-dbms-102",
        question_paper_id="pyq-dbms-2024",
        subject_id="Database Management Systems",
        topic_id="Normalization",
        question_number="2(b)",
        marks=10,
        question_type="descriptive",
        difficulty="Hard",
        question_text="Compare and contrast 3NF and BCNF. Explain why a relation can be in 3NF without being in BCNF. Can dependency preservation always be achieved in BCNF decomposition?"
    )

    sol2 = Solution(
        id="sol-102",
        question_id="q-dbms-102",
        solution_text=(
            "### Step-by-Step Verified Solution:\n\n"
            "**1. Formal Criteria:**\n"
            "For every non-trivial functional dependency $X \\to A$:\n"
            "- In **3NF**: $X$ is a superkey OR $A$ is a prime attribute.\n"
            "- In **BCNF**: $X$ MUST strictly be a superkey (no exceptions).\n\n"
            "**2. Why a relation can be in 3NF but not BCNF:**\n"
            "If an FD $X \\to A$ exists where $X$ is not a superkey, but $A$ is a prime attribute, 3NF allows it under the prime attribute exception, but BCNF strictly forbids it.\n\n"
            "**3. Dependency Preservation in BCNF:**\n"
            "**No**, dependency preservation is NOT always guaranteed during BCNF decomposition. For relations with overlapping candidate keys, decomposing to satisfy BCNF may result in dependencies that cannot be checked without computing a join."
        ),
        short_answer="3NF allows X -> A if A is prime; BCNF strictly requires X to be a superkey. BCNF cannot always preserve dependencies.",
        hint_text="Remember the prime attribute exception that 3NF allows for overlapping keys.",
        solution_type="verified",
        explanation_level="detailed",
        source_description="Verified Faculty Answer Key",
        verification_status="verified"
    )

    # Question 3: ACID & WAL
    q3 = Question(
        id="q-dbms-103",
        question_paper_id="pyq-dbms-2023",
        subject_id="Database Management Systems",
        topic_id="Transactions & Concurrency",
        question_number="3(a)",
        marks=8,
        question_type="descriptive",
        difficulty="Medium",
        question_text="Explain the ACID properties of database transactions. How does the Write-Ahead Logging (WAL) protocol guarantee Atomicity and Durability during system failures?"
    )

    # Question 4: Conflict Serializability
    q4 = Question(
        id="q-dbms-104",
        question_paper_id="ct-dbms-2",
        subject_id="Database Management Systems",
        topic_id="Transactions & Concurrency",
        question_number="Q1",
        marks=5,
        question_type="numerical",
        difficulty="Medium",
        question_text="Given schedule S: r1(X); r2(Y); w1(X); r2(X); w2(Y); commit1; commit2. Construct the precedence graph and determine if S is conflict serializable."
    )

    # Question 5: MCQ on 1NF
    q5 = Question(
        id="q-dbms-105",
        question_paper_id="mid-dbms-2025",
        subject_id="Database Management Systems",
        topic_id="Normalization",
        question_number="M1",
        marks=2,
        question_type="mcq",
        difficulty="Easy",
        question_text="Which normal form is specifically violated if an attribute contains a comma-separated list of telephone numbers?",
        options_json='["1NF", "2NF", "3NF", "BCNF"]',
        correct_option=0
    )

    db.add_all([q1, q2, q3, q4, q5])
    db.add_all([sol1, sol2])
    db.commit()

    # 5. ASSIGNMENTS
    asgn1 = Assignment(
        id="asgn-dbms-1",
        subject_id="Database Management Systems",
        semester="3rd Semester",
        title="Assignment 1: Relational Schema Normalization & Synthesis",
        assignment_number=1,
        description="Deconstruct unnormalized university registration tables into BCNF schemas. Verify dependency preservation and compute canonical covers.",
        academic_year="2026-2027",
        max_marks=25,
        due_date="2026-10-25",
        reference_material="Korth Chapter 7: Relational Database Design",
        uploaded_by="Prof. Ananya Roy",
        visibility="public",
        verification_status="verified"
    )

    asgn2 = Assignment(
        id="asgn-dbms-2",
        subject_id="Database Management Systems",
        semester="3rd Semester",
        title="Assignment 2: Concurrency Control Schedules & 2PL Locks",
        assignment_number=2,
        description="Graph cycle analysis on concurrent interleavings and strict two-phase locking simulations.",
        academic_year="2026-2027",
        max_marks=20,
        due_date="2026-11-05",
        reference_material="Ramakrishnan Chapter 16: Transaction Management",
        uploaded_by="Prof. Ananya Roy",
        visibility="public",
        verification_status="verified"
    )

    db.add_all([asgn1, asgn2])
    db.commit()

    # 6. SAVED QUESTION (Alex has saved q-dbms-102 for revision)
    sq1 = SavedQuestion(
        id="sq-alex-1",
        student_id="alex_cse_3",
        question_id="q-dbms-102",
        notes="High-probability 10-mark question for upcoming DBMS Mid-Term. Review BCNF dependency preservation proof."
    )
    db.add(sq1)
    db.commit()

    # 7. INITIAL PRACTICE ATTEMPT (Showing 40% accuracy on Normalization)
    att1 = PracticeAttempt(
        id="att-alex-init",
        student_id="alex_cse_3",
        question_paper_id="pyq-dbms-2024",
        subject_id="Database Management Systems",
        practice_mode="practice",
        total_questions=5,
        correct_answers=2,
        score_percentage=40.0,
        time_spent_seconds=420,
        status="completed"
    )
    db.add(att1)
    db.commit()

    db.close()


if __name__ == "__main__":
    init_and_seed_db()
    print("Database successfully initialized and seeded with university question bank records.")
