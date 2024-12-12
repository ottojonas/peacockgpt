# * Entry point for the backend application.
from app import create_app
from app.services.document_service import get_all_documents
from flask import jsonify

app = create_app()


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(status="healthy"), 200


@app.route("/api/documents", methods=["GET"])
def get_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents]), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
