// routes/summaryRoutes.js
const express = require('express');
const router = express.Router();
const { getTermWeeklySummary } = require('../controllers/termSummaryController');

router.get('/term-weekly-summary', getTermWeeklySummary);

module.exports = router;
