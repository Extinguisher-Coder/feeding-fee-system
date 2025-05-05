const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    unique: true,
    required: [true, 'Student ID is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: [true, 'Gender is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required']
  },
  classLevel: {
    type: String,
    required: [true, 'Class level is required']
  },
  guardianName: {
    type: String,
    required: [true, 'Guardian name is required']
  },
  guardianContact: {
    type: String,
    required: [true, 'Guardian contact is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
