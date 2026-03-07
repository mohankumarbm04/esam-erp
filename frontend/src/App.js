// frontend/src/App.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [hasToken, setHasToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 ProtectedRoute - token exists:", !!token);
    setHasToken(!!token);
  }, []);

  if (hasToken === null) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (!hasToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
