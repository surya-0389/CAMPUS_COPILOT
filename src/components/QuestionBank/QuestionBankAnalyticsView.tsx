import React, { useState, useEffect } from 'react';
import { QuestionBankAnalyticsData, RepeatedQuestionData, QuestionPaper } from '../../types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  Repeat,
  ShieldCheck,
} from 'lucide-react';
import { fetchQuestionBankProgressAPI, fetchRepeatedQuestionsAPI } from '../../services/api';

interface QuestionBankAnalyticsViewProps {
  onSelectPaperId: (paperId: string) => void;
  onOpenStudyPlan: () => void;
}

export const QuestionBankAnalyticsView: React.FC<QuestionBankAnalyticsViewProps> = ({
  onSelectPaperId,
  onOpenStudyPlan,
}) => {
  const [analytics, setAnalytics] = useState<QuestionBankAnalyticsData | null>(null);
  const [repeatedList, setRepeatedList] = useState<RepeatedQuestionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prog, rep] = await Promise.all([
        fetchQuestionBankProgressAPI('alex_cse_3'),
        fetchRepeatedQuestionsAPI('alex_cse_3', 'Database Management Systems'),
      ]);
      setAnalytics(prog);
      setRepeatedList(rep);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading progress analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mentor Weak Topic Recommendation Banner */}
      {analytics && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-2 border-rose-500/40 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              AI Learning Loop: Question Bank Diagnostic
            </span>
            <span className="text-xs text-slate-400">Database Management Systems</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {analytics.mentor_recommendation}
          </h3>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              onClick={onOpenStudyPlan}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Injected Study Remediation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelectPaperId('pyq-dbms-2024')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              Practice 2024 Normalization Paper
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Overall Accuracy</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">{analytics.overall_accuracy_percentage}%</p>
            <p className="text-xs text-slate-400 mt-1">
              {analytics.total_correct} of {analytics.total_questions_practiced} correct
            </p>
            <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  analytics.overall_accuracy_percentage >= 60 ? 'bg-emerald-400' : 'bg-rose-500'
                }`}
                style={{ width: `${analytics.overall_accuracy_percentage}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Practice Sessions</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-black text-blue-400">{analytics.total_attempts}</p>
            <p className="text-xs text-slate-400 mt-1">Completed papers &amp; tests</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Primary Weak Area</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-lg font-bold text-rose-300 truncate">
              {analytics.weak_topics[0] || 'Normalization'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Target 30 mins review</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Strong Area</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-lg font-bold text-emerald-300 truncate">
              {analytics.strong_topics[0] || 'Transactions & Concurrency'}
            </p>
            <p className="text-xs text-slate-400 mt-1">83% accuracy in tests</p>
          </div>
        </div>
      )}

      {/* Repeated Questions Historical Frequency Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Repeat className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Historical Repeated Question Patterns</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Derived from verified past papers in the database using exact matching and token similarity. (No future prediction claim).
            </p>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
            Factual Frequency
          </span>
        </div>

        <div className="space-y-3">
          {repeatedList.map((item) => (
            <div
              key={item.primary_question_id}
              className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {item.topic}
                </span>
                <span className="font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                  Appeared {item.occurrence_count} Times in Archives
                </span>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                {item.question_text}
              </p>

              {/* Historical Occurrences Timeline */}
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Archived Papers with this Question:
                </span>
                {item.historical_occurrences.map((occ, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>
                      • {occ.paper_title} ({occ.academic_year})
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        occ.match_type === 'Exact Repeat'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-indigo-500/20 text-indigo-300'
                      }`}
                    >
                      {occ.match_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended PYQs Card */}
      {analytics && analytics.recommended_pyqs && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Recommended Papers to Address Weak Topics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recommended_pyqs.map((p) => (
              <div
                key={p.paper_id}
                onClick={() => onSelectPaperId(p.paper_id)}
                className="p-4 rounded-xl bg-slate-850 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                    Targeted Revision
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{p.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{p.recommended_reason}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 font-semibold">
                  <span>{p.question_count} Questions</span>
                  <span className="flex items-center gap-1">
                    <span>Open Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
