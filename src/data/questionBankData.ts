import {
  QuestionPaper,
  QuestionBankItem,
  QuestionSolution,
  QuestionAssignment,
  SavedQuestionItem,
  QuestionBankAnalyticsData,
  RepeatedQuestionData,
} from '../types';

export const INITIAL_PAPERS: QuestionPaper[] = [
  {
    id: 'pyq-dbms-2024',
    university_name: 'State Technological University',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'DBMS University Mid-Term Examination (Fall 2024)',
    exam_category: 'pyq',
    exam_session: 'Fall Regular',
    academic_year: '2024-2025',
    exam_date: '2024-10-22',
    total_marks: 50,
    duration_minutes: 120,
    source_description: 'University Exam Cell Archive (Ref: EX-2024/CS301)',
    verification_status: 'verified',
    uploaded_by: 'Department of CSE',
    question_count: 5,
    solution_available: true,
    created_at: '2024-10-23T10:00:00Z',
  },
  {
    id: 'pyq-dbms-2023',
    university_name: 'State Technological University',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'DBMS End-Semester University Exam (Spring 2023)',
    exam_category: 'pyq',
    exam_session: 'Spring Regular',
    academic_year: '2023-2024',
    exam_date: '2023-05-18',
    total_marks: 100,
    duration_minutes: 180,
    source_description: 'Official State University Question Repository',
    verification_status: 'verified',
    uploaded_by: 'University Controller of Examinations',
    question_count: 6,
    solution_available: true,
    created_at: '2023-05-20T10:00:00Z',
  },
  {
    id: 'pyq-os-2024',
    university_name: 'State Technological University',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Operating Systems',
    title: 'Operating Systems University Mid-Term Examination (Fall 2024)',
    exam_category: 'pyq',
    exam_session: 'Fall Regular',
    academic_year: '2024-2025',
    exam_date: '2024-10-25',
    total_marks: 50,
    duration_minutes: 120,
    source_description: 'CSE Department Archive',
    verification_status: 'verified',
    uploaded_by: 'Faculty Coordinator',
    question_count: 4,
    solution_available: true,
    created_at: '2024-10-26T10:00:00Z',
  },
  {
    id: 'ct-dbms-1',
    university_name: 'Apex Institute of Science & Technology',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'Class Test 1: ER Modeling & Relational Algebra',
    exam_category: 'internal_test',
    exam_session: 'Class Test 1',
    academic_year: '2026-2027',
    exam_date: '2026-09-12',
    total_marks: 20,
    duration_minutes: 45,
    source_description: 'Uploaded by Prof. Ananya Roy (Course Instructor)',
    verification_status: 'verified',
    uploaded_by: 'Prof. Ananya Roy',
    question_count: 3,
    solution_available: true,
    created_at: '2026-09-13T09:00:00Z',
  },
  {
    id: 'ct-dbms-2',
    university_name: 'Apex Institute of Science & Technology',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'Class Test 2: Normalization (1NF through BCNF)',
    exam_category: 'internal_test',
    exam_session: 'Class Test 2',
    academic_year: '2026-2027',
    exam_date: '2026-10-04',
    total_marks: 20,
    duration_minutes: 45,
    source_description: 'Uploaded by Prof. Ananya Roy with Official Marking Scheme',
    verification_status: 'verified',
    uploaded_by: 'Prof. Ananya Roy',
    question_count: 3,
    solution_available: true,
    created_at: '2026-10-05T09:00:00Z',
  },
  {
    id: 'mid-dbms-2026',
    university_name: 'Apex Institute of Science & Technology',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'Mid-Term Examination 2026: DBMS Units 1-3 Model Paper',
    exam_category: 'mid_term',
    exam_session: 'Mid Sem Examination',
    academic_year: '2026-2027',
    exam_date: '2026-10-20',
    total_marks: 30,
    duration_minutes: 90,
    source_description: 'Official College Exam Cell & Department Board of Studies',
    verification_status: 'verified',
    uploaded_by: 'Exam Cell Coordinator',
    question_count: 5,
    solution_available: true,
    created_at: '2026-10-08T09:00:00Z',
  },
  {
    id: 'mid-dbms-2025',
    university_name: 'Apex Institute of Science & Technology',
    college_name: 'Apex Institute of Science & Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '3rd Semester',
    subject_id: 'Database Management Systems',
    title: 'Mid-Term Examination 2025: DBMS Units 1-3 Past Paper',
    exam_category: 'mid_term',
    exam_session: 'Mid Sem Examination',
    academic_year: '2025-2026',
    exam_date: '2025-10-21',
    total_marks: 30,
    duration_minutes: 90,
    source_description: 'Official College Exam Cell Archive',
    verification_status: 'verified',
    uploaded_by: 'Exam Cell Coordinator',
    question_count: 4,
    solution_available: true,
    created_at: '2025-10-22T09:00:00Z',
  },
];

