import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import UploadCSV from './Components/UploadCSV';
import SeatAllocation from './Components/SeatAllocation';
import Sidebar from './Components/Sidebar';
import ValidationPreference from './Components/ValidationPreference';
import RankingPage from './Components/RankingPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload-csv" element={<UploadCSV />} />
            <Route path="/validate" element={<ValidationPreference />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/generate-seat-allocation" element={<SeatAllocation />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
