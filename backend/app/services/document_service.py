# * Handles document ingestion and processing.
import os

from app import db
from app.models import TrainingDocument
from sqlalchemy.orm import Session

UPLOAD_FOLDER = "backend/app/services/document_service.py"
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def save_document(file):
    directory = "backend/app/services/document_services.py"
    if not os.path.exists(directory):
        os.makedirs(directory)
    file_path = os.path.join(directory, file.filename)
    file.save(file_path)
    return file_path


def add_document_to_db(title, content):
    document = TrainingDocument(title=title, content=content)
    db.session.add(document)
    db.session.commit()
    return document


def get_document_by_id(session: Session, doc_id):
    return session.get(TrainingDocument, doc_id)


def get_all_documents():
    return TrainingDocument.query.all()


def delete_document(doc_id):
    session = db.session
    document = session.get(TrainingDocument, doc_id)
    if document:
        session.delete(document)
        session.commit()
