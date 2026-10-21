import { StudentProfile, FacultyProfile, StudyMaterial, StudyPlan, Quiz, CampusItem, QuizSubmission } from '../types';

export const SAMPLE_PROFILE: StudentProfile = {
  name: 'Alex',
  college: 'Apex Institute of Science & Technology',
  course: 'B.Tech',
  branch: 'Computer Science & Engineering',
  semester: '3rd Semester',
  dailyStudyHours: 3,
  studyStreakDays: 5,
  subjects: [
    'Database Management Systems',
    'Operating Systems',
    'Data Structures & Algorithms',
    'Computer Networks',
  ],
  examDates: [
    {
      id: 'exam-1',
      subject: 'Database Management Systems',
      date: '2026-10-20',
      daysLeft: 4,
      readinessPercentage: 62,
      topicsCovered: 8,
      totalTopics: 12,
    },
    {
      id: 'exam-2',
      subject: 'Operating Systems',
      date: '2026-10-24',
      daysLeft: 8,
      readinessPercentage: 75,
      topicsCovered: 9,
      totalTopics: 12,
    },
    {
      id: 'exam-3',
      subject: 'Data Structures & Algorithms',
      date: '2026-10-28',
      daysLeft: 12,
      readinessPercentage: 80,
      topicsCovered: 12,
      totalTopics: 15,
    },
    {
      id: 'exam-4',
      subject: 'Computer Networks',
      date: '2026-11-02',
      daysLeft: 17,
      readinessPercentage: 45,
      topicsCovered: 5,
      totalTopics: 11,
    },
  ],
};

export const SAMPLE_FACULTY_PROFILE: FacultyProfile = {
  id: 'fac-vance-01',
  name: 'Dr. Robert Vance',
  title: 'Professor & Head of Department',
  department: 'Computer Science & Engineering',
  college: 'Apex Institute of Science & Technology',
  employeeId: 'FAC-CSE-094',
  coursesTaught: [
    'Database Management Systems (CS-302)',
    'Advanced Database Systems (CS-504)',
    'Distributed Computing (CS-701)',
  ],
  activeClassTests: [
    {
      id: 'ct-1-dbms',
      title: 'Class Test 1: ER Modeling & SQL Joins',
      subject: 'Database Management Systems',
      date: '2026-10-04',
      averageScore: 78,
      totalStudents: 64,
      status: 'evaluated',
    },
    {
      id: 'ct-2-dbms',
      title: 'Class Test 2: Normalization & Functional Dependencies',
      subject: 'Database Management Systems',
      date: '2026-10-14',
      averageScore: 54,
      totalStudents: 64,
      status: 'evaluated',
    },
    {
      id: 'mid-term-dbms',
      title: 'Mid-Term Examination (Unit 1 to 3)',
      subject: 'Database Management Systems',
      date: '2026-10-22',
      averageScore: 0,
      totalStudents: 64,
      status: 'upcoming',
    },
  ],
  papersUploadedCount: 14,
  weakTopicsIdentified: [
    {
      topic: 'Normalization (2NF, 3NF & BCNF)',
      subject: 'Database Management Systems',
      classAccuracy: 42,
      studentsAffected: 38,
    },
    {
      topic: 'Concurrency Control (2PL Protocol)',
      subject: 'Database Management Systems',
      classAccuracy: 58,
      studentsAffected: 27,
    },
  ],
};

