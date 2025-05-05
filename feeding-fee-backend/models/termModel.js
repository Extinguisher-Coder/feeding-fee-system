const mongoose = require('mongoose');

const calculateWeeks = (start, end) => {
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const diffInMs = end - start;
  return Math.ceil(diffInMs / msPerWeek);
};

const termSchema = new mongoose.Schema({
  termName: {
    type: String,
    required: [true, 'Term name is required'],
    unique: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  weeklyFee: {
    type: Number,
    required: true,
    default: 50,
    min: [0, 'Weekly fee must be a positive number'],
  },
  numberOfWeeks: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware for create and update
termSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    this.numberOfWeeks = calculateWeeks(this.startDate, this.endDate);
  }
  next();
});

// Pre-update middleware for findOneAndUpdate and updateOne
termSchema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
  const update = this.getUpdate();
  if (update.startDate && update.endDate) {
    const weeks = calculateWeeks(new Date(update.startDate), new Date(update.endDate));
    update.numberOfWeeks = weeks > 0 ? weeks : 0;
  }
  next();
});

module.exports = mongoose.model('Term', termSchema);
