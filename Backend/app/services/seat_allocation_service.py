from app.static_data.seatMatrix import seatMatrix
from app.static_data.pool_program_map import pool_program_map

class Program:

    def __init__(self, pool_name, total_seats):
        self.pool_name = pool_name
        self.total_seats = int(total_seats)
        self.vacant_seats = int(total_seats)
        self.students_alloted = []
        self.students_alloted_count = 0
        self.closing_rank = float('inf') 

class Student:
    def __init__(self, student_id, student_name, rank, preferences):
        self.student_id = student_id
        self.student_name = student_name
        self.rank = rank
        self.preferences = preferences.strip().split(',')
        self.pool_alloted = 'None'
        self.program_alloted = 'None'

    def increase_seats(self):
        self.total_seats += 1

def try_allocate_seats(student, program):
    if program.closing_rank < student.rank:
        return False
    
    if program.closing_rank == student.rank:
        program.increase_seats()
        program.vacant_seats += 1;
    
    program.students_alloted.append(student)
    program.students_alloted_count += 1
    program.vacant_seats -= 1
    student.pool_alloted = program.pool_name
    student.program_alloted = pool_program_map[program.pool_name]

    if program.vacant_seats == 0:
        program.closing_rank = student.rank

    return True


def try_preference_order(student, programName_to_programObj):
    for preference in student.preferences:
        if preference in pool_program_map:
            program = programName_to_programObj[preference]
            if try_allocate_seats(student, program):
                return
    return

def generateStudentList(students):
    return [{
        'student_id': student.student_id, 
        'student_name': student.student_name, 
        'rank': student.rank, 
        'pool_alloted': student.pool_alloted, 
        'program_alloted': student.program_alloted
    } for student in students]

def generateProgramList(programs):
    return [{
        'pool': program.pool_name, 
        'seats': program.total_seats, 
        'students_alloted': program.students_alloted_count, 
        'closing_rank': 'Unclosed' if program.closing_rank == float('inf') else program.closing_rank
    } for program in programs]

def generateSeatAllocation(data):
    programName_to_programObj = {seat['pool'] : Program(seat['pool'], seat['seats']) for seat in seatMatrix} 
    students = [Student(student['student_id'], student['student_name'], student['rank'], student['preference_order']) for student in data]
    sorted_students = sorted(students, key=lambda x: x.rank)

    for student in sorted_students:
        try_preference_order(student, programName_to_programObj)

    result = {
        'student_seat_allocation': generateStudentList(students),
        'program_seat_summary': generateProgramList(programName_to_programObj.values())
    }

    return result