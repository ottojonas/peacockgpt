# * Tests for service modules.
import os
import sys

# * add the parent directory to the system path to import the app module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import unittest

from app import create_app, db
from app.services.document_service import (
    add_document_to_db,
    delete_document,
    get_document_by_id,
)
from pymongo import MongoClient


# * test case class for document service functions
class DocumentServiceTestCase(unittest.TestCase):
    # * set up the test environment
    def setUp(self):
        self.app = create_app()
        self.client = MongoClient(os.getenv("MONGODB_URI"))
        self.db = self.client.get_database("test")
        self.collection = self.db["trainingdocuments"]

        with self.app.app_context():
            db.create_all()  # create all database tables

    # * tear down the test environment
    def tearDown(self):
        self.db.drop_collection("trainingdocuments")
        self.client.close()

    # * test the add_document_to_db function
    def test_add_document_to_db(self):
        with self.app.app_context():
            document = add_document_to_db("test doc", "this is a test")
            self.assertIsNotNone(document.id)  # check if the document ID is not None
            self.assertEqual(
                document.title, "test doc"
            )  # check if the document title is correct


# * test the get_document_by_id function
def test_get_document_by_id(self):
    with self.app.app_context():
        document = add_document_to_db("test doc", "this is a test")
        fetched_document = get_document_by_id(db.session, document.id)
        self.assertEqual(
            fetched_document.title, "test doc"
        )  # check if the fetched document title is correct


# * test the delete_document function
def test_delete_document(self):
    with self.app.app_context():
        document = add_document_to_db("test doc", "this is a test")
        delete_document(document.id)
        fetched_document = get_document_by_id(db.session, document.id)
        self.assertIsNone(
            fetched_document
        )  # check if the fetched document is None after deletion


# * run the test cases
if __name__ == "__main__":
    unittest.main()
