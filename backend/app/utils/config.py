# * Configuration settings.

import os

from dotenv import load_dotenv

load_dotenv()
config_val = os.getenv()


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://username:password@localhost/dbname"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
