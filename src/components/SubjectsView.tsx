import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  FileCheck,
  BrainCircuit,
  FileText,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const {
    subjects,
    setSubjects,
    toggleTopicCompletion,
    setActiveTab,
    showCelebration,
    setActiveMaterial,
    materials,
    userRole,
    addTopicToSubject,
  } = useApp();

  const [expandedSubjectId, setExpandedSubjectId] = useState<string>(subjects[0]?.id || 'sub-dbms');
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubInstructor, setNewSubInstructor] = useState('');
  const [newSubCredits, setNewSubCredits] = useState('4');
  const [addingTopicUnit, setAddingTopicUnit] = useState<{ subId: string; unitNumber: number } | null>(null);
  const [newTopicText, setNewTopicText] = useState('');

  const handleToggleExpand = (id: string) => {
    setExpandedSubjectId((prev) => (prev === id ? '' : id));
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubName.trim(),
      code: newSubCode.trim(),
      instructor: newSubInstructor.trim() || 'Department Faculty',
      credits: Number(newSubCredits) || 4,
      readinessScore: 35,
      notesCount: 0,
      pyqCount: 0,
      units: [
        {
          id: `u-${Date.now()}-1`,
          unitNumber: 1,
          title: 'Foundations & Architecture',
          topics: ['Core Concepts', 'Theoretical Principles', 'Model Architectures'],
          completedTopics: [],
        },
        {
          id: `u-${Date.now()}-2`,
          unitNumber: 2,
          title: 'Methods & Implementations',
          topics: ['Algorithms', 'State Machines', 'Practical Analysis'],
          completedTopics: [],
        },
      ],
    };

    setSubjects((prev) => [...prev, newSub]);
    setNewSubName('');
    setNewSubCode('');
    setNewSubInstructor('');
    setIsAddSubjectOpen(false);
    showCelebration();
  };

  const handleJumpToNotes = (subjectName: string) => {
    const mat = materials.find((m) => m.subject.toLowerCase() === subjectName.toLowerCase());
    if (mat) setActiveMaterial(mat);
    setActiveTab('materials');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            My Academic Subjects &amp; Syllabus Coverage
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Curriculum syllabi, topic-level learning mastery, and direct links to exams and notes.
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        {subjects.map((sub) => {
          const isExpanded = expandedSubjectId === sub.id;
          const totalTopics = sub.units.reduce((sum, u) => sum + u.topics.length, 0);
          const completedTopics = sub.units.reduce((sum, u) => sum + u.completedTopics.length, 0);

          return (
            <div
              key={sub.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 shadow-sm overflow-hidden transition-all duration-200"
            >
              {/* Subject Summary Header */}
              <div
                onClick={() => handleToggleExpand(sub.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
                    {sub.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-bold text-white">{sub.name}</h2>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-semibold">
                        {sub.credits} Credits
                      </span>
                      {sub.instructor && (
                        <span className="text-xs text-slate-400">• {sub.instructor}</span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>
                        Coverage: <strong className="text-slate-200">{completedTopics}</strong> of{' '}
                        {totalTopics} topics ({sub.readinessScore}%)
                      </span>
                      {sub.examDate && (
                        <span>
                          Target Exam: <strong className="text-amber-400">{sub.examDate}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  {/* Readiness Progress Bar */}
                  <div className="w-32 hidden sm:block text-right">
                    <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                      <span>Readiness</span>
                      <span className="font-bold text-slate-200">{sub.readinessScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.readinessScore >= 70
                            ? 'bg-emerald-400'
                            : sub.readinessScore >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${sub.readinessScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-1 rounded-lg text-slate-400 hover:text-white transition">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Syllabus Breakdown */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 bg-slate-950/40 animate-fade-in">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 text-xs">
                    <span className="text-slate-400 font-medium mr-1">Subject Actions:</span>
                    <button
                      onClick={() => handleJumpToNotes(sub.name)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>View Notes ({sub.notesCount})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('question-bank')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Solve PYQs ({sub.pyqCount})</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                      <span>Take Diagnostic Quiz</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('study-plan')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Generate Study Plan</span>
                    </button>
                  </div>

                  {/* Units List */}
                  <div className="space-y-3">
                    {sub.units.map((unit) => {
                      const unitDone = unit.topics.filter((t) =>
                        unit.completedTopics.includes(t)
                      ).length;
                      return (
                        <div
                          key={unit.id}
                          className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <h3 className="font-bold text-white flex items-center gap-2">
                              <span className="text-blue-400">Unit {unit.unitNumber}:</span>{' '}
                              {unit.title}
                            </h3>
                            <span className="text-[11px] text-slate-400 tabular-nums">
                              {unitDone} of {unit.topics.length} covered
                            </span>
                          </div>

                          {/* Topics Checklist */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {unit.topics.map((topic) => {
                              const isCompleted = unit.completedTopics.includes(topic);
                              return (
                                <button
                                  key={topic}
                                  onClick={() =>
                                    toggleTopicCompletion(sub.id, unit.id, topic)
                                  }
                                  className={`flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition cursor-pointer select-none ${
                                    isCompleted
                                      ? 'bg-slate-950/80 text-slate-400 line-through'
                                      : 'bg-slate-850/80 text-slate-200 hover:bg-slate-850'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-500 hover:text-blue-400 shrink-0" />
                                  )}
                                  <span className="truncate">{topic}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Faculty: Add Topic to this Unit */}
                          {userRole === 'faculty' && (
                            <div className="pt-2 border-t border-slate-800/60">
                              {addingTopicUnit?.subId === sub.id && addingTopicUnit?.unitNumber === unit.unitNumber ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={newTopicText}
                                    onChange={(e) => setNewTopicText(e.target.value)}
                                    placeholder="Enter new syllabus topic name..."
                                    className="flex-1 bg-slate-800 border border-purple-500/50 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        if (newTopicText.trim()) {
                                          addTopicToSubject(sub.id, unit.unitNumber, newTopicText.trim());
                                          setNewTopicText('');
                                          setAddingTopicUnit(null);
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (newTopicText.trim()) {
                                        addTopicToSubject(sub.id, unit.unitNumber, newTopicText.trim());
                                        setNewTopicText('');
                                        setAddingTopicUnit(null);
                                      }
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                                  >
                                    Add
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAddingTopicUnit(null);
                                      setNewTopicText('');
                                    }}
                                    className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddingTopicUnit({ subId: sub.id, unitNumber: unit.unitNumber });
                                    setNewTopicText('');
                                  }}
                                  className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add Syllabus Topic to Unit {unit.unitNumber}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Add Subject */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Add New Enrolled Subject
              </h2>
              <button
                onClick={() => setIsAddSubjectOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    placeholder="e.g. CS-308"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Course Instructor</label>
                <input
                  type="text"
                  value={newSubInstructor}
                  onChange={(e) => setNewSubInstructor(e.target.value)}
                  placeholder="e.g. Dr. Alan Turing"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
