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

        text = re.sub(f"[^a-zA-Z0-9\s\.,;:!?'\@-]", "", text)  # noqa: F541

        with open(output_path, "w", encoding="latin-1") as file:
            file.write(text)

        ic(f"{output_path} file saved successfully")

    def extract_text_from_all_pdfs(self, input_folder, output_folder):
        for filename in os.listdir(input_folder):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(input_folder, filename)
                output_path = os.path.join(output_folder, f"extracted_{filename}.txt")
                self.extract_text_from_pdf(pdf_path, output_path)


if __name__ == "__main__":
    pdf_reader = PDFReading()
    input_folder = "current-iteration-work/training-documents"
    output_folder = "current-iteration-work/extracted-files"
    pdf_reader.extract_text_from_all_pdfs(input_folder, output_folder)
    pdf_reader.extract_text_from_all_pdfs(input_folder, output_folder)
    pdf_reader.extract_text_from_all_pdfs(input_folder, output_folder)
