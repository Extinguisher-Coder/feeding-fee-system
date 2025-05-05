import React, { useState, useEffect } from 'react';
import './AddTermForm.css';
import API_BASE_URL from '../../../config';

const AddTermForm = ({ onCancel, fetchTerms, editTerm }) => {
  const [termData, setTermData] = useState({
    termName: '',
    startDate: '',
    endDate: '',
    weeklyFee: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (editTerm) {
      setTermData({
        termName: editTerm.termName,
        startDate: editTerm.startDate.slice(0, 10),
        endDate: editTerm.endDate.slice(0, 10),
        weeklyFee: editTerm.weeklyFee,
      });
    }
  }, [editTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTermData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editTerm
      ? `${API_BASE_URL}/terms/${editTerm.termName}` // Correct URL format for update
      : `${API_BASE_URL}/terms`;

    const method = editTerm ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(termData),
      });

      if (!response.ok) throw new Error('Failed to save term');

      fetchTerms();
      setSuccessMessage(editTerm ? 'Term updated successfully!' : 'Term added successfully!');
    } catch (error) {
      console.error(error.message);
      alert('There was an error saving the term');
    }
  };

  const handleCloseMessage = () => {
    setSuccessMessage('');
    onCancel();
  };

  return (
    <div className="add-term-container">
      <h2 className="form-title">{editTerm ? 'Edit Term' : 'Add New Term'}</h2>

      {successMessage ? (
        <div className="success-message">
          <p>{successMessage}</p>
          <button className="ok-btn" onClick={handleCloseMessage}>OK</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="add-term-form">
          <div className="form-row">
            <label>Term Name</label>
            <input
              type="text"
              name="termName"
              value={termData.termName}
              onChange={handleChange}
              placeholder="e.g. Term 1 2025"
              required
              disabled={editTerm} // Disable termName input when editing
            />
          </div>

          <div className="form-row">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={termData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={termData.endDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <label>Weekly Fee (GHS)</label>
            <input
              type="number"
              name="weeklyFee"
              value={termData.weeklyFee}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              {editTerm ? 'Update Term' : 'Add Term'}
            </button>
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTermForm;
