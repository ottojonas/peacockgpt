# * Define API routes.
from app import app
from app.services.document_service import (
    add_document_to_db,
    delete_document,
    get_all_documents,
    get_document_by_id,
    save_document,
)
from flask import Blueprint, jsonify, request

bp = Blueprint("routes", __name__)


@bp.route("/health", methods=["GET"])
def health_check():
    return {"status": "Healthy"}


@app.route("/upload", methods=["POST"])
def upload_documents():
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "no file selected"}), 400
    try:
        file_path = save_document(file)
        content = extract_content_from_file(file_path)
        document = add_document_to_db(file.filename, content)
        return (
            jsonify({"message": "file successfully uploaded", "document": document.id}),
            201,
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400


@app.route("/documents", methods=["GET"])
def list_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents])


@app.route("/documents/<int:doc:id>", methods=["GET"])
def get_document(doc_id):
    document = get_document_by_id(doc_id)
    if document:
        return jsonify(
            {"id": document.id, "title": document.title, "content": document.content}
        )
    return jsonify({"error": "document not found"}), 404


@app.route("/documents/<int:doc:id>", methods=["DELETE"])
def delete_document_route(doc_id):
    if delete_document(doc_id):
        return jsonify({"message": "document successfully deleted"})
    return jsonify({"error", "document not found"}), 404
    return jsonify({"error", "document not found"}), 404
