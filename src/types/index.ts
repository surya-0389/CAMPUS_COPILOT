export type UserRole = 'student' | 'faculty';

export interface StudentProfile {
  name: string;
  rollNo?: string;
  dob?: string;
  college: string;
  course: string;
  branch: string;
  semester: string;
  dailyStudyHours: number;
  studyStreakDays: number;
  subjects: string[];
  examDates: ExamSchedule[];
}

export interface FacultyProfile {
  id: string;
  name: string;
  title: string;
  designation?: string; // e.g. "Head of Department (H.O.D)", "Academic Coordinator & Associate Professor"
  qualification?: string; // e.g. "Ph.D. in Computer Science (IIT Bombay), M.Tech (Gold Medalist)"
  department: string;
  college: string;
  employeeId: string;
  contactNumber?: string;
  email?: string;
  officeRoom?: string;
  coursesTaught: string[];
  activeClassTests: Array<{
    id: string;
    title: string;
    subject: string;
    date: string;
    averageScore: number;
    totalStudents: number;
    status: 'evaluated' | 'upcoming';
  }>;
  papersUploadedCount: number;
  weakTopicsIdentified: Array<{
    topic: string;
    subject: string;
    classAccuracy: number;
    studentsAffected: number;
  }>;
}

export interface ExamSchedule {
  id: string;
  subject: string;
  date: string; // YYYY-MM-DD
  daysLeft: number;
  readinessPercentage: number;
  topicsCovered: number;
  totalTopics: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  fileType: 'pdf' | 'text' | 'syllabus';
  uploadDate: string;
  rawText: string;
  detectedTopics: string[];
  importantTopics: string[];
  difficultyEstimation: {
    level: 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard';
    score: number; // 1 - 10
    reasoning: string;
  };
  summary: string;
}

export interface StudyTask {
  id: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  topicTag: string;
  isWeakAreaRemediation?: boolean;
}

export interface StudyDay {
  dayNumber: number;
  date: string;
  topics: string[];
  durationMinutes: number;
  tasks: StudyTask[];
  isCompleted?: boolean;
}

export interface StudyPlan {
  id: string;
  subject: string;
  examDate: string;
  availableHoursPerDay: number;
  preparationLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  weakFocusTopics: string[];
  days: StudyDay[];
  createdAt: string;
  updatedAt: string;
  adaptiveNote?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topicTag: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  topic: string;
  materialId?: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  topic: string;
  answers: Record<string, number>;
  score: number;
  totalQuestions: number;
  percentage: number;
  topicBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  weakTopics: string[];
  strongTopics: string[];
  recommendation: string;
  recommendedExtraMinutes: number;
  timestamp: string;
}

export interface CampusItem {
  id: string;
  category: 'exam_timetable' | 'class_timetable' | 'notice' | 'department' | 'facility' | 'library' | 'announcement';
  title: string;
  content: string;
  department?: string;
  date?: string;
  location?: string;
  verifiedSource: string;
}

export interface ChatAttachment {
  name: string;
  type: 'image' | 'doc' | 'pdf';
  size: number;
  dataUrl?: string;
  extractedText?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachment?: ChatAttachment;
  citations?: string[];
  suggestedActions?: string[];
  provider?: 'gemini' | 'chatgpt';
  model?: string;
  latencyMs?: number;
  isStreaming?: boolean;
}

// -------------------------------------------------------------
// QUESTION BANK MODULE TYPES
// -------------------------------------------------------------
export type ExamCategory = 'pyq' | 'internal_test' | 'mid_term' | 'practice';

export interface QuestionPaper {
  id: string;
  university_name: string;
  college_name?: string;
  course: string;
  branch: string;
  semester: string;
  subject_id: string;
  title: string;
  exam_category: ExamCategory;
  exam_session: string;
  academic_year: string;
  exam_date?: string;
  total_marks?: number;
  duration_minutes?: number;
  file_path?: string;
  source_description: string;
  verification_status: 'verified' | 'unverified' | 'under_review';
  uploaded_by: string;
  question_count?: number;
  solution_available?: boolean;
  created_at?: string;
}

export interface QuestionBankItem {
  id: string;
  question_paper_id?: string;
  assignment_id?: string;
  subject_id: string;
  topic_id?: string;
  question_text: string;
  question_number?: string;
  marks?: number;
  question_type: 'mcq' | 'descriptive' | 'numerical' | 'coding' | 'short_answer';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  extracted_text?: string;
  extraction_status: 'pending' | 'extracted' | 'manual_verified' | 'failed';
  options?: string[];
  correct_option?: number;
  has_solution?: boolean;
  is_saved?: boolean;
  created_at?: string;
}

