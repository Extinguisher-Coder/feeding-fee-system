const express = require('express');
const router = express.Router();

// Import the user controller
const userController = require('../controllers/userController');

// @desc    Get all users
// @route   GET /api/users
router.get('/', userController.getAllUsers);


// @route   GET /api/users/count
router.get('/count', userController.getUserCount);  // 👈 ADD THIS LINE

// @desc    Create a new user
// @route   POST /api/users
router.post('/', userController.createUser);

// @desc    Delete a user
// @route   DELETE /api/users/:id
router.delete('/:email', userController.deleteUserByEmail);


// @desc    Change user password using email
// @route   PUT /api/users/change-password
router.put('/change-password', userController.changeUserPassword);

// @desc    Reset a user's password to '...'
// @route   PUT /api/users/reset-password
router.put('/reset-password', userController.resetUserPassword);

module.exports = router;
