const express = require('express');
const router = express.Router();
const cashierWeeklyController = require('../controllers/cashierWeeklyController');

// GET /api/cashier-summary/weekly?termName=...
router.get('/weekly', cashierWeeklyController.cashierWeeklySummary);

module.exports = router;
