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
        {/* Toggle Mode: Student Login vs Faculty Login */}
        <div className="flex items-center justify-center gap-2">
          <div className="p-1 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center text-xs font-semibold shadow-lg">
            <button
              onClick={() => setSelectedRole('student')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition cursor-pointer ${
                selectedRole === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student Portal Login</span>
            </button>
            <button
              onClick={() => setSelectedRole('faculty')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition cursor-pointer ${
                selectedRole === 'faculty'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Faculty &amp; H.O.D Portal Login</span>
            </button>
          </div>
        </div>

        {/* Dynamic Login Box */}
        {selectedRole === 'student' ? (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-500/10 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold uppercase tracking-wider mb-2">
                  Student Verification Portal
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Student Sign-In</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your University Roll Number, Date of Birth, and Full Name to access attendance, PYQ bank, study plans, and live class tests.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginAs('student');
              }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Full Name</span>
                  <span className="text-slate-500 text-[10px]">As per University Admit Card</span>
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Aarav Sharma"
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Roll Number / ID</span>
                    <span className="text-blue-400 text-[10px]">Required</span>
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="2024CS104"
                    placeholder="e.g. 2024CS104"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Date of Birth (DOB)</span>
                    <span className="text-blue-400 text-[10px]">YYYY-MM-DD</span>
                  </label>
                  <input
                    type="date"
                    required
                    defaultValue="2004-05-14"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="text-slate-300 font-medium">📋 Enrolled Program &amp; Institute:</p>
                <p>B.Tech Computer Science &amp; Engineering • 3rd Semester • Apex Institute of Science &amp; Technology</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>Login to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => loginAs('student')}
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                >
                  ⚡ Fast One-Click Demo Access as Aarav Sharma (2024CS104)
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-purple-500/30 shadow-2xl shadow-purple-500/10 space-y-5 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold uppercase tracking-wider mb-2">
                  Academic Faculty &amp; H.O.D Portal
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Faculty Sign-In</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Authenticate using your Faculty Employee ID and departmental password.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginAs('faculty');
              }}
              className="space-y-4 pt-1"
            >
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Faculty Employee ID</span>
                  <span className="text-purple-400 text-[10px]">Format: FAC-DEPT-XXX</span>
                </label>
                <input
                  type="text"
                  required
                  defaultValue="FAC-CSE-094"
                  placeholder="e.g. FAC-CSE-094"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono transition"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center justify-between">
                  <span>Password</span>
                  <span className="text-slate-500 text-[10px]">Institutional Key</span>
                </label>
                <input
                  type="password"
                  required
                  defaultValue="faculty@campus2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="text-purple-300 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Dr. Robert Vance • Head of Department (H.O.D) &amp; Senior Professor
                </p>
                <p>Ph.D. in Computer Science (IIT Delhi) • Cabin: Block B-304 • CSE Dept</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all duration-200 cursor-pointer active:scale-98"
              >
                <span>Login to Faculty Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => loginAs('faculty')}
                  className="text-xs text-purple-400 hover:text-purple-300 underline font-medium cursor-pointer"
                >
                  ⚡ Fast One-Click Demo Access as Dr. Robert Vance (H.O.D)
                </button>
              </div>
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
              <span>Launch Guided Demo Walkthrough</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
