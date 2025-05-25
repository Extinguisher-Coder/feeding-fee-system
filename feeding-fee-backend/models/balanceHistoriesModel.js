const mongoose = require('mongoose');

const balanceHistorySchema = new mongoose.Schema({
  cashier: { type: String, required: true },
  lastAmountAccounted: { type: Number, required: true },
  lastAccountedDate: { type: Date, default: Date.now },
  dateOnly: { type: String, required: true }, // YYYY-MM-DD format
  accountant: { type: String, required: true },
});

module.exports = mongoose.model('BalanceHistory', balanceHistorySchema);
