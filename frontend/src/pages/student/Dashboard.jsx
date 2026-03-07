// pages/student/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon,
  UserCircleIcon,
  BellIcon,
  BookOpenIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    attendance: 92,
    sgpa: 8.5,
    cgpa: 8.2,
    completedCredits: 48,
    totalCredits: 72,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchStudentData();
    fetchRecentActivities();
    fetchUpcomingClasses();
    fetchNotifications();
  }, []);

  const fetchStudentData = async () => {
    // Mock student data - replace with API call
    setStudent({
      name: "Alice Johnson",
      usn: "1BI21CS001",
      department: "Computer Science",
      semester: 3,
      section: "A",
      email: "alice.j@esam.edu",
      phone: "9876543210",
      profileImage: null,
    });
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: "Attendance marked for CS301",
        date: "Today",
        time: "09:00 AM",
        status: "present",
        icon: "✅",
      },
      {
        id: 2,
        action: "IA1 marks published for CS302",
        date: "Yesterday",
        time: "02:30 PM",
        details: "Marks: 26/30",
        icon: "📊",
      },
      {
        id: 3,
        action: "SGPA for Semester 3 calculated",
        date: "2 days ago",
        time: "11:15 AM",
        details: "SGPA: 8.5",
        icon: "🎯",
      },
      {
        id: 4,
        action: "Document verified: 10th Marks Card",
        date: "1 week ago",
        time: "03:45 PM",
        status: "verified",
        icon: "✅",
      },
    ]);
  };

  const fetchUpcomingClasses = async () => {
    setUpcomingClasses([
      {
        id: 1,
        subject: "Database Management Systems",
        code: "CS301",
        time: "09:00 - 10:00",
        room: "LH-101",
        teacher: "Dr. Rajesh Kumar",
        type: "Theory",
      },
      {
        id: 2,
        subject: "Data Structures",
        code: "CS302",
        time: "10:15 - 11:15",
        room: "LH-102",
        teacher: "Prof. Sunita Sharma",
        type: "Theory",
      },
      {
        id: 3,
        subject: "DBMS Lab",
        code: "CS351",
        time: "14:00 - 17:00",
        room: "Lab-3",
        teacher: "Dr. Rajesh Kumar",
        type: "Lab",
      },
    ]);
  };

  const fetchNotifications = async () => {
    setNotifications([
      {
        id: 1,
        title: "Assignment Due",
        message: "CS301 Assignment submission by Friday",
        type: "warning",
        time: "2 hours ago",
      },
      {
        id: 2,
        title: "Attendance Alert",
        message: "Your attendance in CS302 is 78%",
        type: "info",
        time: "1 day ago",
      },
    ]);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition card-hover">
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

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Portal
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-500">{student.usn}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold">
            Welcome back, {student.name}! 👋
          </h2>
          <p className="text-blue-100 mt-2">
            Here's your academic summary for today.
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
                {student.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {student.name}
                </h2>
                <p className="text-gray-600">{student.usn}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  {student.department} • Semester {student.semester} • Section{" "}
                  {student.section}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Overall Attendance"
            value={`${stats.attendance}%`}
            icon={CalendarIcon}
            color="bg-gradient-to-r from-green-500 to-green-600"
            subtitle={
              stats.attendance >= 75 ? "Meeting requirement" : "Below 75%"
            }
          />
          <StatCard
            title="Current SGPA"
            value={stats.sgpa}
            icon={ChartBarIcon}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            subtitle="Semester 3"
          />
          <StatCard
            title="CGPA"
            value={stats.cgpa}
            icon={AcademicCapIcon}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            subtitle="Overall"
          />
          <StatCard
            title="Credits Earned"
            value={`${stats.completedCredits}/${stats.totalCredits}`}
            icon={BookOpenIcon}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            subtitle="48 completed"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Classes */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Schedule</h2>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-semibold">{cls.subject}</h3>
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
            <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
              View Full Schedule →
            </button>
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/student/attendance")}
                  className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center"
                >
                  <CalendarIcon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm">Attendance</span>
                </button>
                <button
                  onClick={() => navigate("/student/marks")}
                  className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center"
                >
                  <ChartBarIcon className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm">Marks</span>
                </button>
                <button
                  onClick={() => navigate("/student/transcript")}
                  className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center"
                >
                  <DocumentTextIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm">Transcript</span>
                </button>
                <button
                  onClick={() => navigate("/student/documents")}
                  className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center"
                >
                  <AcademicCapIcon className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <span className="text-sm">Documents</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
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
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 border-b border-gray-100 pb-4 last:border-0"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-xl">
                  {activity.icon}
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
