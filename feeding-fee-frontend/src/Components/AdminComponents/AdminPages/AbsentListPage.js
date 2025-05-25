import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import './AbsentListPage.css';

import API_BASE_URL from '../../../config';

const classOptions = [
  "Year 1A", "Year 1B", "Year 2A", "Year 2B", "Year 3A", "Year 3B",
  "Year 4A", "Year 4B", "Year 5A", "Year 5B", "Year 6", "Year 7", "Year 8",
  "GC 1", "GC 2", "GC 3", "TT A", "TT B", "TT C", "TT D",
  "BB A", "BB B", "BB C", "RS A", "RS B", "RS C",
  "KKJ A", "KKJ B", "KKJ C", "KKS A", "KKS B"
];

const weekOptions = Array.from({ length: 18 }, (_, i) => `Week${i + 1}`);

const AbsentListPage = () => {
  const [absentList, setAbsentList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [classFilter, setClassFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    fetchAbsentList();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [absentList, classFilter, weekFilter, searchTerm]);

  const fetchAbsentList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/payments/absentees`);
      setAbsentList(res.data);
    } catch (err) {
      console.error('Failed to fetch absent list:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let list = [...absentList];

    if (classFilter) {
      list = list.filter(item => item.classLevel === classFilter);
    }

    if (weekFilter) {
      list = list.filter(item =>
        item.absenteeism?.toLowerCase().includes(weekFilter.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(item =>
        item.studentId.toLowerCase().includes(term) ||
        item.firstName.toLowerCase().includes(term) ||
        item.lastName.toLowerCase().includes(term)
      );
    }

    setFilteredList(list);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredList.map((item, i) => ({
      SN: i + 1,
      StudentID: item.studentId,
      FirstName: item.firstName,
      LastName: item.lastName,
      Class: item.classLevel,
      Absenteeism: item.absenteeism || 'N/A',
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AbsentList');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'AbsentList.xlsx');
  };

  

  return (
    <div className="absentee-container">
      <h2 className="absentee-page-title">Absent Students List</h2>

      {loading ? (
        <div className="absentee-loading-bar">Loading absent students...</div>
      ) : (
        <>
          <div className="absentee-controls">
            <div className="absentee-filters">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="absentee-select"
              >
                <option value="">All Classes</option>
                {classOptions.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>

              <select
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="absentee-select"
              >
                <option value="">All Weeks</option>
                {weekOptions.map(week => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search by ID or name"
                className="absentee-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="absentee-buttons">
              <button className="absentee-btn" onClick={exportToExcel}>Export to Excel</button>
             
            </div>
          </div>

          <table className="absentee-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Student ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Class</th>
                <th>Absenteeism</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No absent students found.</td>
                </tr>
              ) : (
                currentItems.map((student, index) => (
                  <tr key={student._id || index}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{student.studentId}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.classLevel}</td>
                    <td>{student.absenteeism || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="absentee-pagination">
              <button
                className="absentee-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                Previous
              </button>

              <span className="absentee-page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="absentee-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AbsentListPage;