export const SAMPLE_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-dbms-1',
    title: 'DBMS_Unit3_Normalization_and_Transactions.pdf',
    subject: 'Database Management Systems',
    fileType: 'pdf',
    uploadDate: '2026-10-15',
    rawText: `DATABASE MANAGEMENT SYSTEMS - UNIT III: RELATIONAL DATABASE DESIGN & TRANSACTIONS

1. FUNCTIONAL DEPENDENCY (FD):
A functional dependency X -> Y between two sets of attributes X and Y specifies that the value of X uniquely determines the value of Y. 
- Trivial FD: If Y is a subset of X (e.g., AB -> A).
- Non-trivial FD: If Y is not a subset of X (e.g., RollNo -> Name).
- Full functional dependency vs Partial dependency: A dependency X -> Y is partial if some attribute A in X can be removed and the dependency still holds.

2. NORMALIZATION PRINCIPLES:
Normalization is the systematic approach of decomposing relations to eliminate data redundancy and insertion, deletion, and update anomalies.
- First Normal Form (1NF): A relation is in 1NF if and only if all underlying domains contain atomic (indivisible) values only. No repeating groups or multi-valued attributes.
- Second Normal Form (2NF): A relation is in 2NF if it is in 1NF and every non-prime attribute is fully functionally dependent on any candidate key (NO partial dependency).
- Third Normal Form (3NF): A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on any candidate key. Formally, for every non-trivial FD X -> A, either X is a superkey OR A is a prime attribute.
- Boyce-Codd Normal Form (BCNF): A stricter version of 3NF. For every non-trivial FD X -> A, X MUST be a superkey. Every relation in BCNF is in 3NF, but the converse is not always true. Lossless join is preserved, but dependency preservation is not guaranteed in all BCNF decompositions.

3. TRANSACTION PROCESSING & ACID PROPERTIES:
A transaction is a logical unit of database processing that includes one or more database access operations.
- Atomicity: "All or nothing" execution, handled by the Transaction Recovery Manager.
- Consistency: Preservation of database integrity constraints before and after execution.
- Isolation: Concurrent transactions execute without interfering with each other (serializability). Controlled by the Concurrency Control Manager.
- Durability: Once a transaction commits, its updates persist even across system crashes. Handled by the Log Manager (WAL - Write-Ahead Logging).

4. CONCURRENCY CONTROL & SERIALIZABILITY:
- Conflict Serializability: A schedule S is conflict serializable if it is conflict equivalent to some serial schedule. Tested using Precedence Graph (Serialization Graph). If the graph has no cycles, the schedule is conflict serializable.
- Two-Phase Locking (2PL): Growing phase (locks acquired, none released) and Shrinking phase (locks released, none acquired). Guarantees conflict serializability but may lead to deadlocks.`,
    detectedTopics: [
      'Functional Dependencies',
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'Boyce-Codd Normal Form (BCNF)',
      'ACID Properties',
      'Conflict Serializability',
      'Two-Phase Locking (2PL)',
    ],
    importantTopics: [
      'Boyce-Codd Normal Form (BCNF)',
      '3NF vs BCNF Decomposition',
      'Conflict Serializability & Precedence Graph',
      'ACID Properties Enforcement',
    ],
    difficultyEstimation: {
      level: 'Medium-Hard',
      score: 7.8,
      reasoning: 'High conceptual density in BCNF dependency preservation trade-offs and precedence graph cycle detection algorithms.',
    },
    summary: 'Covers relational normalization (1NF through BCNF) to eliminate anomalies, lossless join decomposition, ACID transaction properties, and 2-Phase Locking for concurrency control.',
  },
  {
    id: 'mat-os-1',
    title: 'OS_Unit2_CPU_Scheduling_and_Deadlocks.pdf',
    subject: 'Operating Systems',
    fileType: 'pdf',
    uploadDate: '2026-10-14',
    rawText: `OPERATING SYSTEMS - UNIT II: PROCESS SCHEDULING & DEADLOCKS
1. CPU Scheduling: FCFS, Shortest Job First (SJF/SRTF), Priority Scheduling, Round Robin (RR) with time quantum.
2. Scheduling Criteria: CPU utilization, Throughput, Turnaround time, Waiting time, Response time.
3. Deadlock Characterization: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait (Coffman conditions).
4. Deadlock Handling: Deadlock Prevention, Deadlock Avoidance via Banker's Algorithm (Safety Algorithm and Resource-Request Algorithm), Deadlock Detection and Recovery.`,
    detectedTopics: [
      'CPU Scheduling Criteria',
      'Round Robin & SJF Algorithms',
      'Coffman Conditions for Deadlock',
      "Banker's Algorithm",
      'Resource Allocation Graph (RAG)',
    ],
    importantTopics: [
      "Banker's Algorithm Safety State",
      'Round Robin Time Quantum Optimization',
      'Circular Wait Prevention',
    ],
    difficultyEstimation: {
      level: 'Medium',
      score: 6.5,
      reasoning: 'Algorithmically straightforward calculations for waiting times and safe state matrix evaluation.',
    },
    summary: 'Explains preemptive and non-preemptive CPU scheduling criteria, Gantt charts, and Coffman deadlock conditions alongside safety verification using Banker’s Algorithm.',
  },
];

