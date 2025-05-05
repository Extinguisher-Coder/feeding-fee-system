const Log = require('../models/Log'); // ✅ Use the correct model

// GET /admin/system-logs
const getSystemLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ timestamp: -1 })
      .limit(100)
      .populate('userId', 'fullName email studentName studentId') // Shows user details
      .lean();

    // Optional: format user name for display
    const formattedLogs = logs.map(log => ({
      timestamp: log.timestamp,
      action: log.action,
      description: log.description,
      user:
        log.userType === 'User'
          ? log.userId?.fullName || 'Unknown Staff'
          : log.userId?.studentName || 'Unknown Student',
      userType: log.userType,
    }));

    res.json(formattedLogs);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ message: 'Failed to retrieve system logs.' });
  }
};

module.exports = {
  getSystemLogs,
};
