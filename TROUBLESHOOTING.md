# 🔧 Troubleshooting Guide

## Issue: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED ::1:27017`

**Solution:**

### Windows:

1. **Start MongoDB Service:**
```bash
net start MongoDB
```

2. **Or use MongoDB Compass:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`

3. **If MongoDB is not installed:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### Alternative: Use MongoDB Atlas (Cloud Database)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/consistency-ai
```

---

## Issue: react-scripts Broken

**Error:** `npm audit fix --force` downgraded react-scripts to 0.0.0

**Solution:** ✅ Already fixed! Run:
```bash
cd frontend
npm install
```

---

## Issue: concurrently Not Found

**Error:** `'concurrently' is not recognized`

**Solution:**
```bash
# In root directory
npm install
```

---

## Issue: "npm run dev" Not Found in Frontend

**Error:** `Missing script: "dev"`

**Solution:** Frontend uses `npm start`, not `npm run dev`

```bash
cd frontend
npm start
```

---

## ✅ Correct Startup Process

### Step 1: Start MongoDB
```bash
# Windows
net start MongoDB
```

### Step 2: Install Dependencies
```bash
# In root directory
cd C:\Users\DELL\Desktop\newapp
npm install

# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 3: Seed Database
```bash
# In backend directory
cd backend
node seeders/seedColleges.js
```

### Step 4: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```

---

## Quick Commands Reference

**Backend:**
- Start: `npm run dev` or `npm start`
- Seed: `node seeders/seedColleges.js`

**Frontend:**
- Start: `npm start` (NOT `npm run dev`)
- Build: `npm run build`

**Root (if concurrently is installed):**
- Start both: `npm run dev`

---

## Common Errors

### Error: Port already in use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Error: Module not found
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Error: Cannot find module 'react-scripts'
```bash
cd frontend
npm install react-scripts@5.0.1
```
