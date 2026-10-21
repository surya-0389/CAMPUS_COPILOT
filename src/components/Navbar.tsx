import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  CalendarCheck,
  BrainCircuit,
  BarChart3,
  Building2,
  BotMessageSquare,
  User,
  Sparkles,
  BookOpen,
  RotateCcw,
  FileCheck,
  Share2,
  ChevronDown,
  Cpu,
  Globe,
  Zap,
  LogOut,
  Users,
  ShieldCheck,
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
    setIsDocsModalOpen,
    setIsExportModalOpen,
    selectedProvider,
    setSelectedProvider,
    resetToDefaultDemo,
  } = useApp();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Core primary tabs
  const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Subjects & Notes', icon: FileText },
    { id: 'question-bank', label: 'Question Bank', icon: FileCheck },
    { id: 'study-plan', label: 'Study Plan', icon: CalendarCheck },
    { id: 'quizzes', label: 'Quizzes', icon: BrainCircuit },
  ];

  // Secondary tabs in dropdown / extended
  const secondaryNavItems = [
    { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'campus', label: 'Campus Knowledge', icon: Building2 },
    { id: 'chat', label: 'AI Academic Mentor', icon: BotMessageSquare },
    { id: 'profile', label: 'Student Profile', icon: User },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    setIsMoreMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl transition-all duration-200">
      {/* Top Banner - Product Identity & Quick Utilities */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950/80 to-slate-950 px-3 sm:px-6 py-1.5 border-b border-indigo-900/40 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="font-bold text-white tracking-wide flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CAMPUS COPILOT
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden md:inline italic text-slate-300 truncate">
            &quot;ChatGPT answers. Google finds. Campus Copilot turns your syllabus into daily action.&quot;
          </span>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* AI Engine Switcher in Top Bar */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950/80 border border-slate-700/80 text-[11px]">
            <button
              onClick={() => setSelectedProvider('gemini')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                selectedProvider === 'gemini'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Google Gemini 3.8 Flash model"
            >
              <span>♊ Gemini</span>
            </button>
            <button
              onClick={() => setSelectedProvider('chatgpt')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                selectedProvider === 'chatgpt'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to ChatGPT (OpenAI GPT-4o) model"
            >
              <span>🤖 ChatGPT</span>
            </button>
          </div>

          <button
            onClick={() => setIsDocsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[11px]"
            title="System architecture & API specs"
          >
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span className="hidden sm:inline">Docs</span>
          </button>

          <button
            onClick={resetToDefaultDemo}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-[11px]"
            title="Reset to fresh demo (Alex, 3rd Sem, DBMS)"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16 gap-2">
          {/* Brand & College */}
          <div
            onClick={() => handleTabSelect('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-blue-400 transition">
                  Campus Copilot
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">
                  AI Academic OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[140px] sm:max-w-xs leading-none">
                {profile.college}
              </p>
            </div>
          </div>

          {/* Desktop Navigation (>= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  secondaryNavItems.some((s) => s.id === activeTab)
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabSelect(item.id)}
                        className={`w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-left transition cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Deploy & LinkedIn Share Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Get live deploy link, post to LinkedIn, & push to GitHub"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy &amp; Share</span>
            </button>

            {/* 2-Minute Demo Trigger */}
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden xs:inline">2-Min Demo</span>
            </button>

            {/* Profile & Role Pill with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer hover:opacity-90 transition p-1 rounded-xl"
                title="Profile & Role options"
              >
                <div
                  className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shadow-inner ${
                    userRole === 'faculty'
                      ? 'bg-purple-950 border-purple-500 text-purple-300'
                      : 'bg-blue-950 border-blue-500 text-blue-300'
                  }`}
                >
                  {userRole === 'faculty' ? 'V' : profile.name.charAt(0)}
                </div>
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <p className="font-bold text-white text-[11px] truncate max-w-[100px]">
                    {userRole === 'faculty' ? facultyProfile.name : profile.name}
                  </p>
                  <p
                    className={`text-[9px] uppercase font-bold tracking-wider ${
                      userRole === 'faculty' ? 'text-purple-400' : 'text-blue-400'
                    }`}
                  >
                    {userRole === 'faculty' ? 'Faculty HOD' : 'Student'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile & Role Dropdown Menu */}
              {isProfileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-3 z-50 animate-fade-in space-y-3"
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-xs font-bold text-white">
                      {userRole === 'faculty' ? facultyProfile.name : profile.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {userRole === 'faculty' ? facultyProfile.department : `${profile.course} ${profile.branch}`}
                    </p>
                    <span
                      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        userRole === 'faculty'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      Active Role: {userRole}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => {
                        handleTabSelect('profile');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>View Profile Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        loginAs(userRole === 'faculty' ? 'student' : 'faculty');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-400" />
                      <span>Switch to {userRole === 'faculty' ? 'Student (Alex)' : 'Faculty (Dr. Vance)'}</span>
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out &amp; Welcome Gateway</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet Horizontal Scroll Navigation (Between 640px and 1024px) */}
        <div className="hidden sm:flex lg:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-800/80">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile App Bottom Navigation Bar (< 640px) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => handleTabSelect('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'dashboard' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleTabSelect('materials')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'materials' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          <span>Notes</span>
        </button>

        <button
          onClick={() => handleTabSelect('question-bank')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'question-bank' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileCheck className="w-4 h-4 mb-0.5" />
          <span>PYQ Bank</span>
        </button>

        <button
          onClick={() => handleTabSelect('study-plan')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'study-plan' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CalendarCheck className="w-4 h-4 mb-0.5" />
          <span>Plan</span>
        </button>

        <button
          onClick={() => handleTabSelect('chat')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            activeTab === 'chat' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BotMessageSquare className="w-4 h-4 mb-0.5" />
          <span>AI Mentor</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
            isMobileMenuOpen ? 'text-white' : 'text-slate-400'
          }`}
        >
          <ChevronDown className={`w-4 h-4 mb-0.5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          <span>All</span>
        </button>
      </div>

      {/* Mobile Drawer Menu for Remaining Items */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 bottom-16 z-40 bg-slate-900 border-t border-slate-800 p-4 rounded-t-3xl shadow-2xl animate-fade-in space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-400">
            <span>All Copilot Sections</span>
            <span className="text-[10px] text-blue-400 font-normal">Active: {profile.name}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                loginAs(userRole === 'faculty' ? 'student' : 'faculty');
                setIsMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500/10 text-amber-300 font-semibold text-xs border border-amber-500/20 text-center"
            >
              Switch to {userRole === 'faculty' ? 'Student' : 'Faculty'}
            </button>
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-3 rounded-xl bg-rose-500/10 text-rose-300 font-semibold text-xs border border-rose-500/20 text-center"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
