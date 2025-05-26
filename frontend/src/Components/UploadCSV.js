import React, { useState, useEffect } from 'react';
import '../Styles/UploadCSV.css';

const UploadCSV = () => {
  const [csvData, setCsvData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage] = useState(10);
  const [showToast, setShowToast] = useState(false);

  // Define display headers (what user sees)
  const displayHeaders = [
    'id', 'name', 'total_marks', 'positive_marks', 'maths_marks',
    'physics_marks', 'chemistry_marks', 'imotc', 'ioitc', 'so', 'preference_order'
  ];

  // Define actual data headers (what's in the CSV)
  const requiredColumns = [
    'id', 'name', 'total_marks', 'positive_marks', 'maths_marks',
    'physics_marks', 'chemistry_marks', 'imotc', 'ioitc', 'inpho', 'incho', 'inbo',
    'preference_order'
  ];

  useEffect(() => {
    const savedData = localStorage.getItem('processedData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProcessedData(parsedData.data);
      setHeaders(displayHeaders);
      setMessage('Previous data loaded successfully');
      setMessageType('success');
    }
  }, []);

  const validateHeaders = (fileHeaders) => {
    const normalizedFileHeaders = fileHeaders.map(h => h.toLowerCase());
    const missingColumns = requiredColumns.filter(
      col => !normalizedFileHeaders.includes(col.toLowerCase())
    );
    return missingColumns.length === 0 ? true : missingColumns;
  };

  const calculateSO = (row) => {
    // SO is 1 if any of INPHO, INCHO, or INBO is 1
    return (parseInt(row.inpho) === 1 || 
            parseInt(row.incho) === 1 || 
            parseInt(row.inbo) === 1) ? 1 : 0;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const processCSV = (csv) => {
    const lines = csv.split(/\r?\n/);
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    const headerValidation = validateHeaders(headers);
    if (headerValidation !== true) {
      setMessage(`Missing required columns: ${headerValidation.join(', ')}`);
      setMessageType('error');
      return;
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() !== '') {
        let row = {};
        let currentPosition = 0;
        let values = [];
        let currentValue = '';
        let insideQuotes = false;
        const line = lines[i];

        // Parse CSV line handling quoted values
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue.trim());

        // Assign values to headers
        headers.forEach((header, index) => {
          let value = values[index] || '';
          if (header === 'preference_order') {
            // Clean up the preference order string
            value = value.replace(/^"/, '').replace(/"$/, '');
          }
          row[header] = value;
        });
        data.push(row);
      }
    }

    const processedRows = data.map(row => ({
      id: row.id,
      name: row.name,
      total_marks: row.total_marks,
      positive_marks: row.positive_marks,
      maths_marks: row.maths_marks,
      physics_marks: row.physics_marks,
      chemistry_marks: row.chemistry_marks,
      imotc: row.imotc,
      ioitc: row.ioitc,
      so: calculateSO(row),
      preference_order: row.preference_order
    }));

    const shuffledData = shuffleArray([...processedRows]);
    const sortedData = shuffledData.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    setCsvData(data);
    setProcessedData(sortedData);
    setHeaders(displayHeaders);
    setMessage('CSV file processed successfully!');
    setMessageType('success');
    setCurrentPage(1);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setMessage('File size exceeds 10MB limit');
        setMessageType('error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processCSV(text);
      };
      reader.onerror = () => {
        setMessage('Error reading file');
        setMessageType('error');
      };
      reader.readAsText(file);
    }
  };

  const removeRow = (index) => {
    const newData = [...processedData];
    newData.splice(index, 1);
    const sortedData = newData.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    setProcessedData(sortedData);
    setMessage('Row removed successfully');
    setMessageType('success');
  };

  const saveData = () => {
    const dataToSave = {
      data: processedData,
      timestamp: new Date().getTime(),
      expiresAt: new Date().getTime() + (2 * 60 * 60 * 1000) // 2 hours
    };
    localStorage.setItem('processedData', JSON.stringify(dataToSave));
    setMessage('Data saved successfully!');
    setMessageType('success');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      setMessage('');
    }, 1000); // Hide after 1 second
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredData = processedData.filter(row => 
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.id.toString().includes(searchTerm)
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="upload-csv-container">
      {showToast && (
        <div className="notification-overlay">
          <div className="notification-card">
            <div className="notification-icon">✅</div>
            <div className="notification-message">Data saved successfully!</div>
          </div>
        </div>
      )}
      
      <h2>Upload Student Data</h2>
      
      <div className="upload-section">
        <div className="file-input-container">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="file-input-label">
            <span className="upload-icon">📄</span>
            <span>Choose a CSV file or drag it here</span>
          </label>
        </div>
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
      </div>

      {processedData.length > 0 && (
        <div className="data-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="table-container horizontal-scroll">
            <table>
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index} className={header}>
                      {header.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
                  <th className="actions">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentEntries.map((row, rowIndex) => (
                  <tr key={rowIndex} className="data-row">
                    {headers.map((header, colIndex) => (
                      <td key={colIndex} className={header}>
                        {header === 'preference_order' ? (
                          <div className="preference-container">
                            {row[header].split(',').map((pref, i) => (
                              <span key={i} className="preference-item">
                                {pref.trim()}
                              </span>
                            ))}
                          </div>
                        ) : (
                          row[header]
                        )}
                      </td>
                    ))}
                    <td className="actions">
                      <button
                        onClick={() => removeRow(indexOfFirstEntry + rowIndex)}
                        className="remove-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
          
          <button onClick={saveData} className="save-btn">
            Save Data
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadCSV; 