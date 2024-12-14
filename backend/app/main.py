# * Entry point for the backend application.
import json
import os

from app import create_app
from app.services.document_service import get_all_documents
from flask import jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = create_app()
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/api/messages", methods=["GET"])
def get_messages():
    pass


@socketio.on("send_message")
def handle_send_message(data):
    emit("new_message", data, broadcast=True)


@app.route("/api/chat", methods=["GET"])
def get_chat_data():
    data_file_path = os.path.join(
        os.path.dirname(__file__), "../../frontend/components/Chat/data.json"
    )
    with open(data_file_path, "r") as file:
        data = json.load(file)
    return jsonify(data)


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(status="healthy"), 200


@app.route("/api/documents", methods=["GET"])
def get_documents():
    documents = get_all_documents()
    return jsonify([{"id": doc.id, "title": doc.title} for doc in documents]), 200


if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
