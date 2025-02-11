# * Initialize the Flask/Django app.
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os

mongo = PyMongo()
load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = os.getenv("MONGODB_URI")
    print("MONGO_URI:", app.config["MONGO_URI"])
    mongo.init_app(app)
    from .routes import routes

    app.register_blueprint(routes, url_prefix="/api")

    return app
