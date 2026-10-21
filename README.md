<<<<<<< HEAD
# 🎓 CAMPUS COPILOT — Your AI Academic Operating System

> **"ChatGPT answers questions. Google finds information. Campus Copilot turns your academic life into an actionable plan."**
> 
> *Your syllabus, study material, exams, and progress — connected by AI.*

---

## 🚀 Hackathon 2-Minute Demo Scenario

To experience the complete **Personalized Learning Loop** in under 2 minutes:
1. Click the glowing **⚡ 2-Min Demo Flow** button in the header.
2. View **Alex** (B.Tech CSE, 3rd Sem) with the upcoming **DBMS Exam** in 4 days.
3. Inspect the uploaded DBMS Unit 3 notes (**Normalization & Transactions**). Notice the detected topics (1NF, 2NF, 3NF, BCNF) and difficulty rating (7.8/10).
4. View the **AI Study Plan** distributed across 4 days according to available study time (3 hrs/day).
5. Switch to **Quizzes** and take the diagnostic test or click **⚡ Demo Submit (Score 40%)**.
6. Observe the **Personalized Learning Loop**:
   - AI flags: *"Normalization is currently your weakest topic (40% score)."*
   - AI recommends: *"Spend 30 additional minutes reviewing Normalization before moving to the next topic."*
   - The active study plan automatically updates with an adaptive **[AI Remediation Task]** injected into Day 1.
7. Visit **Campus Knowledge** to ask about the verified Central Library extended exam hours (open until 11 PM), noticing the strict anti-hallucination guardrails and citations.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti.
- **Backend:** Node.js Express server (`server.ts`) with TSX.
- **AI Reasoning:** Google Gemini API (`@google/genai` SDK using `gemini-3.8-flash`) via secure server-side proxy routes with JSON Schemas.
- **Data Persistence:** React State Store with LocalStorage synchronization + Firebase Firestore ready models.

---

## 📋 Features Checklist

- [x] **Student Profile:** Alex, B.Tech CSE, 3rd Sem, 3 hrs/day budget, target GPA, exam schedules.
- [x] **Syllabus / Notes Upload:** PDF and text parser, topic detector, yield estimation, and difficulty rating.
- [x] **AI Study Plan Generator:** Day-by-day task lists, time budgets, and weak-area prioritization.
- [x] **AI Quiz Generator:** High-yield MCQs with 4 options, explanations, and topic tagging.
- [x] **Personalized Learning Loop:** `Study Material → Plan → Quiz → Score → Weakness Detection → Updated Plan`.
- [x] **Campus Knowledge:** Verified college directory (timetables, library hours, HOD details) with strict anti-hallucination refusal for unknown queries.
- [x] **AI Academic Mentor Chat:** Context-aware assistant grounded in student syllabus and exam deadlines.
- [x] **Progress Tracking:** Topic mastery, study hours vs weekly target, and streak tracking.
- [x] **Demo Mode & Walkthrough:** Preloaded realistic data and 12-step guided interactive modal.

---

## 💻 Local Setup Instructions

```bash
# 1. Clone or navigate to the directory
cd campus-copilot

# 2. Install dependencies
npm install

# 3. Configure your Gemini API key in .env
echo 'GEMINI_API_KEY="YOUR_GEMINI_API_KEY"' > .env
echo 'PORT=3000' >> .env

# 4. Start the full-stack development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## 🔥 Firebase Setup Instructions (Optional Production Sync)

To configure Firebase Authentication and persistent Firestore database:
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com).
2. Enable **Firestore Database** in test/production mode.
3. Enable **Authentication** (Google Sign-In and Email/Password).
4. Add your Firebase web configuration to environment variables.
5. Deploy Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /campusKnowledge/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🚢 Production Build & Deploy

```bash
# Build frontend bundle
npm run build

# Start the Node.js production server
npm start
```
=======
# CAMPUS_COPILOT
>>>>>>> ef2bb10a8beeb439c3975f7891b6b4ea27ebaf50
