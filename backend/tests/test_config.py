import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest
from unittest.mock import patch


class TestConfig(unittest.TestCase):

    @patch("os.getenv", return_value="sqlite:///data/peacockgpt.db")
    def test_sqlalchemy_database_uri(self, mock_getenv):
        from app.utils.config import Config

        self.assertEqual(Config.SQLALCHEMY_DATABASE_URI, "sqlite:///data/peacockgpt.db")

    def test_sqlalchemy_track_modifications(self):
        from app.utils.config import Config

        self.assertFalse(Config.SQLALCHEMY_TRACK_MODIFICATIONS)


if __name__ == "__main__":
    unittest.main()
