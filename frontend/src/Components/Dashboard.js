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
      title: 'Validate & Generate Ranking',
      description: 'Process and validate rankings based on uploaded data',
      path: '/validate-and-generate-rank',
      icon: '📊'
    },
    {
      title: 'Generate Seat Allocation',
      description: 'Automated seat allocation based on rankings and criteria',
      path: '/generate-seat-allocation',
      icon: '🎓'
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