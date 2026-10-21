import React, { useState, useEffect } from 'react';
import { QuestionPaper, QuestionBankItem, PracticeAttemptData } from '../../types';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import {
  fetchPaperQuestionsAPI,
  startPracticeSessionAPI,
  submitPracticeSessionAPI,
} from '../../services/api';
import confetti from 'canvas-confetti';

interface PracticeSessionModalProps {
  paper: QuestionPaper | null;
  mode: 'practice' | 'mock_exam';
  onClose: () => void;
  onAttemptSubmitted: (attempt: PracticeAttemptData) => void;
}

export const PracticeSessionModal: React.FC<PracticeSessionModalProps> = ({
  paper,
  mode,
  onClose,
  onAttemptSubmitted,
}) => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { option?: number; text?: string; timeSpent: number }>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  // Countdown timer for Mock Exam mode (e.g. 90 minutes)
  const initialSeconds = mode === 'mock_exam' ? (paper?.duration_minutes || 90) * 60 : 0;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<PracticeAttemptData | null>(null);

  useEffect(() => {
    if (!paper) return;
    initSession();
  }, [paper, mode]);

  // Timer countdown
  useEffect(() => {
    if (mode !== 'mock_exam' || submissionResult || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, submissionResult, secondsLeft]);

  const initSession = async () => {
    if (!paper) return;
    setLoading(true);
    try {
      const [questionsData, sessionData] = await Promise.all([
        fetchPaperQuestionsAPI(paper.id),
        startPracticeSessionAPI({
          student_id: 'alex_cse_3',
          question_paper_id: paper.id,
          subject_id: paper.subject_id,
          practice_mode: mode,
          question_limit: 10,
        }),
      ]);
      setQuestions(questionsData);
      setAttemptId(sessionData.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: string, optIndex: number) => {
    if (submissionResult) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        option: optIndex,
        timeSpent: (prev[questionId]?.timeSpent || 0) + 10,
      },
    }));
  };

  const handleTextChange = (questionId: string, text: string) => {
    if (submissionResult) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        text,
        timeSpent: (prev[questionId]?.timeSpent || 0) + 10,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payloadAnswers = questions.map((q) => {
        const userAns = answers[q.id];
        return {
          question_id: q.id,
          selected_option: userAns?.option,
          answer_text: userAns?.text || '',
          time_spent_seconds: userAns?.timeSpent || 30,
        };
      });

      const result = await submitPracticeSessionAPI(attemptId, payloadAnswers);
      setSubmissionResult(result);
      onAttemptSubmitted(result);

      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!paper) return null;

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  mode === 'mock_exam'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {mode === 'mock_exam' ? 'Timed Mock Examination Mode' : 'Interactive Practice Mode'}
              </span>
              <span className="text-xs text-slate-400">• {paper.subject_id}</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-1 truncate max-w-md sm:max-w-xl">
              {paper.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {mode === 'mock_exam' && !submissionResult && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs sm:text-sm font-black border ${
                  secondsLeft < 300
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300 animate-pulse'
                    : 'bg-slate-800 border-slate-700 text-amber-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Evaluation Banner (After submission) */}
        {submissionResult && (
          <div className="p-5 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-purple-950/60 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Exam Evaluation Completed
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                Score: {submissionResult.correct_answers} / {submissionResult.total_questions} ({submissionResult.score_percentage}%)
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Results recorded into your AI progress monitor. Scroll below to review solutions for each question.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Clock className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-2" />
            <p>Initializing practice environment...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            No questions available in this session.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm leading-relaxed">
            {/* Question Progress Tracker */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-semibold text-slate-300">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-6 h-6 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      i === currentIndex
                        ? 'bg-blue-600 text-white'
                        : answers[questions[i].id]?.option !== undefined || answers[questions[i].id]?.text
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Question Card */}
            {currentQ && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                      {currentQ.topic_id || 'Core Topic'}
                    </span>
                    <span className="text-slate-500 text-xs">
                      Difficulty: {currentQ.difficulty}
                    </span>
                  </div>
                  {currentQ.marks && (
                    <span className="text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {currentQ.marks} Marks
                    </span>
                  )}
                </div>

                <p className="text-base font-semibold text-white leading-relaxed">
                  {currentQ.question_text}
                </p>

                {/* MCQ Options (if available) */}
                {currentQ.options && currentQ.options.length > 0 ? (
                  <div className="space-y-2 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isPicked = answers[currentQ.id]?.option === optIdx;
                      const isActualCorrect = submissionResult && currentQ.correct_option === optIdx;

                      let style = 'bg-slate-850 border-slate-800 text-slate-200 hover:border-slate-700';
                      if (submissionResult) {
                        if (isActualCorrect) style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                        else if (isPicked && !isActualCorrect) style = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through';
                      } else if (isPicked) {
                        style = 'bg-blue-950/40 border-blue-500 text-white font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 cursor-pointer select-none ${style}`}
                        >
                          <span>{opt}</span>
                          <span className="text-xs text-slate-400 font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Written Answer Box */
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-medium text-slate-400">
                      Your Written Response / Solution Working:
                    </label>
                    <textarea
                      rows={5}
                      value={answers[currentQ.id]?.text || ''}
                      onChange={(e) => handleTextChange(currentQ.id, e.target.value)}
                      placeholder="Type your academic derivation, formulas, or explanation here..."
                      className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white font-sans focus:outline-none focus:border-blue-500"
                      disabled={Boolean(submissionResult)}
                    />
                  </div>
                )}

                {/* Practice Mode Interactive Helpers: Hint & Reveal Solution */}
                {mode === 'practice' && !submissionResult && (
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setRevealedHints((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>{revealedHints[currentQ.id] ? 'Hide Hint' : 'Request Hint'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setRevealedSolutions((prev) => ({
                          ...prev,
                          [currentQ.id]: !prev[currentQ.id],
                        }))
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>{revealedSolutions[currentQ.id] ? 'Hide Solution' : 'Reveal Solution'}</span>
                    </button>
                  </div>
                )}

                {/* Revealed Hint Box */}
                {revealedHints[currentQ.id] && (
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                    <p className="font-bold text-amber-400">💡 Academic Hint:</p>
                    <p>
                      Check the definition of prime attributes and examine whether non-prime attributes depend on a proper subset of the key.
                    </p>
                  </div>
                )}

                {/* Revealed Solution Box */}
                {(revealedSolutions[currentQ.id] || submissionResult) && (
                  <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Step-by-Step Verified Solution:
                      </span>
                      <span className="text-[10px] text-slate-500">Official Exam Scheme</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                      {currentQ.topic_id === 'Normalization'
                        ? '1. Check 1NF: Attribute values must be atomic.\n2. Check 2NF: No non-prime attribute may depend on a proper subset of candidate key.\n3. Check 3NF: For all X -> A, X is superkey or A is prime.\n4. Decompose relations cleanly to eliminate anomalies.'
                        : 'Review the underlying transaction isolation and scheduling criteria for maximum examination marks.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation & Submit */}
        <div className="p-4 bg-slate-850 border-t border-slate-800 flex items-center justify-between shrink-0">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold disabled:opacity-30 cursor-pointer"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Next Question
              </button>
            ) : null}

            {!submissionResult && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Grading Attempt...' : 'Submit Exam Attempt'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
