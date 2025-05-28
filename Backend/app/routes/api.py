from flask import Blueprint, jsonify, current_app
from .validation import bp as validation_bp

bp = Blueprint('api', __name__)

# Register the validation blueprint
bp.register_blueprint(validation_bp)