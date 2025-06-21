import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './DailyBalancingPage.css';

const DailyBalancingPage = () => {
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [cashierFilter, setCashierFilter] = useState('');
  const [accountantFilter, setAccountantFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [cashiers, setCashiers] = useState([]);
  const [accountants, setAccountants] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBalanceHistory();
  }, []);

  const fetchBalanceHistory = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/balance-history`);
      const data = await response.json();
      setBalanceHistory(data);
      setFiltered(data);

      const uniqueCashiers = [...new Set(data.map(item => item.cashier))];
      const uniqueAccountants = [...new Set(data.map(item => item.accountant))];
      setCashiers(uniqueCashiers);
      setAccountants(uniqueAccountants);
    } catch (err) {
      console.error('Error fetching balance history:', err);
    }
  };

  useEffect(() => {
    let data = balanceHistory;

    if (search) {
      data = data.filter(d =>
        d.lastAmountAccounted?.toString().includes(search)
      );
    }

    if (cashierFilter) {
      data = data.filter(d => d.cashier === cashierFilter);
    }

    if (accountantFilter) {
      data = data.filter(d => d.accountant === accountantFilter);
    }

    if (dateFilter) {
      data = data.filter(d =>
        d.lastAccountedDate?.slice(0, 10) === dateFilter
      );
    }

    setFiltered(data);
  }, [search, cashierFilter, accountantFilter, dateFilter, balanceHistory]);

  const handleExport = () => {
    const exportData = filtered.map((item, index) => ({
      SN: index + 1,
      Cashier: item.cashier,
      'Amount Accounted': item.lastAmountAccounted,
      'Date Accounted': item.lastAccountedDate
        ? new Date(item.lastAccountedDate).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
        : '',
      Accountant: item.accountant
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BalanceHistory');
    XLSX.writeFile(workbook, 'DailyBalanceHistory.xlsx');
  };

  // 🟡 Calculate total accounted
  const totalAccounted = filtered.reduce((acc, curr) => acc + Number(curr.lastAmountAccounted || 0), 0);

  return (
    <div className="cash-page">
      <h1 className="pagetitle">Cash Balancing History</h1>

      <div className="action-row">
        <button className="secondary-btn" onClick={handleExport}>
          Export to Excel
        </button>
      </div>

      <div className="filter-row">
        <div className="search-date-group">
          <input
            type="text"
            placeholder="Search by Amount"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <select value={cashierFilter} onChange={(e) => setCashierFilter(e.target.value)}>
          <option value="">All Cashiers</option>
          {cashiers.map(cashier => (
            <option key={cashier} value={cashier}>{cashier}</option>
          ))}
        </select>

        <select value={accountantFilter} onChange={(e) => setAccountantFilter(e.target.value)}>
          <option value="">All Accountants</option>
          {accountants.map(accountant => (
            <option key={accountant} value={accountant}>{accountant}</option>
          ))}
        </select>
      </div>

      {/* 🟢 Total Accounted Display */}
      <div style={{ margin: '20px 0', fontWeight: 'bold', fontSize: '18px' }}>
        Total Accounted: GHS {totalAccounted.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </div>

      <table className="cash-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Cashier</th>
            <th>Amount Accounted</th>
            <th>Date Accounted</th>
            <th>Accountant</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.cashier}</td>
                <td>GHS {Number(item.lastAmountAccounted).toLocaleString()}</td>
                <td>
                  {item.lastAccountedDate
                    ? new Date(item.lastAccountedDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })
                    : ''}
                </td>
                <td>{item.accountant}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DailyBalancingPage;
