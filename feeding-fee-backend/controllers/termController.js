const Term = require('../models/termModel');

// Create a new term
const createTerm = async (req, res) => {
  try {
    const term = await Term.create(req.body);
    res.status(201).json(term);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create term', details: error.message });
  }
};

// Get all terms
const getAllTerms = async (req, res) => {
  try {
    const terms = await Term.find().sort({ createdAt: -1 });
    res.json(terms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch terms' });
  }
};

// Update a term by termName
const updateTerm = async (req, res) => {
  try {
    const updated = await Term.findOneAndUpdate(
      { termName: req.params.termName },
      req.body,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );
    if (!updated) return res.status(404).json({ error: 'Term not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update term', details: error.message });
  }
};

// Delete a term by _id
const deleteTerm = async (req, res) => {
  try {
    const deleted = await Term.findByIdAndDelete(req.params.termId);
    if (!deleted) return res.status(404).json({ error: 'Term not found' });
    res.json({ message: 'Term deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete term' });
  }
};


// Get numberOfWeeks for a specific term
const getTermWeeks = async (req, res) => {
  try {
    const term = await Term.findOne({ termName: req.params.termName });
    if (!term) return res.status(404).json({ error: 'Term not found' });
    res.json({ termName: term.termName, numberOfWeeks: term.numberOfWeeks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch term weeks' });
  }
};

// Get the current term based on today's date
const getCurrentTerm = async (req, res) => {
  const today = new Date();
  try {
    const currentTerm = await Term.findOne({
      startDate: { $lte: today },
      endDate: { $gte: today },
    });

    if (!currentTerm) {
      return res.status(404).json({ error: 'No active term found' });
    }

    res.json(currentTerm);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current term', details: error.message });
  }
};




module.exports = {
  createTerm,
  getAllTerms,
  updateTerm,
  deleteTerm,
  getTermWeeks,
  getCurrentTerm,
};
