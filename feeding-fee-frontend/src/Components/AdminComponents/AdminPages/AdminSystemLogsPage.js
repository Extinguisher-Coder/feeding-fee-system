import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminSystemLogsPage.css';

const AdminSystemLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 30;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/admin/system-logs`);
        setLogs(response.data);
        setFilteredLogs(response.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setError('Failed to fetch logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  useEffect(() => {
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = logs.filter(log =>
      log.user?.toLowerCase().includes(lowerSearch) ||
      log.description?.toLowerCase().includes(lowerSearch) ||
      new Date(log.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toLowerCase().includes(lowerSearch)
    );
    setFilteredLogs(filtered);
    setCurrentPage(1); // reset to first page on new search
  }, [searchTerm, logs]);

  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="admin-logs-page">
      <h2 className="admin-logs-title">System Logs</h2>

      <input
        type="text"
        placeholder="Search by user, date, or description..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="admin-logs-search"
      />

      {loading ? (
        <p className="admin-logs-loading">Loading logs...</p>
      ) : error ? (
        <p className="admin-logs-error">{error}</p>
      ) : filteredLogs.length === 0 ? (
        <p className="admin-logs-empty">No logs available.</p>
      ) : (
        <>
          <div className="admin-logs-table-container">
            <table className="admin-logs-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{new Date(log.timestamp).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}</td>
                    <td>{log.user || `${log.userType} (${log.userId || 'N/A'})`}</td>
                    <td>{log.action}</td>
                    <td>{log.description || '-'}</td>
                    <td className={`status ${log.status ? log.status.toLowerCase() : 'success'}`}>
                      {log.status || 'Success'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-logs-pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminSystemLogsPage;
