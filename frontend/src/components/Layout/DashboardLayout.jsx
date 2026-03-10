// src/components/Layout/DashboardLayout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ children, user, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>ESAM-ERP</h2>
          <p className="role-badge">{role?.toUpperCase()}</p>
        </div>

        <nav className="sidebar-nav">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="nav-item active"
          >
            <span>📊</span>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/admin/departments")}
            className="nav-item"
          >
            <span>🏛️</span>
            <span>Departments</span>
          </button>
          <button
            onClick={() => navigate("/admin/teachers")}
            className="nav-item"
          >
            <span>👥</span>
            <span>Teachers</span>
          </button>
          <button
            onClick={() => navigate("/admin/students")}
            className="nav-item"
          >
            <span>👨‍🎓</span>
            <span>Students</span>
          </button>
          <button
            onClick={() => navigate("/admin/subjects")}
            className="nav-item"
          >
            <span>📚</span>
            <span>Subjects</span>
          </button>
          <button
            onClick={() => navigate("/admin/attendance")}
            className="nav-item"
          >
            <span>📅</span>
            <span>Attendance</span>
          </button>
          <button
            onClick={() => navigate("/admin/reports")}
            className="nav-item"
          >
            <span>📊</span>
            <span>Reports</span>
          </button>
          <button
            onClick={() => navigate("/admin/fees")}
            className="nav-item"
          >
            <span>💰</span>
            <span>Fees</span>
          </button>
          <button
            onClick={() => navigate("/admin/settings")}
            className="nav-item"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || "A"}</div>
            <div className="user-details">
              <p className="user-name">{user?.name || "Admin User"}</p>
              <p className="user-role">{role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default DashboardLayout;
