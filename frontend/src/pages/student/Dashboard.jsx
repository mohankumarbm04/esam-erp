// pages/student/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  BellIcon,
  BookOpenIcon,
  ClockIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    attendance: 0,
    sgpa: 0,
    cgpa: 0,
    completedCredits: 0,
    totalCredits: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      setError("");

      await Promise.all([
        fetchStudentData(),
        fetchStats(),
        fetchRecentActivities(),
        fetchUpcomingClasses(),
        fetchNotifications(),
      ]);

      if (!isMounted) return;
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchStudentData = async () => {
    try {
      const response = await api.get("/students/profile/me");
      setStudent(response.data.student || null);
    } catch (err) {
      console.error("Error fetching student:", err);
      setError("Failed to load student data");
      setStudent(null);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/students/stats/me");
      setStats(response.data || {});
    } catch (err) {
      console.error("Error fetching stats:", err);
      setStats({
        attendance: 0,
        sgpa: 0,
        cgpa: 0,
        completedCredits: 0,
        totalCredits: 0,
      });
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await api.get("/students/activities");
      setRecentActivities(response.data.activities || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setRecentActivities([]);
    }
  };

  const fetchUpcomingClasses = async () => {
    try {
      const response = await api.get("/students/today-classes");
      setUpcomingClasses(response.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setUpcomingClasses([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/students/notifications");
      setNotifications(response.data.notifications || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const NotificationBadge = ({ type }) => {
    const colors = {
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || colors.info}`}
      >
        {type}
      </span>
    );
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "attendance":
        return "📅";
      case "marks":
        return "📊";
      case "sgpa":
        return "🎯";
      case "document":
        return "📄";
      default:
        return "📌";
    }
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
          <p className="text-xl">Error loading dashboard</p>
          <p className="mt-2">{error}</p>
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
              Student Portal
            </h1>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
                <BellIcon className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                  {student?.name?.charAt(0) || "S"}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {student?.name?.split(" ")[0] || "Student"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {student?.name?.split(" ")[0] || "Student"}! 👋
          </h2>
          <p className="text-blue-100">
            Here's your academic summary for today.
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {student?.name}
              </h2>
              <p className="text-sm text-gray-600">{student?.usn}</p>
              <p className="text-sm text-gray-500 mt-1">
                {student?.department} • Semester {student?.semester} • Section{" "}
                {student?.section}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Attendance"
            value={`${stats.attendance}%`}
            icon={CalendarIcon}
            color="bg-green-500"
            subtitle={
              stats.attendance >= 75 ? "Meeting requirement" : "Below 75%"
            }
          />
          <StatCard
            title="Current SGPA"
            value={stats.sgpa}
            icon={ChartBarIcon}
            color="bg-blue-500"
            subtitle={`Semester ${student?.semester}`}
          />
          <StatCard
            title="CGPA"
            value={stats.cgpa}
            icon={AcademicCapIcon}
            color="bg-purple-500"
            subtitle="Overall"
          />
          <StatCard
            title="Credits Earned"
            value={`${stats.completedCredits}/${stats.totalCredits}`}
            icon={BookOpenIcon}
            color="bg-orange-500"
            subtitle={`${stats.completedCredits} completed`}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-500" />
              Today's Schedule
            </h2>

            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-900">
                          {cls.subject}
                        </h3>
                        <span className="ml-3 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {cls.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{cls.code}</p>
                      <div className="flex flex-wrap items-center mt-2 text-sm text-gray-500 gap-4">
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {cls.time}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">📍</span>
                          {cls.room}
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">👨‍🏫</span>
                          {cls.teacher}
                        </span>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/student/timetable")}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Full Schedule →
            </button>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/student/attendance")}
                  className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
                >
                  <CalendarIcon className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Attendance</span>
                </button>
                <button
                  onClick={() => navigate("/student/marks")}
                  className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
                >
                  <ChartBarIcon className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Marks</span>
                </button>
                <button
                  onClick={() => navigate("/student/transcript")}
                  className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
                >
                  <DocumentTextIcon className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Transcript</span>
                </button>
                <button
                  onClick={() => navigate("/student/documents")}
                  className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center"
                >
                  <BookOpenIcon className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Documents</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notif.message}
                        </p>
                      </div>
                      <NotificationBadge type={notif.type} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{notif.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-500">
                      {activity.date}
                    </span>
                  </div>
                  {activity.details && (
                    <p className="text-xs text-gray-600 mt-1">
                      {activity.details}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
