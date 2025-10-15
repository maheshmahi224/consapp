const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getLeaderboard,
  updatePayment,
  getEntriesTracking,
  getCollegeEntryStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/stats', protect, admin, getAdminStats);
router.get('/leaderboard', protect, admin, getLeaderboard);
router.post('/students/:id/payment', protect, admin, updatePayment);
router.get('/entries', protect, admin, getEntriesTracking);
router.get('/college-stats', protect, admin, getCollegeEntryStats);

module.exports = router;
