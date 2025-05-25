import React, { useEffect, useState } from 'react';
import './DailySubscriberPage.css';
import DailyFeedingForm from './DailyFeedingForm';

const classOptions = [
  'Year 1A', 'Year 1B', 'Year 2A', 'Year 2B', 'Year 3A', 'Year 3B',
  'Year 4A', 'Year 4B', 'Year 5A', 'Year 5B', 'Year 6', 'Year 7', 'Year 8',
  'GC 1', 'GC 2', 'GC 3', 'TT A', 'TT B', 'TT C', 'TT D',
  'BB A', 'BB B', 'BB C', 'RS A', 'RS B', 'RS C',
  'KKJ A', 'KKJ B', 'KKJ C', 'KKS A', 'KKS B'
];

const ITEMS_PER_PAGE = 30;

export default function DailySubscriberPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [cashiers, setCashiers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    cashier: '',
    classFilter: '',
    date: '',
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    fetchSubscribers();
  }, [filters.cashier]);

  useEffect(() => {
    applyFilters();
  }, [filters.search, filters.classFilter, filters.date, subscribers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSubscribers]);

  async function fetchSubscribers() {
    try {
      const queryParams = new URLSearchParams();
      if (filters.cashier) queryParams.append('cashier', filters.cashier);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/daily-subscribers?${queryParams.toString()}`
      );
      const data = await res.json();
      setSubscribers(data);
      setFilteredSubscribers(data);
      updateCashiers(data);
      fetchTotalAmount();
    } catch (error) {
      alert('Failed to fetch subscribers: ' + error.message);
    }
  }

  async function fetchTotalAmount() {
    try {
      const queryParams = new URLSearchParams();
      if (filters.cashier) queryParams.append('cashier', filters.cashier);

      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_API_URL}/daily-subscribers/total?${queryParams.toString()}`
      );
      const data = await res.json();
      setTotalAmount(data.totalAmount || 0);
    } catch {
      setTotalAmount(0);
    }
  }

  function updateCashiers(data) {
    const uniqueCashiers = [...new Set(data.map((s) => s.cashier))];
    setCashiers(uniqueCashiers);
  }

  function applyFilters() {
    const searchLower = filters.search.toLowerCase();
    const filtered = subscribers.filter((sub) => {
      const fullname = `${sub.firstname} ${sub.lastname}`.toLowerCase();
      const amountStr = sub.amount?.toString() || '';
      const classMatch = filters.classFilter === '' || sub.class === filters.classFilter;
      const dateMatch =
        filters.date === '' ||
        new Date(sub.paymentDate).toISOString().split('T')[0] === filters.date;

      return (
        (fullname.includes(searchLower) || amountStr.includes(searchLower)) &&
        classMatch &&
        dateMatch
      );
    });
    setFilteredSubscribers(filtered);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function exportToCSV() {
    let csv = 'SN,Fullname,Class,Amount,PaymentDate,Cashier\n';
    filteredSubscribers.forEach((sub, idx) => {
      const fullname = `${sub.firstname} ${sub.lastname}`;
      const payDate = new Date(sub.paymentDate).toLocaleDateString();
      const amount = sub.amount || 0;
      csv += `${idx + 1},"${fullname}",${sub.class},${amount},${payDate},${sub.cashier}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DailySubscribers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const displayedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="sub-page">
      <h1>Daily Feeding Subscribers</h1>

      <div className="sub-buttons-row">
        <button className="sub-btn" onClick={() => setIsFormOpen(true)}>
          Add Daily Feeding
        </button>
        <button className="sub-btn" onClick={exportToCSV}>
          Export to Excel
        </button>
      </div>

      <div className="sub-filters-row">
        <input
          type="text"
          name="search"
          placeholder="Search by name or amount"
          value={filters.search}
          onChange={handleInputChange}
        />

        <select name="cashier" value={filters.cashier} onChange={handleInputChange}>
          <option value="">All Cashiers</option>
          {cashiers.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select name="classFilter" value={filters.classFilter} onChange={handleInputChange}>
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleInputChange}
        />
      </div>

      <div className="sub-total-amount">
        Total Amount Collected: GHS: {totalAmount}
      </div>

      <table className="sub-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Fullname</th>
            <th>Class</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Cashier</th>
          </tr>
        </thead>
        <tbody>
          {displayedSubscribers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No subscribers found</td>
            </tr>
          ) : (
            displayedSubscribers.map((sub, idx) => (
              <tr key={sub._id}>
                <td>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                <td>{sub.firstname} {sub.lastname}</td>
                <td>{sub.class}</td>
                <td>{sub.amount || 0}</td>
                <td>{new Date(sub.paymentDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}</td>
                <td>{sub.cashier}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="sub-pagination">
        Page {currentPage} of {totalPages}
        {totalPages > 1 && (
          <>
            {' '}
            <button
              className="sub-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <button
              className="sub-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </>
        )}
      </div>

      {isFormOpen && (
        <div className="sub-form-overlay">
          <div className="sub-form-modal">
            <DailyFeedingForm
              onClose={() => setIsFormOpen(false)}
              onSuccess={() => {
                setIsFormOpen(false);
                fetchSubscribers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
