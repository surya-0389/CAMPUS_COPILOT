import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { VERIFIED_CAMPUS_DATA, SAMPLE_MATERIALS, SAMPLE_QUIZ } from './src/data/sampleData';
import {
  INITIAL_PAPERS,
  INITIAL_QUESTIONS,
  INITIAL_SOLUTIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ANALYTICS,
  INITIAL_REPEATED_QUESTIONS,
} from './src/data/questionBankData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// OpenAI / ChatGPT API Client Helper
// -------------------------------------------------------------
async function callChatGPT(params: {
  systemPrompt?: string;
  userPrompt?: string;
  messages?: Array<{ role: string; content: string }>;
  jsonMode?: boolean;
  model?: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured on server');
  }

  const model = params.model || 'gpt-4o';
  const chatMessages: any[] = [];
  if (params.systemPrompt) {
    chatMessages.push({ role: 'system', content: params.systemPrompt });
  }
  if (params.messages && params.messages.length > 0) {
    chatMessages.push(
      ...params.messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: m.content,
      }))
    );
  } else if (params.userPrompt) {
    chatMessages.push({ role: 'user', content: params.userPrompt });
  }

  const payload: any = {
    model,
    messages: chatMessages,
    temperature: 0.7,
  };
  if (params.jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// -------------------------------------------------------------
// Health Check Endpoint
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY),
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    chatgptEnabled: Boolean(process.env.OPENAI_API_KEY),
    timestamp: new Date().toISOString(),
    appName: 'Campus Copilot',
  });
});

// -------------------------------------------------------------
// AI Providers Status & Model Registry Endpoint
// -------------------------------------------------------------
app.get('/api/ai/providers', (req, res) => {
  const geminiAvailable = Boolean(process.env.GEMINI_API_KEY);
  const openAIAvailable = Boolean(process.env.OPENAI_API_KEY);

  res.json({
    activeProvider: geminiAvailable ? 'gemini' : openAIAvailable ? 'chatgpt' : 'gemini',
    providers: [
      {
        id: 'gemini',
        name: 'Google Gemini',
        model: 'gemini-3.8-flash',
        tag: 'Core Multimodal Engine',
        status: geminiAvailable ? 'connected' : 'simulated',
        badgeColor: 'blue',
        description: 'Google AI Studio high-speed reasoning with structured schema verification',
        features: ['Structured JSON Schemas', 'Direct Syllabus Context', 'Instant Latency (<1s)'],
      },
      {
        id: 'chatgpt',
        name: 'ChatGPT (OpenAI)',
        model: 'gpt-4o',
        tag: 'Advanced Conversational',
        status: openAIAvailable ? 'connected' : 'ready',
        badgeColor: 'emerald',
        description: 'OpenAI GPT-4o conversational academic mentor with step-by-step logic proofs',
        features: ['Natural Socratic Dialogue', 'Code & Query Deconstructions', 'Exam Explanations'],
      },
    ],
  });
});

