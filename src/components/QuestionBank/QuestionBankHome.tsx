import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuestionPaper, QuestionBankItem, ExamCategory } from '../../types';
import {
  FileText,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Bookmark,
  BrainCircuit,
  BarChart3,
  Clock,
  Upload,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { PaperListView } from './PaperListView';
import { PaperDetailView } from './PaperDetailView';
import { SolutionModal } from './SolutionModal';
import { AssignmentBankView } from './AssignmentBankView';
import { PracticeSessionModal } from './PracticeSessionModal';
import { SavedQuestionsView } from './SavedQuestionsView';
import { QuestionBankAnalyticsView } from './QuestionBankAnalyticsView';
import { PaperUploadModal } from './PaperUploadModal';

export const QuestionBankHome: React.FC = () => {
  const { profile, setActiveTab } = useApp();

  // Subsections navigation:
  // 1. University Previous Year Papers
  // 2. Internal Class Tests
  // 3. Assignments
  // 4. Mid-Term Examinations
  // 5. Practice Questions
  // 6. My Saved Questions
  // 7. Question Bank Analytics
  const [subSection, setSubSection] = useState<
    'pyq' | 'internal_test' | 'assignments' | 'mid_term' | 'practice' | 'saved' | 'analytics'
  >('pyq');

  // Configurable institution-specific name for Mid-Terms (e.g., Mid Sem, Sessional, Internal Assessment)
  const [midTermLabel, setMidTermLabel] = useState<string>('Mid-Term Examinations');
  const [showConfigLabel, setShowConfigLabel] = useState(false);

  // Active item states
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [activeSolutionQuestion, setActiveSolutionQuestion] = useState<QuestionBankItem | null>(null);
  const [practicePaper, setPracticePaper] = useState<QuestionPaper | null>(null);
  const [practiceMode, setPracticeMode] = useState<'practice' | 'mock_exam'>('practice');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ExamCategory>('pyq');

  const navSubsections = [
    { id: 'pyq', label: 'University PYQ Papers', icon: FileText },
    { id: 'internal_test', label: 'Internal Class Tests', icon: CheckCircle2 },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'mid_term', label: midTermLabel, icon: CalendarCheck },
    { id: 'practice', label: 'Practice & Mock Exams', icon: BrainCircuit },
    { id: 'saved', label: 'My Saved Questions', icon: Bookmark },
    { id: 'analytics', label: 'Analytics & PYQ Match', icon: BarChart3 },
  ];

  const handleStartPractice = (paper: QuestionPaper, mode: 'practice' | 'mock_exam') => {
    setPracticePaper(paper);
    setPracticeMode(mode);
  };

  const handleOpenUpload = (cat: ExamCategory) => {
    setUploadCategory(cat);
    setIsUploadOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Institutional Naming Config */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              University Question Bank &amp; Exam Prep
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified University Repository
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse verified previous year papers, internal class tests, step-by-step solutions, and timed mock exams.
          </p>
        </div>

        {/* Institution Config Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfigLabel(!showConfigLabel)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs font-medium transition cursor-pointer"
            title="Configure institution exam naming (Mid Sem / Sessional / Internal)"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize Exam Label</span>
          </button>
        </div>
      </div>

      {/* Customizable Exam Name Bar */}
      {showConfigLabel && (
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-semibold">Institutional Exam Terminology:</span>
            <select
              value={midTermLabel}
              onChange={(e) => setMidTermLabel(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              <option value="Mid-Term Examinations">Mid-Term Examinations (Default)</option>
              <option value="Mid Sem Examinations">Mid Sem Examinations</option>
              <option value="Sessional Examinations">Sessional Examinations</option>
              <option value="Internal Assessment (IA)">Internal Assessment (IA)</option>
            </select>
          </div>
          <span className="text-slate-500 text-[11px]">
            Configures sidebar &amp; filter labels to match your college naming standard.
          </span>
        </div>
      )}

      {/* Subsections Nav Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800/80">
        {navSubsections.map((sec) => {
          const Icon = sec.icon;
          const isSelected = subSection === sec.id && !selectedPaper;
          return (
            <button
              key={sec.id}
              onClick={() => {
                setSelectedPaper(null);
                setSubSection(sec.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {selectedPaper ? (
        <PaperDetailView
          paperId={selectedPaper.id}
          onBack={() => setSelectedPaper(null)}
          onOpenSolution={(q) => setActiveSolutionQuestion(q)}
          onStartPractice={handleStartPractice}
        />
      ) : (
        <>
          {subSection === 'pyq' && (
            <PaperListView
              initialCategory="pyq"
              subjects={profile.subjects}
              midTermCustomLabel={midTermLabel}
              onSelectPaper={(p) => setSelectedPaper(p)}
              onOpenUpload={handleOpenUpload}
            />
          )}

          {subSection === 'internal_test' && (
            <PaperListView
              initialCategory="internal_test"
              subjects={profile.subjects}
              midTermCustomLabel={midTermLabel}
              onSelectPaper={(p) => setSelectedPaper(p)}
              onOpenUpload={handleOpenUpload}
            />
          )}

          {subSection === 'assignments' && (
            <AssignmentBankView onOpenSolution={(q) => setActiveSolutionQuestion(q)} />
          )}

          {subSection === 'mid_term' && (
            <PaperListView
              initialCategory="mid_term"
              subjects={profile.subjects}
              midTermCustomLabel={midTermLabel}
              onSelectPaper={(p) => setSelectedPaper(p)}
              onOpenUpload={handleOpenUpload}
            />
          )}

          {subSection === 'practice' && (
            <PaperListView
              initialCategory="practice"
              subjects={profile.subjects}
              midTermCustomLabel={midTermLabel}
              onSelectPaper={(p) => setSelectedPaper(p)}
              onOpenUpload={handleOpenUpload}
            />
          )}

          {subSection === 'saved' && (
            <SavedQuestionsView onOpenSolution={(q) => setActiveSolutionQuestion(q)} />
          )}

          {subSection === 'analytics' && (
            <QuestionBankAnalyticsView
              onSelectPaperId={(id) => {
                setSelectedPaper({ id } as any);
              }}
              onOpenStudyPlan={() => setActiveTab('study-plan')}
            />
          )}
        </>
      )}

      {/* Global Solution Modal */}
      {activeSolutionQuestion && (
        <SolutionModal
          question={activeSolutionQuestion}
          onClose={() => setActiveSolutionQuestion(null)}
        />
      )}

      {/* Global Practice Session / Timed Mock Exam Modal */}
      {practicePaper && (
        <PracticeSessionModal
          paper={practicePaper}
          mode={practiceMode}
          onClose={() => setPracticePaper(null)}
          onAttemptSubmitted={() => {
            // refresh data if needed
          }}
        />
      )}

      {/* Upload Paper Modal */}
      <PaperUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        defaultCategory={uploadCategory}
        subjects={profile.subjects}
        onPaperCreated={(newPaper) => {
          setSelectedPaper(newPaper);
        }}
      />
    </div>
  );
};
