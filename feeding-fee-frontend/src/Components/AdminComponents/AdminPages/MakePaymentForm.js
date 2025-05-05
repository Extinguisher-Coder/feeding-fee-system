import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MakePaymentForm.css';
import API_BASE_URL from '../../../config';

const MakePaymentForm = ({ student, cashier, onClose }) => {
  const [currentTerm, setCurrentTerm] = useState(null);
  const [form, setForm] = useState({
    studentId: student.studentId,
    firstName: student.firstName,
    lastName: student.lastName,
    classLevel: student.classLevel,
    cashier: cashier,
    termName: '',
    amount: ''
  });

  useEffect(() => {
    const fetchCurrentTerm = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/terms/current`);
        if (res.data && res.data.termName) {
          setCurrentTerm(res.data);
          setForm(prevForm => ({
            ...prevForm,
            termName: res.data.termName
          }));
        } else {
          setCurrentTerm(null);
        }
      } catch (error) {
        console.error('Failed to fetch current term:', error);
        setCurrentTerm(null);
      }
    };

    fetchCurrentTerm();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/payments/make/${form.studentId}`, {
        ...form,
        amount: parseFloat(form.amount),
      });
      alert('✅ Payment saved successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save payment.');
    }
  };

  return (
    <div className="payment-form-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h2>Make Payment</h2>

        <div className="grid-form">
          <div className="form-group">
            <label>Student ID</label>
            <input type="text" value={form.studentId} disabled />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input type="text" value={form.firstName} disabled />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" value={form.lastName} disabled />
          </div>

          <div className="form-group">
            <label>Class</label>
            <input type="text" value={form.classLevel} disabled />
          </div>

          <div className="form-group">
            <label>Cashier</label>
            <input type="text" value={form.cashier} disabled />
          </div>

          <div className="form-group">
            <label>Term</label>
            <input
              type="text"
              value={currentTerm ? form.termName : "No active term"}
              disabled
            />
          </div>
        </div>

        {!currentTerm && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            ⚠️ A current term must be set before payments can be accepted.
          </p>
        )}

        <div className="form-group full-width">
          <label>Amount (GHS)</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="1"
            disabled={!currentTerm}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={!currentTerm}
          >
            Save Payment
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MakePaymentForm;
