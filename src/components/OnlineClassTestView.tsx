import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OnlineClassTest, ClassTestQuestion } from '../types';
import {
  Timer,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Play,
  Award,
  Layers,
  FileQuestion,
  HelpCircle,
  BookOpen,
  Send,
  XCircle,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';

export const OnlineClassTestView: React.FC = () => {
  const {
    classTests,
    testSubmissions,
    createClassTest,
    submitTest,
    userRole,
    profile,
    facultyProfile,
    showCelebration,
  } = useApp();

  // Test Runner State
  const [activeTest, setActiveTest] = useState<OnlineClassTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [testResultSummary, setTestResultSummary] = useState<{
    score: number;
    totalMarks: number;
    percentage: number;
    passed: boolean;
  } | null>(null);

  // Faculty Create Test Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [testTitle, setTestTitle] = useState('DBMS Unit 2: SQL & Relational Algebra Quick Test');
  const [testSubject, setTestSubject] = useState(profile.subjects[0] || 'Database Management Systems');
  const [testDuration, setTestDuration] = useState(25);
  const [testEndDate, setTestEndDate] = useState('2026-10-31');
  const [testPassingMarks, setTestPassingMarks] = useState(12);

  // Sample initial questions for builder
  const [builderQuestions, setBuilderQuestions] = useState<ClassTestQuestion[]>([
    {
      id: 'q-builder-1',
      type: 'mcq',
      text: 'Which SQL keyword is strictly required when using aggregate functions like AVG or COUNT alongside non-aggregated columns in a SELECT statement?',
      options: ['ORDER BY', 'GROUP BY', 'HAVING', 'JOIN'],
      correctAnswer: 'GROUP BY',
      marks: 5,
    },
    {
      id: 'q-builder-2',
      type: 'mcq',
      text: 'In relational algebra, what does the Cartesian product (R × S) produce?',
      options: [
        'All common rows between R and S',
        'All combinations of every tuple in R with every tuple in S',
        'Rows satisfying a foreign key match',
        'Only tuples with distinct primary keys',
      ],
      correctAnswer: 'All combinations of every tuple in R with every tuple in S',
      marks: 5,
    },
    {
      id: 'q-builder-3',
      type: 'subjective',
      text: 'Briefly explain the primary difference between 2NF (Second Normal Form) and 3NF (Third Normal Form) using an example of functional dependencies.',
      sampleAnswer:
        '2NF requires being in 1NF and having no partial dependencies (every non-prime attribute must depend fully on the primary key). 3NF requires being in 2NF and having no transitive dependencies (no non-prime attribute depends on another non-prime attribute).',
      marks: 10,
    },
  ]);

  // Timer countdown hook during active test
  useEffect(() => {
    if (!activeTest || isTestCompleted) return;

    if (timeRemainingSeconds <= 0) {
      handleAutoSubmitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTest, timeRemainingSeconds, isTestCompleted]);

  const handleStartTest = (test: OnlineClassTest) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setStudentAnswers({});
    setTimeRemainingSeconds(test.durationMinutes * 60);
    setIsTestCompleted(false);
    setTestResultSummary(null);
  };

  const handleAutoSubmitTest = () => {
    if (!activeTest) return;
    handleSubmitActiveTest();
  };

  const handleSubmitActiveTest = () => {
    if (!activeTest) return;

    let totalMarks = 0;
    let earnedMarks = 0;

    activeTest.questions.forEach((q) => {
      totalMarks += q.marks;
      const given = studentAnswers[q.id]?.trim();
      if (q.type === 'mcq') {
        if (given && q.correctAnswer && given.toLowerCase() === q.correctAnswer.toLowerCase()) {
          earnedMarks += q.marks;
        }
      } else {
        // Subjective auto-credit for earnest responses in prototype
        if (given && given.length > 30) {
          earnedMarks += Math.round(q.marks * 0.85);
        } else if (given && given.length > 10) {
          earnedMarks += Math.round(q.marks * 0.5);
        }
      }
    });

    const percentage = Math.round((earnedMarks / totalMarks) * 100);
    const passingThreshold = activeTest.passingMarks ?? Math.round(activeTest.totalMarks * 0.4);
    const passed = earnedMarks >= passingThreshold;

    submitTest({
      testId: activeTest.id,
      studentRollNo: profile.rollNo || '2024CS104',
      studentName: profile.name,
      answers: studentAnswers,
      score: earnedMarks,
      totalMarks: totalMarks,
      passed: passed,
      feedback: passed
        ? 'Well executed. Good conceptual command over relational constraints and SQL clauses.'
        : 'Review functional dependency definitions and revise relational algebra operators.',
    });

    setTestResultSummary({
      score: earnedMarks,
      totalMarks,
      percentage,
      passed,
    });
    setIsTestCompleted(true);
    showCelebration();
  };

  const handleAddBuilderQuestion = (type: 'mcq' | 'subjective') => {
    const newQ: ClassTestQuestion = {
      id: `q-b-${Date.now()}`,
      type: type,
      text: type === 'mcq' ? 'New multiple-choice question...' : 'New subjective concept question...',
      options: type === 'mcq' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correctAnswer: type === 'mcq' ? 'Option A' : undefined,
      sampleAnswer: type === 'subjective' ? 'Expected key points...' : undefined,
      marks: type === 'mcq' ? 5 : 10,
    };
    setBuilderQuestions([...builderQuestions, newQ]);
  };

  const handleCreateTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim() || builderQuestions.length === 0) return;

    const totalCalculatedMarks = builderQuestions.reduce((s, q) => s + q.marks, 0);

    createClassTest({
      title: testTitle.trim(),
      subject: testSubject,
      createdBy: facultyProfile.name,
      durationMinutes: Number(testDuration),
      endDate: testEndDate,
      totalMarks: totalCalculatedMarks,
      passingMarks: Number(testPassingMarks),
      status: 'live',
      questions: builderQuestions,
    });

    setIsCreateModalOpen(false);
    showCelebration();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Timer className="w-6 h-6 text-purple-400" />
              Online Timed Class Tests
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Automated Examination
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {userRole === 'faculty'
              ? 'Author timed MCQ and subjective assessments, schedule test windows, and monitor cohort test performance.'
              : 'Attend scheduled class tests within the timeline, answer MCQs and subjective questions, and receive graded performance feedback.'}
          </p>
        </div>

        {userRole === 'faculty' && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Class Test</span>
          </button>
        )}
      </div>

      {/* Active Notification Banner for Students */}
      {userRole === 'student' && classTests.some((t) => t.status === 'live' || t.status === 'active' || t.status === 'upcoming') && !activeTest && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border-2 border-purple-500/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 animate-pulse">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                🔔 Active Test Window Available
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                {classTests[0]?.title} • {classTests[0]?.durationMinutes} Minutes Window
              </p>
              <p className="text-xs text-slate-400">
                Subject: {classTests[0]?.subject} | Closes on: {classTests[0]?.endDate || classTests[0]?.deadline || '2026-10-31'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleStartTest(classTests[0])}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Attend Test Now</span>
          </button>
        </div>
      )}

      {/* ACTIVE TEST INTERFACE (Full Screen Exam Mode) */}
      {activeTest && (
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-purple-500/40 shadow-2xl space-y-6">
          {/* Test Header with Countdown Clock */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                  Live Test in Progress
                </span>
                <span className="text-xs text-slate-400">• {activeTest.subject}</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">{activeTest.title}</h2>
              <p className="text-xs text-slate-400">
                Student: <strong className="text-slate-200">{profile.name}</strong> ({profile.rollNo})
              </p>
            </div>

            {/* Countdown Clock Box */}
            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Left</span>
                <span
                  className={`text-2xl font-mono font-black tabular-nums ${
                    timeRemainingSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
                  }`}
                >
                  {formatTimer(timeRemainingSeconds)}
                </span>
              </div>
              <button
                onClick={handleSubmitActiveTest}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                Submit Test
              </button>
            </div>
          </div>

          {!isTestCompleted ? (
            <div className="space-y-6">
              {/* Question Navigation Chips */}
              <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-800/80">
                <span className="text-xs text-slate-400 mr-1">Questions:</span>
                {activeTest.questions.map((q, idx) => {
                  const hasAnswered = !!studentAnswers[q.id]?.trim();
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : hasAnswered
                          ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Question Box */}
              {(() => {
                const q = activeTest.questions[currentQuestionIndex];
                if (!q) return null;

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-400 uppercase tracking-wider">
                        Question {currentQuestionIndex + 1} of {activeTest.questions.length} • ({q.type.toUpperCase()})
                      </span>
                      <span className="text-slate-400 font-mono font-bold">{q.marks} Marks</span>
                    </div>

                    <p className="text-base text-slate-100 font-medium leading-relaxed bg-slate-850 p-4 rounded-2xl border border-slate-800">
                      {q.text || q.questionText}
                    </p>

                    {/* MCQ Options */}
                    {q.type === 'mcq' && q.options && (
                      <div className="space-y-2.5 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = studentAnswers[q.id] === opt;
                          return (
                            <button
                              key={optIdx}
                              onClick={() =>
                                setStudentAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt,
                                }))
                              }
                              className={`w-full p-3.5 rounded-xl text-left text-xs transition cursor-pointer flex items-center justify-between border ${
                                isSelected
                                  ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                                  : 'bg-slate-850/80 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                <span
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                    isSelected
                                      ? 'border-purple-400 bg-purple-500 text-white'
                                      : 'border-slate-600 text-slate-400'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Subjective Written Answer Box */}
                    {q.type === 'subjective' && (
                      <div className="space-y-2 pt-2">
                        <label className="block text-xs font-semibold text-slate-400">
                          Your Written Subjective Answer:
                        </label>
                        <textarea
                          rows={6}
                          value={studentAnswers[q.id] || ''}
                          onChange={(e) =>
                            setStudentAnswers((prev) => ({
                              ...prev,
                              [q.id]: e.target.value,
                            }))
                          }
                          placeholder="Formulate your detailed response, definitions, reasoning, and examples..."
                          className="w-full bg-slate-850 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-500">
                          Character count: {(studentAnswers[q.id] || '').length} • Detailed responses receive higher rubric scores.
                        </span>
                      </div>
                    )}

                    {/* Question Pagination Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-semibold"
                      >
                        ← Previous
                      </button>

                      {currentQuestionIndex < activeTest.questions.length - 1 ? (
                        <button
                          onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                          className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                        >
                          Next Question →
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitActiveTest}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                        >
                          Finish &amp; Submit
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Result Receipt Screen */
            <div className="p-8 rounded-2xl bg-slate-850 border border-slate-800 text-center space-y-4">
              <div
                className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white ${
                  testResultSummary?.passed ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Test Completed &amp; Evaluated!</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your responses have been recorded on the department ledger.
              </p>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto flex items-center justify-around">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Your Score</span>
                  <p className="text-2xl font-black text-white">
                    {testResultSummary?.score} / {testResultSummary?.totalMarks}
                  </p>
                </div>
                <div className="h-8 w-px bg-slate-800" />
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Grade</span>
                  <p
                    className={`text-2xl font-black ${
                      testResultSummary?.passed ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {testResultSummary?.percentage}%
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveTest(null)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Return to Tests Roster
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tests Roster Table & Past Submissions */}
      {!activeTest && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Department Scheduled Online Tests</h2>
              <span className="text-xs text-slate-400 font-mono">{classTests.length} Scheduled</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classTests.map((test) => {
                const submission = testSubmissions.find((s) => s.testId === test.id);

                return (
                  <div
                    key={test.id}
                    className="p-5 rounded-2xl bg-slate-850 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {test.subject}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {test.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{test.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Questions: <strong className="text-white">{test.questions.length}</strong></span>
                      <span>Total Marks: <strong className="text-white">{test.totalMarks}</strong></span>
                      <span>Passing: <strong className="text-emerald-400">{test.passingMarks ?? Math.round(test.totalMarks * 0.4)}</strong></span>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">Due: {test.endDate || test.deadline || '2026-10-31'}</span>

                      {submission ? (
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Score: {submission.score ?? submission.mcqScore ?? 0}/{submission.totalMarks ?? submission.maxScore ?? test.totalMarks}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartTest(test)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Attend Test</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Submissions Ledger (Scores & Feedback) */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white">Evaluated Test History &amp; Faculty Feedback</h2>

            <div className="space-y-3">
              {testSubmissions.map((sub) => {
                const targetTest = classTests.find((t) => t.id === sub.testId);

                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{targetTest?.title || 'Class Test'}</span>
                        <span className="text-[10px] text-slate-400">• {sub.submittedAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Student: <strong className="text-slate-200">{sub.studentName}</strong> ({sub.studentRollNo})
                      </p>
                      {(sub.feedback || sub.facultyFeedback) && (
                        <p className="text-[11px] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                          <strong>Faculty Assessment:</strong> {sub.feedback || sub.facultyFeedback}
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-white">
                        {sub.score ?? sub.mcqScore ?? 0} / {sub.totalMarks ?? sub.maxScore ?? 20}
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          (sub.passed ?? (sub.status === 'evaluated'))
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {(sub.passed ?? (sub.status === 'evaluated')) ? 'PASSED' : 'REMEDIAL NEEDED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Faculty Create Test Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-400" />
                Author Online Class Test
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Test Title</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject</label>
                  <select
                    value={testSubject}
                    onChange={(e) => setTestSubject(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {profile.subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={testDuration}
                    onChange={(e) => setTestDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Timeline</label>
                  <input
                    type="date"
                    value={testEndDate}
                    onChange={(e) => setTestEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Questions List Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-200">
                    Questions ({builderQuestions.length})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddBuilderQuestion('mcq')}
                      className="px-2 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold"
                    >
                      + Add MCQ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddBuilderQuestion('subjective')}
                      className="px-2 py-1 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold"
                    >
                      + Add Subjective
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {builderQuestions.map((q, idx) => (
                    <div key={q.id} className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-purple-400">
                          Q{idx + 1} ({q.type.toUpperCase()})
                        </span>
                        <span className="font-mono text-slate-400">{q.marks} Marks</span>
                      </div>
                      <input
                        type="text"
                        value={q.text}
                        onChange={(e) => {
                          const updated = [...builderQuestions];
                          updated[idx] = { ...updated[idx], text: e.target.value };
                          setBuilderQuestions(updated);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-md shadow-purple-600/30"
                >
                  Publish &amp; Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
