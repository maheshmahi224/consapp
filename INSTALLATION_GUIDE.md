# 🚀 Quick Installation Guide - Consistency.ai

Follow these steps to get your application running in minutes!

## Prerequisites Checklist
- [ ] Node.js (v14+) installed - [Download](https://nodejs.org/)
- [ ] MongoDB installed or MongoDB Atlas account - [Download](https://www.mongodb.com/try/download/community)
- [ ] Git installed (optional)

## Step-by-Step Installation

### Step 1: Verify Prerequisites

Open your terminal/command prompt and check:

```bash
node --version
# Should show v14.x.x or higher

npm --version
# Should show 6.x.x or higher

mongod --version
# Should show MongoDB version (if using local MongoDB)
```

### Step 2: Start MongoDB

**Option A - Local MongoDB (Windows):**
```bash
# Start MongoDB service
net start MongoDB
```

**Option B - MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `backend/.env` with your Atlas connection string

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- And other dependencies...

### Step 4: Configure Backend

The `.env` file is already created. Update if needed:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/consistency-ai
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

**For MongoDB Atlas**, change MONGO_URI to:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/consistency-ai?retryWrites=true&w=majority
```

### Step 5: Seed the Database

This creates default colleges and an admin account:

```bash
node seeders/seedColleges.js
```

You should see:
```
✓ MongoDB Connected
✓ Colleges seeded successfully
✓ Admin user created: admin@consistency.ai / admin123
```

### Step 6: Start Backend Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

**Keep this terminal open!**

### Step 7: Install Frontend Dependencies

Open a **NEW terminal** window:

```bash
cd frontend
npm install
```

This will install:
- react
- react-router-dom
- tailwindcss
- recharts
- axios
- react-toastify
- And other dependencies...

### Step 8: Start Frontend Application

```bash
npm start
```

The app will automatically open in your browser at:
```
http://localhost:3000
```

## 🎉 Success! Your App is Running

You should now see:
- **Backend**: Running on http://localhost:5000
- **Frontend**: Running on http://localhost:3000

## 🔐 Login Credentials

### Admin Account
- Email: `admin@consistency.ai`
- Password: `admin123`

### Test Student Account
Register a new student account through the registration page!

## 🛠️ Troubleshooting

### Backend won't start?

**Error: "Cannot connect to MongoDB"**
```bash
# Solution 1: Make sure MongoDB is running
mongod

# Solution 2: Check if MongoDB service is active
net start MongoDB
```

**Error: "Port 5000 is already in use"**
```bash
# Solution: Change the port in backend/.env
PORT=5001
```

### Frontend won't start?

**Error: "Port 3000 is already in use"**
```bash
# Solution: The terminal will ask if you want to use a different port
# Type 'y' and press Enter
```

**Error: "Module not found"**
```bash
# Solution: Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Database issues?

**Clear and reseed the database:**
```bash
# In MongoDB shell or MongoDB Compass
use consistency-ai
db.dropDatabase()

# Then reseed
node seeders/seedColleges.js
```

## 📱 Testing the Application

1. **Register a Student:**
   - Go to http://localhost:3000/register
   - Fill in the form
   - Select "SCIENT INSTITUTE OF TECHNOLOGY" as college
   - Submit

2. **Login as Student:**
   - Use your registered email and password
   - Explore the student dashboard

3. **Add a Daily Entry:**
   - Click "Add Entry" button
   - Fill in your learning details
   - Submit

4. **View Analytics:**
   - Navigate to Analytics page
   - See your performance charts

5. **Login as Admin:**
   - Logout from student account
   - Login with admin@consistency.ai / admin123
   - Explore admin features

## 🚀 Next Steps

- [ ] Change the default admin password
- [ ] Update JWT_SECRET in production
- [ ] Add more colleges via Admin Settings
- [ ] Invite students to register
- [ ] Explore all features!

## 💡 Useful Commands

### Backend
```bash
# Start with auto-reload (development)
npm run dev

# Start production server
npm start

# Reseed database
node seeders/seedColleges.js
```

### Frontend
```bash
# Start development server
npm start

# Create production build
npm run build

# Run tests
npm test
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🆘 Need Help?

If you encounter any issues:
1. Check the console/terminal for error messages
2. Verify all dependencies are installed
3. Make sure MongoDB is running
4. Check that ports 5000 and 3000 are available
5. Review the README.md file

---

Happy tracking! 🎯
