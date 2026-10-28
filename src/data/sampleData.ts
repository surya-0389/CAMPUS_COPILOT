import {
  StudentProfile,
  FacultyProfile,
  StudyMaterial,
  StudyPlan,
  Quiz,
  CampusItem,
  QuizSubmission,
  AssignmentItem,
  SubjectDetail,
  StudyGoal,
  DailyActivity,
  ChatConversation,
  CampusPoll,
  AttendanceRecord,
  LeaveNotice,
  GrievanceTicket,
  OnlineClassTest,
  TestSubmission,
  FacultyMember,
} from '../types';

export const SAMPLE_PROFILE: StudentProfile = {
  name: 'Aarav Sharma',
  rollNo: '2024CS104',
  dob: '2004-05-14',
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
  title: 'Professor & Head of Department (H.O.D)',
  designation: 'Head of Department (H.O.D) & Senior Professor',
  qualification: 'Ph.D. in Computer Science (IIT Delhi), M.Tech (Gold Medalist), B.Tech',
  department: 'Computer Science & Engineering',
  college: 'Apex Institute of Science & Technology',
  employeeId: 'FAC-CSE-094',
  contactNumber: '+91 98765 43210',
  email: 'r.vance@apex.edu.in',
  officeRoom: 'Block B, Faculty Wing 304',
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

export const SAMPLE_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asgn-1',
    title: 'Relational Schema Normalization & BCNF Decomposition',
    subject: 'Database Management Systems',
    dueDate: '2026-10-23',
    priority: 'High',
    description: 'Deconstruct unnormalized university schemas into 3NF and BCNF tables. Prove dependency preservation and lossless joins.',
    maxMarks: 25,
    completed: false,
    fileAttachment: 'dbms_assignment_1_brief.pdf',
    createdAt: '2026-10-10T10:00:00Z',
  },
  {
    id: 'asgn-2',
    title: 'Deadlock Detection & Banker’s Algorithm Simulation',
    subject: 'Operating Systems',
    dueDate: '2026-10-26',
    priority: 'High',
    description: 'Implement Banker’s algorithm in C++/Python for multi-resource safe state evaluation and deadlock avoidance.',
    maxMarks: 30,
    completed: false,
    fileAttachment: 'os_bankers_algo_spec.pdf',
    createdAt: '2026-10-12T09:00:00Z',
  },
  {
    id: 'asgn-3',
    title: 'Red-Black Tree Insertion & Rotations Benchmark',
    subject: 'Data Structures & Algorithms',
    dueDate: '2026-10-29',
    priority: 'Medium',
    description: 'Benchmark search times between AVL trees and Red-Black trees across 100,000 randomized integer keys.',
    maxMarks: 20,
    completed: true,
    score: 19,
    createdAt: '2026-10-05T14:00:00Z',
  },
  {
    id: 'asgn-4',
    title: 'TCP vs UDP Socket Programming & Packet Sniffing',
    subject: 'Computer Networks',
    dueDate: '2026-11-04',
    priority: 'Medium',
    description: 'Write a client-server socket program with sliding window packet acknowledgments and Wireshark traces.',
    maxMarks: 25,
    completed: false,
    createdAt: '2026-10-15T11:00:00Z',
  },
];

