const User = require('../models/User');
const Entry = require('../models/Entry');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.year = req.body.year || user.year;
      user.department = req.body.department || user.department;
      user.github = req.body.github || user.github;
      user.leetcode = req.body.leetcode || user.leetcode;
      user.hackerrank = req.body.hackerrank || user.hackerrank;
      user.linkedin = req.body.linkedin || user.linkedin;
      user.resume = req.body.resume || user.resume;
      user.passionateAbout = req.body.passionateAbout || user.passionateAbout;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        year: updatedUser.year,
        department: updatedUser.department,
        college: updatedUser.college,
        github: updatedUser.github,
        leetcode: updatedUser.leetcode,
        hackerrank: updatedUser.hackerrank,
        linkedin: updatedUser.linkedin,
        resume: updatedUser.resume,
        passionateAbout: updatedUser.passionateAbout,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all students (Admin only)
// @route   GET /api/users/students
// @access  Private/Admin
const getAllStudents = async (req, res) => {
  try {
    const { college, year, department, search } = req.query;
    
    let query = { role: 'student' };

    if (college) query.college = college;
    if (year) query.year = year;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get student by ID (Admin only)
// @route   GET /api/users/student/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get student's entries
    const entries = await Entry.find({ userId: student._id }).sort({ date: -1 });

    res.json({
      student,
      entries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get current week's entries
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekEntries = await Entry.find({
      userId,
      date: { $gte: startOfWeek }
    });

    // Calculate total hours this week
    const totalHours = weekEntries.reduce((sum, entry) => {
      return sum + (entry.timeDuration.hours || 0) + (entry.timeDuration.minutes || 0) / 60;
    }, 0);

    // Get today's entries
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const todayEntries = await Entry.countDocuments({
      userId,
      date: { $gte: startOfDay }
    });

    // Calculate streak
    const allEntries = await Entry.find({ userId }).sort({ date: -1 });
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let entry of allEntries) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (diffDays > streak) {
        break;
      }
    }

    res.json({
      totalHoursThisWeek: Math.round(totalHours * 10) / 10,
      entriesCount: todayEntries,
      currentStreak: streak,
      weeklyData: weekEntries
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getAllStudents,
  getStudentById,
  getDashboardStats
};
