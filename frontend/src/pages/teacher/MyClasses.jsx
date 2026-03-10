// pages/teacher/MyClasses.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const MyClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setClasses([
      {
        id: 1,
        subject: "Database Management Systems",
        code: "CS301",
        semester: 3,
        section: "A",
        students: 25,
        schedule: [
          { day: "Monday", time: "09:00 - 10:00", room: "LH-101" },
          { day: "Wednesday", time: "09:00 - 10:00", room: "LH-101" },
          { day: "Friday", time: "10:15 - 11:15", room: "LH-101" },
        ],
        attendanceMarked: 12,
        totalClasses: 15,
        averageMarks: 78,
        nextClass: "Monday, 09:00 AM",
        type: "Theory",
      },
      {
        id: 2,
        subject: "Data Structures",
        code: "CS302",
        semester: 3,
        section: "B",
        students: 24,
        schedule: [
          { day: "Tuesday", time: "10:15 - 11:15", room: "LH-102" },
          { day: "Thursday", time: "10:15 - 11:15", room: "LH-102" },
          { day: "Friday", time: "11:30 - 12:30", room: "LH-102" },
        ],
        attendanceMarked: 10,
        totalClasses: 15,
        averageMarks: 72,
        nextClass: "Tuesday, 10:15 AM",
        type: "Theory",
      },
      {
        id: 3,
        subject: "Algorithm Design",
        code: "CS303",
        semester: 5,
        section: "A",
        students: 26,
        schedule: [
          { day: "Monday", time: "11:30 - 12:30", room: "LH-103" },
          { day: "Wednesday", time: "11:30 - 12:30", room: "LH-103" },
          { day: "Thursday", time: "14:00 - 15:00", room: "LH-103" },
        ],
        attendanceMarked: 14,
        totalClasses: 15,
        averageMarks: 81,
        nextClass: "Monday, 11:30 AM",
        type: "Theory",
      },
      {
        id: 4,
        subject: "DBMS Lab",
        code: "CS351",
        semester: 3,
        section: "A",
        students: 25,
        schedule: [{ day: "Tuesday", time: "14:00 - 17:00", room: "Lab-3" }],
        attendanceMarked: 5,
        totalClasses: 8,
        averageMarks: 85,
        nextClass: "Tuesday, 14:00 PM",
        type: "Lab",
      },
    ]);

    setStats({
      total: 4,
      today: 2,
      completed: 3,
      pending: 1,
    });

    setLoading(false);
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDayClasses = (day) => {
    return classes.filter((cls) => cls.schedule.some((s) => s.day === day));
  };

  const getTypeBadge = (type) => {
    return type === "Lab" ? "badge-purple" : "badge-blue";
  };

  const ClassCard = ({ cls }) => (
    <div className="modern-card hover:shadow-lg transition-all group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {cls.subject}
            </h3>
            <span className={`badge ${getTypeBadge(cls.type)}`}>
              {cls.type}
            </span>
          </div>
          <p className="text-sm text-muted">
            {cls.code} • Semester {cls.semester} • Section {cls.section}
          </p>
        </div>
        <div className="text-right">
          <span className="badge badge-blue">{cls.students} Students</span>
        </div>
      </div>

      {/* Schedule */}
      <div className="mb-4 p-4 bg-gray-50 rounded-xl">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-500" />
          Weekly Schedule
        </h4>
        <div className="space-y-2">
          {cls.schedule.map((sch, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 w-20">
                  {sch.day}
                </span>
                <span className="text-muted">{sch.time}</span>
              </div>
              <span className="text-muted">{sch.room}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <p className="text-xs text-muted mb-1">Attendance</p>
          <p className="text-lg font-semibold text-blue-600">
            {Math.round((cls.attendanceMarked / cls.totalClasses) * 100)}%
          </p>
          <p className="text-xs text-muted">
            {cls.attendanceMarked}/{cls.totalClasses}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-xl">
          <p className="text-xs text-muted mb-1">Avg. Marks</p>
          <p className="text-lg font-semibold text-green-600">
            {cls.averageMarks}
          </p>
          <p className="text-xs text-muted">out of 100</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <p className="text-xs text-muted mb-1">Next Class</p>
          <p className="text-xs font-semibold text-purple-600">
            {cls.nextClass}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() =>
            navigate("/teacher/attendance", { state: { class: cls } })
          }
          className="btn btn-primary py-2 text-sm"
        >
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Mark Attendance
        </button>
        <button
          onClick={() => navigate("/teacher/marks")}
          className="btn btn-secondary py-2 text-sm"
        >
          <ChartBarIcon className="w-4 h-4 mr-2" />
          Enter Marks
        </button>
      </div>
    </div>
  );

  const DaySchedule = ({ day }) => {
    const dayClasses = getDayClasses(day);

    if (dayClasses.length === 0) return null;

    return (
      <div className="modern-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          {day}
        </h3>
        <div className="space-y-3">
          {dayClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${cls.type === "Lab" ? "bg-purple-500" : "bg-blue-500"}`}
                ></div>
                <div>
                  <p className="font-medium text-gray-900">{cls.subject}</p>
                  <p className="text-xs text-muted">
                    {cls.code} • {cls.section}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {cls.schedule.find((s) => s.day === day)?.time}
                </p>
                <p className="text-xs text-muted">
                  {cls.schedule.find((s) => s.day === day)?.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          <h1>My Classes</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">Manage your teaching schedule</span>
            <span className="badge badge-blue">{stats.total} Classes</span>
            <span className="badge badge-green">{stats.today} Today</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Weekly View
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Classes</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <BookOpenIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">This semester</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Today's Classes</p>
              <p className="stat-value">{stats.today}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Ready to teach</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Attendance Marked</p>
              <p className="stat-value">{stats.completed}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Completed</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Pending</p>
              <p className="stat-value">{stats.pending}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-down">Need attention</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedDay("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedDay === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Classes
        </button>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedDay === day
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {day.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedDay === "all" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      ) : (
        <DaySchedule day={selectedDay} />
      )}

      {/* Weekly Overview */}
      <div className="modern-card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowTrendingUpIcon className="w-5 h-5 text-blue-500" />
          Weekly Overview
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayClasses = getDayClasses(day);
            return (
              <div key={day} className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {day.substring(0, 3)}
                </p>
                <div
                  className={`p-3 rounded-xl ${
                    dayClasses.length > 0 ? "bg-blue-50" : "bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-lg font-semibold ${
                      dayClasses.length > 0 ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {dayClasses.length}
                  </p>
                  <p className="text-xs text-muted">classes</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyClasses;