export const SAMPLE_SUBJECT_DETAILS: SubjectDetail[] = [
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS-302',
    instructor: 'Prof. Ananya Roy',
    credits: 4,
    examDate: '2026-10-20',
    readinessScore: 62,
    notesCount: 4,
    pyqCount: 5,
    units: [
      {
        id: 'dbms-u1',
        unitNumber: 1,
        title: 'Introduction & Relational Data Model',
        topics: ['Data Independence', 'ER Modeling', 'Relational Algebra', 'Tuple Relational Calculus'],
        completedTopics: ['Data Independence', 'ER Modeling', 'Relational Algebra'],
      },
      {
        id: 'dbms-u2',
        unitNumber: 2,
        title: 'SQL, Constraints & Triggers',
        topics: ['Complex Joins', 'Nested Subqueries', 'Views', 'Integrity Constraints', 'Triggers'],
        completedTopics: ['Complex Joins', 'Nested Subqueries', 'Views'],
      },
      {
        id: 'dbms-u3',
        unitNumber: 3,
        title: 'Relational Design & Normalization',
        topics: ['Functional Dependencies', 'Armstrong Axioms', '1NF & 2NF', '3NF & BCNF', 'Lossless Decomposition'],
        completedTopics: ['Functional Dependencies', '1NF & 2NF'],
      },
      {
        id: 'dbms-u4',
        unitNumber: 4,
        title: 'Transaction Management & Concurrency',
        topics: ['ACID Properties', 'Conflict Serializability', 'Precedence Graph', 'Two-Phase Locking (2PL)', 'Deadlocks'],
        completedTopics: ['ACID Properties'],
      },
      {
        id: 'dbms-u5',
        unitNumber: 5,
        title: 'Recovery & Storage Indexing',
        topics: ['Write-Ahead Logging (WAL)', 'Checkpoints', 'B+ Trees', 'Hashing Techniques'],
        completedTopics: [],
      },
    ],
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS-304',
    instructor: 'Dr. Marcus Vance',
    credits: 4,
    examDate: '2026-10-24',
    readinessScore: 75,
    notesCount: 3,
    pyqCount: 4,
    units: [
      {
        id: 'os-u1',
        unitNumber: 1,
        title: 'OS Structure & Processes',
        topics: ['Dual Mode Operation', 'System Calls', 'Process Control Block', 'Context Switching'],
        completedTopics: ['Dual Mode Operation', 'System Calls', 'Process Control Block', 'Context Switching'],
      },
      {
        id: 'os-u2',
        unitNumber: 2,
        title: 'CPU Scheduling & Threads',
        topics: ['FCFS & SJF', 'Round Robin', 'Multilevel Queue', 'Thread Synchronization'],
        completedTopics: ['FCFS & SJF', 'Round Robin', 'Thread Synchronization'],
      },
      {
        id: 'os-u3',
        unitNumber: 3,
        title: 'Synchronization & Deadlocks',
        topics: ['Critical Section Problem', 'Semaphores', 'Banker’s Algorithm', 'Deadlock Detection'],
        completedTopics: ['Critical Section Problem', 'Semaphores'],
      },
      {
        id: 'os-u4',
        unitNumber: 4,
        title: 'Memory Management',
        topics: ['Paging', 'Segmentation', 'Page Replacement (FIFO, LRU)', 'Thrashing'],
        completedTopics: ['Paging', 'Page Replacement (FIFO, LRU)'],
      },
      {
        id: 'os-u5',
        unitNumber: 5,
        title: 'Storage & File Systems',
        topics: ['Disk Scheduling (SSTF, SCAN)', 'File Allocation', 'Inodes'],
        completedTopics: ['Disk Scheduling (SSTF, SCAN)'],
      },
    ],
  },
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS-301',
    instructor: 'Dr. Priya Sharma',
    credits: 4,
    examDate: '2026-10-28',
    readinessScore: 80,
    notesCount: 5,
    pyqCount: 6,
    units: [
      {
        id: 'dsa-u1',
        unitNumber: 1,
        title: 'Asymptotic Analysis & Linear Structures',
        topics: ['Big-O Notation', 'Linked Lists', 'Stacks & Queues', 'Amortized Analysis'],
        completedTopics: ['Big-O Notation', 'Linked Lists', 'Stacks & Queues', 'Amortized Analysis'],
      },
      {
        id: 'dsa-u2',
        unitNumber: 2,
        title: 'Trees & Balanced Search Trees',
        topics: ['Binary Search Trees', 'AVL Trees', 'Red-Black Trees', 'B-Trees'],
        completedTopics: ['Binary Search Trees', 'AVL Trees', 'Red-Black Trees'],
      },
      {
        id: 'dsa-u3',
        unitNumber: 3,
        title: 'Graph Algorithms',
        topics: ['BFS & DFS', 'Dijkstra’s Algorithm', 'Bellman-Ford', 'Prim’s & Kruskal’s MST'],
        completedTopics: ['BFS & DFS', 'Dijkstra’s Algorithm', 'Prim’s & Kruskal’s MST'],
      },
      {
        id: 'dsa-u4',
        unitNumber: 4,
        title: 'Dynamic Programming & Greedy',
        topics: ['0/1 Knapsack', 'LCS', 'Matrix Chain Multiplication', 'Huffman Coding'],
        completedTopics: ['0/1 Knapsack', 'LCS'],
      },
      {
        id: 'dsa-u5',
        unitNumber: 5,
        title: 'Advanced Sorting & Hashing',
        topics: ['QuickSort & MergeSort', 'HeapSort', 'Hash Collisions', 'Bloom Filters'],
        completedTopics: ['QuickSort & MergeSort', 'HeapSort'],
      },
    ],
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS-306',
    instructor: 'Prof. David Chen',
    credits: 3,
    examDate: '2026-11-02',
    readinessScore: 45,
    notesCount: 2,
    pyqCount: 3,
    units: [
      {
        id: 'cn-u1',
        unitNumber: 1,
        title: 'Network Models & Physical Layer',
        topics: ['OSI vs TCP/IP', 'Bandwidth & Latency', 'Transmission Media', 'Multiplexing'],
        completedTopics: ['OSI vs TCP/IP', 'Bandwidth & Latency'],
      },
      {
        id: 'cn-u2',
        unitNumber: 2,
        title: 'Data Link Layer & MAC',
        topics: ['Framing', 'Error Detection (CRC)', 'Sliding Window', 'CSMA/CD & Ethernet'],
        completedTopics: ['Framing', 'Error Detection (CRC)'],
      },
      {
        id: 'cn-u3',
        unitNumber: 3,
        title: 'Network Layer & Routing',
        topics: ['IPv4 & IPv6 Addressing', 'Subnetting & CIDR', 'Distance Vector Routing', 'Link State (OSPF)'],
        completedTopics: ['IPv4 & IPv6 Addressing'],
      },
      {
        id: 'cn-u4',
        unitNumber: 4,
        title: 'Transport Layer Protocols',
        topics: ['TCP 3-Way Handshake', 'Flow Control & Congestion Control', 'UDP Protocol'],
        completedTopics: [],
      },
      {
        id: 'cn-u5',
        unitNumber: 5,
        title: 'Application Layer & Security',
        topics: ['DNS & HTTP/2', 'TLS/SSL Handshake', 'Firewalls'],
        completedTopics: [],
      },
    ],
  },
];

