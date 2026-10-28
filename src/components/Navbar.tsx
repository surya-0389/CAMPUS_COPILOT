import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  RotateCcw,
  Menu,
  X,
  LayoutDashboard,
  BotMessageSquare,
  BookOpenCheck,
  CalendarCheck,
  BarChart3,
  BrainCircuit,
  FileCheck,
  ClipboardList,
  FileText,
  Building2,
  User,
  Sun,
  Moon,
  Sparkles,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    facultyProfile,
    userRole,
    loginAs,
    logout,
    setIsDemoModalOpen,
    selectedProvider,
    setSelectedProvider,
    resetToDefaultDemo,
    theme,
    toggleTheme,
    isNewUserOnboarding,
    setIsNewUserOnboarding,
    assignments,
  } = useApp();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const navSectionLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    chat: 'AI Study Assistant',
    subjects: 'Subjects & Syllabus',
    'study-plan': 'Study Planner',
    progress: 'Progress Analytics',
    quizzes: 'Quizzes & Practice',
    'question-bank': 'PYQ Question Bank',
    assignments: 'Assignments & Exams',
    materials: 'Study Notes & Materials',
    'class-tests': 'Online Class Tests',
    attendance: 'Attendance & Leave',
    polls: 'Campus Polls',
    'faculty-directory': 'Faculty Directory',
    grievance: 'Grievance Cell',
    campus: 'Timetable & Notices',
    profile: 'Profile & Settings',
  };

  const mobileNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Study Assistant', icon: BotMessageSquare },
    { id: 'subjects', label: 'Subjects & Syllabus', icon: BookOpenCheck },
    { id: 'study-plan', label: 'Study Planner', icon: CalendarCheck },
    { id: 'question-bank', label: 'PYQ Papers', icon: FileCheck },
    { id: 'materials', label: 'Study Notes', icon: FileText },
    { id: 'class-tests', label: 'Online Tests', icon: BrainCircuit },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance & Leave', icon: CalendarCheck },
    { id: 'polls', label: 'Campus Polls', icon: LayoutDashboard },
    { id: 'faculty-directory', label: 'Faculty Directory', icon: User },
    { id: 'grievance', label: 'Grievances', icon: FileText },
    { id: 'campus', label: 'Timetable & Notices', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const pendingAssignments = assignments.filter((a) => !a.completed).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 gap-4">
          {/* Left Zone: Brand & Contextual Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Brand */}
            <div
              onClick={() => setActiveTab('dashboard')}
              className="lg:hidden flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-white truncate">Campus Copilot</span>
            </div>

            {/* Desktop Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">{profile.college}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold text-white">
                {navSectionLabels[activeTab] || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right Zone: Controls, AI Switcher, Theme & Share */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Onboarding Mode Toggle (to test empty state vs populated state) */}
            <button
              onClick={() => setIsNewUserOnboarding(!isNewUserOnboarding)}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isNewUserOnboarding
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
              }`}
              title="Toggle preview between populated demo and new-student onboarding"
            >
              <span>{isNewUserOnboarding ? '🌱 Onboarding Mode' : '📊 Full Demo Data'}</span>
            </button>

            {/* AI Provider Switcher */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedProvider('gemini')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedProvider === 'gemini'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Google Gemini 3.8 Flash model"
              >
                <span>♊ Gemini</span>
              </button>
              <button
                onClick={() => setSelectedProvider('chatgpt')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  selectedProvider === 'chatgpt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ChatGPT (OpenAI GPT-4o) model"
              >
                <span>🤖 ChatGPT</span>
              </button>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-500" />
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default? All state will be restored.')) {
                  resetToDefaultDemo();
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs transition cursor-pointer"
              title="Reset state to default demo"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 animate-fade-in space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-850 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => {
                loginAs(userRole === 'faculty' ? 'student' : 'faculty');
                setIsMobileDrawerOpen(false);
              }}
              className="text-amber-400 font-semibold"
            >
              Switch Role ({userRole === 'faculty' ? 'Student' : 'Faculty'})
            </button>

            <button
              onClick={() => {
                logout();
                setIsMobileDrawerOpen(false);
              }}
              className="text-rose-400 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
