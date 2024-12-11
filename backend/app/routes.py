# * Define API routes.
from app import db
from app.services.document_service import (
    add_document_to_db,
    delete_document,
    get_all_documents,
    get_document_by_id,
    save_document,
)
from app.utils.file_utils import extract_content_from_file
from flask import Blueprint, jsonify, request

routes = Blueprint("routes", __name__)


@routes.route("/health", methods=["GET"])
def health_check():
    return {"status": "Healthy"}


@routes.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        filepath = save_document(file)
        content = extract_content_from_file(filepath)
        document = add_document_to_db(file.filename, content)
        return (
            jsonify({"message": "File uploaded successfully", "document": document.id}),
            201,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@routes.route("/documents", methods=["GET"])
def list_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents])


@routes.route("/documents/<int:doc_id>", methods=["GET"])
def get_document(doc_id):
    document = get_document_by_id(db.session, doc_id)
    if document:
        return jsonify(
            {"id": document.id, "title": document.title, "content": document.content}
        )
    return jsonify({"error": "Document not found"}), 404


@routes.route("/documents/<int:doc_id>", methods=["DELETE"])
def delete_document_route(doc_id):
    document = get_document_by_id(db.session, doc_id)
    if document:
        delete_document(doc_id)
        return jsonify({"message": "Document deleted successfully"}), 200
    return jsonify({"error": "Document not found"}), 404
