const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const parentModel = require('../models/parentModel');
const recordLog = require('../utils/logger'); // ✅ import logger

// Use a strong secret key, ideally store in .env
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = '12h'; // adjust expiration as needed

const login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required' });
  }

  try {
    // 🔹 Check staff login
    const user = await UserModel.findOne({ email: identifier.toLowerCase() });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, type: 'staff' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // ✅ Log staff login
      await recordLog({
        userId: user._id,
        userType: 'User',
        action: 'LOGIN',
        description: `${user.fullName} (staff) logged in.`,
      });

      return res.status(200).json({
        message: 'Login successful',
        type: 'staff',
        token,
        user: {
          fullName: user.fullName,
          role: user.role,
          email: user.email,
        }
      });
    }

    // 🔹 Check parent login
    const parent = await parentModel.findOne({ studentId: identifier });
    if (parent) {
      const isMatch = await bcrypt.compare(password, parent.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const token = jwt.sign(
        {
          id: parent._id,
          role: 'Student',
          type: 'student',
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // ✅ Log student login
      await recordLog({
        userId: parent._id,
        userType: 'Parent',
        action: 'LOGIN',
        description: `${parent.studentName} (student) logged in.`,
      });

      return res.status(200).json({
        message: 'Login successful',
        type: 'student',
        token,
        student: {
          studentId: parent.studentId,
          studentName: parent.studentName,
          studentClass: parent.studentClass,
        }
      });
    }

    return res.status(404).json({ message: 'No user or student found with that identifier' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

module.exports = { login };
