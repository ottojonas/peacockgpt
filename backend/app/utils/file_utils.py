import os

import docx
import pypdf


def extract_content_from_file(file_path):
    _, file_extension = os.path.splitext(file_path)
    if file_extension.lower() == ".pdf":
        return extract_content_from_pdf(file_path)
    elif file_extension.lower() == ".docx":
        return extract_content_from_docx(file_path)
    elif file_extension.lower() == ".txt":
        return extract_content_from_txt(file_path)
    else:
        raise ValueError("Unsupported file type")


def extract_content_from_pdf(file_path):
    content = ""
    with open(file_path, "rb") as file:
        reader = pypdf.PdfFileReader(file)
        for page_num in range(reader.numPages):
            page = reader.getPage(page_num)
            content += page.extract_text()
    return content


def extract_content_from_docx(file_path):
    doc = docx.Document(file_path)
    content = "\n".join([para.text for para in doc.paragraphs])
    return content


def extract_content_from_txt(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
    return content
