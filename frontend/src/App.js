import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import UploadCSV from './Components/UploadCSV';
import SeatAllocation from './Components/SeatAllocation';
import UploadSeatMatrix from './Components/UploadSeatMatrix';
import Sidebar from './Components/Sidebar';
import ValidationPreference from './Components/ValidationPreference';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload-csv" element={<UploadCSV />} />
            <Route path="/validate-preferences" element={<ValidationPreference />} />
            <Route path="/upload-seat-matrix" element={<UploadSeatMatrix />} />
            <Route path="/generate-seat-allocation" element={<SeatAllocation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
