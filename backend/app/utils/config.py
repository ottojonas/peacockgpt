# * Configuration settings.

import os


class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/peacockgpt")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
