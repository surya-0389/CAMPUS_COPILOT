import React, { useState, useEffect } from 'react';
import { QuestionPaper, QuestionBankItem } from '../../types';
import {
  FileText,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  BrainCircuit,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Play,
  RotateCw,
} from 'lucide-react';
import {
  fetchPaperDetailAPI,
  fetchPaperQuestionsAPI,
  saveQuestionAPI,
  removeSavedQuestionAPI,
  extractQuestionsAPI,
} from '../../services/api';
import { useApp } from '../../context/AppContext';

interface PaperDetailViewProps {
  paperId: string;
  onBack: () => void;
  onOpenSolution: (question: QuestionBankItem) => void;
  onStartPractice: (paper: QuestionPaper, mode: 'practice' | 'mock_exam') => void;
}

export const PaperDetailView: React.FC<PaperDetailViewProps> = ({
  paperId,
  onBack,
  onOpenSolution,
  onStartPractice,
}) => {
  const { openAIChatWithQuery } = useApp();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [extracting, setExtracting] = useState(false);

  useEffect(() => {
    loadData();
  }, [paperId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paperData, questionsData] = await Promise.all([
        fetchPaperDetailAPI(paperId),
        fetchPaperQuestionsAPI(paperId),
      ]);
      setPaper(paperData);
      setQuestions(questionsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (q: QuestionBankItem) => {
    try {
      if (q.is_saved) {
        await removeSavedQuestionAPI(q.id);
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...item, is_saved: false } : item))
        );
      } else {
        await saveQuestionAPI(q.id, 'alex_cse_3', 'Saved from paper detail');
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...item, is_saved: true } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExtractMore = async () => {
    if (!paper) return;
    setExtracting(true);
    try {
      await extractQuestionsAPI(paper.id, paper.title);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setExtracting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <RotateCw className="w-8 h-8 animate-spin mx-auto text-blue-400 mb-2" />
        <p>Loading question paper and questions...</p>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="py-12 text-center text-slate-400">
        <p>Question paper not found.</p>
        <button
          onClick={onBack}
          className="mt-3 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back & Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Papers List</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onStartPractice(paper, 'practice')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
            <span>Practice Untimed</span>
          </button>
          <button
            onClick={() => onStartPractice(paper, 'mock_exam')}
            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Timed Mock Exam ({paper.duration_minutes || 90}m)</span>
          </button>
        </div>
      </div>

      {/* Paper Information Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                {paper.subject_id}
              </span>
              <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {paper.semester} • {paper.course}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {paper.verification_status.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-2 leading-tight">
              {paper.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {paper.university_name} • {paper.college_name || 'Affiliated Colleges'}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold text-sm">
              <Award className="w-4 h-4" /> {paper.total_marks || 50} Maximum Marks
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Duration: {paper.duration_minutes || 120} Mins
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Session: {paper.exam_session} ({paper.academic_year})
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Source: {paper.source_description}</span>
          <span>{questions.length} Questions Indexed</span>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Questions in this Paper ({questions.length})
          </h2>

          <button
            onClick={handleExtractMore}
            disabled={extracting}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{extracting ? 'Extracting...' : 'AI Re-parse Questions'}</span>
          </button>
        </div>

        {questions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
            No extracted questions yet for this paper. Click &quot;AI Re-parse Questions&quot; above to automatically parse them from the document.
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center justify-center shrink-0">
                      {q.question_number || idx + 1}
                    </span>
                    {q.topic_id && (
                      <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {q.topic_id}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500">
                      Type: <strong className="text-slate-400">{q.question_type}</strong>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : q.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {q.marks && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {q.marks} Marks
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleSave(q)}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        q.is_saved
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                      title={q.is_saved ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      {q.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <p className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
                  {q.question_text}
                </p>

                {/* Options if MCQ */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="p-2.5 rounded-lg bg-slate-850 border border-slate-800 text-xs text-slate-300 font-sans"
                      >
                        <span className="font-bold text-slate-400 mr-2">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Solution Trigger */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Examination Question
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        openAIChatWithQuery(
                          `I have a question about this PYQ from ${paper?.title || 'Question Bank'}:\n\n"${q.question_text}"\n\nPlease break down the concept step-by-step and show the complete solution.`,
                          q.question_text,
                          paper?.subject_id
                        )
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                      <span>Discuss with AI</span>
                    </button>

                    <button
                      onClick={() => onOpenSolution(q)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>View Solution</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