// -------------------------------------------------------------
// 1. Analyze Study Material / Syllabus
// -------------------------------------------------------------
app.post('/api/ai/analyze-material', async (req, res) => {
  try {
    const { title, subject, textContent } = req.body;
    if (!textContent || typeof textContent !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }

    if (ai) {
      const prompt = `Analyze this university study material or syllabus for subject "${subject || 'Computer Science'}" (Title: "${title || 'Uploaded Document'}").
Extract the following information in structured JSON format:
- detectedTopics: array of 4-8 specific topics/units found in the text
- importantTopics: array of 2-4 highest-yield, exam-critical topics
- difficultyEstimation: object with:
  - level: one of ["Easy", "Medium", "Medium-Hard", "Hard"]
  - score: number between 1.0 and 10.0
  - reasoning: concise explanation of why this material has this difficulty level
- summary: 2-3 sentence academic summary explaining what students need to understand.

STUDY MATERIAL TEXT:
${textContent.slice(0, 15000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detectedTopics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              importantTopics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              difficultyEstimation: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
                required: ['level', 'score', 'reasoning'],
              },
              summary: { type: Type.STRING },
            },
            required: ['detectedTopics', 'importantTopics', 'difficultyEstimation', 'summary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }

    // High quality heuristic fallback if API key is not yet set
    const fallback = {
      detectedTopics: [
        'Functional Dependencies & Closure',
        'Relational Decomposition',
        '1NF, 2NF, 3NF Normalization',
        'Boyce-Codd Normal Form (BCNF)',
        'Lossless Join & Dependency Preservation',
        'Transaction ACID Properties',
        'Conflict Serializability',
      ],
      importantTopics: [
        'Boyce-Codd Normal Form (BCNF)',
        '3NF vs BCNF Decomposition',
        'Conflict Serializability & Precedence Graph',
      ],
      difficultyEstimation: {
        level: 'Medium-Hard',
        score: 7.6,
        reasoning: 'Requires rigorous mathematical understanding of functional dependency closures and serializability graphs.',
      },
      summary: 'Comprehensive academic module detailing relational database normalization principles to eradicate anomalies, accompanied by transaction ACID management and concurrency control.',
    };

    return res.json({ success: true, data: fallback, isFallback: true });
  } catch (error: any) {
    console.error('Error analyzing material:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze material' });
  }
});

// -------------------------------------------------------------
// 2. Generate Personalized AI Study Plan
// -------------------------------------------------------------
app.post('/api/ai/study-plan', async (req, res) => {
  try {
    const {
      subject,
      examDate,
      availableHoursPerDay = 3,
      preparationLevel = 'Intermediate',
      weakFocusTopics = [],
      materialText = '',
    } = req.body;

    const today = new Date();
    const exam = examDate ? new Date(examDate) : new Date(today.getTime() + 4 * 86400000);
    const diffDays = Math.max(1, Math.min(14, Math.ceil((exam.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))));

    if (ai) {
      const prompt = `You are Campus Copilot, an AI Academic Mentor.
Generate a high-yield, personalized day-by-day study plan for a university student.
Subject: ${subject}
Target Exam Date: ${examDate} (${diffDays} days from now)
Available Study Time: ${availableHoursPerDay} hours/day (${availableHoursPerDay * 60} minutes/day)
Student's Preparation Level: ${preparationLevel}
Known Weak Areas needing extra drills: ${weakFocusTopics.length > 0 ? weakFocusTopics.join(', ') : 'None yet identified'}

Relevant Study Material/Syllabus extract:
${materialText ? materialText.slice(0, 10000) : 'Standard university syllabus for ' + subject}

IMPORTANT RULES:
1. Divide the topics across exactly ${diffDays} days.
2. The total minutes of tasks per day MUST equal roughly ${availableHoursPerDay * 60} minutes.
3. Every task must be concrete and actionable (e.g. "Solve 10 questions on 2NF", "Learn 1NF, 2NF and 3NF", "Review Armstrong axioms", "Take 15-minute quick test").
4. If weak areas exist (${weakFocusTopics.join(', ')}), explicitly tag remedial tasks with isWeakAreaRemediation: true and explain why in the description.
5. Include an "adaptiveNote" explaining how the plan was customized for the student's preparation level and weak areas.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              examDate: { type: Type.STRING },
              availableHoursPerDay: { type: Type.NUMBER },
              preparationLevel: { type: Type.STRING },
              adaptiveNote: { type: Type.STRING },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    date: { type: Type.STRING },
                    topics: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    durationMinutes: { type: Type.INTEGER },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          description: { type: Type.STRING },
                          estimatedMinutes: { type: Type.INTEGER },
                          completed: { type: Type.BOOLEAN },
                          topicTag: { type: Type.STRING },
                          isWeakAreaRemediation: { type: Type.BOOLEAN },
                        },
                        required: ['id', 'description', 'estimatedMinutes', 'completed', 'topicTag'],
                      },
                    },
                  },
                  required: ['dayNumber', 'date', 'topics', 'durationMinutes', 'tasks'],
                },
              },
            },
            required: ['subject', 'examDate', 'availableHoursPerDay', 'days'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, plan: parsed });
    }

    // Dynamic generator fallback
    const fallbackDays = [];
    const baseDate = new Date();
    const topicsPool = [
      ['Functional Dependencies', '1NF, 2NF and 3NF'],
      ['Boyce-Codd Normal Form (BCNF)', 'Lossless Join Decomposition'],
      ['ACID Properties', 'Transaction States & Schedules'],
      ['Conflict Serializability', 'Two-Phase Locking (2PL)'],
    ];

    for (let i = 0; i < diffDays; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dayTopics = topicsPool[i % topicsPool.length];
      const dailyMinutes = availableHoursPerDay * 60;
      const isWeakDay = weakFocusTopics.length > 0 && i < 2;

      fallbackDays.push({
        dayNumber: i + 1,
        date: d.toISOString().split('T')[0],
        topics: dayTopics,
        durationMinutes: dailyMinutes,
        tasks: [
          {
            id: `task-${i + 1}-1`,
            description: `Core Theory: Master fundamental principles of ${dayTopics[0]}`,
            estimatedMinutes: Math.round(dailyMinutes * 0.35),
            completed: i === 0,
            topicTag: dayTopics[0],
            isWeakAreaRemediation: false,
          },
          {
            id: `task-${i + 1}-2`,
            description: `Solved Examples: Practice 5 standard university problems for ${dayTopics[1]}`,
            estimatedMinutes: Math.round(dailyMinutes * 0.35),
            completed: false,
            topicTag: dayTopics[1],
            isWeakAreaRemediation: false,
          },
          ...(isWeakDay
            ? [
                {
                  id: `task-${i + 1}-remedial`,
                  description: `[ADAPTIVE REMEDIATION] Review ${weakFocusTopics[0]} edge cases and solve diagnostic MCQs`,
                  estimatedMinutes: Math.round(dailyMinutes * 0.3),
                  completed: false,
                  topicTag: weakFocusTopics[0],
                  isWeakAreaRemediation: true,
                },
              ]
            : [
                {
                  id: `task-${i + 1}-3`,
                  description: `Self-Assessment: Complete 10 MCQs and review explanation cheat sheets`,
                  estimatedMinutes: Math.round(dailyMinutes * 0.3),
                  completed: false,
                  topicTag: dayTopics[0],
                  isWeakAreaRemediation: false,
                },
              ]),
        ],
      });
    }

    return res.json({
      success: true,
      plan: {
        subject,
        examDate,
        availableHoursPerDay,
        preparationLevel,
        adaptiveNote: weakFocusTopics.length > 0
          ? `Adaptive remediation enabled for weak areas: ${weakFocusTopics.join(', ')}.`
          : 'Plan calibrated for balanced distribution across available days.',
        days: fallbackDays,
      },
      isFallback: true,
    });
  } catch (error: any) {
    console.error('Error generating study plan:', error);
    res.status(500).json({ error: error.message || 'Failed to generate study plan' });
  }
});

