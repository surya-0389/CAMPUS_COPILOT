import React, { useState } from 'react';
import { QuestionPaper, ExamCategory } from '../../types';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { extractTextFromFile, createQuestionPaperAPI, extractQuestionsAPI } from '../../services/api';

interface PaperUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperCreated: (newPaper: QuestionPaper) => void;
  defaultCategory?: ExamCategory;
  subjects: string[];
}

export const PaperUploadModal: React.FC<PaperUploadModalProps> = ({
  isOpen,
  onClose,
  onPaperCreated,
  defaultCategory = 'pyq',
  subjects,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [university, setUniversity] = useState('State Technological University');
  const [college, setCollege] = useState('Apex Institute of Science & Technology');
  const [course, setCourse] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('3rd Semester');
  const [subjectId, setSubjectId] = useState(subjects[0] || 'Database Management Systems');
  const [category, setCategory] = useState<ExamCategory>(defaultCategory);
  const [session, setSession] = useState('Fall Regular');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [totalMarks, setTotalMarks] = useState<number>(50);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    try {
      setIsProcessing(true);
      setStatusMessage('Extracting readable text from document...');
      const text = await extractTextFromFile(selectedFile);
      setRawText(text);
      setStatusMessage(`Extracted ${text.length} characters of readable content.`);
    } catch (err: any) {
      setStatusMessage(`Failed to extract text: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsProcessing(true);
    setStatusMessage('Registering paper & extracting question breakdown...');

    try {
      const paperPayload = {
        title,
        university_name: university,
        college_name: college,
        course,
        branch,
        semester,
        subject_id: subjectId,
        exam_category: category,
        exam_session: session,
        academic_year: academicYear,
        total_marks: Number(totalMarks),
        duration_minutes: Number(durationMinutes),
        file_path: file ? file.name : null,
        source_description: 'Faculty / Department Upload (Institutional Archive)',
        verification_status: 'verified',
        uploaded_by: 'User / Faculty Coordinator',
      };

      const created = await createQuestionPaperAPI(paperPayload);

      // Extract questions if raw text is available
      if (rawText.trim()) {
        setStatusMessage('AI extracting numbered questions & marks...');
        await extractQuestionsAPI(created.id, rawText);
      }

      onPaperCreated(created);
      onClose();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Question Paper</h2>
              <p className="text-xs text-slate-400">PDF question paper or raw syllabus exam sheet</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          {/* File Upload Box */}
          <div className="p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/40 text-center">
            <Upload className="w-8 h-8 mx-auto text-blue-400 mb-2" />
            <p className="font-semibold text-white text-xs">
              {file ? file.name : 'Select PDF or Text Question Paper'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports .pdf, .txt, .md. Original file is preserved for student view.
            </p>
            <label className="inline-block mt-3 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer transition">
              <span>Choose File</span>
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Paper Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. DBMS End-Semester University Examination (Fall 2025)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Exam Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExamCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                <option value="pyq">University Previous Year Paper (PYQ)</option>
                <option value="internal_test">Internal Class Test</option>
                <option value="mid_term">Mid-Term Examination</option>
                <option value="practice">Practice Paper / Mock</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">University Name</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">College / Institute</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-2026"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Exam Session</label>
              <input
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="Fall Regular, Spring, etc."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Total Marks</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Raw Text Preview */}
          {rawText && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Extracted Text for AI Question Parser
              </label>
              <textarea
                rows={4}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono"
              />
            </div>
          )}

          {statusMessage && (
            <p className="text-xs font-semibold text-blue-400 animate-pulse">{statusMessage}</p>
          )}

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Processing Paper...' : 'Save & Extract Questions'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
