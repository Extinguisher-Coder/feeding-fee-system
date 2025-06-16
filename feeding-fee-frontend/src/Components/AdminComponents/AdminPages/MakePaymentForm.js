import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MakePaymentForm.css';
import API_BASE_URL from '../../../config';

const MakePaymentForm = ({ student, cashier, onClose }) => {
  const [currentTerm, setCurrentTerm] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentRestriction, setPaymentRestriction] = useState('');
  const [amountError, setAmountError] = useState('');
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
        if (res.data?.termName) {
          setCurrentTerm(res.data);
          setForm(prevForm => ({
            ...prevForm,
            termName: res.data.termName
          }));
        }
      } catch (error) {
        console.error('Failed to fetch current term:', error);
      }
    };

    fetchCurrentTerm();
  }, []);

  useEffect(() => {
    const fetchRestriction = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/settings/payment-restriction`);
        if (res.data?.restriction) {
          setPaymentRestriction(res.data.restriction);
        }
      } catch (error) {
        console.error('Error fetching restriction setting:', error);
      }
    };

    fetchRestriction();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'amount') {
      setForm(prev => ({ ...prev, amount: value }));

      const numeric = parseFloat(value);
      if (!value || isNaN(numeric)) {
        setAmountError('');
      } else if (paymentRestriction === 'restrict' && numeric % 50 !== 0) {
        setAmountError('❌ Invalid amount. Please contact Madam Sharin.');
      } else {
        setAmountError('');
      }

      return;
    }

    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!currentTerm || !paymentRestriction) {
      alert('❌ Cannot save payment — term or payment restriction not set.');
      return;
    }

    if (paymentRestriction === 'restrict' && parseFloat(form.amount) % 50 !== 0) {
      setAmountError('❌ Invalid amount. Please contact Madam Sharin.');
      return;
    }

    setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  };

  const isAmountDisabled = !currentTerm || !paymentRestriction || isSaving;

  return (
    <div className="payment-form-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <h2>Make Payment</h2>

        <div className="grid-form">
          <div className="form-group"><label>Student ID</label><input type="text" value={form.studentId} disabled /></div>
          <div className="form-group"><label>First Name</label><input type="text" value={form.firstName} disabled /></div>
          <div className="form-group"><label>Last Name</label><input type="text" value={form.lastName} disabled /></div>
          <div className="form-group"><label>Class</label><input type="text" value={form.classLevel} disabled /></div>
          <div className="form-group"><label>Cashier</label><input type="text" value={form.cashier} disabled /></div>
          <div className="form-group"><label>Term</label><input type="text" value={currentTerm ? form.termName : "No active term"} disabled /></div>
        </div>

        {(!currentTerm || !paymentRestriction) && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            ⚠️ A current term and payment restriction must be set before payments can be accepted.
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
            disabled={isAmountDisabled}
          />
          {amountError && (
            <p style={{ color: 'red', marginTop: '5px' }}>{amountError}</p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={isAmountDisabled || !!amountError}
          >
            {isSaving ? (
              <><span className="spinner"></span> Saving Payment...</>
            ) : (
              'Save Payment'
            )}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MakePaymentForm;
