// src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/Input";
import Button from "../../components/Button";
import AlertBox from "../../components/AlertBox";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setAlert({
      type: "success",
      message: "Account created! Redirecting to login...",
    });

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <AuthLayout>
      <div className="auth-form">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us to start your academic journey</p>

        {alert && <AlertBox type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon="👤"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon="📧"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon="🔒"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon="🔒"
          />

          <div className="terms">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
              <Link to="/privacy">Privacy Policy</Link>
            </label>
          </div>

          <Button type="submit" fullWidth>
            Sign Up
          </Button>

          <div className="auth-divider">
            <span>Or sign up with</span>
          </div>

          <div className="social-buttons">
            <button className="social-btn google">
              <span>G</span> Google
            </button>
            <button className="social-btn github">
              <span>GH</span> GitHub
            </button>
          </div>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
