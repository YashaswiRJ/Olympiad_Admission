from typing import List, Dict, Any
from collections import defaultdict

class SeatAllocationService:
    def __init__(self):
        self.seat_capacity = {
            'Computer Science': 50,
            'Electrical Engineering': 40,
            'Mechanical Engineering': 45,
            'Civil Engineering': 35,
            'Chemical Engineering': 30
        }

    def allocate_seats(self, ranking_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Allocate seats to students based on their rankings and preferences
        """
        # Sort students by rank
        sorted_students = sorted(ranking_data, key=lambda x: x['rank'])
        
        # Initialize allocation results
        allocation_results = []
        allocated_students = set()
        department_allocations = {dept: 0 for dept in self.seat_capacity.keys()}
        
        for student in sorted_students:
            student_id = student['student_id']
            preferences = student['preference_order']
            
            # Skip if preferences is a string, convert to list
            if isinstance(preferences, str):
                preferences = [p.strip() for p in preferences.split(',')]
            
            allocated = False
            
            # Try to allocate based on preferences
            for preference in preferences:
                if (department_allocations[preference] < self.seat_capacity[preference] and 
                    student_id not in allocated_students):
                    allocation_results.append({
                        'student_id': student_id,
                        'student_name': student['student_name'],
                        'rank': student['rank'],
                        'allocated_department': preference,
                        'status': 'Allocated'
                    })
                    department_allocations[preference] += 1
                    allocated_students.add(student_id)
                    allocated = True
                    break
            
            # If not allocated, mark as waitlisted
            if not allocated:
                allocation_results.append({
                    'student_id': student_id,
                    'student_name': student['student_name'],
                    'rank': student['rank'],
                    'allocated_department': None,
                    'status': 'Waitlisted'
                })
        
        return allocation_results

    def get_allocation_summary(self, allocation_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generate a summary of the allocation results
        """
        total_students = len(allocation_results)
        allocated_count = sum(1 for result in allocation_results if result['status'] == 'Allocated')
        waitlisted_count = sum(1 for result in allocation_results if result['status'] == 'Waitlisted')
        
        # Count department-wise allocations
        department_counts = defaultdict(int)
        for result in allocation_results:
            if result['status'] == 'Allocated' and result['allocated_department']:
                department_counts[result['allocated_department']] += 1
        
        summary = {
            'total_students': total_students,
            'allocated_students': allocated_count,
            'waitlisted_students': waitlisted_count,
            'department_wise_allocation': dict(department_counts)
        }
        
        return summary 