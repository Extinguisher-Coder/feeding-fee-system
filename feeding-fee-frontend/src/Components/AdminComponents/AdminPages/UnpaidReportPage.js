import React, { useState, useEffect } from "react";
import "./UnpaidReportPage.css";
import Logo from "../../Assets/images/logo-rmbg.png";

const UnpaidReportPage = () => {
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [unpaidData, setUnpaidData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/terms`);
        const data = await response.json();
        setTerms(data);
        if (data.length > 0) setSelectedTerm(data[0]);
      } catch (error) {
        console.error("Error fetching terms:", error);
      }
    };

    fetchTerms();
  }, []);

  useEffect(() => {
    if (!selectedTerm || !selectedWeek) return;

    const fetchUnpaid = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/payments/unpaid/${selectedWeek}?termName=${encodeURIComponent(
            selectedTerm.termName
          )}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setUnpaidData(data);
        } else {
          setUnpaidData([]);
        }
      } catch (error) {
        console.error("Error fetching unpaid students:", error);
        setUnpaidData([]);
      }
    };

    fetchUnpaid();
  }, [selectedTerm, selectedWeek]);

  const filteredData = unpaidData.filter(
    (student) =>
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classLevel?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const numberOfWeeks = selectedTerm?.numberOfWeeks || 18;

  return (
    <div className={`unpaid-wrapper ${isPrinting ? "printing-mode" : ""}`}>
      <div className="unpaid-header">
        <img src={Logo} alt="School Logo" className="school-logo" />
        <h1 className="school-name">Westside Educational Complex</h1>
        <h2 className="system-title">Feeding Fees Collection Management System</h2>
      </div>

      <div className="unpaid-report-container">
        <header className="report-header">
          <h1 className="report-title">Unpaid Students Per Week</h1>
        </header>

        <div className="report-controls no-print">
          <select
            className="term-dropdown"
            value={selectedTerm?.termName || ""}
            onChange={(e) => {
              const term = terms.find((t) => t.termName === e.target.value);
              setSelectedTerm(term);
              setSelectedWeek(1); // Reset week when term changes
            }}
          >
            {terms.map((term) => (
              <option key={term._id} value={term.termName}>
                {term.termName}
              </option>
            ))}
          </select>

          <select
            className="week-dropdown"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
          >
            {Array.from({ length: numberOfWeeks }, (_, i) => (
              <option key={i} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by ID or Name or Class..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="unpaid-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Class</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.classLevel}</td>
                  <td>{student.termName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No unpaid students found</td>
              </tr>
            )}
          </tbody>
        </table>

        {!isPrinting && (
          <div className="button-group">
            <button className="btn print-btn" onClick={handlePrint}>
              Print Report
            </button>
            <button className="btn go-back-btn" onClick={() => window.history.back()}>
              Go Back
            </button>
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

export default UnpaidReportPage;
