const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/payment-restriction', settingsController.getPaymentRestriction);
router.put('/payment-restriction', settingsController.updatePaymentRestriction);

module.exports = router;