export const INITIAL_QUESTIONS: QuestionBankItem[] = [
  {
    id: 'q-dbms-101',
    question_paper_id: 'pyq-dbms-2024',
    subject_id: 'Database Management Systems',
    topic_id: 'Normalization',
    question_number: '1(a)',
    marks: 5,
    question_type: 'descriptive',
    difficulty: 'Medium',
    question_text: 'Define Second Normal Form (2NF). Given relation R(A, B, C, D) with candidate key AB and functional dependency B -> C, state with justification whether R is in 2NF.',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: true,
    created_at: '2024-10-23T10:00:00Z',
  },
  {
    id: 'q-dbms-102',
    question_paper_id: 'pyq-dbms-2024',
    subject_id: 'Database Management Systems',
    topic_id: 'Normalization',
    question_number: '2(b)',
    marks: 10,
    question_type: 'descriptive',
    difficulty: 'Hard',
    question_text: 'Compare and contrast 3NF and BCNF. Explain why a relation can satisfy 3NF without satisfying BCNF. Can functional dependency preservation always be guaranteed in BCNF decomposition? Justify with an example.',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: true,
    created_at: '2024-10-23T10:00:00Z',
  },
  {
    id: 'q-dbms-103',
    question_paper_id: 'pyq-dbms-2024',
    subject_id: 'Database Management Systems',
    topic_id: 'Transactions & Concurrency',
    question_number: '3(a)',
    marks: 8,
    question_type: 'descriptive',
    difficulty: 'Medium',
    question_text: 'Explain the ACID properties of database transactions. How does the Write-Ahead Logging (WAL) protocol guarantee Atomicity and Durability during unanticipated system crashes?',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2024-10-23T10:00:00Z',
  },
  {
    id: 'q-dbms-104',
    question_paper_id: 'pyq-dbms-2024',
    subject_id: 'Database Management Systems',
    topic_id: 'Transactions & Concurrency',
    question_number: '4',
    marks: 10,
    question_type: 'numerical',
    difficulty: 'Medium',
    question_text: 'Consider the concurrent schedule S: r1(X); r2(Y); w1(X); r2(X); w2(Y); commit1; commit2. Construct the precedence (serialization) graph and determine whether S is conflict serializable.',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2024-10-23T10:00:00Z',
  },
  {
    id: 'q-dbms-105',
    question_paper_id: 'pyq-dbms-2024',
    subject_id: 'Database Management Systems',
    topic_id: 'Functional Dependencies',
    question_number: '5',
    marks: 7,
    question_type: 'numerical',
    difficulty: 'Medium',
    question_text: 'Given relation R(A, B, C, D, E) with F = {A -> BC, CD -> E, B -> D, E -> A}. Compute the attribute closure (B)+ and determine all candidate keys of R.',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2024-10-23T10:00:00Z',
  },
  // Repeat question from 2023 Spring
  {
    id: 'q-dbms-201',
    question_paper_id: 'pyq-dbms-2023',
    subject_id: 'Database Management Systems',
    topic_id: 'Normalization',
    question_number: 'Q3',
    marks: 10,
    question_type: 'descriptive',
    difficulty: 'Hard',
    question_text: 'Differentiate between 3NF and BCNF. Provide a schema example that is in 3NF but violates BCNF. Is BCNF decomposition always dependency preserving?',
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2023-05-20T10:00:00Z',
  },
  // Class test question (MCQ)
  {
    id: 'q-dbms-301',
    question_paper_id: 'mid-dbms-2026',
    subject_id: 'Database Management Systems',
    topic_id: 'Normalization',
    question_number: 'M1',
    marks: 2,
    question_type: 'mcq',
    difficulty: 'Easy',
    question_text: 'Which normal form is specifically violated if a table contains a non-atomic attribute such as a comma-separated list of hobbies or phone numbers?',
    options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
    correct_option: 0,
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2026-10-08T09:00:00Z',
  },
  {
    id: 'q-dbms-302',
    question_paper_id: 'mid-dbms-2026',
    subject_id: 'Database Management Systems',
    topic_id: 'Normalization',
    question_number: 'M2',
    marks: 3,
    question_type: 'mcq',
    difficulty: 'Medium',
    question_text: 'In relation R(X, Y, Z) with candidate key XY and dependency X -> Z, what condition is violated that prevents R from being in 2NF?',
    options: ['Z transitively depends on X', 'Z is partially dependent on candidate key XY', 'X is a prime attribute', 'XY is not a minimal superkey'],
    correct_option: 1,
    extraction_status: 'manual_verified',
    has_solution: true,
    is_saved: false,
    created_at: '2026-10-08T09:00:00Z',
  },
];

