import React, { useState } from 'react';
import axios from 'axios';
import './AbsenteeismForm.css';
import API_BASE_URL from '../../../config';

const AbsenteeismForm = ({ student, cashier, onClose }) => {
  const [week, setWeek] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!week) {
      alert('Please select a week');
      return;
    }

    const weekNumber = parseInt(week.replace('week', ''), 10);

    try {
      setSubmitting(true);
      await axios.put(
        `${API_BASE_URL}/payments/mark-week/${student.studentId}/${weekNumber}`,
        {
          status: 'Absent',
          cashier,
        }
      );

      alert(`Marked Week ${weekNumber} as Absent for ${student.firstName} ${student.lastName}`);
      onClose();
    } catch (err) {
      console.error('Error marking absent:', err);
      alert('Failed to mark student as absent.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absentee-form-container">
      <h3>Mark Student as Absent</h3>
      <form onSubmit={handleSubmit} className="absentee-form">
        <div className="absentee-form-row">
          <label>Student ID:</label>
          <span>{student.studentId}</span>
        </div>

        <div className="absentee-form-row">
          <label>First Name:</label>
          <span>{student.firstName}</span>
        </div>

        <div className="absentee-form-row">
          <label>Last Name:</label>
          <span>{student.lastName}</span>
        </div>

        <div className="absentee-form-row">
          <label>Status:</label>
          <span className="absent-status">Absent</span>
        </div>

        <div className="absentee-form-row">
          <label>Cashier:</label>
          <span>{cashier}</span>
        </div>

        <div className="absentee-form-row">
          <label>Week:</label>
          <select value={week} onChange={(e) => setWeek(e.target.value)} required>
            <option value="">Select Week</option>
            {[...Array(18)].map((_, i) => (
              <option key={i} value={`week${i + 1}`}>{`Week ${i + 1}`}</option>
            ))}
          </select>
        </div>

        <div className="absentee-form-actions">
          <button type="submit" className="absentee-btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <button type="button" className="absentee-btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AbsenteeismForm;
