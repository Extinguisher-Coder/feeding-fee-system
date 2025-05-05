const Log = require('../models/Log');

const recordLog = async ({ userId, userType, action, description }) => {
  try {
    const log = new Log({ userId, userType, action, description });
    await log.save();
  } catch (err) {
    console.error('Failed to record system log:', err);
  }
};

module.exports = recordLog;
