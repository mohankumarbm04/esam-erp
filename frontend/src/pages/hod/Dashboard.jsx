// pages/hod/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  BellIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const HODDashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    subjects: 0,
    lowAttendance: 0,
    pendingApprovals: 0,
  });
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      await Promise.all([fetchDepartmentData(), fetchStats()]);
      if (!isMounted) return;
      setLoading(false);
    };

    load();
    setRecentActivities([]);

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchDepartmentData = async () => {
    try {
      const response = await api.get("/hod/department");
      setDepartment(response.data.department || null);
    } catch (error) {
      console.error("Error fetching department:", error);
      setDepartment(null);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/hod/stats");
      setStats({
        teachers: response.data.teachers || 0,
        students: response.data.students || 0,
        subjects: response.data.subjects || 0,
        lowAttendance: response.data.lowAttendance || 0,
        pendingApprovals: response.data.pendingApprovals || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        teachers: 0,
        students: 0,
        subjects: 0,
        lowAttendance: 0,
        pendingApprovals: 0,
      });
    }
  };

  const StatCard = ({ title, value, icon: Icon, onClick, trend = "+0%" }) => {
    const getIconBg = () => {
      switch (title) {
        case "Total Teachers":
          return "bg-blue-50 text-blue-600";
        case "Total Students":
          return "bg-green-50 text-green-600";
        case "Total Subjects":
          return "bg-purple-50 text-purple-600";
        case "Low Attendance":
          return "bg-orange-50 text-orange-600";
        default:
          return "bg-gray-50 text-gray-600";
      }
    };

    return (
      <div onClick={onClick} className="stat-card-modern cursor-pointer group">
        <div className="flex items-start justify-between">
          <div>
            <p className="stat-title">{title}</p>
            <p className="stat-value">{value}</p>
          </div>
          <div
            className={`p-3 rounded-xl ${getIconBg()} group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="stat-trend">
          <span className="trend-up">{trend}</span>
          <span className="text-muted">this semester</span>
        </div>
      </div>
    );
  };

  const QuickActionCard = ({ label, icon: Icon, onClick, color }) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
      green: "bg-green-50 text-green-600 hover:bg-green-100",
      purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
      orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    };

    return (
      <button
        onClick={onClick}
        className={`p-4 rounded-xl ${colors[color]} transition-all hover:scale-105 flex flex-col items-center gap-2 group`}
      >
        <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getAvatarColor = () => {
      switch (activity.type) {
        case "teacher":
          return "bg-blue-100 text-blue-600";
        case "attendance":
          return "bg-green-100 text-green-600";
        case "alert":
          return "bg-orange-100 text-orange-600";
        case "marks":
          return "bg-purple-100 text-purple-600";
        default:
          return "bg-gray-100 text-gray-600";
      }
    };

    return (
      <div className="activity-item">
        <div className={`activity-avatar ${getAvatarColor()}`}>
          {activity.avatar}
        </div>
        <div className="activity-content">
          <div className="activity-title">{activity.action}</div>
          <div className="activity-meta">
            <span>by {activity.user}</span>
            <span className="activity-time">
              <ClockIcon className="w-3 h-3" />
              {activity.time}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="modern-header-clean">
        <div>
          <h1>HOD Dashboard</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">Department of</span>
            <span className="font-semibold text-gray-900">
              {department?.name}
            </span>
            <span className="badge badge-blue">{department?.code}</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="header-icon-button relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {stats.lowAttendance}
            </span>
          </button>
          <div className="user-profile">
            <span className="user-name">Dr. {user.name || "Sharma"}</span>
            <div className="user-avatar">H</div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="modern-card mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Welcome back, Dr. {user.name || "Sharma"}! 👋
            </h2>
            <p className="text-blue-100">
              Your department is performing well. Keep up the great work!
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <CalendarIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Teachers"
          value={stats.teachers}
          icon={UsersIcon}
          trend="+2 this month"
          onClick={() => navigate("/hod/teachers")}
        />
        <StatCard
          title="Total Students"
          value={stats.students}
          icon={AcademicCapIcon}
          trend="+15 new admissions"
          onClick={() => navigate("/hod/students")}
        />
        <StatCard
          title="Total Subjects"
          value={stats.subjects}
          icon={BookOpenIcon}
          trend="24 active courses"
          onClick={() => navigate("/hod/subjects")}
        />
        <StatCard
          title="Low Attendance"
          value={stats.lowAttendance}
          icon={ExclamationTriangleIcon}
          trend="⚠️ Needs attention"
          onClick={() => navigate("/hod/attendance")}
        />
      </div>

      {/* Department Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="modern-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted">HOD Name</p>
              <p className="font-semibold">{department?.hodName}</p>
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <p className="text-sm text-muted mb-2">Contact</p>
            <p className="text-sm">{department?.contact}</p>
          </div>
        </div>

        <div className="modern-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-600">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted">Office</p>
              <p className="font-semibold">{department?.office}</p>
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <p className="text-sm text-muted mb-2">Working Hours</p>
            <p className="text-sm">Mon - Fri, 9:00 AM - 5:00 PM</p>
          </div>
        </div>

        <div className="modern-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted">Department Stats</p>
              <p className="font-semibold">This Semester</p>
            </div>
          </div>
          <div className="border-t pt-4 mt-2">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted">Pass Percentage</span>
              <span className="font-semibold text-green-600">87%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Avg. Attendance</span>
              <span className="font-semibold text-blue-600">82%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <CalendarIcon className="w-5 h-5" />
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard
            label="Teachers"
            icon={UsersIcon}
            color="blue"
            onClick={() => navigate("/hod/teachers")}
          />
          <QuickActionCard
            label="Students"
            icon={AcademicCapIcon}
            color="green"
            onClick={() => navigate("/hod/students")}
          />
          <QuickActionCard
            label="Attendance"
            icon={ChartBarIcon}
            color="orange"
            onClick={() => navigate("/hod/attendance")}
          />
          <QuickActionCard
            label="Reports"
            icon={BookOpenIcon}
            color="purple"
            onClick={() => navigate("/hod/reports")}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Recent Activities */}
        <div className="modern-card">
          <div className="card-header">
            <h3 className="card-title">
              <ArrowTrendingUpIcon className="w-5 h-5" />
              Recent Activities
            </h3>
            <span className="card-action">View All →</span>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Pending Approvals & Alerts */}
        <div className="modern-card">
          <div className="card-header">
            <h3 className="card-title">
              <ExclamationTriangleIcon className="w-5 h-5" />
              Pending Items
            </h3>
          </div>

          <div className="space-y-4">
            {/* Pending Approvals */}
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Pending Approvals</p>
                  <p className="text-sm text-muted">
                    {stats.pendingApprovals} requests
                  </p>
                </div>
              </div>
              <button className="text-sm text-yellow-600 hover:text-yellow-800 font-medium">
                Review
              </button>
            </div>

            {/* Leave Requests */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Leave Requests</p>
                  <p className="text-sm text-muted">
                    2 teachers requested leave
                  </p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View
              </button>
            </div>

            {/* Timetable Changes */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Timetable Changes</p>
                  <p className="text-sm text-muted">3 pending adjustments</p>
                </div>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                Review
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-blue-600">
                  {stats.teachers}
                </p>
                <p className="text-xs text-muted">Teachers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-green-600">
                  {stats.students}
                </p>
                <p className="text-xs text-muted">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-purple-600">
                  {stats.subjects}
                </p>
                <p className="text-xs text-muted">Subjects</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
