// models/dailySubscriberModel.js
const mongoose = require('mongoose');

const dailySubscriberSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cashier: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('DailySubscriber', dailySubscriberSchema);
