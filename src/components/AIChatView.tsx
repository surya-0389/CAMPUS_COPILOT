import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage, ChatConversation, ChatAttachment } from '../types';
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
  Plus,
  Trash2,
  Edit2,
  FileText,
  Code2,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Square,
  Paperclip,
  Image as ImageIcon,
  File as FileIcon,
  X,
  Upload,
} from 'lucide-react';
import { sendChatMessageAPI, streamChatMessageAPI } from '../services/api';

export const cleanAcademicSymbols = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\Rightarrow/g, '⇒')
    .replace(/\\Leftarrow/g, '⇐')
    .replace(/\\iff/g, '⇔')
    .replace(/\\implies/g, '⇒')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\approx/g, '≈')
    .replace(/\\in/g, '∈')
    .replace(/\\notin/g, '∉')
    .replace(/\\subset/g, '⊂')
    .replace(/\\subseteq/g, '⊆')
    .replace(/\\cap/g, '∩')
    .replace(/\\cup/g, '∪')
    .replace(/\\emptyset/g, '∅')
    .replace(/\\infty/g, '∞')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\Sigma/g, 'Σ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\cdot/g, '·')
    .replace(/\\dots/g, '…')
    .replace(/\\ldots/g, '…')
    .replace(/\\cdots/g, '…')
    .replace(/\\circ/g, '∘')
    .replace(/\\bullet/g, '•')
    .replace(/\\bowtie/g, '⋈')
    .replace(/\\{/g, '{')
    .replace(/\\}/g, '}')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\$\$([^$]+)\$\$/g, '$1')
    .replace(/\$([^$\n]+)\$/g, '$1')
    .replace(/\\([a-zA-Z0-9])/g, '$1');
};

const renderFormattedContent = (rawContent: string) => {
  const content = cleanAcademicSymbols(rawContent);
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    if (textBefore) {
      parts.push(renderTextWithFormatting(textBefore, `text-${lastIndex}`));
    }
    const lang = match[1] || 'code';
    const code = match[2];
    const matchIndex = match.index;
    parts.push(
      <div key={`code-${matchIndex}`} className="my-2.5 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-md">
        <div className="flex items-center justify-between px-3 py-1 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
          <span className="uppercase tracking-wider font-semibold text-slate-300">{lang}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(code)}
            className="flex items-center gap-1 hover:text-white transition cursor-pointer text-[10px] text-slate-400 py-0.5 px-1.5 rounded hover:bg-slate-800"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Code</span>
          </button>
        </div>
        <pre className="p-3 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }

  const remaining = content.substring(lastIndex);
  if (remaining) {
    parts.push(renderTextWithFormatting(remaining, `text-${lastIndex}`));
  }

  return parts;
};