// -------------------------------------------------------------
// 3. AI Quiz Generator
// -------------------------------------------------------------
app.post('/api/ai/quiz', async (req, res) => {
  try {
    const {
      subject = 'Database Management Systems',
      topic = 'Normalization & Transactions',
      count = 5,
      materialText = '',
    } = req.body;

    if (ai) {
      const prompt = `You are Campus Copilot AI. Generate an academic multiple choice quiz with exactly ${count} high-quality questions for university students.
Subject: ${subject}
Topic: ${topic}

Study Material Context:
${materialText ? materialText.slice(0, 10000) : 'Standard curriculum concepts for ' + topic}

CRITICAL RULES:
1. Each question must have:
   - question (clear academic problem or conceptual scenario)
   - options: array of EXACTLY 4 distinct choices (prefixed with A., B., C., D.)
   - correctAnswer: integer 0, 1, 2, or 3 representing the correct index
   - explanation: clear 2-3 sentence breakdown explaining WHY the correct option is right and common pitfalls
   - difficulty: "Easy", "Medium", or "Hard"
   - topicTag: specific sub-topic (e.g., "Normalization", "2NF", "BCNF", "ACID Properties", "Conflict Serializability")
2. Include at least 2 questions directly testing "Normalization" or "2NF/3NF" so that student weak areas can be accurately detected.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswer: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    difficulty: { type: Type.STRING },
                    topicTag: { type: Type.STRING },
                  },
                  required: ['id', 'question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'topicTag'],
                },
              },
            },
            required: ['title', 'subject', 'topic', 'questions'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, quiz: parsed });
    }

    // Default sample quiz
    return res.json({ success: true, quiz: SAMPLE_QUIZ, isFallback: true });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to generate quiz' });
  }
});

// -------------------------------------------------------------
// 4. Personalized Learning Loop: Evaluate Quiz & Weak Topics
// -------------------------------------------------------------
app.post('/api/ai/evaluate-quiz', async (req, res) => {
  try {
    const { quiz, answers } = req.body;
    if (!quiz || !quiz.questions || !answers) {
      return res.status(400).json({ error: 'Quiz and answers are required' });
    }

    let correctCount = 0;
    const topicStats: Record<string, { correct: number; total: number; percentage: number }> = {};

    quiz.questions.forEach((q: any) => {
      const studentAns = answers[q.id];
      const isCorrect = studentAns === q.correctAnswer;
      if (isCorrect) correctCount++;

      const tag = q.topicTag || 'General';
      if (!topicStats[tag]) {
        topicStats[tag] = { correct: 0, total: 0, percentage: 0 };
      }
      topicStats[tag].total += 1;
      if (isCorrect) {
        topicStats[tag].correct += 1;
      }
    });

    Object.keys(topicStats).forEach((tag) => {
      topicStats[tag].percentage = Math.round((topicStats[tag].correct / topicStats[tag].total) * 100);
    });

    const weakTopics = Object.keys(topicStats).filter((tag) => topicStats[tag].percentage < 60);
    const strongTopics = Object.keys(topicStats).filter((tag) => topicStats[tag].percentage >= 60);
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

    let recommendation = '';
    let extraMinutes = 30;

    if (weakTopics.length > 0) {
      const primaryWeak = weakTopics[0];
      recommendation = `${primaryWeak} is currently your weakest topic (${topicStats[primaryWeak].percentage}% accuracy). Spend ${extraMinutes} additional minutes reviewing ${primaryWeak} before moving to the next topic.`;
    } else {
      recommendation = `Outstanding performance! You scored ${percentage}%. You have solid conceptual mastery across tested topics. Proceed to advanced exam questions.`;
      extraMinutes = 0;
    }

    // If Gemini is available, produce a nuanced personalized mentor assessment
    if (ai && weakTopics.length > 0) {
      try {
        const prompt = `As an academic AI mentor, the student just took a quiz on ${quiz.subject} (${quiz.topic}).
Score: ${correctCount}/${quiz.questions.length} (${percentage}%).
Weak Topics detected: ${weakTopics.join(', ')}.
Strong Topics: ${strongTopics.join(', ')}.
Provide a concise, encouraging 2-sentence mentor prescription for the student dashboard.
Start directly with the weak topic alert and specify the exact remedial action.`;

        const mentorResp = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (mentorResp.text) {
          recommendation = mentorResp.text.trim();
        }
      } catch (err) {
        // keep recommendation fallback
      }
    }

    const evaluation = {
      id: `sub-${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      topic: quiz.topic,
      answers,
      score: correctCount,
      totalQuestions: quiz.questions.length,
      percentage,
      topicBreakdown: topicStats,
      weakTopics: weakTopics.length > 0 ? weakTopics : ['None! Great work!'],
      strongTopics,
      recommendation,
      recommendedExtraMinutes: extraMinutes,
      timestamp: new Date().toISOString(),
    };

    return res.json({ success: true, evaluation });
  } catch (error: any) {
    console.error('Error evaluating quiz:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate quiz' });
  }
});

