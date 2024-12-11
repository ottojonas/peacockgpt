# * Initialize the Flask/Django app.
def create_app():
    from flask import Flask

    app = Flask(__name__)

    from .routes import bp as routes_bp

    app.register_blueprint(routes_bp)
    return app
