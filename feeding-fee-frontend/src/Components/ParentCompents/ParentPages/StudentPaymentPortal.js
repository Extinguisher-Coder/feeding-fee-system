import React, { useEffect, useState } from 'react';
import './StudentPaymentPortal.css';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const StudentPaymentPortal = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.studentId) {
          console.error('Student ID not found in localStorage');
          return;
        }

        setStudentInfo(user);

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/history/student/${user.studentId}`
        );

        const paymentData = response.data.map(entry => ({
          studentId: entry.studentId,
          name: `${entry.firstName} ${entry.lastName}`,
          class: entry.classLevel,
          amountPaid: entry.amountPaid,
          cashier: entry.cashier,
          paymentDate: new Date(entry.paymentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          
        }));

        setPayments(paymentData);
      } catch (error) {
        console.error('Failed to fetch student payment history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.amountPaid.toString().includes(searchTerm) ||
      payment.paymentDate.includes(searchTerm)
  );

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amountPaid, 0);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const lastPayment = payments.length > 0 ? payments[0] : null; // Since it's sorted descending

  if (loading) {
    return (
      <div className="std-loading-container">
        <div className="std-spinner"></div>
      </div>
    );
  }

  const handleExportPDF = () => {
    const input = document.querySelector('.std-portal-container');
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`payment-history-${studentInfo.studentId}.pdf`);
    });
  };
  


  return (
    <div className="std-portal-container">
      {/* Welcome Row */}
      <div className="std-welcome-row">
        Welcome:
        <span>{studentInfo.studentId}</span> |
        <span>{studentInfo.fullName}</span> |
        <span>{studentInfo.className}</span>
      </div>

      {/* Page Title */}
      <div className="std-page-title">Payment History</div>

      {/* Last Payment Row */}
      <div className="std-last-payment-row">
        <div>Last Payment Amount: <span>{lastPayment?.amountPaid} GHS</span></div>
        <div>Last Payment Date: <span>{lastPayment?.paymentDate}</span></div>
      </div>

      {/* Search and Export Row */}
      <div className="std-search-export-row">
        <input
          type="text"
          placeholder="Search by cashier, amount, date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="std-export-button" onClick={handleExportPDF}>
           📥 Export PDF
        </button>

      </div>

      {/* Total Amount */}
      <div className="std-total-amount">
        Total Amount Paid: <span>{totalAmount} GHS</span>
      </div>

      {/* Payment Table */}
      <div className="std-table-container">
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Amount Paid</th>
              <th>Cashier</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.studentId}</td>
                <td>{payment.name}</td>
                <td>{payment.class}</td>
                <td>{payment.amountPaid} GHS</td>
                <td>{payment.cashier}</td>
                <td>{payment.paymentDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="std-pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'std-active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPaymentPortal;
