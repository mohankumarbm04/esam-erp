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

  useEffect(() => {
    fetchStudentData();
    fetchRecentActivities();
    fetchUpcomingClasses();
  }, []);

  const fetchStudentData = async () => {
    // Mock student data
    setStudent({
      name: "Alice Johnson",
      usn: "1BI21CS001",
      department: "Computer Science",
      semester: 3,
      section: "A",
      email: "alice.j@esam.edu",
      phone: "9876543210",
    });
  };

  const fetchRecentActivities = async () => {
    setRecentActivities([
      {
        id: 1,
        action: "Attendance marked for CS301",
        date: "Today",
        status: "present",
      },
      {
        id: 2,
        action: "IA1 marks published for CS302",
        date: "Yesterday",
        marks: 26,
      },
      {
        id: 3,
        action: "SGPA for Semester 3 calculated",
        date: "2 days ago",
        sgpa: 8.5,
      },
      {
        id: 4,
        action: "Document verified: 10th Marks Card",
        date: "1 week ago",
        status: "verified",
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
      },
      {
        id: 2,
        subject: "Data Structures",
        code: "CS302",
        time: "10:15 - 11:15",
        room: "LH-102",
        teacher: "Prof. Sunita Sharma",
      },
      {
        id: 3,
        subject: "DBMS Lab",
        code: "CS351",
        time: "14:00 - 17:00",
        room: "Lab-3",
        teacher: "Dr. Rajesh Kumar",
      },
    ]);
  };

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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {student.name} • {student.usn}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {student.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Student Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm text-gray-600">
                {student.usn} • {student.department} • Semester{" "}
                {student.semester} • Section {student.section}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {student.email} • {student.phone}
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
            subtitle="Above 75% requirement"
          />
          <StatCard
            title="Current SGPA"
            value={stats.sgpa}
            icon={ChartBarIcon}
            color="bg-blue-500"
            subtitle="Semester 3"
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
            subtitle="48 completed"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
            <div className="space-y-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{cls.subject}</h3>
                      <p className="text-sm text-gray-600">{cls.code}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="mr-4">🕒 {cls.time}</span>
                        <span className="mr-4">📍 {cls.room}</span>
                        <span>👨‍🏫 {cls.teacher}</span>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Today
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/student/attendance")}
                  className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <CalendarIcon className="h-5 w-5 text-blue-600 inline mr-2" />
                  View Attendance
                </button>
                <button
                  onClick={() => navigate("/student/marks")}
                  className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <ChartBarIcon className="h-5 w-5 text-green-600 inline mr-2" />
                  Check Marks
                </button>
                <button
                  onClick={() => navigate("/student/transcript")}
                  className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <DocumentTextIcon className="h-5 w-5 text-purple-600 inline mr-2" />
                  View Transcript
                </button>
                <button
                  onClick={() => navigate("/student/documents")}
                  className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                >
                  <AcademicCapIcon className="h-5 w-5 text-orange-600 inline mr-2" />
                  My Documents
                </button>
              </div>
            </div>

            {/* Attendance Alert */}
            {stats.attendance < 75 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <BellIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      <span className="font-medium">Warning!</span> Your
                      attendance is below 75%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
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
                      {activity.date.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.date}</p>
                </div>
                {activity.marks && (
                  <span className="text-sm font-semibold text-green-600">
                    {activity.marks}/30
                  </span>
                )}
                {activity.sgpa && (
                  <span className="text-sm font-semibold text-blue-600">
                    SGPA: {activity.sgpa}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
