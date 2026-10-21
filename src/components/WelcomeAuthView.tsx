import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  BrainCircuit,
  FileCheck,
  User,
  Users,
  Award,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  BotMessageSquare,
  Building2,
} from 'lucide-react';

export const WelcomeAuthView: React.FC = () => {
  const {
    loginAs,
    setIsDemoModalOpen,
    setIsDocsModalOpen,
    setIsExportModalOpen,
    selectedProvider,
    setSelectedProvider,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [selectedRole, setSelectedRole] = useState<'student' | 'faculty'>('student');
  const [customName, setCustomName] = useState('');
  const [customCollege, setCustomCollege] = useState('Apex Institute of Science & Technology');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-6 sm:py-12 px-3 sm:px-6 animate-fade-in">
      {/* Top Floating Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-lg shadow-blue-500/10 backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Dual-Core AI OS: Google Gemini 3.8 + ChatGPT GPT-4o</span>
      </div>

      {/* Main Welcoming Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 animate-pulse-glow">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
          CAMPUS COPILOT
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 text-2xl sm:text-4xl mt-1">
            Your AI Academic Operating System
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          ChatGPT gives answers. Google finds information. <strong className="text-white">Campus Copilot</strong> understands your syllabus, notes, exam dates, and available hours to convert them into <span className="text-blue-400 font-semibold">actionable study plans</span> and personalized learning loops.
        </p>

        {/* Global AI Switcher on Welcome Screen */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner">
            <button
              onClick={() => setSelectedProvider('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedProvider === 'gemini'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>♊ Google Gemini 3.8</span>
            </button>
            <button
              onClick={() => setSelectedProvider('chatgpt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedProvider === 'chatgpt'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤖 ChatGPT (GPT-4o)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Selection Container */}
      <div className="w-full max-w-4xl space-y-6">
        {/* Toggle Mode: 1-Click Persona vs Custom Login */}
        <div className="flex items-center justify-center gap-2">
          <div className="p-1 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center text-xs font-semibold">
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'quick' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚡ Instant 1-Click Role Login
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-1.5 rounded-xl transition cursor-pointer ${
                activeTab === 'credentials' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              🔑 Custom Sign-In Form
            </button>
          </div>
        </div>

        {/* 1. Quick Persona Selection Cards */}
        {activeTab === 'quick' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Persona Card */}
            <div className="relative group rounded-3xl bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 hover:border-blue-500/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/20">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full">
                  Primary Flow
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <User className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                    Login as Student
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Experience Alex&apos;s adaptive learning loop &amp; exam preparation
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>STUDENT PROFILE</span>
                    <span className="text-blue-400">3rd Semester B.Tech</span>
                  </div>
                  <p className="font-semibold text-white">Alex • Computer Science &amp; Engineering</p>
                  <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Target: DBMS Final Exam in 4 Days
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Upload Syllabus &amp; Notes (PDF / Text parser)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Study Plan tailored to 3 hrs/day budget</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>40% Weak Topic Diagnosis &amp; Remediation Loop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>University PYQ Bank with Step-by-Step AI Proofs</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={() => loginAs('student')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <span>Enter Student Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Faculty Persona Card */}
            <div className="relative group rounded-3xl bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 hover:border-purple-500/60 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/20">
              <div className="absolute top-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full">
                  Faculty Portal
                </span>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <Users className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition">
                    Login as Faculty Member
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Professor &amp; Departmental exam coordinator controls
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>FACULTY PROFILE</span>
                    <span className="text-purple-400">HOD Computer Science</span>
                  </div>
                  <p className="font-semibold text-white">Dr. Robert Vance • Professor</p>
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    14 Verified Papers &amp; 3 Active Class Tests
                  </p>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Upload PYQs, Class Tests 1/2 &amp; Marking Schemes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Class Weakness Diagnostics (Normalization: 42%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Post Verified Campus Notices &amp; Exam Timetables</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>AI Question Paper Extractor &amp; Solution Approver</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={() => loginAs('faculty')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <span>Enter Faculty Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 2. Custom Sign-In Form */
          <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white text-center">Institutional Single Sign-On</h3>
            <p className="text-xs text-slate-400 text-center">
              Sign in with your campus identity or university credentials
            </p>

            <form onSubmit={handleCustomLogin} className="space-y-4 pt-2">
              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">Select Role:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'student'
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('faculty')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'faculty'
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Faculty</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">Full Name:</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder={selectedRole === 'student' ? 'e.g. Alex Sharma' : 'e.g. Dr. Robert Vance'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-300 font-semibold">Institution / University:</label>
                <input
                  type="text"
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md shadow-blue-600/20 mt-2"
              >
                Sign In as {selectedRole === 'student' ? 'Student' : 'Faculty Member'}
              </button>
            </form>
          </div>
        )}

        {/* Bottom Fast Launch / Demo Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Ready for hackathon judging &amp; evaluation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 2-Min Guided Demo Walkthrough</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Docs &amp; Architecture</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
