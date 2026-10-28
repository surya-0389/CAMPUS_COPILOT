import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  FacultyProfile,
  UserRole,
  StudyMaterial,
  StudyPlan,
  Quiz,
  QuizSubmission,
  CampusItem,
  AssignmentItem,
  SubjectDetail,
  StudyGoal,
  DailyActivity,
  ChatConversation,
  ThemeMode,
  CampusPoll,
  AttendanceRecord,
  LeaveNotice,
  GrievanceTicket,
  OnlineClassTest,
  TestSubmission,
  FacultyMember,
} from '../types';
import {
  SAMPLE_PROFILE,
  SAMPLE_FACULTY_PROFILE,
  SAMPLE_MATERIALS,
  SAMPLE_STUDY_PLAN,
  SAMPLE_QUIZ,
  SAMPLE_SUBMISSION,
  VERIFIED_CAMPUS_DATA,
  SAMPLE_ASSIGNMENTS,
  SAMPLE_SUBJECT_DETAILS,
  SAMPLE_STUDY_GOALS,
  SAMPLE_WEEKLY_ACTIVITY,
  SAMPLE_CONVERSATIONS,
  SAMPLE_POLLS,
  SAMPLE_ATTENDANCE,
  SAMPLE_LEAVE_NOTICES,
  SAMPLE_GRIEVANCES,
  SAMPLE_CLASS_TESTS,
  SAMPLE_TEST_SUBMISSIONS,
  SAMPLE_FACULTY_DIRECTORY,
} from '../data/sampleData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Authentication & Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  facultyProfile: FacultyProfile;
  setFacultyProfile: React.Dispatch<React.SetStateAction<FacultyProfile>>;
  loginAs: (role: UserRole) => void;
  logout: () => void;

  // Theme & Layout
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Student Profile & Study Goals
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  studyGoals: StudyGoal[];
  setStudyGoals: React.Dispatch<React.SetStateAction<StudyGoal[]>>;
  toggleGoalCompletion: (goalId: string) => void;
  addGoal: (goal: Omit<StudyGoal, 'id' | 'completed' | 'progressPercent'>) => void;

  // Enrolled Subjects & Syllabi
  subjects: SubjectDetail[];
  setSubjects: React.Dispatch<React.SetStateAction<SubjectDetail[]>>;
  toggleTopicCompletion: (subjectId: string, unitId: string, topic: string) => void;
  addSubject: (newSubject: SubjectDetail) => void;
  addTopicToSubject: (subjectId: string, unitNumber: number, topicTitle: string) => void;

  // Study Materials & Notes
  materials: StudyMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  activeMaterial: StudyMaterial | null;
  setActiveMaterial: (mat: StudyMaterial | null) => void;

  // Study Plan
  studyPlan: StudyPlan;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  injectRemediationTask: (topic: string, extraMinutes: number) => void;
  addTaskToPlan: (dayNumber: number, description: string, estimatedMinutes: number, topicTag: string) => void;

  // Assignments & Exams
  assignments: AssignmentItem[];
  setAssignments: React.Dispatch<React.SetStateAction<AssignmentItem[]>>;
  addAssignment: (item: Omit<AssignmentItem, 'id' | 'createdAt'>) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
  addExamSchedule: (subject: string, date: string, totalTopics: number) => void;
  deleteExamSchedule: (id: string) => void;

  // Quizzes & Diagnostic Submissions
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  submissions: QuizSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<QuizSubmission[]>>;
  addQuizSubmission: (sub: QuizSubmission) => void;

  // AI Chat Conversations & Mentorship
  conversations: ChatConversation[];
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  createConversation: (title?: string, mode?: 'detailed' | 'short' | 'code') => string;
  renameConversation: (id: string, newTitle: string) => void;
  deleteConversation: (id: string) => void;
  saveConversationMessages: (id: string, messages: any[], mode?: any, groundingId?: string) => void;
  preloadedAIQuery: { prompt: string; contextSnippet?: string; subject?: string } | null;
  openAIChatWithQuery: (promptText: string, contextSnippet?: string, subject?: string) => void;
  clearPreloadedAIQuery: () => void;

  // Campus Polls & Voting
  polls: CampusPoll[];
  setPolls: React.Dispatch<React.SetStateAction<CampusPoll[]>>;
  votePoll: (pollId: string, optionId: string) => void;
  createPoll: (poll: Omit<CampusPoll, 'id' | 'createdAt' | 'totalVotes' | 'isActive'>) => void;

  // Attendance & Leave Notices
  attendance: AttendanceRecord;
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord>>;
  leaveNotices: LeaveNotice[];
  setLeaveNotices: React.Dispatch<React.SetStateAction<LeaveNotice[]>>;
  draftLeaveNotice: (notice: Omit<LeaveNotice, 'id' | 'createdAt' | 'status'>) => void;
  updateLeaveNoticeStatus: (id: string, status: 'approved' | 'rejected', remarks?: string) => void;

  // Grievance Redressal
  grievances: GrievanceTicket[];
  setGrievances: React.Dispatch<React.SetStateAction<GrievanceTicket[]>>;
  submitGrievance: (ticket: Omit<GrievanceTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => void;
  updateGrievanceStatus: (id: string, status: GrievanceTicket['status'], remarks?: string) => void;

  // Online Class Tests
  classTests: OnlineClassTest[];
  setClassTests: React.Dispatch<React.SetStateAction<OnlineClassTest[]>>;
  createClassTest: (test: Omit<OnlineClassTest, 'id' | 'submissionsCount'>) => void;
  testSubmissions: TestSubmission[];
  setTestSubmissions: React.Dispatch<React.SetStateAction<TestSubmission[]>>;
  submitTest: (sub: Omit<TestSubmission, 'id' | 'submittedAt'>) => void;
  evaluateTestSubmission: (submissionId: string, subjectiveScore: number, feedback: string) => void;

  // Department Faculty Directory
  facultyDirectory: FacultyMember[];

  // Activity & Weekly Tracking
  weeklyActivity: DailyActivity[];
  logDailyStudyTime: (minutes: number) => void;

  // Campus Directory & Official Notices
  campusItems: CampusItem[];
  setCampusItems: React.Dispatch<React.SetStateAction<CampusItem[]>>;
  addCampusNotice: (item: Omit<CampusItem, 'id'>) => void;

  // AI Provider Settings
  selectedProvider: 'gemini' | 'chatgpt';
  setSelectedProvider: (provider: 'gemini' | 'chatgpt') => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // Demo & Modals
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  isNewUserOnboarding: boolean;
  setIsNewUserOnboarding: (val: boolean) => void;

  // Actions
  resetToDefaultDemo: () => void;
  showCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('campus_copilot_theme') as ThemeMode) || 'dark';
  });

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('campus_copilot_sidebar_collapsed') === 'true';
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('campus_copilot_role') as UserRole) || 'student';
  });

  const [facultyProfile, setFacultyProfile] = useState<FacultyProfile>(() => {
    const saved = localStorage.getItem('campus_copilot_faculty_profile');
    return saved ? JSON.parse(saved) : SAMPLE_FACULTY_PROFILE;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('campus_copilot_auth') === 'true';
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('campus_copilot_profile');
    return saved ? JSON.parse(saved) : SAMPLE_PROFILE;
  });

  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem('campus_copilot_goals');
    return saved ? JSON.parse(saved) : SAMPLE_STUDY_GOALS;
  });

  const [subjects, setSubjects] = useState<SubjectDetail[]>(() => {
    const saved = localStorage.getItem('campus_copilot_subjects');
    return saved ? JSON.parse(saved) : SAMPLE_SUBJECT_DETAILS;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('campus_copilot_materials');
    return saved ? JSON.parse(saved) : SAMPLE_MATERIALS;
  });

  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(SAMPLE_MATERIALS[0]);

  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem('campus_copilot_plan');
    return saved ? JSON.parse(saved) : SAMPLE_STUDY_PLAN;
  });

  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    const saved = localStorage.getItem('campus_copilot_assignments');
    return saved ? JSON.parse(saved) : SAMPLE_ASSIGNMENTS;
  });

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(SAMPLE_QUIZ);

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem('campus_copilot_submissions');
    return saved ? JSON.parse(saved) : [SAMPLE_SUBMISSION];
  });

  const [conversations, setConversations] = useState<ChatConversation[]>(() => {
    const saved = localStorage.getItem('campus_copilot_conversations');
    return saved ? JSON.parse(saved) : SAMPLE_CONVERSATIONS;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );

  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>(() => {
    const saved = localStorage.getItem('campus_copilot_activity');
    return saved ? JSON.parse(saved) : SAMPLE_WEEKLY_ACTIVITY;
  });

  const [campusItems, setCampusItems] = useState<CampusItem[]>(VERIFIED_CAMPUS_DATA);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isNewUserOnboarding, setIsNewUserOnboarding] = useState<boolean>(false);

  // Preloaded query for AI Discuss features
  const [preloadedAIQuery, setPreloadedAIQuery] = useState<{
    prompt: string;
    contextSnippet?: string;
    subject?: string;
  } | null>(null);

  // Polls & Voting
  const [polls, setPolls] = useState<CampusPoll[]>(() => {
    const saved = localStorage.getItem('campus_copilot_polls');
    return saved ? JSON.parse(saved) : SAMPLE_POLLS;
  });

  // Attendance
  const [attendance, setAttendance] = useState<AttendanceRecord>(() => {
    const saved = localStorage.getItem('campus_copilot_attendance');
    return saved ? JSON.parse(saved) : SAMPLE_ATTENDANCE;
  });

  // Leave notices
  const [leaveNotices, setLeaveNotices] = useState<LeaveNotice[]>(() => {
    const saved = localStorage.getItem('campus_copilot_leave_notices');
    return saved ? JSON.parse(saved) : SAMPLE_LEAVE_NOTICES;
  });

  // Grievances
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(() => {
    const saved = localStorage.getItem('campus_copilot_grievances');
    return saved ? JSON.parse(saved) : SAMPLE_GRIEVANCES;
  });

  // Online Class Tests
  const [classTests, setClassTests] = useState<OnlineClassTest[]>(() => {
    const saved = localStorage.getItem('campus_copilot_class_tests');
    return saved ? JSON.parse(saved) : SAMPLE_CLASS_TESTS;
  });

  // Class Test Submissions
  const [testSubmissions, setTestSubmissions] = useState<TestSubmission[]>(() => {
    const saved = localStorage.getItem('campus_copilot_test_submissions');
    return saved ? JSON.parse(saved) : SAMPLE_TEST_SUBMISSIONS;
  });

  // Faculty Directory
  const [facultyDirectory] = useState<FacultyMember[]>(SAMPLE_FACULTY_DIRECTORY);


  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'chatgpt'>(() => {
    return (localStorage.getItem('campus_copilot_ai_provider') as any) || 'gemini';
  });

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const p = localStorage.getItem('campus_copilot_ai_provider') || 'gemini';
    return p === 'chatgpt' ? 'gpt-4o' : 'gemini-3.8-flash';
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('campus_copilot_theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSetProvider = (p: 'gemini' | 'chatgpt') => {
    setSelectedProvider(p);
    setSelectedModel(p === 'chatgpt' ? 'gpt-4o' : 'gemini-3.8-flash');
    localStorage.setItem('campus_copilot_ai_provider', p);
  };

  const loginAs = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('campus_copilot_role', role);
    localStorage.setItem('campus_copilot_auth', 'true');
    setActiveTab('dashboard');
    showCelebration();
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('campus_copilot_auth');
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('campus_copilot_sidebar_collapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_faculty_profile', JSON.stringify(facultyProfile));
  }, [facultyProfile]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_goals', JSON.stringify(studyGoals));
  }, [studyGoals]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_activity', JSON.stringify(weeklyActivity));
  }, [weeklyActivity]);

  const showCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore in test environments
    }
  };

  // Study plan task toggle
  const toggleTaskCompletion = (dayNumber: number, taskId: string) => {
    setStudyPlan((prev) => {
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const updatedTasks = day.tasks.map((task) => {
          if (task.id === taskId) {
            const nextCompleted = !task.completed;
            if (nextCompleted) {
              showCelebration();
              logDailyStudyTime(task.estimatedMinutes);
            }
            return { ...task, completed: nextCompleted };
          }
          return task;
        });
        const allCompleted = updatedTasks.every((t) => t.completed);
        return { ...day, tasks: updatedTasks, isCompleted: allCompleted };
      });
      return { ...prev, days: updatedDays };
    });
  };

  const addTaskToPlan = (dayNumber: number, description: string, estimatedMinutes: number, topicTag: string) => {
    setStudyPlan((prev) => {
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const newTask = {
          id: `task-${Date.now()}`,
          description,
          estimatedMinutes,
          completed: false,
          topicTag,
        };
        return {
          ...day,
          tasks: [...day.tasks, newTask],
          durationMinutes: day.durationMinutes + estimatedMinutes,
        };
      });
      return { ...prev, days: updatedDays };
    });
    showCelebration();
  };

  const injectRemediationTask = (topic: string, extraMinutes: number = 30) => {
    setStudyPlan((prev) => {
      const updatedDays = [...prev.days];
      if (updatedDays.length > 0) {
        const targetDay = updatedDays[0];
        const remedialTaskId = `remedial-${Date.now()}`;
        const newRemedialTask = {
          id: remedialTaskId,
          description: `[ADAPTIVE REMEDIATION] Review ${topic} core rules & solve 5 edge-case problems (added from Quiz weakness)`,
          estimatedMinutes: extraMinutes,
          completed: false,
          topicTag: topic,
          isWeakAreaRemediation: true,
        };
        targetDay.tasks.push(newRemedialTask);
        targetDay.durationMinutes += extraMinutes;
      }
      return {
        ...prev,
        weakFocusTopics: Array.from(new Set([...prev.weakFocusTopics, topic])),
        adaptiveNote: `⚠️ Adaptive feedback loop active: Injected ${extraMinutes}-min remediation drill for "${topic}" into today's schedule.`,
        updatedAt: new Date().toISOString(),
      };
    });
    showCelebration();
  };

  // Study goals
  const toggleGoalCompletion = (goalId: string) => {
    setStudyGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const next = !g.completed;
          if (next) showCelebration();
          return { ...g, completed: next, progressPercent: next ? 100 : Math.max(20, g.progressPercent) };
        }
        return g;
      })
    );
  };

  const addGoal = (goal: Omit<StudyGoal, 'id' | 'completed' | 'progressPercent'>) => {
    const newGoal: StudyGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      completed: false,
      progressPercent: 10,
    };
    setStudyGoals((prev) => [newGoal, ...prev]);
    showCelebration();
  };

  // Subjects syllabus topic toggle
  const toggleTopicCompletion = (subjectId: string, unitId: string, topic: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedUnits = sub.units.map((unit) => {
          if (unit.id !== unitId) return unit;
          const isDone = unit.completedTopics.includes(topic);
          const nextTopics = isDone
            ? unit.completedTopics.filter((t) => t !== topic)
            : [...unit.completedTopics, topic];
          return { ...unit, completedTopics: nextTopics };
        });

        // Recalculate readiness score
        const total = updatedUnits.reduce((sum, u) => sum + u.topics.length, 0);
        const done = updatedUnits.reduce((sum, u) => sum + u.completedTopics.length, 0);
        const readinessScore = total > 0 ? Math.round((done / total) * 100) : sub.readinessScore;

        return { ...sub, units: updatedUnits, readinessScore };
      })
    );
  };

  // Assignments & Exams
  const addAssignment = (item: Omit<AssignmentItem, 'id' | 'createdAt'>) => {
    const newItem: AssignmentItem = {
      ...item,
      id: `asgn-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAssignments((prev) => [newItem, ...prev]);
    showCelebration();
  };

  const toggleAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = !a.completed;
          if (next) showCelebration();
          return { ...a, completed: next };
        }
        return a;
      })
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addExamSchedule = (subject: string, date: string, totalTopics: number = 10) => {
    const now = new Date();
    const target = new Date(date);
    const daysLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const newExam = {
      id: `exam-${Date.now()}`,
      subject,
      date,
      daysLeft,
      readinessPercentage: 50,
      topicsCovered: 0,
      totalTopics,
    };
    setProfile((prev) => ({
      ...prev,
      examDates: [...prev.examDates, newExam],
    }));
    showCelebration();
  };

  const deleteExamSchedule = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      examDates: prev.examDates.filter((e) => e.id !== id),
    }));
  };

  // Quizzes
  const addQuizSubmission = (sub: QuizSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);

    // Update readiness for subject
    const subject = sub.subject;
    setProfile((prev) => {
      const updatedExams = prev.examDates.map((ex) => {
        if (ex.subject.toLowerCase() === subject.toLowerCase()) {
          const newReadiness = Math.min(100, Math.round((ex.readinessPercentage + sub.percentage) / 2));
          return { ...ex, readinessPercentage: newReadiness };
        }
        return ex;
      });
      return { ...prev, examDates: updatedExams };
    });

    if (sub.weakTopics && sub.weakTopics.length > 0 && sub.weakTopics[0] !== 'None! Great work!') {
      injectRemediationTask(sub.weakTopics[0], sub.recommendedExtraMinutes || 30);
    }
  };

  // AI Chat Conversations
  const createConversation = (title: string = 'New Academic Session', mode: 'detailed' | 'short' | 'code' = 'detailed') => {
    const newId = `conv-${Date.now()}`;
    const newConv: ChatConversation = {
      id: newId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mode,
      groundingMaterialId: activeMaterial?.id,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Hello ${profile.name}! I am your Campus Copilot Academic Mentor. What topic or exam question would you like to master today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: selectedProvider,
          model: selectedModel,
        },
      ],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        if (filtered.length > 0) setActiveConversationId(filtered[0].id);
        else {
          const fresh = {
            id: `conv-${Date.now()}`,
            title: 'New Discussion',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            mode: 'detailed' as const,
            messages: [],
          };
          filtered.push(fresh);
          setActiveConversationId(fresh.id);
        }
      }
      return filtered;
    });
  };

  const saveConversationMessages = (id: string, messages: any[], mode?: any, groundingId?: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            messages,
            mode: mode || c.mode,
            groundingMaterialId: groundingId !== undefined ? groundingId : c.groundingMaterialId,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );
  };

  // Activity tracking
  const logDailyStudyTime = (minutes: number) => {
    setWeeklyActivity((prev) => {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      return prev.map((act) => {
        if (act.day.toLowerCase() === today.toLowerCase()) {
          return {
            ...act,
            minutesSpent: act.minutesSpent + minutes,
            tasksCompleted: act.tasksCompleted + 1,
          };
        }
        return act;
      });
    });
  };

  // Additional persistent state sync
  useEffect(() => {
    localStorage.setItem('campus_copilot_polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_leave_notices', JSON.stringify(leaveNotices));
  }, [leaveNotices]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_class_tests', JSON.stringify(classTests));
  }, [classTests]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_test_submissions', JSON.stringify(testSubmissions));
  }, [testSubmissions]);

  // AI Discussion preload bridge
  const openAIChatWithQuery = (promptText: string, contextSnippet?: string, subject?: string) => {
    setPreloadedAIQuery({
      prompt: promptText,
      contextSnippet,
      subject,
    });
    setActiveTab('ai-chat');
  };

  const clearPreloadedAIQuery = () => {
    setPreloadedAIQuery(null);
  };

  // Polls & Voting logic
  const votePoll = (pollId: string, optionId: string) => {
    const voterRoll = profile.rollNo || '2024CS104';
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        // Check if user already voted in any option of this poll
        const alreadyVotedOption = poll.options.find((opt) => (opt.voterRollNos || []).includes(voterRoll));
        if (alreadyVotedOption) {
          // If already voted for this option, no-op; else move vote
          if (alreadyVotedOption.id === optionId) return poll;
          const updatedOptions = poll.options.map((opt) => {
            const rolls = opt.voterRollNos || [];
            if (opt.id === alreadyVotedOption.id) {
              return {
                ...opt,
                votesCount: Math.max(0, (opt.votesCount || opt.votes || 1) - 1),
                voterRollNos: rolls.filter((r) => r !== voterRoll),
              };
            }
            if (opt.id === optionId) {
              return {
                ...opt,
                votesCount: (opt.votesCount || opt.votes || 0) + 1,
                voterRollNos: [...rolls, voterRoll],
              };
            }
            return opt;
          });
          return { ...poll, options: updatedOptions };
        }

        // New vote
        const updatedOptions = poll.options.map((opt) => {
          const rolls = opt.voterRollNos || [];
          if (opt.id === optionId) {
            return {
              ...opt,
              votesCount: (opt.votesCount || opt.votes || 0) + 1,
              voterRollNos: [...rolls, voterRoll],
            };
          }
          return opt;
        });
        return {
          ...poll,
          totalVotes: poll.totalVotes + 1,
          options: updatedOptions,
        };
      })
    );
    showCelebration();
  };

  const createPoll = (pollData: Omit<CampusPoll, 'id' | 'createdAt' | 'totalVotes' | 'isActive'>) => {
    const newPoll: CampusPoll = {
      ...pollData,
      id: `poll-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalVotes: 0,
      isActive: true,
      options: pollData.options.map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        text: opt.text,
        votesCount: 0,
        voterRollNos: [],
      })),
    };
    setPolls((prev) => [newPoll, ...prev]);
    showCelebration();
  };

  // Leave notices logic
  const draftLeaveNotice = (noticeData: Omit<LeaveNotice, 'id' | 'createdAt' | 'status'>) => {
    const newNotice: LeaveNotice = {
      ...noticeData,
      id: `leave-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setLeaveNotices((prev) => [newNotice, ...prev]);
    showCelebration();
  };

  const updateLeaveNoticeStatus = (id: string, status: 'approved' | 'rejected', remarks?: string) => {
    setLeaveNotices((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              facultyRemarks: remarks || (status === 'approved' ? 'Approved by HOD' : 'Application declined'),
              reviewedBy: facultyProfile.name,
            }
          : l
      )
    );
  };

  // Grievance logic
  const submitGrievance = (ticketData: Omit<GrievanceTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    const count = grievances.length + 895;
    const newTicket: GrievanceTicket = {
      ...ticketData,
      id: `grv-${Date.now()}`,
      ticketNumber: `GRV-2026-${count}`,
      createdAt: new Date().toISOString(),
      status: 'submitted',
    };
    setGrievances((prev) => [newTicket, ...prev]);
    showCelebration();
  };

  const updateGrievanceStatus = (id: string, status: GrievanceTicket['status'], remarks?: string) => {
    setGrievances((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status,
              actionRemarks: remarks || g.actionRemarks,
              assignedTo: g.assignedTo || facultyProfile.name,
            }
          : g
      )
    );
  };

  // Online Class Tests logic
  const createClassTest = (testData: Omit<OnlineClassTest, 'id' | 'submissionsCount'>) => {
    const newTest: OnlineClassTest = {
      ...testData,
      id: `test-${Date.now()}`,
      submissionsCount: 0,
    };
    setClassTests((prev) => [newTest, ...prev]);
    showCelebration();
  };

  const submitTest = (submissionData: Omit<TestSubmission, 'id' | 'submittedAt'>) => {
    const newSub: TestSubmission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    setTestSubmissions((prev) => [newSub, ...prev]);
    // increment submissionsCount in classTest
    setClassTests((prev) =>
      prev.map((t) => (t.id === submissionData.testId ? { ...t, submissionsCount: (t.submissionsCount || 0) + 1 } : t))
    );
    showCelebration();
  };

  const evaluateTestSubmission = (submissionId: string, subjectiveScore: number, feedback: string) => {
    setTestSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const total = (sub.mcqScore || sub.score || 0) + subjectiveScore;
        return {
          ...sub,
          subjectiveScore,
          totalScore: total,
          score: total,
          status: 'evaluated',
          facultyFeedback: feedback,
        };
      })
    );
  };

  // Subject and Topic addition for faculty
  const addSubject = (newSubject: SubjectDetail) => {
    setSubjects((prev) => [...prev, newSubject]);
    showCelebration();
  };

  const addTopicToSubject = (subjectId: string, unitNumber: number, topicTitle: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        const updatedUnits = sub.units.map((unit) => {
          if (unit.unitNumber === unitNumber) {
            return {
              ...unit,
              topics: [...unit.topics, topicTitle],
            };
          }
          return unit;
        });
        return { ...sub, units: updatedUnits };
      })
    );
    showCelebration();
  };

  const addCampusNotice = (item: Omit<CampusItem, 'id'>) => {
    const newItem: CampusItem = {
      ...item,
      id: `notice-${Date.now()}`,
    };
    setCampusItems((prev) => [newItem, ...prev]);
    showCelebration();
  };

  // Robust reset to default demo: restores all state & clean local storage
  const resetToDefaultDemo = () => {
    localStorage.clear();
    setProfile(SAMPLE_PROFILE);
    setFacultyProfile(SAMPLE_FACULTY_PROFILE);
    setMaterials(SAMPLE_MATERIALS);
    setActiveMaterial(SAMPLE_MATERIALS[0]);
    setStudyPlan(SAMPLE_STUDY_PLAN);
    setAssignments(SAMPLE_ASSIGNMENTS);
    setSubjects(SAMPLE_SUBJECT_DETAILS);
    setStudyGoals(SAMPLE_STUDY_GOALS);
    setConversations(SAMPLE_CONVERSATIONS);
    setActiveConversationId(SAMPLE_CONVERSATIONS[0].id);
    setWeeklyActivity(SAMPLE_WEEKLY_ACTIVITY);
    setActiveQuiz(SAMPLE_QUIZ);
    setSubmissions([SAMPLE_SUBMISSION]);
    setCampusItems(VERIFIED_CAMPUS_DATA);
    setPolls(SAMPLE_POLLS);
    setAttendance(SAMPLE_ATTENDANCE);
    setLeaveNotices(SAMPLE_LEAVE_NOTICES);
    setGrievances(SAMPLE_GRIEVANCES);
    setClassTests(SAMPLE_CLASS_TESTS);
    setTestSubmissions(SAMPLE_TEST_SUBMISSIONS);
    setPreloadedAIQuery(null);
    setIsNewUserOnboarding(false);
    setIsAuthenticated(true);

    // Save restored state
    localStorage.setItem('campus_copilot_profile', JSON.stringify(SAMPLE_PROFILE));
    localStorage.setItem('campus_copilot_faculty_profile', JSON.stringify(SAMPLE_FACULTY_PROFILE));
    localStorage.setItem('campus_copilot_materials', JSON.stringify(SAMPLE_MATERIALS));
    localStorage.setItem('campus_copilot_plan', JSON.stringify(SAMPLE_STUDY_PLAN));
    localStorage.setItem('campus_copilot_assignments', JSON.stringify(SAMPLE_ASSIGNMENTS));
    localStorage.setItem('campus_copilot_subjects', JSON.stringify(SAMPLE_SUBJECT_DETAILS));
    localStorage.setItem('campus_copilot_goals', JSON.stringify(SAMPLE_STUDY_GOALS));
    localStorage.setItem('campus_copilot_conversations', JSON.stringify(SAMPLE_CONVERSATIONS));
    localStorage.setItem('campus_copilot_activity', JSON.stringify(SAMPLE_WEEKLY_ACTIVITY));
    localStorage.setItem('campus_copilot_submissions', JSON.stringify([SAMPLE_SUBMISSION]));
    localStorage.setItem('campus_copilot_polls', JSON.stringify(SAMPLE_POLLS));
    localStorage.setItem('campus_copilot_attendance', JSON.stringify(SAMPLE_ATTENDANCE));
    localStorage.setItem('campus_copilot_leave_notices', JSON.stringify(SAMPLE_LEAVE_NOTICES));
    localStorage.setItem('campus_copilot_grievances', JSON.stringify(SAMPLE_GRIEVANCES));
    localStorage.setItem('campus_copilot_class_tests', JSON.stringify(SAMPLE_CLASS_TESTS));
    localStorage.setItem('campus_copilot_test_submissions', JSON.stringify(SAMPLE_TEST_SUBMISSIONS));
    localStorage.setItem('campus_copilot_auth', 'true');
    localStorage.setItem('campus_copilot_role', userRole);

    showCelebration();
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
        facultyProfile,
        setFacultyProfile,
        loginAs,
        logout,
        theme,
        setTheme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        activeTab,
        setActiveTab,
        profile,
        setProfile,
        studyGoals,
        setStudyGoals,
        toggleGoalCompletion,
        addGoal,
        subjects,
        setSubjects,
        toggleTopicCompletion,
        addSubject,
        addTopicToSubject,
        materials,
        setMaterials,
        activeMaterial,
        setActiveMaterial,
        studyPlan,
        setStudyPlan,
        toggleTaskCompletion,
        injectRemediationTask,
        addTaskToPlan,
        assignments,
        setAssignments,
        addAssignment,
        toggleAssignment,
        deleteAssignment,
        addExamSchedule,
        deleteExamSchedule,
        activeQuiz,
        setActiveQuiz,
        submissions,
        setSubmissions,
        addQuizSubmission,
        conversations,
        activeConversationId,
        setActiveConversationId,
        createConversation,
        renameConversation,
        deleteConversation,
        saveConversationMessages,
        preloadedAIQuery,
        openAIChatWithQuery,
        clearPreloadedAIQuery,
        polls,
        setPolls,
        votePoll,
        createPoll,
        attendance,
        setAttendance,
        leaveNotices,
        setLeaveNotices,
        draftLeaveNotice,
        updateLeaveNoticeStatus,
        grievances,
        setGrievances,
        submitGrievance,
        updateGrievanceStatus,
        classTests,
        setClassTests,
        createClassTest,
        testSubmissions,
        setTestSubmissions,
        submitTest,
        evaluateTestSubmission,
        facultyDirectory,
        weeklyActivity,
        logDailyStudyTime,
        campusItems,
        setCampusItems,
        addCampusNotice,
        selectedProvider,
        setSelectedProvider: handleSetProvider,
        selectedModel,
        setSelectedModel,
        isDemoModalOpen,
        setIsDemoModalOpen,
        isNewUserOnboarding,
        setIsNewUserOnboarding,
        resetToDefaultDemo,
        showCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
