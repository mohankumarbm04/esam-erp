// pages/hod/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  BellIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
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
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchDepartmentData();
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      // Assuming HOD's department is stored in user data
      // This would come from your API
      setDepartment({
        name: "Computer Science",
        code: "CSE",
        totalTeachers: 12,
        totalStudents: 180,
        totalSubjects: 24,
      });
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // This would come from your API
      setStats({
        teachers: 12,
        students: 180,
        subjects: 24,
        lowAttendance: 8,
        pendingApprovals: 3,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: "New teacher joined",
        user: "Dr. Sharma",
        time: "2 hours ago",
      },
      {
        id: 2,
        action: "Attendance marked for 3rd Sem",
        user: "Prof. Kumar",
        time: "5 hours ago",
      },
      {
        id: 3,
        action: "Low attendance alert",
        user: "5 students",
        time: "1 day ago",
      },
      {
        id: 4,
        action: "Marks entered for CS301",
        user: "Dr. Rajesh",
        time: "2 days ago",
      },
    ]);
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                HOD Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Department of {department?.name} ({department?.code})
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                H
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Teachers"
            value={stats.teachers}
            icon={UsersIcon}
            color="bg-blue-500"
            onClick={() => navigate("/hod/teachers")}
          />
          <StatCard
            title="Total Students"
            value={stats.students}
            icon={AcademicCapIcon}
            color="bg-green-500"
            onClick={() => navigate("/hod/students")}
          />
          <StatCard
            title="Total Subjects"
            value={stats.subjects}
            icon={BookOpenIcon}
            color="bg-purple-500"
            onClick={() => navigate("/hod/subjects")}
          />
          <StatCard
            title="Low Attendance"
            value={stats.lowAttendance}
            icon={ExclamationTriangleIcon}
            color="bg-red-500"
            onClick={() => navigate("/hod/attendance")}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate("/hod/teachers")}
                className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <UsersIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <span className="text-sm">Teachers</span>
              </button>
              <button
                onClick={() => navigate("/hod/students")}
                className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
              >
                <AcademicCapIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <span className="text-sm">Students</span>
              </button>
              <button
                onClick={() => navigate("/hod/attendance")}
                className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
              >
                <ChartBarIcon className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <span className="text-sm">Attendance</span>
              </button>
              <button
                onClick={() => navigate("/hod/reports")}
                className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
              >
                <BookOpenIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <span className="text-sm">Reports</span>
              </button>
            </div>
          </div>

          {/* Department Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Department Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Teachers</span>
                <span className="font-semibold">{stats.teachers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">{stats.students}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Subjects</span>
                <span className="font-semibold">{stats.subjects}</span>
              </div>
              <div className="flex justify-between items-center text-red-600">
                <span className="text-gray-600">Low Attendance</span>
                <span className="font-semibold">{stats.lowAttendance}</span>
              </div>
              <div className="flex justify-between items-center text-blue-600">
                <span className="text-gray-600">Pending Approvals</span>
                <span className="font-semibold">{stats.pendingApprovals}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 border-b pb-3"
              >
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-sm">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HODDashboard;
