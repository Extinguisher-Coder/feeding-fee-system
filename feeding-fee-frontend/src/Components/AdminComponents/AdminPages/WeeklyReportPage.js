import React, { useState, useEffect } from "react";
import "./WeeklyReportPage.css";
import Logo from "../../Assets/images/logo-rmbg.png";

const WeeklyReportPage = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const paymentsPerPage = 20;

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
    if (!selectedTerm) return;

    const fetchWeeklyPayments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_API_URL}/payments?termName=${encodeURIComponent(selectedTerm.termName)}`
        );
        const data = await response.json();
        setWeeklyData(data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching weekly payment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyPayments();
  }, [selectedTerm]);

  const filteredData = weeklyData.filter(
    (payment) =>
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${payment.firstName} ${payment.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredData.slice(indexOfFirst, indexOfLast);
  const paymentsToShow = isPrinting ? filteredData : currentPayments;
  const totalPages = Math.ceil(filteredData.length / paymentsPerPage);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const weeksToShow = selectedTerm?.numberOfWeeks || 18;

  // Function to determine cell color based on value
  const getCellColor = (value) => {
    if (value === 0) return "red-cell";
    if (value === 50) return "green-cell";
    if (value > 0 && value < 50) return "yellow-cell";
    return "";
  };

  return (
    <div className={`print-wrapper ${isPrinting ? "printing-mode" : ""}`}>
      <div className="print-header">
        <img src={Logo} alt="School Logo" className="school-logo" />
        <h1 className="school-name">Westside Educational Complex</h1>
        <h2 className="system-title">Feeding Fees Collection Management System</h2>
      </div>

      <div className="weekly-report-container">
        <header className="header">
          <h1 className="page-title">Weekly Payment Report</h1>
        </header>

        <div className="report-controls no-print">
          <select
            className="term-dropdown"
            onChange={(e) => {
              const term = terms.find((t) => t.termName === e.target.value);
              setSelectedTerm(term);
            }}
            value={selectedTerm?.termName || ""}
          >
            {terms.map((term) => (
              <option key={term._id} value={term.termName}>
                {term.termName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by ID or name..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <p className="loading-message">Loading payment data...</p>
        ) : (
          <table className="report-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Term</th>
                {Array.from({ length: weeksToShow }, (_, i) => (
                  <th key={i}>W{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentsToShow.length > 0 ? (
                paymentsToShow.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.studentId}</td>
                    <td>{`${payment.firstName} ${payment.lastName}`}</td>
                    <td>{payment.termName}</td>
                    {Array.from({ length: weeksToShow }, (_, i) => (
                      <td
                        key={i}
                        className={getCellColor(payment[`Week${i + 1}`])}
                      >
                        {payment[`Week${i + 1}`] || 0}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={weeksToShow + 3}>No payments found for this term.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!isPrinting && !isLoading && filteredData.length > 0 && (
          <>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="page-info">Page {currentPage} of {totalPages}</span>

              <button
                className="page-btn"
                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="button-group">
              <button className="btn print-btn" onClick={handlePrint}>
                Print Report
              </button>
              <button className="btn go-back-btn" onClick={() => window.history.back()}>
                Go Back
              </button>
            </div>
          </>
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

export default WeeklyReportPage;
