# Olympiad-Admission System IIT Kanpur

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
python run.py
```
5. Start the frontend development server:
```bash
cd frontend
npm start  # This will start the React development server
```

# Refer Docs for more detailed documentations.
