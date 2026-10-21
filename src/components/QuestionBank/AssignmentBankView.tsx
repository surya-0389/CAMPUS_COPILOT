import React, { useState, useEffect } from 'react';
import { QuestionAssignment, QuestionBankItem } from '../../types';
import {
  FileCheck,
  Calendar,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Lightbulb,
  Bookmark,
  CheckSquare,
  Square,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { fetchAssignmentsAPI, fetchAssignmentDetailAPI } from '../../services/api';

interface AssignmentBankViewProps {
  onOpenSolution: (question: QuestionBankItem) => void;
}

export const AssignmentBankView: React.FC<AssignmentBankViewProps> = ({ onOpenSolution }) => {
  const [assignments, setAssignments] = useState<QuestionAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<QuestionAssignment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await fetchAssignmentsAPI();
      setAssignments(data);
      if (data.length > 0) {
        const detail = await fetchAssignmentDetailAPI(data[0].id);
        setSelectedAssignment(detail);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAssignment = async (asgn: QuestionAssignment) => {
    try {
      const detail = await fetchAssignmentDetailAPI(asgn.id);
      setSelectedAssignment(detail);
    } catch (err) {
      setSelectedAssignment(asgn);
    }
  };

  const toggleCompleted = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_completed: !a.is_completed } : a))
    );
    if (selectedAssignment && selectedAssignment.id === id) {
      setSelectedAssignment({
        ...selectedAssignment,
        is_completed: !selectedAssignment.is_completed,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Academic Notice:</strong> Tracking an assignment as &quot;Attempted&quot; or &quot;Completed&quot; in Campus Copilot helps your personalized study plan and does not replace official grade submissions on your university LMS portal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assignments Sidebar */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Course Assignments ({assignments.length})
          </h3>

          <div className="space-y-2">
            {assignments.map((asgn) => {
              const isSelected = selectedAssignment?.id === asgn.id;
              return (
                <div
                  key={asgn.id}
                  onClick={() => handleSelectAssignment(asgn)}
                  className={`p-4 rounded-xl border transition cursor-pointer select-none ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">
                        Assignment #{asgn.assignment_number}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5 leading-snug">
                        {asgn.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">{asgn.subject_id}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleted(asgn.id);
                      }}
                      className="p-1 text-slate-400 hover:text-emerald-400 cursor-pointer"
                      title={asgn.is_completed ? 'Mark incomplete' : 'Mark as completed'}
                    >
                      {asgn.is_completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due: {asgn.due_date || 'Ongoing'}
                    </span>
                    <span className="text-amber-400 font-semibold">{asgn.max_marks || 25} Marks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Assignment Detailed Inspector */}
        {selectedAssignment ? (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Assignment #{selectedAssignment.assignment_number}
                  </span>
                  <span className="text-xs text-slate-400">{selectedAssignment.subject_id}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1.5">
                  {selectedAssignment.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Faculty: <strong className="text-slate-300">{selectedAssignment.uploaded_by}</strong> • {selectedAssignment.semester}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCompleted(selectedAssignment.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    selectedAssignment.is_completed
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedAssignment.is_completed ? 'Completed' : 'Mark Completed'}</span>
                </button>
              </div>
            </div>

            {/* Description & Reference */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2 text-xs sm:text-sm">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">Assignment Brief</h4>
              <p className="text-slate-300 leading-relaxed">{selectedAssignment.description}</p>
              {selectedAssignment.reference_material && (
                <p className="text-[11px] text-blue-400 pt-1 font-mono">
                  📖 Recommended Reference: {selectedAssignment.reference_material}
                </p>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assignment Questions &amp; Practice Drills
              </h3>

              {/* Sample standard questions for this assignment */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-xs font-bold text-white flex items-center justify-center">
                      1
                    </span>
                    <span className="text-xs font-semibold text-blue-400">Normalization Decomposition</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">10 Marks</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Given universal schema R(A, B, C, D, E, F) with F = &#123;A -&gt; BC, C -&gt; DE, E -&gt; F, F -&gt; A&#125;. Determine the highest normal form of R and decompose it into BCNF relations that preserve lossless join.
                </p>
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() =>
                      onOpenSolution({
                        id: 'q-asgn-1',
                        subject_id: selectedAssignment.subject_id,
                        topic_id: 'Normalization',
                        question_text:
                          'Given universal schema R(A, B, C, D, E, F) with F = {A -> BC, C -> DE, E -> F, F -> A}. Determine highest normal form and decompose into BCNF.',
                        marks: 10,
                        question_type: 'descriptive',
                        difficulty: 'Hard',
                        extraction_status: 'manual_verified',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Step-by-Step AI Solution &amp; Hint</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-xs font-bold text-white flex items-center justify-center">
                      2
                    </span>
                    <span className="text-xs font-semibold text-blue-400">Dependency Preservation Check</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">10 Marks</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200">
                  Prove whether the decomposition of R(Student, Course, Instructor) into R1(Instructor, Course) and R2(Student, Instructor) preserves the dependency &#123;Student, Course&#125; -&gt; Instructor.
                </p>
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() =>
                      onOpenSolution({
                        id: 'q-asgn-2',
                        subject_id: selectedAssignment.subject_id,
                        topic_id: 'Normalization',
                        question_text:
                          'Prove whether the decomposition of R(Student, Course, Instructor) into R1(Instructor, Course) and R2(Student, Instructor) preserves {Student, Course} -> Instructor.',
                        marks: 10,
                        question_type: 'descriptive',
                        difficulty: 'Hard',
                        extraction_status: 'manual_verified',
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>View Step-by-Step AI Solution &amp; Hint</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center text-slate-400">
            Select an assignment on the left to inspect questions and solutions.
          </div>
        )}
      </div>
    </div>
  );
};
