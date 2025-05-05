const express = require('express');
const router = express.Router();

const {
  registerStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCount,
} = require('../controllers/studentController');

// Get total students
router.get('/count', getStudentCount);
// Register a new student
router.post('/register', registerStudent);

// Get all students
router.get('/', getAllStudents);

// Get a single student by ID
router.get('/:id', getStudentById);

// Update a student by ID
router.put('/:id', updateStudent);

// Delete a student by ID
router.delete('/:id', deleteStudent);



// ----------------------
// TIME ROUTES
// ----------------------

// Get server time in GMT (UTC) formatted as "21 April 2025, 14:32 GMT"
router.get('/current-time/gmt', (req, res) => {
  const now = new Date(); // current time in UTC by default with toISOString()

  const utcDay = String(now.getUTCDate()).padStart(2, '0');
  const utcMonth = now.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
  const utcYear = now.getUTCFullYear();
  const utcHour = String(now.getUTCHours()).padStart(2, '0');
  const utcMinute = String(now.getUTCMinutes()).padStart(2, '0');

  const gmtTime = `${utcDay} ${utcMonth} ${utcYear}, ${utcHour}:${utcMinute} GMT`;

  res.json({ gmtTime });
});

module.exports = router;