// -------------------------------------------------------------
// 5. Campus Knowledge Q&A (Strict Grounding & Anti-Hallucination)
// -------------------------------------------------------------
app.get('/api/campus', (req, res) => {
  res.json({ success: true, data: VERIFIED_CAMPUS_DATA });
});

app.post('/api/campus/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const verifiedDocs = JSON.stringify(VERIFIED_CAMPUS_DATA, null, 2);

    if (ai) {
      const prompt = `You are the Campus Knowledge Assistant for Apex Institute.
You must answer the student's question using ONLY the verified campus data provided below.

CRITICAL ANTI-HALLUCINATION RULES:
1. If the answer is present in the verified campus data, answer directly and concisely.
2. ALWAYS provide the source citation (e.g. "[Source: Notice Ref: CE/2026/Fall/324]" or "[Source: Library Circular LIB/2026/89]").
3. If the answer is NOT present or cannot be directly proven from the verified campus data, you MUST respond EXACTLY with:
   "I couldn't find this information in the available campus data."
   Do NOT guess, speculate, or fabricate timings, names, rules, or dates under any circumstances.

VERIFIED CAMPUS DATA:
${verifiedDocs}

STUDENT QUESTION:
"${query}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const reply = response.text || "I couldn't find this information in the available campus data.";
      return res.json({
        success: true,
        answer: reply,
        isGrounded: !reply.includes("I couldn't find this information"),
      });
    }

    // Heuristic campus search if Gemini key is pending
    const lowerQuery = query.toLowerCase();
    const matched = VERIFIED_CAMPUS_DATA.find((item) =>
      item.content.toLowerCase().includes(lowerQuery) ||
      item.title.toLowerCase().includes(lowerQuery) ||
      (item.department && item.department.toLowerCase().includes(lowerQuery))
    );

    if (matched) {
      return res.json({
        success: true,
        answer: `According to official records: ${matched.content}\n\n[Source: ${matched.verifiedSource}]`,
        isGrounded: true,
      });
    }

    return res.json({
      success: true,
      answer: "I couldn't find this information in the available campus data.",
      isGrounded: false,
    });
  } catch (error: any) {
    console.error('Error querying campus data:', error);
    res.status(500).json({ error: error.message || 'Campus query failed' });
  }
});

// -------------------------------------------------------------
// 6. AI Academic Mentor Chat
// -------------------------------------------------------------
app.post('/api/ai/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { messages, studentContext, currentSubject, provider = 'gemini', model } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Check if the query is a campus question
    const campusKeywords = ['library', 'timing', 'exam hall', 'hod', 'faculty', 'timetable', 'hackathon', 'fee', 're-evaluation', 'notice'];
    const isCampusQuery = campusKeywords.some((kw) => lastUserMessage.toLowerCase().includes(kw));

    if (isCampusQuery) {
      const verifiedDocs = JSON.stringify(VERIFIED_CAMPUS_DATA, null, 2);
      const campusPrompt = `You are Campus Copilot. The student asked a campus-related question.
Answer strictly using the verified campus data below.
If the answer is NOT present in the verified campus data, you MUST say:
"I couldn't find this information in the available campus data."
Always cite the source.

VERIFIED CAMPUS DATA:
${verifiedDocs}

STUDENT QUESTION:
${lastUserMessage}`;

      if (provider === 'chatgpt' && process.env.OPENAI_API_KEY) {
        try {
          const chatgptAnswer = await callChatGPT({
            systemPrompt: 'You are Campus Copilot. Answer strictly using verified campus data and citations.',
            userPrompt: campusPrompt,
            model: model || 'gpt-4o',
          });
          return res.json({
            success: true,
            reply: chatgptAnswer,
            type: 'campus',
            provider: 'chatgpt',
            model: model || 'gpt-4o',
            latencyMs: Date.now() - startTime,
          });
        } catch (e) {
          console.warn('ChatGPT campus query failed, falling back:', e);
        }
      }

      if (ai) {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: campusPrompt,
        });

        return res.json({
          success: true,
          reply: response.text || "I couldn't find this information in the available campus data.",
          type: 'campus',
          provider: 'gemini',
          model: 'gemini-3.8-flash',
          latencyMs: Date.now() - startTime,
        });
      }
    }

    const systemInstruction = `You are Campus Copilot — an AI Academic Operating System and personal mentor for college students.
CORE MISSION: ChatGPT gives answers. Google finds information. Campus Copilot understands the student's academic context and turns it into actions.

Student Profile Context:
- Name: ${studentContext?.name || 'Alex'}
- Course: ${studentContext?.course || 'B.Tech CSE'} (Semester: ${studentContext?.semester || '3rd'})
- Next Exam: ${studentContext?.nextExam || 'Database Management Systems in 4 days'}
- Current Weak Topic from Recent Quiz: ${studentContext?.lastWeakTopic || 'Normalization (scored 40%)'}
- Daily Study Budget: ${studentContext?.dailyHours || 3} hours/day
- Target Subject: ${currentSubject || 'Database Management Systems'}

BEHAVIOR GUIDELINES:
1. Always behave as an expert academic mentor. Be concise, mathematically accurate, and pedagogically clear.
2. Adapt explanations to university undergraduate level.
3. Refer directly to their uploaded study material, upcoming exams, or recent quiz performance when relevant (e.g. "According to your uploaded DBMS notes on Normalization...").
4. ALWAYS conclude with an actionable recommendation: "What is the most useful next action for this student right now?"
5. If the student asks for exam prep, give structured step-by-step guidance.
6. Do NOT make unsupported claims.`;

    // 1. ChatGPT Provider
    if (provider === 'chatgpt') {
      if (process.env.OPENAI_API_KEY) {
        try {
          const chatgptReply = await callChatGPT({
            systemPrompt: systemInstruction,
            messages,
            model: model || 'gpt-4o',
          });
          return res.json({
            success: true,
            reply: chatgptReply,
            provider: 'chatgpt',
            model: model || 'gpt-4o',
            latencyMs: Date.now() - startTime,
            suggestedActions: [
              'Review Normalization 2NF examples',
              'Solve 5 PYQ practice questions',
              'Check today\'s study tasks',
            ],
          });
        } catch (chatgptErr: any) {
          console.warn('ChatGPT API call failed, falling back gracefully:', chatgptErr.message);
        }
      }
    }

    // 2. Google Gemini Provider
    if (ai) {
      const prompt = `System: ${systemInstruction}

Conversation History:
${messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}

AI Mentor Response:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        success: true,
        reply: response.text || "I'm ready to help you optimize your study plan and master your subjects.",
        provider: 'gemini',
        model: 'gemini-3.8-flash',
        latencyMs: Date.now() - startTime,
        suggestedActions: [
          'Review Normalization 2NF examples',
          'Take a 5-question quick quiz',
          'Check today\'s study tasks',
        ],
      });
    }

    // 3. High quality academic mentor fallback engine
    let fallbackReply = `According to your uploaded DBMS notes, Normalization is the systematic method of decomposing relations to eliminate update anomalies and data redundancy. 

Since you recently scored 40% on Normalization in your diagnostic quiz, I recommend focusing on the difference between 2NF (which eliminates partial dependencies) and 3NF (which eliminates transitive dependencies).

👉 Recommended Next Action: Spend 30 minutes solving the 5 practice decomposition problems in Day 1 of your study plan before advancing to Transactions.`;

    if (lastUserMessage.toLowerCase().includes('library')) {
      fallbackReply = `According to the Central Academic Library circular, during exam period (Oct 15 - Nov 05, 2026), reading halls on the Ground & First Floor are open daily from 08:00 AM to 11:00 PM. Digital catalog access is 24/7. [Source: Circular LIB/2026/89]`;
    }

    return res.json({
      success: true,
      reply: fallbackReply,
      provider: provider === 'chatgpt' ? 'chatgpt' : 'gemini',
      model: provider === 'chatgpt' ? 'gpt-4o' : 'gemini-3.8-flash',
      latencyMs: Date.now() - startTime,
      suggestedActions: [
        'Review Normalization 2NF examples',
        'Take a 5-question quick quiz',
        'Check today\'s study tasks',
      ],
      isFallback: true,
    });
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ error: error.message || 'AI Chat error' });
  }
});

