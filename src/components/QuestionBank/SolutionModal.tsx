import React, { useState, useEffect } from 'react';
import { QuestionBankItem, QuestionSolution } from '../../types';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
  FileText,
  Lightbulb,
  Bookmark,
  BookmarkCheck,
  RotateCw,
  Copy,
  BrainCircuit,
} from 'lucide-react';
import { fetchQuestionSolutionAPI, generateQuestionSolutionAPI, saveQuestionAPI, removeSavedQuestionAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { cleanAcademicSymbols } from '../AIChatView';

interface SolutionModalProps {
  question: QuestionBankItem | null;
  onClose: () => void;
  onBookmarkToggle?: (questionId: string, isSaved: boolean) => void;
}

export const SolutionModal: React.FC<SolutionModalProps> = ({
  question,
  onClose,
  onBookmarkToggle,
}) => {
  const { openAIChatWithQuery } = useApp();
  const [solution, setSolution] = useState<QuestionSolution | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [viewMode, setViewMode] = useState<'detailed' | 'short'>('detailed');
  const [showHint, setShowHint] = useState(false);
  const [isSaved, setIsSaved] = useState(question?.is_saved || false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!question) return;
    setIsSaved(question.is_saved || false);
    setShowHint(false);
    loadSolution(question.id);
  }, [question]);

  const loadSolution = async (questionId: string) => {
    setLoading(true);
    try {
      const data = await fetchQuestionSolutionAPI(questionId);
      setSolution(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAI = async () => {
    if (!question) return;
    setGeneratingAI(true);
    try {
      const data = await generateQuestionSolutionAPI(question.id, viewMode);
      setSolution(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleToggleSave = async () => {
    if (!question) return;
    try {
      if (isSaved) {
        await removeSavedQuestionAPI(question.id);
        setIsSaved(false);
        onBookmarkToggle?.(question.id, false);
      } else {
        await saveQuestionAPI(question.id, 'alex_cse_3', 'Saved for exam revision');
        setIsSaved(true);
        onBookmarkToggle?.(question.id, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    const textToCopy = viewMode === 'short' ? solution?.short_answer : solution?.detailed_explanation;
    if (textToCopy) {
      navigator.clipboard?.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                {question.subject_id}
              </span>
              {question.topic_id && (
                <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {question.topic_id}
                </span>
              )}
              {question.marks && (
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  [{question.marks} Marks]
                </span>
              )}
              <span className="text-[10px] text-slate-400">
                Difficulty: <strong className="text-slate-200">{question.difficulty}</strong>
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white mt-2 leading-relaxed">
              {question.question_number ? `${question.question_number}. ` : ''}
              {question.question_text}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title={isSaved ? 'Remove from Saved' : 'Save for Revision'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action & Mode Sub-Bar */}
        <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0 flex-wrap gap-2">
          {/* Toggle Short vs Detailed */}
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setViewMode('detailed')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'detailed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Detailed Step-by-Step
            </button>
            <button
              onClick={() => setViewMode('short')}
              className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                viewMode === 'short'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Concise Exam Summary
            </button>
          </div>

          <div className="flex items-center gap-2">
            {solution?.hint_text && (
              <button
                onClick={() => setShowHint(!showHint)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  showHint
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-850 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Solution'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                openAIChatWithQuery(
                  `I am studying this university problem from the question bank:\n\n"${question.question_text}"\n\nPlease break down the concept step-by-step and provide exam revision tips.`,
                  question.question_text
                );
              }}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
              title="Discuss directly in AI Chat"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-blue-200" />
              <span>Discuss with AI</span>
            </button>

            <button
              onClick={handleRegenerateAI}
              disabled={generatingAI}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Regenerate with Gemini AI"
            >
              <RotateCw className={`w-3.5 h-3.5 ${generatingAI ? 'animate-spin' : ''}`} />
              <span>{generatingAI ? 'Generating...' : 'AI Assist'}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm leading-relaxed text-slate-200">
          {/* Hint Card */}
          {showHint && solution?.hint_text && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase tracking-wider text-amber-400 text-[10px]">
                  Pedagogical Hint:
                </span>
                <p className="mt-1">{solution.hint_text}</p>
              </div>
            </div>
          )}

          {/* Verification Badge */}
          {solution && (
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {solution.solution_type === 'verified' ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Official Solution
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" /> AI-Generated Solution (Provisional — Verify with Syllabus)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 italic">
                Source: {solution.source_description}
              </span>
            </div>
          )}

          {/* Solution Text */}
          {loading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <RotateCw className="w-6 h-6 animate-spin mx-auto text-blue-400" />
              <p>Loading step-by-step solution...</p>
            </div>
          ) : solution ? (
            <div className="space-y-4">
              {viewMode === 'short' ? (
                <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-blue-400">
                    <FileText className="w-3.5 h-3.5" />
                    Concise Exam Answer ({question.marks || 5} Marks Summary)
                  </h3>
                  <p className="text-slate-100 leading-relaxed font-sans text-sm">
                    {solution.short_answer || solution.solution_text}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-850 border border-slate-800 whitespace-pre-line font-sans text-sm leading-relaxed text-slate-100">
                    {solution.detailed_explanation || solution.solution_text}
                  </div>

                  {/* Code snippet if applicable */}
                  {solution.code_snippet && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                        <Code2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Code Implementation / SQL Schema:</span>
                      </div>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
                        {solution.code_snippet}
                      </pre>
                    </div>
                  )}

                  {/* Diagram / Table if applicable */}
                  {solution.diagram_description && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs text-slate-300 whitespace-pre-line">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Table / Structure:
                      </div>
                      {solution.diagram_description}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              No solution recorded yet. Click &quot;AI Assist&quot; above to generate a step-by-step answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
