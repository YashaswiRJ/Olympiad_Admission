from flask import Blueprint, jsonify, request
from app.services.validate_and_clean import validate_and_clean_students, generate_rankings

bp = Blueprint('validation', __name__)

@bp.route('/validate-preferences', methods=['POST'])
def validate_preferences():
    try:
        students = request.json.get('students', [])
        # print('Received students from frontend:', students)
        result = validate_and_clean_students(students)
        return jsonify(result)
    except Exception as e:
        print('Error from backend:', e)
        return jsonify({'error': str(e)}), 500

@bp.route('/generate-rankings', methods=['POST'])
def generate_rankings_route():
    try:
        validation_data = request.json.get('validation_data', {})
        if not validation_data or 'rankings' not in validation_data:
            return jsonify({'error': 'Invalid validation data provided'}), 400
            
        # Sample ranking data for testing
        sample_rankings = [
            {
                'rank': 1,
                'student_id': 'S001',
                'student_name': 'John Doe',
                'final_preference_order': 'Math, Physics, Chemistry',
                'removed_preference_order': 'Biology'
            },
            {
                'rank': 2,
                'student_id': 'S002',
                'student_name': 'Jane Smith',
                'final_preference_order': 'Physics, Chemistry, Math',
                'removed_preference_order': 'Biology'
            },
            {
                'rank': 3,
                'student_id': 'S003',
                'student_name': 'Mike Johnson',
                'final_preference_order': 'Chemistry, Math, Physics',
                'removed_preference_order': 'Biology'
            }
        ]
        
        return jsonify({
            'success': True,
            'rankings': sample_rankings
        })
    except Exception as e:
        print('Error generating rankings:', e)
        return jsonify({'error': str(e)}), 500 