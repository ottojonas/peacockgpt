import os

import openai
from dotenv import load_dotenv
from icecream import ic


class TextToSpeech:

    def __init__(self):
        self.api_key = self.load_environment()
        openai.api_key = self.api_key

    def load_environment(self):
        load_dotenv()
        return os.getenv("OPENAI_API_KEY")

    def transcribe_text_to_speech(self, input_file, output_file):
        try:
            with open(input_file, "r", encoding="latin-1") as file:
                text = file.read()

            response = openai.audio.speech.create(
                model="tts-1",
                voice="nova",
                input=text,
            )

            audio_content = response.content

            with open(output_file, "wb") as audio_file:
                audio_file.write(audio_content)

            ic(f"audio content written to {output_file}")
        except FileNotFoundError:
            ic(f"error: the file: {input_file} was not found")
        except Exception as e:
            ic(f"an error occured: {e}")


tts = TextToSpeech()
tts.transcribe_text_to_speech(
    "current-iteration-work/extracted-files/extracted_text_pdf.txt",
    "current-iteration-work/extracted-files/text_to_speech.mp3",
)
