// pages/hod/Teachers.jsx
import React, { useState, useEffect } from "react";
import api from "../../utils/axiosConfig";
import {
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("all");
  const [department, setDepartment] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      if (!isMounted) return;
      setLoading(true);
      await Promise.all([fetchTeachers(), fetchDepartment()]);
      if (!isMounted) return;
      setLoading(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/hod/teachers");
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([]);
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

  const getDesignationBadge = (designation) => {
    switch (designation) {
      case "Professor":
        return "badge-purple";
      case "Associate Professor":
        return "badge-blue";
      case "Assistant Professor":
        return "badge-green";
      default:
        return "badge-blue";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "badge-green";
      case "on_leave":
        return "badge-yellow";
      default:
        return "badge-blue";
    }
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDesignation =
      filterDesignation === "all" || teacher.designation === filterDesignation;

    return matchesSearch && matchesDesignation;
  });

  const stats = {
    total: teachers.length,
    professors: teachers.filter((t) => t.designation === "Professor").length,
    associateProfessors: teachers.filter(
      (t) => t.designation === "Associate Professor",
    ).length,
    assistantProfessors: teachers.filter(
      (t) => t.designation === "Assistant Professor",
    ).length,
    onLeave: teachers.filter((t) => t.status === "on_leave").length,
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
          <h1>Department Teachers</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">{department?.name}</span>
            <span className="badge badge-blue">{department?.code}</span>
            <span className="text-muted">•</span>
            <span className="text-muted">{stats.total} teachers</span>
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
              <p className="stat-title">Total Teachers</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Full-time faculty</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Professors</p>
              <p className="stat-value">{stats.professors}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Senior faculty</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Associate Professors</p>
              <p className="stat-value">{stats.associateProfessors}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <BriefcaseIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Mid-level</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Assistant Professors</p>
              <p className="stat-value">{stats.assistantProfessors}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Junior faculty</span>
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
              placeholder="Search teachers by name, ID, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="form-input"
            >
              <option value="all">All Designations</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <FunnelIcon className="w-5 h-5" />
            <span>{filteredTeachers.length} teachers</span>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="modern-card hover:shadow-lg transition-all group"
          >
            {/* Header with status indicator */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${getDesignationBadge(teacher.designation)} flex items-center justify-center font-semibold text-lg`}
                >
                  {teacher.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {teacher.name}
                  </h3>
                  <p className="text-sm text-muted">{teacher.teacherId}</p>
                </div>
              </div>
              <span className={`badge ${getStatusBadge(teacher.status)}`}>
                {teacher.status === "active" ? "Active" : "On Leave"}
              </span>
            </div>

            {/* Designation & Qualification */}
            <div className="mb-4">
              <span
                className={`badge ${getDesignationBadge(teacher.designation)} mr-2`}
              >
                {teacher.designation}
              </span>
              <span className="text-sm text-muted">
                {teacher.qualification}
              </span>
            </div>

            {/* Specialization */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Specialization
              </p>
              <p className="text-sm text-muted">{teacher.specialization}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                {teacher.email}
              </div>
              <div className="flex items-center text-sm text-muted">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                {teacher.phone}
              </div>
              <div className="flex items-center text-sm text-muted">
                <BriefcaseIcon className="w-4 h-4 mr-2 text-gray-400" />
                {teacher.experience} years experience
              </div>
              <div className="flex items-center text-sm text-muted">
                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                Joined{" "}
                {new Date(teacher.joiningDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>

            {/* Courses & Office */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Courses
                </span>
                <span className="text-xs text-muted">
                  {teacher.courses.length} assigned
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {teacher.courses.map((course) => (
                  <span key={course} className="badge badge-blue">
                    {course}
                  </span>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted">
                <span className="font-medium mr-2">Office:</span>
                {teacher.office}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <button className="flex-1 btn btn-secondary text-sm py-2">
                View Profile
              </button>
              <button className="flex-1 btn btn-primary text-sm py-2">
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-12 h-12 mx-auto text-muted mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No teachers found
          </h3>
          <p className="text-muted mt-2">
            {searchTerm || filterDesignation !== "all"
              ? "Try adjusting your filters"
              : "No teachers in this department yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Teachers;
