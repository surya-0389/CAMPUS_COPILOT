"""Automated test suite for Solutions Service."""

import unittest
from app.services.solution_service import SolutionService


class TestSolutions(unittest.TestCase):
    def test_solution_generation_normalization(self):
        q_text = "Explain the difference between 3NF and BCNF with a relational schema example."
        sol = SolutionService.generate_solution_for_question(q_text, "Database Management Systems", "Normalization")
        
        self.assertIn("short_answer", sol)
        self.assertIn("detailed_explanation", sol)
        self.assertIn("hint_text", sol)
        self.assertEqual(sol["solution_type"], "ai_generated")
        self.assertEqual(sol["verification_status"], "ai_provisional")
        self.assertIn("BCNF", sol["short_answer"])
        self.assertIn("3NF", sol["detailed_explanation"])

    def test_solution_generation_transactions(self):
        q_text = "Explain ACID properties and why Write-Ahead Logging is required for Atomicity."
        sol = SolutionService.generate_solution_for_question(q_text, "Database Management Systems", "Transactions & Concurrency")
        
        self.assertIn("Atomicity", sol["detailed_explanation"])
        self.assertIn("Write-Ahead Logging", sol["short_answer"])


if __name__ == "__main__":
    unittest.main()
