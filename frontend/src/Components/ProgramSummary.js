import React from 'react';
import '../Styles/ProgramSummary.css';

const ProgramSummary = ({ programData }) => {
  return (
    <div className="program-summary-section">
      <h3>Program Seat Summary</h3>
      <div className="program-cards">
        {programData.map((program, index) => (
          <div key={index} className="program-card">
            <div className="program-header">
              <h4>{program.pool_name}</h4>
              <span className={`status ${program.students_alloted === program.seats ? 'filled' : 'vacant'}`}>
                {program.students_alloted === program.seats ? 'Filled' : 'Vacant'}
              </span>
            </div>
            <div className="program-details">
              <div className="detail-row">
                <span className="label">Program Name:</span>
                <span className="value">{program.program_name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Seats:</span>
                <span className="value">{program.seats}</span>
              </div>
              <div className="detail-row">
                <span className="label">Allotted:</span>
                <span className="value">{program.students_alloted}</span>
              </div>
              <div className="detail-row">
                <span className="label">Vacant:</span>
                <span className="value">{program.seats - program.students_alloted}</span>
              </div>
              <div className="detail-row">
                <span className="label">Opening Rank:</span>
                <span className="value">{program.opening_rank}</span>
              </div>
              <div className="detail-row">
                <span className="label">Closing Rank:</span>
                <span className="value">{program.closing_rank}</span>
              </div>
              <div className="detail-row">
                <span className="label">Supernumerary Seats Added:</span>
                <span className="value">{program.supernumerary_seats}</span>
              </div>
              {program.student_list && (
                <div className="detail-row student-list">
                  <span className="label">Allotted Students:</span>
                  <span className="value">{program.student_list}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramSummary; 