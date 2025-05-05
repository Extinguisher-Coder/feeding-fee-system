// routes/timeRoute.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const serverDate = new Date();
  res.json({ serverDate });
});

module.exports = router;
