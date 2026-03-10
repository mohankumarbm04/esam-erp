import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-side">
        <div className="auth-brand">
          <h1>ESAM-ERP</h1>
          <p>Engineering Student Academic Monitoring & ERP System</p>
        </div>
        <div className="auth-illustration">
          <h2>Manage Your Academic Journey</h2>
          <p>Track attendance, marks, performance, and more in one place.</p>
        </div>
      </div>
      <div className="auth-main">
        <div className="auth-container">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
