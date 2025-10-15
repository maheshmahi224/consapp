# Consistency.ai - Student Performance Tracker

A comprehensive MERN stack web application designed to track and analyze the daily learning performance of students. The platform features separate dashboards for students and administrators with JWT authentication, data visualization, and performance analytics.

## 🚀 Features

### For Students
- **Dashboard**: Personalized welcome with weekly performance overview
- **Profile Management**: Update personal info, add professional links (GitHub, LeetCode, HackerRank, LinkedIn)
- **Daily Entry Logging**: Track learning hours, concepts, problems practiced, mood, and more
- **Analytics**: Visual insights with charts showing performance trends, platform usage, and mood distribution
- **Streak Tracking**: Monitor consecutive active days

### For Administrators
- **Dashboard**: Overview of total students, active users, and entries
- **Student Management**: View all students with filtering by college, year, and department
- **Detailed Student Profiles**: Access complete student information and daily logs
- **Add Remarks**: Leave comments on student entries
- **Leaderboard**: Rank students by hours and consistency (All-time, Weekly, Monthly)
- **College Management**: Add, edit, or remove colleges from the system

### General Features
- **Secure Authentication**: JWT-based login/registration with bcrypt password encryption
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Data Visualization**: Charts using Recharts
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server and API
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Lucide React** - Icons

## 📋 Prerequisites

Before running this application, ensure you have:
- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
cd newapp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/consistency-ai
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
```

**Seed the database** (adds default colleges and admin user):
```bash
node seeders/seedColleges.js
```

**Start the backend server**:
```bash
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the frontend**:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 👤 Default Admin Credentials

After seeding the database:
- **Email**: `admin@consistency.ai`
- **Password**: `admin123`

## 📁 Project Structure

```
newapp/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── entryController.js
│   │   ├── adminController.js
│   │   └── collegeController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Entry.js
│   │   └── College.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── entryRoutes.js
│   │   ├── adminRoutes.js
│   │   └── collegeRoutes.js
│   ├── seeders/
│   │   └── seedColleges.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── Sidebar.js
    │   │   ├── StatCard.js
    │   │   └── ProtectedRoute.js
    │   ├── context/
    │   │   ├── AuthContext.js
    │   │   └── ThemeContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── student/
    │   │   │   ├── Dashboard.js
    │   │   │   ├── Profile.js
    │   │   │   ├── Entries.js
    │   │   │   └── Analytics.js
    │   │   └── admin/
    │   │       ├── Dashboard.js
    │   │       ├── Students.js
    │   │       ├── Leaderboard.js
    │   │       └── Settings.js
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get dashboard stats
- `GET /api/users/students` - Get all students (Admin)
- `GET /api/users/student/:id` - Get student by ID (Admin)

### Entries
- `POST /api/entries` - Create new entry
- `GET /api/entries` - Get all user entries
- `GET /api/entries/:id` - Get entry by ID
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `POST /api/entries/:id/remark` - Add admin remark (Admin)
- `GET /api/entries/analytics/me` - Get user analytics

### Admin
- `GET /api/admin/stats` - Get admin dashboard stats
- `GET /api/admin/leaderboard` - Get leaderboard
- `POST /api/admin/students/:id/payment` - Update student payment

### Colleges
- `GET /api/colleges` - Get all colleges
- `POST /api/colleges` - Add new college (Admin)
- `PUT /api/colleges/:id` - Update college (Admin)
- `DELETE /api/colleges/:id` - Delete college (Admin)

## 🎨 Key Features Explained

### Student Dashboard
- Weekly hours studied
- Number of entries today
- Current streak counter
- Weekly performance chart
- Quick action cards

### Daily Entry Form
Students can log:
- Date and time duration
- Concepts learned
- GitHub repo links
- LeetCode/HackerRank problem links
- Doubts faced
- Problems practiced
- Mood/focus level (Excellent/Good/Average/Poor)
- Learning type (Self-study/Peer-learning/Mentor-guided)
- Topic tags (DSA, Web Dev, AI, etc.)

### Analytics Dashboard
- Total hours and entries
- Last 7 days activity chart
- Platform usage (GitHub, LeetCode, HackerRank)
- Mood distribution pie chart
- Topics covered bar chart
- Key insights

### Admin Features
- View all students in card layout
- Filter by college, year, department
- Search by name or email
- View detailed student profiles with all entries
- Add remarks/comments on student logs
- Leaderboard with timeframe filters
- Manage colleges (add/edit/delete)

## 🎯 Future Enhancements

- Email reminders for inactive students
- Gamification badges (7-Day Streak, Consistency Star, etc.)
- Export data as CSV/PDF
- AI-powered summaries using Gemini/GPT API
- File upload for screenshots
- Notification system
- Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for tracking student learning consistency
