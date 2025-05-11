import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "./AdminStudentsPage.css";
import Logo from "../../Assets/images/logo-rmbg.png";

const CLASS_OPTIONS = [
  "Year 1A", "Year 1B", "Year 2A", "Year 2B", "Year 3A", "Year 3B",
  "Year 4A", "Year 4B", "Year 5A", "Year 5B", "Year 6", "Year 7",
  "Year 8", "GC 1", "GC 2", "GC 3", 'TT A', 'TT B', 'TT C', 'TT D', 
  'BB A', 'BB B', 'BB C', 'RS A', 'RS B', 'RS C', 'KKJ A', 'KKJ B',
  'KKJ C', 'KKS A', 'KKS B'
];

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/students`
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
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

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setCurrentPage(1);
  };

  const handleExportToExcel = () => {
    const data = sortedFilteredStudents.map((student, index) => ({
      SN: index + 1,
      "Student ID": student.studentId,
      Name: `${student.firstName} ${student.lastName}`,
      Class: student.classLevel,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "Student_List.xlsx");
  };

  const filteredStudents = students.filter((student) => {
    const searchText = searchQuery.toLowerCase();
    const matchesSearch =
      student.studentId.toLowerCase().includes(searchText) ||
      student.firstName.toLowerCase().includes(searchText) ||
      student.lastName.toLowerCase().includes(searchText) ||
      student.classLevel.toLowerCase().includes(searchText);

    const matchesClass = selectedClass === "" || student.classLevel === selectedClass;

    return matchesSearch && matchesClass;
  });

  const sortStudentsByClassLevel = (studentsArray) => {
    return [...studentsArray].sort((a, b) => {
      const parseClass = (classStr) => {
        const match = classStr.match(/(\d+)?\s*([A-Za-z]+)/);
        if (!match) return [0, ""];
        const year = match[1] ? parseInt(match[1], 10) : 100;
        const suffix = match[2].toUpperCase();
        return [year, suffix];
      };

      const [yearA, sectionA] = parseClass(a.classLevel);
      const [yearB, sectionB] = parseClass(b.classLevel);

      if (yearA !== yearB) return yearA - yearB;
      return sectionA.localeCompare(sectionB);
    });
  };

  const sortedFilteredStudents = sortStudentsByClassLevel(filteredStudents);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedFilteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedFilteredStudents.length / itemsPerPage);

  const handleAddStudent = () => {
    const { role } = JSON.parse(localStorage.getItem("user"));
    const routeMap = {
      Admin: "/admin/students/register",
      Registrar: "/registrar/students/register",
    };
    navigate(routeMap[role] || "/unauthorized");
  };

  const handleViewStudent = (id) => {
    const { role } = JSON.parse(localStorage.getItem("user"));
    const routeMap = {
      Admin: `/admin/view-student/${id}`,
      Registrar: `/registrar/view-student/${id}`,
    };
    navigate(routeMap[role] || "/unauthorized");
  };

  const handleEditStudent = (id) => {
    const { role } = JSON.parse(localStorage.getItem("user"));
    const routeMap = {
      Admin: `/admin/edit-student/${id}`,
      Registrar: `/registrar/edit-student/${id}`,
    };
    navigate(routeMap[role] || "/unauthorized");
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_API_URL}/students/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  return (
    <div className={`admin-students__page ${isPrinting ? "printing-mode" : ""}`}>
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
          <button onClick={handleAddStudent} className="admin-students__btn admin-students__btn--add">Add Student</button>
          <button onClick={handlePrint} className="admin-students__btn admin-students__btn--print">Print Student List</button>
          <button onClick={handleExportToExcel} className="admin-students__btn admin-students__btn--excel">Export to Excel</button>
        </div>

        <div className="admin-students__filter">
          <input
            type="text"
            placeholder="Search by ID, Name, or Class"
            value={searchQuery}
            onChange={handleSearchChange}
            className="admin-students__search"
          />
          <select value={selectedClass} onChange={handleClassChange} className="admin-students__dropdown">
            <option value="">All Classes</option>
            {CLASS_OPTIONS.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="admin-students__loading">Loading...</div>
        ) : (
          <div>
            <table className="admin-students__table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  {!isPrinting && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {(isPrinting ? sortedFilteredStudents : currentItems).map(
                  (student, index) => {
                    const actualIndex = isPrinting
                      ? index + 1
                      : indexOfFirstItem + index + 1;
                    return (
                      <tr key={student._id}>
                        <td>{actualIndex}</td>
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
                    );
                  }
                )}
              </tbody>
            </table>

            <div className="admin-students__pagination">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="admin-students__page-btn">Previous</button>
              <span className="admin-students__page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="admin-students__page-btn">Next</button>
            </div>
          </div>
        )}
      </div>

      <p className="printed-on">
        Printed on:{" "}
        {new Date().toLocaleString("en-GB", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </p>
    </div>
  );
};

export default AdminStudentsPage;
