import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AbsenteeismForm.css';

const AbsenteeismForm = () => {
  const [cashier, setCashier] = useState('');
  const [weekNumber, setWeekNumber] = useState('');
  const [status, setStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectionType, setSelectionType] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCashier(user.fullName || 'Unknown');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!weekNumber || !status || !cashier || (selectionType === 'single' && !selectedStudent)) {
      setMessage('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      const studentId = selectionType === 'single' ? selectedStudent : 'all';
      const response = await axios.put(`/api/payments/mark-week/${studentId}/${weekNumber}`, {
        status,
        cashier,
      });

      if (response.status === 200) {
        setMessage(`✅ Week ${weekNumber} marked as "${status}" for ${selectionType === 'all' ? 'all students' : 'one student'}.`);
      } else {
        setMessage('❌ Failed to update week status.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ An error occurred while updating the week status.');
    }
    setLoading(false);
  };

  return (
    <div className="absenteeism-form-container">
      <h2>Mark Week Status</h2>
      <form onSubmit={handleSubmit} className="absenteeism-form">

        <div className="form-group">
          <label htmlFor="weekNumber">Week Number:</label>
          <select
            id="weekNumber"
            value={weekNumber}
            onChange={(e) => setWeekNumber(e.target.value)}
            required
          >
            <option value="">Select Week</option>
            {[...Array(18)].map((_, i) => (
              <option key={i + 1} value={`Week${i + 1}`}>Week {i + 1}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="">Select Status</option>
            <option value="Absent">Absent</option>
            <option value="Omitted">Omitted</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cashier:</label>
          <input type="text" value={cashier} disabled />
        </div>

        <div className="form-group">
          <label>Apply to:</label>
          <select value={selectionType} onChange={(e) => setSelectionType(e.target.value)}>
            <option value="all">All Students</option>
            <option value="single">Single Student</option>
          </select>
        </div>

        {selectionType === 'single' && (
          <div className="form-group">
            <label>Enter Student ID:</label>
            <input
              type="text"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              placeholder="Enter Student ID"
              required
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Update Status'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default AbsenteeismForm;
