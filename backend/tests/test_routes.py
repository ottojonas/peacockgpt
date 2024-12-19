# * Tests for API routes.
import os
import sys

# * add parent directory to system path to import the app module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest

from app import create_app, db
from app.models import TrainingDocument
from pymongo import MongoClient


# * test case class for api routes
class RoutesTestCase(unittest.TestCase):
    # * set up test environment
    def setUp(self):
        self.app = create_app()
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        self.mongo_client = MongoClient(os.getenv("MONGODB_URI"))
        self.db = self.mongo_client.get_database("test")

        with self.app.app_context():
            db.create_all()  # create all database tables

    # * tear down test environment
    def tearDown(self):
        with self.app.app_context():
            self.db.drop_collection("trainingdocuments")
            self.mongo_client.close()

    # * test document upload route
    def test_upload_document(self):
        with self.app.app_context():
            os.makedirs(
                "tests", exist_ok=True
            )  # create the tests directory if it doesn't exist
            with open("backend/tests/test_document.txt", "wb") as test_file:
                test_file.write(b"test document content")  # write contents to test file
            response = self.client.post(
                "/upload",
                data={
                    "file": (
                        open("backend/tests/test_document.txt", "rb"),
                        "test_document.txt",
                    )
                },
            )
            self.assertEqual(
                response.status_code, 201
            )  # check if response status code is equal to 201 (created)

    # * test list document route
    def test_list_documents(self):
        with self.app.app_context():
            db.session.add(
                TrainingDocument(
                    title="Test Document", content="This is a test document."
                )
            )
            db.session.commit()
            response = self.client.get("/documents")
            self.assertEqual(
                response.status_code, 200
            )  # check if the response status code is 200 (OK)
            self.assertIn(
                "Test Document", response.get_data(as_text=True)
            )  # check if the response contains the document title

    # * Test the get document by ID route
    def test_get_document(self):
        with self.app.app_context():
            document = TrainingDocument(
                title="Test Document", content="This is a test document."
            )
            db.session.add(document)
            db.session.commit()
            response = self.client.get(f"/documents/{document.id}")
            self.assertEqual(
                response.status_code, 200
            )  # Check if the response status code is 200 (OK)
            self.assertIn(
                "Test Document", response.get_data(as_text=True)
            )  # Check if the response contains the document title

    # * test the delete document route
    def test_delete_document(self):
        with self.app.app_context():
            document = TrainingDocument(
                title="Test Document", content="This is a test document."
            )
            db.session.add(document)
            db.session.commit()
            response = self.client.delete(f"/documents/{document.id}")
            self.assertEqual(
                response.status_code, 200
            )  # check if the response status code is 200 (OK)
            response = self.client.get(f"/documents/{document.id}")
            self.assertEqual(
                response.status_code, 404
            )  # check if the response status code is 404 (not found)


# * run the test cases
if __name__ == "__main__":
    unittest.main()
    unittest.main()
