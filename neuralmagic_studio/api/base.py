from flask import Blueprint

base_api_bp = Blueprint("base_api", __name__, url_prefix="/api")

__all__ = ["base_api_bp"]


@base_api_bp.route("status", methods=["GET"])
def health_check():
    return {"status": "OK"}
