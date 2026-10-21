import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Quiz, QuizSubmission } from '../types';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Clock,
  BookOpen,
  Award,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { generateQuizAPI, evaluateQuizAPI } from '../services/api';

export const QuizView: React.FC = () => {
  const {
    activeQuiz,
    setActiveQuiz,
    submissions,
    addQuizSubmission,
    activeMaterial,
    profile,
    setActiveTab,
    showCelebration,
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(profile.subjects[0] || 'Database Management Systems');
  const [selectedTopic, setSelectedTopic] = useState('Normalization & Transactions');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentResult, setCurrentResult] = useState<QuizSubmission | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGenerateNewQuiz = async () => {
    setIsGenerating(true);
    setStatusMessage('Generating diagnostic MCQs with Gemini AI from syllabus...');
    try {
      const generated = await generateQuizAPI({
        subject: selectedSubject,
        topic: selectedTopic,
        count: 5,
        materialText: activeMaterial?.rawText || '',
      });

      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: generated.title || `${selectedSubject} - ${selectedTopic} Diagnostic`,
        subject: selectedSubject,
        topic: selectedTopic,
        materialId: activeMaterial?.id,
        questions: generated.questions || [],
        createdAt: new Date().toISOString(),
      };

      setActiveQuiz(newQuiz);
      setUserAnswers({});
      setCurrentResult(null);
      setStatusMessage('Quiz generated! Complete the questions below.');
      showCelebration();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (currentResult) return; // locked after submission
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    setIsSubmitting(true);
    setStatusMessage('Evaluating answers and analyzing topic-level mastery...');

    try {
      const evaluation = await evaluateQuizAPI(activeQuiz, userAnswers);
      setCurrentResult(evaluation);
      addQuizSubmission(evaluation);
      setStatusMessage('Evaluation complete! Weak topics identified and study loop updated.');
      showCelebration();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo shortcut: Simulate student taking quiz and scoring 40% on Normalization
  const handleSimulateDemoSubmission = async () => {
    if (!activeQuiz) return;
    const demoAnswers: Record<string, number> = {
      q1: 0, // Wrong on 2NF
      q2: 2, // Wrong on Partial Dependency
      q3: 0, // Wrong on 3NF vs BCNF
      q4: 2, // Correct on ACID Recovery Manager
      q5: 1, // Correct on Conflict Serializability
    };
    setUserAnswers(demoAnswers);
    setIsSubmitting(true);
    try {
      const evaluation = await evaluateQuizAPI(activeQuiz, demoAnswers);
      setCurrentResult(evaluation);
      addQuizSubmission(evaluation);
      setStatusMessage('Demo evaluation processed! Normalization flagged as weak topic.');
      showCelebration();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const totalQuestions = activeQuiz?.questions.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            AI Quiz &amp; Weak Topic Detection
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Tests conceptual understanding from your uploaded notes and pinpoints exact weaknesses for targeted remediation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateDemoSubmission}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            title="Instant 1-click simulation for hackathon demo (40% score on Normalization)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>⚡ Demo Submit (Score 40%)</span>
          </button>
        </div>
      </div>

      {/* Quiz Generator Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            >
              {profile.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Topic:</span>
            <input
              type="text"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              placeholder="e.g. Normalization & Transactions"
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleGenerateNewQuiz}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Generating...' : 'Generate New AI Quiz'}</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <p className="text-xs font-semibold text-purple-400 animate-pulse text-center">
          {statusMessage}
        </p>
      )}

      {/* RESULT & WEAK TOPIC DIAGNOSTIC CARD (Shown after submission) */}
      {currentResult && (
        <div className="rounded-2xl border-2 border-rose-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    currentResult.percentage < 60
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  Diagnostic Score Report
                </span>
                <span className="text-xs text-slate-400">• {currentResult.subject}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Your Score: {currentResult.score} / {currentResult.totalQuestions} ({currentResult.percentage}%)
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setUserAnswers({});
                  setCurrentResult(null);
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={() => setActiveTab('study-plan')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>View Updated Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI WEAK TOPIC RECOMMENDATION BANNER */}
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>AI Academic Mentor Recommendation</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              &quot;{currentResult.recommendation}&quot;
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Clock className="w-3.5 h-3.5" />
                +30 Minutes Remedial Study Injected into Study Plan Day 1
              </span>
            </div>
          </div>

          {/* Topic-by-Topic Mastery Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Topic-by-Topic Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {Object.entries(currentResult.topicBreakdown).map(([topic, stats]) => {
                const isWeak = stats.percentage < 60;
                return (
                  <div
                    key={topic}
                    className={`p-3.5 rounded-xl border ${
                      isWeak
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold truncate">{topic}</span>
                      <span className="font-black text-sm">{stats.percentage}%</span>
                    </div>
                    <p className="text-[11px] opacity-80">
                      {stats.correct} / {stats.total} correct
                    </p>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full ${isWeak ? 'bg-rose-500' : 'bg-emerald-400'}`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ QUESTIONS LIST */}
      {activeQuiz ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              {activeQuiz.title}
            </h2>
            <span className="text-xs text-slate-400">
              Answered {answeredCount} of {totalQuestions}
            </span>
          </div>

          {activeQuiz.questions.map((q, qIndex) => {
            const selectedOption = userAnswers[q.id];
            const isSubmitted = Boolean(currentResult);
            const isCorrect = isSubmitted && selectedOption === q.correctAnswer;
            const isIncorrect = isSubmitted && selectedOption !== undefined && selectedOption !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-950/15 border-emerald-500/40'
                      : 'bg-rose-950/15 border-rose-500/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {q.topicTag}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Difficulty: {q.difficulty}
                    </span>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Question Text */}
                <p className="text-sm sm:text-base font-semibold text-slate-100 mb-4 leading-relaxed">
                  {q.question}
                </p>

                {/* 4 Options Grid */}
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => {
                    const isPicked = selectedOption === optIdx;
                    const isActualAnswer = isSubmitted && q.correctAnswer === optIdx;

                    let optionStyle = 'bg-slate-850 border-slate-800 text-slate-200 hover:border-slate-700';

                    if (isSubmitted) {
                      if (isActualAnswer) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (isPicked && !isCorrect) {
                        optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through';
                      } else {
                        optionStyle = 'bg-slate-900/60 border-slate-800/80 text-slate-500';
                      }
                    } else if (isPicked) {
                      optionStyle = 'bg-purple-950/40 border-purple-500 text-white font-medium shadow-sm';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        disabled={isSubmitted}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer select-none ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isSubmitted && isActualAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isPicked && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card (Revealed after submission) */}
                {isSubmitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <p className="font-bold text-slate-300 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                      Explanation:
                    </p>
                    <p className="text-slate-400 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Submit Action */}
          {!currentResult && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount === 0 || isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating Score...' : `Submit Quiz (${answeredCount}/${totalQuestions})`}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          No active quiz. Click &quot;Generate New AI Quiz&quot; above to start.
        </div>
      )}

      {/* Quiz Submission History */}
      {submissions.length > 0 && (
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Previous Quiz Attempts &amp; Diagnostic Log
          </h3>
          <div className="space-y-2">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{sub.quizTitle}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Weak: {sub.weakTopics.join(', ')} • Date: {new Date(sub.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-black text-sm ${
                      sub.percentage < 60 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {sub.percentage}%
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {sub.score}/{sub.totalQuestions}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