export const INITIAL_SOLUTIONS: Record<string, QuestionSolution> = {
  'q-dbms-101': {
    id: 'sol-101',
    question_id: 'q-dbms-101',
    solution_text: `### Step-by-Step Verified Solution:

**1. Definition of 2NF:**
A relation R is in Second Normal Form (2NF) if and only if:
- It is in First Normal Form (1NF), meaning all attribute values are atomic.
- Every non-prime attribute is fully functionally dependent on every candidate key (no partial dependencies allowed).

**2. Analysis of Relation R(A, B, C, D):**
- Candidate Key: $AB$
- Prime attributes: $A, B$ (belong to candidate key)
- Non-prime attributes: $C, D$
- Given FD: $B \\to C$

**3. Evaluation:**
Here, $B$ is a proper subset of candidate key $AB$. The FD $B \\to C$ implies non-prime attribute $C$ depends only on a part of the candidate key ($B$).
This is a **partial dependency**, which directly violates 2NF.

**Conclusion:** Relation R is NOT in 2NF. 
**Normalization decomposition:** Split into $R_1(B, C)$ with key $B$, and $R_2(A, B, D)$ with key $AB$.`,
    short_answer: 'Relation R is NOT in 2NF because B -> C represents a partial dependency: non-prime attribute C depends on B, which is a proper subset of candidate key AB.',
    detailed_explanation: `Full Academic Derivation:
1. Identify all candidate keys from functional closures: Key = AB.
2. Identify Prime attributes = {A, B} and Non-Prime attributes = {C, D}.
3. Definition check: A partial dependency exists if X -> Y where X ⊂ Candidate Key and Y is non-prime.
4. B ⊂ AB and C is non-prime. Therefore B -> C is a partial dependency.
5. Violates 2NF rule. Decomposed schemas: R1(B, C) with key B, R2(A, B, D) with key AB. Both R1 and R2 are in 2NF and lossless.`,
    hint_text: 'Determine whether attribute B is the full candidate key or only a proper subset of candidate key AB.',
    code_snippet: `-- SQL Decomposition
CREATE TABLE R1 (
    B INT PRIMARY KEY,
    C VARCHAR(50)
);

CREATE TABLE R2 (
    A INT,
    B INT,
    D VARCHAR(50),
    PRIMARY KEY (A, B),
    FOREIGN KEY (B) REFERENCES R1(B)
);`,
    diagram_description: '| Attribute | Status | Dependency |\n|---|---|---|\n| A | Prime | Part of Key AB |\n| B | Prime | Part of Key AB |\n| C | Non-prime | Partially depends on B (Violates 2NF) |\n| D | Non-prime | Fully depends on AB |',
    solution_type: 'verified',
    explanation_level: 'step_by_step',
    source_description: 'State University Model Answer Key Fall 2024 (Paper CS-301)',
    verification_status: 'verified',
    created_at: '2024-10-23T11:00:00Z',
  },

  'q-dbms-102': {
    id: 'sol-102',
    question_id: 'q-dbms-102',
    solution_text: `### Step-by-Step Verified Solution:

**1. Comparison Criteria:**
For every non-trivial functional dependency $X \\to A$:
- **3NF Requirement:** Either $X$ is a superkey OR $A$ is a prime attribute.
- **BCNF Requirement:** $X$ MUST strictly be a superkey (no prime attribute exception permitted).

**2. Why 3NF Does Not Imply BCNF:**
Consider relation $R(\\text{Student}, \\text{Course}, \\text{Instructor})$ with FDs:
1. $\\{\\text{Student}, \\text{Course}\\} \\to \\text{Instructor}$
2. $\\text{Instructor} \\to \\text{Course}$

Candidate keys: $\\{\\text{Student}, \\text{Course}\\}$ and $\\{\\text{Student}, \\text{Instructor}\\}$.
Prime attributes: $\\text{Student}, \\text{Course}, \\text{Instructor}$.
- In FD $\\text{Instructor} \\to \\text{Course}$: $\\text{Instructor}$ is not a superkey, but $\\text{Course}$ is a prime attribute.
- Therefore, $R$ is in 3NF!
- However, since $\\text{Instructor}$ is not a superkey, it VIOLATES BCNF.

**3. Dependency Preservation in BCNF:**
**No.** Dependency preservation cannot always be achieved in BCNF decompositions. Decomposing $R$ into BCNF tables $R_1(\\text{Instructor}, \\text{Course})$ and $R_2(\\text{Student}, \\text{Instructor})$ loses the original dependency $\\{\\text{Student}, \\text{Course}\\} \\to \\text{Instructor}$.`,
    short_answer: '3NF permits X -> A if A is prime; BCNF strictly requires X to be a superkey. BCNF cannot always preserve all functional dependencies.',
    detailed_explanation: `Comprehensive Exam Explanation:
1. 3NF condition: For X -> A, X is superkey OR A is prime attribute.
2. BCNF condition: For X -> A, X must be superkey.
3. Every BCNF relation is automatically in 3NF, but converse is false.
4. Classical counterexample: R(Student, Course, Instructor) where each instructor teaches one course. In 3NF due to Course being prime, but fails BCNF because Instructor is not superkey.
5. Trade-off: 3NF guarantees both Lossless Join AND Dependency Preservation. BCNF guarantees Lossless Join and zero functional dependency redundancy, but cannot always preserve all dependencies without cross-table joins.`,
    hint_text: 'Recall the prime attribute exception that 3NF allows for overlapping candidate keys.',
    diagram_description: 'BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF (Strict Subset Hierarchy)',
    solution_type: 'verified',
    explanation_level: 'detailed',
    source_description: 'Verified CSE Department Faculty Key (Prof. Ananya Roy)',
    verification_status: 'verified',
    created_at: '2024-10-23T11:00:00Z',
  },

  'q-dbms-103': {
    id: 'sol-103',
    question_id: 'q-dbms-103',
    solution_text: `### Step-by-Step Verified Solution:

**1. ACID Properties:**
- **Atomicity:** All operations in the transaction succeed, or the entire transaction is rolled back with zero effects.
- **Consistency:** The database starts in a valid state and finishes in a valid state satisfying all schema constraints.
- **Isolation:** Concurrently executing transactions execute without dirty reads or uncommitted interference (serializability).
- **Durability:** Once committed, changes persist permanently even in the event of power loss or OS crash.

**2. Write-Ahead Logging (WAL) Protocol:**
WAL mandates that any change log record (containing Old Value and New Value) MUST be written and flushed to non-volatile disk BEFORE the actual data page is written to disk.
- **Guaranteeing Atomicity:** During crash recovery, the recovery manager scans the log backwards. For any uncommitted active transaction, it uses the "Before Image" (undo log) to reverse partial changes.
- **Guaranteeing Durability:** For all committed transactions whose modified pages may still reside in the volatile buffer pool, the recovery manager uses the "After Image" (redo log) to re-apply the changes to disk.`,
    short_answer: 'ACID guarantees reliable processing. Write-Ahead Logging ensures log records reach non-volatile disk before data pages, allowing Undo (Atomicity) for aborted transactions and Redo (Durability) for committed ones.',
    hint_text: 'Think about Undo (old values) and Redo (new values) in the log during crash recovery.',
    solution_type: 'verified',
    explanation_level: 'detailed',
    source_description: 'University Archive Model Answer Fall 2024',
    verification_status: 'verified',
    created_at: '2024-10-23T11:00:00Z',
  },
};