export const SAMPLE_STUDY_GOALS: StudyGoal[] = [
  {
    id: 'goal-1',
    title: 'Master 3NF vs BCNF Dependency Preservation',
    targetDate: '2026-10-18',
    progressPercent: 75,
    category: 'Concept Mastery',
    completed: false,
  },
  {
    id: 'goal-2',
    title: 'Achieve ≥80% in DBMS Checkpoint Diagnostic Quiz',
    targetDate: '2026-10-19',
    progressPercent: 50,
    category: 'Exam Prep',
    completed: false,
  },
  {
    id: 'goal-3',
    title: 'Log 21 Hours Total Study Time This Week',
    targetDate: '2026-10-22',
    progressPercent: 68,
    category: 'Weekly Hours',
    completed: false,
  },
  {
    id: 'goal-4',
    title: 'Submit OS Deadlock Banker’s Simulation Assignment',
    targetDate: '2026-10-26',
    progressPercent: 35,
    category: 'Assignment',
    completed: false,
  },
];

export const SAMPLE_WEEKLY_ACTIVITY: DailyActivity[] = [
  { day: 'Mon', date: '2026-10-14', minutesSpent: 190, tasksCompleted: 4, targetMinutes: 180 },
  { day: 'Tue', date: '2026-10-15', minutesSpent: 215, tasksCompleted: 5, targetMinutes: 180 },
  { day: 'Wed', date: '2026-10-16', minutesSpent: 160, tasksCompleted: 3, targetMinutes: 180 },
  { day: 'Thu', date: '2026-10-17', minutesSpent: 240, tasksCompleted: 6, targetMinutes: 180 },
  { day: 'Fri', date: '2026-10-18', minutesSpent: 185, tasksCompleted: 4, targetMinutes: 180 },
  { day: 'Sat', date: '2026-10-19', minutesSpent: 220, tasksCompleted: 5, targetMinutes: 180 },
  { day: 'Sun', date: '2026-10-20', minutesSpent: 120, tasksCompleted: 3, targetMinutes: 180 },
];

