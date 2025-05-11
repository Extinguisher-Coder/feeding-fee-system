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

} = require('../controllers/paymentController');

// ----------------------
// PAYMENT ROUTES
// ----------------------

// POST: Make a payment for a student by their ID
router.post('/make/:studentId', makePayment);

// PUT: Mark a week's status (Absent/Omitted) for a student
router.put('/mark-week/:studentId/:weekNumber', markWeekAsStatus);

// GET: Retrieve unpaid students for a specific week (1–18)
router.get('/unpaid/:weekNumber', getUnpaidStudentsByWeek);


// GET: Retrieve all payment records
router.get('/', getAllPayments);

// GET: Payments for a specific student
 router.get('/:studentId', getPaymentsForStudent);

 // GET: Get the grand total collection of all payments
router.get('/payments/grand-total', getGrandTotalCollection);

// PUT: Mark a week's status (Absent/Omitted) for all students
router.put('/mark-week-all/:weekNumber', markWeekAsStatusForAllStudents);


module.exports = router;
