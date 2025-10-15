# ⚡ Quick Start - Get Running in 5 Minutes!

## 🎯 Fastest Way to Start

### Windows Users

1. **Open PowerShell or Command Prompt** in the `newapp` folder

2. **Install all dependencies at once:**
```bash
npm run install-all
```

3. **Seed the database:**
```bash
npm run seed
```

4. **Start both servers simultaneously:**
```bash
npm run dev
```

That's it! 🎉

### Manual Start (Alternative)

**Terminal 1 - Backend:**
```bash
cd backend
npm install
node seeders/seedColleges.js
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🌐 Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🔑 Login

**Admin Account:**
- Email: `admin@consistency.ai`
- Password: `admin123`

**Create Student Account:**
- Click "Register" on login page
- Fill the form and submit

## ✅ Verify Installation

1. Open http://localhost:3000
2. You should see the login page
3. Login with admin credentials
4. You should see the admin dashboard

## 🆘 Common Issues

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# OR use MongoDB Atlas cloud database
```

**Port already in use?**
- Close other apps using ports 3000 or 5000
- Or change ports in .env files

**Dependencies error?**
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

## 📚 Next Steps

1. Read [FEATURES.md](FEATURES.md) for complete feature list
2. Check [README.md](README.md) for detailed documentation
3. See [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) for troubleshooting

---

🚀 Happy coding!
