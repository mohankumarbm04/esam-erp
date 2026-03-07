// components/common/Button.jsx
import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  disabled = false,
  type = "button",
  fullWidth = false,
  className = "",
}) => {
  const baseClasses =
    "btn inline-flex items-center justify-center font-medium transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700",
    success:
      "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700",
    warning:
      "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700",
    outline:
      "bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    fullWidth ? "w-full" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className={`${children ? "mr-2" : ""} h-5 w-5`} />}
      {children}
    </button>
  );
};

export default Button;
