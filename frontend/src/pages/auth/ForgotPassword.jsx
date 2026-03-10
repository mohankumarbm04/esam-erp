// frontend/src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccessMessage(result.message);
      setEmail("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Forgot Password?</h2>
        <p className="login-subtitle">
          Enter your email and we'll send you a reset link
        </p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: "20px" }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: "20px" }}>
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="input-group">
            <label className="input-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`input-field has-icon ${errors.email ? "input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.email && (
              <span className="input-error-message">{errors.email}</span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: "24px" }}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: "20px" }}>
          <p>
            <Link to="/login" className="signup-link">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
