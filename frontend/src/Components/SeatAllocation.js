import React, { useState } from 'react';
import { generateSeatAllocation } from '../services/service';
import '../Styles/SeatAllocation.css';

const SeatAllocation = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [allocationData, setAllocationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateAllocation = async () => {
    try {
      setIsLoading(true);
      const savedData = localStorage.getItem('processedData');
      if (!savedData) {
        setError('No processed data found. Please upload and process data first.');
        return;
      }

      const processedData = JSON.parse(savedData);
      
      const response = await generateSeatAllocation({
        exam_id: 'exam1',
        processed_data: processedData.data
      });

      setAllocationData(response);
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

  const handleDownloadCSV = () => {
    if (!allocationData.length) return;

    const headers = ['ID', 'Name', 'Rank', 'Pool Allotted', 'Branch'];
    const csvContent = [
      headers.join(','),
      ...allocationData.map(row => [
        row.id,
        row.name,
        row.rank,
        row.pool_allotted,
        row.branch
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'seat_allocation.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter data based on search term
  const filteredData = allocationData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
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
            <button className="download-btn" onClick={handleDownloadCSV}>
              Download CSV
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Pool Allotted</th>
                  <th>Branch</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.rank}</td>
                    <td>{item.pool_allotted}</td>
                    <td>{item.branch}</td>
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
    </div>
  );
};

export default SeatAllocation; 