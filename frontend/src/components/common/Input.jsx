// src/components/common/Input.jsx
import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  icon,
  required = false,
  placeholder,
  autoComplete,
  disabled = false,
  ...props
}) => {
  // Additional validation for email type
  const handleEmailValidation = (e) => {
    if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        // You can handle this via parent component if needed
        console.log("Invalid email format");
      }
    }
  };

  return (
    <div className="input-group">
      {label && (
        <label className="input-label" htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            if (type === "email") handleEmailValidation(e);
            if (onBlur) onBlur(e);
          }}
          placeholder={placeholder}
          className={`input-field ${icon ? "has-icon" : ""} ${error ? "input-error" : ""}`}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
