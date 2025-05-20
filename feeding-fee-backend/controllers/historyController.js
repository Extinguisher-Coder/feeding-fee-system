const historyModel = require('../models/historyModel');

// ✅ REUSABLE FUNCTION: Save payment history entry
async function saveHistoryEntry({ studentId, firstName, lastName, classLevel, amountPaid, termName, cashier }) {
  const newHistory = new historyModel({
    paymentDate: new Date(),
    studentId,
    firstName,
    lastName,
    classLevel,
    amountPaid,
    termName,
    cashier
  });
  await newHistory.save();
}

// 📌 Record a payment into history (called from routes)
exports.recordPaymentHistory = async (req, res) => {
  try {
    await saveHistoryEntry(req.body); // Save payment history from request body
    res.status(201).json({ message: 'Payment history recorded successfully.' });
  } catch (error) {
    console.error('Error saving payment history:', error);
    res.status(500).json({ error: 'Server error while recording history.' });
  }
};

// 📌 Get all payment history
exports.getAllHistory = async (req, res) => {
  try {
    const history = await historyModel.find().sort({ paymentDate: -1 }); // Sort by payment date, descending
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Server error while fetching history.' });
  }
};

// 📌 Get history by specific date (format: YYYY-MM-DD)
exports.getHistoryByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1); // Get the next day for comparison

    const history = await historyModel.find({
      paymentDate: { $gte: date, $lt: nextDay }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching daily history:', error);
    res.status(500).json({ error: 'Server error while fetching daily history.' });
  }
};

// 📌 Get history by week (expects startDate and endDate in query params)
exports.getHistoryByWeek = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate presence of both dates
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Both startDate and endDate are required.' });
    }

    // Parse dates and validate
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format provided.' });
    }

    // Convert to UTC boundaries
    const utcStart = new Date(Date.UTC(
      start.getUTCFullYear(),
      start.getUTCMonth(),
      start.getUTCDate(),
      0, 0, 0, 0
    ));

    const utcEnd = new Date(Date.UTC(
      end.getUTCFullYear(),
      end.getUTCMonth(),
      end.getUTCDate(),
      23, 59, 59, 999
    ));

    // Query history between UTC range
    const history = await historyModel.find({
      paymentDate: {
        $gte: utcStart,
        $lte: utcEnd
      }
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching weekly history:', error);
    res.status(500).json({ error: 'Server error while fetching weekly history.' });
  }
};


// 📌 Get history by cashier name
exports.getHistoryByCashier = async (req, res) => {
  try {
    const cashier = req.params.name;
    const history = await historyModel.find({ cashier }).sort({ paymentDate: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching cashier history:', error);
    res.status(500).json({ error: 'Server error while fetching cashier history.' });
  }
};

// 📌 Get history by term name
exports.getHistoryByTerm = async (req, res) => {
  try {
    const termName = req.params.termName;
    const history = await historyModel.find({ termName }).sort({ paymentDate: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching term history:', error);
    res.status(500).json({ error: 'Server error while fetching term history.' });
  }
};
// 📌 Get history by student ID
exports.getHistoryByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const history = await historyModel.find({ studentId }).sort({ paymentDate: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching student history:', error);
    res.status(500).json({ error: 'Server error while fetching student history.' });
  }
};


// 📌 Get total collection for today
exports.getTodaysCollection = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of today (00:00:00)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of today (23:59:59)

    // Find payments made today
    const payments = await historyModel.find({
      paymentDate: { $gte: startOfDay, $lt: endOfDay }
    });

    // Calculate total collection
    const totalCollection = payments.reduce((total, payment) => total + payment.amountPaid, 0);

    res.status(200).json({ totalCollection });
  } catch (error) {
    console.error('Error fetching today\'s total collection:', error);
    res.status(500).json({ error: 'Server error while fetching today\'s total collection.' });
  }
};

// 📌 Get total payments grouped by class
exports.getTotalPaymentsByClass = async (req, res) => {
  try {
    const results = await historyModel.aggregate([
      {
        $group: {
          _id: '$classLevel',
          totalCollected: { $sum: '$amountPaid' }
        }
      },
      {
        $sort: { totalCollected: -1 } // Optional: Sort classes by total amount collected
      }
    ]);

    // Format response
    const formatted = results.map(item => ({
      className: item._id,
      totalCollected: item.totalCollected
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error grouping payments by class:', error);
    res.status(500).json({ error: 'Server error while grouping payments by class.' });
  }
};



exports.saveHistoryEntry = saveHistoryEntry;