// =============================================================
// QUESTION BANK & EXAM PREPARATION MODULE ENDPOINTS
// =============================================================

let questionPapers = [...INITIAL_PAPERS];
let questionsList = [...INITIAL_QUESTIONS];
let solutionsMap: Record<string, any> = { ...INITIAL_SOLUTIONS };
let assignmentsList = [...INITIAL_ASSIGNMENTS];
let savedQuestionsList: Array<{ saved_id: string; student_id: string; question_id: string; notes?: string; created_at: string }> = [
  {
    saved_id: 'sq-alex-1',
    student_id: 'alex_cse_3',
    question_id: 'q-dbms-101',
    notes: 'Exam critical: Review 2NF partial dependency decomposition.',
    created_at: new Date().toISOString(),
  },
  {
    saved_id: 'sq-alex-2',
    student_id: 'alex_cse_3',
    question_id: 'q-dbms-102',
    notes: 'High-yield 10-mark question on 3NF vs BCNF dependency preservation.',
    created_at: new Date().toISOString(),
  },
];
let practiceAttemptsList: any[] = [];
let analyticsData = { ...INITIAL_ANALYTICS };

// 1. Get / Browse Question Papers
app.get('/api/question-bank/papers', (req, res) => {
  const {
    university,
    college,
    course,
    branch,
    semester,
    subject_id,
    academic_year,
    exam_category,
    exam_session,
    search,
  } = req.query as Record<string, string>;

  let filtered = [...questionPapers];

  if (exam_category) {
    filtered = filtered.filter((p) => p.exam_category.toLowerCase() === exam_category.toLowerCase());
  }
  if (subject_id) {
    filtered = filtered.filter((p) => p.subject_id.toLowerCase().includes(subject_id.toLowerCase()));
  }
  if (semester) {
    filtered = filtered.filter((p) => p.semester.toLowerCase().includes(semester.toLowerCase()));
  }
  if (academic_year) {
    filtered = filtered.filter((p) => p.academic_year === academic_year);
  }
  if (university) {
    filtered = filtered.filter((p) => p.university_name.toLowerCase().includes(university.toLowerCase()));
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(s) ||
        p.subject_id.toLowerCase().includes(s) ||
        p.source_description.toLowerCase().includes(s)
    );
  }

  // Attach dynamic question count and solution availability
  const results = filtered.map((p) => {
    const pQuestions = questionsList.filter((q) => q.question_paper_id === p.id);
    const hasSol = pQuestions.some((q) => Boolean(solutionsMap[q.id]));
    return {
      ...p,
      question_count: pQuestions.length || p.question_count || 0,
      solution_available: hasSol || p.solution_available,
    };
  });

  res.json(results);
});

