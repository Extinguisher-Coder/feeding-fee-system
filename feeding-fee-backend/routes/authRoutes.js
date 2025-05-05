const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // make sure this path matches your structure

// POST /api/auth/login
router.post('/login', login);

module.exports = router;
