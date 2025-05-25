import React, { useState, useEffect } from 'react';
import './DailyFeedingForm.css';

const classOptions = [
  "Year 1A", "Year 1B", "Year 2A", "Year 2B", "Year 3A", "Year 3B",
  "Year 4A", "Year 4B", "Year 5A", "Year 5B", "Year 6", "Year 7", "Year 8",
  "GC 1", "GC 2", "GC 3", "TT A", "TT B", "TT C", "TT D",
  "BB A", "BB B", "BB C", "RS A", "RS B", "RS C",
  "KKJ A", "KKJ B", "KKJ C", "KKS A", "KKS B"
];

const DailyFeedingForm = ({ onClose, onSuccess }) => {
  const initialState = {
    firstname: '',
    lastname: '',
    class: '',
    amount: '',
  };

  const [formData, setFormData] = useState(initialState);
  const [cashier, setCashier] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCashier(parsedUser.fullName || '');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, cashier };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/daily-subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Feeding record submitted successfully!');
        setFormData(initialState);
        if (onClose) onClose();
        if (onSuccess) onSuccess(); // ✅ trigger refresh
      } else {
        alert(result.message || 'Submission failed.');
      }
    } catch (error) {
      alert('An error occurred while submitting the form.');
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (onSuccess) onSuccess(); // ✅ trigger refresh on close
  };

  return (
    <form className="feeding-form" onSubmit={handleSubmit}>
      <h2 className="feeding-title">Daily Feeding Form</h2>

      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={formData.firstname}
        onChange={handleChange}
        className="feeding-input"
        required
      />

      <input
        type="text"
        name="lastname"
        placeholder="Last Name"
        value={formData.lastname}
        onChange={handleChange}
        className="feeding-input"
        required
      />

      <select
        name="class"
        value={formData.class}
        onChange={handleChange}
        className="feeding-select"
        required
      >
        <option value="">Select Class</option>
        {classOptions.map(cls => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="feeding-input"
        required
        min="0"
      />

      {/* ✅ Display cashier as a disabled input */}
      <input
        type="text"
        value={cashier}
        className="feeding-input"
        disabled
        readOnly
        title="Cashier name"
      />

      <div className="feeding-button-group">
        <button type="submit" className="feeding-submit">Submit</button>
        <button type="button" className="feeding-close" onClick={handleClose}>Close</button>
      </div>
    </form>
  );
};

export default DailyFeedingForm;
