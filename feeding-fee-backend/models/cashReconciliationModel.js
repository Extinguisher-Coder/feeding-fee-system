const mongoose = require('mongoose');

const cashReconciliationSchema = new mongoose.Schema({
  cashier: {
    type: String,
    required: true,
    unique: true,
  },
  totalAmountAccounted: {
    type: Number,
    default: 0,
  },
  lastAmountAccounted: {
    type: Number,
    required: true,
  },
  lastAccountedDate: {
    type: Date,
    default: Date.now,
  },
  accountant: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('CashReconciliation', cashReconciliationSchema);
