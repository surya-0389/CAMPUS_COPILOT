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
} from '../types';
import {
  SAMPLE_PROFILE,
  SAMPLE_FACULTY_PROFILE,
  SAMPLE_MATERIALS,
  SAMPLE_STUDY_PLAN,
  SAMPLE_QUIZ,
  SAMPLE_SUBMISSION,
  VERIFIED_CAMPUS_DATA,
} from '../data/sampleData';
import confetti from 'canvas-confetti';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  facultyProfile: FacultyProfile;
  setFacultyProfile: React.Dispatch<React.SetStateAction<FacultyProfile>>;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  materials: StudyMaterial[];
  setMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  activeMaterial: StudyMaterial | null;
  setActiveMaterial: (mat: StudyMaterial | null) => void;
  studyPlan: StudyPlan;
  setStudyPlan: React.Dispatch<React.SetStateAction<StudyPlan>>;
  activeQuiz: Quiz | null;
  setActiveQuiz: (quiz: Quiz | null) => void;
  submissions: QuizSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<QuizSubmission[]>>;
  campusItems: CampusItem[];
  setCampusItems: React.Dispatch<React.SetStateAction<CampusItem[]>>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  isDocsModalOpen: boolean;
  setIsDocsModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  selectedProvider: 'gemini' | 'chatgpt';
  setSelectedProvider: (provider: 'gemini' | 'chatgpt') => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  toggleTaskCompletion: (dayNumber: number, taskId: string) => void;
  injectRemediationTask: (topic: string, extraMinutes: number) => void;
  addQuizSubmission: (sub: QuizSubmission) => void;
  resetToDefaultDemo: () => void;
  showCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('campus_copilot_materials');
    return saved ? JSON.parse(saved) : SAMPLE_MATERIALS;
  });

  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(SAMPLE_MATERIALS[0]);

  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem('campus_copilot_plan');
    return saved ? JSON.parse(saved) : SAMPLE_STUDY_PLAN;
  });

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(SAMPLE_QUIZ);

  const [submissions, setSubmissions] = useState<QuizSubmission[]>(() => {
    const saved = localStorage.getItem('campus_copilot_submissions');
    return saved ? JSON.parse(saved) : [SAMPLE_SUBMISSION];
  });

  const [campusItems, setCampusItems] = useState<CampusItem[]>(VERIFIED_CAMPUS_DATA);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'chatgpt'>(() => {
    return (localStorage.getItem('campus_copilot_ai_provider') as any) || 'gemini';
  });
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const p = localStorage.getItem('campus_copilot_ai_provider') || 'gemini';
    return p === 'chatgpt' ? 'gpt-4o' : 'gemini-3.8-flash';
  });

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

  // Sync with localStorage
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
    localStorage.setItem('campus_copilot_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('campus_copilot_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const showCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore in test environments
    }
  };

  const toggleTaskCompletion = (dayNumber: number, taskId: string) => {
    setStudyPlan((prev) => {
      const updatedDays = prev.days.map((day) => {
        if (day.dayNumber !== dayNumber) return day;
        const updatedTasks = day.tasks.map((task) => {
          if (task.id === taskId) {
            const nextCompleted = !task.completed;
            if (nextCompleted) showCelebration();
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

  const injectRemediationTask = (topic: string, extraMinutes: number = 30) => {
    setStudyPlan((prev) => {
      const updatedDays = [...prev.days];
      if (updatedDays.length > 0) {
        const targetDay = updatedDays[0]; // inject into Day 1 or next available day
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

  const addQuizSubmission = (sub: QuizSubmission) => {
    setSubmissions((prev) => [sub, ...prev]);

    // Update student readiness for subject
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

    // If weak topics exist, trigger adaptive prompt
    if (sub.weakTopics && sub.weakTopics.length > 0 && sub.weakTopics[0] !== 'None! Great work!') {
      injectRemediationTask(sub.weakTopics[0], sub.recommendedExtraMinutes || 30);
    }
  };

  const resetToDefaultDemo = () => {
    setProfile(SAMPLE_PROFILE);
    setMaterials(SAMPLE_MATERIALS);
    setActiveMaterial(SAMPLE_MATERIALS[0]);
    setStudyPlan(SAMPLE_STUDY_PLAN);
    setActiveQuiz(SAMPLE_QUIZ);
    setSubmissions([SAMPLE_SUBMISSION]);
    setCampusItems(VERIFIED_CAMPUS_DATA);
    localStorage.clear();
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
        profile,
        setProfile,
        materials,
        setMaterials,
        activeMaterial,
        setActiveMaterial,
        studyPlan,
        setStudyPlan,
        activeQuiz,
        setActiveQuiz,
        submissions,
        setSubmissions,
        campusItems,
        setCampusItems,
        activeTab,
        setActiveTab,
        isDemoModalOpen,
        setIsDemoModalOpen,
        isDocsModalOpen,
        setIsDocsModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        selectedProvider,
        setSelectedProvider: handleSetProvider,
        selectedModel,
        setSelectedModel,
        toggleTaskCompletion,
        injectRemediationTask,
        addQuizSubmission,
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
