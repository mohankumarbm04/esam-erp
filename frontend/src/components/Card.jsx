// src/components/Card.jsx
import React from "react";
import "./Card.css";

const Card = ({ children, title, subtitle, className = "" }) => {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
