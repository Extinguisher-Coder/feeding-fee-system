import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MomoPaymentPage.css';
import MakeMomoPaymentForm from './MakeMomoPaymentForm';
import API_BASE_URL from '../../../config';

const MomoPaymentPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 20;

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((s) =>
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/students`);
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMakePayment = (student) => {
    setSelectedStudent(student);
    setShowPaymentForm(true);
  };

  const handleCloseForm = () => {
    setShowPaymentForm(false);
    setSelectedStudent(null);
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="momo-payment-container">
      <div className="momo-top-bar">
        <span className="momo-user-name">Cashier: {currentUser?.fullName || 'N/A'}</span>
      </div>

      <h2 className="momo-page-title">Momo Payment Page</h2>

       <div className="momo-payment-controls">
        <input
          type="text"
          className="momo-search-input"
          placeholder="Search by name or student ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showPaymentForm && selectedStudent && (
        <div className="momo-payment-form-overlay">
          <div className="momo-payment-form-content">
            <MakeMomoPaymentForm
              student={selectedStudent}
              cashier={currentUser?.fullName || 'Unknown'}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="momo-loading-bar">Loading students...</div>
      ) : (
        <>
          <table className="momo-students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Class</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student._id}>
                  <td data-label="Student ID">{student.studentId}</td>
                  <td data-label="Full Name">{student.firstName} {student.lastName}</td>
                  <td data-label="Class">{student.classLevel}</td>
                  <td data-label="Actions">
                    <button className="momo-pay-btn" onClick={() => handleMakePayment(student)}>
                      Make Momo Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="momo-pagination">
            <button
              className="momo-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            <span className="momo-page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="momo-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MomoPaymentPage;
