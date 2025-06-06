import React, { useState, useEffect } from 'react';
import { generateSeatAllocation } from '../services/service';
import ProgramSummary from './ProgramSummary';
import '../Styles/SeatAllocation.css';

const SeatAllocation = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [allocationData, setAllocationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [programSummary, setProgramSummary] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        const storedData = localStorage.getItem('seatAllocationData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setAllocationData(parsedData.student_seat_allocation);
          setProgramSummary(parsedData.program_seat_summary);
        } else {
          console.warn('No allocation data found in localStorage');
        }
      } catch (error) {
        console.error('Error parsing allocation data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateAllocation = async () => {
    try {
      setIsLoading(true);
      const savedData = localStorage.getItem('rankingData');
      if (!savedData) {
        setError('No processed data found. Please upload and process data first.');
        return;
      }

      const rankingData = JSON.parse(savedData);
      console.log('rankingData', rankingData)
      const response = await generateSeatAllocation(rankingData);
      console.log('response from backend', response)
      localStorage.setItem('seatAllocationData', JSON.stringify(response));

      setAllocationData(response.student_seat_allocation);
      setProgramSummary(response.program_seat_summary);
      setMessage('Seat allocation generated successfully!');
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate seat allocation');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadStudentCSV = () => {
    if (!allocationData.length) return;

    const headers = ['Rank', 'ID', 'Name', 'Pool Allotted', 'Program Allotted', 'Preferences Number'];

    // Function to escape CSV fields (wrap in quotes if contains comma or quote)
    const escapeCsvField = (field) => {
      if (field == null) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`; // escape quotes by doubling them
      }
      return str;
    };

    // Sort allocationData alphabetically by student_name
    const sortedData = [...allocationData].sort((a, b) =>
      a.student_name.localeCompare(b.student_name)
    );
    const csvContent = [
      headers.join(','),
      ...sortedData.map(row => [
        escapeCsvField(row.rank),
        escapeCsvField(row.student_id),
        escapeCsvField(row.student_name),
        escapeCsvField(row.pool_alloted),
        escapeCsvField(row.program_alloted),
        escapeCsvField(row.preference_number)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_seat_allocation.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadProgramCSV = () => {
    if (!programSummary.length) return;

    const headers = ['Pool', 'Program Name', 'Total Seats', 'Allotted', 'Vacant', 'Opening Rank', 'Closing Rank', 'Supernumerary Seats'];

    // Function to escape CSV fields (wrap in quotes if contains comma or quote)
    const escapeCsvField = (field) => {
      if (field == null) return '';
      const str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`; // escape quotes by doubling them
      }
      return str;
    };

    const csvContent = [
      headers.join(','),
      ...programSummary.map(program => [
        escapeCsvField(program.pool_name),
        escapeCsvField(program.program_name),
        escapeCsvField(program.seats),
        escapeCsvField(program.students_alloted),
        escapeCsvField(program.seats - program.students_alloted),
        escapeCsvField(program.opening_rank),
        escapeCsvField(program.closing_rank),
        escapeCsvField(program.supernumerary_seats)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'program_seat_summary.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter data based on search term
  const filteredData = allocationData.filter(item => 
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.student_id.toString().includes(searchTerm)
  );

  // Calculate pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="seat-allocation-container">
      <div className="header-section">
        <h2>Generate Seat Allocation</h2>
        <button 
          className="generate-btn" 
          onClick={handleGenerateAllocation}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Allocation'}
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {allocationData.length > 0 && (
        <div className="data-section">
          <div className="controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="download-btn" onClick={handleDownloadStudentCSV}>
              Download Student CSV
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Pool Allotted</th>
                  <th>Program Allotted</th>
                  <th>Preference Number</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={index}>
                    <td>{item.rank}</td>
                    <td>{item.student_id}</td>
                    <td>{item.student_name}</td>
                    <td>{item.pool_alloted}</td>
                    <td>{item.program_alloted}</td>
                    <td>{item.preference_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`page-btn ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}

      {programSummary.length > 0 && (
        <div className="program-summary-wrapper">
          <div className="program-summary-header">
            <button className="download-btn" onClick={handleDownloadProgramCSV}>
              Download Program Summary CSV
            </button>
          </div>
          <ProgramSummary programData={programSummary} />
        </div>
      )}
    </div>
  );
};

export default SeatAllocation; 