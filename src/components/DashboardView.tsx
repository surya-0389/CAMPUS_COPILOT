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
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    studyPlan,
    submissions,
    setActiveTab,
    toggleTaskCompletion,
    setIsDemoModalOpen,
  } = useApp();

  // Find next upcoming exam
  const nextExam = profile.examDates[0] || {
    subject: 'Database Management Systems',
    daysLeft: 4,
    date: '2026-10-20',
    readinessPercentage: 62,
  };

  // Find latest quiz submission and weak topic
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

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Copilot OS • Active Fall 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
              Targeting <span className="text-white font-semibold">{nextExam.subject}</span> in{' '}
              <span className="text-amber-400 font-bold">{nextExam.daysLeft} days</span>. You have{' '}
              <span className="text-blue-400 font-semibold">{profile.dailyStudyHours} hours</span> planned for today.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Run 2-Min Demo Walkthrough</span>
            </button>
            <button
              onClick={() => setActiveTab('study-plan')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs sm:text-sm transition cursor-pointer"
            >
              <span>View Full Plan</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('materials')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 text-left transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 shrink-0">
            <Upload className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-blue-400 transition">Upload Notes</p>
            <p className="text-[10px] text-slate-400">PDF, Syllabus, Text</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('question-bank')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 text-left transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-amber-400 transition">Question Bank</p>
            <p className="text-[10px] text-slate-400">PYQ &amp; Class Tests</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('study-plan')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 text-left transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 shrink-0">
            <CalendarCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition">Study Plan</p>
            <p className="text-[10px] text-slate-400">Adaptive Timeline</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 text-left transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 shrink-0">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-purple-400 transition">Take Quiz</p>
            <p className="text-[10px] text-slate-400">MCQ Diagnosis</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 text-left transition-all duration-300 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shrink-0">
            <BotMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-indigo-400 transition">Ask AI Mentor</p>
            <p className="text-[10px] text-slate-400">Gemini &amp; ChatGPT</p>
          </div>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Exam Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Next Target Exam</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-lg font-bold text-white truncate">{nextExam.subject}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{nextExam.daysLeft}</span>
            <span className="text-xs text-slate-400">days left ({nextExam.date})</span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] mb-1 text-slate-400">
              <span>Readiness</span>
              <span className="font-semibold text-slate-200">{nextExam.readinessPercentage}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${nextExam.readinessPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Study Streak Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-orange-400">{profile.studyStreakDays}</span>
            <span className="text-xs font-semibold text-slate-300">Days Consecutive 🔥</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Consistent 3 hrs/day average over past week. Keep it up!
          </p>
          <div className="mt-3 flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div
                key={d}
                className={`flex-1 h-2 rounded-sm ${
                  d <= profile.studyStreakDays ? 'bg-orange-500' : 'bg-slate-800'
                }`}
                title={`Day ${d}`}
              />
            ))}
          </div>
        </div>

        {/* Today's Study Budget Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Today&apos;s Time Target</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400">{profile.dailyStudyHours}</span>
            <span className="text-xs text-slate-400">Hours ({profile.dailyStudyHours * 60} mins)</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {completedTasksCount} of {totalTasksCount} tasks finished ({todayProgressPercent}%)
          </p>
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${todayProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Diagnostic Quiz Score Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Recent Quiz Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
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
            {latestSub?.quizTitle ?? 'DBMS Unit 3 Diagnostic'}
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Topic: Normalization</span>
            <span className="text-rose-400 font-semibold">Needs Revision</span>
          </div>
        </div>
      </div>

      {/* CORE DIFFERENTIATOR: The Personalized Learning Loop Alert */}
      {hasWeakTopic && (
        <div className="rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-5 sm:p-6 shadow-lg shadow-rose-950/20">
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
                  &quot;{primaryWeakTopic}&quot; is currently your weakest topic ({latestSub.percentage}% accuracy)
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {latestSub.recommendation ||
                    'Spend 30 additional minutes reviewing Normalization (1NF, 2NF, 3NF decomposition) before moving to the next topic.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap">
              <button
                onClick={() => setActiveTab('study-plan')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition cursor-pointer"
              >
                Inspect Updated Plan
              </button>
              <button
                onClick={() => setActiveTab('question-bank')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                Solve PYQs on this Topic
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs sm:text-sm transition cursor-pointer"
              >
                Retake Quiz
              </button>
            </div>
          </div>

          {/* Visual Learning Loop Diagram */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Loop Status:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">Notes Uploaded</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">AI Study Plan</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-semibold text-[11px]">Quiz (40%)</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-semibold text-[11px]">Weakness Detected</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold text-[11px]">Plan Auto-Updated (+30m)</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Today's Tasks vs Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Study Tasks Checklist (2 Cols) */}
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
              {completedTasksCount} of {totalTasksCount} completed
            </span>
            <span className="font-semibold text-slate-300">
              Total today:{' '}
              {todaySchedule.tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0)} mins
            </span>
          </div>
        </div>

        {/* Right Sidebar: Exam Countdown & Campus Timetable */}
        <div className="space-y-6">
          {/* Upcoming Exams Card */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                Upcoming Semester Exams
              </h3>
              <button
                onClick={() => setActiveTab('campus')}
                className="text-[11px] text-blue-400 hover:underline cursor-pointer"
              >
                Official Schedule
              </button>
            </div>

            <div className="space-y-3">
              {profile.examDates.map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 rounded-xl bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-white">{exam.subject}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {exam.date}</p>
                    </div>
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
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Readiness: {exam.readinessPercentage}%</span>
                    <span>
                      {exam.topicsCovered}/{exam.totalTopics} topics
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
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

          {/* Verified Campus Quick Notice */}
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
                View all
              </button>
            </div>
            <p className="text-xs font-bold text-white">Central Library Extended Hours</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Ground &amp; 1st floor reading halls open until 11:00 PM during exam period (Oct 15 - Nov 05). 24/7 digital catalog active.
            </p>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: Library Circular LIB/2026/89</span>
              <span className="text-emerald-400">✓ Official</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
