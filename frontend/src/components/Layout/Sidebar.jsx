import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon, // or LogoutIcon - check which one works
  BuildingOfficeIcon, // This was missing!
} from "@heroicons/react/24/outline";

const Sidebar = ({ user, role }) => {
  const navigate = useNavigate();

  const getNavItems = () => {
    const common = [
      { path: `/${role}/dashboard`, name: "Dashboard", icon: HomeIcon },
    ];

    switch (role) {
      case "admin":
        return [
          ...common,
          {
            path: "/admin/departments",
            name: "Departments",
            icon: BuildingOfficeIcon,
          },
          { path: "/admin/teachers", name: "Teachers", icon: UsersIcon },
          { path: "/admin/students", name: "Students", icon: AcademicCapIcon },
          { path: "/admin/subjects", name: "Subjects", icon: BookOpenIcon },
          { path: "/admin/attendance", name: "Attendance", icon: ChartBarIcon },
          { path: "/admin/reports", name: "Reports", icon: DocumentTextIcon },
        ];
      case "teacher":
        return [
          ...common,
          { path: "/teacher/classes", name: "My Classes", icon: BookOpenIcon },
          {
            path: "/teacher/attendance",
            name: "Mark Attendance",
            icon: ChartBarIcon,
          },
          {
            path: "/teacher/marks",
            name: "Enter Marks",
            icon: DocumentTextIcon,
          },
          { path: "/teacher/students", name: "Students", icon: UsersIcon },
        ];
      case "student":
        return [
          ...common,
          {
            path: "/student/attendance",
            name: "My Attendance",
            icon: ChartBarIcon,
          },
          { path: "/student/marks", name: "My Marks", icon: DocumentTextIcon },
          {
            path: "/student/transcript",
            name: "Transcript",
            icon: AcademicCapIcon,
          },
          {
            path: "/student/documents",
            name: "Documents",
            icon: DocumentTextIcon,
          },
        ];
      case "hod":
        return [
          ...common,
          { path: "/hod/teachers", name: "Teachers", icon: UsersIcon },
          { path: "/hod/students", name: "Students", icon: AcademicCapIcon },
          { path: "/hod/attendance", name: "Attendance", icon: ChartBarIcon },
          { path: "/hod/reports", name: "Reports", icon: DocumentTextIcon },
        ];
      case "parent":
        return [
          ...common,
          {
            path: "/parent/attendance",
            name: "Child Attendance",
            icon: ChartBarIcon,
          },
          {
            path: "/parent/marks",
            name: "Child Marks",
            icon: DocumentTextIcon,
          },
          {
            path: "/parent/reports",
            name: "Child Reports",
            icon: DocumentTextIcon,
          },
        ];
      default:
        return common;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ESAM-ERP</h2>
        <p>{user?.username || "User"}</p>
        <small className="role-badge">{role}</small>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon className="nav-icon" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <ArrowLeftOnRectangleIcon className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
