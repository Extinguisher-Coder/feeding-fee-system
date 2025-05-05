const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// 📌 New route to get today's total collection (placed first to avoid route conflicts)
router.get('/payments/today-collection', historyController.getTodaysCollection);

// Record a new payment history
router.post('/record', historyController.recordPaymentHistory);

// Get all history records
router.get('/', historyController.getAllHistory);

// Get history for a specific day (format: /daily/2025-04-25)
router.get('/daily/:date', historyController.getHistoryByDate);

// Get weekly history (use query params: ?startDate=2025-04-21&endDate=2025-04-25)
router.get('/weekly', historyController.getHistoryByWeek);

// Get all history by cashier name
router.get('/cashier/:name', historyController.getHistoryByCashier);

// Get all history for a specific term
router.get('/term/:termName', historyController.getHistoryByTerm);

// ✅ New route to get history by student ID
router.get('/student/:studentId', historyController.getHistoryByStudent);

// ✅ New route to get total payments grouped by class
router.get('/payments/by-class', historyController.getTotalPaymentsByClass);


module.exports = router;
