const express = require('express');
const router = express.Router();
const cashierReconciliationController = require('../controllers/cashierReconciliationController');

// Route for cashier reconciliation summary by week and term
router.get('/cashier-reconciliation', cashierReconciliationController.cashierReconciliation);

module.exports = router;
