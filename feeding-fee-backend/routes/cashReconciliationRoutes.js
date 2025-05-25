const express = require('express');
const router = express.Router();

const {
  recordCashReconciliation,
  getCashReconciliationSummary,
} = require('../controllers/cashReconciliationController');

// @route   GET /api/cash-reconciliation/summary
// @desc    Get summary comparison for all cashiers
router.get('/summary', getCashReconciliationSummary);

// @route   POST /api/cash-reconciliation/record
// @desc    Record new amount received by accountant from cashier
router.post('/record', recordCashReconciliation);

module.exports = router;
