# * Define API routes.
import datetime

from app import db
from app.models import Conversation, Message
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


@routes.route("/api/conversations", methods=["POST"])
def create_conversation():
    data = request.json
    if not data or not all(
        key in data
        for key in ("key", "title", "desc", "date", "isSelected", "isPinned")
    ):
        return jsonify({"error": "missing required fields"}), 400
    try:
        conversation = Conversation(
            key=data["key"],
            title=data["title"],
            desc=data["desc"],
            date=datetime.datetime.fromisoformat(data["date"]),
            isSelected=data["isSelected"],
            isPinned=data["isPinned"],
        )
        db.session.add(conversation)
        db.session.commit()
        return jsonify({"id": conversation.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to save conversation", "message": str(e)}), 500


@routes.route("/api/messages", methods=["POST"])
def new_message():
    data = request.json
    if not data or not all(
        key in data for key in ("conversationKey", "sender", "content")
    ):
        return jsonify({"error": "missing required fields"}), 400
    try:
        conversation_key = data["conversationKey"]
        message = Message(
            conversationKey=conversation_key,
            sender=data["sender"],
            content=data["content"],
            timestamp=datetime.datetime.utcnow(),
        )
        db.session.add(message)
        db.session.commit()
        return jsonify({"id": message.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "failed to save message", "message": str(e)}), 500


@routes.route("/api/conversations", methods=["GET"])
def get_conversations():
    conversations = Conversation.query.all()
    return jsonify(
        [
            {"id": conv.id, "title": conv.title, "date": conv.date.isoformat()}
            for conv in conversations
        ]
    )


@routes.route("/api/messages", methods=["GET"])
def get_messages():
    conversationKey = request.args.get("conversationKey")
    if not conversationKey:
        return jsonify({"error": "conversationKey is required"}), 400

    messages = Message.query.filter_by(conversationKey=conversationKey).all()
    return jsonify(
        [
            {
                "id": msg.id,
                "sender": msg.sender,
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat(),
            }
            for msg in messages
        ]
    )
