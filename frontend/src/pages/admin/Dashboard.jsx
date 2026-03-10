// frontend/src/pages/admin/Dashboard.jsx
import "./Admin.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import NotificationBell from "../../components/common/NotificationBell";
import "./Dashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalDepartments: 0,
    totalSubjects: 0,
    activeStudents: 0,
    avgSemester: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Get user from storage
        const userStr =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userStr && isMounted) {
          setUser(JSON.parse(userStr));
        }

        // Fetch stats from API (real DB)
        const response = await api.get("/dashboard/stats");

        if (isMounted) {
          setStats(response.data);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
        if (isMounted) {
          setError(
            error.response?.data?.error || "Failed to load dashboard data",
          );
          setStats({
            totalStudents: 0,
            totalTeachers: 0,
            totalDepartments: 0,
            totalSubjects: 0,
            activeStudents: 0,
            avgSemester: 0,
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const StatCard = ({ title, value, icon: Icon, onClick, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };

    return (
      <div
        onClick={onClick}
        className="stat-card cursor-pointer group hover:shadow-lg transition-all duration-300"
      >
        <div className="stat-card-header">
          <div>
            <p className="stat-card-title">{title}</p>
            <p className="stat-card-value">{value}</p>
          </div>
          <div className={"stat-icon bg-gradient-to-r " + colorClasses[color]}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="stat-footer">
          <span className="text-sm text-muted">Click to manage</span>
          <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
            ?
          </span>
        </div>
      </div>
    );
  };

  const QuickActionButton = ({ label, icon: Icon, onClick }) => (
    <button
      onClick={onClick}
      className="quick-action-btn group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
    >
      <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
        {label}
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="mt-4 text-muted">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} role="admin">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Welcome back, {user?.name?.split(" ")[0] || "Admin"}!</h1>
          <p className="text-muted">
            Here's what's happening in your academy today.
          </p>
        </div>
        <div className="header-actions">
          <NotificationBell />
          <button className="icon-btn">
            <CogIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error Message if any */}
      {error && (
        <div className="alert alert-warning mb-6">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Departments"
          value={stats.totalDepartments}
          icon={BuildingOfficeIcon}
          color="blue"
          onClick={() => navigate("/admin/departments")}
        />
        <StatCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={UsersIcon}
          color="green"
          onClick={() => navigate("/admin/teachers")}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={AcademicCapIcon}
          color="purple"
          onClick={() => navigate("/admin/students")}
        />
        <StatCard
          title="Total Subjects"
          value={stats.totalSubjects}
          icon={BookOpenIcon}
          color="orange"
          onClick={() => navigate("/admin/subjects")}
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={CheckCircleIcon}
          color="green"
          onClick={() => navigate("/admin/students")}
        />
        <StatCard
          title="Average Semester"
          value={stats.avgSemester}
          icon={ChartBarIcon}
          color="purple"
          onClick={() => navigate("/admin/students")}
        />
      </div>

      {/* Quick Actions */}
      <div className="card mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <span className="text-sm text-muted">Frequently used tasks</span>
        </div>
        <div className="quick-actions-grid">
          <QuickActionButton
            label="Departments"
            icon={BuildingOfficeIcon}
            onClick={() => navigate("/admin/departments")}
          />
          <QuickActionButton
            label="Teachers"
            icon={UsersIcon}
            onClick={() => navigate("/admin/teachers")}
          />
          <QuickActionButton
            label="Students"
            icon={AcademicCapIcon}
            onClick={() => navigate("/admin/students")}
          />
          <QuickActionButton
            label="Subjects"
            icon={BookOpenIcon}
            onClick={() => navigate("/admin/subjects")}
          />
          <QuickActionButton
            label="Attendance"
            icon={ChartBarIcon}
            onClick={() => navigate("/admin/attendance")}
          />
          <QuickActionButton
            label="Reports"
            icon={DocumentTextIcon}
            onClick={() => navigate("/admin/reports")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
        <div className="text-sm text-muted">
          No recent activity yet.
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
