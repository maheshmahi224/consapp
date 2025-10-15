# Consistency.ai Frontend

React frontend for the Student Performance Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. (Optional) Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features

### Student Features
- Dashboard with weekly stats and performance charts
- Profile management with professional links
- Daily entry logging system
- Analytics with multiple chart visualizations
- Dark/Light mode toggle

### Admin Features
- Overview dashboard with student statistics
- Student management with filtering and search
- Detailed student profiles with entry logs
- Add remarks to student entries
- Leaderboard with timeframe filters
- College management system

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Recharts for data visualization
- Axios for API calls
- React Toastify for notifications
- Lucide React for icons
- Context API for state management

## Folder Structure

- `/src/components` - Reusable UI components
- `/src/context` - React Context providers
- `/src/pages` - Page components
- `/src/utils` - Utility functions and API config
