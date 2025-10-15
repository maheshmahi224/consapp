const express = require('express');
const router = express.Router();
const {
  createEntry,
  getMyEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
  addAdminRemark,
  getMyAnalytics
} = require('../controllers/entryController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createEntry);
router.get('/', protect, getMyEntries);
router.get('/analytics/me', protect, getMyAnalytics);
router.get('/:id', protect, getEntryById);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);
router.post('/:id/remark', protect, admin, addAdminRemark);

module.exports = router;