export interface QuestionSolution {
  id: string;
  question_id: string;
  solution_text: string;
  short_answer?: string;
  detailed_explanation?: string;
  hint_text?: string;
  code_snippet?: string;
  diagram_description?: string;
  solution_type: 'verified' | 'faculty_provided' | 'ai_generated';
  explanation_level: 'short' | 'detailed' | 'step_by_step';
  source_description: string;
  verification_status: 'verified' | 'unverified' | 'ai_provisional';
  generated_by_model?: string;
  created_at?: string;
}

export interface QuestionAssignment {
  id: string;
  subject_id: string;
  semester: string;
  title: string;
  assignment_number: number;
  description: string;
  academic_year: string;
  max_marks?: number;
  due_date?: string;
  file_storage_key?: string;
  reference_material?: string;
  uploaded_by: string;
  visibility: 'public' | 'student_only' | 'faculty_only';
  verification_status: 'verified' | 'unverified';
  question_count?: number;
  questions?: QuestionBankItem[];
  is_completed?: boolean;
  is_attempted?: boolean;
  created_at?: string;
}

export interface PracticeAttemptData {
  id: string;
  student_id: string;
  question_paper_id?: string;
  subject_id?: string;
  practice_mode: 'practice' | 'mock_exam';
  started_at: string;
  submitted_at?: string;
  total_questions: number;
  correct_answers: number;
  score_percentage?: number;
  time_spent_seconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface SavedQuestionItem {
  saved_id: string;
  notes?: string;
  created_at: string;
  question: QuestionBankItem;
}

export interface QuestionBankAnalyticsData {
  student_id: string;
  total_attempts: number;
  total_questions_practiced: number;
  total_correct: number;
  overall_accuracy_percentage: number;
  subject_performance: Record<string, { accuracy: number; questions_attempted: number; status: string }>;
  topic_breakdown: Record<string, { attempted: number; correct: number; percentage: number }>;
  weak_topics: string[];
  strong_topics: string[];
  recommended_pyqs: Array<{ paper_id: string; title: string; recommended_reason: string; subject: string; question_count: number }>;
  mentor_recommendation: string;
}

export interface RepeatedQuestionData {
  primary_question_id: string;
  topic: string;
  question_text: string;
  paper_title: string;
  academic_year: string;
  occurrence_count: number;
  historical_occurrences: Array<{
    question_id: string;
    question_text: string;
    paper_title: string;
    academic_year: string;
    match_type: 'Exact Repeat' | 'High Similarity Variant';
  }>;
}

export type AIProvider = 'gemini' | 'chatgpt';

export interface AIProviderInfo {
  id: AIProvider;
  name: string;
  model: string;
  tag: string;
  status: 'connected' | 'ready' | 'simulated';
  badgeColor: string;
  description: string;
}

export type ThemeMode = 'dark' | 'light';

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  maxMarks: number;
  completed: boolean;
  score?: number;
  fileAttachment?: string;
  createdAt: string;
}

export interface SubjectUnit {
  id: string;
  unitNumber: number;
  title: string;
  topics: string[];
  completedTopics: string[];
}

export interface SubjectDetail {
  id: string;
  name: string;
  code: string;
  instructor?: string;
  credits: number;
  units: SubjectUnit[];
  examDate?: string;
  readinessScore: number;
  notesCount: number;
  pyqCount: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  groundingMaterialId?: string; // id of specific material or 'all'
  mode: 'detailed' | 'short' | 'code';
}

export interface StudyGoal {
  id: string;
  title: string;
  targetDate: string;
  progressPercent: number;
  category: 'Exam Prep' | 'Concept Mastery' | 'Assignment' | 'Weekly Hours';
  completed: boolean;
}

export interface DailyActivity {
  day: string;
  date: string;
  minutesSpent: number;
  tasksCompleted: number;
  targetMinutes: number;
}

// -------------------------------------------------------------
// CAMPUS POLLS & VOTING
// -------------------------------------------------------------
export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
  votes?: number;
  voterRollNos?: string[];
}

