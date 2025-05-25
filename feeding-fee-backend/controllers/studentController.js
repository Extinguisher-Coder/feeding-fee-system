const Student = require('../models/studentModel');
const ParentModel = require('../models/parentModel'); // Import parent model
const Counter = require('../models/counterModel'); // 🔥 Import the counter model
const paymentModel = require('../models/paymentModel'); // ✅ New: Import payment model
const bcrypt = require('bcryptjs'); // For password hashing

// 📌 CREATE - Register a new student
const registerStudent = async (req, res) => {
  try {
    // ✅ Step 1: Get or initialize counter
    let counter = await Counter.findOne({ name: 'studentId' });
    if (!counter) {
      counter = await Counter.create({ name: 'studentId', value: 1 });
    }

    // ✅ Step 2: Generate ID using counter value
    const padded = String(counter.value).padStart(3, '0');
    const year = new Date().getFullYear();
    const studentId = `STD-${year}-${padded}`;

    // ✅ Step 3: Create and save new student
    const newStudent = new Student({
      studentId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dob: req.body.dob,
      age: req.body.age,
      classLevel: req.body.classLevel,
      guardianName: req.body.guardianName,
      guardianContact: req.body.guardianContact
    });

    await newStudent.save();

    // ✅ ADD: Create initial payment record for student
    await paymentModel.create({
      studentId: newStudent.studentId,
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      classLevel: newStudent.classLevel,
      lastAmountPaid: 0,
      totalAmountPaid: 0,
      lastPaymentDate: new Date(),
      termName: 'Term 3 2025', // Set a default or fetch the current term
      cashier: req.user?.name || 'Admin', // fallback if no logged-in user
    });

    const newParent = new ParentModel({
      studentId: newStudent.studentId,
      password: newStudent.studentId, // ✅ Plain value, model will hash it
      studentName: `${newStudent.firstName} ${newStudent.lastName}`,
      studentClass: newStudent.classLevel,
    });
    await newParent.save();
    


    // ✅ Step 4: Increment counter for next use
    counter.value += 1;
    await counter.save();

    res.status(201).json({ message: 'Student and Parent registered successfully', student: newStudent });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
};

// 📌 READ - Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// 📌 READ - Get a single student
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ error: 'Student not found' });

    // ✅ Update Payment Record
    await paymentModel.findOneAndUpdate(
      { studentId: updatedStudent.studentId },
      {
        firstName: updatedStudent.firstName,
        lastName: updatedStudent.lastName,
        classLevel: updatedStudent.classLevel
      }
    );

    // ✅ Update Parent Record
    await ParentModel.findOneAndUpdate(
      { studentId: updatedStudent.studentId },
      {
        studentName: `${updatedStudent.firstName} ${updatedStudent.lastName}`,
        studentClass: updatedStudent.classLevel
      }
    );

    res.json({ message: 'Student (and related records) updated successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};


const recordLog = require('../utils/logger'); // ✅ Import the logger utility

// 📌 DELETE - Remove student
const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });

    // ✅ Log the deletion activity (only if staff is logged in)
    if (req.user && req.user.type === 'staff') {
      await recordLog({
        userId: req.user.id,
        userType: 'User',
        action: 'DELETE_STUDENT',
        description: `Deleted student ${deleted.firstName} ${deleted.lastName} (${deleted.studentId})`
      });
    }

    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};


// 📌 READ - Get total number of students
const getStudentCount = async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student count' });
  }
};




module.exports = {
  registerStudent,
  getAllStudents,  // <-- This is the method that was missing in the previous version
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentCount,
};
