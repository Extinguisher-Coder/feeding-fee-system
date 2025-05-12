import React, { useState, useEffect } from "react";
import "./TodayReportPage.css";
import Logo from "../../Assets/images/logo-rmbg.png";

const TodayReportPage = () => {
  const [todayPayments, setTodayPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [cashiers, setCashiers] = useState([]);
  const [selectedCashier, setSelectedCashier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  const paymentsPerPage = 10;

  const getTodayDateParam = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getFormattedToday = () => {
    const today = new Date();
    const options = { month: "short", day: "2-digit", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  const fetchTodayPayments = async () => {
    try {
      const todayDate = getTodayDateParam();
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/history/daily/${todayDate}`
      );
      const data = await response.json();
      setTodayPayments(data);
      setFilteredPayments(data);
      const total = data.reduce((acc, payment) => acc + payment.amountPaid, 0);
      setTotalAmount(total);

      const cashierNames = [...new Set(data.map((p) => p.cashier))];
      setCashiers(cashierNames);
    } catch (error) {
      console.error("Error fetching today’s payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayPayments();
  }, []);

  useEffect(() => {
    let filtered = todayPayments;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (payment) =>
          payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.classLevel.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCashier) {
      filtered = filtered.filter(
        (payment) => payment.cashier === selectedCashier
      );
    }

    setFilteredPayments(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCashier, todayPayments]);

  const indexOfLast = currentPage * paymentsPerPage;
  const indexOfFirst = indexOfLast - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirst, indexOfLast);
  const paymentsToShow = isPrinting ? filteredPayments : currentPayments;
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  return (
    <div className={`tdr-print-wrapper ${isPrinting ? "tdr-printing-mode" : ""}`}>
      <div className="tdr-print-header">
        <img src={Logo} alt="School Logo" className="tdr-school-logo" />
        <h1 className="tdr-school-name">Westside Educational Complex</h1>
        <h2 className="tdr-system-title">
          Feeding Fees Collection Management System
        </h2>
      </div>

      <div className="tdr-today-report-container">
        <header className="tdr-header">
          <h1 className="tdr-page-title">Today's Payment Report</h1>
          <p className="tdr-today-date">
            Today: <strong>{getFormattedToday()}</strong>
          </p>
        </header>

        <div className="tdr-report-controls">
          <input
            type="text"
            placeholder="Search by ID, name, class..."
            className="tdr-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {isPrinting ? (
            <span className="tdr-cashier-selected">
              {selectedCashier || "All Cashiers"}
            </span>
          ) : (
            <select
              className="tdr-cashier-dropdown"
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
            >
              <option value="">All Cashiers</option>
              {cashiers.map((cashier, index) => (
                <option key={index} value={cashier}>
                  {cashier}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="tdr-total-amount">
          <p>
            Total Amount Collected Today:{" "}
            <strong>GHS {filteredPayments.reduce((acc, p) => acc + p.amountPaid, 0)}</strong>
          </p>
        </div>

        {loading ? (
          <div className="tdr-loading">Loading...</div>
        ) : (
          <table className="tdr-report-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Cashier</th>
              </tr>
            </thead>
            <tbody>
              {paymentsToShow.length > 0 ? (
                paymentsToShow.map((payment) => (
                  <tr key={payment._id}>
                    <td>{payment.studentId}</td>
                    <td>{`${payment.firstName} ${payment.lastName}`}</td>
                    <td>{payment.classLevel}</td>
                    <td>GHS {payment.amountPaid}</td>
                    <td>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )}
                    </td>
                    <td>{payment.cashier}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {!isPrinting && (
          <>
            <div className="tdr-pagination">
              <button
                className="tdr-page-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span className="tdr-page-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="tdr-page-btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

            <div className="tdr-button-group">
              <button className="tdr-btn tdr-print-btn" onClick={handlePrint}>
                Print Report
              </button>
              <button
                className="tdr-btn tdr-go-back-btn"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </>
        )}
      </div>

      <p className="tdr-printed-on">
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

export default TodayReportPage;
