const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const termRoutes = require('./routes/termRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const historyRoutes = require('./routes/historyRoutes');
const userRoutes = require('./routes/userRoutes');
const parentRoutes = require('./routes/parentRoutes'); 
const authRoutes = require('./routes/authRoutes');
const timeRoute = require('./routes/timeRoute');
const logRoutes = require('./routes/logRoutes');


const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/terms', termRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/time', timeRoute);
app.use('/api', logRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
