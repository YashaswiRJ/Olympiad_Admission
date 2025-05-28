import React, { useState, useEffect } from 'react';
import { getRankingData, validatePreferences, getProcessedData, generateSeatAllocation } from '../services/service';
import { useNavigate } from 'react-router-dom';
import '../Styles/RankingPage.css';

const RankingPage = () => {
    const navigate = useNavigate();
    const [rankingData, setRankingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(10);

    useEffect(() => {
        const loadRankingData = async () => {
            try {
                let validationData = null;
                const storedValidationData = localStorage.getItem('validationData');
                if (storedValidationData) {
                    validationData = JSON.parse(storedValidationData);
                } else {
                    // If not in localStorage, fetch processed data and validate via backend
                    const processed = getProcessedData();
                    if (!processed?.data) {
                        setError('No processed data found. Please upload and validate data first.');
                        setLoading(false);
                        return;
                    }
                    const validationResponse = await validatePreferences(processed.data);
                    validationData = validationResponse.validation_result;
                    // Store for future use
                    localStorage.setItem('validationData', JSON.stringify(validationData));
                }
                const data = await getRankingData(validationData);
                localStorage.setItem('rankingData', JSON.stringify(data.rankings));
                setRankingData(data.rankings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadRankingData();
    }, []);

    // Search functionality
    const filteredData = rankingData.filter(row => 
        row.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.rank.toString().includes(searchTerm)
    );

    // Pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDownloadCSV = () => {
        const headers = ['Rank', 'Student ID', 'Name', 'Preference Order'];
        const csvData = filteredData.map(row => [
            row.rank,
            row.student_id,
            row.student_name,
            Array.isArray(row.preference_order) ? row.preference_order.join(',') : row.preference_order
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'student_rankings.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGenerateSeatAllocation = async () => {
        try {
            setLoading(true);
            const result = await generateSeatAllocation(rankingData);
            // Store the result in localStorage for the next page
            localStorage.setItem('seatAllocationData', JSON.stringify(result));
            navigate('/generate-seat-allocation');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading rankings...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="ranking-page-container">
            <h2>Student Rankings</h2>

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by ID, Name, or Rank..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <div className="action-buttons">
                    <button onClick={handleDownloadCSV} className="action-btn">
                        Download CSV
                    </button>
                    <button onClick={handleGenerateSeatAllocation} className="action-btn">
                        Generate Seat Allocation
                    </button>
                </div>
            </div>

            {/* Rankings Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Preference Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.map((row, index) => (
                            <tr key={index}>
                                <td>{row.rank}</td>
                                <td>{row.student_id}</td>
                                <td>{row.student_name}</td>
                                <td>
                                    <div className="preferences-list">
                                        {/* Handle both string and array cases for preference_order */}
                                        {Array.isArray(row.preference_order)
                                            ? row.preference_order.map((pref, idx) => (
                                                <span key={idx} className="preference-item">{pref}</span>
                                            ))
                                            : (row.preference_order || '').split(',').map((pref, idx) => (
                                                <span key={idx} className="preference-item">{pref.trim()}</span>
                                            ))
                                        }
                                    </div>
                                </td>
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
        </div>
    );
};

export default RankingPage; 