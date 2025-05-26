import React, { useState, useEffect } from 'react';
import { validateAndGenerateRanking, getProcessedData } from '../services/service';
import '../Styles/ValidateRanking.css';

const ValidateRanking = () => {
    const [sampleData, setSampleData] = useState([]);
    const [validationResult, setValidationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const data = getProcessedData();
        // Support both array and { data: [...] } structure
        let students = [];
        if (Array.isArray(data)) {
            students = data;
        } else if (data && Array.isArray(data.data)) {
            students = data.data;
        } else if (data && Array.isArray(data.students)) {
            students = data.students;
        }
        setSampleData(students.slice(0, 5));
    }, []);

    const handleValidate = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await validateAndGenerateRanking();
            setValidationResult(result);
        } catch (err) {
            setError('Failed to validate preferences. Please try again.');
            console.error('Validation error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="validate-ranking-container">
            <h2>Validate and Generate Rankings</h2>
            
            <div className="sample-data-section">
                <h3>Sample Data (First 5 Students)</h3>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Preferences</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleData.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', color: '#888' }}>No data available. Please upload and save student data first.</td></tr>
                            ) : sampleData.map((student, index) => (
                                <tr key={index}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.preference_order || (student.preferences ? student.preferences.join(', ') : '')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="validation-section">
                <button 
                    className="validate-button"
                    onClick={handleValidate}
                    disabled={loading}
                >
                    {loading ? 'Validating...' : 'Validate Student Preferences'}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {validationResult && (
                <div className="result-section">
                    <h3>Validation Results</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Assigned Program</th>
                                    <th>Rank</th>
                                </tr>
                            </thead>
                            <tbody>
                                {validationResult.rankings.map((result, index) => (
                                    <tr key={index}>
                                        <td>{result.studentId}</td>
                                        <td>{result.assignedProgram}</td>
                                        <td>{result.rank}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ValidateRanking;
