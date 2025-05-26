from flask import Blueprint, jsonify
from app.services.validate_and_clean import validate_and_clean_students

bp = Blueprint('validation', __name__)

@bp.route('/validate-preferences', methods=['POST'])
def validate_preferences():
    try:
        # Get the processed data from the validate_and_clean service
        print('Hello from backend')
        result = validate_and_clean_students()
        return jsonify(result)
    except Exception as e:
        print('Error form backend')
        return jsonify({'error': str(e)}), 500 