import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AbsenteeismPage.css'; // Reuse your styles or create a new CSS

import API_BASE_URL from '../../../config';

const AbsentListPage = () => {
  const [absentList, setAbsentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  useEffect(() => {
    fetchAbsentList();
  }, []);

  const fetchAbsentList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/absentees`);
      setAbsentList(res.data);
    } catch (err) {
      console.error('Failed to fetch absent list:', err);
    } finally {
      setLoading(false);
    }
  };

  // Pagination calculations
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = absentList.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(absentList.length / itemsPerPage);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(absentList.map((item, i) => ({
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

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Absent Students List', 14, 16);
    const tableColumn = ["SN", "Student ID", "First Name", "Last Name", "Class", "Absenteeism"];
    const tableRows = [];

    absentList.forEach((item, index) => {
      const row = [
        index + 1,
        item.studentId,
        item.firstName,
        item.lastName,
        item.classLevel,
        item.absenteeism || 'N/A',
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save('AbsentList.pdf');
  };

  return (
    <div className="absentee-container">
      <h2 className="absentee-page-title">Absent Students List</h2>

      {loading ? (
        <div className="absentee-loading-bar">Loading absent students...</div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <button className="absentee-btn" onClick={exportToExcel} style={{ marginRight: '10px' }}>
              Export to Excel
            </button>
            <button className="absentee-btn" onClick={exportToPDF}>
              Export to PDF
            </button>
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

          {/* Pagination Controls */}
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
