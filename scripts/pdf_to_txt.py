import os

import fitz
from icecream import ic


def pdf_to_text(pdf_path, txt_path):
    pdf_document = fitz.open(pdf_path)
    text = ""

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        text += page.get_text()

    with open(txt_path, "w", encoding="utf-8") as txt_file:
        txt_file.write(text)


def convert_all_pdfs_in_directory(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(directory, filename)
            txt_path = os.path.join(directory, filename.replace(".pdf", ".txt"))
            pdf_to_text(pdf_path, txt_path)
            # * ic(f"converted {filename} to {filename.replace('.pdf', '.txt')}")


pdf_directory = "data/training-documents"

convert_all_pdfs_in_directory(pdf_directory)
