import os

from assistant import Assistant
from dotenv import load_dotenv
from icecream import ic
from openai import OpenAI
from pdf_reading import PDFReading
from text_to_speech import TextToSpeech


class Main:

    def __init__(self):
        self.api_key = self.load_environment()
        self.openai_client = OpenAI(api_key=self.api_key)
        self.assistant = Assistant()
        self.pdf_reading = PDFReading()
        self.text_to_speech = TextToSpeech()

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")

    def read_pdf(self, file_path: str, output_path: str):
        text = self.pdf_reading.extract_text_from_pdf(file_path, output_path)
        return text

    def generate_response(self, prompt):
        response = self.assistant.generate_response(prompt)
        return response

    def speak_text(self, text):
        self.text_to_speech(text)

    def run_chatbot(self):
        pdf_text = self.read_pdf(
            "current-iteration-work/training-documents/how-to-open-a-new-account-nav.pdf",
            "current-iteration-work/extracted-files/extracted_text_pdf.txt",
        )
        ic(f"pdf_text: {pdf_text}")

        user_input = input("Enter query: ")
        response = self.generate_response(user_input)
        print(f"assistant: {response}")

        self.speak_text(response)


if __name__ == "__main__":
    main = Main()
    main.run_chatbot()
