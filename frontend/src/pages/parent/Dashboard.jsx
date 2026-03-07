// pages/parent/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@heroicons/react/24/outline";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchChildren();
    fetchAlerts();
    fetchNotifications();
  }, []);

  const fetchChildren = async () => {
    // Mock data - parent has 2 children
    const mockChildren = [
      {
        id: 1,
        name: "Alice Johnson",
        usn: "1BI21CS001",
        department: "Computer Science",
        semester: 3,
        section: "A",
        attendance: 92,
        sgpa: 8.5,
        cgpa: 8.2,
        lastActive: "Today",
        profileImage: null,
        recentMarks: [
          { subject: "CS301", marks: 85 },
          { subject: "CS302", marks: 78 },
        ],
      },
      {
        id: 2,
        name: "Bob Johnson",
        usn: "1BI22EC005",
        department: "Electronics",
        semester: 2,
        section: "B",
        attendance: 78,
        sgpa: 7.8,
        cgpa: 7.5,
        lastActive: "Yesterday",
        profileImage: null,
        recentMarks: [
          { subject: "EC201", marks: 72 },
          { subject: "EC202", marks: 68 },
        ],
      },
    ];
    setChildren(mockChildren);
    setSelectedChild(mockChildren[0]);
  };

  const fetchAlerts = async () => {
    setAlerts([
      {
        id: 1,
        child: "Alice Johnson",
        type: "attendance",
        message: "Attendance below 75% in Data Structures",
        severity: "warning",
        date: "2 hours ago",
        actionable: true,
      },
      {
        id: 2,
        child: "Bob Johnson",
        type: "marks",
        message: "New marks published for Mathematics",
        severity: "info",
        date: "1 day ago",
        actionable: false,
      },
      {
        id: 3,
        child: "Alice Johnson",
        type: "result",
        message: "Semester 3 results declared",
        severity: "success",
        date: "3 days ago",
        actionable: true,
      },
    ]);
  };

  const fetchNotifications = async () => {
    setNotifications([
      {
        id: 1,
        title: "Parent-Teacher Meeting",
        message: "PTM scheduled for March 15, 2026",
        date: "2 days from now",
        type: "event",
      },
      {
        id: 2,
        title: "Fee Payment Reminder",
        message: "Semester fees due by March 20",
        date: "1 week from now",
        type: "reminder",
      },
    ]);
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
            Sem {child.semester} • {child.department}
          </div>
        </div>
        {child.attendance < 75 && (
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
        )}
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-xl ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 text-xs text-green-600 flex items-center">
          <span>↑ {trend}% from last month</span>
        </div>
      )}
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
          {alert.actionable && (
            <button className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50">
              View
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Parent Portal
            </h1>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <BellIcon className="h-6 w-6" />
                {alerts.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                  R
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    Robert Johnson
                  </p>
                  <p className="text-xs text-gray-500">Parent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold">Welcome back, Mr. Johnson! 👋</h2>
          <p className="text-purple-100 mt-2">
            Stay updated with your children's academic progress.
          </p>
        </div>

        {/* Children Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
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

        {selectedChild && (
          <>
            {/* Child's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Attendance"
                value={`${selectedChild.attendance}%`}
                icon={CalendarIcon}
                color="bg-gradient-to-r from-green-500 to-green-600"
                subtitle={
                  selectedChild.attendance >= 75
                    ? "Meeting requirement"
                    : "Below 75%"
                }
                trend={2}
              />
              <StatCard
                title="Current SGPA"
                value={selectedChild.sgpa}
                icon={ChartBarIcon}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                subtitle={`Semester ${selectedChild.semester}`}
                trend={0.3}
              />
              <StatCard
                title="CGPA"
                value={selectedChild.cgpa}
                icon={AcademicCapIcon}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                subtitle="Overall"
                trend={0.2}
              />
              <StatCard
                title="Last Active"
                value={selectedChild.lastActive}
                icon={UserGroupIcon}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
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
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center group"
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
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center group"
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
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center group"
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
              <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
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
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
                      <span>parent.johnson@family.com</span>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Upcoming Events
                  </h2>
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="border-l-4 border-blue-400 pl-3"
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
      </main>
    </div>
  );
};

export default ParentDashboard;
