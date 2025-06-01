from app.static_data.olympiad_requirement import requirement_olympiad
from copy import deepcopy

def process_student(student):
    # Process the student data
    student_id = student['id']
    student_name = student['name']
    preference_string = student['preference_order']
    preference_list = [pref.strip() for pref in preference_string.split(',')] # split the preference string into a list of preferences
    final_preference_order = [pref for pref in preference_list if student.get(requirement_olympiad.get(pref), '0') == '1'] # filter the preferences to only include the ones that are required
    removed_preference_order = [pref for pref in preference_list if student.get(requirement_olympiad.get(pref), '0') == '0'] # filter the preferences to only include the ones that are not required

    # Return the processed student data
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
    # Process the student data  
    validated_result = {
        'received_students': len(students),
        'validation_result': [process_student(student) for student in students]
    }
    return validated_result


def generate_rankings(validation_data):
    # Create a copy so original is not modified
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
    rankings = [] # list to store the rankings
    current_rank = 1 # current rank
    for i, student in enumerate(sorted_data): # enumerate over the sorted data
        if i > 0: 
            prev = sorted_data[i - 1] # previous student        
            # Check if any field differs from previous student
            if any([
                student['total_marks'] != prev['total_marks'],
                student['positive_marks'] != prev['positive_marks'],
                student['maths_marks'] != prev['maths_marks'],
                student['physics_marks'] != prev['physics_marks']
            ]):
                current_rank = i + 1
        
        # Append the student to the rankings list
        rankings.append({
            'student_id': student['student_id'],
            'student_name': student['student_name'],
            'rank': current_rank,
            'preference_order': student['final_preference_order']
        })

    # Return the rankings
    return {
        'received_students': len(validation_data),
        'rankings': rankings
    }