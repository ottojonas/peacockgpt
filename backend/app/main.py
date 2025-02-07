import gevent.monkey

gevent.monkey.patch_all()

import sys

sys.setrecursionlimit(1500)

from flask import jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from app import create_app
from app.services.document_service import get_all_documents

app = create_app()
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def index():
    return "Welcome to PeacockGPT! :)", 200


@app.route("/api/messages", methods=["GET"])
def get_messages():
    pass


@app.route("/api/messages", methods=["POST"])
def send_message():
    data = request.json
    conversation_key = data.get("conversationKey")
    content = data.get("content")

    if not conversation_key or not content:
        return jsonify({"error": "invalid data"}), 400

    message = {"conversationKey": conversation_key, "content": content}
    socketio.emit("new_message", message, broadcast=True)
    return jsonify(message), 200


@socketio.on("send_message")
def handle_send_message(data):
    emit("new_message", data, broadcast=True)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(status="healthy"), 200


@app.route("/api/documents", methods=["GET"])
def get_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents]), 200


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
