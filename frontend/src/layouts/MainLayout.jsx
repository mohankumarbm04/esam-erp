import React from "react";
import Sidebar from "../components/Sidebar.jsx"; // Fixed extension from .jxsx to .jsx
import Navbar from "../components/Navbar.jsx"; // Fixed extension from .jxsx to .jsx

const MainLayout = ({ children, title, user, role = "admin" }) => {
  return (
    <div className="main-layout">
      <Sidebar role={role} />
      <div className="main-content">
        <Navbar title={title} user={user} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
