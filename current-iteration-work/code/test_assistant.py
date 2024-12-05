import unittest
from unittest.mock import MagicMock, patch

from assistant import Assistant

# FILE: current-iteration-work/code/test_assistant.py


class TestAssistant(unittest.TestCase):
    @patch("assistant.OpenAI")
    def test_create_assistant(self, MockOpenAI):
        # Arrange
        mock_client = MockOpenAI.return_value
        mock_assistant = MagicMock()
        mock_client.beta.assistants.create.return_value = mock_assistant

        assistant = Assistant()

        # Act
        assistant.create_assistant()

        # Assert
        mock_client.beta.assistants.create.assert_called_once_with(
            instructions="You are a chatbot that helps new employees understand and learn the training documents by just providing the relevant information to their questions. The information is stored in pdf files",
            name="PeacockGPT",
            tools=[{"type": "file_search"}],
            tool_resources={"file_search": {"vector_store_ids": ["vs_123"]}},
            model="gpt-4o",
            temperature=0.2,
        )
        self.assertEqual(mock_client.beta.assistants.create.call_count, 1)


if __name__ == "__main__":
    unittest.main()
