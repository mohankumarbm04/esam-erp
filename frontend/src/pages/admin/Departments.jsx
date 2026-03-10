// pages/admin/Departments.jsx
import "./Admin.css";
import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  CheckIcon,
  AcademicCapIcon,
  UsersIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import SearchFilter from "../../components/SearchFilter";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [hods, setHods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    establishedYear: "",
    hodId: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/departments");
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError(error.response?.data?.error || "Failed to load departments.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHods = useCallback(async () => {
    try {
      const response = await api.get("/admin/hods");
      setHods(response.data.hods || []);
    } catch (error) {
      console.error("Error fetching HODs:", error);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
    fetchHods();
  }, [fetchDepartments, fetchHods]);

  // Filter configuration for SearchFilter component
  const filterConfig = [
    {
      name: "status",
      label: "Status",
      icon: AcademicCapIcon,
      options: [
        { value: "withHOD", label: "With HOD" },
        { value: "withoutHOD", label: "Without HOD" },
      ],
      chips: [
        { value: "withHOD", label: "With HOD", icon: AcademicCapIcon },
        { value: "withoutHOD", label: "Without HOD", icon: UsersIcon },
      ],
    },
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
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Apply filters and search to departments
  const filteredDepartments = departments.filter((dept) => {
    // Search filter
    const matchesSearch =
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (filters.status === "withHOD" && !dept.hodName) matchesStatus = false;
    if (filters.status === "withoutHOD" && dept.hodName) matchesStatus = false;

    // Established year filter
    let matchesEstablished = true;
    const currentYear = new Date().getFullYear();
    const estYear = dept.establishedYear || currentYear;
    const age = currentYear - estYear;

    if (filters.established === "recent" && age > 5) matchesEstablished = false;
    if (filters.established === "old" && age < 10) matchesEstablished = false;
    if (filters.established === "new" && age > 5) matchesEstablished = false;

    return matchesSearch && matchesStatus && matchesEstablished;
  });

  const stats = {
    total: departments.length,
    withHOD: departments.filter((d) => d.hodName).length,
    withoutHOD: departments.filter((d) => !d.hodName).length,
    oldest:
      departments.length > 0
        ? Math.min(...departments.map((d) => d.establishedYear || 9999))
        : new Date().getFullYear(),
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
      const selectedHod = hods.find((h) => h._id === formData.hodId);
      const payload = {
        ...formData,
        hodId: formData.hodId || null,
        hodName: selectedHod
          ? selectedHod.username || selectedHod.email
          : "Not Assigned",
      };

      if (editingId) {
        const response = await api.put(`/admin/departments/${editingId}`, payload);
        const updated = response.data.department;
        setDepartments((prev) =>
          prev.map((d) => (d._id === editingId ? updated : d)),
        );
        setSuccess("Department updated successfully!");
      } else {
        const response = await api.post("/admin/departments", payload);
        const created = response.data.department;
        setDepartments((prev) => [created, ...prev]);
        setSuccess("Department created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
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
      hodId: dept.hodId?._id || dept.hodId || "",
    });
    setEditingId(dept._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setConfirm({ open: true, id });
  };

  const confirmDelete = async () => {
    if (!confirm.id) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await api.delete(`/admin/departments/${confirm.id}`);
      setDepartments((prev) => prev.filter((d) => d._id !== confirm.id));
      setSuccess("Department deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete department");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      establishedYear: "",
      hodId: "",
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
    setError("");
    setSuccess("");
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
          <h1>Department Management</h1>
          <p>Manage all academic departments and their HODs</p>
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
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Total Departments</p>
              <p className="stat-card-value">{stats.total}</p>
            </div>
            <div className="stat-icon">
              <BuildingOfficeIcon />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">100%</span>
            <span>of institution</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">With HOD</p>
              <p className="stat-card-value text-green-600">{stats.withHOD}</p>
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
          <div className="stat-trend">
            <span className="trend-up">✓ Assigned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">HOD Vacant</p>
              <p className="stat-card-value text-orange-600">
                {stats.withoutHOD}
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
          <div className="stat-trend">
            <span className="trend-down">Pending</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div>
              <p className="stat-card-title">Oldest Dept</p>
              <p className="stat-card-value text-purple-600">{stats.oldest}</p>
            </div>
            <div
              className="stat-icon"
              style={{
                background: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
              }}
            >
              <ClockIcon />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">Established</span>
          </div>
        </div>
      </div>

      {/* Professional Search & Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filterConfig}
        onFilterChange={handleFilterChange}
        totalResults={filteredDepartments.length}
        placeholder="Search departments by name, code, or description..."
      />

      {/* Form */}
      {showForm && (
        <div className="card mb-6 slide-in">
          <h2>{editingId ? "Edit Department" : "Add New Department"}</h2>

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
              <div>
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
                <label className="form-label">HOD</label>
                <select
                  name="hodId"
                  value={formData.hodId}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Not Assigned</option>
                  {hods.map((h) => (
                    <option key={h._id} value={h._id}>
                      {h.username || h.email}
                    </option>
                  ))}
                </select>
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
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Description</th>
              <th>Established</th>
              <th>HOD</th>
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
                <td className="text-gray-600 max-w-xs truncate">
                  {dept.description || "-"}
                </td>
                <td>{dept.establishedYear || "-"}</td>
                <td>
                  {dept.hodName ? (
                    <span className="badge badge-success">{dept.hodName}</span>
                  ) : (
                    <span className="badge badge-warning">Not Assigned</span>
                  )}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="action-btn action-btn--edit"
                      title="Edit"
                    >
                      <PencilIcon className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(dept._id)}
                      className="action-btn action-btn--delete"
                      title="Delete"
                    >
                      <TrashIcon className="action-icon" />
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

      <ConfirmDialog
        open={confirm.open}
        title="Delete Department"
        message="Are you sure you want to delete this record?"
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Departments;
