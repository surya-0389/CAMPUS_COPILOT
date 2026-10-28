import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BotMessageSquare,
  BookOpen,
  CalendarCheck,
  BarChart3,
  BrainCircuit,
  FileCheck,
  ClipboardList,
  FileText,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  GraduationCap,
  ShieldCheck,
  Layers,
  Vote,
  LifeBuoy,
  Timer,
  UserCheck,
  Users,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    profile,
    facultyProfile,
    userRole,
    loginAs,
    logout,
    theme,
    toggleTheme,
    assignments,
    setIsDemoModalOpen,
  } = useApp();

  const pendingAssignmentsCount = assignments.filter((a) => !a.completed).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Study Assistant', icon: BotMessageSquare, badge: 'AI' },
    { id: 'subjects', label: 'Subjects & Syllabus', icon: BookOpen },
    { id: 'study-plan', label: 'Study Planner', icon: CalendarCheck },
    { id: 'question-bank', label: 'PYQ Question Bank', icon: FileCheck },
    { id: 'materials', label: 'Study Notes & PDF', icon: FileText },
    { id: 'class-tests', label: 'Online Class Tests', icon: Timer, badge: 'Live' },
    { id: 'quizzes', label: 'Quizzes & Practice', icon: BrainCircuit },
    {
      id: 'assignments',
      label: 'Assignments & Exams',
      icon: ClipboardList,
      count: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
    },
    { id: 'attendance', label: 'Attendance & Leave', icon: UserCheck },
    { id: 'polls', label: 'Campus Polls', icon: Vote },
    { id: 'faculty-directory', label: 'Faculty Directory', icon: Users },
    { id: 'grievance', label: 'Grievance Cell', icon: LifeBuoy },
    { id: 'campus', label: 'Timetable & Notices', icon: Building2 },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-300 z-30 select-none ${
        isSidebarCollapsed ? 'w-[72px]' : 'w-64'
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-slate-800 shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 overflow-hidden text-left cursor-pointer group"
          title="Campus Copilot Dashboard"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-sm font-bold text-white tracking-tight block truncate group-hover:text-blue-400 transition">
                Campus Copilot
              </span>
              <span className="text-[10px] text-slate-400 block truncate leading-none">
                Academic OS
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="w-7 h-7 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-800 transition cursor-pointer shrink-0"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-850'
              }`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                }`}
              />
              {!isSidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {/* Badges */}
              {!isSidebarCollapsed && item.count !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums shrink-0 ${
                    isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {item.count}
                </span>
              )}

              {!isSidebarCollapsed && item.badge && (
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded shrink-0 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Demo CTA */}
      {!isSidebarCollapsed && (
        <div className="p-3 mx-2.5 mb-2 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300">Quick Walkthrough</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug mb-2">
            See the full learning loop in action with sample DBMS course data.
          </p>
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition cursor-pointer text-center"
          >
            Launch 2-Min Demo
          </button>
        </div>
      )}

      {/* Bottom Profile & Utilities */}
      <div className="p-2.5 border-t border-slate-800 space-y-2 shrink-0">
        {/* Theme Toggle & Role Switch */}
        <div className="flex items-center justify-between gap-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                {!isSidebarCollapsed && <span>Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                {!isSidebarCollapsed && <span>Dark</span>}
              </>
            )}
          </button>

          <button
            onClick={() => loginAs(userRole === 'faculty' ? 'student' : 'faculty')}
            className={`py-1.5 px-2 rounded-xl border text-[11px] font-medium transition cursor-pointer truncate ${
              isSidebarCollapsed ? 'w-full' : 'flex-1'
            } ${
              userRole === 'faculty'
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-300 hover:bg-blue-500/20'
            }`}
            title={`Switch role to ${userRole === 'faculty' ? 'Student' : 'Faculty'}`}
          >
            {isSidebarCollapsed
              ? userRole === 'faculty'
                ? 'F'
                : 'S'
              : userRole === 'faculty'
              ? 'Role: Faculty'
              : 'Role: Student'}
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-850/60 border border-slate-800/80">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 min-w-0 cursor-pointer group flex-1"
            title="Open Profile Settings"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                userRole === 'faculty' ? 'bg-purple-600' : 'bg-blue-600'
              }`}
            >
              {userRole === 'faculty' ? 'V' : profile.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition leading-tight">
                  {userRole === 'faculty' ? facultyProfile.name : profile.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate leading-none">
                  {userRole === 'faculty' ? 'CSE Faculty' : profile.semester}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer shrink-0"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
