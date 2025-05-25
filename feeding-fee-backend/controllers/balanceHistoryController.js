const BalanceHistory = require('../models/balanceHistoriesModel');

// @desc    Get all balance history records
// @route   GET /api/balance-history
// @access  Public or Protected (depending on your auth setup)
exports.getAllBalanceHistories = async (req, res) => {
  try {
    const histories = await BalanceHistory.find().sort({ lastAccountedDate: -1 }); // newest first
    res.status(200).json(histories);
  } catch (error) {
    console.error('Error fetching balance histories:', error);
    res.status(500).json({ error: 'Server error while fetching balance histories.' });
  }
};
