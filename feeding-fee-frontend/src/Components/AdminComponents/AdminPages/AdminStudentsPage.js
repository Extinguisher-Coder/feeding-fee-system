import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminStudentsPage.css';
import Logo from '../../Assets/images/logo-rmbg.png';


const AdminStudentsPage = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isPrinting, setIsPrinting] = useState(false);
  

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/students`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = students.filter((student) => {
    const searchText = searchQuery.toLowerCase();
    return (
      student.studentId.toLowerCase().includes(searchText) ||
      student.firstName.toLowerCase().includes(searchText) ||
      student.lastName.toLowerCase().includes(searchText) ||
      student.classLevel.toLowerCase().includes(searchText)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handleAddStudent = () => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/students/register',
      Registrar: '/registrar/students/register',
    };
    navigate(routeMap[role] || '/unauthorized');
  };
  
  const handleViewStudent = (id) => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: `/admin/view-student/${id}`,
      Registrar: `/registrar/view-student/${id}`,
    };
    navigate(routeMap[role] || '/unauthorized');
  };
  
  const handleEditStudent = (id) => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: `/admin/edit-student/${id}`,
      Registrar: `/registrar/edit-student/${id}`,
    };
    navigate(routeMap[role] || '/unauthorized');
  };
  


  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/students/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

 

  return (
    <div className={`admin-students__page ${isPrinting ? 'printing-mode' : ''}`}>
      
      <div className="print-header">
        <img src={Logo} alt="School Logo" className="school-logo" />
        <h1 className="school-name">Westside Educational Complex</h1>
        <h2 className="system-title">Feeding Fees Collection Management System</h2>
      </div>

      <div className="admin-students__container">
        <header className="admin-students__header">
          <h1 className="admin-students__title">Student List</h1>
        </header>

        <div className="admin-students__buttons">
          <button onClick={handleAddStudent} className="admin-students__btn admin-students__btn--add">
            Add Student
          </button>
          <button onClick={handlePrint} className="admin-students__btn admin-students__btn--print">
            Print Student List
          </button>
        </div>

        <div className="admin-students__filter">
          <input
            type="text"
            placeholder="Search by ID, Name, or Class"
            value={searchQuery}
            onChange={handleSearchChange}
            className="admin-students__search"
          />
        </div>

        {loading ? (
          <div className="admin-students__loading">Loading...</div>
        ) : (
          <div>
            <table className="admin-students__table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  {!isPrinting && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {(isPrinting ? filteredStudents : currentItems).map((student, index) => (
                  <tr key={index}>
                    <td>{student.studentId}</td>
                    <td>{student.firstName} {student.lastName}</td>
                    <td>{student.classLevel}</td>
                    {!isPrinting && (
                      <td className="admin-students__actions">
                        <button onClick={() => handleViewStudent(student._id)} className="admin-students__action-btn vview-btn">View</button>
                        <button onClick={() => handleEditStudent(student._id)} className="admin-students__action-btn eedit-btn">Edit</button>
                        <button onClick={() => handleDeleteStudent(student._id)} className="admin-students__action-btn ddelete-btn">Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-students__pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`admin-students__page-btn ${currentPage === index + 1 ? 'admin-students__page-btn--active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="printed-on">
        Printed on: {new Date().toLocaleString('en-GB', { 
          weekday: 'short', 
          year: 'numeric', 
          month: 'short', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        })}
      </p>
    </div>
  );
};

export default AdminStudentsPage;
