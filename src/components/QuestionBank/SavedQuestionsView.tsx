import React, { useState, useEffect } from 'react';
import { SavedQuestionItem, QuestionBankItem } from '../../types';
import {
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Trash2,
  BrainCircuit,
  Search,
  BookOpen,
  Award,
} from 'lucide-react';
import { fetchSavedQuestionsAPI, removeSavedQuestionAPI } from '../../services/api';

interface SavedQuestionsViewProps {
  onOpenSolution: (question: QuestionBankItem) => void;
}

export const SavedQuestionsView: React.FC<SavedQuestionsViewProps> = ({ onOpenSolution }) => {
  const [savedList, setSavedList] = useState<SavedQuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    setLoading(true);
    try {
      const data = await fetchSavedQuestionsAPI('alex_cse_3');
      setSavedList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (questionId: string) => {
    try {
      await removeSavedQuestionAPI(questionId, 'alex_cse_3');
      setSavedList((prev) => prev.filter((s) => s.question.id !== questionId));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = savedList.filter(
    (s) =>
      s.question.question_text.toLowerCase().includes(search.toLowerCase()) ||
      s.question.subject_id.toLowerCase().includes(search.toLowerCase()) ||
      (s.question.topic_id && s.question.topic_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400" />
            My Saved Questions ({savedList.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Questions you flagged during previous papers for rapid pre-exam revision.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved questions..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading saved questions...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <Bookmark className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-white">No saved questions found.</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse University PYQs or Internal Tests and click the bookmark icon on any question to save it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const q = item.question;
            return (
              <div
                key={item.saved_id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                      {q.subject_id}
                    </span>
                    {q.topic_id && (
                      <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                        {q.topic_id}
                      </span>
                    )}
                    {q.marks && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {q.marks} Marks
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemove(q.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
                  {q.question_text}
                </p>

                {item.notes && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-amber-300 font-sans">
                    <strong>My Note:</strong> {item.notes}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Saved on {new Date(item.created_at).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onOpenSolution(q)}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Step-by-Step Solution</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
