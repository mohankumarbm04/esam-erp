// pages/teacher/Dashboard.jsx
import React, { useState, useEffect } from "react";
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
  PresentationChartBarIcon,
  ArrowTrendingUpIcon,
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
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchTeacherData();
    fetchTodayClasses();
    fetchRecentActivities();
  }, []);

  const fetchTeacherData = async () => {
    setTeacher({
      name: user.name || "Dr. Rajesh Kumar",
      department: "Computer Science",
      email: "rajesh.k@cse.edu",
      phone: "9876543210",
      employeeId: "TCH001",
      designation: "Professor",
    });
    setLoading(false);
  };

  const fetchTodayClasses = async () => {
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
        type: "Theory",
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
        type: "Theory",
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
        type: "Theory",
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
        type: "Lab",
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
        class: "CS301",
      },
      {
        id: 2,
        action: "Entered IA1 marks for CS302",
        time: "5 hours ago",
        status: "completed",
        class: "CS302",
      },
      {
        id: 3,
        action: "Mark attendance for CS351",
        time: "Due today",
        status: "pending",
        class: "CS351",
        priority: "high",
      },
      {
        id: 4,
        action: "Enter IA2 marks for CS303",
        time: "Due tomorrow",
        status: "pending",
        class: "CS303",
        priority: "medium",
      },
    ]);
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick, trend }) => (
    <div onClick={onClick} className="stat-card-modern cursor-pointer group">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          {trend && <p className="text-sm text-muted mt-1">{trend}</p>}
        </div>
        <div
          className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ClassCard = ({ class: cls }) => (
    <div className="modern-card hover:shadow-lg transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{cls.subject}</h3>
            <span
              className={`badge ${cls.type === "Lab" ? "badge-purple" : "badge-blue"}`}
            >
              {cls.type}
            </span>
          </div>
          <p className="text-sm text-muted">
            {cls.code} • Sem {cls.semester} • Sec {cls.section}
          </p>
        </div>
        {cls.attendanceMarked ? (
          <span className="badge badge-green flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3" />
            Done
          </span>
        ) : (
          <span className="badge badge-yellow flex items-center gap-1">
            <ClockIcon className="w-3 h-3" />
            Pending
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-muted">
          <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
          {cls.time}
        </div>
        <div className="flex items-center text-sm text-muted">
          <AcademicCapIcon className="w-4 h-4 mr-2 text-gray-400" />
          {cls.students} students
        </div>
        <div className="flex items-center text-sm text-muted">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
          {cls.room}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() =>
            navigate("/teacher/attendance", { state: { class: cls } })
          }
          className="flex-1 btn btn-primary text-sm py-2"
          disabled={cls.attendanceMarked}
        >
          Mark Attendance
        </button>
        <button
          onClick={() => navigate("/teacher/marks")}
          className="flex-1 btn btn-secondary text-sm py-2"
        >
          Enter Marks
        </button>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl ${
        activity.status === "pending" ? "bg-yellow-50" : "bg-gray-50"
      }`}
    >
      <div
        className={`p-2 rounded-lg ${
          activity.status === "completed" ? "bg-green-100" : "bg-yellow-100"
        }`}
      >
        {activity.status === "completed" ? (
          <CheckCircleIcon className="w-4 h-4 text-green-600" />
        ) : (
          <ClockIcon className="w-4 h-4 text-yellow-600" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
        <p className="text-xs text-muted mt-1">{activity.time}</p>
      </div>
      {activity.priority === "high" && (
        <span className="badge badge-red text-xs">Urgent</span>
      )}
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
    <div className="modern-dashboard">
      {/* Header */}
      <div className="modern-header-clean">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">Welcome back,</span>
            <span className="font-semibold text-gray-900">{teacher?.name}</span>
            <span className="badge badge-purple">{teacher?.designation}</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="header-icon-button relative">
            <BellIcon className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {recentActivities.filter((a) => a.status === "pending").length}
            </span>
          </button>
          <div className="user-profile">
            <span className="user-name">{teacher?.name.split(" ")[0]}</span>
            <div className="user-avatar">{teacher?.name.charAt(0)}</div>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="modern-card mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Ready for today's classes? 👋
            </h2>
            <p className="text-blue-100">
              You have {todayClasses.filter((c) => !c.attendanceMarked).length}{" "}
              classes pending
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <PresentationChartBarIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid mb-6">
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={BookOpenIcon}
          color="bg-blue-500"
          trend="This week"
          onClick={() => navigate("/teacher/classes")}
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={UserGroupIcon}
          color="bg-green-500"
          trend="Across all classes"
          onClick={() => navigate("/teacher/students")}
        />
        <StatCard
          title="Pending Attendance"
          value={stats.pendingAttendance}
          icon={CalendarIcon}
          color="bg-orange-500"
          trend="Need to mark today"
          onClick={() => navigate("/teacher/attendance")}
        />
        <StatCard
          title="Pending Marks"
          value={stats.pendingMarks}
          icon={ChartBarIcon}
          color="bg-purple-500"
          trend="Need to enter"
          onClick={() => navigate("/teacher/marks")}
        />
      </div>

      {/* Main Grid */}
      <div className="content-grid">
        {/* Today's Classes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Classes
            </h3>
            <button
              onClick={() => navigate("/teacher/classes")}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {todayClasses.map((cls) => (
              <ClassCard key={cls.id} class={cls} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="modern-card">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/teacher/attendance")}
                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition flex flex-col items-center gap-2 group"
              >
                <CalendarIcon className="w-6 h-6 text-blue-600 group-hover:scale-110 transition" />
                <span className="text-sm font-medium text-gray-700">
                  Attendance
                </span>
              </button>
              <button
                onClick={() => navigate("/teacher/marks")}
                className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition flex flex-col items-center gap-2 group"
              >
                <ChartBarIcon className="w-6 h-6 text-green-600 group-hover:scale-110 transition" />
                <span className="text-sm font-medium text-gray-700">Marks</span>
              </button>
              <button
                onClick={() => navigate("/teacher/classes")}
                className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition flex flex-col items-center gap-2 group"
              >
                <BookOpenIcon className="w-6 h-6 text-purple-600 group-hover:scale-110 transition" />
                <span className="text-sm font-medium text-gray-700">
                  Classes
                </span>
              </button>
              <button
                onClick={() => navigate("/teacher/students")}
                className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition flex flex-col items-center gap-2 group"
              >
                <UserGroupIcon className="w-6 h-6 text-orange-600 group-hover:scale-110 transition" />
                <span className="text-sm font-medium text-gray-700">
                  Students
                </span>
              </button>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="modern-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-orange-500" />
              Pending Tasks
            </h3>
            <div className="space-y-3">
              {recentActivities
                .filter((a) => a.status === "pending")
                .map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="modern-card">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-500" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities
                .filter((a) => a.status === "completed")
                .map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
