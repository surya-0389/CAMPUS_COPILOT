import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Vote,
  Plus,
  CheckCircle2,
  BarChart3,
  Users,
  Clock,
  Sparkles,
  PieChart,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';

export const PollsVotingView: React.FC = () => {
  const { polls, votePoll, createPoll, userRole, profile, facultyProfile, showCelebration } = useApp();

  const [selectedPollFilter, setSelectedPollFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPollForAnalysis, setSelectedPollForAnalysis] = useState<string | null>(polls[0]?.id || null);

  // New poll form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState<'academic' | 'campus_life' | 'exam' | 'facilities'>('academic');
  const [newAudience, setNewAudience] = useState('All B.Tech CSE Students');
  const [newEndDate, setNewEndDate] = useState('2026-10-31');
  const [optionsList, setOptionsList] = useState<string[]>(['Option 1', 'Option 2']);

  const handleAddOption = () => {
    if (optionsList.length < 6) {
      setOptionsList([...optionsList, `Option ${optionsList.length + 1}`]);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...optionsList];
    updated[idx] = val;
    setOptionsList(updated);
  };

  const handleRemoveOption = (idx: number) => {
    if (optionsList.length > 2) {
      setOptionsList(optionsList.filter((_, i) => i !== idx));
    }
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    createPoll({
      question: newQuestion.trim(),
      category: newCategory === 'academic' ? 'Academic' : newCategory === 'campus_life' ? 'Campus Life' : newCategory === 'exam' ? 'Curriculum' : 'General',
      createdBy: facultyProfile.name,
      creatorRole: facultyProfile.designation || 'Faculty Coordinator',
      targetAudience: newAudience,
      endDate: newEndDate,
      options: optionsList.filter((opt) => opt.trim().length > 0).map((opt, i) => ({
        id: `opt-${Date.now()}-${i}`,
        text: opt.trim(),
        votesCount: 0,
        votes: 0,
        voterRollNos: [],
      })),
    });

    setNewQuestion('');
    setOptionsList(['Option 1', 'Option 2']);
    setIsCreateModalOpen(false);
    showCelebration();
  };

  const filteredPolls = polls.filter((p) => {
    const isAct = p.isActive !== false && p.status !== 'closed';
    if (selectedPollFilter === 'active') return isAct;
    if (selectedPollFilter === 'closed') return !isAct;
    return true;
  });

  const activeAnalysisPoll = polls.find((p) => p.id === selectedPollForAnalysis) || polls[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Vote className="w-6 h-6 text-purple-400" />
              Campus Polls &amp; Student Voting
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Live Democracy
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            {userRole === 'faculty'
              ? 'Publish academic polls, gather student consensus on schedule preferences, and review deep response analytics.'
              : 'Cast your vote on department schedules, class test dates, and campus initiatives. Your voice matters.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole === 'faculty' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/25 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Poll</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'active', 'closed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedPollFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition cursor-pointer ${
              selectedPollFilter === tab
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab} Polls
          </button>
        ))}
      </div>

      {/* Grid: Polls List + Deep Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Poll Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filteredPolls.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              No polls found in this category.
            </div>
          ) : (
            filteredPolls.map((poll) => {
              const userRoll = profile.rollNo || '2024CS104';
              const hasVoted = poll.hasVoted || poll.options?.some((o) => o.voterRollNos?.includes(userRoll));
              const isFaculty = userRole === 'faculty';
              const isPollActive = poll.isActive !== false && poll.status !== 'closed';

              return (
                <div
                  key={poll.id}
                  className={`p-5 rounded-2xl bg-slate-900 border transition-all duration-200 ${
                    selectedPollForAnalysis === poll.id
                      ? 'border-purple-500/60 shadow-lg shadow-purple-500/5'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => setSelectedPollForAnalysis(poll.id)}
                >
                  {/* Poll Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {poll.category.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isPollActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPollActive ? '🟢 Active' : '⚪ Closed'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        <strong className="text-white">{poll.totalVotes}</strong> votes
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> Ends {poll.endDate || poll.expiresAt || '2026-10-31'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1.5">{poll.question}</h3>
                  <p className="text-xs text-slate-400 mb-4">
                    Published by <strong className="text-slate-300">{poll.createdBy}</strong> ({poll.creatorRole}) for{' '}
                    <span className="text-purple-300">{poll.targetAudience || 'All Department Students'}</span>
                  </p>

                  {/* Poll Options */}
                  <div className="space-y-2.5">
                    {poll.options.map((opt) => {
                      const voteCount = opt.votesCount ?? opt.votes ?? 0;
                      const pct = poll.totalVotes > 0 ? Math.round((voteCount / poll.totalVotes) * 100) : 0;
                      const isUserChoice = poll.userVotedOptionId === opt.id || opt.voterRollNos?.includes(userRoll);

                      return (
                        <div key={opt.id} className="relative">
                          {/* When voted or faculty: show progress bar background */}
                          {(hasVoted || isFaculty || !isPollActive) ? (
                            <div className="relative p-3 rounded-xl bg-slate-850/80 border border-slate-800 overflow-hidden">
                              <div
                                className={`absolute left-0 top-0 bottom-0 opacity-25 rounded-xl transition-all duration-500 ${
                                  isUserChoice ? 'bg-purple-500' : 'bg-slate-600'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                              <div className="relative flex items-center justify-between z-10 text-xs">
                                <span className="font-semibold text-white flex items-center gap-2">
                                  {opt.text}
                                  {isUserChoice && (
                                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                                      Your Vote
                                    </span>
                                  )}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-400 font-mono text-[11px]">{voteCount} votes</span>
                                  <span className="font-bold text-white tabular-nums w-10 text-right">{pct}%</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* Unvoted Student: interactive voting button */
                            <button
                              onClick={() => {
                                votePoll(poll.id, opt.id);
                                showCelebration();
                              }}
                              className="w-full p-3 rounded-xl bg-slate-850 hover:bg-purple-900/30 border border-slate-750 hover:border-purple-500/60 transition flex items-center justify-between text-xs text-left cursor-pointer group"
                            >
                              <span className="font-semibold text-slate-200 group-hover:text-white">
                                {opt.text}
                              </span>
                              <span className="text-[11px] text-purple-400 font-bold group-hover:underline flex items-center gap-1">
                                <span>Vote</span>
                                <span>→</span>
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      {hasVoted ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> You have recorded your vote
                        </span>
                      ) : (
                        <span>Voting open for all verified students</span>
                      )}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPollForAnalysis(poll.id);
                      }}
                      className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline"
                    >
                      View Full Analysis &amp; Breakdown
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Col: Poll Analytics & Faculty Insights */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                Poll Analytics &amp; Demographics
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">Real-time</span>
            </div>

            {activeAnalysisPoll ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                    Selected Poll
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 leading-snug">
                    {activeAnalysisPoll.question}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Total Turnout: <strong className="text-white">{activeAnalysisPoll.totalVotes}</strong> participants
                  </p>
                </div>

                {/* Option Breakdown List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Student Distribution
                  </span>
                  {activeAnalysisPoll.options.map((opt, i) => {
                    const vCount = opt.votesCount ?? opt.votes ?? 0;
                    const pct = activeAnalysisPoll.totalVotes > 0
                      ? Math.round((vCount / activeAnalysisPoll.totalVotes) * 100)
                      : 0;
                    return (
                      <div key={opt.id} className="p-2.5 rounded-xl bg-slate-850 border border-slate-800 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-slate-200 truncate pr-2">{opt.text}</span>
                          <span className="font-bold text-purple-300">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Key Insights Summary */}
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Consensus Takeaway
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Majority preference leans heavily towards option 1 with over{' '}
                    {activeAnalysisPoll.totalVotes > 0
                      ? Math.round(((activeAnalysisPoll.options[0]?.votesCount ?? activeAnalysisPoll.options[0]?.votes ?? 0) / activeAnalysisPoll.totalVotes) * 100)
                      : 0}
                    % of total cohort support. Faculty can safely schedule the requested slot.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a poll from the list to view demographics.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Faculty Create Poll */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Vote className="w-5 h-5 text-purple-400" />
                Publish Campus / Academic Poll
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePoll} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Poll Question</label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. When should we hold the DBMS Extra Remedial Session?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="academic">Academic / Syllabus</option>
                    <option value="exam">Exam &amp; Tests Schedule</option>
                    <option value="campus_life">Campus Life &amp; Events</option>
                    <option value="facilities">Facilities &amp; Library</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Audience</label>
                <input
                  type="text"
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Options Builder */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold">Voting Options (2 to 6)</label>
                  {optionsList.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-purple-400 hover:text-purple-300 text-[11px] font-bold"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {optionsList.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
                      />
                      {optionsList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-md shadow-purple-600/30"
                >
                  Publish Poll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