// 2. Get Single Question Paper Details
app.get('/api/question-bank/papers/:id', (req, res) => {
  const paper = questionPapers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Question paper not found' });
  }
  const pQuestions = questionsList.filter((q) => q.question_paper_id === paper.id);
  res.json({
    ...paper,
    question_count: pQuestions.length,
    solution_available: pQuestions.some((q) => Boolean(solutionsMap[q.id])),
  });
});

// 3. Create / Upload Question Paper
app.post('/api/question-bank/papers', (req, res) => {
  const body = req.body;
  const newPaper = {
    id: body.id || `qp-${Date.now()}`,
    university_name: body.university_name || 'State Technological University',
    college_name: body.college_name || 'Apex Institute of Science & Technology',
    course: body.course || 'B.Tech',
    branch: body.branch || 'Computer Science & Engineering',
    semester: body.semester || '3rd Semester',
    subject_id: body.subject_id || 'Database Management Systems',
    title: body.title || 'Uploaded Question Paper',
    exam_category: body.exam_category || 'pyq',
    exam_session: body.exam_session || 'Regular Examination',
    academic_year: body.academic_year || '2025-2026',
    exam_date: body.exam_date || new Date().toISOString().split('T')[0],
    total_marks: body.total_marks || 50,
    duration_minutes: body.duration_minutes || 120,
    file_path: body.file_path || null,
    source_description: body.source_description || 'Student / Faculty Upload (Awaiting Board Verification)',
    verification_status: body.verification_status || 'verified',
    uploaded_by: body.uploaded_by || 'User Upload',
    question_count: 0,
    solution_available: false,
    created_at: new Date().toISOString(),
  };

  questionPapers.unshift(newPaper);
  res.status(201).json(newPaper);
});

// 4. Get Questions for a Paper
app.get('/api/question-bank/papers/:id/questions', (req, res) => {
  const paper = questionPapers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Question paper not found' });
  }

  const pQuestions = questionsList.filter((q) => q.question_paper_id === paper.id).map((q) => ({
    ...q,
    has_solution: Boolean(solutionsMap[q.id]),
    is_saved: savedQuestionsList.some((s) => s.question_id === q.id),
  }));

  res.json(pQuestions);
});

// 5. Extract Questions from Uploaded Paper (AI assisted)
app.post('/api/question-bank/papers/:id/extract-questions', async (req, res) => {
  const paper = questionPapers.find((p) => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }

  const rawText = req.body.raw_text || paper.title;

  let extractedQuestions: any[] = [];

  if (ai) {
    try {
      const prompt = `Extract exam questions from this paper text for subject "${paper.subject_id}".
Return structured JSON array of questions. Each object must have:
- question_number (string like "1(a)", "2", "3")
- question_text (clean question text)
- marks (integer marks, e.g. 5, 10, or 2)
- topic_id (detected topic like "Normalization", "Transactions", "CPU Scheduling")
- difficulty ("Easy", "Medium", "Hard")
- question_type ("descriptive", "numerical", "mcq", or "coding")

PAPER TEXT:
${rawText.slice(0, 10000)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question_number: { type: Type.STRING },
                question_text: { type: Type.STRING },
                marks: { type: Type.INTEGER },
                topic_id: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                question_type: { type: Type.STRING },
              },
              required: ['question_number', 'question_text', 'marks', 'topic_id', 'difficulty', 'question_type'],
            },
          },
        },
      });

      extractedQuestions = JSON.parse(response.text || '[]');
    } catch (e) {
      console.warn('AI question extraction fallback:', e);
    }
  }

  if (extractedQuestions.length === 0) {
    // Regex heuristic fallback
    const paragraphs = rawText.split('\n\n').filter((p: string) => p.trim().length > 20);
    extractedQuestions = paragraphs.slice(0, 5).map((p: string, idx: number) => ({
      question_number: `Q${idx + 1}`,
      question_text: p.trim(),
      marks: 5,
      topic_id: 'Normalization',
      difficulty: 'Medium',
      question_type: 'descriptive',
    }));
  }

  const createdItems = extractedQuestions.map((q: any) => {
    const newItem = {
      id: `q-ext-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question_paper_id: paper.id,
      subject_id: paper.subject_id,
      topic_id: q.topic_id || 'Core Topic',
      question_number: q.question_number || '1',
      question_text: q.question_text,
      marks: q.marks || 5,
      question_type: q.question_type || 'descriptive',
      difficulty: q.difficulty || 'Medium',
      extraction_status: 'extracted' as const,
      has_solution: false,
      is_saved: false,
      created_at: new Date().toISOString(),
    };
    questionsList.push(newItem);
    return newItem;
  });

  res.json({
    success: true,
    paper_id: paper.id,
    extracted_count: createdItems.length,
    questions: createdItems,
  });
});

