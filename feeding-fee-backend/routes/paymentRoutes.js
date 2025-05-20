const express = require('express');
const router = express.Router();

const {
  makePayment,
  getAllPayments,
  getPaymentsForStudent,
  getUnpaidStudentsByWeek,
  getGrandTotalCollection,
  markWeekAsStatus,
  markWeekAsStatusForAllStudents,
  getAbsentStudents,
} = require('../controllers/paymentController');

// ----------------------
// PAYMENT ROUTES
// ----------------------

// MARK STATUS ROUTES (Absent/Omitted)
router.put('/mark-week-all/:weekNumber', markWeekAsStatusForAllStudents); // Mark for all students
router.put('/mark-week/:studentId/:weekNumber', markWeekAsStatus);        // Mark for one student

// REPORTING ROUTES
router.get('/unpaid/:weekNumber', getUnpaidStudentsByWeek);      // Unpaid list for a week
router.get('/absentees', getAbsentStudents);                     // All absent students
router.get('/payments/grand-total', getGrandTotalCollection);   // Total payments collected

// PAYMENT RECORD ROUTES
router.post('/make/:studentId', makePayment);        // Make a payment
router.get('/', getAllPayments);                     // All payment records
router.get('/:studentId', getPaymentsForStudent);    // Payments for a specific student

module.exports = router;
