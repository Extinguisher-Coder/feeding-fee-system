const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');



// 📌 Get parent details by studentId
router.get('/:studentId', parentController.getParentByStudentId);

// 📌 Update parent password
router.put('/updatePassword', parentController.updateParentPassword);

// 📌 Delete parent by studentId
router.delete('/:studentId', parentController.deleteParent);

// 📌 Parent login
router.post('/login', parentController.parentLogin);

// 📌 Reset parent password (new route)
router.put('/reset-password/:studentId', parentController.resetPassword); // Use parentController.resetPassword

module.exports = router;
