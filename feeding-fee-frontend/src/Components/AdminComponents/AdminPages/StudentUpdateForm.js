import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './StudentUpdateForm.css';

const StudentUpdateForm = () => {
  const { id } = useParams(); // Get student ID from URL
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/students/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
      setLoading(false);
    };

    fetchStudentDetails();
  }, [id]);

  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_API_URL}/students/${id}`, student);
      alert('Student updated successfully!');

      const { role } = JSON.parse(localStorage.getItem('user'));
      const routeMap = {
        Admin: '/admin/students',
        Registrar: '/registrar/students',
        
      };
      navigate(routeMap[role] || '/unauthorized');

    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-update-container">
    
      

      <h2>Edit Student</h2>
      <form className="student-update-form" onSubmit={handleUpdateStudent}>
        {/* Form Rows - Grouped Two Fields on Each Row */}
        <div className="form-row">
          <div className="form-column">
            <label htmlFor="studentId">Student ID</label>
            <input type="text" id="studentId" value={student.studentId} disabled />
          </div>
          <div className="form-column">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={student.firstName}
              onChange={(e) => setStudent({ ...student, firstName: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={student.lastName}
              onChange={(e) => setStudent({ ...student, lastName: e.target.value })}
            />
          </div>
          <div className="form-column">
            <label htmlFor="classLevel">Class Level</label>
            <select
  id="classLevel"
  value={student.classLevel}
  onChange={(e) => setStudent({ ...student, classLevel: e.target.value })}
>
  <option value="">-- Select Class Level --</option>
  <option value="Year 1A">Year 1A</option>
  <option value="Year 1B">Year 1B</option>
  <option value="Year 2A">Year 2A</option>
  <option value="Year 2B">Year 2B</option>
  <option value="Year 3A">Year 3A</option>
  <option value="Year 3B">Year 3B</option>
  <option value="Year 4A">Year 4A</option>
  <option value="Year 4B">Year 4B</option>
  <option value="Year 5A">Year 5A</option>
  <option value="Year 5B">Year 5B</option>
  <option value="Year 6">Year 6</option>
  <option value="Year 7">Year 7</option>
  <option value="Year 8">Year 8</option>
  <option value="GC 1">GC 1</option>
  <option value="GC 2">GC 2</option>
  <option value="GC 3">GC 3</option>
  <option value="TT A">TT A</option>
  <option value="TT B">TT B</option>
  <option value="TT C">TT C</option>
  <option value="TT D">TT D</option>
  <option value="BB A">BB A</option>
  <option value="BB B">BB B</option>
  <option value="BB C">BB C</option>
  <option value="RS A">RS A</option>
  <option value="RS B">RS B</option>
  <option value="RS C">RS C</option>
  <option value="KKJ A">KKJ A</option>
  <option value="KKJ B">KKJ B</option>
  <option value="KKJ C">KKJ C</option>
  <option value="KKS A">KKS A</option>
  <option value="KKS B">KKS B</option>
</select>

          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={student.gender}
              onChange={(e) => setStudent({ ...student, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-column">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              value={student.dateOfBirth}
              onChange={(e) => setStudent({ ...student, dateOfBirth: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label htmlFor="age">Age</label>
            <input type="text" id="age" value={student.age} disabled />
          </div>
          <div className="form-column">
            <label htmlFor="guardianName">Guardian Name</label>
            <input
              type="text"
              id="guardianName"
              value={student.guardianName}
              onChange={(e) => setStudent({ ...student, guardianName: e.target.value })}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-column">
            <label htmlFor="guardianContact">Guardian Contact</label>
            <input
              type="text"
              id="guardianContact"
              value={student.guardianContact}
              onChange={(e) => setStudent({ ...student, guardianContact: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Update Student</button>
      </form>
    </div>
  );
};

export default StudentUpdateForm;