export const SAMPLE_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv-1',
    title: 'DBMS Normalization & 2NF/3NF Breakdown',
    createdAt: '2026-10-18T14:30:00Z',
    updatedAt: '2026-10-18T15:10:00Z',
    mode: 'detailed',
    groundingMaterialId: 'mat-1',
    messages: [
      {
        id: 'msg-init-1',
        role: 'assistant',
        content: `Hello Alex! I am your AI Academic Mentor. I see you scored 40% on your recent diagnostic quiz on Normalization. How can I help you master 2NF, 3NF, or BCNF decompositions today?`,
        timestamp: '14:30',
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        suggestedActions: [
          'Explain difference between 3NF and BCNF',
          'Solve a decomposition problem step-by-step',
          'Review Armstrong Axioms cheat sheet',
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Operating Systems Deadlock & Banker’s Algorithm',
    createdAt: '2026-10-16T11:00:00Z',
    updatedAt: '2026-10-16T11:45:00Z',
    mode: 'code',
    messages: [
      {
        id: 'msg-os-1',
        role: 'assistant',
        content: `Ready to assist with your Operating Systems coursework. I have your CPU scheduling notes and Banker's algorithm assignment specifications loaded.`,
        timestamp: '11:00',
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        suggestedActions: [
          'Verify Banker\'s safety check matrix',
          'Explain Resource Allocation Graph cycles',
        ],
      },
    ],
  },
];

export const SAMPLE_FACULTY_DIRECTORY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Dr. Robert Vance',
    designation: 'Head of Department (H.O.D) & Senior Professor',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. in Computer Science (IIT Delhi), M.Tech, B.Tech',
    specialization: ['Database Systems', 'Distributed Systems', 'Cloud Computing'],
    email: 'r.vance@apex.edu.in',
    contactNumber: '+91 98765 43210',
    officeRoom: 'Block B, Cabin 304',
    experienceYears: 18,
    courses: ['Database Management Systems (CS-302)', 'Advanced DBMS (CS-504)'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    cabinHours: 'Mon, Wed, Fri: 2:00 PM - 4:00 PM',
  },
  {
    id: 'fac-2',
    name: 'Prof. Ananya Sen',
    designation: 'Academic Coordinator & Associate Professor',
    department: 'Computer Science & Engineering',
    qualification: 'M.Tech (IIT Bombay - Gold Medalist), Pursuing Ph.D.',
    specialization: ['Operating Systems', 'Kernel Architecture', 'Virtualization'],
    email: 'ananya.sen@apex.edu.in',
    contactNumber: '+91 98765 43211',
    officeRoom: 'Block B, Cabin 208',
    experienceYears: 12,
    courses: ['Operating Systems (CS-304)', 'Systems Programming (CS-403)'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    cabinHours: 'Tue, Thu: 11:00 AM - 1:00 PM',
  },
  {
    id: 'fac-3',
    name: 'Dr. Rajeshwar Rao',
    designation: 'Examination Coordinator & Associate Professor',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. (IISc Bangalore), M.E., B.E.',
    specialization: ['Algorithms', 'Computational Complexity', 'Graph Theory'],
    email: 'rajeshwar.rao@apex.edu.in',
    contactNumber: '+91 98765 43212',
    officeRoom: 'Block B, Cabin 210',
    experienceYears: 14,
    courses: ['Data Structures & Algorithms (CS-301)', 'Design & Analysis of Algorithms (CS-401)'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    cabinHours: 'Wed, Fri: 3:00 PM - 5:00 PM',
  },
  {
    id: 'fac-4',
    name: 'Prof. Meera Kulkarni',
    designation: 'Training & Placement Coordinator & Assistant Professor',
    department: 'Computer Science & Engineering',
    qualification: 'M.Tech (NIT Surathkal), B.Tech',
    specialization: ['Computer Networks', 'Network Security', 'IoT Protocols'],
    email: 'meera.k@apex.edu.in',
    contactNumber: '+91 98765 43213',
    officeRoom: 'Block B, Cabin 115',
    experienceYears: 8,
    courses: ['Computer Networks (CS-305)', 'Cyber Security Fundamentals (CS-502)'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    cabinHours: 'Daily: 1:30 PM - 2:30 PM',
  },
  {
    id: 'fac-5',
    name: 'Dr. Vikram Malhotra',
    designation: 'R&D Coordinator & Assistant Professor',
    department: 'Computer Science & Engineering',
    qualification: 'Ph.D. (IIT Kanpur), M.Tech',
    specialization: ['Artificial Intelligence', 'Natural Language Processing', 'Deep Learning'],
    email: 'v.malhotra@apex.edu.in',
    contactNumber: '+91 98765 43214',
    officeRoom: 'Block B, AI Research Lab 102',
    experienceYears: 9,
    courses: ['Machine Learning (CS-404)', 'Artificial Intelligence (CS-501)'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    cabinHours: 'Mon, Thu: 2:00 PM - 4:00 PM',
  },
];

export const SAMPLE_POLLS: CampusPoll[] = [
  {
    id: 'poll-1',
    question: 'Should the Department host a 24-Hour Hackathon or a 3-Day Technical Symposium this semester?',
    description: 'Vote to decide the flagship CSE technical event format for November 2026.',
    category: 'Academic',
    createdBy: 'Dr. Robert Vance (H.O.D)',
    creatorRole: 'Head of Department',
    createdAt: '2026-10-14T09:00:00Z',
    expiresAt: '2026-10-25T23:59:59Z',
    isActive: true,
    totalVotes: 142,
    allowedVoters: 'all',
    options: [
      {
        id: 'opt-1-1',
        text: '24-Hour Continuous Hackathon (Product & Web3 Tracks)',
        votesCount: 96,
        voterRollNos: ['2024CS104', '2024CS105', '2024CS110'],
      },
      {
        id: 'opt-1-2',
        text: '3-Day Technical Symposium with Workshops & Paper Presentations',
        votesCount: 38,
        voterRollNos: ['2024CS101', '2024CS102'],
      },
      {
        id: 'opt-1-3',
        text: 'Hybrid Format (1 Day Workshop + 12 Hr Mini-Hackathon)',
        votesCount: 8,
        voterRollNos: ['2024CS112'],
      },
    ],
  },
  {
    id: 'poll-2',
    question: 'Preferred Programming Language for Competitive Programming & DSA Lab next semester?',
    description: 'Curriculum committee survey for selecting primary problem-solving lab environment.',
    category: 'Curriculum',
    createdBy: 'Dr. Rajeshwar Rao (Exam Coordinator)',
    creatorRole: 'Associate Professor',
    createdAt: '2026-10-12T10:00:00Z',
    expiresAt: '2026-10-28T18:00:00Z',
    isActive: true,
    totalVotes: 118,
    allowedVoters: 'students_only',
    options: [
      {
        id: 'opt-2-1',
        text: 'C++ (STL & Speed)',
        votesCount: 64,
        voterRollNos: ['2024CS104'],
      },
      {
        id: 'opt-2-2',
        text: 'Java (Standard OOP & Enterprise Stack)',
        votesCount: 35,
        voterRollNos: [],
      },
      {
        id: 'opt-2-3',
        text: 'Python 3 (Clean syntax & Rapid Prototyping)',
        votesCount: 19,
        voterRollNos: [],
      },
    ],
  },
  {
    id: 'poll-3',
    question: 'Proposed Extension of Central Library Reading Room Hours during Mid-Term exams',
    description: 'Poll to evaluate student turnout for keeping the reading room open till 11:30 PM.',
    category: 'Campus Life',
    createdBy: 'Chief Librarian & Student Affairs',
    creatorRole: 'Campus Administration',
    createdAt: '2026-10-10T08:00:00Z',
    expiresAt: '2026-10-30T20:00:00Z',
    isActive: true,
    totalVotes: 189,
    allowedVoters: 'all',
    options: [
      {
        id: 'opt-3-1',
        text: 'Yes, strongly needed (till 11:30 PM daily)',
        votesCount: 165,
        voterRollNos: ['2024CS104'],
      },
      {
        id: 'opt-3-2',
        text: 'Current timing (till 9:00 PM) is adequate',
        votesCount: 24,
        voterRollNos: [],
      },
    ],
  },
];

export const SAMPLE_ATTENDANCE: AttendanceRecord = {
  studentRollNo: '2024CS104',
  studentName: 'Aarav Sharma',
  semester: '3rd Semester - CSE',
  totalCollegeDays: 68,
  daysAttended: 58,
  daysAbsent: 10,
  overallPercentage: 85.3,
  subjects: [
    {
      subjectId: 'sub-dbms',
      subjectName: 'Database Management Systems',
      subjectCode: 'CS-302',
      totalClasses: 36,
      attendedClasses: 32,
      absentClasses: 4,
      percentage: 88.9,
      status: 'Good',
    },
    {
      subjectId: 'sub-os',
      subjectName: 'Operating Systems',
      subjectCode: 'CS-304',
      totalClasses: 34,
      attendedClasses: 29,
      absentClasses: 5,
      percentage: 85.3,
      status: 'Good',
    },
    {
      subjectId: 'sub-dsa',
      subjectName: 'Data Structures & Algorithms',
      subjectCode: 'CS-301',
      totalClasses: 40,
      attendedClasses: 36,
      absentClasses: 4,
      percentage: 90.0,
      status: 'Good',
    },
    {
      subjectId: 'sub-cn',
      subjectName: 'Computer Networks',
      subjectCode: 'CS-305',
      totalClasses: 32,
      attendedClasses: 24,
      absentClasses: 8,
      percentage: 75.0,
      status: 'Warning',
    },
  ],
  recentHistory: [
    { date: '2026-10-18', day: 'Friday', status: 'Present', subjectsMarked: ['CS-302', 'CS-304', 'CS-301'] },
    { date: '2026-10-17', day: 'Thursday', status: 'Present', subjectsMarked: ['CS-301', 'CS-305', 'CS-302'] },
    { date: '2026-10-16', day: 'Wednesday', status: 'Absent', subjectsMarked: ['CS-304', 'CS-305'] },
    { date: '2026-10-15', day: 'Tuesday', status: 'Present', subjectsMarked: ['CS-302', 'CS-301', 'CS-304'] },
    { date: '2026-10-14', day: 'Monday', status: 'Leave', subjectsMarked: ['Approved Medical Leave'] },
    { date: '2026-10-11', day: 'Friday', status: 'Present', subjectsMarked: ['CS-302', 'CS-305', 'CS-301'] },
  ],
};

export const SAMPLE_LEAVE_NOTICES: LeaveNotice[] = [
  {
    id: 'leave-101',
    studentRollNo: '2024CS104',
    studentName: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    semester: '3rd Semester',
    startDate: '2026-10-14',
    endDate: '2026-10-14',
    daysCount: 1,
    reason: 'Severe viral fever and physician advised bed rest.',
    category: 'Medical',
    status: 'approved',
    facultyRemarks: 'Medical certificate verified. Approved by H.O.D.',
    reviewedBy: 'Dr. Robert Vance (H.O.D)',
    createdAt: '2026-10-13T18:30:00Z',
  },
  {
    id: 'leave-102',
    studentRollNo: '2024CS104',
    studentName: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    semester: '3rd Semester',
    startDate: '2026-10-25',
    endDate: '2026-10-26',
    daysCount: 2,
    reason: 'Selected to represent Apex Institute at State Inter-Collegiate Coding Hackathon in Bangalore.',
    category: 'Academic Event',
    status: 'pending',
    createdAt: '2026-10-18T10:15:00Z',
  },
  {
    id: 'leave-103',
    studentRollNo: '2024CS088',
    studentName: 'Neha Verma',
    department: 'Computer Science & Engineering',
    semester: '3rd Semester',
    startDate: '2026-10-22',
    endDate: '2026-10-23',
    daysCount: 2,
    reason: 'Attending family wedding ceremony out of station.',
    category: 'Family Emergency',
    status: 'pending',
    createdAt: '2026-10-18T14:00:00Z',
  },
];

export const SAMPLE_GRIEVANCES: GrievanceTicket[] = [
  {
    id: 'grv-001',
    ticketNumber: 'GRV-2026-894',
    studentRollNo: '2024CS104',
    studentName: 'Aarav Sharma',
    isAnonymous: false,
    category: 'Infrastructure',
    subject: 'High latency and intermittent disconnection on CSE Lab 3 Wi-Fi router',
    description: 'During practical sessions, the 5GHz access point in Lab 3 repeatedly disconnects when more than 30 systems run Docker containers or clone GitHub repos.',
    priority: 'Medium',
    status: 'under_review',
    createdAt: '2026-10-15T11:20:00Z',
    actionRemarks: 'System administrator assigned to inspect Cisco router switchboard on Monday.',
    assignedTo: 'Network Administrator & Lab In-charge',
  },
  {
    id: 'grv-002',
    ticketNumber: 'GRV-2026-892',
    isAnonymous: true,
    category: 'Library',
    subject: 'Shortage of Physical Copies for Silberschatz Database System Concepts (7th Ed)',
    description: 'Only 3 copies are currently available in the reserved reference section. Requesting department purchase of 10 additional copies before upcoming end-term exams.',
    priority: 'High',
    status: 'action_taken',
    createdAt: '2026-10-11T16:45:00Z',
    actionRemarks: 'Approved purchase requisition sent to Central Library procurement committee.',
    assignedTo: 'Chief Librarian',
  },
  {
    id: 'grv-003',
    ticketNumber: 'GRV-2026-880',
    studentRollNo: '2024CS095',
    studentName: 'Devansh Roy',
    isAnonymous: false,
    category: 'Academics',
    subject: 'Clash in Assignment submission deadlines for OS and DBMS',
    description: 'Both Unit-3 assignments were scheduled for submission on the same date (Oct 21). Requested a 48-hour staggered deadline.',
    priority: 'Low',
    status: 'resolved',
    createdAt: '2026-10-08T09:10:00Z',
    actionRemarks: 'DBMS assignment deadline extended to Oct 24 by Dr. Vance.',
    assignedTo: 'Dr. Robert Vance (H.O.D)',
  },
];

export const SAMPLE_CLASS_TESTS: OnlineClassTest[] = [
  {
    id: 'test-dbms-101',
    title: 'DBMS Unit 2: Relational Algebra & SQL Mastery Online Test',
    subject: 'Database Management Systems',
    subjectCode: 'CS-302',
    scheduledFor: '2026-10-21 14:00',
    deadline: '2026-10-21 15:30',
    durationMinutes: 45,
    totalMarks: 25,
    createdBy: 'Dr. Robert Vance (H.O.D)',
    status: 'live',
    instructions: 'Timed test. 4 MCQs (3 marks each) + 1 Subjective Query/Derivation question (13 marks). Once started, timer cannot be paused.',
    submissionsCount: 42,
    questions: [
      {
        id: 'q-1',
        type: 'mcq',
        questionText: 'Which relational algebra operation is equivalent to a Cartesian Product followed by a Selection operation with an equality condition?',
        options: [
          'Theta Join (θ-Join)',
          'Equi-Join',
          'Natural Join (⋈)',
          'Outer Join',
        ],
        correctOption: 1,
        marks: 3,
        rubricOrHint: 'Recall that Equi-Join specifically applies equality predicate on the cartesian product.',
      },
      {
        id: 'q-2',
        type: 'mcq',
        questionText: 'In SQL, what is the key difference between WHERE and HAVING clauses?',
        options: [
          'WHERE filters rows before aggregation; HAVING filters groups after aggregation.',
          'HAVING filters rows before aggregation; WHERE filters groups after aggregation.',
          'WHERE can only be used with numeric columns.',
          'There is no difference; they are aliases in ANSI SQL.',
        ],
        correctOption: 0,
        marks: 3,
        rubricOrHint: 'Think about query execution pipeline: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT.',
      },
      {
        id: 'q-3',
        type: 'mcq',
        questionText: 'What is the highest normal form satisfied by a relation if all non-prime attributes are fully functionally dependent on every candidate key and no transitive dependencies exist?',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correctOption: 2,
        marks: 3,
        rubricOrHint: 'Absence of partial dependencies gives 2NF; absence of transitive dependencies satisfies 3NF.',
      },
      {
        id: 'q-4',
        type: 'mcq',
        questionText: 'Which ACID property guarantees that concurrent execution of transactions results in a system state equivalent to executing them serially?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        correctOption: 2,
        marks: 3,
        rubricOrHint: 'Isolation prevents dirty reads, non-repeatable reads, and phantom anomalies.',
      },
      {
        id: 'q-5',
        type: 'subjective',
        questionText: 'Given Employee(emp_id, emp_name, dept_id, salary) and Department(dept_id, dept_name). Write an optimized SQL query using window functions (e.g. DENSE_RANK) to find the 2nd highest paid employee in EACH department. Explain how ties are handled.',
        marks: 13,
        rubricOrHint: 'Provide CTE or subquery with DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk, then filter WHERE rnk = 2.',
      },
    ],
  },
  {
    id: 'test-os-201',
    title: 'Operating Systems: CPU Scheduling & Deadlock Avoidance Test',
    subject: 'Operating Systems',
    subjectCode: 'CS-304',
    scheduledFor: '2026-10-24 10:00',
    deadline: '2026-10-24 11:15',
    durationMinutes: 40,
    totalMarks: 20,
    createdBy: 'Prof. Ananya Sen (Academic Coordinator)',
    status: 'upcoming',
    instructions: 'Comprehensive class test on Round Robin, Priority Scheduling, and Banker’s algorithm safety matrices.',
    submissionsCount: 0,
    questions: [
      {
        id: 'qos-1',
        type: 'mcq',
        questionText: 'In Round Robin scheduling, what happens if the time quantum is chosen to be extremely large (larger than the longest burst time)?',
        options: [
          'It degenerates into Shortest Job First (SJF)',
          'It degenerates into First-Come, First-Served (FCFS)',
          'It leads to severe starvation of short jobs',
          'Context switching overhead skyrockets',
        ],
        correctOption: 1,
        marks: 4,
        rubricOrHint: 'When time slice > longest burst, each process runs to completion upon first selection.',
      },
      {
        id: 'qos-2',
        type: 'subjective',
        questionText: 'Explain the 4 necessary and sufficient Coffman conditions for deadlock to occur. How does the Banker’s Algorithm prevent or avoid deadlocks?',
        marks: 16,
        rubricOrHint: 'Must mention Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait, and safety vector check.',
      },
    ],
  },
];

export const SAMPLE_TEST_SUBMISSIONS: TestSubmission[] = [
  {
    id: 'sub-01',
    testId: 'test-dbms-101',
    studentRollNo: '2024CS104',
    studentName: 'Aarav Sharma',
    submittedAt: '2026-10-21T14:42:00Z',
    answers: {
      'q-1': 1,
      'q-2': 0,
      'q-3': 2,
      'q-4': 2,
      'q-5': 'WITH RankedSalaries AS (SELECT emp_id, emp_name, dept_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rank_num FROM Employee) SELECT emp_id, emp_name, dept_id, salary FROM RankedSalaries WHERE rank_num = 2;',
    },
    mcqScore: 12,
    subjectiveScore: 11,
    totalScore: 23,
    maxScore: 25,
    status: 'evaluated',
    facultyFeedback: 'Excellent implementation of window functions! Accurate handling of ties via DENSE_RANK.',
  },
  {
    id: 'sub-02',
    testId: 'test-dbms-101',
    studentRollNo: '2024CS088',
    studentName: 'Neha Verma',
    submittedAt: '2026-10-21T14:40:00Z',
    answers: {
      'q-1': 1,
      'q-2': 0,
      'q-3': 1,
      'q-4': 2,
      'q-5': 'SELECT * FROM Employee e1 WHERE 1 = (SELECT COUNT(DISTINCT salary) FROM Employee e2 WHERE e2.salary > e1.salary AND e1.dept_id = e2.dept_id);',
    },
    mcqScore: 9,
    subjectiveScore: 9,
    totalScore: 18,
    maxScore: 25,
    status: 'evaluated',
    facultyFeedback: 'Good correlated subquery solution. Window function solution was preferred for scalability.',
  },
  {
    id: 'sub-03',
    testId: 'test-dbms-101',
    studentRollNo: '2024CS112',
    studentName: 'Rohan Mehta',
    submittedAt: '2026-10-21T14:44:00Z',
    answers: {
      'q-1': 0,
      'q-2': 0,
      'q-3': 2,
      'q-4': 1,
      'q-5': 'Used ORDER BY salary DESC LIMIT 1 OFFSET 1 but without partition by department.',
    },
    mcqScore: 6,
    subjectiveScore: 4,
    totalScore: 10,
    maxScore: 25,
    status: 'evaluated',
    facultyFeedback: 'Need to review partitioning per department and ACID properties (Isolation vs Consistency).',
  },
];

