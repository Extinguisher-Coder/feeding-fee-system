import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './StudentInformationPage.css';
import Logo from '../../Assets/images/logo-rmbg.png';

const StudentInformationPage = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/students/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) return <div className="student-info-page">Loading...</div>;
  if (!student) return <div className="student-info-page">Student not found.</div>;

  return (
    <div className={`student-info-page ${isPrinting ? 'printing-mode' : ''}`}>
      <div className="print-header">
        <img src={Logo} alt="School Logo" className="school-logo" />
        <h1 className="school-name">Westside Educational Complex</h1>
        <h2 className="system-title">Feeding Fees Collection Management System</h2>
      </div>

      <div className="student-info-buttons no-print">
        <button onClick={handlePrint} className="print-btn">Print</button>
      </div>

      <h2 className="info-section-title">Student Information</h2>
      <div className="info-grid">
        <div><strong>Student ID:</strong> {student.studentId}</div>
        <div><strong>First Name:</strong> {student.firstName}</div>
        <div><strong>Last Name:</strong> {student.lastName}</div>
        <div><strong>Gender:</strong> {student.gender}</div>
        <div><strong>Date of Birth:</strong> {new Date(student.dob).toLocaleDateString()}</div>
        <div><strong>Age:</strong> {student.age}</div>
        <div><strong>Class Level:</strong> {student.classLevel}</div>
        <div><strong>Guardian Name:</strong> {student.guardianName}</div>
        <div><strong>Guardian Contact:</strong> {student.guardianContact}</div>
      </div>

      <p className="printed-on">Printed on: {getCurrentDateTime()}</p>
    </div>
  );
};

export default StudentInformationPage;
