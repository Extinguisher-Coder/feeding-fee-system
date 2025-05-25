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
  },
  reference: {
    type: String,
    default: 'Cash'  // Default if none is provided
  }
 
});

const historyModel = mongoose.model('History', historySchema);
module.exports = historyModel;
