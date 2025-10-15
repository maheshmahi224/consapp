# Consistency.ai Backend

Backend API for the Student Performance Tracker application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/consistency-ai
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Seed the database (creates default colleges and admin user):
```bash
node seeders/seedColleges.js
```

4. Start the server:
```bash
npm run dev
```

## Default Admin Credentials
- Email: admin@consistency.ai
- Password: admin123

## API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints
- POST `/auth/register` - Register new student
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user (Protected)

### User Endpoints
- GET `/users/profile` - Get user profile (Protected)
- PUT `/users/profile` - Update user profile (Protected)
- GET `/users/stats` - Get dashboard stats (Protected)
- GET `/users/students` - Get all students (Admin only)
- GET `/users/student/:id` - Get student by ID (Admin only)

### Entry Endpoints
- POST `/entries` - Create new entry (Protected)
- GET `/entries` - Get all user entries (Protected)
- GET `/entries/:id` - Get entry by ID (Protected)
- PUT `/entries/:id` - Update entry (Protected)
- DELETE `/entries/:id` - Delete entry (Protected)
- POST `/entries/:id/remark` - Add admin remark (Admin only)
- GET `/entries/analytics/me` - Get user analytics (Protected)

### Admin Endpoints
- GET `/admin/stats` - Get admin dashboard stats (Admin only)
- GET `/admin/leaderboard` - Get leaderboard (Admin only)
- POST `/admin/students/:id/payment` - Update payment (Admin only)

### College Endpoints
- GET `/colleges` - Get all colleges (Public)
- POST `/colleges` - Add new college (Admin only)
- PUT `/colleges/:id` - Update college (Admin only)
- DELETE `/colleges/:id` - Delete college (Admin only)

## Database Models

### User
- name, email, password, phone, year, department, college
- github, leetcode, hackerrank, linkedin, resume
- passionateAbout, amountPaidDates, role, dateOfJoining

### Entry
- userId, date, timeDuration (hours/minutes)
- concepts, githubRepo, leetcodeLink, hackerrankLink
- doubts, problemsPracticed, mood, learningType, tag
- screenshotUrl, adminRemarks

### College
- name, isActive
