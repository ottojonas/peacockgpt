from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import os

client = MongoClient(os.getenv("MONGODB_URI"))
db = client.get_default_database()


class User:
    def __init__(self, email, password_hash):
        self.email = email
        self.password_hash = password_hash

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def find_by_email(email):
        return db.users.find_one({"email": email})

    @staticmethod
    def save(user):
        db.users.insert_one(user.__dict__)


class TrainingDocument:
    def __init__(self, title, content):
        self.title = title
        self.content = content

    @staticmethod
    def find_all():
        return list(db.training_documents.find())

    @staticmethod
    def save(document):
        db.training_documents.insert_one(document.__dict__)


class Conversation:
    def __init__(self, key, title, date, user_id):
        self.key = key
        self.title = title
        self.date = date
        self.user_id = user_id

    @staticmethod
    def find_by_key(key):
        return db.conversations.find_one({"key": key})

    @staticmethod
    def save(conversation):
        db.conversations.insert_one(conversation.__dict__)


class Message:
    def __init__(self, conversation_key, text, is_user, date, rating=None):
        self.conversation_key = conversation_key
        self.text = text
        self.is_user = is_user
        self.date = date
        self.rating = rating

    @staticmethod
    def find_by_id(message_id):
        return db.messages.find_one({"_id": message_id})

    @staticmethod
    def save(message):
        db.messages.insert_one(message.__dict__)
