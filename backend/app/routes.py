# * Define API routes.
import datetime

import jwt
from app import db
from app.models import Conversation, Message, User
from app.services.document_service import (
    add_document_to_db,
    delete_document,
    get_all_documents,
    get_document_by_id,
    save_document,
)
from app.utils.file_utils import extract_content_from_file
from app.utils.openai_utils import generate_response
from flask import Blueprint, jsonify, request

# * create a Blueprint for the routes
routes = Blueprint("routes", __name__)


# * route to handle account creation and user registration
@routes.route("/api/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "email already registered"}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "user registered successfully"}), 201


# * route to handle user signing in
@routes.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({"error": "invalid email or password"}), 401

    # TODO implement session or token generation here
    return jsonify({"message": "login successful"}), 200


# * route to handle asking a question to the AI
@routes.route("/api/ask", methods=["POST"])
def ask_question():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "question is required"}), 400

    # * fetch all documents from the database
    documents = get_all_documents()
    document_texts = "\n\n".join([doc.content for doc in documents])

    # * create a prompt for the AI
    prompt = (
        f"Here are some documents:\n\n{document_texts}\n\nQuestion: {question}\nAnswer:"
    )

    # * generate a response from the AI
    answer = generate_response(prompt)
    return jsonify({"answer": answer})


# * route to check the health status of the application
@routes.route("/health", methods=["GET"])
def health_check():
    return {"status": "Healthy"}


# * route to handle document uploads
@routes.route("/upload", methods=["POST"])
def upload_document():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        # * save the uploaded document and extract its content
        filepath = save_document(file)
        content = extract_content_from_file(filepath)
        document = add_document_to_db(file.filename, content)
        return (
            jsonify({"message": "File uploaded successfully", "document": document.id}),
            201,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# * route to list all documents
@routes.route("/documents", methods=["GET"])
def list_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents])


# * route to get a specific document by its ID
@routes.route("/documents/<int:doc_id>", methods=["GET"])
def get_document(doc_id):
    document = get_document_by_id(db.session, doc_id)
    if document:
        return jsonify(
            {"id": document.id, "title": document.title, "content": document.content}
        )
    return jsonify({"error": "Document not found"}), 404


# * route to delete a specific document by its ID
@routes.route("/documents/<int:doc_id>", methods=["DELETE"])
def delete_document_route(doc_id):
    document = get_document_by_id(db.session, doc_id)
    if document:
        delete_document(doc_id)
        return jsonify({"message": "Document deleted successfully"}), 200
    return jsonify({"error": "Document not found"}), 404


# * route to create a new conversation
@routes.route("/api/conversations", methods=["POST"])
def create_conversation():
    data = request.json
    if not data or not all(
        key in data
        for key in ("key", "title", "desc", "date", "isSelected", "isPinned")
    ):
        return jsonify({"error": "missing required fields"}), 400
    try:
        # * create a new conversation object and save it to the database
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


# * route to get all conversations
@routes.route("/api/conversations", methods=["GET"])
def get_conversations():
    conversations = Conversation.query.all()
    return jsonify(
        [
            {"id": conv.id, "title": conv.title, "date": conv.date.isoformat()}
            for conv in conversations
        ]
    )


# * route to create a new message
@routes.route("/api/messages", methods=["POST"])
def new_message():
    data = request.json
    if not data or not all(
        key in data for key in ("conversationKey", "sender", "content")
    ):
        return jsonify({"error": "missing required fields"}), 400
    try:
        # * create a new message object and save it to the database
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


# * route to get messages for a specific conversation
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


# * route to update conversation
@routes.route("/api/conversations/<string:key>", methods=["PUT"])
def update_conversation(key):
    data = request.json
    if not data or "isPinned" not in data:
        return jsonify({"error": "missing required fields"}), 400
    try:
        # * find conversation by key and update pinned state
        conversation = Conversation.query.filter_by(key=key).first()
        if not conversation:
            return jsonify({"error": "conversation not found"}), 404
        conversation.isPinned = data["isPinned"]
        db.session.commit()
        return jsonify({"message": "conversation updated successfully"})
    except Exception as e:
        db.session.rollback()
        return (
            jsonify({"error": "failed to update conversation", "message": str(e)}),
            500,
        )
