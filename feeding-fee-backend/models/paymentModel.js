const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
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
  lastAmountPaid: {
    type: Number,
    default: 0
  },
  totalAmountPaid: {
    type: Number,
    default: 0
  },
  lastPaymentDate: {
    type: Date,
    default: Date.now
  },
  termName: {
    type: String,
    default: ''
  },
  cashier: {
    type: String,
    default: ''
  },
  absenteeism: {
  type: Map,
  of: String,
  default: {} // Example: { Week1: 'Cashier A', Week4: 'Cashier B' }
},

  // Week fields
...(() => {
  const weeks = {};
  for (let i = 1; i <= 18; i++) {
    weeks[`Week${i}`] = { type: mongoose.Schema.Types.Mixed, default: 0 };
  }
  return weeks;
})()

}, {
  timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
