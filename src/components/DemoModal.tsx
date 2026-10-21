import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  BookOpen,
  CalendarCheck,
  BrainCircuit,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const DemoModal: React.FC = () => {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    setActiveTab,
    studyPlan,
    submissions,
    showCelebration,
    resetToDefaultDemo,
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  if (!isDemoModalOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Login as Student',
      desc: 'Logged in as Alex, 3rd Semester B.Tech Computer Science student at Apex Institute.',
      actionText: 'View Student Dashboard',
      tab: 'dashboard',
    },
    {
      step: 2,
      title: 'Upcoming DBMS Exam',
      desc: 'Dashboard highlights Database Management Systems exam in 4 days (Oct 20, 2026).',
      actionText: 'Inspect Exam Countdown',
      tab: 'dashboard',
    },
    {
      step: 3,
      title: 'Inspect Syllabus / Notes Upload',
      desc: 'DBMS Unit 3 PDF uploaded: AI detects 8 topics (1NF, 2NF, 3NF, BCNF, ACID) with Medium-Hard difficulty rating (7.8/10).',
      actionText: 'Open Uploaded Notes & Topics',
      tab: 'materials',
    },
    {
      step: 4,
      title: 'AI Study Plan Generation',
      desc: 'AI schedules topics across available 4 days matching Alex\'s 3 hours/day study budget.',
      actionText: 'Inspect Generated Study Plan',
      tab: 'study-plan',
    },
    {
      step: 5,
      title: 'Today\'s Topic & Actionable Tasks',
      desc: 'Day 1 prioritizes Functional Dependencies & Normalization with concrete time-boxed tasks.',
      actionText: 'Review Day 1 Tasks',
      tab: 'study-plan',
    },
    {
      step: 6,
      title: 'Diagnostic Quiz Generation',
      desc: 'AI generates a 5-question multiple choice diagnostic from the uploaded syllabus.',
      actionText: 'Open Diagnostic Quiz',
      tab: 'quizzes',
    },
    {
      step: 7,
      title: 'Quiz Submission & Score (40%)',
      desc: 'Student completes the quiz and scores 2/5 (40%) on Normalization questions.',
      actionText: 'View Quiz Score & Diagnosis',
      tab: 'quizzes',
    },
    {
      step: 8,
      title: 'AI Pinpoints Weakness: "Normalization"',
      desc: 'System flags: "Normalization is currently your weakest topic (40% accuracy)."',
      actionText: 'See Weak Topic Alert',
      tab: 'quizzes',
    },
    {
      step: 9,
      title: 'Automatic Remediation Recommendation',
      desc: 'AI recommends: "Spend 30 additional minutes reviewing 2NF & 3NF decomposition before moving to Transactions."',
      actionText: 'View Remediation Action',
      tab: 'quizzes',
    },
    {
      step: 10,
      title: 'Study Plan Auto-Updated (+30 Mins)',
      desc: 'Adaptive learning loop injects targeted Normalization review tasks into today\'s schedule.',
      actionText: 'Verify Injected Tasks in Plan',
      tab: 'study-plan',
    },
    {
      step: 11,
      title: 'University PYQ & Step-by-Step Solutions',
      desc: 'Browse verified previous year papers, review questions where Normalization appeared 4 times across archives, and view AI step-by-step solutions.',
      actionText: 'Explore Question Bank & PYQs',
      tab: 'question-bank',
    },
    {
      step: 12,
      title: 'Verified Campus Grounding',
      desc: 'Student checks Library extended hours (open till 11 PM) with strict anti-hallucination source citations.',
      actionText: 'View Campus Knowledge',
      tab: 'campus',
    },
    {
      step: 13,
      title: 'Return to Dashboard',
      desc: 'Dashboard now displays the active weakness alert, updated readiness score, and refreshed progress.',
      actionText: 'Finish Walkthrough on Dashboard',
      tab: 'dashboard',
    },
  ];

  const activeStepData = demoSteps[currentStep - 1];

  const handleExecuteStep = (stepNumber: number) => {
    const item = demoSteps[stepNumber - 1];
    setActiveTab(item.tab);
    showCelebration();
    if (stepNumber < demoSteps.length) {
      setCurrentStep(stepNumber + 1);
    } else {
      setIsDemoModalOpen(false);
      setCurrentStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                2-Minute Hackathon Demo Walkthrough
              </h2>
              <p className="text-xs text-slate-400">
                Step-by-step verification of the 12-point judging criteria
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDemoModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-semibold text-amber-400">
              Step {currentStep} of {demoSteps.length}: {activeStepData.title}
            </span>
            <span>{Math.round((currentStep / demoSteps.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Showcase Box */}
        <div className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              Step {activeStepData.step}
            </span>
            <h3 className="text-base font-bold text-white">{activeStepData.title}</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{activeStepData.desc}</p>
        </div>

        {/* Step Selector Pills */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-32 overflow-y-auto p-1">
          {demoSteps.map((s) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(s.step);
                setActiveTab(s.tab);
              }}
              className={`p-2 rounded-lg text-[11px] font-semibold text-center border transition cursor-pointer ${
                currentStep === s.step
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : s.step < currentStep
                  ? 'bg-slate-800/80 text-emerald-400 border-slate-700'
                  : 'bg-slate-850 text-slate-400 border-slate-800'
              }`}
            >
              Step {s.step}
            </button>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              resetToDefaultDemo();
              setCurrentStep(1);
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Previous
              </button>
            )}

            <button
              onClick={() => handleExecuteStep(currentStep)}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>{activeStepData.actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
