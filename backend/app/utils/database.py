# * Database connection and setup.
import sqlite3

from icecream import ic


def create_tables():
    conn = sqlite3.connect("backend/instance/conversations.db")
    cursor = conn.cursor()

    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TIMESTAMP NOT NULL
    )
    """
    )

    cursor.execute(
        """
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id)
    )
    """
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_tables()
    ic("tables created successfully")
