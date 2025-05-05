const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Open to any Parent
router.get('/parent', verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.fullName || req.user.studentName}` });
});

// Only for Admin
router.get('/admin', verifyToken, authorizeRoles('Admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard' });
});

// Only for Cashier and Accountant
router.get('/cashier', verifyToken, authorizeRoles('Cashier', 'Accountant'), (req, res) => {
  res.json({ message: 'Welcome to the Cashier and Accountant Dashboard' });
});

// Only for Registrar
router.get('/registrar', verifyToken, authorizeRoles('Registrar'), (req, res) => {
  res.json({ message: 'Welcome to the Registrar Dashboard' });
});

module.exports = router;
