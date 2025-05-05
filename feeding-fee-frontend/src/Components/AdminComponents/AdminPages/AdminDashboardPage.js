import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './AdminDashboardPage.css';

// ✅ Register required chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const [serverDate, setServerDate] = useState('');
  const [totalStudents, setTotalStudents] = useState(0);
  const [todaysCollection, setTodaysCollection] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentTerm, setCurrentTerm] = useState('');
  const [numberOfWeeks, setNumberOfWeeks] = useState(0);
  const [expectedCollection, setExpectedCollection] = useState(0);
  const [grandTotalCollection, setGrandTotalCollection] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [user, setUser] = useState({ fullName: 'User', role: 'Staff' });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        let fullName = 'User';
        let role = decoded.role || 'Staff';

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          fullName = parsedUser.fullName || fullName;
          role = parsedUser.role || role;
        }

        setUser({ fullName, role });
      } catch (error) {
        console.error('Invalid token:', error);
        setUser({ fullName: 'User', role: 'Staff' });
      }
    }

    fetchServerDate();
    fetchCurrentTerm();
    fetchTotalStudents();
    fetchTodaysCollection();
    fetchTotalUsers();
    fetchGrandTotalCollection();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/history/payments/by-class`);
        const data = res.data;

        const labels = data.map(entry => entry.className);
        const values = data.map(entry => entry.totalCollected);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Collection by Class (GHS)',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const fetchServerDate = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/time`);
      const formatted = new Date(res.data.serverDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      setServerDate(formatted);
    } catch (error) {
      console.error('Error fetching server date:', error);
    }
  };

  const fetchCurrentTerm = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/terms/current`);
      setCurrentTerm(res.data.termName || 'No Current Term');
      setNumberOfWeeks(res.data.numberOfWeeks || 0);
    } catch (error) {
      console.error('Error fetching current term:', error);
    }
  };

  const fetchTotalStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/students/count`);
      setTotalStudents(res.data.count || 0);
    } catch (error) {
      console.error('Error fetching total students:', error);
    }
  };

  const fetchTodaysCollection = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/history/payments/today-collection`);
      setTodaysCollection(res.data.totalCollection || 0);
    } catch (error) {
      console.error('Error fetching today\'s collection:', error);
    }
  };

  const fetchGrandTotalCollection = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/payments/payments/grand-total`);
      setGrandTotalCollection(res.data.grandTotal || 0);
    } catch (error) {
      console.error('Error fetching grand total collection:', error);
    }
  };

  const fetchTotalUsers = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/users/count`);
      setTotalUsers(res.data.totalUsers || 0);
    } catch (error) {
      console.error('Error fetching total users:', error);
    }
  };

  useEffect(() => {
    if (numberOfWeeks && totalStudents) {
      const calculatedExpectedCollection = numberOfWeeks * totalStudents * 50;
      setExpectedCollection(calculatedExpectedCollection);
    }
  }, [numberOfWeeks, totalStudents]);

  return (
    <div className="dash-admin-dashboard">
      <div className="dash-top-bar">
        <div>Welcome: {user.fullName}</div>
        <div>Role: {user.role}</div>
        <div>Date: {serverDate}</div>
      </div>

      <h1 className="dash-dashboard-title">Main Dashboard</h1>

      <div className="dash-report-buttons">
  <button className="btn" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/reports/today',
      Cashier: '/cashier/reports/today',
      Accountant: '/cashier/reports/today',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Daily Payment Report
  </button>

  <button className="btn" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/reports/weekly',
      Cashier: '/cashier/reports/weekly',
      Accountant: '/cashier/reports/weekly',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Weekly Payment Report
  </button>

  <button className="btn" onClick={() => {
    const { role } = JSON.parse(localStorage.getItem('user'));
    const routeMap = {
      Admin: '/admin/unpaid',
      Cashier: '/cashier/unpaid',
      Accountant: '/cashier/unpaid',
    };
    navigate(routeMap[role] || '/unauthorized');
  }}>
    Weekly Unpaid Students
  </button>
</div>


      <div className="dash-main-content">
        <div className="dash-left-column">
          <div className="dash-stats-cards">
            <div className="dash-card">
              <p>Current Term</p>
              <h2>{currentTerm}</h2>
            </div>

            <div className="dash-card">
              <p>Total Students</p>
              <h2>{totalStudents}</h2>
            </div>

            <div className="dash-card">
              <p>Expected Amount</p>
              <h2>GHS: {expectedCollection}</h2>
            </div>

            <div className="dash-card">
              <p>Collected So Far</p>
              <h2>GHS: {grandTotalCollection}</h2>
            </div>

            <div className="dash-card">
              <p>Today's Total Collection</p>
              <h2>GHS: {todaysCollection}</h2>
            </div>

            <div className="dash-card">
              <p>Total Users</p>
              <h2>{totalUsers}</h2>
            </div>
          </div>

          <div className="dash-chart-container">
            {chartData ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            ) : (
              <p className="dash-loading-text">Loading chart...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
