import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StudyMaterialView } from './components/StudyMaterialView';
import { StudyPlanView } from './components/StudyPlanView';
import { QuizView } from './components/QuizView';
import { ProgressView } from './components/ProgressView';
import { CampusView } from './components/CampusView';
import { AIChatView } from './components/AIChatView';
import { ProfileView } from './components/ProfileView';
import { QuestionBankHome } from './components/QuestionBank/QuestionBankHome';
import { DemoModal } from './components/DemoModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { ExportShareModal } from './components/ExportShareModal';
import { AnimatedBackground } from './components/AnimatedBackground';
import { WelcomeAuthView } from './components/WelcomeAuthView';
import { FacultyDashboardView } from './components/FacultyDashboardView';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated, userRole } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return userRole === 'faculty' ? <FacultyDashboardView /> : <DashboardView />;
      case 'materials':
        return <StudyMaterialView />;
      case 'question-bank':
        return <QuestionBankHome />;
      case 'study-plan':
        return <StudyPlanView />;
      case 'quizzes':
        return <QuizView />;
      case 'progress':
        return <ProgressView />;
      case 'campus':
        return <CampusView />;
      case 'chat':
        return <AIChatView />;
      case 'profile':
        return <ProfileView />;
      default:
        return userRole === 'faculty' ? <FacultyDashboardView /> : <DashboardView />;
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Dynamic Animated Canvas & Ambient Light Background */}
      <AnimatedBackground />

      {isAuthenticated ? (
        <>
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 sm:pb-8">
            {renderActiveView()}
          </main>

          {/* Subtle Footer */}
          <footer className="border-t border-slate-900/80 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 hidden sm:block">
            <p>
              CAMPUS COPILOT — AI Academic Operating System • Powered by Google Gemini 3.8 &amp; ChatGPT GPT-4o • React 19 + Express
            </p>
          </footer>
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8">
            <WelcomeAuthView />
          </main>

          <footer className="border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-md py-4 text-center text-xs text-slate-500">
            <p>
              CAMPUS COPILOT — AI Academic Operating System • Powered by Google Gemini 3.8 &amp; ChatGPT GPT-4o
            </p>
          </footer>
        </div>
      )}

      {/* Global Hackathon Modals */}
      <DemoModal />
      <ArchitectureDocsModal />
      <ExportShareModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
