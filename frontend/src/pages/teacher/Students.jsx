// pages/teacher/Students.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSort, setSelectedSort] = useState("name");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    above75: 0,
    below75: 0,
    below65: 0,
    averageMarks: 0,
  });

  const classes = [
    // Populate from backend when teacher-class endpoints are available
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // TODO: replace with real endpoint when available (e.g. /teacher/students)
      const response = await api.get("/teacher/students");
      const list = response.data.students || [];
      setStudents(list);

      const total = list.length;
      const above75 = list.filter((s) => (s.attendance || 0) >= 75).length;
      const below75 = list.filter((s) => (s.attendance || 0) < 75).length;
      const below65 = list.filter((s) => (s.attendance || 0) < 65).length;
      const avgMarks = total
        ? Math.round(list.reduce((acc, s) => acc + (s.marks || 0), 0) / total)
        : 0;

      setStats({ total, above75, below75, below65, averageMarks: avgMarks });
    } catch (e) {
      setStudents([]);
      setStats({ total: 0, above75: 0, below75: 0, below65: 0, averageMarks: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "excellent":
        return "badge-green";
      case "good":
        return "badge-blue";
      case "warning":
        return "badge-yellow";
      case "danger":
        return "badge-red";
      default:
        return "badge-blue";
    }
  };

  const getPerformanceIcon = (marks) => {
    if (marks >= 85)
      return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />;
    if (marks >= 70) return <ChartBarIcon className="w-4 h-4 text-blue-500" />;
    if (marks >= 50)
      return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
    return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
  };

  const filteredStudents = students
    .filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.usn.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass =
        selectedClass === "all" || student.class === selectedClass;
      return matchesSearch && matchesClass;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "attendance":
          return b.attendance - a.attendance;
        case "marks":
          return b.marks - a.marks;
        default:
          return 0;
      }
    });

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
          <h1>My Students</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">
              Manage and track student progress
            </span>
            <span className="badge badge-blue">{stats.total} Students</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <UserGroupIcon className="w-5 h-5 mr-2" />
            View All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Students</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Above 75%</p>
              <p className="stat-value text-green-600">{stats.above75}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Below 75%</p>
              <p className="stat-value text-orange-600">{stats.below75}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Average Marks</p>
              <p className="stat-value text-purple-600">{stats.averageMarks}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <ChartBarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="modern-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search students by name or USN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="w-full md:w-64">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="form-input"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="form-input"
            >
              <option value="name">Sort by Name</option>
              <option value="attendance">Sort by Attendance</option>
              <option value="marks">Sort by Marks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div
            key={student.id}
            className="modern-card hover:shadow-lg transition-all group"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-semibold ${
                    student.status === "excellent"
                      ? "bg-green-100 text-green-600"
                      : student.status === "good"
                        ? "bg-blue-100 text-blue-600"
                        : student.status === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                  }`}
                >
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {student.name}
                  </h3>
                  <p className="text-sm text-muted">{student.usn}</p>
                </div>
              </div>
              <span className={`badge ${getStatusBadge(student.status)}`}>
                {student.status}
              </span>
            </div>

            {/* Class Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">{student.class}</span>
                </div>
                <span className="text-xs text-muted">
                  Sem {student.semester} • Sec {student.section}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted">Attendance</span>
                  {getPerformanceIcon(student.marks)}
                </div>
                <p
                  className={`text-lg font-semibold ${
                    student.attendance >= 75
                      ? "text-green-600"
                      : student.attendance >= 65
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {student.attendance}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-muted mb-1">Average Marks</p>
                <p className="text-lg font-semibold text-blue-600">
                  {student.marks}
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.email}
              </div>
              <div className="flex items-center text-sm text-muted">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.phone}
              </div>
              <div className="flex items-center text-sm text-muted">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                Last active: {student.lastActive}
              </div>
            </div>

            {/* Internal Marks */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-muted mb-2">Internal Marks</p>
              <div className="flex gap-2">
                <span className="badge badge-blue">
                  IA1: {student.internalMarks[0]}
                </span>
                <span className="badge badge-green">
                  IA2: {student.internalMarks[1]}
                </span>
                <span className="badge badge-purple">
                  IA3: {student.internalMarks[2]}
                </span>
              </div>
            </div>

            {/* Parent Info */}
            <div className="border-t pt-4">
              <p className="text-xs text-muted mb-2">Parent/Guardian</p>
              <p className="text-sm font-medium">{student.parent}</p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button className="flex-1 btn btn-secondary text-sm py-2">
                <EyeIcon className="w-4 h-4 mr-2" />
                Profile
              </button>
              <button className="flex-1 btn btn-primary text-sm py-2">
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Marks
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No students found
          </h3>
          <p className="text-muted mt-2">
            {searchTerm || selectedClass !== "all"
              ? "Try adjusting your filters"
              : "No students assigned yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Students;
