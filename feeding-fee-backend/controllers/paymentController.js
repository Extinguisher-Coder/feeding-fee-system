const axios = require('axios');
const Payment = require('../models/paymentModel');
const Student = require('../models/studentModel');
const Term = require('../models/termModel');
const History = require('../models/historyModel');
const distributeWeeks = require('../utils/distributeWeeks'); // ✅ Import helper

// 📌 MAKE PAYMENT

const makePayment = async (req, res) => {
  try {
    const { amount, termName, cashier, reference } = req.body;
    const studentId = req.params.studentId;

    if (!amount || !termName || !cashier) {
      return res.status(400).json({ error: 'Amount, term name, and cashier are required' });
    }

    const payment = await Payment.findOne({ studentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found for this student' });
    }

    const term = await Term.findOne({ termName: termName.trim() });
    if (!term) {
      return res.status(400).json({ error: 'Invalid term name' });
    }

    // Update payment
    payment.lastAmountPaid = amount;
    payment.totalAmountPaid += amount;
    payment.lastPaymentDate = new Date();
    payment.termName = termName;
    payment.cashier = cashier;

    const weekDistribution = distributeWeeks(payment.totalAmountPaid, payment);
    for (let i = 1; i <= 18; i++) {
      const weekKey = `Week${i}`;
      payment[weekKey] = weekDistribution[weekKey];
    }

    await payment.save();

    // Save to history
    const historyRecord = new History({
      paymentDate: new Date(),
      studentId: payment.studentId,
      firstName: payment.firstName,
      lastName: payment.lastName,
      classLevel: payment.classLevel,
      amountPaid: amount,
      termName,
      cashier,
      reference,
    });
    await historyRecord.save();

    // Fetch student data and send SMS
    const student = await Student.findOne({ studentId });
    if (student?.guardianContact) {

       const dateObj = new Date(payment.lastPaymentDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',    // Apr
                day: 'numeric',    // 20
                year: 'numeric'    // 2025
              });

              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true       // AM/PM format
                    });
      
                    const messageText = `Dear Parent/Guardian,
Feeding Fee Payment of GHS ${amount} for ${student.firstName} ${student.lastName} (${student.classLevel}) has been received successfully on ${formattedDate} at ${formattedTime}. For any concerns, call: 0242382484. Thank you.`;

      const host = 'api.smsonlinegh.com';
      const endPoint = `https://${host}/v5/message/sms/send`;

      const smsPayload = {
        text: messageText,
        type: 0,
        sender: process.env.SMS_SENDER, 
        destinations: [student.guardianContact]
      };

      const smsResponse = await axios.request({
        method: 'POST',
        url: endPoint,
        data: smsPayload,
        headers: {
          'Host': host,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `key ${process.env.SMS_API_KEY}`
        }
      });

      if (smsResponse.status === 200) {
        console.log('SMS Sent:', smsResponse.data.data);
      } else {
        console.warn('SMS send failed with status:', smsResponse.status);
      }
    }

    res.status(200).json({
      message: 'Payment processed, history recorded, and SMS sent.',
      payment,
    });

  } catch (err) {
    console.error('Payment error:', err);
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


// 📌 MARK WEEK AS ABSENT OR OMITTED (Single Student)
const markWeekAsStatus = async (req, res) => {
  const { studentId, weekNumber } = req.params;
  const { status, cashier } = req.body;

  if (!['Absent', 'Omitted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "Absent" or "Omitted"' });
  }

  if (!cashier || typeof cashier !== 'string') {
    return res.status(400).json({ error: 'Cashier name is required and must be a string.' });
  }

  const weekNum = parseInt(weekNumber, 10);
  if (isNaN(weekNum) || weekNum < 1 || weekNum > 18) {
    return res.status(400).json({ error: 'Invalid week number. Must be 1–18.' });
  }

  try {
    const payment = await Payment.findOne({ studentId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found for this student' });
    }

    const weekKey = `Week${weekNum}`;

    // Set the week as Absent/Omitted
    payment[weekKey] = status;

    // Track who made the update
    payment.absenteeism.set(weekKey, cashier);

    // Redistribute remaining amount to non-static weeks
    const redistributed = distributeWeeks(payment.totalAmountPaid, payment);

    for (let i = 1; i <= 18; i++) {
  const key = `Week${i}`;
  // ✅ Do NOT overwrite static status weeks
  if (payment[key] === 'Absent' || payment[key] === 'Omitted') continue;
  payment[key] = redistributed[key];
}


    await payment.save();

    res.status(200).json({
      message: `Marked ${weekKey} as "${status}" for student ${studentId} and redistributed payments.`,
      payment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update week status', details: err.message });
  }
};

// 📌 MARK WEEK AS ABSENT OR OMITTED FOR ALL STUDENTS
const markWeekAsStatusForAllStudents = async (req, res) => {
  const { weekNumber } = req.params;
  const { status, cashier } = req.body;

  if (!['Absent', 'Omitted'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be "Absent" or "Omitted"' });
  }

  if (!cashier || typeof cashier !== 'string') {
    return res.status(400).json({ error: 'Cashier name is required and must be a string.' });
  }

  const weekNum = parseInt(weekNumber, 10);
  if (isNaN(weekNum) || weekNum < 1 || weekNum > 18) {
    return res.status(400).json({ error: 'Invalid week number. Must be 1–18.' });
  }

  const weekKey = `Week${weekNum}`;

  try {
    const payments = await Payment.find();

    const updates = payments.map(async (payment) => {
      payment[weekKey] = status;
      payment.absenteeism.set(weekKey, cashier);

      const redistributed = distributeWeeks(payment.totalAmountPaid, payment);

      for (let i = 1; i <= 18; i++) {
  const key = `Week${i}`;
  if (payment[key] === 'Absent' || payment[key] === 'Omitted') continue;
  payment[key] = redistributed[key];
}


      return payment.save();
    });

    await Promise.all(updates);

    res.status(200).json({
      message: `All students marked as "${status}" for ${weekKey} by ${cashier}, and payments redistributed.`,
      week: weekKey,
      status,
      cashier,
      count: payments.length
    });
  } catch (err) {
    console.error('Error marking week for all students:', err);
    res.status(500).json({ error: 'Failed to mark week for all students', details: err.message });
  }
};

const getAbsentStudents = async (req, res) => {
  try {
    const payments = await Payment.find();

    const absentList = payments
      .map((payment) => {
        const absentWeeks = [];

        // Loop through Week1 to Week18
        for (let i = 1; i <= 18; i++) {
          const weekKey = `Week${i}`;
          if (payment[weekKey] === 'Absent') {
            const cashier = payment.absenteeism?.get(weekKey) || 'N/A';
            absentWeeks.push(`${weekKey} (${cashier})`);
          }
        }

        if (absentWeeks.length > 0) {
          return {
            studentId: payment.studentId,
            firstName: payment.firstName,
            lastName: payment.lastName,
            classLevel: payment.classLevel,
            absenteeism: absentWeeks.join(', ')
          };
        }

        return null;
      })
      .filter(Boolean); // remove nulls

    res.status(200).json(absentList);
  } catch (error) {
    console.error('Error fetching absent students:', error);
    res.status(500).json({ message: 'Failed to fetch absent students' });
  }
};


// ✅ Export everything properly
module.exports = {
  makePayment,
  markWeekAsStatus,
  markWeekAsStatusForAllStudents,
  getAllPayments,
  getPaymentsForStudent,
  getUnpaidStudentsByWeek,
  getGrandTotalCollection,
  getAbsentStudents,
};
