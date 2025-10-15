const express = require('express');
const router = express.Router();
const {
  getAllColleges,
  addCollege,
  updateCollege,
  deleteCollege
} = require('../controllers/collegeController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAllColleges);
router.post('/', protect, admin, addCollege);
router.put('/:id', protect, admin, updateCollege);
router.delete('/:id', protect, admin, deleteCollege);

module.exports = router;