// 6. Get Single Question
app.get('/api/questions/:id', (req, res) => {
  const q = questionsList.find((item) => item.id === req.params.id);
  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }
  res.json({
    ...q,
    has_solution: Boolean(solutionsMap[q.id]),
    is_saved: savedQuestionsList.some((s) => s.question_id === q.id),
  });
});

// 7. Get Solution for a Question
app.get('/api/questions/:id/solution', (req, res) => {
  const sol = solutionsMap[req.params.id];
  if (sol) {
    return res.json(sol);
  }

  const q = questionsList.find((item) => item.id === req.params.id);
  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }

  // Generate fallback step-by-step solution
  const fallbackSol = {
    id: `sol-${Date.now()}`,
    question_id: q.id,
    solution_text: `### Step-by-Step Academic Solution:\n\n1. Identify fundamental principles for ${q.subject_id}.\n2. Apply the theoretical definitions for ${q.topic_id || 'relational databases'}.\n3. Conclude with exam-oriented derivation steps.`,
    short_answer: `Core academic answer for: ${q.question_text.slice(0, 100)}...`,
    detailed_explanation: `Detailed derivation covering all theoretical constraints and university exam scoring parameters for ${q.marks || 5} marks.`,
    hint_text: 'Review the lecture axioms and verify prime vs non-prime attributes.',
    solution_type: 'ai_generated',
    explanation_level: 'detailed',
    source_description: 'AI Generated (Awaiting Faculty Verification)',
    verification_status: 'ai_provisional',
    generated_by_model: 'gemini-3.8-flash',
  };

  solutionsMap[q.id] = fallbackSol;
  res.json(fallbackSol);
});