export const INITIAL_ASSIGNMENTS: QuestionAssignment[] = [
  {
    id: 'asgn-dbms-1',
    subject_id: 'Database Management Systems',
    semester: '3rd Semester',
    title: 'Assignment 1: Relational Schema Normalization & Synthesis',
    assignment_number: 1,
    description: 'Deconstruct unnormalized university registration tables into BCNF schemas. Verify dependency preservation, compute canonical covers, and test lossless join properties.',
    academic_year: '2026-2027',
    max_marks: 25,
    due_date: '2026-10-25',
    reference_material: 'Korth Chapter 7: Relational Database Design & Armstrong Axioms',
    uploaded_by: 'Prof. Ananya Roy (CSE Dept)',
    visibility: 'public',
    verification_status: 'verified',
    question_count: 4,
    is_completed: false,
    is_attempted: true,
    created_at: '2026-10-01T10:00:00Z',
  },
  {
    id: 'asgn-dbms-2',
    subject_id: 'Database Management Systems',
    semester: '3rd Semester',
    title: 'Assignment 2: Concurrency Control Schedules & 2PL Locks',
    assignment_number: 2,
    description: 'Construct precedence graphs for concurrent interleavings, test conflict serializability, and simulate Strict vs Rigorous Two-Phase Locking protocols.',
    academic_year: '2026-2027',
    max_marks: 20,
    due_date: '2026-11-05',
    reference_material: 'Ramakrishnan Chapter 16: Concurrency Control & Write-Ahead Logging',
    uploaded_by: 'Prof. Ananya Roy (CSE Dept)',
    visibility: 'public',
    verification_status: 'verified',
    question_count: 3,
    is_completed: false,
    is_attempted: false,
    created_at: '2026-10-10T10:00:00Z',
  },
];

