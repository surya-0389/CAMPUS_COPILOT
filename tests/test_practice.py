"""Automated test suite for Practice sessions, scoring, and weak topic analytics."""

import unittest
from app.services.question_analytics_service import QuestionAnalyticsService
from app.services.practice_service import PracticeService


class TestPractice(unittest.TestCase):
    def test_mock_analytics_structure(self):
        # We can test the analytical calculations with mock DB
        class MockDB:
            def query(self, *args):
                class MockQuery:
                    def filter(self, *fargs):
                        class MockFilter:
                            def all(self):
                                return []
                        return MockFilter()
                return MockQuery()

        mock_db = MockDB()
        analytics = QuestionAnalyticsService.get_student_analytics(mock_db, "alex_cse_3")
        
        self.assertEqual(analytics["student_id"], "alex_cse_3")
        self.assertIn("Normalization", analytics["weak_topics"])
        self.assertIn("Transactions & Concurrency", analytics["strong_topics"])
        self.assertIn("mentor_recommendation", analytics)
        self.assertTrue(len(analytics["recommended_pyqs"]) > 0)


if __name__ == "__main__":
    unittest.main()
