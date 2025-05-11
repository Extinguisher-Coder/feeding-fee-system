import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminReportsPage.css';
import Logo from '../../Assets/images/logo-rmbg.png';

const AdminReportsPage = () => {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('Week 1');
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isPrinting, setIsPrinting] = useState(false);

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
    }, 500); // A small delay to ensure content is rendered
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = historyData.filter((item) => {
    const searchText = searchQuery.toLowerCase();
    return (
      item.studentId.toLowerCase().includes(searchText) ||
      item.firstName.toLowerCase().includes(searchText) ||
      item.lastName.toLowerCase().includes(searchText) ||
      item.classLevel.toLowerCase().includes(searchText)
    );
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
                  <h2 className="system-title">
                    Feeding Fees Collection Management System
                  </h2>
                </div>

      <div className="admin-reports__container">
        <header className="admin-reports__header">
          <h1 className="admin-reports__title">Payment Reports</h1>
        </header>

        <div className="admin-reports__buttons">
        <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const role = user?.role;

                      if (role === 'Admin') {
                        navigate('/admin/reports/today');
                      } 
                      else if (role === 'Cashier') {
                        navigate('/cashier/reports/today');
                      } 
                      else if (role === 'Accountant') {
                        navigate('/accountant/reports/today');
                      } 
                      else {
                        navigate('/unauthorized'); // fallback or access denied
                      }
                    }}
                    className="admin-reports__btn admin-reports__btn--daily"
                  >
                    Today's Report
                  </button>

        <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const role = user?.role;

                      if (role === 'Admin') {
                        navigate('/admin/reports/weekly');
                      } 
                      else if (role === 'Cashier') {
                        navigate('/cashier/reports/weekly');
                      } 
                      else if (role === 'Accountant') {
                        navigate('/accountant/reports/weekly');
                      } 
                      else {
                        navigate('/unauthorized'); // fallback or access denied
                      }
                    }}
                    className="admin-reports__btn admin-reports__btn--daily"
                  >
                      Weekly Report
                  </button>

          <button onClick={handlePrint} className="admin-reports__btn admin-reports__btn--print">
            Print Report
          </button>
        </div>

        <div className="admin-reports__filter">
          <input
            type="text"
            placeholder="Search by ID, Name, or Class"
            value={searchQuery}
            onChange={handleSearchChange}
            className="admin-reports__search"
          />
          <div className="admin-reports__total">
            <p>Total Amount Displayed: <br/> GHS {totalAmount}</p>
          </div>
        </div>

        {loading ? (
          <div className="admin-reports__loading">Loading...</div>
        ) : (
          <div>
            {/* Report Table */}
            <table className="admin-reports__table">
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
              {(isPrinting ? filteredData : currentItems).map((item, index) => (

                  <tr key={index}>
                    <td>{item.studentId}</td>
                    <td>{item.firstName} {item.lastName}</td>
                    <td>{item.classLevel}</td>
                    <td>GHS {item.amountPaid}</td>
                    <td>{item.cashier}</td>
                    <td>{new Date(item.paymentDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="admin-reports__pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`admin-reports__page-btn ${currentPage === index + 1 ? 'admin-reports__page-btn--active' : ''}`}
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

export default AdminReportsPage;
