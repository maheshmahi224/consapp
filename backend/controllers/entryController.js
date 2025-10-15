const Entry = require('../models/Entry');

// @desc    Create a new entry
// @route   POST /api/entries
// @access  Private
const createEntry = async (req, res) => {
  try {
    const {
      date,
      timeDuration,
      concepts,
      githubRepo,
      leetcodeLink,
      hackerrankLink,
      doubts,
      problemsPracticed,
      mood,
      learningType,
      tag,
      screenshotUrl
    } = req.body;

    const entry = await Entry.create({
      userId: req.user._id,
      date: date || new Date(),
      timeDuration: {
        hours: timeDuration?.hours || 0,
        minutes: timeDuration?.minutes || 0
      },
      concepts,
      githubRepo,
      leetcodeLink,
      hackerrankLink,
      doubts,
      problemsPracticed,
      mood,
      learningType,
      tag,
      screenshotUrl
    });

    res.status(201).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all entries for logged-in user
// @route   GET /api/entries
// @access  Private
const getMyEntries = async (req, res) => {
  try {
    const entries = await Entry.find({ userId: req.user._id })
      .sort({ date: -1 })
      .populate('userId', 'name email');
    
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single entry by ID
// @route   GET /api/entries/:id
// @access  Private
const getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('userId', 'name email');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if entry belongs to user or user is admin
    if (entry.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this entry' });
    }

    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update entry
// @route   PUT /api/entries/:id
// @access  Private
const updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if entry belongs to user
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this entry' });
    }

    const {
      date,
      timeDuration,
      concepts,
      githubRepo,
      leetcodeLink,
      hackerrankLink,
      doubts,
      problemsPracticed,
      mood,
      learningType,
      tag,
      screenshotUrl
    } = req.body;

    entry.date = date || entry.date;
    entry.timeDuration = timeDuration || entry.timeDuration;
    entry.concepts = concepts !== undefined ? concepts : entry.concepts;
    entry.githubRepo = githubRepo !== undefined ? githubRepo : entry.githubRepo;
    entry.leetcodeLink = leetcodeLink !== undefined ? leetcodeLink : entry.leetcodeLink;
    entry.hackerrankLink = hackerrankLink !== undefined ? hackerrankLink : entry.hackerrankLink;
    entry.doubts = doubts !== undefined ? doubts : entry.doubts;
    entry.problemsPracticed = problemsPracticed !== undefined ? problemsPracticed : entry.problemsPracticed;
    entry.mood = mood || entry.mood;
    entry.learningType = learningType || entry.learningType;
    entry.tag = tag !== undefined ? tag : entry.tag;
    entry.screenshotUrl = screenshotUrl !== undefined ? screenshotUrl : entry.screenshotUrl;

    const updatedEntry = await entry.save();
    res.json(updatedEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete entry
// @route   DELETE /api/entries/:id
// @access  Private
const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Check if entry belongs to user
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this entry' });
    }

    await entry.deleteOne();
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add admin remark to entry
// @route   POST /api/entries/:id/remark
// @access  Private/Admin
const addAdminRemark = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    entry.adminRemarks.push({
      comment,
      addedBy: req.user._id,
      date: new Date()
    });

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get analytics data
// @route   GET /api/entries/analytics/me
// @access  Private
const getMyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get all entries
    const entries = await Entry.find({ userId }).sort({ date: 1 });

    // Calculate total hours
    const totalHours = entries.reduce((sum, entry) => {
      return sum + (entry.timeDuration.hours || 0) + (entry.timeDuration.minutes || 0) / 60;
    }, 0);

    // Platform usage
    const githubCount = entries.filter(e => e.githubRepo).length;
    const leetcodeCount = entries.filter(e => e.leetcodeLink).length;
    const hackerrankCount = entries.filter(e => e.hackerrankLink).length;

    // Mood distribution
    const moodStats = entries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    // Tag distribution
    const tagStats = entries.reduce((acc, entry) => {
      if (entry.tag) {
        acc[entry.tag] = (acc[entry.tag] || 0) + 1;
      }
      return acc;
    }, {});

    // Last 7 days data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.date);
        return entryDate >= date && entryDate < nextDay;
      });

      const dayHours = dayEntries.reduce((sum, entry) => {
        return sum + (entry.timeDuration.hours || 0) + (entry.timeDuration.minutes || 0) / 60;
      }, 0);

      last7Days.push({
        date: date.toISOString().split('T')[0],
        hours: Math.round(dayHours * 10) / 10,
        entries: dayEntries.length
      });
    }

    res.json({
      totalEntries: entries.length,
      totalHours: Math.round(totalHours * 10) / 10,
      platformUsage: {
        github: githubCount,
        leetcode: leetcodeCount,
        hackerrank: hackerrankCount
      },
      moodDistribution: moodStats,
      tagDistribution: tagStats,
      last7Days
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEntry,
  getMyEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  addAdminRemark,
  getMyAnalytics
};
