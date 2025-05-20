import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../config';
import './MarkAllStudentsForm.css';

const MarkAllStudentsForm = ({ cashier, onClose }) => {
  const [week, setWeek] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!week || !status) {
      setMessage('Please select both week and status.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      await axios.put(`${API_BASE_URL}/payments/mark-week-all/${week.replace('week', '')}`, {
        status,
        cashier,
      });
      setMessage(`All students marked as "${status}" for ${week}.`);
    } catch (error) {
      console.error('Error marking all students:', error);
      setMessage('Failed to mark all students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mark-all-form-overlay">
      <div className="mark-all-form-container">
        <h3>Mark All Students</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Week</label>
            <select value={week} onChange={(e) => setWeek(e.target.value)} required>
              <option value="">Select Week</option>
              {Array.from({ length: 18 }, (_, i) => (
                <option key={i + 1} value={`week${i + 1}`}>{`Week${i + 1}`}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Absent">Absent</option>
              <option value="Omitted">Omitted</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cashier</label>
            <input type="text" value={cashier} readOnly />
          </div>

          {message && <div className="form-message">{message}</div>}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAllStudentsForm;
