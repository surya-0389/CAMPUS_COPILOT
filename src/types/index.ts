export type UserRole = 'student' | 'faculty';

export interface StudentProfile {
  name: string;
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
  department: string;
  college: string;
  employeeId: string;
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: string[];
  suggestedActions?: string[];
  provider?: 'gemini' | 'chatgpt';
  model?: string;
  latencyMs?: number;
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

