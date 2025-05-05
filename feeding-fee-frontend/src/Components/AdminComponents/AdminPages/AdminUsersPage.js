import React, { useState, useEffect } from "react";
import "./AdminUsersPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_API_URL}/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("There was an error fetching the users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userEmail) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_API_URL}/users/${encodeURIComponent(
          userEmail
        )}`
      );
      setUsers(users.filter((user) => user.email !== userEmail));
      alert("User deleted successfully.");
    } catch (error) {
      console.error("There was an error deleting the user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleResetPassword = async (email) => {
    if (!window.confirm(`Reset password for ${email}?`)) return;
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_API_URL}/users/reset-password`,
        { email }
      );

      alert(`Password reset successfully for ${email}.`);
    } catch (error) {
      console.error("There was an error resetting the password:", error);
      alert("Failed to reset password.");
    }
  };

  const handleAddUser = () => {
    navigate("/admin/users/add");
  };

  const handleChangePassword = () => {
    navigate("/admin/users/change-password");
  };

  const handleResetParentPassword = () => {
    navigate("/admin/users/reset-parent-password");
  };

  return (
    <div className="userpage-container">
      <h1 className="userpage-title">Admin Users</h1>

      <div className="userpage-buttons">
        <button className="userpage-button" onClick={handleAddUser}>
          Add User
        </button>
        <button className="userpage-button" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="userpage-button" onClick={handleResetParentPassword}>
          Reset Parent Password
        </button>
      </div>

      <div className="userpage-table-container">
        <table className="userpage-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.contact}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="userpage-reset-btn"
                    onClick={() => handleResetPassword(user.email)}
                  >
                    Reset Password
                  </button>
                  <button
                    className="userpage-delete-btn"
                    onClick={() => handleDeleteUser(user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
