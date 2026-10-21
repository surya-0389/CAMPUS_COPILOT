import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  ShieldCheck,
  Upload,
  FileCheck,
  AlertTriangle,
  Award,
  TrendingUp,
  Calendar,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Bell,
  Clock,
  User,
} from 'lucide-react';

export const FacultyDashboardView: React.FC = () => {
  const {
    facultyProfile,
    setActiveTab,
    loginAs,
    setIsDemoModalOpen,
  } = useApp();

  const [activeNoticeTab, setActiveNoticeTab] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Faculty Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Faculty &amp; Department Coordinator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {facultyProfile.name} 🎓
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {facultyProfile.title} • {facultyProfile.department} ({facultyProfile.college})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('question-bank')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Question Paper</span>
            </button>
            <button
              onClick={() => loginAs('student')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition cursor-pointer flex items-center gap-1.5"
              title="Switch role to Student view (Alex)"
            >
              <User className="w-4 h-4 text-blue-400" />
              <span>Switch to Student View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Class Diagnostic Alert: Weak Topic in Class */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-2 border-rose-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            Class-Wide Diagnostic Alert
          </span>
          <span className="text-xs text-slate-400 font-mono">B.Tech CSE • 3rd Semester (64 Students)</span>
        </div>

        <h3 className="text-lg font-bold text-white">
          &quot;Normalization (2NF &amp; 3NF Decomposition)&quot; is the primary class weakness (42% Class Accuracy)
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Based on recent Class Test 2 and diagnostic quiz submissions, 38 out of 64 students struggled with eliminating partial and transitive functional dependencies. Campus Copilot is automatically recommending 30 minutes of targeted remediation to affected students.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('question-bank')}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Review Past Normalization Exam Papers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('campus')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition cursor-pointer"
          >
            Broadcast Extra Lecture Notice
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Verified Papers</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{facultyProfile.papersUploadedCount}</p>
          <p className="text-xs text-slate-400 mt-1">Archived in Question Bank</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Class Test 1 Avg</span>
            <Award className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400">78%</p>
          <p className="text-xs text-slate-400 mt-1">ER Modeling &amp; Joins</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Class Test 2 Avg</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400">54%</p>
          <p className="text-xs text-slate-400 mt-1">Normalization &amp; FDs</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Next Assessment</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-lg font-bold text-white mt-1">Oct 22, 2026</p>
          <p className="text-xs text-slate-400">Mid-Term Examination</p>
        </div>
      </div>

      {/* Assessments & Class Tests List */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Departmental Assessments &amp; Class Tests</h3>
          </div>
          <span className="text-xs text-slate-400">Semester 3 • Database Management Systems</span>
        </div>

        <div className="space-y-3">
          {facultyProfile.activeClassTests.map((ct) => (
            <div
              key={ct.id}
              className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ct.status === 'evaluated'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {ct.status === 'evaluated' ? 'Evaluated & Graded' : 'Upcoming Schedule'}
                  </span>
                  <span className="text-xs text-slate-400">• Date: {ct.date}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{ct.title}</h4>
                <p className="text-xs text-slate-400">{ct.totalStudents} enrolled students</p>
              </div>

              <div className="flex items-center gap-3">
                {ct.status === 'evaluated' && (
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Class Average</p>
                    <p className="text-base font-black text-white">{ct.averageScore}%</p>
                  </div>
                )}
                <button
                  onClick={() => setActiveTab('question-bank')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  View Paper &amp; Marking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
