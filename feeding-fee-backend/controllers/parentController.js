const ParentModel = require('../models/parentModel');
const bcrypt = require('bcryptjs');

// 📌 READ - Get parent details by studentId
const getParentByStudentId = async (req, res) => {
  try {
    const parent = await ParentModel.findOne({ studentId: req.params.studentId });
    if (!parent) return res.status(404).json({ error: 'Parent not found for this student' });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching parent details' });
  }
};

// 📌 UPDATE - Update parent password
const updateParentPassword = async (req, res) => {
  try {
    const { studentId, oldPassword, newPassword } = req.body;

    const parent = await ParentModel.findOne({ studentId });
    if (!parent) return res.status(404).json({ error: 'Parent not found for this student' });

    const isMatch = await bcrypt.compare(oldPassword, parent.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // ❌ Don't hash manually — let model hook handle it
    parent.password = newPassword;
    await parent.save();

    res.json({ message: 'Parent password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update password', details: err.message });
  }
};


// 📌 DELETE - Delete a parent by studentId
const deleteParent = async (req, res) => {
  try {
    const parent = await ParentModel.findOneAndDelete({ studentId: req.params.studentId });
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json({ message: 'Parent deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete parent', details: err.message });
  }
};

// 📌 LOGIN - Parent login (validate password)
const parentLogin = async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const parent = await ParentModel.findOne({ studentId });
    if (!parent) return res.status(404).json({ error: 'Parent not found for this student' });

    const isMatch = await bcrypt.compare(password, parent.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    res.json({ message: 'Parent login successful', parentId: parent._id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// 📌 RESET PASSWORD - Reset the parent's password based on student ID
const resetPassword = async (req, res) => {
  try {
    const { studentId } = req.params;

    const parent = await ParentModel.findOne({ studentId });
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found for this student' });
    }

    // ❌ Don't hash manually
    parent.password = studentId; // or some default password logic
    await parent.save();

    res.status(200).json({ message: 'Password successfully reset' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting password', details: err.message });
  }
};


module.exports = {
  getParentByStudentId,
  updateParentPassword,
  deleteParent,
  parentLogin,
  resetPassword,
};
