import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyMaterial } from '../types';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  BrainCircuit,
  BotMessageSquare,
  BookOpen,
  FileCode,
  ArrowRight,
  Layers,
  Gauge,
} from 'lucide-react';
import { analyzeMaterialAPI, extractTextFromFile } from '../services/api';

export const StudyMaterialView: React.FC = () => {
  const {
    materials,
    setMaterials,
    activeMaterial,
    setActiveMaterial,
    setActiveTab,
    showCelebration,
    profile,
  } = useApp();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSubject, setUploadSubject] = useState(profile.subjects[0] || 'Database Management Systems');
  const [pasteText, setPasteText] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(`Extracting text from ${file.name}...`);

    try {
      const extractedText = await extractTextFromFile(file);
      setStatusMessage('Analyzing material with Gemini AI (detecting topics & difficulty)...');

      const analysis = await analyzeMaterialAPI(file.name, uploadSubject, extractedText);

      const newMaterial: StudyMaterial = {
        id: `mat-${Date.now()}`,
        title: file.name,
        subject: uploadSubject,
        fileType: file.name.endsWith('.pdf') ? 'pdf' : 'text',
        uploadDate: new Date().toISOString().split('T')[0],
        rawText: extractedText,
        detectedTopics: analysis.detectedTopics || ['Topic 1', 'Topic 2'],
        importantTopics: analysis.importantTopics || ['Key Concept'],
        difficultyEstimation: analysis.difficultyEstimation || {
          level: 'Medium',
          score: 6.5,
          reasoning: 'Standard university syllabus depth.',
        },
        summary: analysis.summary || 'Uploaded study document parsed successfully.',
      };

      setMaterials((prev) => [newMaterial, ...prev]);
      setActiveMaterial(newMaterial);
      setStatusMessage('Analysis complete! Material ready for Study Plan and Quiz generation.');
      showCelebration();
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error processing file: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteText.trim()) return;

    setIsUploading(true);
    const title = pasteTitle.trim() || `${uploadSubject} Notes - ${new Date().toLocaleDateString()}`;
    setStatusMessage('Analyzing custom notes with AI...');

    try {
      const analysis = await analyzeMaterialAPI(title, uploadSubject, pasteText);

      const newMaterial: StudyMaterial = {
        id: `mat-${Date.now()}`,
        title: `${title}.txt`,
        subject: uploadSubject,
        fileType: 'text',
        uploadDate: new Date().toISOString().split('T')[0],
        rawText: pasteText,
        detectedTopics: analysis.detectedTopics || ['Core Principles'],
        importantTopics: analysis.importantTopics || ['Key Topics'],
        difficultyEstimation: analysis.difficultyEstimation || {
          level: 'Medium',
          score: 7.0,
          reasoning: 'Standard conceptual complexity.',
        },
        summary: analysis.summary || 'Custom study text added.',
      };

      setMaterials((prev) => [newMaterial, ...prev]);
      setActiveMaterial(newMaterial);
      setPasteText('');
      setPasteTitle('');
      setIsPasting(false);
      setStatusMessage('Notes successfully processed & analyzed!');
      showCelebration();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            Syllabus &amp; Study Material
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload PDF notes, textbooks, or syllabus to detect topics, estimate difficulty, and fuel the learning loop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPasting(!isPasting)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            {isPasting ? 'Cancel Paste' : 'Paste Raw Notes'}
          </button>
        </div>
      </div>

      {/* Upload Zone & Paste Form */}
      {isPasting ? (
        <form onSubmit={handlePasteSubmit} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Paste Syllabus or Study Material Text</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
              <select
                value={uploadSubject}
                onChange={(e) => setUploadSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              >
                {profile.subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="e.g. DBMS Normalization Handout"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Content</label>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder="Paste textbook sections, lecture notes, or syllabus bullet points..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-white font-mono"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPasting(false)}
              className="px-3 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isUploading ? 'Analyzing...' : 'Analyze & Save Material'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-dashed border-slate-800 hover:border-blue-500/50 transition">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Upload Syllabus or Study Material</h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF syllabus, PDF notes, or text files up to 20MB.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Target Subject:</span>
                <select
                  value={uploadSubject}
                  onChange={(e) => setUploadSubject(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  {profile.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-blue-600/20 transition flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Select PDF / Notes File</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {statusMessage && (
              <p className="text-xs font-medium text-blue-400 mt-3 animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Materials Explorer: Sidebar list + Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Uploaded Files Sidebar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Uploaded Documents ({materials.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click to inspect</span>
          </div>

          <div className="space-y-2">
            {materials.map((mat) => {
              const isSelected = activeMaterial?.id === mat.id;
              return (
                <div
                  key={mat.id}
                  onClick={() => setActiveMaterial(mat)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer select-none ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/50 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        mat.fileType === 'pdf'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-white">{mat.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{mat.subject}</p>
                      <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-500">
                        <span>{mat.detectedTopics.length} topics detected</span>
                        <span>•</span>
                        <span className="font-semibold text-amber-400">
                          {mat.difficultyEstimation.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Material Detailed Inspection Card (2 Cols) */}
        {activeMaterial ? (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {activeMaterial.subject}
                  </span>
                  <span className="text-xs text-slate-500">
                    Uploaded: {activeMaterial.uploadDate}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                  {activeMaterial.title}
                </h2>
              </div>

              {/* Action Buttons to trigger downstream loop */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab('study-plan')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Generate Plan</span>
                </button>
                <button
                  onClick={() => setActiveTab('quizzes')}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Take Quiz</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <BotMessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* AI Analysis Badges Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Detected Topics</span>
                </div>
                <p className="text-xl font-black text-white">
                  {activeMaterial.detectedTopics.length}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Syllabus segments indexed</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>Difficulty Estimation</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-xl font-black text-amber-400">
                    {activeMaterial.difficultyEstimation.score}
                  </p>
                  <span className="text-xs text-slate-400">/ 10</span>
                  <span className="text-xs font-semibold text-amber-300 ml-1">
                    ({activeMaterial.difficultyEstimation.level})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {activeMaterial.difficultyEstimation.reasoning}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Exam Yield Status</span>
                </div>
                <p className="text-xl font-black text-purple-400">High Yield</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {activeMaterial.importantTopics.length} Critical Exam Areas
                </p>
              </div>
            </div>

            {/* AI Summary */}
            <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                AI Syllabus &amp; Concept Summary
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeMaterial.summary}
              </p>
            </div>

            {/* Important Topics (High Priority) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                High-Yield Exam Topics (Recommended Focus)
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeMaterial.importantTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* All Detected Topics */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                All Extracted Topics ({activeMaterial.detectedTopics.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeMaterial.detectedTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Raw Text Preview Collapsible */}
            <div className="pt-2">
              <details className="group">
                <summary className="text-xs font-semibold text-slate-400 hover:text-slate-200 cursor-pointer list-none flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" />
                  <span>View extracted raw text preview ({activeMaterial.rawText.length} characters)</span>
                </summary>
                <div className="mt-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-400 whitespace-pre-wrap">
                  {activeMaterial.rawText}
                </div>
              </details>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center text-slate-400">
            Select a document on the left or upload new material to view analysis.
          </div>
        )}
      </div>
    </div>
  );
};