export const SAMPLE_STUDY_PLAN: StudyPlan = {
  id: 'plan-dbms-oct20',
  subject: 'Database Management Systems',
  examDate: '2026-10-20',
  availableHoursPerDay: 3,
  preparationLevel: 'Intermediate',
  weakFocusTopics: ['Normalization', 'BCNF Decomposition'],
  adaptiveNote: '⚠️ Normalization identified as primary weak area (40% accuracy on Quiz 1). Injected 45-min targeted drill into Day 1 & Day 2.',
  days: [
    {
      dayNumber: 1,
      date: '2026-10-16',
      topics: ['Functional Dependencies', '1NF, 2NF, 3NF'],
      durationMinutes: 180,
      tasks: [
        {
          id: 't-1',
          description: 'Master Armstrong axioms and attribute closure algorithm to determine candidate keys',
          estimatedMinutes: 40,
          completed: true,
          topicTag: 'Functional Dependencies',
        },
        {
          id: 't-2',
          description: 'Practice identifying Partial vs Transitive dependencies in sample schemas',
          estimatedMinutes: 45,
          completed: true,
          topicTag: 'Normalization',
        },
        {
          id: 't-3',
          description: 'Solve 5 university questions converting unnormalized tables into 2NF and 3NF',
          estimatedMinutes: 50,
          completed: false,
          topicTag: 'Normalization',
        },
        {
          id: 't-4',
          description: '[ADAPTIVE REMEDIATION] Review 2NF non-prime attribute constraint edge cases (Fix for 40% quiz score)',
          estimatedMinutes: 45,
          completed: false,
          topicTag: 'Normalization',
          isWeakAreaRemediation: true,
        },
      ],
      isCompleted: false,
    },
    {
      dayNumber: 2,
      date: '2026-10-17',
      topics: ['Boyce-Codd Normal Form (BCNF)', 'Decomposition Properties'],
      durationMinutes: 180,
      tasks: [
        {
          id: 't-5',
          description: 'Compare 3NF vs BCNF: Understand why 3NF allows A to be prime attribute while BCNF strictly requires X to be superkey',
          estimatedMinutes: 50,
          completed: false,
          topicTag: 'Boyce-Codd Normal Form (BCNF)',
        },
        {
          id: 't-6',
          description: 'Test Lossless Join property using intersection rule: R1 ∩ R2 -> R1 or R1 ∩ R2 -> R2',
          estimatedMinutes: 45,
          completed: false,
          topicTag: 'Decomposition Properties',
        },
        {
          id: 't-7',
          description: 'Complete 10 BCNF verification problems from university past papers',
          estimatedMinutes: 45,
          completed: false,
          topicTag: 'Boyce-Codd Normal Form (BCNF)',
        },
        {
          id: 't-8',
          description: 'Take 15-minute quick check quiz on Normalization to measure mastery improvement',
          estimatedMinutes: 40,
          completed: false,
          topicTag: 'Normalization',
          isWeakAreaRemediation: true,
        },
      ],
      isCompleted: false,
    },
    {
      dayNumber: 3,
      date: '2026-10-18',
      topics: ['ACID Properties', 'Transaction States & Schedules'],
      durationMinutes: 180,
      tasks: [
        {
          id: 't-9',
          description: 'Write out the state transition diagram of a transaction (Active, Partially Committed, Failed, Aborted, Committed)',
          estimatedMinutes: 40,
          completed: false,
          topicTag: 'ACID Properties',
        },
        {
          id: 't-10',
          description: 'Differentiate between serial, non-serial, and conflict serializable schedules',
          estimatedMinutes: 50,
          completed: false,
          topicTag: 'Transaction States & Schedules',
        },
        {
          id: 't-11',
          description: 'Construct precedence graphs for 6 concurrent schedules and detect cycles',
          estimatedMinutes: 50,
          completed: false,
          topicTag: 'Conflict Serializability',
        },
        {
          id: 't-12',
          description: 'Explain Write-Ahead Logging (WAL) protocol and undo/redo operations',
          estimatedMinutes: 40,
          completed: false,
          topicTag: 'ACID Properties',
        },
      ],
      isCompleted: false,
    },
    {
      dayNumber: 4,
      date: '2026-10-19',
      topics: ['Two-Phase Locking (2PL)', 'Mock Exam & Final Rapid Revision'],
      durationMinutes: 180,
      tasks: [
        {
          id: 't-13',
          description: 'Contrast Strict 2PL vs Rigorous 2PL with cascading abort prevention mechanisms',
          estimatedMinutes: 45,
          completed: false,
          topicTag: 'Two-Phase Locking (2PL)',
        },
        {
          id: 't-14',
          description: 'Full-length 60-minute timed mock quiz across all Unit 3 topics',
          estimatedMinutes: 60,
          completed: false,
          topicTag: 'All Topics',
        },
        {
          id: 't-15',
          description: 'Formula & Definition flashcard review: Normal forms, Armstrong axioms, Serializability test',
          estimatedMinutes: 45,
          completed: false,
          topicTag: 'All Topics',
        },
        {
          id: 't-16',
          description: 'Final checklist audit for tomorrow’s DBMS exam at Central Hall B-204',
          estimatedMinutes: 30,
          completed: false,
          topicTag: 'Exam Prep',
        },
      ],
      isCompleted: false,
    },
  ],
  createdAt: '2026-10-15T09:00:00Z',
  updatedAt: '2026-10-16T08:00:00Z',
};

