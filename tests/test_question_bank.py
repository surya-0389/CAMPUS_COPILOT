"""Automated test suite for Question Bank paper filtering and question extraction."""

import unittest
from app.services.question_extraction_service import QuestionExtractionService
from app.services.question_search_service import QuestionSearchService


class TestQuestionBank(unittest.TestCase):
    def test_question_extraction_numbered(self):
        sample_raw = """
        Q1. Define Second Normal Form (2NF) and explain partial functional dependency. [5 marks]
        Q2. What is Boyce-Codd Normal Form (BCNF)? Why is it stricter than 3NF? [10 marks]
        Q3. Differentiate between conflict serializability and view serializability. [5 marks]
        """
        extracted = QuestionExtractionService.extract_questions_from_text(sample_raw, "Database Management Systems")
        self.assertEqual(len(extracted), 3)
        self.assertEqual(extracted[0]["marks"], 5)
        self.assertEqual(extracted[1]["marks"], 10)
        self.assertEqual(extracted[0]["topic_id"], "Normalization")
        self.assertEqual(extracted[2]["topic_id"], "Transactions & Concurrency")

    def test_question_extraction_empty_fallback(self):
        extracted = QuestionExtractionService.extract_questions_from_text("", "DBMS")
        self.assertEqual(len(extracted), 0)

    def test_topic_detection(self):
        t1 = QuestionExtractionService._detect_topic("Solve for 3NF and BCNF normalization", "DBMS")
        self.assertEqual(t1, "Normalization")

        t2 = QuestionExtractionService._detect_topic("Construct a precedence graph for transaction schedule", "DBMS")
        self.assertEqual(t2, "Transactions & Concurrency")


if __name__ == "__main__":
    unittest.main()
