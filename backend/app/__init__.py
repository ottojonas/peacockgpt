# * Initialize the Flask/Django app.
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

# from icecream import ic

mongo = PyMongo()
load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object("app.utils.config.Config")
    app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "cookies"]
    app.config["JWT_HEADER_NAME"] = "Authorization"
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_ACCESS_COOKIE_NAME"] = "access_token_cookie"
    app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN"
    app.config["JWT_ACCESS_CSRF_FIELD_NAME"] = "csrf_token"
    mongo.init_app(app)

    from .routes import routes, auth_bp

    app.register_blueprint(routes, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app
