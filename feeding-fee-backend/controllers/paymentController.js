const Payment = require('../models/paymentModel');
const Student = require('../models/studentModel');
const Term = require('../models/termModel');
const History = require('../models/historyModel');
const distributeWeeks = require('../utils/distributeWeeks'); // ✅ Import helper

// 📌 MAKE PAYMENT
const makePayment = async (req, res) => {
  try {
    const { amount, termName, cashier } = req.body; // ✅ Get cashier from form
    const studentId = req.params.studentId;

    // ✅ Validate input
    if (!amount || !termName || !cashier) {
      return res.status(400).json({ error: 'Amount, term name, and cashier are required' });
    }

    // ✅ Find the payment record for the student
    const payment = await Payment.findOne({ studentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found for this student' });
    }

    // ✅ Optional: Validate term exists
    const term = await Term.findOne({ termName: termName.trim() });
    if (!term) {
      return res.status(400).json({ error: 'Invalid term name' });
    }

    // ✅ Update the payment
    payment.lastAmountPaid = amount;
    payment.totalAmountPaid += amount;
    payment.lastPaymentDate = new Date();
    payment.termName = termName;
    payment.cashier = cashier;

    // ✅ Distribute total amount into Week1–Week18
    const weekDistribution = distributeWeeks(payment.totalAmountPaid);
    for (let i = 1; i <= 18; i++) {
      const weekKey = `Week${i}`;
      payment[weekKey] = weekDistribution[weekKey];
    }

    await payment.save();

    // ✅ Log to history
    const historyRecord = new History({
      paymentDate: new Date(),
      studentId: payment.studentId,
      firstName: payment.firstName,
      lastName: payment.lastName,
      classLevel: payment.classLevel,
      amountPaid: amount,
      termName,
      cashier,
    });

    await historyRecord.save();

    res.status(200).json({
      message: 'Payment successfully processed and history recorded.',
      payment,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed', details: err.message });
  }
};

// 📌 GET all payments (optionally filtered by termName)
const getAllPayments = async (req, res) => {
  try {
    const { termName } = req.query;
    const filter = termName ? { termName } : {};
    const payments = await Payment.find(filter).sort({ lastPaymentDate: -1 });
    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};


// 📌 GET single student payment
const getPaymentsForStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const payment = await Payment.findOne({ studentId });

    if (!payment) {
      return res.status(404).json({ error: 'No payment record found for this student ID' });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.error('Error fetching payment by student ID:', err);
    res.status(500).json({ error: 'Failed to fetch payment', details: err.message });
  }
};

// 📌 GET unpaid students by week
const getUnpaidStudentsByWeek = async (req, res) => {
  const { weekNumber } = req.params;
  const termName = req.query.termName;

  if (!weekNumber || isNaN(weekNumber) || weekNumber < 1 || weekNumber > 18) {
    return res.status(400).json({ error: 'Invalid week number. Must be between 1 and 18.' });
  }

  try {
    const weekKey = `Week${weekNumber}`;
    const filter = {
      [weekKey]: { $in: [0, null] }
    };

    if (termName) {
      filter.termName = termName;
    }

    const unpaidStudents = await Payment.find(filter);
    res.status(200).json(unpaidStudents);
  } catch (err) {
    console.error('Error fetching unpaid students:', err);
    res.status(500).json({ error: 'Failed to fetch unpaid students', details: err.message });
  }
};

// 📌 GET grand total of all payments
const getGrandTotalCollection = async (req, res) => {
  try {
    // Fetch all payment records and calculate the sum of the totalAmountPaid field
    const payments = await Payment.find({});
    const grandTotal = payments.reduce((total, payment) => total + payment.totalAmountPaid, 0);

    res.status(200).json({ grandTotal });
  } catch (err) {
    console.error('Error fetching grand total collection:', err);
    res.status(500).json({ error: 'Failed to calculate grand total collection', details: err.message });
  }
};




// ✅ Export everything properly
module.exports = {
  makePayment,
  getAllPayments,
  getPaymentsForStudent,
  getUnpaidStudentsByWeek,
  getGrandTotalCollection,
};
