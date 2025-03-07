import unittest
from flask import current_app
from app import create_app


class AppConfigTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_app_config(self):
        self.assertEqual(current_app.config["JWT_ACCESS_CSRF_FIELD_NAME"], "csrf_token")
        self.assertEqual(
            current_app.config["JWT_ACCESS_CSRF_HEADER_NAME"], "X-CSRF-TOKEN"
        )
        self.assertEqual(
            current_app.config["JWT_ACCESS_COOKIE_NAME"], "access_token_cookie"
        )
        self.assertEqual(current_app.config["JWT_HEADER_TYPE"], "Bearer")
        self.assertEqual(current_app.config["JWT_HEADER_NAME"], "Authorization")
        self.assertEqual(
            current_app.config["JWT_TOKEN_LOCATION"], ["headers", "cookies"]
        )


if __name__ == "__main__":
    unittest.main()
