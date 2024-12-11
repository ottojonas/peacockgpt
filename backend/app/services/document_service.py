# *  Handles document ingestion and processing.
import os

from app import db
from app.models import TrainingDocument
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = "/data/training-documents"
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_document(file):
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        return file_path
    else:
        raise ValueError("file type not allowed")


def add_document_to_db(title, content):
    document = TrainingDocument(title=title, content=content)
    db.session.add(document)
    db.session.commit()
    return document


def get_content_by_id(doc_id):
    return TrainingDocument.query.get(doc_id)


def get_all_documents():
    return TrainingDocument.query.all()


def delete_document(doc_id):
    document = TrainingDocument.query.get(doc_id)
    if document:
        db.session.delete(document)
        db.session.commit()
        return True
    return False
