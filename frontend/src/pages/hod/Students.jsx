// pages/hod/Students.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSem, setSelectedSem] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      await Promise.all([fetchStudents(), fetchDepartment()]);
      if (!isMounted) return;
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/hod/students");
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await api.get("/hod/department");
      setDepartment(response.data.department || null);
    } catch (error) {
      console.error("Error fetching department:", error);
      setDepartment(null);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-50";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getStatusBadge = (status) => {
    return status === "active" ? "badge-green" : "badge-yellow";
  };

  const getBloodGroupBadge = (bloodGroup) => {
    const colors = {
      "A+": "badge-blue",
      "A-": "badge-blue",
      "B+": "badge-green",
      "B-": "badge-green",
      "O+": "badge-purple",
      "O-": "badge-purple",
      "AB+": "badge-orange",
      "AB-": "badge-orange",
    };
    return colors[bloodGroup] || "badge-blue";
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSem =
      selectedSem === "all" || student.semester === parseInt(selectedSem);
    const matchesSection =
      selectedSection === "all" || student.section === selectedSection;

    return matchesSearch && matchesSem && matchesSection;
  });

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    lowAttendance: students.filter((s) => s.attendance < 75).length,
    avgCgpa: students.length
      ? (
          students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length
        ).toFixed(2)
      : "0.00",
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
          <h1>Department Students</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">{department?.name}</span>
            <span className="badge badge-blue">{department?.code}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{stats.total} students</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <AcademicCapIcon className="w-5 h-5 mr-2" />
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
          <div className="stat-trend">
            <span className="trend-up">Enrolled</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Active Students</p>
              <p className="stat-value">{stats.active}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Currently enrolled</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Low Attendance</p>
              <p className="stat-value">{stats.lowAttendance}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-down">Below 75%</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Average CGPA</p>
              <p className="stat-value">{stats.avgCgpa}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <ChartBarIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Overall performance</span>
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
              placeholder="Search students by name, USN, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="w-full md:w-40">
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="form-input"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-32">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="form-input"
            >
              <option value="all">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <FunnelIcon className="w-5 h-5" />
            <span>{filteredStudents.length} students</span>
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
            {/* Header with status */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xl`}
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

            {/* Semester & Section */}
            <div className="flex gap-2 mb-4">
              <span className="badge badge-blue">
                Semester {student.semester}
              </span>
              <span className="badge badge-purple">
                Section {student.section}
              </span>
              <span
                className={`badge ${getBloodGroupBadge(student.bloodGroup)}`}
              >
                {student.bloodGroup}
              </span>
            </div>

            {/* Attendance & CGPA */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-muted mb-1">Attendance</p>
                <p
                  className={`text-xl font-semibold ${getAttendanceColor(student.attendance)} rounded-lg`}
                >
                  {student.attendance}%
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <p className="text-xs text-muted mb-1">CGPA</p>
                <p className="text-xl font-semibold text-blue-600">
                  {student.cgpa}
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
                DOB: {new Date(student.dob).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-muted">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
                {student.address.city}, {student.address.state}
              </div>
            </div>

            {/* Parent Info */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Parent/Guardian
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{student.parentName}</p>
                  <p className="text-xs text-muted">{student.parentPhone}</p>
                </div>
                <button className="btn btn-secondary text-sm py-1 px-3">
                  Contact
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button className="flex-1 btn btn-secondary text-sm py-2">
                View Details
              </button>
              <button className="flex-1 btn btn-primary text-sm py-2">
                Attendance
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <AcademicCapIcon className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No students found
          </h3>
          <p className="text-muted mt-2">
            {searchTerm || selectedSem !== "all" || selectedSection !== "all"
              ? "Try adjusting your filters"
              : "No students in this department yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Students;
