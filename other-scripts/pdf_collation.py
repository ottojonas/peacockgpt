import os

import PyPDF2


def extract_text_from_pdf(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
        return text


def transcribe_pdfs_to_text(directory, output_file):
    with open(output_file, "w", encoding="utf-8") as output:
        for filename in os.listdir(directory):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(directory, filename)
                text = extract_text_from_pdf(pdf_path)
                output.write(text + "\n")


if __name__ == "__main__":
    pdf_directory = "current-iteration-work/training-documents"
    output_text_file = "current-iteration-work/extracted-files/transcribed_pdf.txt"
    transcribe_pdfs_to_text(pdf_directory, output_text_file)
