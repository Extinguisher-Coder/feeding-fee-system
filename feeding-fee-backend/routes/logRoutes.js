const express = require('express');
const router = express.Router();
const { getSystemLogs } = require('../controllers/logController');

// GET /admin/system-logs
router.get('/admin/system-logs', getSystemLogs);

module.exports = router;
