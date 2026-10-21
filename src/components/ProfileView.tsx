import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  GraduationCap,
  Building,
  Clock,
  Calendar,
  Save,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { profile, setProfile, resetToDefaultDemo, showCelebration } = useApp();

  const [formData, setFormData] = useState({
    name: profile.name,
    college: profile.college,
    course: profile.course,
    branch: profile.branch,
    semester: profile.semester,
    dailyStudyHours: profile.dailyStudyHours,
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      ...formData,
    }));
    setSavedNotice(true);
    showCelebration();
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-blue-400" />
            Student Academic Profile
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Campus Copilot customizes your study plans, diagnostic quizzes, and mentor responses based on this context.
          </p>
        </div>

        <button
          onClick={resetToDefaultDemo}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Demo Student (Alex)</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Student Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">College / University</label>
            <input
              type="text"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Degree / Course</label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Branch / Major</label>
            <input
              type="text"
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Current Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
            >
              <option value="1st Semester">1st Semester</option>
              <option value="2nd Semester">2nd Semester</option>
              <option value="3rd Semester">3rd Semester (Current Demo)</option>
              <option value="4th Semester">4th Semester</option>
              <option value="5th Semester">5th Semester</option>
              <option value="6th Semester">6th Semester</option>
              <option value="7th Semester">7th Semester</option>
              <option value="8th Semester">8th Semester</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Daily Available Study Time (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={formData.dailyStudyHours}
              onChange={(e) => setFormData({ ...formData, dailyStudyHours: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white"
              required
            />
          </div>
        </div>

        {/* Current Subjects List */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Registered Subjects</label>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((sub, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white font-medium flex items-center gap-2"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming Exam Schedule */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">
            Upcoming Exam Dates &amp; Countdown
          </label>
          <div className="space-y-2">
            {profile.examDates.map((ex) => (
              <div
                key={ex.id}
                className="p-3 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-white">{ex.subject}</span>
                <span className="text-amber-400 font-bold">
                  {ex.date} ({ex.daysLeft} days remaining)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {savedNotice ? (
            <p className="text-xs font-bold text-emerald-400">✓ Profile updated successfully!</p>
          ) : (
            <span />
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Context</span>
          </button>
        </div>
      </form>
    </div>
  );
};
