import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getProcessedData, 
    validatePreferences, 
    generateRankings, 
    saveRankingData 
} from '../services/service';
import '../Styles/ValidationPreference.css';

const ValidationPreference = () => {
  const navigate = useNavigate();
  const [sampleData, setSampleData] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);

  useEffect(() => {
    // Load processed data from localStorage and get top 5 entries
    const savedData = getProcessedData();
    if (savedData?.data) {
      setSampleData(savedData.data.slice(0, 5));
    }
  }, []);

  const handleValidateData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const savedData = getProcessedData();
      if (!savedData?.data) {
        throw new Error('No data found to validate');
      }
      
      const response = await validatePreferences(savedData.data);
      setValidationResult(response.validation_result);
      localStorage.setItem('validationData', JSON.stringify(response.validation_result));
    } catch (err) {
      setError(err.message || 'An error occurred during validation');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRanking = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await generateRankings(validationResult);
      console.log(validationResult, '=====', response);
      localStorage.setItem('rankingData', JSON.stringify(response.rankings));
      saveRankingData(response.rankings);
      navigate('/ranking');
    } catch (err) {
      setError(err.message || 'An error occurred while generating rankings');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const filteredData = validationResult ? validationResult.filter(row => 
    row.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="validation-preference-container">
      <h2>Validate Student Preferences</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Sample Data Section */}
      <div className="data-section">
        <h3>Sample Data (Top 5 Entries)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Total Marks</th>
                <th>Positive Marks</th>
                <th>Maths Marks</th>
                <th>Physics Marks</th>
                <th>Chemistry Marks</th>
                <th>IMOTC</th>
                <th>IOITC</th>
                <th>SO</th>
                <th>Preference Order</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.total_marks}</td>
                  <td>{row.positive_marks}</td>
                  <td>{row.maths_marks}</td>
                  <td>{row.physics_marks}</td>
                  <td>{row.chemistry_marks}</td>
                  <td>{row.imotc}</td>
                  <td>{row.ioitc}</td>
                  <td>{row.so}</td>
                  <td>{row.preference_order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button 
            className="validate-btn"
            onClick={handleValidateData}
            disabled={loading || !sampleData.length}
          >
            {loading ? 'Validating...' : 'Validate Preferences'}
          </button>
        </div>
      </div>

      {/* Validation Results Section */}
      {validationResult && (
        <div className="data-section validation-results">
          <h3>Validation Results</h3>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Final Preferences</th>
                  <th>Removed Preferences</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((row, index) => (
                  <tr key={index}>
                    <td>{row.student_id}</td>
                    <td>{row.student_name}</td>
                    <td>{row.final_preference_order}</td>
                    <td>{row.removed_preference_order}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>

          {/* Generate Ranking Button */}
          <div className="actions">
            <button 
              className="generate-ranking-btn"
              onClick={handleGenerateRanking}
              disabled={loading || !validationResult}
            >
              {loading ? 'Generating...' : 'Generate Ranking'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationPreference; 