export const SAMPLE_QUIZ: Quiz = {
  id: 'quiz-dbms-1',
  title: 'DBMS Unit 3: Normalization & Transactions Diagnostic',
  subject: 'Database Management Systems',
  topic: 'Normalization & Transactions',
  materialId: 'mat-dbms-1',
  createdAt: '2026-10-15',
  questions: [
    {
      id: 'q1',
      question: 'Which condition must hold for a relation to be in Second Normal Form (2NF)?',
      options: [
        'A. It is in 1NF and no non-prime attribute is transitively dependent on a candidate key.',
        'B. It is in 1NF and no non-prime attribute is partially dependent on any candidate key.',
        'C. For every functional dependency X -> Y, X must be a superkey.',
        'D. All multi-valued dependencies must be trivial functional dependencies.',
      ],
      correctAnswer: 1, // B
      explanation: 'Second Normal Form (2NF) requires that the table is in 1NF and every non-prime attribute is fully functionally dependent on every candidate key (no partial dependencies allowed). Option A describes 3NF.',
      difficulty: 'Medium',
      topicTag: 'Normalization',
    },
    {
      id: 'q2',
      question: 'Consider relation R(A, B, C, D) with candidate key AB and FD: B -> C. In which normal form does this relation currently violate the standard?',
      options: [
        'A. 1NF',
        'B. 2NF',
        'C. 3NF but satisfies 2NF',
        'D. BCNF but satisfies 3NF',
      ],
      correctAnswer: 1, // B
      explanation: 'Since AB is the candidate key, B is a proper subset of the candidate key. The FD B -> C causes non-prime attribute C to depend on only a part of the key (B), which is a partial dependency. This violates 2NF.',
      difficulty: 'Hard',
      topicTag: 'Normalization',
    },
    {
      id: 'q3',
      question: 'In Third Normal Form (3NF), for every non-trivial functional dependency X -> A, what condition is permitted that is STRICTLY FORBIDDEN in BCNF?',
      options: [
        'A. X is a superkey of the relation',
        'B. A is a prime attribute (part of some candidate key)',
        'C. The dependency can be discarded without loss',
        'D. X can contain null values',
      ],
      correctAnswer: 1, // B
      explanation: '3NF permits X -> A if X is a superkey OR if A is a prime attribute. BCNF strictly eliminates this exception: in BCNF, X must ALWAYS be a superkey. That is why 3NF guarantees dependency preservation whereas BCNF sometimes does not.',
      difficulty: 'Hard',
      topicTag: 'Normalization',
    },
    {
      id: 'q4',
      question: 'Which component of a Database Management System guarantees the Atomicity property of transactions during unexpected system crashes?',
      options: [
        'A. Concurrency Control Manager',
        'B. Query Optimizer',
        'C. Recovery Manager (using transaction log / WAL)',
        'D. Buffer Pool Manager',
      ],
      correctAnswer: 2, // C
      explanation: 'The Recovery Manager ensures Atomicity (all-or-nothing execution) and Durability by utilizing Write-Ahead Logging (WAL) to undo partial transactions and redo committed ones.',
      difficulty: 'Easy',
      topicTag: 'ACID Properties',
    },
    {
      id: 'q5',
      question: 'How is a concurrent execution schedule tested for Conflict Serializability?',
      options: [
        'A. By counting the number of read and write operations',
        'B. By constructing a precedence (serialization) graph and checking for cycles',
        'C. By verifying that all locks are acquired in under 1 millisecond',
        'D. By confirming that every transaction uses at least 3 tables',
      ],
      correctAnswer: 1, // B
      explanation: 'A schedule is conflict serializable if and only if its precedence graph (nodes = transactions, directed edges = conflicting operations) contains NO directed cycles.',
      difficulty: 'Medium',
      topicTag: 'Conflict Serializability',
    },
  ],
};

