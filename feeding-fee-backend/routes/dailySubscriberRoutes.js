const express = require('express');
const router = express.Router();
const dailySubscriberController = require('../controllers/dailySubscriberController');

// ✅ Create a new daily subscriber
router.post('/', dailySubscriberController.createDailySubscriber);

// 📝 Update a subscriber by ID
router.put('/:id', dailySubscriberController.updateDailySubscriber);

// 📊 Get total amount collected
router.get('/total', dailySubscriberController.getTotalCollected);

// 📋 Get all daily subscribers
router.get('/', dailySubscriberController.getAllSubscribers);

module.exports = router;
