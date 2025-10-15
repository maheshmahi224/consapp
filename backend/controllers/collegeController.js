const College = require('../models/College');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true }).sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add new college
// @route   POST /api/colleges
// @access  Private/Admin
const addCollege = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'College name is required' });
    }

    // Check if college already exists
    const existingCollege = await College.findOne({ name });
    if (existingCollege) {
      return res.status(400).json({ message: 'College already exists' });
    }

    const college = await College.create({ name });
    res.status(201).json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/Admin
const updateCollege = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    if (name) college.name = name;
    if (isActive !== undefined) college.isActive = isActive;

    await college.save();
    res.json(college);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    await college.deleteOne();
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllColleges,
  addCollege,
  updateCollege,
  deleteCollege
};