export const INITIAL_ANALYTICS: QuestionBankAnalyticsData = {
  student_id: 'alex_cse_3',
  total_attempts: 3,
  total_questions_practiced: 18,
  total_correct: 8,
  overall_accuracy_percentage: 44.4,
  subject_performance: {
    'Database Management Systems': {
      accuracy: 40.0,
      questions_attempted: 15,
      status: 'Weakness in Normalization (1NF, 2NF, 3NF vs BCNF)',
    },
    'Operating Systems': {
      accuracy: 66.7,
      questions_attempted: 3,
      status: 'Moderate (CPU scheduling mastered)',
    },
  },
  topic_breakdown: {
    Normalization: { attempted: 8, correct: 3, percentage: 37.5 },
    'Transactions & Concurrency': { attempted: 6, correct: 5, percentage: 83.3 },
    'Functional Dependencies': { attempted: 4, correct: 2, percentage: 50.0 },
  },
  weak_topics: ['Normalization', '2NF Partial Dependencies', '3NF vs BCNF Conditions'],
  strong_topics: ['Transactions & Concurrency', 'Write-Ahead Logging'],
  recommended_pyqs: [
    {
      paper_id: 'pyq-dbms-2024',
      title: 'DBMS University Mid-Term (Fall 2024)',
      recommended_reason: 'Features Q1(a) and Q2(b) directly targeting your weak area in 2NF & BCNF',
      subject: 'Database Management Systems',
      question_count: 5,
    },
    {
      paper_id: 'pyq-dbms-2023',
      title: 'DBMS End-Semester University Exam (Spring 2023)',
      recommended_reason: 'Repeated 10-mark BCNF decomposition problem with model solution',
      subject: 'Database Management Systems',
      question_count: 6,
    },
  ],
  mentor_recommendation:
    'DBMS Normalization is currently your weakest area (37.5% accuracy in past papers). Recommended action: 1) Study Q1(a) and Q2(b) verified solutions, 2) Complete Assignment 1, 3) Attempt 5 targeted practice questions.',
};

export const INITIAL_REPEATED_QUESTIONS: RepeatedQuestionData[] = [
  {
    primary_question_id: 'q-dbms-102',
    topic: 'Normalization',
    question_text: 'Compare and contrast 3NF and BCNF. Explain why a relation can satisfy 3NF without satisfying BCNF. Is BCNF decomposition always dependency preserving?',
    paper_title: 'DBMS University Mid-Term (Fall 2024)',
    academic_year: '2024-2025',
    occurrence_count: 3,
    historical_occurrences: [
      {
        question_id: 'q-dbms-201',
        question_text: 'Differentiate between 3NF and BCNF. Provide a schema example that is in 3NF but violates BCNF. Is BCNF decomposition always dependency preserving?',
        paper_title: 'DBMS End-Semester University Exam (Spring 2023)',
        academic_year: '2023-2024',
        match_type: 'Exact Repeat',
      },
      {
        question_id: 'q-dbms-rep-2022',
        question_text: 'What is BCNF? How does it differ from 3NF with respect to dependency preservation and redundancy?',
        paper_title: 'DBMS University Mid-Term Exam (Fall 2022)',
        academic_year: '2022-2023',
        match_type: 'High Similarity Variant',
      },
    ],
  },
  {
    primary_question_id: 'q-dbms-103',
    topic: 'Transactions & Concurrency',
    question_text: 'Explain the ACID properties of database transactions. How does Write-Ahead Logging (WAL) guarantee Atomicity and Durability during failures?',
    paper_title: 'DBMS University Mid-Term (Fall 2024)',
    academic_year: '2024-2025',
    occurrence_count: 2,
    historical_occurrences: [
      {
        question_id: 'q-dbms-rep-2023-t',
        question_text: 'Define ACID properties. Discuss Write-Ahead Logging (WAL) and its role in transaction recovery.',
        paper_title: 'DBMS End-Semester University Exam (Spring 2023)',
        academic_year: '2023-2024',
        match_type: 'High Similarity Variant',
      },
    ],
  },
];
