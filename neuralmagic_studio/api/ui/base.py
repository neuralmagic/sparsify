from flask import (
    Blueprint,
    render_template,
    request,
    current_app,
    safe_join,
    send_file,
    abort,
    url_for,
    redirect,
)

ui_bp = Blueprint("ui", __name__)

__all__ = ["ui_bp"]


@ui_bp.route("/")
def redirect_ui():
    return redirect(url_for("ui.render_ui"))


@ui_bp.route("/ui")
def render_ui():
    return render_template("index.html")
