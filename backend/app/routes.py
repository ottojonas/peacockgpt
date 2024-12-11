# * Define API routes.
from flask import Blueprint

bp = Blueprint("routes", __name__)


@bp.route("/health", methods=["GET"])
def health_check():
    return {"status": "Healthy"}
