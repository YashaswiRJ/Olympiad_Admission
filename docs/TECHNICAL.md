# Technical Documentation

## System Overview
The Olympiad Admission System is a web-based platform for managing student admissions based on Olympiad performance and branch preferences. It features a React frontend, a Python backend, and uses RESTful APIs for validation and ranking. Data is stored in browser localStorage for session continuity.

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

### 6. SeatAllocation and UploadSeatMatrix
- Upload and manage seat matrix
- Generate and review seat allocations

## Data Flow
1. CSV Upload → Validation (backend) → Store validation data in localStorage
2. Ranking Generation (backend) using validation data
3. Seat Allocation using rankings and seat matrix

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

## Error Handling
- File upload and CSV validation errors
- Backend/API errors
- Data persistence and recovery

## Testing Guidelines
- Unit tests for CSV parsing and validation
- Integration tests for API communication
- UI tests for all major workflows

## Deployment Considerations
- Build with `npm run build`
- Deploy static files to web server
- Ensure backend API is accessible

## Future Development
- Server-side storage integration
- Advanced filtering and export features
- Multi-user collaboration 