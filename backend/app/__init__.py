# * Initialize the Flask/Django app.
from flask import Flask
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

mongo = PyMongo()


def create_app():
    app = Flask(__name__)
    load_dotenv()
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    jwt = JWTManager(app)
    app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    mongo.init_app(app)

    from .routes import routes

    app.register_blueprint(routes, url_prefix="/api")
    return app
