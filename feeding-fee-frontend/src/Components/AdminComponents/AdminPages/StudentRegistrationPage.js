import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- added this
import './StudentRegistrationPage.css';
import API_BASE_URL from '../../../config';

const StudentRegistrationPage = () => {
  const navigate = useNavigate(); // <-- added this

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dob: '',
    age: '',
    classLevel: '',
    guardianName: '',
    guardianContact: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, [name]: value, age }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/students/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to register student');
      }

      const data = await response.json();
      console.log('Registered:', data);

      alert('Student registered successfully!');

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        age: '',
        classLevel: '',
        guardianName: '',
        guardianContact: '',
      });

      
    } catch (err) {
      console.error('Error submitting form:', err.message);
      alert('Error registering student. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  
  const handleBack = () => {
    navigate('/admin/students');
  };
  

  return (
    <div className="registration-container">
      
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">

        <div className="form-row">
          <label>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <label>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <label>Gender</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleInputChange}
                checked={formData.gender === 'Male'}
                required
              /> Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleInputChange}
                checked={formData.gender === 'Female'}
              /> Female
            </label>
          </div>
        </div>

        <div className="form-row">
          <label>Date of Birth</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <label>Age</label>
          <input type="text" value={formData.age} disabled />
        </div>

        <div className="form-row">
          <label>Class</label>
          <select name="classLevel" value={formData.classLevel} onChange={handleInputChange} required>
            <option value="">Select Class</option>
            {[
              'Year 1A', 'Year 1B', 'Year 2A', 'Year 2B', 'Year 3A', 'Year 3B',
              'Year 4A', 'Year 4B', 'Year 5A', 'Year 5B', 'Year 6', 'Year 7', 'Year 8', 'GC 1', 'GC 2', 'GC 3',
              'TT A', 'TT B', 'TT C', 'TT D', 'BB A', 'BB B', 'BB C', 'RS A', 'RS B', 'RS C', 'KKJ A', 'KKJ B',
              'KKJ C', 'KKS A', 'KKS B'
            ].map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Guardian Name</label>
          <input name="guardianName" value={formData.guardianName} onChange={handleInputChange} required />
        </div>

        <div className="form-row">
          <label>Guardian Contact</label>
          <input name="guardianContact" value={formData.guardianContact} onChange={handleInputChange} required />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Register Student'}
        </button>

        

      </form>

      {loading && <div className="saving-bar">Saving student data, please wait...</div>}
    </div>
  );
};

export default StudentRegistrationPage;
