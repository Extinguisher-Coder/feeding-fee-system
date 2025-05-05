import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ParentChangePasswordForm.css';

const ParentChangePasswordForm = () => {
  const [studentId, setStudentId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/parents/updatePassword`, {
        studentId,
        oldPassword,
        newPassword,
      });

      alert('Password changed successfully!');
      setStudentId('');
      setOldPassword('');
      setNewPassword('');
      navigate('/');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to change password');
      } else {
        setError('An error occurred, please try again');
      }
    }
  };

  return (
    <div className="parent-password-form">
      <h2 className="parent-password-title">Change Password</h2>

      <form onSubmit={handleChangePassword} className="parent-password-form-wrapper">
        <div className="parent-password-group">
          <label>Student ID</label>
          <input
            type="text"
            placeholder="Enter Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>

        <div className="parent-password-group">
          <label>Old Password</label>
          <input
            type="password"
            placeholder="Enter Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>

        <div className="parent-password-group">
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="parent-password-button">
          Change Password
        </button>
      </form>

      {error && <p className="parent-password-error">{error}</p>}
    </div>
  );
};

export default ParentChangePasswordForm;
