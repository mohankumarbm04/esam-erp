// src/components/Sidebar.jsx
import React, { useState } from "react";

const Sidebar = ({ role = "admin" }) => {
  const [active, setActive] = useState("dashboard");

  const menuItems = {
    admin: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "students", label: "Students", icon: "👥" },
      { id: "attendance", label: "Attendance", icon: "📅" },
      { id: "marks", label: "Marks", icon: "📈" },
      { id: "performance", label: "Performance", icon: "📉" },
      { id: "documents", label: "Documents", icon: "📄" },
      { id: "reports", label: "Reports", icon: "📋" },
      { id: "settings", label: "Settings", icon: "⚙️" },
    ],
    hod: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "students", label: "Students", icon: "👥" },
      { id: "attendance", label: "Attendance", icon: "📅" },
      { id: "marks", label: "Marks", icon: "📈" },
      { id: "performance", label: "Performance", icon: "📉" },
      { id: "reports", label: "Reports", icon: "📋" },
    ],
    teacher: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "attendance", label: "Attendance", icon: "📅" },
      { id: "marks", label: "Marks", icon: "📈" },
      { id: "performance", label: "Performance", icon: "📉" },
    ],
    student: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "attendance", label: "Attendance", icon: "📅" },
      { id: "marks", label: "Marks", icon: "📈" },
      { id: "performance", label: "Performance", icon: "📉" },
      { id: "documents", label: "Documents", icon: "📄" },
    ],
    parent: [
      { id: "dashboard", label: "Dashboard", icon: "📊" },
      { id: "performance", label: "Performance", icon: "📉" },
      { id: "reports", label: "Reports", icon: "📋" },
    ],
  };

  const items = menuItems[role] || menuItems.admin;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>ESAM-ERP</h2>
        <p>{role.toUpperCase()} Panel</p>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${active === item.id ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActive(item.id);
            }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="sidebar-link logout">
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
