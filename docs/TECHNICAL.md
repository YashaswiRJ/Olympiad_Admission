# Technical Documentation

## System Overview
The Olympiad Admission System is a web-based platform for managing student admissions based on Olympiad performance and branch preferences. It features a React frontend, a Python backend, and uses RESTful APIs for validation and ranking. Data is stored in browser localStorage for session continuity.

## Author Information
- **Name:** Yashaswi Raj
- **Email:** yashaswir23@iitk.ac.in
- **Contact:** 7488813484

## Component Structure

### 1. App Component (`App.js`)
- Root component managing routing and layout
- Implements React Router for navigation
- Manages sidebar state and main content area

### 2. Sidebar Component (`Components/Sidebar.js`)
- Collapsible navigation menu
- Dynamic route handling
- Tooltip integration
- Responsive layout adaptation

### 3. UploadCSV Component (`Components/UploadCSV.js`)
- Handles CSV upload, parsing, and validation
- Displays data in a paginated, searchable table
- Allows row removal and data saving to localStorage

### 4. ValidationPreference Component (`Components/ValidationPreference.js`)
- Validates student preferences via backend API
- Displays validation results
- Stores validation data in localStorage

### 5. RankingPage Component (`Components/RankingPage.js`)
- Fetches and displays rankings from backend API
- Uses validation data from localStorage
- Provides search and pagination

### 6. SeatAllocation Component (`Components/SeatAllocation.js`)
- Upload and manage seat matrix
- Generate and review seat allocations
- Display program seat summary
- Export program summaries to CSV

### 7. ProgramSummary Component (`Components/ProgramSummary.js`)
- Displays program-wise seat allocation details
- Shows opening and closing ranks
- Provides CSV export functionality
- Responsive card-based layout

## Data Flow
1. CSV Upload → Validation (backend) → Store validation data in localStorage
2. Ranking Generation (backend) using validation data
3. Seat Allocation using rankings and seat matrix
4. Program Summary generation with opening and closing ranks
5. CSV export of program summaries

## Storage Implementation
```javascript
// Save validation data
localStorage.setItem('validationData', JSON.stringify(validationResult));
// Retrieve validation data
const validationData = JSON.parse(localStorage.getItem('validationData'));
```

## UI/UX Implementation
- Responsive design for all modules
- Paginated and searchable tables
- Clear error and success notifications
- Accessibility for keyboard navigation
- Card-based layout for program summaries
- CSV export functionality

## Error Handling
- File upload and CSV validation errors
- Backend/API errors
- Data persistence and recovery
- Program summary generation errors

## Testing Guidelines
- Unit tests for CSV parsing and validation
- Integration tests for API communication
- UI tests for all major workflows
- Program summary generation tests
- CSV export functionality tests

## Deployment Considerations
- Build with `npm run build`
- Deploy static files to web server
- Ensure backend API is accessible
- Configure CORS settings

## Installation and Setup

### Prerequisites
1. Backend Requirements:
   - Python 3.8 or higher
   - pip (Python package manager)
   - Virtual environment (recommended)

2. Frontend Requirements:
   - Node.js 16.0 or higher (for React 19.x compatibility)
   - npm (Node Package Manager) 8.0 or higher
   - Modern web browser (Chrome, Firefox, Safari, Edge)
   - JavaScript enabled
   - Minimum screen resolution: 1024x768
   - Internet connection for backend API access

### Frontend Dependencies
The frontend uses the following key dependencies (specified in package.json):
- React 19.1.0 - Core UI library
- React Router DOM 7.6.0 - For routing
- React Scripts 5.0.1 - For development and build tools
- Testing libraries for unit testing

### Setup Steps
1. Clone the repository
2. Backend Setup:
```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
3. Frontend Setup:
```bash
cd frontend
npm install  # This will install all dependencies from package.json
```
4. Start the backend server:
```bash
cd Backend
python app.py
```
5. Start the frontend development server:
```bash
cd frontend
npm start  # This will start the React development server
```

## Future Development
- Server-side storage integration
- Advanced filtering and export features
- Multi-user collaboration
- Real-time updates for seat allocation
- Advanced analytics and reporting 