const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const parentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentName: { type: String, required: true },
  studentClass: { type: String, required: true }
});

// Pre-save hook to hash password only if it's new or changed
parentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Prevent OverwriteModelError
const ParentModel = mongoose.models.Parent || mongoose.model('Parent', parentSchema);

module.exports = ParentModel;
