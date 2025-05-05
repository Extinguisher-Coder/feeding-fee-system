import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (allowedRoles.includes(userRole)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  } catch (err) {
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