export const SAMPLE_SUBMISSION: QuizSubmission = {
  id: 'sub-1',
  quizId: 'quiz-dbms-1',
  quizTitle: 'DBMS Unit 3: Normalization & Transactions Diagnostic',
  subject: 'Database Management Systems',
  topic: 'Normalization & Transactions',
  answers: {
    q1: 0, // Student answered A (incorrect, actual is B)
    q2: 2, // Student answered C (incorrect, actual is B)
    q3: 0, // Student answered A (incorrect, actual is B)
    q4: 2, // Student answered C (Correct!)
    q5: 1, // Student answered B (Correct!)
  },
  score: 2,
  totalQuestions: 5,
  percentage: 40,
  topicBreakdown: {
    Normalization: { correct: 0, total: 3, percentage: 0 },
    'ACID Properties': { correct: 1, total: 1, percentage: 100 },
    'Conflict Serializability': { correct: 1, total: 1, percentage: 100 },
  },
  weakTopics: ['Normalization', '2NF Partial Dependencies', '3NF vs BCNF Conditions'],
  strongTopics: ['ACID Properties', 'Conflict Serializability'],
  recommendation: 'Normalization is currently your weakest topic (0/3 correct). You confused 2NF partial dependencies with transitive dependencies, and missed the prime attribute exception in 3NF.',
  recommendedExtraMinutes: 30,
  timestamp: '2026-10-15T14:30:00Z',
};

