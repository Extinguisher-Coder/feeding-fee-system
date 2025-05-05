// src/utils/logout.js

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to login page
  };
  