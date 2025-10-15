const User = require('../models/User');
const Entry = require('../models/Entry');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Active students today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const activeToday = await Entry.distinct('userId', {
      date: { $gte: startOfDay }
    });

    // Total entries
    const totalEntries = await Entry.countDocuments();

    // Entries this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const entriesThisWeek = await Entry.countDocuments({
      date: { $gte: startOfWeek }
    });

    // Top performers (by hours)
    const topPerformers = await Entry.aggregate([
      {
        $group: {
          _id: '$userId',
          totalHours: {
            $sum: {
              $add: [
                '$timeDuration.hours',
                { $divide: ['$timeDuration.minutes', 60] }
              ]
            }
          },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          college: '$user.college',
          year: '$user.year',
          totalHours: { $round: ['$totalHours', 1] },
          entryCount: 1
        }
      }
    ]);

    // College distribution
    const collegeStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$college', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalStudents,
      activeTodayCount: activeToday.length,
      totalEntries,
      entriesThisWeek,
      topPerformers,
      collegeStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get leaderboard
// @route   GET /api/admin/leaderboard
// @access  Private/Admin
const getLeaderboard = async (req, res) => {
  try {
    const { timeframe = 'all' } = req.query;
    
    let dateFilter = {};
    if (timeframe === 'week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { date: { $gte: startOfWeek } };
    } else if (timeframe === 'month') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      dateFilter = { date: { $gte: startOfMonth } };
    }

    const leaderboard = await Entry.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          totalHours: {
            $sum: {
              $add: [
                '$timeDuration.hours',
                { $divide: ['$timeDuration.minutes', 60] }
              ]
            }
          },
          entryCount: { $sum: 1 }
        }
      },
      { $sort: { totalHours: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          college: '$user.college',
          year: '$user.year',
          totalHours: { $round: ['$totalHours', 1] },
          entryCount: 1
        }
      }
    ]);

    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update student payment
// @route   POST /api/admin/students/:id/payment
// @access  Private/Admin
const updatePayment = async (req, res) => {
  try {
    const { amount, paymentMode } = req.body;
    
    const student = await User.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.amountPaidDates.push({
      amount,
      date: new Date(),
      paymentMode
    });

    await student.save();
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all entries with filters (for entry tracking panel)
// @route   GET /api/admin/entries
// @access  Private/Admin
const getEntriesTracking = async (req, res) => {
  try {
    const { college, date, startDate, endDate } = req.query;
    
    let filter = {};
    
    // Build entry filter
    let entryFilter = {};
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      entryFilter.date = { $gte: selectedDate, $lt: nextDay };
    } else if (startDate && endDate) {
      entryFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    // Get entries with user details
    const entries = await Entry.find(entryFilter)
      .populate({
        path: 'userId',
        match: college ? { college: college } : {},
        select: 'name email college year department phone github leetcode hackerrank'
      })
      .sort({ date: -1 })
      .lean();
    
    // Filter out entries where user didn't match (due to college filter)
    const filteredEntries = entries.filter(entry => entry.userId !== null);
    
    res.json(filteredEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get college-wise entry statistics
// @route   GET /api/admin/college-stats
// @access  Private/Admin
const getCollegeEntryStats = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Set date filter for today if not specified
    let dateFilter = {};
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      dateFilter = { date: { $gte: selectedDate, $lt: nextDay } };
    } else {
      // Default to today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateFilter = { date: { $gte: today, $lt: tomorrow } };
    }
    
    // Get entries for the date
    const entries = await Entry.find(dateFilter)
      .populate('userId', 'college')
      .lean();
    
    // Group by college
    const collegeStats = {};
    entries.forEach(entry => {
      if (entry.userId && entry.userId.college) {
        const college = entry.userId.college;
        if (!collegeStats[college]) {
          collegeStats[college] = {
            college: college,
            studentCount: new Set(),
            entryCount: 0
          };
        }
        collegeStats[college].studentCount.add(entry.userId._id.toString());
        collegeStats[college].entryCount++;
      }
    });
    
    // Convert to array
    const statsArray = Object.values(collegeStats).map(stat => ({
      college: stat.college,
      studentCount: stat.studentCount.size,
      entryCount: stat.entryCount
    }));
    
    res.json(statsArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAdminStats,
  getLeaderboard,
  updatePayment,
  getEntriesTracking,
  getCollegeEntryStats
};