export const VERIFIED_CAMPUS_DATA: CampusItem[] = [
  {
    id: 'camp-1',
    category: 'exam_timetable',
    title: 'B.Tech 3rd Semester Mid-Term Examination Timetable (Fall 2026)',
    department: 'Controller of Examinations',
    date: '2026-10-10',
    location: 'Central Exam Halls B-201 to B-206',
    verifiedSource: 'Office of Controller of Examinations, Notice Ref: CE/2026/Fall/324',
    content: `Official Mid-Term Exam Timetable for CSE 3rd Semester:
- Monday, Oct 20, 2026: Database Management Systems (CS-301) | Time: 10:00 AM - 12:00 PM | Hall: B-204
- Friday, Oct 24, 2026: Operating Systems (CS-302) | Time: 10:00 AM - 12:00 PM | Hall: B-205
- Wednesday, Oct 28, 2026: Data Structures & Algorithms (CS-303) | Time: 02:00 PM - 04:00 PM | Hall: B-202
- Monday, Nov 02, 2026: Computer Networks (CS-304) | Time: 10:00 AM - 12:00 PM | Hall: B-204

Examination Rules:
- Physical College ID Card & Hall Ticket mandatory.
- Scientific calculators (non-programmable, fx-82/991 series) permitted for CS-301 and CS-303.
- No electronic smartwatches or phones allowed inside exam hall.`,
  },
  {
    id: 'camp-2',
    category: 'class_timetable',
    title: 'CSE 3rd Semester (Section A) Weekly Lecture & Lab Schedule',
    department: 'Department of Computer Science & Engineering',
    date: '2026-08-20',
    location: 'Academic Block 2, Classrooms 204 & CS Lab 3',
    verifiedSource: 'CSE Dept Academic Handbook, Section A Timetable v2.1',
    content: `Weekly Routine (CSE Section A):
- Monday: 09:00 AM DBMS Lecture (LH-204) | 11:15 AM OS Lecture | 02:00 PM - 04:00 PM DBMS Lab (Lab 3)
- Tuesday: 10:00 AM DSA Lecture | 01:00 PM CN Lecture | 02:00 PM - 04:00 PM DSA Lab (Lab 2)
- Wednesday: 09:00 AM OS Lecture | 11:15 AM DBMS Lecture | 02:00 PM Math III
- Thursday: 10:00 AM CN Lecture | 11:15 AM DSA Lecture | 02:00 PM - 04:00 PM OS Lab (Lab 4)
- Friday: 09:00 AM Technical Communication | 11:00 AM Department Seminar / Tutorial
- Saturday & Sunday: No regular lectures. Library open.`,
  },
  {
    id: 'camp-3',
    category: 'library',
    title: 'Central Academic Library Timings & Exam Week Extended Hours',
    department: 'Central University Library',
    date: '2026-10-01',
    location: 'Knowledge Center Building, Floors 1-4',
    verifiedSource: 'Chief Librarian Office, Circular LIB/2026/89',
    content: `Standard Operating Hours:
- Monday to Saturday: 08:30 AM to 08:30 PM
- Sunday: 10:00 AM to 05:00 PM

EXAM PERIOD EXTENDED HOURS (Oct 15 - Nov 05, 2026):
- Ground & First Floor Reading Halls: Open daily 08:00 AM to 11:00 PM.
- Overnight Digital Catalog & Wi-Fi: Available 24/7.
- Book Circulation Desk: Closes at 07:30 PM.
- Quiet Study Cubicles on 3rd floor can be reserved in 3-hour blocks via the campus portal.`,
  },
  {
    id: 'camp-4',
    category: 'department',
    title: 'CSE Department Faculty & Office Hours',
    department: 'Department of Computer Science & Engineering',
    date: '2026-09-01',
    location: 'Academic Block 2, Level 2',
    verifiedSource: 'CSE Department Directory 2026-27',
    content: `Key Faculty & Mentors:
- Head of Department (HOD): Dr. R. Ramanujan | Cabin CS-201 | Email: hod.cse@apex.edu | Office Hours: Mon & Wed 02:00 PM - 04:00 PM
- DBMS Course Instructor: Prof. Ananya Roy | Cabin CS-208 | Office Hours: Tue & Thu 03:00 PM - 04:30 PM
- OS Course Instructor: Dr. Marcus Vance | Cabin CS-214 | Office Hours: Mon & Thu 11:00 AM - 12:30 PM
- DSA Course Instructor: Dr. Priya Sharma | Cabin CS-205 | Office Hours: Wed & Fri 01:30 PM - 03:00 PM
- Student Academic Counselor: Mr. David K. | Student Center Rm 102`,
  },
  {
    id: 'camp-5',
    category: 'notice',
    title: 'Notice: Annual College Hackathon "CodePeak 2026" Registrations Open',
    department: 'Student Affairs & Innovation Cell',
    date: '2026-10-12',
    location: 'Campus Auditorium & Virtual',
    verifiedSource: 'Innovation Cell Notice Board, Ref: IC/HACK/2026',
    content: `Registrations are open for CodePeak 2026 (Nov 14-16, 2026).
- Team size: 2 to 4 members.
- Tracks: AI & Academic Tools, Smart Campus, Healthcare, FinTech.
- Total cash prizes worth $10,000 + incubation opportunities.
- Deadline to register teams: October 25, 2026, 11:59 PM via portal.`,
  },
  {
    id: 'camp-6',
    category: 'announcement',
    title: 'Academic Notice: Re-evaluation & Grade Improvement Policy',
    department: 'Academic Affairs',
    date: '2026-09-15',
    location: 'Administrative Block',
    verifiedSource: 'Academic Affairs Bulletin, Rule 4.2',
    content: `Students wishing to apply for answer script verification or re-evaluation for prior semester grades must submit Form A-12 to the Exam Cell within 14 calendar days of result publication. A non-refundable scrutiny fee of $15 per paper applies.`,
  },
];