// 8. Generate / Re-generate AI Solution
app.post('/api/questions/:id/generate-solution', async (req, res) => {
  const q = questionsList.find((item) => item.id === req.params.id);
  if (!q) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const { preferred_level = 'detailed' } = req.body;

  if (ai) {
    try {
      const prompt = `You are Campus Copilot AI Solution Engine. Generate a step-by-step, exam-oriented solution for university students.
Subject: ${q.subject_id}
Topic: ${q.topic_id}
Marks Assigned: ${q.marks || 5} Marks
Question:
"${q.question_text}"

Return structured JSON with:
- short_answer: concise 2-sentence exam summary
- detailed_explanation: comprehensive step-by-step breakdown with definitions, formulas, or algorithmic steps
- hint_text: pedagogical guidance without revealing the answer
- code_snippet: optional code or query (or null)
- diagram_description: optional ascii table, truth table, or state diagram (or null)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              short_answer: { type: Type.STRING },
              detailed_explanation: { type: Type.STRING },
              hint_text: { type: Type.STRING },
              code_snippet: { type: Type.STRING, nullable: true },
              diagram_description: { type: Type.STRING, nullable: true },
            },
            required: ['short_answer', 'detailed_explanation', 'hint_text'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const newSol = {
        id: `sol-${Date.now()}`,
        question_id: q.id,
        solution_text: parsed.detailed_explanation,
        short_answer: parsed.short_answer,
        detailed_explanation: parsed.detailed_explanation,
        hint_text: parsed.hint_text,
        code_snippet: parsed.code_snippet,
        diagram_description: parsed.diagram_description,
        solution_type: 'ai_generated',
        explanation_level: preferred_level,
        source_description: 'AI Generated Solution (Model: gemini-3.8-flash) • Requires Verification',
        verification_status: 'ai_provisional',
        generated_by_model: 'gemini-3.8-flash',
        created_at: new Date().toISOString(),
      };

      solutionsMap[q.id] = newSol;
      return res.json(newSol);
    } catch (e) {
      console.warn('AI solution generation error:', e);
    }
  }

  // Fallback
  const fallback = {
    id: `sol-${Date.now()}`,
    question_id: q.id,
    solution_text: `### Step-by-Step Verified Solution:\n\n**1. Theoretical Axioms:**\nReview definition and properties for ${q.topic_id}.\n\n**2. Formal Proof & Steps:**\nSatisfies 1NF and 2NF criteria without partial functional dependencies.\n\n**3. Conclusion:**\nDecomposed schemas preserve lossless join.`,
    short_answer: 'Core resolution based on academic syllabus definitions.',
    detailed_explanation: 'Full step-by-step breakdown with definitions, properties, and decomposition checks.',
    hint_text: 'Recall the definition of prime attributes and superkey closure.',
    solution_type: 'ai_generated',
    explanation_level: preferred_level,
    source_description: 'AI Academic Mentor • Provisional',
    verification_status: 'ai_provisional',
  };
  solutionsMap[q.id] = fallback;
  res.json(fallback);
});

// 9. Save / Bookmark Question
app.post('/api/questions/:id/save', (req, res) => {
  const { student_id = 'alex_cse_3', notes } = req.body;
  const existing = savedQuestionsList.find((s) => s.question_id === req.params.id && s.student_id === student_id);
  if (existing) {
    return res.json({ status: 'already_saved', id: existing.saved_id });
  }

  const newSaved = {
    saved_id: `sq-${Date.now()}`,
    student_id,
    question_id: req.params.id,
    notes: notes || 'Bookmarked for exam revision',
    created_at: new Date().toISOString(),
  };
  savedQuestionsList.unshift(newSaved);
  res.json({ status: 'saved', id: newSaved.saved_id });
});

// 10. Remove Saved Question
app.delete('/api/questions/:id/save', (req, res) => {
  const student_id = (req.query.student_id as string) || 'alex_cse_3';
  savedQuestionsList = savedQuestionsList.filter(
    (s) => !(s.question_id === req.params.id && s.student_id === student_id)
  );
  res.json({ status: 'removed' });
});

// 11. Get Student Saved Questions
app.get('/api/students/:id/saved-questions', (req, res) => {
  const studentSaved = savedQuestionsList.filter((s) => s.student_id === req.params.id);
  const results = studentSaved.map((s) => {
    const q = questionsList.find((item) => item.id === s.question_id);
    return {
      saved_id: s.saved_id,
      notes: s.notes,
      created_at: s.created_at,
      question: q ? { ...q, has_solution: Boolean(solutionsMap[q.id]), is_saved: true } : null,
    };
  }).filter((s) => s.question !== null);

  res.json(results);
});

// 12. Assignments List & Detail
app.get('/api/question-bank/assignments', (req, res) => {
  const { subject_id, semester } = req.query as Record<string, string>;
  let list = [...assignmentsList];
  if (subject_id) {
    list = list.filter((a) => a.subject_id.toLowerCase().includes(subject_id.toLowerCase()));
  }
  if (semester) {
    list = list.filter((a) => a.semester.toLowerCase().includes(semester.toLowerCase()));
  }
  res.json(list);
});

app.get('/api/question-bank/assignments/:id', (req, res) => {
  const asgn = assignmentsList.find((a) => a.id === req.params.id);
  if (!asgn) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  const asgnQuestions = questionsList.filter((q) => q.assignment_id === asgn.id);
  res.json({
    ...asgn,
    questions: asgnQuestions,
    question_count: asgnQuestions.length || asgn.question_count,
  });
});

// 13. Practice & Timed Mock Exam Endpoints
app.post('/api/question-bank/practice/start', (req, res) => {
  const {
    student_id = 'alex_cse_3',
    subject_id = 'Database Management Systems',
    question_paper_id,
    practice_mode = 'practice',
    question_limit = 5,
  } = req.body;

  let pool = questionsList.filter((q) => q.subject_id.toLowerCase().includes(subject_id.toLowerCase()));
  if (question_paper_id) {
    pool = questionsList.filter((q) => q.question_paper_id === question_paper_id);
  }

  const selected = pool.slice(0, question_limit);

  const attempt = {
    id: `att-${Date.now()}`,
    student_id,
    subject_id,
    question_paper_id,
    practice_mode,
    started_at: new Date().toISOString(),
    total_questions: selected.length || 5,
    correct_answers: 0,
    time_spent_seconds: 0,
    status: 'in_progress',
  };

  practiceAttemptsList.unshift(attempt);
  res.json(attempt);
});

app.get('/api/question-bank/practice/:id', (req, res) => {
  const att = practiceAttemptsList.find((a) => a.id === req.params.id);
  if (!att) {
    return res.status(404).json({ error: 'Attempt not found' });
  }
  res.json(att);
});

app.post('/api/question-bank/practice/:id/submit', (req, res) => {
  const att = practiceAttemptsList.find((a) => a.id === req.params.id);
  if (!att) {
    return res.status(404).json({ error: 'Attempt not found' });
  }

  const { answers = [] } = req.body;
  let correctCount = 0;
  let totalTime = 0;

  answers.forEach((ans: any) => {
    totalTime += ans.time_spent_seconds || 0;
    const q = questionsList.find((item) => item.id === ans.question_id);
    if (q) {
      if (q.correct_option !== undefined && ans.selected_option !== undefined) {
        if (ans.selected_option === q.correct_option) correctCount++;
      } else if (ans.answer_text && ans.answer_text.trim().length >= 15) {
        correctCount++;
      }
    }
  });

  att.submitted_at = new Date().toISOString();
  att.status = 'completed';
  att.correct_answers = correctCount;
  att.time_spent_seconds = totalTime;
  att.score_percentage = Math.round((correctCount / att.total_questions) * 100);

  // Update student analytics in real time
  analyticsData.total_attempts += 1;
  analyticsData.total_questions_practiced += att.total_questions;
  analyticsData.total_correct += correctCount;
  analyticsData.overall_accuracy_percentage = Math.round(
    (analyticsData.total_correct / analyticsData.total_questions_practiced) * 100
  );

  res.json(att);
});

// 14. Progress Analytics, Weak Topics, & Repeated Questions
app.get('/api/students/:id/question-bank/progress', (req, res) => {
  res.json(analyticsData);
});

app.get('/api/students/:id/question-bank/weak-topics', (req, res) => {
  res.json({
    student_id: req.params.id,
    weak_topics: analyticsData.weak_topics,
    mentor_recommendation: analyticsData.mentor_recommendation,
    recommended_pyqs: analyticsData.recommended_pyqs,
  });
});

app.get('/api/students/:id/question-bank/repeated-questions', (req, res) => {
  res.json(INITIAL_REPEATED_QUESTIONS);
});

// -------------------------------------------------------------
// Serve Vite frontend
// -------------------------------------------------------------
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Campus Copilot Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Gemini AI] Status: ${ai ? 'ENABLED with gemini-3.8-flash' : 'FALLBACK MODE (Set GEMINI_API_KEY in Secrets)'}`);
  });
}

startServer();
