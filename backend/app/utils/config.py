# * Configuration settings.

import os


class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://192.168.16.119:27017/peacockgpt")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
