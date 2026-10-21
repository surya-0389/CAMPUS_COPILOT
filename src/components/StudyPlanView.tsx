import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  RotateCw,
  BrainCircuit,
  Share2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { generateStudyPlanAPI } from '../services/api';

export const StudyPlanView: React.FC = () => {
  const {
    studyPlan,
    setStudyPlan,
    profile,
    activeMaterial,
    toggleTaskCompletion,
    setActiveTab,
    showCelebration,
    submissions,
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(studyPlan.subject || profile.subjects[0]);
  const [examDate, setExamDate] = useState(studyPlan.examDate || '2026-10-20');
  const [availableHours, setAvailableHours] = useState(studyPlan.availableHoursPerDay || profile.dailyStudyHours || 3);
  const [prepLevel, setPrepLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(studyPlan.preparationLevel || 'Intermediate');
  const [weakFocus, setWeakFocus] = useState(studyPlan.weakFocusTopics.join(', ') || 'Normalization');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Latest weak topic from submissions
  const latestSub = submissions[0];
  const detectedWeakness = latestSub?.weakTopics?.[0];

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatusMessage('Synthesizing syllabus, difficulty, and weak areas with Gemini AI...');

    try {
      const weakTopicsArray = weakFocus
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const planData = await generateStudyPlanAPI({
        subject: selectedSubject,
        examDate,
        availableHoursPerDay: Number(availableHours),
        preparationLevel: prepLevel,
        weakFocusTopics: weakTopicsArray,
        materialText: activeMaterial?.rawText || '',
      });

      setStudyPlan({
        ...planData,
        id: `plan-${Date.now()}`,
        subject: selectedSubject,
        examDate,
        availableHoursPerDay: Number(availableHours),
        preparationLevel: prepLevel,
        weakFocusTopics: weakTopicsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStatusMessage('Plan generated successfully!');
      showCelebration();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalTasks = studyPlan.days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = studyPlan.days.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" />
            AI Study Plan Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Converts syllabus, exam deadlines, and detected weak topics into an actionable daily schedule.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const jsonStr = JSON.stringify(studyPlan, null, 2);
              navigator.clipboard?.writeText(jsonStr);
              showCelebration();
              alert('Study plan JSON copied to clipboard!');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Copy Plan JSON</span>
          </button>
        </div>
      </div>

      {/* Adaptive Feedback Loop Banner (if active) */}
      {studyPlan.adaptiveNote && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Adaptive Loop Update
              </span>
              <span className="text-xs text-slate-400">• Calibrated via Diagnostic Quiz</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">{studyPlan.adaptiveNote}</p>
          </div>
          <button
            onClick={() => setActiveTab('quizzes')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
          >
            Verify Quiz
          </button>
        </div>
      )}

      {/* Generator Controls Form */}
      <form onSubmit={handleGeneratePlan} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Configure Your Target Schedule
          </h2>
          {activeMaterial && (
            <span className="text-xs text-slate-400">
              Active Notes: <span className="text-blue-400 font-semibold">{activeMaterial.title}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              {profile.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Target Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Hours / Day</label>
            <input
              type="number"
              min={1}
              max={12}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Preparation Level</label>
            <select
              value={prepLevel}
              onChange={(e) => setPrepLevel(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            >
              <option value="Beginner">Beginner (Start with core axioms)</option>
              <option value="Intermediate">Intermediate (Theory + Solved examples)</option>
              <option value="Advanced">Advanced (High-yield speed drills)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-400">Weak Areas</label>
              {detectedWeakness && (
                <button
                  type="button"
                  onClick={() => setWeakFocus(detectedWeakness)}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Insert ({detectedWeakness})
                </button>
              )}
            </div>
            <input
              type="text"
              value={weakFocus}
              onChange={(e) => setWeakFocus(e.target.value)}
              placeholder="e.g. Normalization, BCNF"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-400">
            {statusMessage || 'Plan will automatically prioritize difficult topics and weakness remediation.'}
          </p>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Custom Plan...' : 'Generate AI Study Plan'}</span>
          </button>
        </div>
      </form>

      {/* Plan Overview & Progress Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Subject &amp; Exam</div>
          <p className="text-base font-bold text-white truncate">{studyPlan.subject}</p>
          <p className="text-xs text-amber-400 font-semibold mt-1">Exam on {studyPlan.examDate}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Overall Plan Progress</div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-400">{progressPercent}%</span>
            <span className="text-xs text-slate-400">
              ({completedTasks} of {totalTasks} tasks)
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Schedule Volume</div>
          <p className="text-base font-bold text-white">
            {studyPlan.days.length} Days • {studyPlan.availableHoursPerDay}h/day
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Total Study Budget: {studyPlan.days.length * studyPlan.availableHoursPerDay} Hours
          </p>
        </div>
      </div>

      {/* Days Timeline View */}
      <div className="space-y-4">
        {studyPlan.days.map((day) => {
          const isExpanded = expandedDay === day.dayNumber;
          const dayCompletedTasks = day.tasks.filter((t) => t.completed).length;
          const allDone = dayCompletedTasks === day.tasks.length && day.tasks.length > 0;
          const hasRemediation = day.tasks.some((t) => t.isWeakAreaRemediation);

          return (
            <div
              key={day.dayNumber}
              className={`rounded-2xl border transition overflow-hidden ${
                allDone
                  ? 'bg-slate-900/60 border-slate-800'
                  : hasRemediation
                  ? 'bg-slate-900 border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Day Header Accordion */}
              <div
                onClick={() => setExpandedDay(isExpanded ? null : day.dayNumber)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      allDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : hasRemediation
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    D{day.dayNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        Day {day.dayNumber}: {day.topics.join(' & ')}
                      </h3>
                      {hasRemediation && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                          Weak Area Injected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Date: {day.date} • Duration: {day.durationMinutes} minutes ({Math.round(day.durationMinutes / 60)} hrs)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-slate-300">
                      {dayCompletedTasks} / {day.tasks.length} tasks
                    </span>
                    <div className="w-20 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${day.tasks.length ? (dayCompletedTasks / day.tasks.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Tasks List (Expanded) */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                    <span>Actionable Tasks for Day {day.dayNumber}:</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('quizzes')}
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      Take Quiz on this Topic
                    </button>
                  </div>

                  {day.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTaskCompletion(day.dayNumber, task.id)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                        task.completed
                          ? 'bg-slate-950 border-slate-800/80 text-slate-500'
                          : task.isWeakAreaRemediation
                          ? 'bg-amber-950/20 border-amber-500/40 text-slate-100 hover:bg-amber-950/30'
                          : 'bg-slate-850 border-slate-800 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-emerald-400 cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs sm:text-sm font-medium ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                          }`}
                        >
                          {task.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            {task.estimatedMinutes} mins
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {task.topicTag}
                          </span>
                          {task.isWeakAreaRemediation && (
                            <span className="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-semibold border border-amber-500/30">
                              ⚡ Adaptive Quiz Remedy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
