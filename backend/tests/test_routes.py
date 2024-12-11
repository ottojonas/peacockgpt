# * Tests for API routes.

import os
import unittest

from app import create_app, db
from app.models import TrainingDocument


class RoutesTestCase(unittest.TestCase):
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

    def test_upload_document(self):
        with self.app.app_context():
            os.makedirs("tests", exist_ok=True)
            with open("tests/test_document.txt", "wb") as test_file:
                test_file.write(b"test document content")
            response = self.client.post(
                "/upload",
                data={
                    "file": (
                        open("tests/test_document.txt", "rb"),
                        "test_document.txt",
                    )
                },
            )
            self.assertEqual(response.status_code, 201)

    def test_list_documents(self):
        with self.app.app_context():
            db.session.add(
                TrainingDocument(
                    title="Test Document", content="This is a test document."
                )
            )
            db.session.commit()
            response = self.client.get("/documents")
            self.assertEqual(response.status_code, 200)
            self.assertIn("Test Document", response.get_data(as_text=True))

    def test_get_document(self):
        with self.app.app_context():
            document = TrainingDocument(
                title="Test Document", content="This is a test document."
            )
            db.session.add(document)
            db.session.commit()
            response = self.client.get(f"/documents/{document.id}")
            self.assertEqual(response.status_code, 200)
            self.assertIn("Test Document", response.get_data(as_text=True))

    def test_delete_document(self):
        with self.app.app_context():
            document = TrainingDocument(
                title="Test Document", content="This is a test document."
            )
            db.session.add(document)
            db.session.commit()
            response = self.client.delete(f"/documents/{document.id}")
            self.assertEqual(response.status_code, 200)
            response = self.client.get(f"/documents/{document.id}")
            self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
