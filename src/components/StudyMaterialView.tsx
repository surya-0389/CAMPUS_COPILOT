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
  FileCheck,
  Printer,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { analyzeMaterialAPI, extractTextFromFile, generateRevisionNotesAPI, generateQuizAPI } from '../services/api';

export const StudyMaterialView: React.FC = () => {
  const {
    userRole,
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
  const [revisionNotes, setRevisionNotes] = useState<any | null>(null);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const handleGenerateRevisionNotes = async () => {
    if (!activeMaterial) return;
    setIsGeneratingNotes(true);
    try {
      const notes = await generateRevisionNotesAPI({
        subject: activeMaterial.subject,
        topic: activeMaterial.importantTopics[0] || activeMaterial.detectedTopics[0] || 'Core Concepts',
        materialText: activeMaterial.rawText,
      });
      setRevisionNotes(notes);
      setShowRevisionModal(true);
      showCelebration();
    } catch (e: any) {
      console.error('Error generating revision notes:', e);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

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
          {userRole === 'faculty' ? (
            <button
              onClick={() => setIsPasting(!isPasting)}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{isPasting ? 'Cancel Paste' : 'Paste Raw Notes'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Official Department Faculty Archive</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Zone & Paste Form (Faculty Only) */}
      {userRole === 'faculty' ? (
        isPasting ? (
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
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isUploading ? 'Analyzing...' : 'Analyze & Save Material'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition">
            <div className="max-w-xl mx-auto text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-white">Faculty Portal: Upload Syllabus or Study Material</h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload official course PDF syllabus, lecture handouts, or notes for student access and AI study generation.
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

                <label className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-purple-600/20 transition flex items-center gap-1.5">
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
                <p className="text-xs font-medium text-purple-400 mt-3 animate-pulse">
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-slate-900 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">Faculty-Verified Academic Course Repository</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All syllabus notes, lecture handouts, and exam guides are uploaded and moderated by course instructors. Students can view, generate revision notes, and take topic quizzes below.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('quizzes')}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold shrink-0 cursor-pointer transition"
          >
            Practice Topic Quiz →
          </button>
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
                  onClick={handleGenerateRevisionNotes}
                  disabled={isGeneratingNotes}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  title="Generate exam-ready revision cheat sheet from this document"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNotes ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingNotes ? 'Synthesizing Notes...' : 'Revision Notes'}</span>
                </button>
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

      {/* Revision Notes Modal */}
      {showRevisionModal && revisionNotes && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-900/90 sticky top-0 z-10 backdrop-blur">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
                    {revisionNotes.subject}
                  </span>
                  <span className="text-xs text-slate-400">Exam Revision Cheat Sheet</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  {revisionNotes.topic}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `# ${revisionNotes.subject} - ${revisionNotes.topic}\n\n## Overview\n${revisionNotes.summary}\n\n## Key Concepts\n${(revisionNotes.keyConcepts || []).map((c: any) => `- **${c.concept}**: ${c.explanation}\n  *Example: ${c.example || 'N/A'}*`).join('\n')}\n\n## Important Formulas & Rules\n${(revisionNotes.formulasOrRules || []).map((f: any) => `- **${f.name}**: \`${f.formulaOrRule}\` (When to use: ${f.whenToUse})`).join('\n')}\n\n## Common Pitfalls\n${(revisionNotes.commonPitfalls || []).map((p: any) => `- **Mistake**: ${p.mistake}\n  *Correction*: ${p.correction}`).join('\n')}`;
                    navigator.clipboard.writeText(text);
                    setCopiedNotes(true);
                    setTimeout(() => setCopiedNotes(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Copy markdown to clipboard"
                >
                  {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNotes ? 'Copied!' : 'Copy Notes'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setShowRevisionModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300">
              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  High-Yield Concept Overview
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {revisionNotes.summary}
                </p>
              </div>

              {/* Key Concepts Grid */}
              {revisionNotes.keyConcepts && revisionNotes.keyConcepts.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    Essential Core Concepts ({revisionNotes.keyConcepts.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {revisionNotes.keyConcepts.map((item: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                            {idx + 1}
                          </span>
                          {item.concept}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.explanation}
                        </p>
                        {item.example && (
                          <div className="mt-2 text-[11px] p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
                            <span className="font-semibold text-slate-300">Example:</span> {item.example}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulas or Rules */}
              {revisionNotes.formulasOrRules && revisionNotes.formulasOrRules.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    Key Formulas &amp; Algorithms
                  </h3>
                  <div className="space-y-2.5">
                    {revisionNotes.formulasOrRules.map((rule: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-850 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white">{rule.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            <span className="text-emerald-400 font-medium">When to use:</span> {rule.whenToUse}
                          </p>
                        </div>
                        <div className="font-mono text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 shrink-0 select-all">
                          {rule.formulaOrRule}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Pitfalls & Traps */}
              {revisionNotes.commonPitfalls && revisionNotes.commonPitfalls.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Common Exam Mistakes &amp; How to Avoid Them
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {revisionNotes.commonPitfalls.map((pitfall: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Mistake</span>
                          <p className="text-xs text-slate-200 mt-0.5 font-medium">{pitfall.mistake}</p>
                        </div>
                        <div className="pt-2 border-t border-rose-500/20">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Exam-Ready Fix</span>
                          <p className="text-xs text-slate-300 mt-0.5">{pitfall.correction}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Self-Check Questions */}
              {revisionNotes.quickSelfCheck && revisionNotes.quickSelfCheck.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Quick Active Recall Self-Check ({revisionNotes.quickSelfCheck.length})
                  </h3>
                  <div className="space-y-2">
                    {revisionNotes.quickSelfCheck.map((qc: any, idx: number) => (
                      <details key={idx} className="group p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                        <summary className="text-xs font-medium text-slate-200 cursor-pointer list-none flex items-center justify-between">
                          <span>Q{idx + 1}: {qc.question}</span>
                          <span className="text-[11px] text-blue-400 group-open:hidden">Reveal Answer</span>
                        </summary>
                        <div className="mt-2.5 pt-2 border-t border-slate-700 text-xs text-emerald-300">
                          <span className="font-semibold text-slate-400 mr-1.5">Answer:</span>
                          {qc.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Grounded in syllabus content via Gemini 3.8 Flash
              </span>
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
