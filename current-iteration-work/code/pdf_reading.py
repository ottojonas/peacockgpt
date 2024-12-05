import os
import re

from dotenv import load_dotenv
from icecream import ic
from openai import OpenAI
from PyPDF2 import PdfReader


class PDFReading:

    def __init__(self):
        self.api_key = self.load_environment()
        ic(self.api_key)
        self.openai_client = OpenAI(api_key=self.api_key)

    def load_environment(self):
        load_dotenv()
        ic(os.getenv("OPENAI_API_KEY"))
        return os.getenv("OPENAI_API_KEY")

    def extract_text_from_pdf(self, pdf_path, output_path):
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()

        text = re.sub(f"[^a-zA-Z0-9\s\.,;:!?'\@-]", "", text)

        with open(output_path, "w", encoding="latin-1") as file:
            file.write(text)

        ic(f"{output_path} file saved successfully")


pdf_reader = PDFReading()
pdf_reader.extract_text_from_pdf(
    "current-iteration-work/training-documents/how-to-open-a-new-account-nav.pdf",
    "current-iteration-work/extracted-files/extracted_text_pdf.txt",
)
