// src/components/StatCard.jsx
import React from "react";
import "./StatCard.css";

const StatCard = ({ title, value, icon, color, trend }) => {
  const colors = {
    blue: { bg: "#DBEAFE", text: "#2563EB" },
    green: { bg: "#D1FAE5", text: "#10B981" },
    yellow: { bg: "#FEF3C7", text: "#F59E0B" },
    red: { bg: "#FEE2E2", text: "#EF4444" },
    purple: { bg: "#EDE9FE", text: "#8B5CF6" },
  };

  const style = colors[color] || colors.blue;

  return (
    <div className="stat-card">
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {trend && <p className="stat-trend">{trend}</p>}
      </div>
      <div
        className="stat-icon"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
