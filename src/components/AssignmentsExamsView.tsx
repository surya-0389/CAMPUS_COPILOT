import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList,
  CalendarCheck,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Trash2,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const AssignmentsExamsView: React.FC = () => {
  const {
    userRole,
    assignments,
    addAssignment,
    toggleAssignment,
    deleteAssignment,
    profile,
    addExamSchedule,
    deleteExamSchedule,
    setActiveTab,
    openAIChatWithQuery,
  } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');

  // Modal states
  const [isAddAssignmentOpen, setIsAddAssignmentOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(profile.subjects[0] || 'Database Management Systems');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newDescription, setNewDescription] = useState('');
  const [newMaxMarks, setNewMaxMarks] = useState('25');

  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [newExamSubject, setNewExamSubject] = useState(profile.subjects[0] || 'Database Management Systems');
  const [newExamDate, setNewExamDate] = useState('');
  const [newExamTopics, setNewExamTopics] = useState('12');

  // Filtered assignments
  const filteredAssignments = assignments.filter((a) => {
    if (subjectFilter !== 'all' && a.subject !== subjectFilter) return false;
    if (statusFilter === 'pending' && a.completed) return false;
    if (statusFilter === 'completed' && !a.completed) return false;
    if (priorityFilter !== 'all' && a.priority !== priorityFilter) return false;
    return true;
  });

  const pendingCount = assignments.filter((a) => !a.completed).length;
  const completedCount = assignments.filter((a) => a.completed).length;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDueDate) return;

    addAssignment({
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      priority: newPriority,
      description: newDescription.trim(),
      maxMarks: Number(newMaxMarks) || 25,
      completed: false,
    });

    setNewTitle('');
    setNewDescription('');
    setNewDueDate('');
    setIsAddAssignmentOpen(false);
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamSubject || !newExamDate) return;

    addExamSchedule(newExamSubject, newExamDate, Number(newExamTopics) || 10);
    setNewExamDate('');
    setIsAddExamOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-400" />
            Assignments &amp; Examination Tracker
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage course submissions, priority deadlines, and university examination schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'faculty' && (
            <button
              onClick={() => setIsAddAssignmentOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          )}
          <button
            onClick={() => setIsAddExamOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Add Exam Date</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Total Assignments</span>
          <p className="text-2xl font-black text-white tabular-nums">{assignments.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active coursework</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Pending Due</span>
          <p className="text-2xl font-black text-amber-400 tabular-nums">{pendingCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Requires submission</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Completed</span>
          <p className="text-2xl font-black text-emerald-400 tabular-nums">{completedCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Submitted on time</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Upcoming Exams</span>
          <p className="text-2xl font-black text-indigo-400 tabular-nums">{profile.examDates.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Target milestones</span>
        </div>
      </div>

      {/* Main Grid: Assignments List vs Upcoming Examinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assignments (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {/* Subject Filter */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Subjects</option>
                {profile.subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <span className="text-[11px] text-slate-500 tabular-nums">
              Showing {filteredAssignments.length} of {assignments.length} assignments
            </span>
          </div>

          {/* Assignments List */}
          <div className="space-y-3">
            {filteredAssignments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
                <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white">No assignments match your filter</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting the subject or status filter, or create a new assignment for your semester.
                </p>
                <button
                  onClick={() => setIsAddAssignmentOpen(true)}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  Create Assignment
                </button>
              </div>
            ) : (
              filteredAssignments.map((asgn) => {
                const isOverdue = !asgn.completed && new Date(asgn.dueDate) < new Date();
                return (
                  <div
                    key={asgn.id}
                    className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                      asgn.completed
                        ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                        : isOverdue
                        ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
                        : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {/* Toggle button */}
                    <button
                      onClick={() => toggleAssignment(asgn.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-400 transition cursor-pointer shrink-0"
                      title={asgn.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {asgn.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-blue-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            className={`text-sm font-bold ${
                              asgn.completed ? 'line-through text-slate-500' : 'text-white'
                            }`}
                          >
                            {asgn.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">{asgn.subject}</p>
                        </div>

                        {/* Priority Badge */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              asgn.priority === 'High'
                                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                : asgn.priority === 'Medium'
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {asgn.priority} Priority
                          </span>

                          <button
                            onClick={() => deleteAssignment(asgn.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                            title="Delete assignment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {asgn.description && (
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                          {asgn.description}
                        </p>
                      )}

                      {/* Meta Footer */}
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            Due: {asgn.dueDate}
                          </span>
                          <span>•</span>
                          <span>Max Marks: {asgn.maxMarks}</span>
                          {asgn.score !== undefined && (
                            <span className="text-emerald-400 font-semibold">
                              Score: {asgn.score}/{asgn.maxMarks}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              openAIChatWithQuery(
                                `I need guidance on this university assignment:\n\nTitle: "${asgn.title}"\nSubject: ${asgn.subject}\nDescription: "${asgn.description}"\n\nPlease break down the core concepts, recommended steps to solve it, and best practices.`
                              )
                            }
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-[10px] font-semibold transition cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Discuss with AI</span>
                          </button>

                          {isOverdue && (
                            <span className="text-rose-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Examination Countdown & Deadlines Timeline */}
        <div className="space-y-6">
          {/* Upcoming Examinations Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                University Exam Dates
              </h3>
              <button
                onClick={() => setIsAddExamOpen(true)}
                className="text-[11px] text-blue-400 hover:underline cursor-pointer"
              >
                + Add Exam
              </button>
            </div>

            <div className="space-y-3">
              {profile.examDates.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white">{exam.subject}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {exam.date}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                          exam.daysLeft <= 4
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : exam.daysLeft <= 8
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {exam.daysLeft}d left
                      </span>
                      <button
                        onClick={() => deleteExamSchedule(exam.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Remove exam date"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Readiness: {exam.readinessPercentage}%</span>
                    <span>
                      {exam.topicsCovered}/{exam.totalTopics} topics
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        exam.readinessPercentage >= 70
                          ? 'bg-emerald-400'
                          : exam.readinessPercentage >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${exam.readinessPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Link to Study Planner */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-blue-950/40 border border-indigo-900/40 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Adaptive Study Planner</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Campus Copilot automatically syncs your exam dates with daily study time budgets to balance your preparation across the semester.
            </p>
            <button
              onClick={() => setActiveTab('study-plan')}
              className="mt-1 flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              <span>Inspect Daily Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create Assignment */}
      {isAddAssignmentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                Add New Course Assignment
              </h2>
              <button
                onClick={() => setIsAddAssignmentOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Relational Normalization & BCNF Proofs"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {profile.subjects.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                  </input>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description / Brief</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Details of problems to solve, submission format..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAssignmentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Exam Date */}
      {isAddExamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                Schedule Upcoming Examination
              </h2>
              <button
                onClick={() => setIsAddExamOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                <select
                  value={newExamSubject}
                  onChange={(e) => setNewExamSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {profile.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Examination Date</label>
                <input
                  type="date"
                  required
                  value={newExamDate}
                  onChange={(e) => setNewExamDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Exam Units/Topics</label>
                <input
                  type="number"
                  value={newExamTopics}
                  onChange={(e) => setNewExamTopics(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExamOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Add to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
