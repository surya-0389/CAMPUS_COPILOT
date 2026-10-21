import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  ExternalLink,
  Copy,
  Check,
  Github,
  Linkedin,
  Globe,
  QrCode,
  Sparkles,
  Terminal,
  X,
  Send,
  Layers,
  BotMessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const ExportShareModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, profile, selectedProvider } = useApp();
  const [activeTab, setActiveTab] = useState<'deploy' | 'linkedin' | 'github'>('deploy');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sharedAppUrl = 'https://ais-pre-a5es6pekivw2gbfte7vq4z-976784239237.asia-east1.run.app';
  const devAppUrl = 'https://ais-dev-a5es6pekivw2gbfte7vq4z-976784239237.asia-east1.run.app';

  if (!isExportModalOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const linkedinPostText = `🚀 Excited to announce CAMPUS COPILOT — Your AI Academic Operating System! 🎓

Unlike generic chatbots, Campus Copilot doesn't just answer questions; it understands a student's syllabus, uploaded notes, exam schedules, and diagnostic test results to automatically convert them into actionable daily study plans and personalized learning loops.

⚡ KEY HIGHLIGHTS:
🔹 Dual AI Engine: Connected with both Google Gemini (gemini-3.8-flash) & ChatGPT (OpenAI GPT-4o) with instant model switching.
🔹 University PYQ & Exam Bank: Browse verified past year papers, internal class tests, and timed mock exams with step-by-step solutions.
🔹 Adaptive Learning Loop: Identifies weak topics (e.g. Normalization at 40%) and automatically injects targeted 30-minute remediation tasks.
🔹 Anti-Hallucination Campus Grounding: Strictly cites verified academic circulars and library notices.
🔹 Fully Responsive & High-Performance: Built with React 19, TypeScript, Express, and Tailwind CSS.

🌐 Try the Live Interactive Demo here:
${sharedAppUrl}

#GoogleGemini #ChatGPT #AI #EdTech #FullStack #ReactJS #NodeJS #WebDevelopment #OpenAI #StudentTech #Innovation`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharedAppUrl)}`;

  const gitBashCommands = `# 1. Initialize git & commit codebase
git init
git add .
git commit -m "feat: Campus Copilot — AI Academic OS with Gemini & ChatGPT"

# 2. Add your GitHub repository remote (replace <YOUR_USERNAME>)
git remote add origin https://github.com/<YOUR_USERNAME>/campus-copilot.git
git branch -M main
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Deploy, LinkedIn &amp; GitHub</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Live &amp; Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">Share your project link and publish to your professional network</p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-slate-950/60 border-b border-slate-800 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer ${
              activeTab === 'deploy'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Live Deploy Links</span>
          </button>

          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer ${
              activeTab === 'linkedin'
                ? 'bg-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Linkedin className="w-4 h-4" />
            <span>Post to LinkedIn</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition cursor-pointer ${
              activeTab === 'github'
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>Push to GitHub</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* 1. Deploy Tab */}
          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white text-xs uppercase tracking-wider">
                      Public Live Production Link
                    </span>
                  </div>
                  <span className="text-[11px] text-blue-400 font-medium">Cloud Run Asia-East1</span>
                </div>

                <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={sharedAppUrl}
                    className="flex-1 bg-transparent text-xs text-blue-300 font-mono outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopy(sharedAppUrl, 'shared_link')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm"
                  >
                    {copiedKey === 'shared_link' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <a
                    href={sharedAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Open live app in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Dev URL */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Development Hot-Preview Link:</span>
                  <span className="text-slate-500 text-[11px]">Auto-reloads on save</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    readOnly
                    value={devAppUrl}
                    className="flex-1 bg-transparent text-xs text-slate-300 font-mono outline-none truncate"
                  />
                  <button
                    onClick={() => handleCopy(devAppUrl, 'dev_link')}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedKey === 'dev_link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dev_link' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={devAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Device Accessibility Grid */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Tested Responsive Device Measurements
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-white">Mobile</p>
                    <p className="text-[10px] text-slate-400">320px – 480px</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Bottom Bar</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-white">Tablet</p>
                    <p className="text-[10px] text-slate-400">768px – 1024px</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Adaptive Nav</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-white">Laptop</p>
                    <p className="text-[10px] text-slate-400">1280px – 1440px</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Full Grid</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <p className="font-bold text-white">Ultrawide</p>
                    <p className="text-[10px] text-slate-400">1920px+</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Max 7xl</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. LinkedIn Tab */}
          {activeTab === 'linkedin' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    Post to Your LinkedIn Profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pre-crafted professional announcement post highlighting your dual Gemini &amp; ChatGPT architecture.
                  </p>
                </div>

                <a
                  href={linkedinShareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#0A66C2]/30 transition cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open LinkedIn Share</span>
                </a>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={10}
                  value={linkedinPostText}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-sans text-xs text-slate-200 leading-relaxed outline-none resize-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleCopy(linkedinPostText, 'linkedin_text')}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer shadow-md"
                >
                  {copiedKey === 'linkedin_text' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Post</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>How to Post:</strong> Click <strong className="text-white">&quot;Copy Full Post&quot;</strong>, then click <strong className="text-white">&quot;Open LinkedIn Share&quot;</strong> to paste and publish directly to your network!
                </p>
              </div>
            </div>
          )}

          {/* 3. GitHub Tab */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-300" />
                  Publish Repository to Your GitHub Account
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Run these commands in your project directory or terminal to push your repository.
                </p>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                  {gitBashCommands}
                </pre>
                <button
                  onClick={() => handleCopy(gitBashCommands, 'git_commands')}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer shadow-md"
                >
                  {copiedKey === 'git_commands' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Step-by-Step Instructions:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Create a new empty repository named <code className="text-blue-300">campus-copilot</code> on your GitHub profile.</li>
                  <li>Copy the commands above and replace <code className="text-amber-300">&lt;YOUR_USERNAME&gt;</code> with your GitHub username.</li>
                  <li>Run the commands in your local shell to push all branches and commits!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Active AI Engine: <strong className="text-white capitalize">{selectedProvider}</strong></span>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
