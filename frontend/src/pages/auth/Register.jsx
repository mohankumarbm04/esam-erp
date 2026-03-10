// frontend/src/pages/auth/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const departments = [
    "Computer Science Engineering",
    "Electronics & Communication Engg",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Information Technology",
    "Artificial Intelligence & ML",
    "Data Science",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions";
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

    const result = await register(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: "500px" }}>
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Join our engineering college</p>

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
            <label className="input-label" htmlFor="name">
              Full Name <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`input-field has-icon ${errors.name ? "input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.name && (
              <span className="input-error-message">{errors.name}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="email">
              Email Address <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
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

          <div className="input-group">
            <label className="input-label" htmlFor="role">
              Register as <span className="required">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
            </select>
          </div>

          {formData.role !== "parent" && (
            <div className="input-group">
              <label className="input-label" htmlFor="department">
                Department <span className="required">*</span>
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                disabled={loading}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <label className="input-label" htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`input-field has-icon ${errors.password ? "input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.password && (
              <span className="input-error-message">{errors.password}</span>
            )}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`input-field has-icon ${errors.confirmPassword ? "input-error" : ""}`}
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && (
              <span className="input-error-message">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <div className="input-group">
            <label className="remember-me">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <span>
                I agree to the Terms and Conditions{" "}
                <span className="required">*</span>
              </span>
            </label>
            {errors.agreeTerms && (
              <span className="input-error-message">{errors.agreeTerms}</span>
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
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="login-footer" style={{ marginTop: "20px" }}>
          <p>
            Already have an account?{" "}
            <a href="/login" className="signup-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
