const express = require('express');
const router = express.Router();

const { getAllBalanceHistories } = require('../controllers/balanceHistoryController');

router.get('/', getAllBalanceHistories);

module.exports = router;
