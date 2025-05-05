const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userType' },
  userType: { type: String, enum: ['User', 'Parent'], required: true },
  action: { type: String, required: true }, // e.g., "LOGIN"
  description: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
