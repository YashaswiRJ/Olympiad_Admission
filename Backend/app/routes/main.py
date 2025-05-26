from flask import Blueprint, send_from_directory
import os

bp = Blueprint('main', __name__)

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def serve(path):
    """Serve the React app"""
    if path != "" and os.path.exists(bp.static_folder + '/' + path):
        return send_from_directory(bp.static_folder, path)
    else:
        return send_from_directory(bp.static_folder, 'index.html') 