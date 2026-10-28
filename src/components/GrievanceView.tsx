import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LifeBuoy,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  EyeOff,
  AlertTriangle,
  FileText,
  Send,
  MessageSquare,
  HelpCircle,
  Tag,
} from 'lucide-react';

export const GrievanceView: React.FC = () => {
  const {
    grievances,
    submitGrievance,
    updateGrievanceStatus,
    userRole,
    profile,
    facultyProfile,
    showCelebration,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'under_review' | 'resolved'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<'academic' | 'infrastructure' | 'hostel' | 'library' | 'examination' | 'harassment' | 'other'>('academic');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    submitGrievance({
      studentRollNo: isAnonymous ? 'ANONYMOUS' : profile.rollNo,
      studentName: isAnonymous ? 'Anonymous Student' : profile.name,
      isAnonymous: isAnonymous,
      category: category,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority,
    });

    setSubject('');
    setDescription('');
    setIsSubmitModalOpen(false);
    showCelebration();
  };

  const handleResolveGrievance = (id: string) => {
    if (!resolutionNote.trim()) return;
    updateGrievanceStatus(id, 'resolved', resolutionNote.trim());
    setResolvingId(null);
    setResolutionNote('');
    showCelebration();
  };

  const filteredGrievances = grievances.filter((g) => {
    if (filterStatus === 'all') return true;
    return g.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-rose-400" />
              Campus Grievance Redressal Cell
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              Confidential &amp; Protected
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Official internal redressal portal for academic queries, evaluation discrepancies, lab infrastructure, and hostel issues.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Lodge Grievance</span>
        </button>
      </div>

      {/* Trust & Policy Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 via-slate-900 to-slate-900 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white block">Student Protection &amp; Anti-Retaliation Policy</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Grievances can be filed with complete anonymity. Tickets are reviewed by the Ombudsman and HOD committee with a mandatory 48-hour resolution mandate.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'submitted', 'under_review', 'resolved'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              filterStatus === st
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {st.replace('_', ' ')} ({grievances.filter((g) => st === 'all' || g.status === st).length})
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredGrievances.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
            No grievances in this view.
          </div>
        ) : (
          filteredGrievances.map((g) => (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                    #{g.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {g.category.toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      g.priority?.toLowerCase() === 'urgent'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : g.priority?.toLowerCase() === 'high'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Priority: {g.priority}
                  </span>
                  {g.isAnonymous && (
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded">
                      <EyeOff className="w-3 h-3 text-slate-500" /> Anonymous
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      g.status === 'resolved'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : g.status === 'under_review'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}
                  >
                    {g.status === 'resolved' ? '✓ Resolved' : g.status === 'under_review' ? '⏳ Under Investigation' : '📬 Submitted'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{g.submittedDate || g.createdAt?.split('T')[0] || 'Today'}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{g.subject}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-850 p-3 rounded-xl border border-slate-800">
                  {g.description}
                </p>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                  <span>Complainant: <strong className="text-slate-300">{g.studentName}</strong> {!g.isAnonymous && `(${g.studentRollNo})`}</span>
                </div>
              </div>

              {/* Resolution Remark */}
              {(g.resolutionNotes || g.actionRemarks) && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Official Committee Resolution
                  </span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">{g.resolutionNotes || g.actionRemarks}</p>
                </div>
              )}

              {/* Faculty Action to Resolve */}
              {userRole === 'faculty' && g.status !== 'resolved' && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  {resolvingId === g.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        placeholder="Write official resolution notes / action taken by department..."
                        className="w-full bg-slate-800 border border-purple-500/50 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setResolvingId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveGrievance(g.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                        >
                          Submit Resolution &amp; Close Ticket
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateGrievanceStatus(g.id, 'under_review')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                      >
                        Mark Under Review
                      </button>
                      <button
                        onClick={() => {
                          setResolvingId(g.id);
                          setResolutionNote('');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                      >
                        Resolve Grievance
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: Student Lodge Grievance */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-rose-400" />
                Lodge Grievance to Ombudsman
              </h2>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitGrievance} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Grievance Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="academic">Academic &amp; Lectures</option>
                    <option value="examination">Exam &amp; Evaluation Discrepancy</option>
                    <option value="infrastructure">Lab &amp; Equipment Infrastructure</option>
                    <option value="library">Library &amp; E-Resources</option>
                    <option value="hostel">Hostel &amp; Dining</option>
                    <option value="harassment">Anti-Ragging / Welfare</option>
                    <option value="other">General / Administrative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="low">Low (General suggestion)</option>
                    <option value="medium">Medium (Standard issue)</option>
                    <option value="high">High (Impacting exams/study)</option>
                    <option value="urgent">Urgent (Requires immediate action)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject / Summary</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Non-functioning SQL terminal in Computer Lab 3"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, dates, location, and specific outcome requested..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Anonymous Checkbox */}
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">File as Anonymous</span>
                  <span className="text-[11px] text-slate-400">
                    Your name and roll number will be concealed from the review committee.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md shadow-rose-600/30"
                >
                  Submit Official Grievance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
