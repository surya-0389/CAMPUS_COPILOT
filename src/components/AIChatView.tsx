import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  User,
  Clock,
  ArrowRight,
  ShieldAlert,
  Lightbulb,
  Copy,
  Check,
  Cpu,
  Zap,
} from 'lucide-react';
import { sendChatMessageAPI } from '../services/api';

export const AIChatView: React.FC = () => {
  const {
    profile,
    activeMaterial,
    studyPlan,
    submissions,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
  } = useApp();

  const latestSub = submissions[0];
  const primaryWeakness = latestSub?.weakTopics?.[0] || 'Normalization';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello ${profile.name}! I'm Campus Copilot, your AI Academic Operating System. 

I understand your full academic context:
• You are in ${profile.semester} (${profile.course} ${profile.branch})
• Your next target exam is ${profile.examDates[0]?.subject} on ${profile.examDates[0]?.date} (${profile.examDates[0]?.daysLeft} days left)
• In your recent diagnostic quiz, you scored ${latestSub?.percentage ?? 40}%, with **${primaryWeakness}** detected as your primary weak area.

How can I help you master your material and turn it into actionable progress today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'gemini',
      model: 'gemini-3.8-flash',
      suggestedActions: [
        'Explain Normalization from my DBMS notes',
        'Why did I get question 2 wrong on 2NF?',
        'What should I study in my next session?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const studentContext = {
        name: profile.name,
        course: `${profile.course} ${profile.branch}`,
        semester: profile.semester,
        nextExam: `${profile.examDates[0]?.subject} on ${profile.examDates[0]?.date} (${profile.examDates[0]?.daysLeft} days away)`,
        lastWeakTopic: `${primaryWeakness} (recent score ${latestSub?.percentage ?? 40}%)`,
        dailyHours: profile.dailyStudyHours,
        notesSnippet: activeMaterial?.rawText?.slice(0, 4000),
      };

      const res = await sendChatMessageAPI({
        messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        studentContext,
        currentSubject: studyPlan.subject,
        provider: selectedProvider,
        model: selectedModel,
      });

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.reply || 'Here is what I recommend for your study schedule.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: res.provider || selectedProvider,
        model: res.model || selectedModel,
        latencyMs: res.latencyMs,
        suggestedActions: res.suggestedActions || [
          'Review today\'s study tasks',
          'Solve 5 PYQ practice questions',
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 2}`,
          role: 'assistant',
          content: 'I encountered an issue processing that query. Please try again or check your active study plan.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: selectedProvider,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Explain normalization from my DBMS notes.',
    'Why did I get 40% on Normalization?',
    'What are the Central Library hours tonight?',
    'Create a 3-step cheat sheet for BCNF.',
    'How should I allocate my 3 hours of study today?',
  ];

  return (
    <div className="h-[calc(100vh-12rem)] min-h-[520px] max-h-[820px] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden transition-all duration-200">
      {/* Mentor Chat Header */}
      <div className="p-3.5 sm:p-4 bg-slate-850/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Campus Copilot Academic Mentor</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">
                Context-Aware
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in: {activeMaterial?.title || 'DBMS Syllabus'} • Exam in {profile.examDates[0]?.daysLeft} days
            </p>
          </div>
        </div>

        {/* Dual AI Engine Switcher inside Chat */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-700/80 text-xs">
            <button
              onClick={() => setSelectedProvider('gemini')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                selectedProvider === 'gemini'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>♊ Gemini 3.8</span>
            </button>
            <button
              onClick={() => setSelectedProvider('chatgpt')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                selectedProvider === 'chatgpt'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤖 ChatGPT 4o</span>
            </button>
          </div>

          <span className="hidden md:inline-block text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20 font-semibold">
            Weak: {primaryWeakness}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : m.provider === 'chatgpt'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className={`max-w-[88%] sm:max-w-2xl space-y-2`}>
                <div
                  className={`relative group p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap transition-all duration-200 ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/15'
                      : 'bg-slate-800/90 hover:bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                  }`}
                >
                  {m.content}

                  {/* Copy button on assistant messages */}
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.content, m.id)}
                      className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer"
                      title="Copy message"
                    >
                      {copiedMsgId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isUser ? 'justify-end' : ''}`}>
                  <span>{m.timestamp}</span>
                  {!isUser && m.provider && (
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold text-[9px] uppercase tracking-wider ${
                        m.provider === 'chatgpt'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {m.provider === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Google Gemini (3.8)'}
                      {m.latencyMs ? ` • ${m.latencyMs}ms` : ''}
                    </span>
                  )}
                </div>

                {/* Suggested Action Chips with Hover Glow */}
                {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(action)}
                        className="text-[11px] bg-slate-850 hover:bg-slate-800 hover:border-blue-500/50 hover:shadow-sm text-blue-300 hover:text-white px-2.5 py-1 rounded-xl border border-slate-700/80 transition-all duration-200 flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Lightbulb className="w-3 h-3 text-amber-400" />
                        <span>{action}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                selectedProvider === 'chatgpt'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-800 border border-slate-700/80 p-3.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-bounce" />
              <span
                className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
                style={{ animationDelay: '0.4s' }}
              />
              <span className="ml-1 text-slate-300">
                {selectedProvider === 'chatgpt'
                  ? 'Consulting OpenAI ChatGPT (GPT-4o)...'
                  : 'Synthesizing with Google Gemini (gemini-3.8-flash)...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-4 py-2 bg-slate-850/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
          Quick Ask:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg whitespace-nowrap border border-slate-700/80 transition-all duration-150 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selectedProvider === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Google Gemini'} about your syllabus, 2NF/3NF, quiz score, or library hours...`}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20 active:scale-95"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
