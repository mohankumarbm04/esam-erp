import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  React.useEffect(() => {
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>ESAM-ERP Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to your Dashboard!</h2>
          <p>You have successfully logged in to ESAM-ERP.</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Attendance</h3>
            <p className="stat-value">85%</p>
          </div>

          <div className="stat-card">
            <h3>Current GPA</h3>
            <p className="stat-value">3.5</p>
          </div>

          <div className="stat-card">
            <h3>Courses</h3>
            <p className="stat-value">6</p>
          </div>

          <div className="stat-card">
            <h3>Assignments</h3>
            <p className="stat-value">4</p>
          </div>
        </div>

        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <ul>
            <li>Mathematics assignment graded - 92%</li>
            <li>Physics lab attendance recorded</li>
            <li>New course material available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
