import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./CasherDashboardLayout.css";
import Logo from '../../Assets/images/logo.png';
import { logout } from "../../../utils/logout";

import DashboardIcon from '../../Assets/icons/dashboard.png';
import PaymentsIcon from '../../Assets/icons/payments.png';
import ReportsIcon from '../../Assets/icons/reports.png';
import LogoutIcon from '../../Assets/icons/logout.png';
import ChangePassword from '../../Assets/icons/change-password.png';
import FeedingIcon from '../../Assets/icons/feeding.png';
import BusIcon from '../../Assets/icons/bus.png';
import CashierIcon from "../../Assets/icons/cashier.png";

import { FaBars, FaTimes } from "react-icons/fa";

const CasherDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-grid-container">
      {/* Top Navbar */}
      <div className="top-navbar">
        <div className="navbar-toggle">
          {isSidebarOpen ? (
            <FaTimes className="menu-toggle" onClick={toggleSidebar} aria-label="Close menu" />
          ) : (
            <FaBars className="menu-toggle" onClick={toggleSidebar} aria-label="Open menu" />
          )}
        </div>
        <div className="navbar-title">Feeding Fees Management System</div>
       
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <img src={Logo} alt="Logo" className="sidebar-logo" />
        <nav className="sidebar-nav">
          <NavLink
            to="/cashier/dashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={DashboardIcon} alt="Dashboard" className="nav-img" /> Dashboard
          </NavLink>

          <a
  href="https://westsidetransport.vercel.app"
  onClick={(e) => {
    e.preventDefault(); // Stop default navigation
    logout(); // Clear token and other data

    setTimeout(() => {
      window.location.href = "https://westsidetransport.vercel.app"; // Redirect after logout
    }, 100); // Short delay to allow logout to complete
  }}
  className="nav-link"
>
  <img src={BusIcon} alt="BusIcon" className="nav-imgbus" /> Transport System
</a>



          <NavLink
            to="/cashier/payments"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={PaymentsIcon} alt="Payments" className="nav-img" /> Cash Payments
          </NavLink>

          <NavLink
            to="/cashier/daily-subscriber"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={FeedingIcon} alt="FeedingIcon" className="nav-img" /> Daily Subscribers
          </NavLink>

          <NavLink
            to="/cashier/reports"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={ReportsIcon} alt="Reports" className="nav-img" /> Reports
          </NavLink>

           
           <NavLink
              to="/cashier/cashier-balancing"
               className={({ isActive }) => (isActive ? "active" : "")}
               onClick={closeSidebar}
               >
              <img src={CashierIcon} alt="CashierIcon" className="nav-img" /> Cashier Weekly Balancing
             </NavLink>



          <NavLink
            to="/cashier/change-password"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={ChangePassword} alt="Reports" className="nav-img" /> Change Password
          </NavLink>

          <NavLink
                     to="/"
                     className={({ isActive }) => (isActive ? "active" : "")}
                     onClick={() => {
                       closeSidebar();
                       logout(); // Clear token and redirect
                     }}
                   >
                     <img src={LogoutIcon} alt="Logout" className="nav-img" /> Logout
                   </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CasherDashboardLayout;
