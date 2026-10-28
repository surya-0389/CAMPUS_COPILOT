import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  Send,
  UserCheck,
  UserX,
  FileCheck,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const AttendanceLeaveView: React.FC = () => {
  const {
    attendance,
    leaveNotices,
    draftLeaveNotice,
    updateLeaveNoticeStatus,
    userRole,
    profile,
    facultyProfile,
    showCelebration,
  } = useApp();

  // Leave Form State
  const [leaveSubject, setLeaveSubject] = useState('Medical Leave - High Fever & Recovery');
  const [startDate, setStartDate] = useState('2026-11-02');
  const [endDate, setEndDate] = useState('2026-11-04');
  const [recipientFaculty, setRecipientFaculty] = useState('Prof. Dr. Rajesh K. Verma (HOD)');
  const [reason, setReason] = useState(
    'I am suffering from acute viral infection and doctor has advised mandatory rest.'
  );
  const [letterDraft, setLetterDraft] = useState('');
  const [isDraftingAI, setIsDraftingAI] = useState(false);
  const [facultyRemarksMap, setFacultyRemarksMap] = useState<Record<string, string>>({});

  const collegeAttendanceRate = attendance.totalCollegeDays > 0
    ? Math.round(((attendance.daysAttended ?? attendance.attendedDays ?? 0) / attendance.totalCollegeDays) * 100)
    : 0;

  const handleGenerateAIDraft = () => {
    setIsDraftingAI(true);
    setTimeout(() => {
      const generated = `To,
The Head of Department / Course Coordinator,
Department of Computer Science & Engineering,
Apex Institute of Technology.

Respected Sir/Madam,

Subject: Application for Leave of Absence (${leaveSubject})

I am writing to formally request leave of absence from ${startDate} to ${endDate} on account of: ${reason}

I assure you that I will coordinate with my peers to cover all missed lectures and complete the assigned laboratory exercises promptly upon my return. Medical certificates/supporting documents will be submitted to the department office as required.

Thank you for your understanding and consideration.

Yours obediently,
${profile.name}
Roll No: ${profile.rollNo}
${profile.semester} - Computer Science & Engineering`;

      setLetterDraft(generated);
      setIsDraftingAI(false);
      showCelebration();
    }, 600);
  };

  const handleSubmitLeaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterDraft.trim() && !reason.trim()) return;

    draftLeaveNotice({
      studentRollNo: profile.rollNo || '2024CS104',
      studentName: profile.name,
      subject: leaveSubject,
      reason: reason,
      startDate: startDate,
      endDate: endDate,
      recipientFaculty: recipientFaculty,
      letterContent: letterDraft.trim() || reason,
    });

    setLeaveSubject('');
    setReason('');
    setLetterDraft('');
    showCelebration();
  };

  const handleFacultyAction = (noticeId: string, status: 'approved' | 'rejected') => {
    const remark = facultyRemarksMap[noticeId] || (status === 'approved' ? 'Sanctioned. Submit doctor note upon resumption.' : 'Incomplete medical documents. Please resubmit.');
    updateLeaveNoticeStatus(noticeId, status, remark);
    showCelebration();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-emerald-400" />
              Academic Attendance &amp; Leave Notices
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              University Record
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {userRole === 'faculty'
              ? 'Review department attendance metrics, inspect student eligibility, and sanction student leave notices.'
              : 'Track semester-wide college attendance, inspect subject-by-subject percentage thresholds, and draft formal leave notices for faculty.'}
          </p>
        </div>
      </div>

      {/* Metric Cards: Total Days, Attended Days, Absent, Overall % */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total College Days</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white">{attendance.totalCollegeDays} <span className="text-xs font-normal text-slate-400">Days</span></p>
          <p className="text-xs text-slate-400 mt-1">Working sessions conducted</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Attended Days</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{attendance.daysAttended} <span className="text-xs font-normal text-slate-400">Days</span></p>
          <p className="text-xs text-slate-400 mt-1">Physically marked present</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Absent Days</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-3xl font-black text-rose-400">{attendance.daysAbsent} <span className="text-xs font-normal text-slate-400">Days</span></p>
          <p className="text-xs text-slate-400 mt-1">Leaves + Uninformed absence</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Cumulative Attendance</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className={`text-3xl font-black ${collegeAttendanceRate >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {collegeAttendanceRate}%
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {collegeAttendanceRate >= 75 ? 'Above 75% exam threshold (Safe)' : 'Below 75% mandatory threshold (Warning)'}
          </p>
        </div>
      </div>

      {/* Subject-Wise Attendance Breakdown Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-white">Course &amp; Subject Attendance Register</h2>
            <p className="text-xs text-slate-400">Minimum 75% attendance mandatory to qualify for End-Semester examinations.</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Last Synchronized: Today, 09:30 AM</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-850/80 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Subject / Course</th>
                <th className="p-3">Faculty In-charge</th>
                <th className="p-3 text-center">Total Classes</th>
                <th className="p-3 text-center">Attended</th>
                <th className="p-3 text-center">Absent</th>
                <th className="p-3 text-center">Percentage</th>
                <th className="p-3 text-right">Eligibility Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {attendance.subjects.map((sub) => {
                const isSafe = sub.percentage >= 75;
                return (
                  <tr key={sub.subjectCode} className="hover:bg-slate-850/40 transition">
                    <td className="p-3">
                      <div className="font-bold text-white">{sub.subjectName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{sub.subjectCode}</div>
                    </td>
                    <td className="p-3 text-slate-300">{sub.faculty || 'Department Faculty'}</td>
                    <td className="p-3 text-center font-mono">{sub.totalClasses}</td>
                    <td className="p-3 text-center text-emerald-400 font-mono font-bold">{sub.attendedClasses}</td>
                    <td className="p-3 text-center text-rose-400 font-mono font-bold">{sub.absentClasses}</td>
                    <td className="p-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`font-bold ${isSafe ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sub.percentage}%
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full ${isSafe ? 'bg-emerald-400' : 'bg-amber-400'}`}
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isSafe
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isSafe ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {sub.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Draft Leave Notice (Student) vs Manage Leave Applications (Faculty) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Draft Leave Notice */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Draft Official Leave Notice
              </h2>
              <p className="text-xs text-slate-400">Formal leave application drafted for faculty review.</p>
            </div>
            <button
              type="button"
              onClick={handleGenerateAIDraft}
              disabled={isDraftingAI}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isDraftingAI ? 'Drafting...' : 'AI Auto-Draft Letter'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmitLeaveNotice} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Reason / Subject</label>
              <input
                type="text"
                required
                value={leaveSubject}
                onChange={(e) => setLeaveSubject(e.target.value)}
                placeholder="e.g. Medical Leave / Family Emergency / National Hackathon"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">From Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">To Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Recipient Faculty / Mentor</label>
              <select
                value={recipientFaculty}
                onChange={(e) => setRecipientFaculty(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Prof. Dr. Rajesh K. Verma (HOD)">Prof. Dr. Rajesh K. Verma (HOD &amp; Coordinator)</option>
                <option value="Dr. Anita Sharma (Associate Professor)">Dr. Anita Sharma (DBMS Course Lead)</option>
                <option value="Prof. Vikramaditya Sen (Assistant Professor)">Prof. Vikramaditya Sen (Faculty Advisor)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Brief Description of Circumstances</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Formal Letter Content (Formatted Application)
              </label>
              <textarea
                rows={6}
                value={letterDraft}
                onChange={(e) => setLetterDraft(e.target.value)}
                placeholder="Click 'AI Auto-Draft Letter' above or write your formal leave request..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Leave Notice to Faculty</span>
            </button>
          </form>
        </div>

        {/* Right: Submitted Notices & Faculty Approval Dashboard */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-400" />
                Department Leave Application Status
              </h2>
              <p className="text-xs text-slate-400">
                {userRole === 'faculty' ? 'Pending applications needing your sanction' : 'Your submitted leave requests'}
              </p>
            </div>
            <span className="text-xs text-slate-400 font-bold bg-slate-800 px-2.5 py-1 rounded-lg">
              {leaveNotices.length} Records
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {leaveNotices.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No leave notices on record.</p>
            ) : (
              leaveNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        notice.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : notice.status === 'rejected'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {notice.status === 'approved' ? '✓ Sanctioned / Approved' : notice.status === 'rejected' ? '✕ Rejected' : '⏳ Awaiting Sanction'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {notice.startDate} to {notice.endDate}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white">{notice.subject || notice.reason}</h3>
                  <p className="text-[11px] text-slate-300">
                    Applicant: <strong className="text-slate-100">{notice.studentName}</strong> ({notice.studentRollNo})
                  </p>
                  <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px]">
                    {notice.letterContent || notice.reason}
                  </p>

                  {notice.facultyRemarks && (
                    <div className="flex items-start gap-1.5 text-[11px] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span><strong>Faculty Remark:</strong> {notice.facultyRemarks}</span>
                    </div>
                  )}

                  {/* Faculty Actions */}
                  {userRole === 'faculty' && notice.status === 'pending' && (
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleFacultyAction(notice.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold cursor-pointer"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleFacultyAction(notice.id, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 cursor-pointer"
                      >
                        Sanction &amp; Approve
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
