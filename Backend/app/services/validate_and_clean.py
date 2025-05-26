from app.static_data.olympiad_requirement import requirement_olympiad
from copy import deepcopy

def process_student(student):
    student_id = student['id']
    student_name = student['name']
    preference_string = student['preference_order']
    preference_list = [pref.strip() for pref in preference_string.split(',')]
    final_preference_order = [pref for pref in preference_list if student.get(requirement_olympiad.get(pref), '0') == '1']
    removed_preference_order = [pref for pref in preference_list if student.get(requirement_olympiad.get(pref), '0') == '0']
    return {
        'student_id': student_id,
        'student_name': student_name,
        'final_preference_order': ', '.join(final_preference_order),
        'removed_preference_order': ', '.join(removed_preference_order),
        'total_marks': student['total_marks'],
        'positive_marks': student['positive_marks'],
        'maths_marks': student['maths_marks'],
        'physics_marks': student['physics_marks']
    }


def validate_and_clean_students(students):
    """
    Validate and clean student data. This is a placeholder for the actual logic.
    Returns a dictionary containing the validation results.
    """
    # print('Processing students in validate_and_clean_students:', students)
    # TODO: Implement actual validation and cleaning logic
    sample_result = {
        'received_students': len(students),
        'validation_result': [process_student(student) for student in students]
    }
    return sample_result

from copy import deepcopy

def generate_rankings(validation_data):
    # Create a copy so original is not modified
    print('validation_data', validation_data)
    data = deepcopy(validation_data)
    
    # Helper to parse and sort
    def sort_key(student):
        return (
            -int(student['total_marks']),
            -int(student['positive_marks']),
            -int(student['maths_marks']),
            -int(student['physics_marks'])
        )
    
    # Sort using the custom key
    sorted_data = sorted(data, key=sort_key)
    
    # Assign ranks (equal scores get same rank)
    rankings = []
    current_rank = 1
    for i, student in enumerate(sorted_data):
        if i > 0:
            prev = sorted_data[i - 1]
            # Check if any field differs from previous student
            if any([
                student['total_marks'] != prev['total_marks'],
                student['positive_marks'] != prev['positive_marks'],
                student['maths_marks'] != prev['maths_marks'],
                student['physics_marks'] != prev['physics_marks']
            ]):
                current_rank = i + 1
        
        rankings.append({
            'student_id': student['student_id'],
            'student_name': student['student_name'],
            'rank': current_rank,
            'preference_order': student['final_preference_order']
        })

    return {
        'received_students': len(validation_data),
        'rankings': rankings
    }