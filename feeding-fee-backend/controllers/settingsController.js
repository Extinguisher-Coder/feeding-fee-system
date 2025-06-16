const Setting = require('../models/settingModel');

// GET current payment restriction
exports.getPaymentRestriction = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'paymentRestriction' });
    res.json({ restriction: setting ? setting.value : 'allow' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch setting.' });
  }
};

// UPDATE payment restriction
exports.updatePaymentRestriction = async (req, res) => {
  try {
    const { value } = req.body;
    const updated = await Setting.findOneAndUpdate(
      { key: 'paymentRestriction' },
      { value },
      { upsert: true, new: true }
    );
    res.json({ success: true, restriction: updated.value });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update setting.' });
  }
};
