from flask import Blueprint, jsonify, request
from ..services.seat_allocation_service import generateSeatAllocation

bp = Blueprint('generate_seat_allocation', __name__)

@bp.route('', methods=['POST'])
@bp.route('/', methods=['POST'])
def generate_seat_allocation():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json().get('ranking_data')
        result = generateSeatAllocation(data)
        print('Successfully generated seat allocation !', result.get('program_seat_summary'))
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500