import os

from dotenv import load_dotenv
from icecream import ic
from openai import OpenAI


class Assistant:
    def __init__(self):
        self.api_key = self.load_environment()
        self.openai_client = OpenAI(api_key=self.api_key)

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")

    def create_assistant(self):
        client = OpenAI()
        self.peacockgpt = client.beta.assistants.create(
            instructions="You are a chatbot that helps new employees understand and learn the training documents by just providing the relevant information to their questions. The information is stored in pdf files",
            name="PeacockGPT",
            tools=[{"type": "file_search"}],
            tool_resources={"file_search": {"vector_store_ids": ["vs_123"]}},
            model="gpt-4o",
            temperature=0.2,
        )
        ic(self.peacockgpt)
