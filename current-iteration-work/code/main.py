import os

from assistant import Assistant
from dotenv import load_dotenv
from icecream import ic
from information_loader import InformationLoader
from openai import OpenAI
from pdf_reading import PDFReading
from text_to_speech import TextToSpeech


class Main:

    def __init__(self):
        self.api_key = self.load_environment()
        self.openai_client = OpenAI(api_key=self.api_key)
        self.assistant = Assistant()
        self.text_to_speech = TextToSpeech()
        self.pdf_reading = PDFReading()
        self.information_loader = InformationLoader()

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")

    def read_pdf(self, file_path: str, output_path: str):
        text = self.pdf_reading.extract_text_from_pdf(file_path, output_path)
        return text

    def load_information(self, file_path: str) -> None:
        information = self.information_loader(file_path)
        return information

    def speak_text(self, text):
        self.text_to_speech(text)

    def generate_response(self, user_input):
        return self.assistant.ask_question(user_input)

    def run_chatbot(self):
        information = self.load_information(
            "current-iteration-work/extracted-files/transcribed_pdf.txt"
        )
        ic(f"pdf_text: {information}")

        user_input = input("Enter query: ")
        response = self.generate_response(user_input)
        print(f"assistant: {response}")

        self.speak_text(response)


if __name__ == "__main__":
    main = Main()
    main.run_chatbot()
