// components/common/StyledCard.jsx
import React from "react";

const StyledCard = ({
  children,
  className = "",
  onClick,
  hoverable = true,
  gradient = false,
  glass = false,
}) => {
  let cardClass = "modern-card";

  if (gradient) cardClass = "stat-card";
  else if (glass) cardClass = "glass-card";
  else cardClass = "modern-card";

  return (
    <div
      className={`${cardClass} ${hoverable ? "cursor-pointer" : ""} ${className} fade-in`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default StyledCard;
