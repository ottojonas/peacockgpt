import os

from assistant import Assistant
from dotenv import load_dotenv
from icecream import ic  # noqa: F401
from openai import OpenAI
from pdf_reading import PDFReading
from text_to_speech import TextToSpeech


class Main:

    def __init__(self):
        self.api_key = self.load_environment()
        self.openai_client = OpenAI(api_key=self.api_key)
        self.assistant = Assistant(api_key=self.api_key)
        self.pdf_reading = PDFReading()
        self.text_to_speech = TextToSpeech()

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")


if __name__ == "__main__":
    pass
