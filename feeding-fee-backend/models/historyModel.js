const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  paymentDate: {
    type: Date,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  classLevel: {
    type: String,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  termName: {
    type: String,
    required: true
  },
  cashier: {
    type: String,
    required: true
  }
});

const historyModel = mongoose.model('History', historySchema);
module.exports = historyModel;
