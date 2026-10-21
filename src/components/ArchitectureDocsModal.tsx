import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  X,
  Code2,
  Database,
  Terminal,
  Layers,
  Server,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const ArchitectureDocsModal: React.FC = () => {
  const { isDocsModalOpen, setIsDocsModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<'architecture' | 'firebase' | 'gemini' | 'deploy'>('architecture');

  if (!isDocsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col text-white overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Campus Copilot — System Architecture &amp; Guide</h2>
              <p className="text-xs text-slate-400">Complete 6-hour Hackathon MVP Technical Documentation</p>
            </div>
          </div>

          <button
            onClick={() => setIsDocsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border-b border-slate-800 text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'architecture' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📁 Folder Structure &amp; Tech Stack
          </button>
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'gemini' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ✨ AI / Gemini Integration
          </button>
          <button
            onClick={() => setActiveTab('question_bank' as any)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              (activeTab as any) === 'question_bank' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            📚 Question Bank &amp; FastAPI
          </button>
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'firebase' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Firebase Setup &amp; Schema
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeTab === 'deploy' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Run Locally &amp; Deploy
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm font-sans leading-relaxed text-slate-300">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Folder Structure
              </h3>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
{`/
├── server.ts                       # Express full-stack entry point & Gemini API endpoints
├── index.html                      # HTML entry with metadata & viewport
├── package.json                    # Full-stack dependencies (@google/genai, express, vite)
├── vite.config.ts                  # Vite + Tailwind v4 configuration
├── .env.example                    # GEMINI_API_KEY environment variable documentation
├── src/
│   ├── main.tsx                    # React client entry point
│   ├── App.tsx                     # Main dashboard layout, navigation router & modals
│   ├── index.css                   # Tailwind CSS styling & custom scrollbars
│   ├── types/
│   │   └── index.ts                # TypeScript contracts: StudentProfile, StudyPlan, Quiz, CampusItem
│   ├── services/
│   │   └── api.ts                  # Client fetch calls, error fallbacks, PDF text extractor
│   ├── context/
│   │   └── AppContext.tsx          # Central state store, adaptive learning loop logic, persistence
│   ├── data/
│   │   └── sampleData.ts           # Realistic student Alex, DBMS Unit 3 notes, verified campus data
│   └── components/
│       ├── Navbar.tsx              # Top app navigation, 2-min demo button, docs trigger
│       ├── DashboardView.tsx       # Core dashboard with weakness alert, today's tasks, exams
│       ├── StudyMaterialView.tsx   # PDF/text upload, topic detection, difficulty rating
│       ├── StudyPlanView.tsx       # Multi-day actionable schedule with adaptive remediation
│       ├── QuizView.tsx            # Interactive MCQ player, scoring, weak topic identification
│       ├── CampusView.tsx          # Verified campus knowledge with strict anti-hallucination
│       ├── AIChatView.tsx          # Academic mentor chat with student context & suggested actions
│       ├── ProfileView.tsx         # Demographic settings & semester details
│       ├── DemoModal.tsx           # 12-step interactive hackathon demo walkthrough
│       └── ArchitectureDocsModal.tsx # This technical reference modal`}
              </pre>

              <h3 className="text-base font-bold text-white mt-4">Core Technology Stack</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">Frontend:</strong> React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Canvas Confetti.</li>
                <li><strong className="text-white">Backend &amp; API:</strong> Node.js + Express with TSX, Vite middlewares for integrated dev server.</li>
                <li><strong className="text-white">AI Engine:</strong> Google Gemini API via <code>@google/genai</code> SDK (model <code>gemini-3.8-flash</code>) with structured JSON schemas.</li>
                <li><strong className="text-white">Data Persistence:</strong> Unified State Store with LocalStorage sync + Firebase ready data models.</li>
              </ul>
            </div>
          )}

          {activeTab === 'gemini' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Gemini AI Integration Architecture
              </h3>
              <p>
                In accordance with Google AI Studio guidelines, the Gemini API is called <strong>strictly from the server-side</strong> using the official <code>@google/genai</code> TypeScript SDK. The API key is securely injected from <code>process.env.GEMINI_API_KEY</code> and is never exposed to client browsers.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300">
{`import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});

// 1. Topic Extraction & Difficulty Analysis (JSON Schema)
const materialResp = await ai.models.generateContent({
  model: 'gemini-3.8-flash',
  contents: prompt,
  config: { responseMimeType: 'application/json', responseSchema: ... }
});

// 2. Personalized Study Plan Generator
// 3. Diagnostic MCQ Quiz Generator
// 4. Learning Loop Weakness Detection
// 5. Anti-Hallucination Campus Knowledge Grounding`}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-emerald-200">
                <p className="font-bold">Anti-Hallucination Guardrail in Campus Knowledge:</p>
                <p className="mt-1">
                  The model is explicitly instructed: <em>&quot;If the answer is NOT present in the verified campus data, you MUST respond: &apos;I couldn't find this information in the available campus data.&apos; Do NOT guess or extrapolate.&quot;</em>
                </p>
              </div>
            </div>
          )}

          {(activeTab as any) === 'question_bank' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Question Bank &amp; Exam Preparation Architecture
              </h3>
              <p>
                The Question Bank module is built with a RESTful API architecture compatible with FastAPI/Express and SQLAlchemy/Firestore schema standards. It provides institutional paper indexing, AI-assisted question extraction, step-by-step solutions, timed mock exams, and repeat question detection.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
{`// REST API ENDPOINTS:
GET  /api/question-bank/papers                     # Filter PYQs by university, subject, semester, year
GET  /api/question-bank/papers/:id                 # Paper detail with question count & solution status
POST /api/question-bank/papers                     # Upload question paper (PDF text extraction)
GET  /api/question-bank/papers/:id/questions       # Paper question breakdown with marks & difficulty
POST /api/question-bank/papers/:id/extract-questions # Gemini AI question parser
GET  /api/questions/:id/solution                   # Verified solution or AI fallback
POST /api/questions/:id/generate-solution          # Gemini step-by-step AI solution generator
POST /api/questions/:id/save                       # Bookmark question for quick revision
GET  /api/students/:id/saved-questions             # Retrieve user bookmarked questions
GET  /api/question-bank/assignments                # Course homework & assignment bank
POST /api/question-bank/practice/start             # Start timed mock exam / untimed practice
POST /api/question-bank/practice/:id/submit        # Submit practice test & calculate score
GET  /api/students/:id/question-bank/progress      # Student accuracy, weak topics, & test count
GET  /api/students/:id/question-bank/repeated-questions # Past papers repeat frequency analysis`}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] text-blue-400">
                    Step-by-Step AI Solutions
                  </span>
                  <p className="text-slate-300">
                    Generates concise exam summaries and detailed step-by-step proofs with formulas, truth tables, and code snippets with clear AI-provisional labeling.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px] text-amber-400">
                    Historical Repeated Trends
                  </span>
                  <p className="text-slate-300">
                    Examines past exam archives to highlight high-yield questions (e.g. Normalization 2NF/3NF appeared 4 times across 5 years).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'firebase' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Firebase Setup &amp; Firestore Schema
              </h3>
              <p>
                For production deployments requiring shared multi-device storage and Google Auth, Firebase Firestore can be provisioned. Below is the production database schema and security rules:
              </p>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-orange-300 overflow-x-auto">
{`// FIRESTORE COLLECTIONS SCHEMA:

users/{userId}
  - name: string
  - college: string
  - course: string
  - semester: string
  - dailyStudyHours: number
  - studyStreakDays: number

users/{userId}/materials/{materialId}
  - title: string
  - subject: string
  - uploadDate: timestamp
  - detectedTopics: string[]
  - importantTopics: string[]
  - difficultyEstimation: { level, score, reasoning }

users/{userId}/studyPlans/{planId}
  - subject: string
  - examDate: string
  - availableHoursPerDay: number
  - preparationLevel: string
  - weakFocusTopics: string[]
  - days: Array<{ dayNumber, date, topics, durationMinutes, tasks }>

users/{userId}/quizSubmissions/{subId}
  - quizTitle: string
  - score: number
  - percentage: number
  - weakTopics: string[]
  - recommendation: string
  - timestamp: timestamp

campusKnowledge/{docId}
  - category: string
  - title: string
  - content: string
  - verifiedSource: string`}
              </pre>

              <p className="font-semibold text-white">Firestore Security Rules:</p>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /campusKnowledge/{docId} {
      allow read: if true;
      allow write: if false; // Read-only verified campus database
    }
  }
}`}
              </pre>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Instructions to Run Locally &amp; Deploy
              </h3>

              <div className="space-y-2">
                <p className="font-bold text-white">1. Install Dependencies:</p>
                <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400">
                  npm install
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">2. Configure Environment:</p>
                <p className="text-slate-400">
                  Create a <code>.env</code> file with your Gemini API key:
                </p>
                <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-blue-300">
                  GEMINI_API_KEY=&quot;YOUR_GEMINI_API_KEY_HERE&quot;<br />
                  PORT=3000
                </div>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">3. Start the Full-Stack Application:</p>
                <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400">
                  npm run dev
                </div>
                <p className="text-slate-400">
                  Open <code>http://localhost:3000</code> in your browser. The Express server will handle both API routes and Vite frontend assets.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">4. Build for Production / Cloud Run:</p>
                <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400">
                  npm run build<br />
                  npm start
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
