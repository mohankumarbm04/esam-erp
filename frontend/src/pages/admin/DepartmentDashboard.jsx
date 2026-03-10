import "./Admin.css";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BuildingOfficeIcon,
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import SearchFilter from "../../components/SearchFilter";

const DepartmentDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    establishedYear: "",
    hodName: "",
    hodEmail: "",
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  const API_BASE = "http://localhost:5000/api/admin";

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      if (error.response?.status === 401) {
        setError("Session expired. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  }, [API_BASE, token]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Filter configuration
  const filterConfig = [
    {
      name: "established",
      label: "Established",
      icon: CalendarIcon,
      options: [
        { value: "recent", label: "Last 5 Years" },
        { value: "old", label: "10+ Years" },
        { value: "new", label: "Less than 5 Years" },
      ],
      chips: [
        { value: "recent", label: "Recent", icon: CalendarIcon },
        { value: "old", label: "Old", icon: ClockIcon },
      ],
    },
    {
      name: "strength",
      label: "Student Strength",
      icon: UsersIcon,
      options: [
        { value: "high", label: "High (>200)" },
        { value: "medium", label: "Medium (100-200)" },
        { value: "low", label: "Low (<100)" },
      ],
    },
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filtered departments
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.hodName?.toLowerCase().includes(searchTerm.toLowerCase());

    const currentYear = new Date().getFullYear();
    const estYear = dept.establishedYear || currentYear;
    const age = currentYear - estYear;

    let matchesEstablished = true;
    if (filters.established === "recent" && age > 5) matchesEstablished = false;
    if (filters.established === "old" && age < 10) matchesEstablished = false;
    if (filters.established === "new" && age > 5) matchesEstablished = false;

    let matchesStrength = true;
    if (filters.strength === "high" && dept.totalStudents < 200)
      matchesStrength = false;
    if (
      filters.strength === "medium" &&
      (dept.totalStudents < 100 || dept.totalStudents > 200)
    )
      matchesStrength = false;
    if (filters.strength === "low" && dept.totalStudents > 100)
      matchesStrength = false;

    return matchesSearch && matchesEstablished && matchesStrength;
  });

  const stats = {
    total: departments.length,
    active: departments.filter((d) => d.isActive !== false).length,
    withHOD: departments.filter((d) => d.hodName).length,
    avgStudents:
      Math.round(
        departments.reduce((acc, d) => acc + (d.totalStudents || 0), 0) /
          departments.length,
      ) || 0,
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/departments/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Department updated successfully!");
      } else {
        await axios.post(`${API_BASE}/departments`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Department created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchDepartments();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save department");
    }
  };

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || "",
      establishedYear: dept.establishedYear || "",
      hodName: dept.hodName || "",
      hodEmail: dept.hodEmail || "",
      totalStudents: dept.totalStudents || 0,
      totalTeachers: dept.totalTeachers || 0,
      totalSubjects: dept.totalSubjects || 0,
    });
    setEditingId(dept._id);
    setShowForm(true);
    setViewDetails(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?"))
      return;

    try {
      await axios.delete(`${API_BASE}/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete department");
    }
  };

  const handleView = (dept) => {
    setViewDetails(dept);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      establishedYear: "",
      hodName: "",
      hodEmail: "",
      totalStudents: 0,
      totalTeachers: 0,
      totalSubjects: 0,
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
    setError("");
    setSuccess("");
  };

  const closeView = () => {
    setViewDetails(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="modern-dashboard">
      {/* Header with Logo */}
      <div className="modern-header-clean">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <BuildingOfficeIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Department Dashboard</h1>
            <p className="text-muted">
              Manage all academic departments and HODs
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                setShowForm(true);
              }
            }}
            className="btn btn-primary"
          >
            {showForm ? (
              <>
                <XMarkIcon className="w-5 h-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Department
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && <div className="alert alert-error mb-6">{error}</div>}
      {success && <div className="alert alert-success mb-6">{success}</div>}

      {/* Stats Cards */}
      <div className="stats-grid mb-8">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Departments</p>
              <p className="stat-card-value">{stats.total}</p>
            </div>
            <div
              className="stat-icon"
              style={{
                background: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              }}
            >
              <BuildingOfficeIcon />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">With HOD</p>
              <p className="stat-card-value" style={{ color: "#10b981" }}>
                {stats.withHOD}
              </p>
            </div>
            <div
              className="stat-icon"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
              }}
            >
              <AcademicCapIcon />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Active</p>
              <p className="stat-card-value" style={{ color: "#8b5cf6" }}>
                {stats.active}
              </p>
            </div>
            <div
              className="stat-icon"
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
              }}
            >
              <CheckIcon />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Avg Students</p>
              <p className="stat-card-value" style={{ color: "#f59e0b" }}>
                {stats.avgStudents}
              </p>
            </div>
            <div
              className="stat-icon"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
              }}
            >
              <UsersIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        totalResults={filteredDepartments.length}
        placeholder="Search departments by name, code, or HOD..."
      />

      {/* Department Details Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 slide-in">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="text-2xl font-bold flex items-center">
                <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mr-2" />
                Department Details
              </h2>
              <button
                onClick={closeView}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                  Basic Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p>
                    <span className="text-muted">Department:</span>{" "}
                    <span className="font-medium">{viewDetails.name}</span>
                  </p>
                  <p>
                    <span className="text-muted">Code:</span>{" "}
                    <span className="font-medium">{viewDetails.code}</span>
                  </p>
                  <p>
                    <span className="text-muted">Established:</span>{" "}
                    {viewDetails.establishedYear || "N/A"}
                  </p>
                  <p>
                    <span className="text-muted">Description:</span>{" "}
                    {viewDetails.description || "No description"}
                  </p>
                </div>
              </div>

              {/* HOD Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center">
                  <span className="w-1 h-5 bg-green-600 rounded-full mr-2"></span>
                  HOD Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p>
                    <span className="text-muted">HOD Name:</span>{" "}
                    {viewDetails.hodName || "Not Assigned"}
                  </p>
                  <p>
                    <span className="text-muted">HOD Email:</span>{" "}
                    {viewDetails.hodEmail || "N/A"}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="col-span-2">
                <h3 className="font-semibold text-lg flex items-center mb-3">
                  <span className="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
                  Department Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <UsersIcon className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">
                      {viewDetails.totalStudents}
                    </p>
                    <p className="text-sm text-muted">Students</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <AcademicCapIcon className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold">
                      {viewDetails.totalTeachers}
                    </p>
                    <p className="text-sm text-muted">Teachers</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <BookOpenIcon className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                    <p className="text-2xl font-bold">
                      {viewDetails.totalSubjects}
                    </p>
                    <p className="text-sm text-muted">Subjects</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card mb-6 slide-in">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Department" : "Add New Department"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Department Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., CS"
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input"
                  placeholder="Department description..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Established Year</label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 2000"
                />
              </div>
              <div className="form-group">
                <label className="form-label">HOD Name</label>
                <input
                  type="text"
                  name="hodName"
                  value={formData.hodName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Dr. Rajesh Kumar"
                />
              </div>
              <div className="form-group">
                <label className="form-label">HOD Email</label>
                <input
                  type="email"
                  name="hodEmail"
                  value={formData.hodEmail}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="hod@esam.edu"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-success">
                <CheckIcon className="w-5 h-5 mr-2" />
                {editingId ? "Update Department" : "Create Department"}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Departments Table */}
      <div className="card">
        <h2 className="flex items-center gap-2">
          <BuildingOfficeIcon className="w-5 h-5" />
          All Departments ({filteredDepartments.length})
        </h2>

        <div className="table-container mt-4">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>HOD</th>
                <th>Established</th>
                <th>Students</th>
                <th>Teachers</th>
                <th>Subjects</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept._id}>
                  <td>
                    <span className="font-mono font-medium">{dept.code}</span>
                  </td>
                  <td className="font-medium">{dept.name}</td>
                  <td>
                    {dept.hodName ? (
                      <div>
                        <div>{dept.hodName}</div>
                        <div className="text-xs text-muted">
                          {dept.hodEmail}
                        </div>
                      </div>
                    ) : (
                      <span className="badge badge-warning">Not Assigned</span>
                    )}
                  </td>
                  <td>{dept.establishedYear || "-"}</td>
                  <td>
                    <span className="badge badge-info">
                      {dept.totalStudents}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">
                      {dept.totalTeachers}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-purple">
                      {dept.totalSubjects}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleView(dept)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition hover:scale-110"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(dept)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition hover:scale-110"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition hover:scale-110"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No departments found
              </h3>
              <p className="text-gray-500 mt-2">
                {searchTerm || Object.keys(filters).length > 0
                  ? "Try adjusting your search or filters"
                  : "Click 'Add Department' to create one"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
