import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminDashboardLayout.css";
import Logo from "../../Assets/images/logo.png";
import { logout } from "../../../utils/logout";

import DashboardIcon from "../../Assets/icons/dashboard.png";
import PaymentsIcon from "../../Assets/icons/payments.png";
import StudentsIcon from "../../Assets/icons/students.png";
import UsersIcon from "../../Assets/icons/users.png";
import ReportsIcon from "../../Assets/icons/reports.png";
import LogsIcon from "../../Assets/icons/logs.png";
import LogoutIcon from "../../Assets/icons/logout.png";
import SettingsIcon from "../../Assets/icons/settings.png";

import { FaBars, FaTimes } from "react-icons/fa";

const AdminDashboardLayout = () => {
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
            <FaTimes
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="Close menu"
            />
          ) : (
            <FaBars
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="Open menu"
            />
          )}
        </div>
        <div className="navbar-title">Feeding Fees Management System</div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <img src={Logo} alt="Logo" className="sidebar-logo" />
        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={DashboardIcon} alt="Dashboard" className="nav-img" />{" "}
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/students"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={StudentsIcon} alt="Students" className="nav-img" />{" "}
            Students
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={PaymentsIcon} alt="Payments" className="nav-img" />{" "}
            Payments
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={ReportsIcon} alt="Reports" className="nav-img" /> Reports
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={UsersIcon} alt="Users" className="nav-img" /> System Users
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={SettingsIcon} alt="Users" className="nav-img" /> Settings
          </NavLink>

          <NavLink
            to="/admin/logs"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeSidebar}
          >
            <img src={LogsIcon} alt="Logs" className="nav-img" /> System Logs
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

export default AdminDashboardLayout;
