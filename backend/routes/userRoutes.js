const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getAllStudents,
  getStudentById,
  getDashboardStats
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/stats', protect, getDashboardStats);
router.get('/students', protect, admin, getAllStudents);
router.get('/student/:id', protect, admin, getStudentById);

module.exports = router;
