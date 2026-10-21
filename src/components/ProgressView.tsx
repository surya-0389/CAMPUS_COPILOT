import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Award,
  Clock,
  BookOpen,
  ArrowRight,
  Target,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { profile, studyPlan, submissions, setActiveTab } = useApp();

  const totalPlanTasks = studyPlan.days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedPlanTasks = studyPlan.days.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
  const planCompletionPercent = totalPlanTasks > 0 ? Math.round((completedPlanTasks / totalPlanTasks) * 100) : 0;

  const totalStudyHoursLogged = 14.5; // realistic demo total
  const weeklyTargetHours = profile.dailyStudyHours * 7; // e.g. 21 hours

  const latestSub = submissions[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Academic Progress &amp; Mastery Tracking
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time analytics tracking syllabus coverage, quiz mastery, and weakness remediation.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('quizzes')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/20"
        >
          <span>Take Checkpoint Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Overall Plan Mastery</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">{planCompletionPercent}%</p>
          <p className="text-xs text-slate-400 mt-1">
            {completedPlanTasks} of {totalPlanTasks} tasks finished
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{ width: `${planCompletionPercent}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Weekly Study Hours</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-blue-400">{totalStudyHoursLogged}h</p>
          <p className="text-xs text-slate-400 mt-1">
            Target: {weeklyTargetHours}h / week ({Math.round((totalStudyHoursLogged / weeklyTargetHours) * 100)}% achieved)
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(totalStudyHoursLogged / weeklyTargetHours) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Study Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-black text-orange-400">{profile.studyStreakDays} Days</p>
          <p className="text-xs text-slate-400 mt-1">Consistency rating: 94% (High)</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div
                key={d}
                className={`flex-1 h-1.5 rounded-sm ${
                  d <= profile.studyStreakDays ? 'bg-orange-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Diagnostic Quiz Average</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-purple-400">
            {latestSub ? `${latestSub.percentage}%` : '65%'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {submissions.length} diagnostic session logged
          </p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${latestSub?.percentage || 65}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weak Topics vs Strong Topics Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identified Weak Topics (Remediation Needed) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Identified Weak Areas (&lt;60% accuracy)</h3>
            </div>
            <span className="text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              High Priority
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Detected from your recent diagnostic quizzes. These topics have remedial tasks automatically injected into your active study plan.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/40">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Normalization (1NF, 2NF, 3NF, BCNF)</span>
                <span className="text-rose-400">40% Mastery</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Frequent error: Confusing partial functional dependency with transitive dependency.
              </p>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-rose-950/60 text-[10px]">
                <span className="text-amber-400">⚡ +30 min remedial review in progress</span>
                <button
                  onClick={() => setActiveTab('study-plan')}
                  className="text-white hover:underline font-semibold cursor-pointer"
                >
                  Go to Day 1 Plan →
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Lossless Join Verification (R1 ∩ R2 -&gt; R1)</span>
                <span className="text-amber-400">55% Mastery</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Decomposition intersection property practice recommended.
              </p>
            </div>
          </div>
        </div>

        {/* Mastered Strong Topics */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Strong &amp; Mastered Topics (&gt;75%)</h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Exam Ready
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Validated by high quiz scores and quick response times. Keep in periodic rotation for retention.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Transaction ACID Properties</span>
                <span className="text-emerald-400">100% Mastery</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Perfect score on Atomicity, Write-Ahead Logging (WAL), and Recovery Manager role.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Conflict Serializability &amp; Precedence Graphs</span>
                <span className="text-emerald-400">100% Mastery</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1">
                Accurate cycle detection and equivalent serial schedule derivation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Readiness Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">All Subjects Readiness Matrix</h3>
        <div className="space-y-3">
          {profile.examDates.map((ex) => (
            <div key={ex.id} className="p-3.5 rounded-xl bg-slate-850 border border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-white">{ex.subject}</span>
                <span className="text-slate-400">
                  {ex.daysLeft} days left • Readiness: <span className="text-amber-400 font-bold">{ex.readinessPercentage}%</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    ex.readinessPercentage >= 75
                      ? 'bg-emerald-400'
                      : ex.readinessPercentage >= 60
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${ex.readinessPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
