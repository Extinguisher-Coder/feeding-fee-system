const express = require('express');
const router = express.Router();
const { sendReminders } = require('../controllers/reminderController');

// POST /api/reminders/send
router.post('/send', sendReminders);

module.exports = router;
