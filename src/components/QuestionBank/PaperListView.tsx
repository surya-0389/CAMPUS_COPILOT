import React, { useState, useEffect } from 'react';
import { QuestionPaper, ExamCategory } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Upload,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { fetchQuestionPapersAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface PaperListViewProps {
  initialCategory?: ExamCategory;
  subjects: string[];
  midTermCustomLabel?: string;
  onSelectPaper: (paper: QuestionPaper) => void;
  onOpenUpload: (category: ExamCategory) => void;
}

export const PaperListView: React.FC<PaperListViewProps> = ({
  initialCategory,
  subjects,
  midTermCustomLabel = 'Mid-Term Examinations',
  onSelectPaper,
  onOpenUpload,
}) => {
  const { userRole } = useApp();
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadPapers();
  }, [activeCategory, selectedSubject, selectedSemester, selectedYear, searchQuery]);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const filters: Record<string, string> = {};
      if (activeCategory !== 'all') filters.exam_category = activeCategory;
      if (selectedSubject !== 'all') filters.subject_id = selectedSubject;
      if (selectedSemester !== 'all') filters.semester = selectedSemester;
      if (selectedYear !== 'all') filters.academic_year = selectedYear;
      if (searchQuery.trim()) filters.search = searchQuery.trim();

      const data = await fetchQuestionPapersAPI(filters);
      setPapers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setActiveCategory(initialCategory || 'all');
    setSelectedSubject('all');
    setSelectedSemester('all');
    setSelectedYear('all');
    setSearchQuery('');
  };

  const categoryTabs = [
    { id: 'all', label: 'All Question Papers' },
    { id: 'pyq', label: 'University PYQs' },
    { id: 'internal_test', label: 'Internal Class Tests' },
    { id: 'mid_term', label: midTermCustomLabel },
    { id: 'practice', label: 'Practice Question Papers' },
  ];

  return (
    <div className="space-y-6">
      {/* Category Pills & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isSelected = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {userRole === 'faculty' ? (
          <button
            onClick={() => onOpenUpload(activeCategory === 'all' ? 'pyq' : (activeCategory as ExamCategory))}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Paper</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Faculty Verified Question Repository</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by paper title, subject, code, university..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Subject Filter */}
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">All Semesters</option>
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
            <option value="3rd Semester">3rd Semester (Current)</option>
            <option value="4th Semester">4th Semester</option>
            <option value="5th Semester">5th Semester</option>
            <option value="6th Semester">6th Semester</option>
          </select>
        </div>

        {/* Academic Year Filter */}
        <div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
          >
            <option value="all">All Academic Years</option>
            <option value="2026-2027">2026-2027 (Current)</option>
            <option value="2025-2026">2025-2026</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2023-2024">2023-2024</option>
            <option value="2022-2023">2022-2023</option>
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-2" />
          <p>Loading filtered question papers...</p>
        </div>
      ) : papers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-600" />
          <h3 className="text-base font-bold text-white">No question papers are available for these filters yet.</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try adjusting your search criteria or upload the question paper to extract questions and generate solutions.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => onSelectPaper(paper)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition cursor-pointer flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Badges Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                    {paper.exam_category === 'pyq'
                      ? 'University PYQ'
                      : paper.exam_category === 'internal_test'
                      ? 'Internal Class Test'
                      : paper.exam_category === 'mid_term'
                      ? midTermCustomLabel
                      : 'Practice Paper'}
                  </span>

                  <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Verified Official
                  </span>
                </div>

                {/* Title & Subject */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {paper.subject_id} • {paper.semester} ({paper.course} {paper.branch})
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {paper.university_name} {paper.college_name ? `• ${paper.college_name}` : ''}
                  </p>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{paper.academic_year}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{paper.total_marks || 50} Marks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{paper.duration_minutes || 120}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">
                      {paper.question_count || 5} Questions
                    </span>
                    {paper.solution_available && (
                      <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20 px-1.5 py-0.5 rounded font-medium">
                        ✓ Solutions Available
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-blue-400 group-hover:translate-x-1 transition flex items-center gap-1 font-semibold">
                    <span>View Paper</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
