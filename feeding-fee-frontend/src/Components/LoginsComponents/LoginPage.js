import React, { useState } from "react";
import "./LoginPage.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../Assets/images/logo-rmbg.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Named import for jwt-decode

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_API_URL}/auth/login`,
        { identifier, password }
      );
  
      const token = response.data.token;
      localStorage.setItem("token", token);
  
      const decoded = jwtDecode(token);
      const role = decoded.role;
  
      let userDetails = { role };
  
      if (role === "Student") {
        const student = response.data.student || {};
        userDetails.fullName = student.studentName || "Student";
        userDetails.studentId = student.studentId || "";
        userDetails.className = student.studentClass || "";
      } else {
        const user = response.data.user || {};
        userDetails.fullName = user.fullName || "User";
        userDetails.email = user.email || "";
      }
  
      localStorage.setItem("user", JSON.stringify(userDetails));
  
      // Redirect
      if (role === "Admin") navigate("/admin");
      else if (role === "Cashier" || role === "Accountant") navigate("/cashier");
      else if (role === "Registrar") navigate("/registrar");
      else if (role === "Student") navigate("/parent");
      else navigate("/unauthorized");
  
    } catch (err) {
      setError("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      {/* Logo Section */}
      <div className="login-left">
        <img src={logo} alt="WestsideLogo" className="login-logo" />
      </div>

      {/* Form Section */}
      <div className="login-right">
        <h1 className="login-title">Feeding Fees Management System</h1>
        <div className="login-box">
          <h2 className="login-welcome">Welcome Back</h2>
          <p className="login-subtext">Please login to continue</p>

          {/* Show error message */}
          {error && <p className="login-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label className="login-form-label">Email or Student ID</label>
              <input
                className="login-input"
                type="text"
                placeholder="Enter your email or Student ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="login-form-group login-password-field">
              <label className="login-form-label">Password</label>
              <input
                className="login-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="login-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="login-forgot-password">
            <a
                  href="#"
                  className="login-forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault(); // Prevents the page from jumping
                    alert("Contact the Admin for your password to be reset.");
                  }}
                >
             Forgot Password?
             </a>

            </div>

            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
