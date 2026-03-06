// pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  UsersIcon,
  AcademicCapIcon,
  BookOpenIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  DocumentTextIcon, // ✅ Fixed import
  BellIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [stats, setStats] = useState({
    departments: 0,
    teachers: 0,
    students: 0,
    subjects: 0,
    lowAttendance: 0,
    pendingApprovals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [deptRes, teacherRes, studentRes, subjectRes] = await Promise.all([
        axios.get("http://localhost:5000/api/departments", { headers }),
        axios.get("http://localhost:5000/api/teachers", { headers }),
        axios.get("http://localhost:5000/api/students", { headers }),
        axios.get("http://localhost:5000/api/subjects", { headers }),
      ]);

      setStats({
        departments: deptRes.data.count || 0,
        teachers: teacherRes.data.count || 0,
        students: studentRes.data.count || 0,
        subjects: subjectRes.data.count || 0,
        lowAttendance: 3,
        pendingApprovals: 2,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: "New student admitted",
        user: "Alice Johnson",
        time: "5 minutes ago",
      },
      {
        id: 2,
        action: "Attendance marked",
        user: "Dr. Rajesh",
        time: "1 hour ago",
      },
      {
        id: 3,
        action: "Department updated",
        user: "CSE Dept",
        time: "2 hours ago",
      },
      {
        id: 4,
        action: "Marks entered",
        user: "Dr. Kumar",
        time: "3 hours ago",
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

  const QuickActionButton = ({ label, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className={`p-4 ${color} rounded-lg hover:opacity-90 transition flex flex-col items-center justify-center text-white`}
    >
      <Icon className="h-8 w-8 mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </button>
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
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <CogIcon className="h-6 w-6" />
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Departments"
            value={stats.departments}
            icon={BuildingOfficeIcon}
            color="bg-blue-500"
            onClick={() => navigate("/admin/departments")}
          />
          <StatCard
            title="Total Teachers"
            value={stats.teachers}
            icon={UsersIcon}
            color="bg-green-500"
            onClick={() => navigate("/admin/teachers")}
          />
          <StatCard
            title="Total Students"
            value={stats.students}
            icon={AcademicCapIcon}
            color="bg-purple-500"
            onClick={() => navigate("/admin/students")}
          />
          <StatCard
            title="Total Subjects"
            value={stats.subjects}
            icon={BookOpenIcon}
            color="bg-orange-500"
            onClick={() => navigate("/admin/subjects")}
          />
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <QuickActionButton
              label="Departments"
              icon={BuildingOfficeIcon}
              color="bg-blue-500"
              onClick={() => navigate("/admin/departments")}
            />
            <QuickActionButton
              label="Teachers"
              icon={UsersIcon}
              color="bg-green-500"
              onClick={() => navigate("/admin/teachers")}
            />
            <QuickActionButton
              label="Students"
              icon={AcademicCapIcon}
              color="bg-purple-500"
              onClick={() => navigate("/admin/students")}
            />
            <QuickActionButton
              label="Subjects"
              icon={BookOpenIcon}
              color="bg-orange-500"
              onClick={() => navigate("/admin/subjects")}
            />
            <QuickActionButton
              label="Attendance"
              icon={ChartBarIcon}
              color="bg-red-500"
              onClick={() => navigate("/admin/attendance")}
            />
            <QuickActionButton
              label="Reports"
              icon={DocumentTextIcon} // ✅ Fixed
              color="bg-indigo-500"
              onClick={() => navigate("/admin/reports")}
            />
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 border-b pb-3"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
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
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Activities →
            </button>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Alerts</h2>

            {/* Low Attendance Alert */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BellIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">Low Attendance Alert!</span>
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {stats.lowAttendance} students have attendance below 75%
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <DocumentTextIcon className="h-5 w-5 text-blue-400" />{" "}
                  {/* ✅ Fixed */}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Pending Approvals</span>
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats.pendingApprovals} requests waiting for review
                  </p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">System Status</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    All systems operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