const renderTextWithFormatting = (text: string, keyPrefix: string) => {
  const lines = text.split('\n');
  return (
    <div key={keyPrefix} className="space-y-1.5">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-sm text-white pt-2 pb-0.5 border-b border-slate-700/60">
              {trimmed.substring(4)}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-black text-base text-white pt-2 pb-0.5 border-b border-slate-700">
              {trimmed.substring(3)}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={idx} className="font-black text-lg text-white pt-2.5 pb-1 border-b border-slate-700">
              {trimmed.substring(2)}
            </h2>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-slate-200">
              <span className="text-blue-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span className="flex-1 leading-relaxed">{formatInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 text-slate-200">
              <span className="text-blue-400 font-bold shrink-0 text-xs">{numMatch[1]}.</span>
              <span className="flex-1 leading-relaxed">{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="leading-relaxed">
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
};

const formatInline = (str: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(str)) !== null) {
    if (m.index > lastIdx) {
      parts.push(str.substring(lastIdx, m.index));
    }
    const token = m[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={m.index} className="font-bold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={m.index} className="px-1.5 py-0.5 rounded bg-slate-950 text-amber-300 font-mono text-[11px] border border-slate-700/60">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIdx = m.index + token.length;
  }

  if (lastIdx < str.length) {
    parts.push(str.substring(lastIdx));
  }

  return parts.length > 0 ? parts : str;
};

export const AIChatView: React.FC = () => {
  const {
    profile,
    materials,
    activeMaterial,
    studyPlan,
    submissions,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    renameConversation,
    deleteConversation,
    saveConversationMessages,
    preloadedAIQuery,
    clearPreloadedAIQuery,
  } = useApp();

  const latestSub = submissions[0];
  const primaryWeakness = latestSub?.weakTopics?.[0] || 'Normalization';

  // Find active conversation object
  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0] || {
    id: 'conv-default',
    title: 'Academic Session',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mode: 'detailed' as const,
    messages: [],
  };

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'detailed' | 'short' | 'code'>(
    activeConv.mode || 'detailed'
  );
  const [selectedGroundingDocId, setSelectedGroundingDocId] = useState<string>(
    activeConv.groundingMaterialId || 'all'
  );
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  // Multimodal Attachment State (photo, docs, pdf)
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for preloaded AI query from PYQ / Assignment "Discuss with AI"
  useEffect(() => {
    if (preloadedAIQuery) {
      setInput(preloadedAIQuery.prompt);
      clearPreloadedAIQuery();
    }
  }, [preloadedAIQuery]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const reader = new FileReader();

    if (isImg) {
      reader.onload = () => {
        setSelectedAttachment({
          name: file.name,
          type: 'image',
          size: file.size,
          dataUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const textContent = typeof reader.result === 'string' ? reader.result : '';
        setSelectedAttachment({
          name: file.name,
          type: isPdf ? 'pdf' : 'doc',
          size: file.size,
          dataUrl: isPdf ? (typeof reader.result === 'string' && reader.result.startsWith('data:') ? reader.result : undefined) : undefined,
          extractedText: textContent.slice(0, 15000) || `Uploaded file ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        });
      };
      if (isPdf) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
    e.target.value = '';
  };

  // Generative Streaming States
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [streamingMeta, setStreamingMeta] = useState<{ provider: 'gemini' | 'chatgpt'; model: string }>({
    provider: selectedProvider,
    model: selectedModel,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv.messages, isLoading, streamingContent]);

  // Cleanup active stream on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard?.writeText(content);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleCreateNewChat = () => {
    const newId = createConversation('New Academic Query', selectedMode);
    setActiveConversationId(newId);
  };

  const handleRenameSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (renameText.trim()) {
      renameConversation(id, renameText.trim());
    }
    setRenamingId(null);
  };

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamingMsgId && streamingContent) {
      const stoppedMsg: ChatMessage = {
        id: streamingMsgId,
        role: 'assistant',
        content: streamingContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: streamingMeta.provider,
        model: streamingMeta.model,
      };
      saveConversationMessages(
        activeConv.id,
        [...activeConv.messages, stoppedMsg],
        selectedMode,
        selectedGroundingDocId
      );
    }
    setStreamingMsgId(null);
    setStreamingContent('');
    setIsLoading(false);
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if ((!query && !selectedAttachment) || isLoading || streamingMsgId) return;

    const attachmentToSend = selectedAttachment;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query || (attachmentToSend ? `Uploaded ${attachmentToSend.name} for academic analysis.` : ''),
      attachment: attachmentToSend || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...activeConv.messages, userMsg];
    saveConversationMessages(activeConv.id, nextMessages, selectedMode, selectedGroundingDocId);
    setInput('');
    setSelectedAttachment(null);
    setIsLoading(true);

    const assistantId = `msg-${Date.now() + 1}`;
    setStreamingMsgId(assistantId);
    setStreamingContent('');
    setStreamingMeta({ provider: selectedProvider, model: selectedModel });

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Find grounding text
      let groundingText = '';
      if (selectedGroundingDocId === 'all') {
        groundingText = materials.map((m) => `[Document: ${m.title} (${m.subject})]\n${m.rawText?.slice(0, 3000)}`).join('\n\n');
      } else {
        const doc = materials.find((m) => m.id === selectedGroundingDocId);
        if (doc) {
          groundingText = `[Grounding Document: ${doc.title} (${doc.subject})]\n${doc.rawText?.slice(0, 6000)}`;
        }
      }

      const studentContext = {
        name: profile.name,
        course: `${profile.course} ${profile.branch}`,
        semester: profile.semester,
        nextExam: `${profile.examDates[0]?.subject} on ${profile.examDates[0]?.date} (${profile.examDates[0]?.daysLeft} days away)`,
        lastWeakTopic: `${primaryWeakness} (recent diagnostic quiz score ${latestSub?.percentage ?? 40}%)`,
        dailyHours: profile.dailyStudyHours,
        notesSnippet: groundingText,
        explanationMode: selectedMode,
      };

      let accumulated = '';

      await streamChatMessageAPI(
        {
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          studentContext,
          currentSubject: studyPlan.subject,
          provider: selectedProvider,
          model: selectedModel,
          attachment: attachmentToSend,
        },
        {
          onChunk: (chunk: string) => {
            accumulated += chunk;
            setStreamingContent(accumulated);
            setIsLoading(false);
          },
          onComplete: (data) => {
            const finalAssistantMsg: ChatMessage = {
              id: assistantId,
              role: 'assistant',
              content: accumulated || 'Here is the response for your query.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              provider: (data.provider as any) || selectedProvider,
              model: data.model || selectedModel,
              latencyMs: data.latencyMs,
              suggestedActions: data.suggestedActions || [
                'Explain with another example',
                'Solve 3 practice questions',
              ],
            };
            saveConversationMessages(activeConv.id, [...nextMessages, finalAssistantMsg], selectedMode, selectedGroundingDocId);
            setStreamingMsgId(null);
            setStreamingContent('');
            setIsLoading(false);
          },
          onError: async (err: any) => {
            console.warn('Streaming error, falling back to non-streaming:', err);
            try {
              const res = await sendChatMessageAPI({
                messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
                studentContext,
                currentSubject: studyPlan.subject,
                provider: selectedProvider,
                model: selectedModel,
              });

              const fallbackAssistantMsg: ChatMessage = {
                id: assistantId,
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
              saveConversationMessages(activeConv.id, [...nextMessages, fallbackAssistantMsg], selectedMode, selectedGroundingDocId);
            } catch (fallbackErr: any) {
              const errorMsg: ChatMessage = {
                id: assistantId,
                role: 'assistant',
                content: 'I encountered an issue processing that query. Please try again or switch AI providers.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                provider: selectedProvider,
              };
              saveConversationMessages(activeConv.id, [...nextMessages, errorMsg], selectedMode, selectedGroundingDocId);
            } finally {
              setStreamingMsgId(null);
              setStreamingContent('');
              setIsLoading(false);
            }
          },
        },
        controller.signal
      );
    } catch (err: any) {
      if (controller.signal.aborted) return;
      setStreamingMsgId(null);
      setStreamingContent('');
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Explain 2NF vs 3NF with a decomposition counterexample.',
    'Why did I score 40% on Normalization?',
    'What are the Central Library hours tonight?',
    'Explain the Banker\'s algorithm for OS deadlocks.',
    'Create an exam revision cheat sheet for BCNF.',
  ];

  return (
    <div className="h-[calc(100vh-10rem)] min-h-[550px] max-h-[860px] flex rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
      {/* Left Column: Conversation History Sidebar */}
      <div
        className={`${
          isHistoryOpen ? 'w-64' : 'w-0'
        } shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col transition-all duration-200 overflow-hidden hidden sm:flex`}
      >
        <div className="p-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-bold text-slate-300">Chat History</span>
          <button
            onClick={handleCreateNewChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
          {conversations.map((conv) => {
            const isActive = conv.id === activeConv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`group flex items-center justify-between gap-2 p-2.5 rounded-xl text-xs font-semibold cursor-pointer transition select-none ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {renamingId === conv.id ? (
                  <form
                    onSubmit={(e) => handleRenameSubmit(e, conv.id)}
                    className="flex-1 flex gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="text"
                      value={renameText}
                      onChange={(e) => setRenameText(e.target.value)}
                      autoFocus
                      className="w-full bg-slate-800 text-white px-2 py-0.5 rounded text-xs focus:outline-none"
                    />
                    <button type="submit" className="text-emerald-400 text-xs px-1">
                      ✓
                    </button>
                  </form>
                ) : (
                  <div className="min-w-0 flex-1 truncate">
                    <p className="truncate text-xs">{conv.title}</p>
                    <span className="text-[10px] opacity-75 font-normal block truncate">
                      {conv.messages.length} messages
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingId(conv.id);
                      setRenameText(conv.title);
                    }}
                    className="p-1 hover:text-blue-300"
                    title="Rename conversation"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="p-1 hover:text-rose-400"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Chat Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-850/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="hidden sm:flex p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              title={isHistoryOpen ? 'Hide history sidebar' : 'Show history sidebar'}
            >
              {isHistoryOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <BotMessageSquare className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white truncate">{activeConv.title}</h2>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded font-semibold hidden md:inline">
                  RAG Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Alex ({profile.semester}) • Target: {profile.examDates[0]?.subject} ({profile.examDates[0]?.daysLeft}d left)
              </p>
            </div>
          </div>

          {/* Mode & Grounding Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Grounding Source Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 hidden xl:inline text-[11px]">Context:</span>
              <select
                value={selectedGroundingDocId}
                onChange={(e) => setSelectedGroundingDocId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-blue-500 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                <option value="all">All Uploaded Notes ({materials.length})</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Provider Switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setSelectedProvider('gemini')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  selectedProvider === 'gemini'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Google Gemini Engine"
              >
                <span>♊ Gemini</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedProvider('chatgpt')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  selectedProvider === 'chatgpt'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="ChatGPT (GPT-4o) Engine"
              >
                <span>🤖 ChatGPT</span>
              </button>
            </div>

            {/* Explanation Mode Selector */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
              <button
                onClick={() => setSelectedMode('detailed')}
                className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                  selectedMode === 'detailed'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Detailed step-by-step academic explanations"
              >
                Detailed
              </button>
              <button
                onClick={() => setSelectedMode('short')}
                className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                  selectedMode === 'short'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Concise bulleted exam summary"
              >
                Summary
              </button>
              <button
                onClick={() => setSelectedMode('code')}
                className={`px-2 py-0.5 rounded font-semibold transition cursor-pointer ${
                  selectedMode === 'code'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Code and SQL query debugging"
              >
                Code/SQL
              </button>
            </div>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeConv.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <BotMessageSquare className="w-12 h-12 text-slate-600" />
              <h3 className="text-base font-bold text-white">How can I assist your study session?</h3>
              <p className="text-xs max-w-md text-slate-400">
                Ask questions about your uploaded syllabus, university question papers, normal form proofs, or debugging queries.
              </p>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {quickPrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-slate-850 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-800 transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            activeConv.messages.map((m) => {
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

                  <div className="max-w-[88%] sm:max-w-2xl space-y-2">
                    {/* Render Multimodal Attachment in Message */}
                    {m.attachment && m.attachment.type === 'image' && m.attachment.dataUrl && (
                      <div className="rounded-xl overflow-hidden max-h-56 border border-slate-700 bg-slate-950/80 shadow-md">
                        <img
                          src={m.attachment.dataUrl}
                          alt={m.attachment.name}
                          className="w-full h-auto object-contain max-h-56"
                        />
                        <div className="px-2.5 py-1 bg-slate-900/90 text-[10px] text-slate-300 font-mono flex items-center justify-between">
                          <span className="truncate">📷 {m.attachment.name}</span>
                          <span>{(m.attachment.size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    )}

                    {m.attachment && m.attachment.type !== 'image' && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 flex items-center gap-2.5 text-xs">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1 truncate">
                          <p className="text-[11px] font-semibold text-white truncate">{m.attachment.name}</p>
                          <p className="text-[10px] text-slate-400">
                            {m.attachment.type.toUpperCase()} • {(m.attachment.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    )}

                    <div
                      className={`relative group p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isUser
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/15 whitespace-pre-wrap'
                          : 'bg-slate-800/90 hover:bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md'
                      }`}
                    >
                      {isUser ? m.content : renderFormattedContent(m.content)}

                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.content, m.id)}
                          className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-white transition cursor-pointer"
                          title="Copy answer"
                        >
                          {copiedMsgId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      className={`flex items-center gap-2 text-[10px] text-slate-500 ${
                        isUser ? 'justify-end' : ''
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {!isUser && m.provider && (
                        <span className="font-semibold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {m.provider === 'chatgpt' ? 'ChatGPT 4o' : 'Gemini 3.8'}
                          {m.latencyMs ? ` • ${m.latencyMs}ms` : ''}
                        </span>
                      )}
                    </div>

                    {/* Suggested Next Action Pills */}
                    {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {m.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSend(action)}
                            className="text-[11px] bg-slate-850 hover:bg-slate-800 text-blue-300 hover:text-white px-2.5 py-1 rounded-xl border border-slate-700/80 transition flex items-center gap-1 cursor-pointer active:scale-95"
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
            })
          )}

          {/* Live Generative Assistant Streaming Bubble */}
          {streamingMsgId && (
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                  streamingMeta.provider === 'chatgpt'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                }`}
              >
                <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
              </div>

              <div className="max-w-[88%] sm:max-w-2xl space-y-2">
                <div className="relative group p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed bg-slate-800/90 text-slate-100 rounded-tl-none border border-slate-700/80 shadow-md">
                  {streamingContent ? (
                    <div>
                      {renderFormattedContent(streamingContent)}
                      <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse align-middle rounded-xs" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      <span>
                        {streamingMeta.provider === 'chatgpt'
                          ? 'ChatGPT 4o generating response...'
                          : 'Google Gemini generating response...'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Generative Real-Time Stream
                  </span>
                  <span className="font-semibold uppercase tracking-wider text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {streamingMeta.provider === 'chatgpt' ? 'ChatGPT 4o' : 'Gemini 3.8'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-slate-850/80 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
            Prompt Ideas:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              disabled={Boolean(streamingMsgId || isLoading)}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg whitespace-nowrap border border-slate-700/80 transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Attachment Preview Chip */}
        {selectedAttachment && (
          <div className="px-3 py-2 bg-slate-850 border-t border-slate-800 flex items-center justify-between gap-2 text-xs animate-fade-in">
            <div className="flex items-center gap-2.5 min-w-0">
              {selectedAttachment.type === 'image' && selectedAttachment.dataUrl ? (
                <img
                  src={selectedAttachment.dataUrl}
                  alt="preview"
                  className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs truncate">{selectedAttachment.name}</span>
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.2 rounded font-semibold uppercase">
                    {selectedAttachment.type}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Ready for AI analysis • {(selectedAttachment.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedAttachment(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Remove attachment"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Hidden File Input for Multimodal Uploads */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
          className="hidden"
        />

        {/* Chat Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
        >
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={Boolean(streamingMsgId)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer shrink-0 disabled:opacity-50"
            title="Upload photo, doc, or PDF to ask AI"
          >
            <Paperclip className="w-4 h-4 text-blue-400" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedAttachment
                ? `Ask AI about ${selectedAttachment.name}...`
                : `Ask ${selectedProvider === 'chatgpt' ? 'ChatGPT (GPT-4o)' : 'Google Gemini'} or upload photo/doc/pdf...`
            }
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            disabled={Boolean(streamingMsgId)}
          />

          {streamingMsgId ? (
            <button
              type="button"
              onClick={handleStopStreaming}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20 active:scale-95 shrink-0"
              title="Stop generating"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedAttachment)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-blue-600/20 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
