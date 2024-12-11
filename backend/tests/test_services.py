# * Tests for service modules.
import unittest

from app import create_app, db
from app.services.document_service import (
    add_document_to_db,
    delete_document,
    get_document_by_id,
)


class DocumentServiceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.client = self.app.test_client()

        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_add_document_to_db(self):
        with self.app.app_context():
            document = add_document_to_db("test doc", "this is a test")
            self.assertIsNotNone(document.id)
            self.assertEqual(document.title, "test doc")

    def test_get_document_by_id(self):
        with self.app.app_context():
            document = add_document_to_db("test doc", "this is a test")
            fetched_document = get_document_by_id(db.session, document.id)
            self.assertEqual(fetched_document.title, "test doc")

    def test_delete_document(self):
        with self.app.app_context():
            document = add_document_to_db("test doc", "this is a test")
            delete_document(document.id)
            fetched_document = get_document_by_id(db.session, document.id)
            self.assertIsNone(fetched_document)


if __name__ == "__main__":
    unittest.main()
