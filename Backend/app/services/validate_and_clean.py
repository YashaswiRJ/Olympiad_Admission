from app.static_data.olympiad_requirement import requirement_olympiad

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
        'removed_preference_order': ', '.join(removed_preference_order)
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

def generate_rankings(validation_data):
    """
    Generate rankings based on validated student data.
    This function implements the ranking algorithm based on:
    1. Student's final preference order
    2. Number of valid preferences
    3. Order of preferences
    """
    # Create a copy of the validation data to avoid modifying the original
    rankings = validation_data.copy()
    
    # Sort rankings based on:
    # 1. Number of valid preferences (more is better)
    # 2. Order of preferences (earlier is better)
    for rank in rankings:
        # Count number of valid preferences
        valid_prefs = rank['final_preference_order'].split(', ')
        rank['valid_preference_count'] = len(valid_prefs)
        
        # Store first preference for sorting
        rank['first_preference'] = valid_prefs[0] if valid_prefs else ''
    
    # Sort by number of valid preferences (descending) and first preference
    sorted_rankings = sorted(
        rankings,
        key=lambda x: (-x['valid_preference_count'], x['first_preference'])
    )
    
    # Add rank number to each student
    for i, rank in enumerate(sorted_rankings, 1):
        rank['rank'] = i
        # Remove temporary sorting fields
        del rank['valid_preference_count']
        del rank['first_preference']
    
    return sorted_rankings 