export interface CampusPoll {
  id: string;
  question: string;
  description?: string;
  category: 'Academic' | 'Campus Life' | 'Event' | 'Curriculum' | 'General' | 'academic' | 'campus_life' | 'exam' | 'facilities';
  createdBy: string;
  creatorRole: string;
  createdAt: string;
  expiresAt?: string;
  endDate?: string;
  isActive?: boolean;
  status?: 'active' | 'closed';
  totalVotes: number;
  options: PollOption[];
  allowedVoters?: 'all' | 'students_only' | 'faculty_only';
  targetAudience?: string;
  hasVoted?: boolean;
  userVotedOptionId?: string;
}

// -------------------------------------------------------------
// ATTENDANCE & LEAVE NOTICE
// -------------------------------------------------------------
export interface SubjectAttendance {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  faculty?: string;
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  percentage: number;
  status: 'Good' | 'Warning' | 'Critical';
}

export interface AttendanceRecord {
  studentRollNo: string;
  studentName: string;
  semester: string;
  totalCollegeDays: number;
  daysAttended: number;
  daysAbsent: number;
  attendedDays?: number;
  absentDays?: number;
  overallPercentage: number;
  subjects: SubjectAttendance[];
  recentHistory: Array<{
    date: string;
    day: string;
    status: 'Present' | 'Absent' | 'Leave';
    subjectsMarked: string[];
  }>;
}

export interface LeaveNotice {
  id: string;
  studentRollNo: string;
  studentName: string;
  department?: string;
  semester?: string;
  startDate: string;
  endDate: string;
  daysCount?: number;
  reason: string;
  subject?: string;
  letterContent?: string;
  recipientFaculty?: string;
  category?: 'Medical' | 'Personal' | 'Academic Event' | 'Family Emergency';
  documentProof?: string;
  status: 'pending' | 'approved' | 'rejected';
  facultyRemarks?: string;
  reviewedBy?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// GRIEVANCE REDRESSAL
// -------------------------------------------------------------
export interface GrievanceTicket {
  id: string;
  ticketNumber?: string;
  studentRollNo?: string;
  studentName?: string;
  isAnonymous: boolean;
  category: 'Academics' | 'Hostel & Mess' | 'Library' | 'Examinations' | 'Infrastructure' | 'Faculty/Staff' | 'Anti-Ragging' | 'Other' | 'academic' | 'infrastructure' | 'hostel' | 'library' | 'examination' | 'harassment' | 'other';
  subject: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | 'low' | 'medium' | 'high' | 'urgent';
  status: 'submitted' | 'under_review' | 'action_taken' | 'resolved';
  createdAt: string;
  submittedDate?: string;
  actionRemarks?: string;
  resolutionNotes?: string;
  assignedTo?: string;
}

// -------------------------------------------------------------
// ONLINE CLASS TESTS
// -------------------------------------------------------------
export interface ClassTestQuestion {
  id: string;
  questionText?: string;
  text?: string;
  type: 'mcq' | 'subjective';
  options?: string[];
  correctOption?: number;
  correctAnswer?: string;
  sampleAnswer?: string;
  marks: number;
  rubricOrHint?: string;
}

export interface OnlineClassTest {
  id: string;
  title: string;
  subject: string;
  subjectCode?: string;
  scheduledFor?: string;
  deadline?: string;
  endDate?: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks?: number;
  createdBy: string;
  status: 'upcoming' | 'live' | 'closed' | 'active';
  instructions?: string;
  questions: ClassTestQuestion[];
  submissionsCount?: number;
}

export interface TestSubmission {
  id: string;
  testId: string;
  studentRollNo: string;
  studentName: string;
  submittedAt: string;
  answers: Record<string, string | number>;
  mcqScore?: number;
  subjectiveScore?: number;
  totalScore?: number;
  score?: number;
  totalMarks?: number;
  maxScore?: number;
  passed?: boolean;
  status?: 'evaluated' | 'pending_evaluation';
  feedback?: string;
  facultyFeedback?: string;
}

// -------------------------------------------------------------
// DEPARTMENT FACULTY DIRECTORY
// -------------------------------------------------------------
export interface FacultyMember {
  id: string;
  name: string;
  designation: string; // e.g. "Head of Department (H.O.D) & Professor", "Academic Coordinator & Associate Professor"
  department: string;
  qualification: string;
  specialization: string | string[];
  email: string;
  contactNumber: string;
  officeRoom: string;
  experienceYears?: number;
  courses: string[];
  photoUrl: string;
  cabinHours?: string;
  officeHours?: string;
}


