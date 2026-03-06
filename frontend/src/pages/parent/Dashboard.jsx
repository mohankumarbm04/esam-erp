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
} from "@heroicons/react/24/outline";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchChildren();
    fetchAlerts();
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
      },
      {
        id: 2,
        child: "Bob Johnson",
        type: "marks",
        message: "New marks published for Mathematics",
        severity: "info",
        date: "1 day ago",
      },
      {
        id: 3,
        child: "Alice Johnson",
        type: "result",
        message: "Semester 3 results declared",
        severity: "success",
        date: "3 days ago",
      },
    ]);
  };

  const ChildCard = ({ child, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition ${
        selected
          ? "bg-blue-50 border-2 border-blue-500"
          : "bg-white border border-gray-200 hover:border-blue-300"
      }`}
    >
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold">
            {child.name.charAt(0)}
          </span>
        </div>
        <div className="ml-3">
          <h3 className="font-semibold">{child.name}</h3>
          <p className="text-sm text-gray-600">
            {child.usn} • Sem {child.semester}
          </p>
        </div>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
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
      <div className={`${colors[alert.severity]} border-l-4 p-4 rounded`}>
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
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Parent Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, Mr. Robert Johnson
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                R
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Children Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">My Children</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
                icon={UserGroupIcon}
                color="bg-orange-500"
                subtitle="in system"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() =>
                  navigate("/parent/attendance", {
                    state: { child: selectedChild },
                  })
                }
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
              >
                <CalendarIcon className="h-6 w-6 text-blue-500 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">View Attendance</p>
                  <p className="text-sm text-gray-500">
                    Check daily attendance
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/parent/marks", { state: { child: selectedChild } })
                }
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
              >
                <ChartBarIcon className="h-6 w-6 text-green-500 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Check Marks</p>
                  <p className="text-sm text-gray-500">
                    View subject-wise marks
                  </p>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/parent/reports", {
                    state: { child: selectedChild },
                  })
                }
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition flex items-center"
              >
                <DocumentTextIcon className="h-6 w-6 text-purple-500 mr-3" />
                <div className="text-left">
                  <p className="font-semibold">Download Reports</p>
                  <p className="text-sm text-gray-500">Get report cards</p>
                </div>
              </button>
            </div>

            {/* Alerts Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {alerts
                  .filter((alert) => alert.child === selectedChild.name)
                  .map((alert) => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                {alerts.filter((alert) => alert.child === selectedChild.name)
                  .length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No new alerts
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
