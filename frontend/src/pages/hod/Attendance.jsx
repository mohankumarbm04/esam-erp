// pages/hod/Attendance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
    lowAttendance: 0,
    criticalAttendance: 0,
  });
  const [summary, setSummary] = useState({
    perSubject: [],
    perSemester: {},
    dailyTrend: [],
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
    fetchSubjects();
    fetchAttendanceSummary();
  }, []);

  const fetchDepartment = async () => {
    setDepartment({
      name: "Computer Science",
      code: "CSE",
      totalStudents: 180,
    });
  };

  const fetchSubjects = async () => {
    setSubjects([
      {
        id: 1,
        code: "CS301",
        name: "Database Management Systems",
        semester: 3,
      },
      { id: 2, code: "CS302", name: "Data Structures", semester: 3 },
      { id: 3, code: "CS303", name: "Algorithm Design", semester: 3 },
      { id: 4, code: "CS351", name: "DBMS Lab", semester: 3 },
    ]);
  };

  const fetchAttendanceSummary = async () => {
    setLoading(true);
    setTimeout(() => {
      setSummary({
        perSubject: [
          { subject: "CS301", total: 45, present: 42, percentage: 93.3 },
          { subject: "CS302", total: 45, present: 38, percentage: 84.4 },
          { subject: "CS303", total: 45, present: 41, percentage: 91.1 },
          { subject: "CS351", total: 45, present: 39, percentage: 86.7 },
        ],
        dailyTrend: [
          { date: "Mon", rate: 92 },
          { date: "Tue", rate: 88 },
          { date: "Wed", rate: 85 },
          { date: "Thu", rate: 90 },
          { date: "Fri", rate: 87 },
        ],
      });
      setLoading(false);
    }, 500);
  };

  const fetchAttendanceByFilters = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockData = [
        {
          usn: "1BI21CS001",
          name: "Alice Johnson",
          semester: 3,
          section: "A",
          status: "present",
          time: "09:05 AM",
        },
        {
          usn: "1BI21CS002",
          name: "Bob Smith",
          semester: 3,
          section: "A",
          status: "present",
          time: "09:00 AM",
        },
        {
          usn: "1BI21CS003",
          name: "Charlie Brown",
          semester: 3,
          section: "A",
          status: "absent",
          time: "-",
        },
        {
          usn: "1BI21CS004",
          name: "Diana Prince",
          semester: 3,
          section: "B",
          status: "present",
          time: "08:55 AM",
        },
        {
          usn: "1BI21CS005",
          name: "Eve Adams",
          semester: 3,
          section: "B",
          status: "absent",
          time: "-",
        },
        {
          usn: "1BI21CS006",
          name: "Frank Castle",
          semester: 3,
          section: "B",
          status: "present",
          time: "09:10 AM",
        },
        {
          usn: "1BI21CS007",
          name: "Grace Hopper",
          semester: 3,
          section: "A",
          status: "present",
          time: "08:50 AM",
        },
        {
          usn: "1BI21CS008",
          name: "Henry Cavill",
          semester: 3,
          section: "A",
          status: "absent",
          time: "-",
        },
      ];

      setAttendanceData(mockData);

      const present = mockData.filter((d) => d.status === "present").length;
      const total = mockData.length;
      const absent = total - present;

      setStats({
        total,
        present,
        absent,
        percentage: Math.round((present / total) * 100),
        lowAttendance: 3,
        criticalAttendance: 1,
      });

      setLoading(false);
    }, 500);
  };

  const getStatusBadge = (status) => {
    return status === "present" ? "badge-green" : "badge-red";
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 65) return "text-yellow-600";
    return "text-red-600";
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="stat-card-modern">
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-title">{title}</p>
          <p className="stat-value">{value}</p>
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="stat-trend">
          <span className="trend-up">{trend}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="modern-header-clean">
        <div>
          <h1>Attendance Overview</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">{department?.name}</span>
            <span className="badge badge-blue">{department?.code}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">
              {department?.totalStudents} students
            </span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid mb-6">
        <StatCard
          title="Today's Attendance"
          value={`${stats.percentage}%`}
          icon={ChartBarIcon}
          color="bg-blue-500"
          subtitle={`${stats.present} present, ${stats.absent} absent`}
          trend={`${stats.present}/${stats.total} students`}
        />
        <StatCard
          title="Present Today"
          value={stats.present}
          icon={CheckCircleIcon}
          color="bg-green-500"
          subtitle={`${Math.round((stats.present / stats.total) * 100)}% of total`}
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={XCircleIcon}
          color="bg-red-500"
          subtitle="Need attention"
        />
        <StatCard
          title="Low Attendance"
          value={stats.lowAttendance}
          icon={ExclamationTriangleIcon}
          color="bg-orange-500"
          subtitle="Below 75%"
        />
      </div>

      {/* Filters */}
      <div className="modern-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Semester</label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="form-input"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-input"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.code} - {sub.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAttendanceByFilters}
                className="btn btn-primary w-full"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject-wise Attendance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summary.perSubject.map((subject) => (
          <div key={subject.subject} className="modern-card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm font-medium text-muted">
                  {subject.subject}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {subject.percentage}%
                </p>
              </div>
              <div
                className={`text-2xl font-bold ${getAttendanceColor(subject.percentage)}`}
              >
                {subject.present}/{subject.total}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  subject.percentage >= 90
                    ? "bg-green-500"
                    : subject.percentage >= 75
                      ? "bg-blue-500"
                      : subject.percentage >= 65
                        ? "bg-yellow-500"
                        : "bg-red-500"
                }`}
                style={{ width: `${subject.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted">
              {subject.present} out of {subject.total} students present
            </p>
          </div>
        ))}
      </div>

      {/* Daily Trend */}
      <div className="modern-card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <CalendarIcon className="w-5 h-5" />
            Weekly Attendance Trend
          </h3>
        </div>
        <div className="flex justify-between items-end h-40 mt-4">
          {summary.dailyTrend.map((day) => (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <div className="text-sm font-medium text-muted mb-2">
                {day.date}
              </div>
              <div className="w-full flex justify-center">
                <div
                  className="w-8 bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                  style={{ height: `${day.rate * 1.5}px` }}
                ></div>
              </div>
              <div className="text-sm font-semibold text-gray-900 mt-2">
                {day.rate}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="modern-card">
        <div className="card-header">
          <h3 className="card-title">
            <UserGroupIcon className="w-5 h-5" />
            Today's Attendance Details
          </h3>
          <span className="text-sm text-muted">{selectedDate}</span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>USN</th>
                <th>Name</th>
                <th>Semester</th>
                <th>Section</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="spinner mx-auto"></div>
                  </td>
                </tr>
              ) : (
                attendanceData.map((student, index) => (
                  <tr key={index}>
                    <td className="font-mono font-medium">{student.usn}</td>
                    <td>{student.name}</td>
                    <td>{student.semester}</td>
                    <td>{student.section}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadge(student.status)}`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      {student.status === "present" ? (
                        <span className="flex items-center text-sm text-muted">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          {student.time}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {stats.lowAttendance > 0 && (
        <div className="mt-6 alert alert-warning">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-medium">Low Attendance Alert</p>
                <p className="text-sm opacity-75">
                  {stats.lowAttendance} students have attendance below 75%
                </p>
              </div>
            </div>
            <button className="btn btn-secondary text-sm py-1">
              View List
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
