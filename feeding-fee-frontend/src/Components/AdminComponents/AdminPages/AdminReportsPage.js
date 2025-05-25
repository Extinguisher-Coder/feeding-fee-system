import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './AdminReportsPage.css';
import Logo from '../../Assets/images/logo-rmbg.png';

const AdminReportsPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashier, setSelectedCashier] = useState('All');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedPaymentType, setSelectedPaymentType] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [isPrinting, setIsPrinting] = useState(false);

  const classList = [
    'Year 1A', 'Year 1B', 'Year 2A', 'Year 2B', 'Year 3A', 'Year 3B',
    'Year 4A', 'Year 4B', 'Year 5A', 'Year 5B', 'Year 6', 'Year 7', 'Year 8',
    'GC 1', 'GC 2', 'GC 3', 'TT A', 'TT B', 'TT C', 'TT D', 'BB A', 'BB B', 'BB C',
    'RS A', 'RS B', 'RS C', 'KKJ A', 'KKJ B', 'KKJ C', 'KKS A', 'KKS B'
  ];

  useEffect(() => {
    const fetchHistoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/history`);
        setHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
      setLoading(false);
    };

    fetchHistoryData();
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 500);
  };

  const handleExport = () => {
    const exportData = filteredData.map((item, index) => ({
      SN: index + 1,
      StudentID: item.studentId,
      Name: `${item.firstName} ${item.lastName}`,
      Class: item.classLevel,
      AmountPaid: item.amountPaid,
      Cashier: item.cashier,
      PaymentDate: new Date(item.paymentDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),

       Reference: item.reference,


    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reports');
    XLSX.writeFile(workbook, 'PaymentReports.xlsx');
  };

  const uniqueCashiers = ['All', ...new Set(historyData.map(item => item.cashier))];

  const filteredData = historyData.filter((item) => {
    const matchesSearch =
      item.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.classLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCashier = selectedCashier === 'All' || item.cashier === selectedCashier;
    const matchesClass = selectedClass === 'All' || item.classLevel === selectedClass;
    const matchesDate = !selectedDate || new Date(item.paymentDate).toDateString() === new Date(selectedDate).toDateString();

    const isCash = !item.reference || item.reference.trim().toLowerCase() === 'cash';
const isMomo = item.reference && item.reference.trim().toLowerCase() !== 'cash';

const matchesPaymentType =
  selectedPaymentType === 'All' ||
  (selectedPaymentType === 'Cash' && isCash) ||
  (selectedPaymentType === 'Momo' && isMomo);

return matchesSearch && matchesCashier && matchesClass && matchesDate && matchesPaymentType;



  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const totalAmount = filteredData.reduce((sum, item) => sum + (item.amountPaid || 0), 0);

  return (
    <div className={`admin-reports__page ${isPrinting ? 'printing-mode' : ''}`}>
      <div className="print-header">
        <img src={Logo} alt="School Logo" className="school-logo" />
        <h1 className="school-name">Westside Educational Complex</h1>
        <h2 className="system-title">Feeding Fees Collection Management System</h2>
      </div>

      <div className="admin-reports__container">
        <header className="admin-reports__header">
          <h1 className="admin-reports__title">Payment Reports</h1>
        </header>

        <div className="admin-reports__buttons">
                
           <button className="admin-reports__btn admin-reports__btn--daily" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/reports/today',
      Cashier: '/cashier/reports/today',
      Accountant: '/accountant/reports/today',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Today's Report
  </button>

<button className="admin-reports__btn admin-reports__btn--weekly" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/reports/weekly',
      Cashier: '/cashier/reports/weekly',
      Accountant: '/accountant/reports/weekly',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Weekly Report
  </button>

  

  <button className="admin-reports__btn admin-reports__btn--weekly" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/unpaid',
      Cashier: '/cashier/unpaid',
      Accountant: '/accountant/unpaid',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Unpaid Students
  </button>

          <button onClick={handlePrint} className="admin-reports__btn admin-reports__btn--print">Print Report</button>
          <button onClick={handleExport} className="admin-reports__btn admin-reports__btn--export">Export to Excel</button>
        </div>

        <div className="admin-reports__filter">
          <input
            type="text"
            placeholder="Search by ID, Name...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-reports__search"
          />

          <select value={selectedCashier} onChange={(e) => setSelectedCashier(e.target.value)} className="admin-reports__dropdown">
            {uniqueCashiers.map((cashier, index) => (
              <option key={index} value={cashier}>
                {cashier === 'All' ? 'All Cashiers' : cashier}
              </option>
            ))}
          </select>

          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="admin-reports__dropdown">
            <option value="All">All Classes</option>
            {classList.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>

          <select
                value={selectedPaymentType}
                onChange={(e) => setSelectedPaymentType(e.target.value)}
                className="admin-reports__dropdown"
                 >
                <option value="All">All Types</option>
                <option value="Cash">Cash</option>
                <option value="Momo">Momo</option>
              </select>




          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="admin-reports__dropdown"
          />
        </div>

        <div className="admin-reports__summary">
          <p>
  <strong>Total Amount Collected:</strong>{' '}
  <span style={{ color: 'orangered', fontWeight: 'bold' }}>
    GHS {totalAmount}
  </span>
</p>

        </div>

        {loading ? (
          <div className="admin-reports__loading">Loading...</div>
        ) : (
          <div>
            <table className="admin-reports__table">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Amount Paid</th>
                  <th>Cashier</th>
                  <th>Payment Date</th>
                  <th>Reference</th>
                </tr>
              </thead>
              <tbody>
                {(isPrinting ? filteredData : currentItems).map((item, index) => (
                  <tr key={index}>
                    <td>{isPrinting ? index + 1 : indexOfFirstItem + index + 1}</td>
                    <td>{item.studentId}</td>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.classLevel}</td>
                    <td>GHS {item.amountPaid}</td>
                    <td>{item.cashier}</td>
                    <td>{new Date(item.paymentDate).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}</td>

                    <td>{item.reference}</td>

                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-reports__pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="admin-reports__page-btn">Previous</button>
              <span className="admin-reports__page-info">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="admin-reports__page-btn">Next</button>
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

export default AdminReportsPage;
