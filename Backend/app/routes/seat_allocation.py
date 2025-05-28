from flask import Blueprint, jsonify, request
from ..services.seat_allocation_service import SeatAllocationService

bp = Blueprint('generate_seat_allocation', __name__)

@bp.route('', methods=['POST', 'OPTIONS'])
@bp.route('/', methods=['POST', 'OPTIONS'])
def generate_seat_allocation():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.get_json().get('ranking_data')
        result = SeatAllocationService.generate_seat_allocation(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500