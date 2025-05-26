from flask import Blueprint, jsonify, current_app
from .validation import bp as validation_bp

bp = Blueprint('api', __name__)

# Register the validation blueprint
bp.register_blueprint(validation_bp)

@bp.route('/sample-data')
def get_sample_data():
    """Sample API endpoint"""
    current_app.logger.info('Sample data endpoint called')
    sample_data = [
        {"id": 1, "name": "Item 1", "description": "Cockroach 1"},
        {"id": 2, "name": "Item 2", "description": "Description 2"},
        {"id": 3, "name": "Item 3", "description": "Description 3"}
    ]
    current_app.logger.info(f'Returning {len(sample_data)} items')
    return jsonify(sample_data) 