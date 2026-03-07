// pages/teacher/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  AcademicCapIcon,
  ChartBarIcon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 4,
    totalStudents: 75,
    pendingAttendance: 2,
    pendingMarks: 3,
  });
  const [todayClasses, setTodayClasses] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchTeacherData();
    fetchTodayClasses();
    fetchRecentActivities();
  }, []);

  const fetchTeacherData = async () => {
    try {
      // Mock data - replace with actual API call
      setTeacher({
        name: user.name || "Dr. Rajesh Kumar",
        department: "Computer Science",
        email: "rajesh.k@cse.edu",
        phone: "9876543210",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      setLoading(false);
    }
  };

  const fetchTodayClasses = async () => {
    // Mock data - replace with API call
    setTodayClasses([
      {
        id: 1,
        subject: "Database Management Systems",
        code: "CS301",
        semester: 3,
        section: "A",
        time: "09:00 - 10:00",
        room: "LH-101",
        students: 25,
        attendanceMarked: true,
      },
      {
        id: 2,
        subject: "Data Structures",
        code: "CS302",
        semester: 3,
        section: "B",
        time: "10:15 - 11:15",
        room: "LH-102",
        students: 24,
        attendanceMarked: false,
      },
      {
        id: 3,
        subject: "Algorithm Design",
        code: "CS303",
        semester: 5,
        section: "A",
        time: "11:30 - 12:30",
        room: "LH-103",
        students: 26,
        attendanceMarked: true,
      },
      {
        id: 4,
        subject: "DBMS Lab",
        code: "CS351",
        semester: 3,
        section: "A",
        time: "14:00 - 17:00",
        room: "Lab-3",
        students: 25,
        attendanceMarked: false,
      },
    ]);
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: "Marked attendance for CS301",
        time: "2 hours ago",
        status: "completed",
      },
      {
        id: 2,
        action: "Entered IA1 marks for CS302",
        time: "5 hours ago",
        status: "completed",
      },
      {
        id: 3,
        action: "Pending: Mark attendance for CS351",
        time: "Due today",
        status: "pending",
      },
      {
        id: 4,
        action: "Pending: Enter IA2 marks for CS303",
        time: "Due tomorrow",
        status: "pending",
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
                Teacher Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {teacher?.name} • {teacher?.department}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                {teacher?.name?.charAt(0) || "T"}
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
            title="Total Classes"
            value={stats.totalClasses}
            icon={BookOpenIcon}
            color="bg-blue-500"
            onClick={() => navigate("/teacher/classes")}
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={UserGroupIcon}
            color="bg-green-500"
            onClick={() => navigate("/teacher/students")}
          />
          <StatCard
            title="Pending Attendance"
            value={stats.pendingAttendance}
            icon={CalendarIcon}
            color="bg-yellow-500"
            onClick={() => navigate("/teacher/attendance")}
          />
          <StatCard
            title="Pending Marks"
            value={stats.pendingMarks}
            icon={ChartBarIcon}
            color="bg-purple-500"
            onClick={() => navigate("/teacher/marks")}
          />
        </div>

        {/* Today's Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
            <div className="space-y-4">
              {todayClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cls.subject}</h3>
                      <p className="text-sm text-gray-600">
                        {cls.code} • Semester {cls.semester} • Section{" "}
                        {cls.section}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {cls.time}
                        <span className="mx-2">•</span>
                        <span>📍 {cls.room}</span>
                        <span className="mx-2">•</span>
                        <AcademicCapIcon className="h-4 w-4 mr-1" />
                        {cls.students} students
                      </div>
                    </div>
                    <div className="flex items-center">
                      {cls.attendanceMarked ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Attendance Marked
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            navigate("/teacher/attendance", {
                              state: { class: cls },
                            })
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                        >
                          Mark Attendance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Pending Tasks */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/teacher/attendance")}
                  className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <CalendarIcon className="h-5 w-5 text-blue-600 inline mr-2" />
                  Mark Attendance
                </button>
                <button
                  onClick={() => navigate("/teacher/marks")}
                  className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <ChartBarIcon className="h-5 w-5 text-green-600 inline mr-2" />
                  Enter Marks
                </button>
                <button
                  onClick={() => navigate("/teacher/classes")}
                  className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <BookOpenIcon className="h-5 w-5 text-purple-600 inline mr-2" />
                  View Classes
                </button>
                <button
                  onClick={() => navigate("/teacher/students")}
                  className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                >
                  <UserGroupIcon className="h-5 w-5 text-orange-600 inline mr-2" />
                  Student List
                </button>
              </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Pending Tasks</h2>
              <div className="space-y-3">
                {recentActivities
                  .filter((a) => a.status === "pending")
                  .map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 mt-2 rounded-full bg-yellow-500"></div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities
              .filter((a) => a.status === "completed")
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 border-b pb-3"
                >
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
