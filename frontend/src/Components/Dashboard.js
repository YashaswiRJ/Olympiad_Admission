import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Upload CSV File',
      description: 'Upload and manage CSV data with options to remove or modify entries',
      path: '/upload-csv',
      icon: '📄'
    },
    {
      title: 'Validate Branch Preferences',
      description: 'Validates the preferences of the students based on eligibility',
      path: '/validate',
      icon: '📊'
    },
    {
      title: 'Generate Rankings',
      description: 'Generates the rankings of the students based on their performance in the test',
      path: '/ranking',
      icon: '🎓'
    },
    {
      title: 'Generate and View Seat Allocation',
      description: 'Generates the seat allocation of the students based on their performance in the test and displays the results',
      path: '/generate-seat-allocation',
      icon: '🎯'
    },
    {
      title: 'Upload Seat Matrix',
      description: 'Manage and upload seat allocation matrix',
      path: '/upload-seat-matrix',
      icon: '📋'
    }
  ];

  return (
    <div className="dashboard-container">
      <h1>Olympiad Admission Dashboard</h1>
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(card.path)}
          >
            <div className="card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 