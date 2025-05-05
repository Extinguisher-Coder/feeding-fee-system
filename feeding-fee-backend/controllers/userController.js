const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel'); // Adjust the path to your User model

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { email, fullName, password, contact, role } = req.body;

  if (!email || !fullName || !password || !contact || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user (no need to hash password here)
    const newUser = new UserModel({
      email,
      fullName,
      password,
      contact,
      role,
    });

    await newUser.save(); // Let the model handle password hashing
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};


// Delete a user
// Delete a user by email
const deleteUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;  // Get email from URL params
    const user = await UserModel.findOneAndDelete({ email });  // Delete by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};


// Change user password using email
const changeUserPassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    // ✅ Just assign the plain password
    user.password = newPassword;

    await user.save(); // Model hashes it
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
};


// Reset a user's password to '...'
const resetUserPassword = async (req, res) => {
  const { email } = req.body;
  const newPassword = '...'; // Default password

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Just assign the plain new password
    user.password = newPassword;

    await user.save(); // Model hashes it
    res.json({ message: 'Password has been reset to default' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password' });
  }
};



// 📌 Get total number of users
const getUserCount = async (req, res) => {
  try {
    const count = await UserModel.countDocuments();
    res.json({ totalUsers: count });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user count' });
  }
};



module.exports = {
  getAllUsers,
  createUser,
  deleteUserByEmail,
  changeUserPassword,
  resetUserPassword,
  getUserCount, 
};
