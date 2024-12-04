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
