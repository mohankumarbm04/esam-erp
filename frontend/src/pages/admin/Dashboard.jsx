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
  DocumentTextIcon,
  BellIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

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
        icon: AcademicCapIcon,
      },
      {
        id: 2,
        action: "Attendance marked",
        user: "Dr. Rajesh",
        time: "1 hour ago",
        icon: ChartBarIcon,
      },
      {
        id: 3,
        action: "Department updated",
        user: "CSE Dept",
        time: "2 hours ago",
        icon: BuildingOfficeIcon,
      },
      {
        id: 4,
        action: "Marks entered",
        user: "Dr. Kumar",
        time: "3 hours ago",
        icon: BookOpenIcon,
      },
    ]);
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div
      onClick={onClick}
      className="stat-card cursor-pointer group"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="fade-in">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative group">
                <BellIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <CogIcon className="h-6 w-6 group-hover:rotate-90 transition-transform" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 slide-in">
          <StatCard
            title="Total Departments"
            value={stats.departments}
            icon={BuildingOfficeIcon}
            color="#3b82f6"
            onClick={() => navigate("/admin/departments")}
          />
          <StatCard
            title="Total Teachers"
            value={stats.teachers}
            icon={UsersIcon}
            color="#10b981"
            onClick={() => navigate("/admin/teachers")}
          />
          <StatCard
            title="Total Students"
            value={stats.students}
            icon={AcademicCapIcon}
            color="#8b5cf6"
            onClick={() => navigate("/admin/students")}
          />
          <StatCard
            title="Total Subjects"
            value={stats.subjects}
            icon={BookOpenIcon}
            color="#f59e0b"
            onClick={() => navigate("/admin/subjects")}
          />
        </div>

        {/* Quick Actions */}
        <Card
          title="Quick Actions"
          subtitle="Frequently used operations"
          className="mb-8 slide-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: "Departments",
                icon: BuildingOfficeIcon,
                path: "/admin/departments",
                color: "blue",
              },
              {
                label: "Teachers",
                icon: UsersIcon,
                path: "/admin/teachers",
                color: "green",
              },
              {
                label: "Students",
                icon: AcademicCapIcon,
                path: "/admin/students",
                color: "purple",
              },
              {
                label: "Subjects",
                icon: BookOpenIcon,
                path: "/admin/subjects",
                color: "orange",
              },
              {
                label: "Attendance",
                icon: ChartBarIcon,
                path: "/admin/attendance",
                color: "red",
              },
              {
                label: "Reports",
                icon: DocumentTextIcon,
                path: "/admin/reports",
                color: "indigo",
              },
            ].map((item, index) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="group p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 transition-all duration-300 hover:-translate-y-1"
              >
                <item.icon
                  className={`h-8 w-8 mx-auto mb-2 text-${item.color}-500 group-hover:text-white transition-colors`}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-white">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div
            className="lg:col-span-2 slide-in"
            style={{ animationDelay: "0.2s" }}
          >
            <Card title="Recent Activities">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <activity.icon className="h-5 w-5 text-blue-600" />
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
              <div className="mt-4 text-right">
                <Button variant="outline" size="sm">
                  View All Activities →
                </Button>
              </div>
            </Card>
          </div>

          {/* Alerts & Notifications */}
          <div className="slide-in" style={{ animationDelay: "0.3s" }}>
            <Card title="Alerts">
              <div className="space-y-4">
                {/* Low Attendance Alert */}
                <div className="alert-warning">
                  <div className="flex">
                    <BellIcon className="h-5 w-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">
                        Low Attendance Alert!
                      </p>
                      <p className="text-xs mt-1 opacity-75">
                        {stats.lowAttendance} students have attendance below 75%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pending Approvals */}
                <div className="alert-info">
                  <div className="flex">
                    <DocumentTextIcon className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Pending Approvals</p>
                      <p className="text-xs mt-1 opacity-75">
                        {stats.pendingApprovals} requests waiting for review
                      </p>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="alert-success">
                  <div className="flex">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">System Status</p>
                      <p className="text-xs mt-1 opacity-75">
                        All systems operational
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
