import datetime
from flask import Blueprint, jsonify, request
from bson.objectid import ObjectId
from app import mongo
from app.utils.file_utils import extract_content_from_file
from app.utils.openai_utils import generate_response
from flask_jwt_extended import jwt_required, unset_jwt_cookies
from app.services.document_service import save_document

# * create a Blueprint for the routes
routes = Blueprint("routes", __name__)
auth_bp = Blueprint("auth", __name__)


# * route to handle account creation and user registration
@routes.route("/api/register", methods=["POST"])
def register():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    if not email.endswith("@peacocksalt.co.uk"):
        return jsonify(
            {
                "error": "email must be within the intranet, please try again or contact ottobjonas@outlook.com"
            }
        )
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "email already registered"}), 400

    user = {
        "email": email,
        "password": password,
    }
    mongo.db.users.insert_one(user)

    return jsonify({"message": "user registered successfully"}), 201


# * route to handle user signing in
@routes.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if (
        user is None or user["password"] != password
    ):  # You should check the hashed password
        return jsonify({"error": "invalid email or password"}), 401

    conversations = mongo.db.conversations.find({"user_id": user["_id"]})
    conversations_data = [
        {
            "key": str(conv["_id"]),
            "title": conv["title"],
            "date": conv["date"].isoformat(),
        }
        for conv in conversations
    ]

    # TODO implement session or token generation here
    return (
        jsonify({"message": "login successful", "conversations": conversations_data}),
        200,
    )


