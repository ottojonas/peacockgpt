# * Define database models.
from werkzeug.security import check_password_hash, generate_password_hash

from . import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    conversations = db.relationship("Conversation", backref="user", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class TrainingDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"<TrainingDocument {self.title}>"


class Conversation(db.Model):
    key = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    messages = db.relationship("Message", backref="conversation", lazy=True)


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    conversationKey = db.Column(
        db.Integer, db.ForeignKey("conversation.key"), nullable=False
    )
    text = db.Column(db.Text, nullable=False)
    is_user = db.Column(db.Boolean, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    is_user = db.Column(db.Boolean, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    ratinf = db.Column(db.String, nullable=True)
