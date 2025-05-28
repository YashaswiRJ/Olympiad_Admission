from flask import Blueprint, jsonify, request
from app.services.validate_and_clean import validate_and_clean_students, generate_rankings

bp = Blueprint('validation', __name__)

@bp.route('/validate-preferences', methods=['POST'])
def validate_preferences():
    try:
        students = request.json.get('students', [])
        result = validate_and_clean_students(students)
        print(students[0])
        return jsonify(result)
    except Exception as e:
        print('Error from backend:', e)
        return jsonify({'error': str(e)}), 500

@bp.route('/generate-rankings', methods=['POST'])
def generate_rankings_route():
    try:
        validation_data = request.json.get('validation_data', {})
        result = generate_rankings(validation_data)
        return jsonify(result)
    except Exception as e:
        print('Error generating rankings:', e)
        return jsonify({'error': str(e)}), 500 