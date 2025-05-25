const CashReconciliation = require('../models/cashReconciliationModel');
const BalanceHistory = require('../models/balanceHistoriesModel');
const History = require('../models/historyModel');

// Utility to get date in YYYY-MM-DD format
const getDateOnly = (date) => {
  return date.toISOString().split('T')[0];
};

// @desc    Record new amount received by accountant from cashier
// @route   POST /api/cash-reconciliation/record
exports.recordCashReconciliation = async (req, res) => {
  try {
    const { cashier, lastAmountAccounted, accountant } = req.body;

    if (!cashier || !lastAmountAccounted || !accountant) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const serverDate = new Date();
    const dateOnly = getDateOnly(serverDate);

    // Update or create CashReconciliation record
    const reconciliation = await CashReconciliation.findOneAndUpdate(
      { cashier },
      {
        $inc: { totalAmountAccounted: lastAmountAccounted },
        $set: {
          lastAmountAccounted,
          lastAccountedDate: serverDate,
          accountant,
        },
      },
      { new: true, upsert: true }
    );

    // Insert into BalanceHistory
    const history = new BalanceHistory({
      cashier,
      lastAmountAccounted,
      lastAccountedDate: serverDate,
      dateOnly,
      accountant,
    });
    await history.save();

    res.status(200).json({ message: 'Recorded successfully', reconciliation });
  } catch (err) {
    console.error('Recording error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get summary comparison for all cashiers
// @route   GET /api/cash-reconciliation/summary
exports.getCashReconciliationSummary = async (req, res) => {
  try {
    // Get all distinct cashiers from histories
    const cashiers = await History.distinct('cashier');

    const summary = await Promise.all(
      cashiers.map(async (cashier) => {
        const recorded = await History.aggregate([
          { $match: { cashier } },
          { $group: { _id: null, total: { $sum: '$amountPaid' } } },
        ]);

        const recordedTotal = recorded[0]?.total || 0;

        const reconciliation = await CashReconciliation.findOne({ cashier });

        const handedOver = reconciliation?.totalAmountAccounted || 0;
        const difference = handedOver - recordedTotal;

        let status = 'Balanced';
        if (difference < 0) status = 'Unbalanced';
        if (difference > 0) status = 'Over Balanced';

        return {
          cashier,
          recordedTotal,
          handedOver,
          difference,
          status,
          lastAccountedDate: reconciliation?.lastAccountedDate || null,
          accountant: reconciliation?.accountant || null,
        };
      })
    );

    res.status(200).json(summary);
  } catch (err) {
    console.error('Summary comparison error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
