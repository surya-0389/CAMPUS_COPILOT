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
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Vote,
  LifeBuoy,
  Timer,
  Scale,
  FileText,
} from 'lucide-react';

interface StudentRosterItem {
  rollNo: string;
  name: string;
  attendance: number;
  diagnosticScore: number;
  classTestAvg: number;
  assignmentsCompleted: number;
  readiness: number;
  weakTopic: string;
}

export const FacultyDashboardView: React.FC = () => {
  const {
    facultyProfile,
    setActiveTab,
    loginAs,
    leaveNotices,
    grievances,
    classTests,
    polls,
  } = useApp();

  // Student Roster Sample Data for Comparison
  const studentRoster: StudentRosterItem[] = [
    {
      rollNo: '2024CS104',
      name: 'Aarav Sharma',
      attendance: 85,
      diagnosticScore: 68,
      classTestAvg: 72,
      assignmentsCompleted: 90,
      readiness: 74,
      weakTopic: 'Normalization & 3NF',
    },
    {
      rollNo: '2024CS108',
      name: 'Rohan Verma',
      attendance: 92,
      diagnosticScore: 84,
      classTestAvg: 88,
      assignmentsCompleted: 100,
      readiness: 89,
      weakTopic: 'B+ Tree Indexing',
    },
    {
      rollNo: '2024CS112',
      name: 'Sneha Patel',
      attendance: 78,
      diagnosticScore: 60,
      classTestAvg: 65,
      assignmentsCompleted: 75,
      readiness: 62,
      weakTopic: 'Relational Calculus',
    },
    {
      rollNo: '2024CS119',
      name: 'Ananya Iyer',
      attendance: 95,
      diagnosticScore: 92,
      classTestAvg: 94,
      assignmentsCompleted: 100,
      readiness: 96,
      weakTopic: 'Distributed Concurrency',
    },
    {
      rollNo: '2024CS125',
      name: 'Kabir Mehta',
      attendance: 68,
      diagnosticScore: 50,
      classTestAvg: 54,
      assignmentsCompleted: 60,
      readiness: 51,
      weakTopic: 'SQL Joins & Aggregation',
    },
  ];

  const [compareStudentA, setCompareStudentA] = useState<string>('2024CS104');
  const [compareStudentB, setCompareStudentB] = useState<string>('2024CS108');

  const studentA = studentRoster.find((s) => s.rollNo === compareStudentA) || studentRoster[0];
  const studentB = studentRoster.find((s) => s.rollNo === compareStudentB) || studentRoster[1];

  const pendingLeaves = leaveNotices.filter((l) => l.status === 'pending').length;
  const pendingGrievances = grievances.filter((g) => g.status !== 'resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Faculty Hero Banner & Comprehensive Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0 border-2 border-purple-400/40">
                RK
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Head of Department (H.O.D) &amp; Department Academic Coordinator</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {facultyProfile.name}
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm">
                  {facultyProfile.department} • {facultyProfile.college}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('class-tests')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer flex items-center gap-1.5"
              >
                <Timer className="w-4 h-4" />
                <span>Create Online Test</span>
              </button>
              <button
                onClick={() => setActiveTab('polls')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-purple-500/30 text-purple-300 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Vote className="w-4 h-4" />
                <span>Publish Poll</span>
              </button>
              <button
                onClick={() => loginAs('student')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
                title="Switch role to Student view"
              >
                <User className="w-4 h-4 text-blue-400" />
                <span>Switch to Student</span>
              </button>
            </div>
          </div>

          {/* Detailed Faculty Credentials Bar */}
          <div className="pt-4 border-t border-purple-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
              <span><strong>Qualification:</strong> {facultyProfile.qualification}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Contact:</strong> {facultyProfile.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span><strong>Email:</strong> {facultyProfile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Cabin:</strong> {facultyProfile.officeRoom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Badges: Pending Leave Requests & Grievances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('attendance')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pending Leave Notices</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-emerald-400 transition">
            {pendingLeaves} <span className="text-xs font-normal text-slate-400">Applications</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Click to sanction / review</p>
        </div>

        <div
          onClick={() => setActiveTab('grievance')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Grievances</span>
            <LifeBuoy className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-rose-400 transition">
            {pendingGrievances} <span className="text-xs font-normal text-slate-400">Tickets</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ombudsman redressal portal</p>
        </div>

        <div
          onClick={() => setActiveTab('class-tests')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Class Tests Scheduled</span>
            <Timer className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-purple-400 transition">
            {classTests.length} <span className="text-xs font-normal text-slate-400">Online Tests</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Timed MCQ &amp; Subjective</p>
        </div>

        <div
          onClick={() => setActiveTab('polls')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Campus Polls</span>
            <Vote className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white group-hover:text-blue-400 transition">
            {polls.length} <span className="text-xs font-normal text-slate-400">Published</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Student voter consensus</p>
        </div>
      </div>

      {/* Class Diagnostic Alert */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-2 border-rose-500/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            Class-Wide Diagnostic Alert
          </span>
          <span className="text-xs text-slate-400 font-mono">B.Tech CSE • 3rd Semester (64 Students)</span>
        </div>

        <h3 className="text-lg font-bold text-white">
          &quot;Normalization (2NF &amp; 3NF Decomposition)&quot; is the primary class weakness (42% Accuracy)
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

      {/* STUDENT PROGRESS ROSTER & COMPARISON SECTION */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Class Student Progress &amp; Comparison</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor individual student academic indicators, attendance, test scores, and compare student progress side-by-side.
            </p>
          </div>
        </div>

        {/* Side-by-Side Student Comparison Selector */}
        <div className="p-5 rounded-2xl bg-slate-850/90 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-400" />
              Side-by-Side Student Progress Comparator
            </span>
            <span className="text-[11px] text-slate-400">Select any two students to compare academic performance</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student A Selector */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-bold mb-1">Student A</label>
                <select
                  value={compareStudentA}
                  onChange={(e) => setCompareStudentA(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  {studentRoster.map((s) => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Attendance</span>
                  <span className={`font-bold ${studentA.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {studentA.attendance}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Diagnostic Score</span>
                  <span className="font-bold text-blue-400">{studentA.diagnosticScore}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Class Test Avg</span>
                  <span className="font-bold text-purple-400">{studentA.classTestAvg}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Exam Readiness</span>
                  <span className="font-bold text-white">{studentA.readiness}%</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300">
                <span className="text-slate-500 font-semibold">Primary Weakness:</span>{' '}
                <span className="text-rose-400 font-medium">{studentA.weakTopic}</span>
              </div>
            </div>

            {/* Student B Selector */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase font-bold mb-1">Student B</label>
                <select
                  value={compareStudentB}
                  onChange={(e) => setCompareStudentB(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  {studentRoster.map((s) => (
                    <option key={s.rollNo} value={s.rollNo}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Attendance</span>
                  <span className={`font-bold ${studentB.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {studentB.attendance}%
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Diagnostic Score</span>
                  <span className="font-bold text-blue-400">{studentB.diagnosticScore}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Class Test Avg</span>
                  <span className="font-bold text-purple-400">{studentB.classTestAvg}%</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-850">
                  <span className="text-[10px] text-slate-400 block">Exam Readiness</span>
                  <span className="font-bold text-white">{studentB.readiness}%</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300">
                <span className="text-slate-500 font-semibold">Primary Weakness:</span>{' '}
                <span className="text-rose-400 font-medium">{studentB.weakTopic}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Class Progress Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Student Name</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3 text-center">Attendance</th>
                <th className="p-3 text-center">Diagnostic Score</th>
                <th className="p-3 text-center">Class Tests Avg</th>
                <th className="p-3 text-center">Readiness</th>
                <th className="p-3">Identified Weak Area</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {studentRoster.map((student) => (
                <tr key={student.rollNo} className="hover:bg-slate-850/40 transition">
                  <td className="p-3 font-bold text-white">{student.name}</td>
                  <td className="p-3 font-mono text-purple-300">{student.rollNo}</td>
                  <td className="p-3 text-center">
                    <span className={`font-bold ${student.attendance >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="p-3 text-center text-blue-400 font-bold">{student.diagnosticScore}%</td>
                  <td className="p-3 text-center text-purple-400 font-bold">{student.classTestAvg}%</td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-bold text-white">{student.readiness}%</span>
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-400"
                          style={{ width: `${student.readiness}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">{student.weakTopic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
