"""Service for extracting, parsing, and classifying questions from papers or raw text."""

import re
import uuid
from typing import List, Dict, Any


class QuestionExtractionService:
    @staticmethod
    def extract_questions_from_text(raw_text: str, subject_id: str = "DBMS") -> List[Dict[str, Any]]:
        """Extract individual questions, marks, and topic classifications from paper text.
        
        Uses regex heuristics for numbered items (Q1, 1(a), (b), Section A, etc.) and
        marks patterns ([5 Marks], (10 marks), [CO2], etc.).
        """
        if not raw_text or not raw_text.strip():
            return []

        # Split into blocks by question prefixes
        pattern = r'(?:^|\n)\s*(?:Q\.?\s*(\d+[a-z]?|\d+)|(?:Question\s*(\d+[a-z]?|\d+))|(\d+\s*[\.\)]))\s*'
        matches = list(re.finditer(pattern, raw_text, re.IGNORECASE))

        questions = []
        if not matches:
            # Fallback to paragraph splitting if no standard numbered format
            paragraphs = [p.strip() for p in raw_text.split("\n\n") if len(p.strip()) > 30]
            for idx, p in enumerate(paragraphs[:10], start=1):
                marks_match = re.search(r'\[?\(?(\d+)\s*(?:marks?|pts?|m)\)?\]?', p, re.IGNORECASE)
                marks = int(marks_match.group(1)) if marks_match else 5
                topic = QuestionExtractionService._detect_topic(p, subject_id)
                questions.append({
                    "id": f"q-ext-{uuid.uuid4().hex[:8]}",
                    "question_number": str(idx),
                    "question_text": p,
                    "marks": marks,
                    "topic_id": topic,
                    "subject_id": subject_id,
                    "question_type": "descriptive",
                    "difficulty": "Medium",
                    "extraction_status": "extracted"
                })
            return questions

        for i, match in enumerate(matches):
            q_num = match.group(1) or match.group(2) or match.group(3)
            q_num = q_num.replace(".", "").replace(")", "").strip() if q_num else str(i + 1)

            start_pos = match.end()
            end_pos = matches[i + 1].start() if i + 1 < len(matches) else len(raw_text)
            q_body = raw_text[start_pos:end_pos].strip()

            if len(q_body) < 10:
                continue

            marks_match = re.search(r'\[?\(?(\d+)\s*(?:marks?|pts?|m)\)?\]?', q_body, re.IGNORECASE)
            marks = int(marks_match.group(1)) if marks_match else (10 if "explain" in q_body.lower() else 5)
            clean_text = re.sub(r'\[?\(?\d+\s*(?:marks?|pts?|m)\)?\]?', '', q_body, flags=re.IGNORECASE).strip()

            topic = QuestionExtractionService._detect_topic(clean_text, subject_id)
            difficulty = "Hard" if marks >= 10 or "prove" in clean_text.lower() else ("Easy" if marks <= 2 else "Medium")

            questions.append({
                "id": f"q-ext-{uuid.uuid4().hex[:8]}",
                "question_number": q_num,
                "question_text": clean_text,
                "marks": marks,
                "topic_id": topic,
                "subject_id": subject_id,
                "question_type": "numerical" if any(k in clean_text.lower() for k in ["calculate", "solve", "evaluate"]) else "descriptive",
                "difficulty": difficulty,
                "extraction_status": "extracted"
            })

        return questions

    @staticmethod
    def _detect_topic(text: str, subject_id: str) -> str:
        """Detect topic based on keyword frequency."""
        lower = text.lower()
        if "normalization" in lower or "normal form" in lower or "bcnf" in lower or "3nf" in lower:
            return "Normalization"
        if "transaction" in lower or "acid" in lower or "serializ" in lower:
            return "Transactions & Concurrency"
        if "functional dependency" in lower or "closure" in lower or "armstrong" in lower:
            return "Functional Dependencies"
        if "sql" in lower or "query" in lower or "join" in lower:
            return "Relational Algebra & SQL"
        if "indexing" in lower or "b-tree" in lower or "b+ tree" in lower or "hashing" in lower:
            return "Indexing & Storage"
        if "process" in lower or "scheduling" in lower or "deadlock" in lower:
            return "Process Scheduling & Deadlocks"
        if "tree" in lower or "graph" in lower or "dijkstra" in lower:
            return "Trees & Graphs"
        return "Core Concepts"
