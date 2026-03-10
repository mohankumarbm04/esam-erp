// frontend/src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NotificationBell from "./common/NotificationBell";

const Navbar = ({ title, user: propUser }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Use user from context if available, otherwise use prop
  const currentUser = user || propUser;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>{title || "Dashboard"}</h1>
      </div>
      <div className="navbar-right">
        <div style={{ marginRight: 16 }}>
          <NotificationBell />
        </div>
        <div className="user-info">
          <span className="user-avatar">{getInitials(currentUser?.name)}</span>
          <span>{currentUser?.name || "User"}</span>
          <span
            style={{
              fontSize: "12px",
              background: "#e2e8f0",
              padding: "2px 8px",
              borderRadius: "12px",
              color: "#4B5563",
              textTransform: "capitalize",
            }}
          >
            {currentUser?.role || "admin"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
          style={{ padding: "6px 12px" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
