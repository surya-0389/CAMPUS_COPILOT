import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Clock,
  AlertTriangle,
  ArrowRight,
  Upload,
  CalendarCheck,
  BrainCircuit,
  BotMessageSquare,
  CheckCircle2,
  Circle,
  TrendingUp,
  FileText,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  ClipboardList,
  BookOpen,
  Calendar,
  ShieldCheck,
  FileCheck,
  BarChart3,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    studyPlan,
    submissions,
    setActiveTab,
    toggleTaskCompletion,
    setIsDemoModalOpen,
    assignments,
    weeklyActivity,
    subjects,
    materials,
    setActiveMaterial,
    isNewUserOnboarding,
    setIsNewUserOnboarding,
    studyGoals,
    toggleGoalCompletion,
  } = useApp();

  // If evaluator toggled onboarding mode, render an onboarding state
  if (isNewUserOnboarding) {
    return (
      <div className="space-y-6">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Welcome to Campus Copilot!</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your AI Academic Operating System is ready. Let’s get you set up for your semester by connecting your course materials and upcoming exams.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left">
            <div
              onClick={() => setActiveTab('materials')}
              className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition"
            >
              <Upload className="w-5 h-5 text-blue-400 mb-2" />
              <h3 className="text-xs font-bold text-white">1. Upload Notes</h3>
              <p className="text-[11px] text-slate-400 mt-1">Upload your syllabus PDF or lecture notes for AI topic extraction.</p>
            </div>

            <div
              onClick={() => setActiveTab('study-plan')}
              className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition"
            >
              <CalendarCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <h3 className="text-xs font-bold text-white">2. Create Study Plan</h3>
              <p className="text-[11px] text-slate-400 mt-1">Set your daily hours and exam dates for adaptive day-by-day scheduling.</p>
            </div>

            <div
              onClick={() => setActiveTab('quizzes')}
              className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition"
            >
              <BrainCircuit className="w-5 h-5 text-purple-400 mb-2" />
              <h3 className="text-xs font-bold text-white">3. Checkpoint Quiz</h3>
              <p className="text-[11px] text-slate-400 mt-1">Diagnose concept weak spots to auto-remediate your study schedule.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => setIsNewUserOnboarding(false)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
            >
              Exit Onboarding &amp; Load Demo Data
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold"
            >
              Watch 2-Min Guided Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Next upcoming exam
  const nextExam = profile.examDates[0] || {
    subject: 'Database Management Systems',
    daysLeft: 4,
    date: '2026-10-20',
    readinessPercentage: 62,
    topicsCovered: 8,
    totalTopics: 12,
  };

  // Latest quiz submission and weak topic
  const latestSub = submissions[0];
  const hasWeakTopic = latestSub && latestSub.percentage < 60;
  const primaryWeakTopic = latestSub?.weakTopics?.[0] || 'Normalization';

  // Today's tasks from study plan day 1
  const todaySchedule = studyPlan.days[0] || {
    dayNumber: 1,
    topics: ['Normalization', 'Functional Dependencies'],
    durationMinutes: 180,
    tasks: [],
  };

  const completedTasksCount = todaySchedule.tasks.filter((t) => t.completed).length;
  const totalTasksCount = todaySchedule.tasks.length || 1;
  const todayProgressPercent = Math.round((completedTasksCount / totalTasksCount) * 100);

  // Upcoming pending assignments
  const pendingAssignments = assignments.filter((a) => !a.completed).slice(0, 3);

  // Max daily minutes for weekly chart scale
  const maxWeeklyMinutes = Math.max(...weeklyActivity.map((w) => w.minutesSpent), 240);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Copilot OS • Semester Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Targeting <span className="text-white font-semibold">{nextExam.subject}</span> in{' '}
              <span className="text-amber-400 font-bold tabular-nums">{nextExam.daysLeft} days</span>. You have{' '}
              <span className="text-blue-400 font-semibold tabular-nums">{profile.dailyStudyHours} hours</span> planned for today.
            </p>
          </div>

          {/* Quick-Access Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('chat')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => setActiveTab('study-plan')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Continue Studying</span>
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Take a Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('question-bank')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>View Papers</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Study Goals */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Semester Study Goals</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white tabular-nums">
              {studyGoals.filter((g) => g.completed).length} / {studyGoals.length}
            </span>
            <span className="text-xs text-slate-400">Goals Achieved</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate">
            Next: {studyGoals.find((g) => !g.completed)?.title || 'All goals completed!'}
          </p>
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (studyGoals.filter((g) => g.completed).length / Math.max(1, studyGoals.length)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Subject Progress */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Subject Readiness Average</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 tabular-nums">
              {Math.round(
                subjects.reduce((sum, s) => sum + s.readinessScore, 0) / Math.max(1, subjects.length)
              )}
              %
            </span>
            <span className="text-xs text-slate-400">Across {subjects.length} Subjects</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate">
            Top: {subjects.slice().sort((a, b) => b.readinessScore - a.readinessScore)[0]?.name}
          </p>
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    subjects.reduce((sum, s) => sum + s.readinessScore, 0) / Math.max(1, subjects.length)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pending Deadlines</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400 tabular-nums">
              {assignments.filter((a) => !a.completed).length}
            </span>
            <span className="text-xs text-slate-400">Due Assignments</span>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate">
            Next: {pendingAssignments[0]?.title || 'No pending tasks!'}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Exam Countdown</span>
            <span className="text-amber-400 font-bold tabular-nums">{nextExam.daysLeft}d left</span>
          </div>
        </div>

        {/* Card 4: Recent Quiz & Weak Topic */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Recent Quiz Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-black tabular-nums ${
                (latestSub?.percentage || 0) < 60 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {latestSub?.percentage ?? 40}%
            </span>
            <span className="text-xs text-slate-400">
              ({latestSub?.score ?? 2}/{latestSub?.totalQuestions ?? 5} correct)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 truncate">
            {latestSub?.quizTitle ?? 'DBMS Unit 3 Checkpoint'}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Weak: {primaryWeakTopic}</span>
            <span className="text-rose-400 font-semibold">Needs Revision</span>
          </div>
        </div>
      </div>

      {/* Personalized Learning Loop Alert */}
      {hasWeakTopic && (
        <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Personalized Learning Loop
                  </span>
                  <span className="text-xs text-slate-400">• Weak Topic Detected</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  &quot;{primaryWeakTopic}&quot; requires targeted revision ({latestSub.percentage}% accuracy)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {latestSub.recommendation ||
                    'Spend 30 additional minutes reviewing Normalization decomposition before your semester examination.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap">
              <button
                onClick={() => setActiveTab('study-plan')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                Inspect Updated Plan
              </button>
              <button
                onClick={() => setActiveTab('question-bank')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition cursor-pointer"
              >
                Solve PYQs on this Topic
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mid-Row: Weekly Study Activity Chart & Upcoming Deadlines Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity SVG Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Weekly Study Activity
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Actual study minutes logged per day across syllabus reading, quizzes, and problem solving.
              </p>
            </div>
            <span className="text-xs bg-slate-850 border border-slate-800 px-3 py-1 rounded-xl font-bold text-blue-400 tabular-nums">
              Total:{' '}
              {(
                weeklyActivity.reduce((sum, d) => sum + d.minutesSpent, 0) / 60
              ).toFixed(1)}
              h
            </span>
          </div>

          {/* Accessible SVG Bar Chart */}
          <div className="pt-4 pb-2">
            <div className="flex items-end justify-between gap-2 h-44 border-b border-slate-800 px-2">
              {weeklyActivity.map((day) => {
                const heightPercent = Math.min(100, Math.round((day.minutesSpent / maxWeeklyMinutes) * 100));
                const isTargetMet = day.minutesSpent >= day.targetMinutes;

                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on Hover */}
                    <span className="opacity-0 group-hover:opacity-100 transition text-[10px] font-semibold text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 tabular-nums pointer-events-none mb-1">
                      {day.minutesSpent}m
                    </span>

                    {/* Bar */}
                    <div
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                        isTargetMet
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400'
                          : 'bg-gradient-to-t from-slate-700 to-slate-600 group-hover:from-slate-600 group-hover:to-slate-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    {/* Day Label */}
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-white transition">
                      {day.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                  Target Met (≥180m)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-700 inline-block" />
                  Partial Session
                </span>
              </div>
              <span className="text-slate-500">Daily Target: 3.0h / day</span>
            </div>
          </div>
        </div>

        {/* Deadlines Timeline (1 Col) */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              Upcoming Deadlines
            </h3>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {pendingAssignments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No pending assignments!</p>
            ) : (
              pendingAssignments.map((asgn) => (
                <div
                  key={asgn.id}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{asgn.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{asgn.subject}</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                        asgn.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {asgn.priority}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due {asgn.dueDate}
                    </span>
                    <span>Max {asgn.maxMarks} marks</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Next Exam Milestone</span>
              <span className="text-amber-400 font-bold tabular-nums">{nextExam.daysLeft}d left</span>
            </div>
            <p className="text-xs font-bold text-white">{nextExam.subject}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Exam Date: {nextExam.date}</p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Today's Tasks Checklist vs Recent Notes & Verified Campus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Tasks (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Today&apos;s Study Action Plan</h2>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                  Day {todaySchedule.dayNumber} ({todaySchedule.date})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Subject: <span className="text-slate-200 font-semibold">{studyPlan.subject}</span> • Focus:{' '}
                {todaySchedule.topics.join(', ')}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('study-plan')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Full Schedule <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {todaySchedule.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskCompletion(todaySchedule.dayNumber, task.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                  task.completed
                    ? 'bg-slate-950/60 border-slate-800 text-slate-500'
                    : task.isWeakAreaRemediation
                    ? 'bg-rose-950/20 border-rose-500/40 text-slate-200 hover:bg-rose-950/30'
                    : 'bg-slate-850 border-slate-800/80 text-slate-200 hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-400 cursor-pointer"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-blue-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-snug ${
                        task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.description}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" />
                      {task.estimatedMinutes} mins
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {task.topicTag}
                    </span>
                    {task.isWeakAreaRemediation && (
                      <span className="bg-rose-500/20 text-rose-300 font-semibold px-2 py-0.5 rounded border border-rose-500/30">
                        ⚡ AI Weakness Remediation
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              {completedTasksCount} of {totalTasksCount} completed ({todayProgressPercent}%)
            </span>
            <span className="font-semibold text-slate-300">
              Total today:{' '}
              {todaySchedule.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)} mins
            </span>
          </div>
        </div>

        {/* Right Column: Recent Study Materials & Campus Notice (1 Col) */}
        <div className="space-y-6">
          {/* Recent Study Materials Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Recent Study Materials
              </h3>
              <button
                onClick={() => setActiveTab('materials')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Upload +
              </button>
            </div>

            <div className="space-y-2.5">
              {materials.slice(0, 3).map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => {
                    setActiveMaterial(mat);
                    setActiveTab('materials');
                  }}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition"
                >
                  <p className="text-xs font-bold text-white truncate">{mat.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{mat.subject}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{mat.detectedTopics?.length || 4} Topics detected</span>
                    <span className="text-emerald-400">✓ AI Analyzed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Campus Notice Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Verified Campus Notice
              </span>
              <button
                onClick={() => setActiveTab('campus')}
                className="text-[11px] text-blue-400 hover:underline cursor-pointer"
              >
                Directory
              </button>
            </div>
            <p className="text-xs font-bold text-white">Central Library Extended Hours</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ground &amp; 1st floor reading halls open until 11:00 PM during exam period (Oct 15 - Nov 05). 24/7 digital catalog active.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: Library Circular LIB/2026/89</span>
              <span className="text-emerald-400 font-semibold">✓ Official</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