# * routes to handle user signing out
@auth_bp.route("/api/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response, 200


# * route to handle asking a question to the AI
@routes.route("/api/ask", methods=["POST"])
def ask_question():
    data = request.json
    question = data.get("question")
    if not question:
        return jsonify({"error": "question is required"}), 400

    # * fetch all documents from the database
    documents = mongo.db.documents.find()
    document_texts = "\n\n".join([doc["content"] for doc in documents])

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
        document = {
            "title": file.filename,
            "content": content,
        }
        mongo.db.documents.insert_one(document)
        return (
            jsonify(
                {
                    "message": "File uploaded successfully",
                    "document": str(document["_id"]),
                }
            ),
            201,
        )
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# * route to list all documents
@routes.route("/documents", methods=["GET"])
def list_documents():
    documents = mongo.db.documents.find()
    return jsonify(
        [{"id": str(doc["_id"]), "title": doc["title"]} for doc in documents]
    )


# * route to get a specific document by its ID
@routes.route("/documents/<string:doc_id>", methods=["GET"])
def get_document(doc_id):
    document = mongo.db.documents.find_one({"_id": ObjectId(doc_id)})
    if document:
        return jsonify(
            {
                "id": str(document["_id"]),
                "title": document["title"],
                "content": document["content"],
            }
        )
    return jsonify({"error": "Document not found"}), 404


# * route to delete a specific document by its ID
@routes.route("/documents/<string:doc_id>", methods=["DELETE"])
def delete_document_route(doc_id):
    result = mongo.db.documents.delete_one({"_id": ObjectId(doc_id)})
    if result.deleted_count > 0:
        return jsonify({"message": "Document deleted successfully"}), 200
    return jsonify({"error": "Document not found"}), 404


# * route to create a new conversation
@routes.route("/api/conversations", methods=["POST"])
def create_conversation():
    data = request.json
    user_id = data.get("user_id")
    if not user_id or not all(
        key in data
        for key in ("key", "title", "desc", "date", "isSelected", "isPinned")
    ):
        return jsonify({"error": "missing required fields"}), 400
    try:
        # * create a new conversation object and save it to the database
        conversation = {
            "key": data["key"],
            "title": data["title"],
            "desc": data["desc"],
            "date": datetime.datetime.fromisoformat(data["date"]),
            "isSelected": data["isSelected"],
            "isPinned": data["isPinned"],
            "user_id": user_id,
        }
        mongo.db.conversations.insert_one(conversation)
        return jsonify({"id": str(conversation["_id"])}), 201
    except Exception as e:
        return jsonify({"error": "Failed to save conversation", "message": str(e)}), 500


# * route to get all conversations
@routes.route("/api/conversations", methods=["GET"])
def get_conversations():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    try:
        user_object_id = ObjectId(user_id)
        conversations = mongo.db.conversations.find({"user_id": user_object_id})
        return jsonify(
            [
                {
                    "id": str(conv["_id"]),
                    "key": conv["key"],
                    "title": conv["title"],
                    "desc": conv.get("desc", ""),
                    "date": conv["date"].isoformat(),
                    "isSelected": conv.get("isSelected", False),
                    "isPinned": conv.get("isPinned", False),
                }
                for conv in conversations
            ]
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# * route to delete conversations
@routes.route("/api/conversations", methods=["DELETE"])
def delete_user_conversations():
    user_id = request.args.get("user_id")
    key = request.args.get("key")
    if not user_id:
        return jsonify({"error": "user_id is required"})
    try:
        mongo.db.conversations.delete_many({"user_id": user_id, "key": key})
        mongo.db.messages.delete_many({"user_id": user_id, "key": key})
        return jsonify({"message": "User conversations and messages deleted"}), 200
    except Exception as e:
        return (
            jsonify(
                {"error": "Failed to delete user conversations", "message": str(e)}
            ),
            500,
        )


# * route to create a new message
@routes.route("/api/messages", methods=["POST"])
def new_message():
    data = request.json
    message_data = data.get(
        "message", data
    )  # Use message field if present, otherwise use root data

    if not message_data or not all(
        key in message_data for key in ("conversationKey", "sender", "content")
    ):
        return jsonify({"error": "missing required fields"}), 400

    try:
        message = {
            "conversationKey": message_data["conversationKey"],
            "sender": message_data["sender"],
            "content": message_data["content"],
            "timestamp": datetime.datetime.utcnow(),
            "rating": message_data.get("rating", "good"),
        }
        mongo.db.messages.insert_one(message)
        return jsonify({"id": str(message["_id"]), "key": message_data.get("key")}), 201
    except Exception as e:
        return jsonify({"error": "Failed to save message", "message": str(e)}), 500


# * route to get messages for a specific conversation
@routes.route("/api/messages", methods=["GET"])
def get_messages():
    conversationKey = request.args.get("conversationKey")
    if not conversationKey:
        return jsonify({"error": "conversationKey is required"}), 400

    messages = mongo.db.messages.find({"conversationKey": conversationKey})
    return jsonify(
        [
            {
                "id": str(msg["_id"]),
                "sender": msg["sender"],
                "content": msg["content"],
                "timestamp": msg["timestamp"].isoformat(),
            }
            for msg in messages
        ]
    )


# * route to update conversation
@routes.route("/api/conversations/<string:key>", methods=["PUT"])
def update_conversation(key):
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400
    data = request.json
    if not data or "isPinned" not in data:
        return jsonify({"error": "missing required fields"}), 400
    try:
        # * find conversation by key and update pinned state
        result = mongo.db.conversations.update_one(
            {"key": key, "user_id": user_id}, {"$set": {"isPinned": data["isPinned"]}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "conversation not found"}), 404
        return jsonify({"message": "conversation updated successfully"})
    except Exception as e:
        return (
            jsonify({"error": "failed to update conversation", "message": str(e)}),
            500,
        )


# * route to rate message
@routes.route("/api/message/rate", methods=["POST"])
def rate_message():
    data = request.json
    if not data or "key" not in data or "rating" not in data:
        return jsonify({"error": "key and rating are required"}), 400

    try:
        result = mongo.db.messages.update_one(
            {"_id": ObjectId(data["key"])}, {"$set": {"rating": data["rating"]}}
        )
        if result.matched_count == 0:
            return jsonify({"error": "message not found"}), 404
        return jsonify({"message": "message rated successfully"})
    except Exception as e:
        return jsonify({"error": "failed to rate message", "message": str(e)}), 500
