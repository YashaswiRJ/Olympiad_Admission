from app.static_data.seatMatrix import seatMatrix
from app.static_data.pool_program_map import pool_program_map

class Program:
    # Parameters: pool_name, total_seats
    def __init__(self, pool_name, total_seats):
        self.pool_name = pool_name
        self.total_seats = int(total_seats)
        self.vacant_seats = int(total_seats)
        self.students_alloted = []
        self.students_alloted_count = 0
        self.opening_rank = 0
        self.closing_rank = float('inf') 
        self.supernumerary_seats = 0

    def increase_seats(self):
        self.total_seats += 1
        self.supernumerary_seats += 1


class Student:
    # Parameters: student_id, student_name, rank, preferences
    def __init__(self, student_id, student_name, rank, preferences):
        self.student_id = student_id
        self.student_name = student_name
        self.rank = rank
        self.preferences = [p.strip() for p in preferences.strip().split(',')]
        self.pool_alloted = 'None'
        self.program_alloted = 'None'
        self.preference_number = 'None';


# Try to allocate seats to a student based on their preference order
def try_allocate_seats(student, program, preference_number):
    if program.closing_rank < student.rank: # if the closing rank of the program is less than the rank of the student, then return False
        return False
    
    if program.closing_rank == student.rank: # if the closing rank of the program is equal to the rank of the student, then increase the seats of the program
        program.increase_seats()
        program.vacant_seats += 1;
    
    if program.opening_rank == 0: # if the opening rank of the program is 0, then set the opening rank of the program to the rank of the student
        program.opening_rank = student.rank

    program.students_alloted.append(student) # append the student to the list of students alloted to the program
    program.students_alloted_count += 1 # increment the number of students alloted to the program
    program.vacant_seats -= 1 # decrement the number of vacant seats in the program
    student.pool_alloted = program.pool_name # set the pool alloted to the program
    student.program_alloted = pool_program_map[program.pool_name] # set the program alloted to the program
    student.preference_number = preference_number

    if program.vacant_seats == 0: # if the number of vacant seats in the program is 0, then set the closing rank of the program to the rank of the student          
        program.closing_rank = student.rank

    return True


# Try to allocate seats to a student based on their preference order
def try_preference_order(student, programName_to_programObj):
    # Try to allocate seats to a student based on their preference order
    for index, preference in enumerate(student.preferences): # preference is a string
        if preference in pool_program_map: # preference is a key in pool_program_map
            program = programName_to_programObj[preference] # program is a Program object
            if try_allocate_seats(student, program, index+1):
                return
    return

# Generate a list of students with their seat allocation details
def generateStudentList(students):
    return [{
        'student_id': student.student_id, 
        'student_name': student.student_name, 
        'rank': student.rank, 
        'pool_alloted': student.pool_alloted, 
        'program_alloted': student.program_alloted,
        'preference_number': student.preference_number
    } for student in students]

# Generate a list of programs with their seat allocation details
def generateProgramList(programs):
    return [{
        'pool_name': program.pool_name, 
        'seats': program.total_seats, 
        'students_alloted': program.students_alloted_count, 
        'opening_rank': 'Unopted' if program.opening_rank == 0 else program.opening_rank,
        'program_name': pool_program_map[program.pool_name],
        'closing_rank': 'Unclosed' if program.closing_rank == float('inf') else program.closing_rank,
        'supernumerary_seats': program.supernumerary_seats
    } for program in programs]

def generateSeatAllocation(data):
    # Create a dictionary to map program names to their corresponding Program objects
    programName_to_programObj = {seat['pool'] : Program(seat['pool'], seat['seats']) for seat in seatMatrix} 

    # Create a list of Student objects from the input data
    students = [Student(student['student_id'], student['student_name'], student['rank'], student['preference_order']) for student in data]
    sorted_students = sorted(students, key=lambda x: x.rank)

    # Try to allocate seats to students based on their preference order
    for student in sorted_students:
        try_preference_order(student, programName_to_programObj)

    # Generate the final results
    result = {
        'student_seat_allocation': generateStudentList(students),
        'program_seat_summary': generateProgramList(programName_to_programObj.values())
    }

    return result