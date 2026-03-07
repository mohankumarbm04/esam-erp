// frontend/src/App.js
import React from "react";

function App() {
  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>🎓 ESAM-ERP</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Engineering Student Academic Monitoring System
      </p>
      <div
        style={{
          backgroundColor: "white",
          color: "#333",
          padding: "20px 40px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p style={{ fontSize: "1.1rem", color: "#28a745" }}>
          ✅ React is working on Vercel!
        </p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "10px" }}>
          Deployment successful • {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default App;
