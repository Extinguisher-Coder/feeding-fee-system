const DailySubscriber = require('../models/dailySubscriberModel');

// ✅ 1. Record a new subscriber
exports.createDailySubscriber = async (req, res) => {
  try {
    const { firstname, lastname, class: studentClass, amount, cashier } = req.body;

    const newSubscriber = new DailySubscriber({
      firstname,
      lastname,
      class: studentClass,
      amount,
      cashier,
      paymentDate: new Date(), // always use server-side date
    });

    await newSubscriber.save();
    res.status(201).json({ message: 'Subscriber recorded successfully', data: newSubscriber });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record subscriber', error: error.message });
  }
};

// 📝 2. Edit a subscriber
exports.updateDailySubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, class: studentClass, amount, cashier } = req.body;

    const updated = await DailySubscriber.findByIdAndUpdate(
      id,
      { firstname, lastname, class: studentClass, amount, cashier },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json({ message: 'Subscriber updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update subscriber', error: error.message });
  }
};

// 📊 3. Get total amount collected
exports.getTotalCollected = async (req, res) => {
  try {
    const result = await DailySubscriber.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const total = result.length > 0 ? result[0].totalAmount : 0;
    res.status(200).json({ totalAmount: total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to calculate total amount', error: error.message });
  }
};

// 📋 4. Get all subscribers
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await DailySubscriber.find().sort({ paymentDate: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscribers', error: error.message });
  }
};
