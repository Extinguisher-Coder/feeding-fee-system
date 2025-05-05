const express = require('express');
const router = express.Router();
const {
  createTerm,
  getAllTerms,
  updateTerm,
  deleteTerm,
  getTermWeeks,
  getCurrentTerm,
} = require('../controllers/termController');

// Create a new term
router.post('/', createTerm);

// Get all terms
router.get('/', getAllTerms);

// Update a term by termName
router.put('/:termName', updateTerm);

// Use _id for deleting the term
router.delete('/:termId', deleteTerm);

// Get number of weeks for a term
router.get('/:termName/weeks', getTermWeeks);

// Get current term
router.get('/current', getCurrentTerm);

module.exports = router;
