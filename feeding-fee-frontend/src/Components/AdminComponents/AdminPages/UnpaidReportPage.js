import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./UnpaidReportPage.css";
import Logo from "../../Assets/images/logo-rmbg.png";

const classOptions = [
  "Year 1A", "Year 1B", "Year 2A", "Year 2B", "Year 3A", "Year 3B",
  "Year 4A", "Year 4B", "Year 5A", "Year 5B", "Year 6", "Year 7", "Year 8",
  "GC 1", "GC 2", "GC 3", "TT A", "TT B", "TT C", "TT D", "BB A", "BB B", "BB C",
  "RS A", "RS B", "RS C", "KKJ A", "KKJ B", "KKJ C", "KKS A", "KKS B"
];

const UnpaidReportPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [unpaidData, setUnpaidData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

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
          `${process.env.REACT_APP_BACKEND_API_URL}/payments/unpaid/${selectedWeek}?termName=${encodeURIComponent(selectedTerm.termName)}`
        );
        const data = await response.json();
        setUnpaidData(Array.isArray(data.records) ? data.records : []);
      } catch (error) {
        console.error("Error fetching unpaid students:", error);
        setUnpaidData([]);
      }
    };

    fetchUnpaid();
  }, [selectedTerm, selectedWeek]);

  const filteredData = unpaidData.filter((student) => {
    const matchSearch =
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.classLevel?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchClass = selectedClass ? student.classLevel === selectedClass : true;

    return matchSearch && matchClass;
  });

  const grandTotalOwed = filteredData.reduce((sum, student) => sum + (student.amountOwed || 0), 0);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((student, index) => ({
        SN: index + 1,
        StudentID: student.studentId,
        FullName: `${student.firstName} ${student.lastName}`,
        Class: student.classLevel,
        Term: student.termName,
        WeeksOwed: student.weeksOwed,
        AmountOwed: student.amountOwed,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Unpaid Report");
    XLSX.writeFile(workbook, "Unpaid_Report.xlsx");
  };

const handleSendReminders = async () => {
  if (filteredData.length === 0) {
    alert("No students to send reminders to.");
    return;
  }

  const confirmSend = window.confirm(
    `Are you sure you want to send SMS reminders to ${filteredData.length} unpaid students?`
  );

  if (!confirmSend) return;

  try {
    setIsSending(true);

    const payload = filteredData.map((s) => ({
      studentId: s.studentId,
      weeksOwed: s.weeksOwed,
      amountOwed: s.amountOwed,
    }));

    const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/reminders/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students: payload }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(`Reminders sent successfully to ${result.successCount || filteredData.length} students.`);
    } else {
      alert(`Failed to send reminders: ${result.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error sending SMS reminders:", error);
    alert("Failed to send reminders due to a network error.");
  } finally {
    setIsSending(false);
  }
};


  const numberOfWeeks = selectedTerm?.numberOfWeeks || 18;

  const isAdmin = currentUser?.role === "Admin";

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
              setSelectedWeek(1);
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

          <button
  className="btn reminder-btn"
  onClick={handleSendReminders}
  disabled={!isAdmin || isSending}
>
  {isSending
    ? (
      <>
        Sending Messages.....
        <span className="loader-spinner"></span>
      </>
    )
    : !isAdmin
    ? "You are not permitted to send reminder"
    : "Send Reminder Message"}
</button>


          <select
            className="class-dropdown"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">All Classes</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search by ID or Name...."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="unpaid-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>Student ID</th>
              <th>Full Name</th>
              <th>Class</th>
              <th>Term</th>
              <th>No_Weeks</th>
              <th>AmountOwed</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{`${student.firstName} ${student.lastName}`}</td>
                  <td>{student.classLevel}</td>
                  <td>{student.termName}</td>
                  <td>{student.weeksOwed || 0}</td>
                  <td>{student.amountOwed || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No unpaid students found</td>
              </tr>
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="6" style={{ textAlign: "right", fontWeight: "bold" }}>
                  Grand Total Amount Owed (GHS):
                </td>
                <td style={{ fontWeight: "bold" }}>{grandTotalOwed.toFixed(2)}</td>
              </tr>
            </tfoot>
          )}
        </table>

        {!isPrinting && (
          <div className="button-group">
            <button className="btn print-btn" onClick={handlePrint}>
              Print Report
            </button>
            <button className="btn export-btn" onClick={handleExportToExcel}>
              Export to Excel
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
