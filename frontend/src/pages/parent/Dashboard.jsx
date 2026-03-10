// pages/parent/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import {
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  BellIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
  );

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError("");

      await Promise.all([fetchChildren(), fetchAlerts(), fetchNotifications()]);

      if (!isMounted) return;
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchChildren = async () => {
    try {
      const response = await api.get("/parent/children");
      const nextChildren = response.data.children || [];
      setChildren(nextChildren);
      if (nextChildren.length > 0) setSelectedChild(nextChildren[0]);
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Failed to load children");
      setChildren([]);
      setSelectedChild(null);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get("/parent/alerts");
      setAlerts(response.data.alerts || []);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setAlerts([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/parent/notifications");
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const ChildCard = ({ child, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition ${
        selected
          ? "bg-blue-50 border-2 border-blue-500 shadow-md"
          : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow"
      }`}
    >
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          {child.name.charAt(0)}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-900">{child.name}</h3>
          <p className="text-xs text-gray-600">{child.usn}</p>
          <div className="flex items-center mt-1 text-xs text-gray-500">
            <AcademicCapIcon className="h-3 w-3 mr-1" />
            {child.department} • Sem {child.semester} • Sec {child.section}
          </div>
        </div>
        {child.attendance < 75 && (
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
        )}
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => {
    const colors = {
      warning: "bg-yellow-50 border-yellow-400 text-yellow-700",
      info: "bg-blue-50 border-blue-400 text-blue-700",
      success: "bg-green-50 border-green-400 text-green-700",
    };

    return (
      <div className={`${colors[alert.severity]} border-l-4 p-4 rounded-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex">
            <ExclamationTriangleIcon
              className={`h-5 w-5 ${
                alert.severity === "warning"
                  ? "text-yellow-400"
                  : alert.severity === "info"
                    ? "text-blue-400"
                    : "text-green-400"
              }`}
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{alert.message}</p>
              <p className="text-xs mt-1 opacity-75">
                {alert.child} • {alert.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">
              Parent Dashboard
            </h1>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <BellIcon className="h-5 w-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0) || "P"}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.name || "Parent"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.name?.split(" ")[0] || "Parent"}!
          </h2>
          <p className="text-purple-100">
            Stay updated with your children's academic progress.
          </p>
        </div>

        {/* Children Selection */}
        {children.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-purple-500" />
              My Children
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  selected={selectedChild?.id === child.id}
                  onClick={() => setSelectedChild(child)}
                />
              ))}
            </div>
          </div>
        )}

        {selectedChild && (
          <>
            {/* Child's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Attendance"
                value={`${selectedChild.attendance}%`}
                icon={CalendarIcon}
                color="bg-green-500"
                subtitle={
                  selectedChild.attendance >= 75
                    ? "Meeting requirement"
                    : "Below 75%"
                }
              />
              <StatCard
                title="Current SGPA"
                value={selectedChild.sgpa}
                icon={ChartBarIcon}
                color="bg-blue-500"
                subtitle={`Semester ${selectedChild.semester}`}
              />
              <StatCard
                title="CGPA"
                value={selectedChild.cgpa}
                icon={AcademicCapIcon}
                color="bg-purple-500"
                subtitle="Overall"
              />
              <StatCard
                title="Last Active"
                value={selectedChild.lastActive}
                icon={UserIcon}
                color="bg-orange-500"
                subtitle="in system"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <button
                onClick={() =>
                  navigate("/parent/attendance", {
                    state: { child: selectedChild },
                  })
                }
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 flex items-center group"
              >
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition mr-4">
                  <CalendarIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">View Attendance</p>
                  <p className="text-sm text-gray-500">
                    Check daily attendance records
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/parent/marks", { state: { child: selectedChild } })
                }
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 flex items-center group"
              >
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition mr-4">
                  <ChartBarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Check Marks</p>
                  <p className="text-sm text-gray-500">
                    View subject-wise marks and grades
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/parent/reports", {
                    state: { child: selectedChild },
                  })
                }
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition border border-gray-100 flex items-center group"
              >
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition mr-4">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">
                    Download Reports
                  </p>
                  <p className="text-sm text-gray-500">
                    Get report cards and transcripts
                  </p>
                </div>
              </button>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Alerts */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Alerts
                </h2>
                <div className="space-y-3">
                  {alerts
                    .filter((alert) => alert.child === selectedChild.name)
                    .map((alert) => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  {alerts.filter((alert) => alert.child === selectedChild.name)
                    .length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No new alerts for {selectedChild.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Contact & Notifications */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>parent@family.com</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>Mr. Robert Johnson</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Upcoming Events
                  </h2>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="border-l-4 border-blue-400 pl-3 py-2"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notif.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {children.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No children found
            </h3>
            <p className="text-gray-500 mt-2">
              No children are linked to your account yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
