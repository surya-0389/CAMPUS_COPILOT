import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CampusItem } from '../types';
import {
  Building2,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Bell,
  Sparkles,
  Search,
  ShieldCheck,
  Send,
  AlertCircle,
  FileCheck,
  Plus,
} from 'lucide-react';
import { queryCampusAPI } from '../services/api';

export const CampusView: React.FC = () => {
  const { campusItems, profile, userRole, facultyProfile, addCampusNotice, showCelebration } = useApp();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<CampusItem['category']>('notice');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeDept, setNewNoticeDept] = useState('Computer Science & Engineering');

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [askQuery, setAskQuery] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [campusAnswer, setCampusAnswer] = useState<{
    answer: string;
    isGrounded: boolean;
  } | null>(null);

  const categories = [
    { id: 'all', label: 'All Verified Records', icon: Building2 },
    { id: 'exam_timetable', label: 'Exam Timetable', icon: Calendar },
    { id: 'class_timetable', label: 'Class Routine', icon: Clock },
    { id: 'library', label: 'Library Hours', icon: BookOpen },
    { id: 'department', label: 'Faculty & HOD', icon: Users },
    { id: 'notice', label: 'Official Notices', icon: Bell },
  ];

  const filteredItems = campusItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.department && item.department.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleAskCampusAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuery.trim()) return;

    setIsAsking(true);
    setCampusAnswer(null);

    try {
      const res = await queryCampusAPI(askQuery);
      setCampusAnswer({
        answer: res.answer,
        isGrounded: res.isGrounded,
      });
    } catch (err: any) {
      setCampusAnswer({
        answer: "I couldn't find this information in the available campus data.",
        isGrounded: false,
      });
    } finally {
      setIsAsking(false);
    }
  };

  const sampleQuestions = [
    'What are the Central Library hours tonight during exam week?',
    'When is my DBMS Mid-Term exam and in which hall?',
    'What is the calculator policy for CSE exams?',
    'Who is the HOD for CSE and what are their office hours?',
    'Can I apply for re-evaluation of my grades?',
    'What is the campus swimming pool schedule on Sunday?', // Unverified test query to prove anti-hallucination!
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-400" />
              Verified Campus Knowledge
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Anti-Hallucination Guardrail Active
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Official records for {profile.college}. AI strictly cites sources and refuses to speculate on unverified campus queries.
          </p>
        </div>

        {userRole === 'faculty' && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Notice / Timetable</span>
          </button>
        )}
      </div>

      {/* AI Grounded Campus Search Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Ask Grounded Campus AI
          </span>
          <span className="text-[11px] text-slate-400">Strictly grounded in verified campus notices</span>
        </div>

        <form onSubmit={handleAskCampusAI} className="flex gap-2">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            placeholder="e.g. When is the DBMS exam? What are library timings? Who is HOD?"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isAsking || !askQuery.trim()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isAsking ? 'Checking...' : 'Ask AI'}</span>
          </button>
        </form>

        {/* Quick Sample Questions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400">Try verified or test unverified query:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setAskQuery(q)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700/80 transition cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* AI Answer Box */}
        {campusAnswer && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm transition ${
              campusAnswer.isGrounded
                ? 'bg-blue-950/40 border-blue-500/40 text-blue-100'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 font-bold">
              {campusAnswer.isGrounded ? (
                <span className="text-emerald-400 flex items-center gap-1 text-xs">
                  <FileCheck className="w-4 h-4" /> Verified Campus Answer
                </span>
              ) : (
                <span className="text-amber-400 flex items-center gap-1 text-xs">
                  <AlertCircle className="w-4 h-4" /> Strict Grounding Notice
                </span>
              )}
            </div>
            <p className="whitespace-pre-line leading-relaxed">{campusAnswer.answer}</p>
          </div>
        )}
      </div>

      {/* Directory Filter & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified records..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Campus Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {item.category.replace('_', ' ')}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{item.title}</h3>
              </div>
              <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                ✓ Verified
              </span>
            </div>

            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {item.content}
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Department: {item.department || 'General Academic'}</span>
              <span className="italic">{item.verifiedSource}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Upload Notice Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                Broadcast Notice, Routine &amp; Timetable
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newNoticeTitle.trim() || !newNoticeContent.trim()) return;

                addCampusNotice({
                  title: newNoticeTitle.trim(),
                  category: newNoticeCategory,
                  content: newNoticeContent.trim(),
                  department: newNoticeDept,
                  verifiedSource: `Published by ${facultyProfile.name} (${facultyProfile.designation})`,
                });

                setNewNoticeTitle('');
                setNewNoticeContent('');
                setIsUploadModalOpen(false);
                showCelebration();
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Notice Category</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="notice">Official Notice / Circular</option>
                    <option value="class_timetable">Class Routine &amp; Timetable</option>
                    <option value="exam_timetable">Exam Schedule &amp; Seating</option>
                    <option value="library">Library Hours &amp; Access</option>
                    <option value="department">Department Message</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newNoticeDept}
                    onChange={(e) => setNewNoticeDept(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notice Title</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Revised Class Routine for CSE Semester 3 (Monday to Friday)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Content / Schedule Details</label>
                <textarea
                  rows={5}
                  required
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Paste timings, subject slot breakdown, room allocations, rules or circular details..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-md shadow-purple-600/30"
                >
                  Publish to Campus Directory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
