import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./ParentDashboardLayout.css";
import Logo from '../../Assets/images/logo.png';
import { logout } from "../../../utils/logout";

import DashboardIcon from '../../Assets/icons/dashboard.png';
import PaymentsIcon from '../../Assets/icons/payments.png';
import ContactUS from '../../Assets/icons/contact-us.png';
import LogoutIcon from '../../Assets/icons/logout.png';
import ChangePassword from '../../Assets/icons/change-password.png';

import { FaBars, FaTimes } from "react-icons/fa";

const ParentDashboardLayout = () => {
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
            to="/parent/portal"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={DashboardIcon} alt="Portal" className="nav-img" /> Student Portal
          </NavLink>


          <NavLink
            to="/parent/contact-us"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={ContactUS} alt="Contact" className="nav-img" /> Contact Us
          </NavLink>

          <NavLink
            to="/parent/change-password"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={closeSidebar}
          >
            <img src={ChangePassword} alt="PasswordIcon" className="nav-img" /> Change Password
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

export default ParentDashboardLayout;
