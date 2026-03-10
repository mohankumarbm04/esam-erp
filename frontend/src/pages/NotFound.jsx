import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "white",
          padding: "3rem",
          borderRadius: "1rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{ fontSize: "4rem", color: "#667eea", margin: "0 0 1rem 0" }}
        >
          404
        </h1>
        <h2 style={{ color: "#333", marginBottom: "1rem" }}>Page Not Found</h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotFound;
