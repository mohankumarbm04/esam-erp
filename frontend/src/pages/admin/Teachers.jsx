// pages/admin/Teachers.jsx
import "./Teachers.css";
import "./Admin.css"; // Add this after your other imports
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminSearchBar from "../../components/common/AdminSearchBar";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [formData, setFormData] = useState({
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    departmentId: "",
    designation: "",
    qualification: "",
    specialization: "",
    experience: "",
    joiningDate: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await api.get("/admin/teachers");
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(error.response?.data?.error || "Failed to load teachers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await api.get("/admin/departments");
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError(error.response?.data?.error || "Failed to load departments. Please refresh.");
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, [fetchTeachers, fetchDepartments]);

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
    setFieldErrors({});

    const nextErrors = {};
    if (!formData.teacherId.trim()) nextErrors.teacherId = "Teacher ID is required";
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Invalid email";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required";
    if (!formData.departmentId) nextErrors.departmentId = "Department is required";
    if (!formData.designation) nextErrors.designation = "Designation is required";
    if (!formData.qualification.trim()) nextErrors.qualification = "Qualification is required";
    if (!formData.specialization.trim()) nextErrors.specialization = "Specialization is required";
    if (!formData.joiningDate) nextErrors.joiningDate = "Joining date is required";

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/admin/teachers/${editingId}`, formData);
        const updated = response.data.teacher;
        setTeachers((prev) => prev.map((t) => (t._id === editingId ? updated : t)));
        setSuccess("Teacher updated successfully!");
      } else {
        const response = await api.post("/admin/teachers", formData);
        const created = response.data.teacher;
        setTeachers((prev) => [created, ...prev]);
        setSuccess("Teacher created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save teacher");
    }
  };

  const handleEdit = (teacher) => {
    setFormData({
      teacherId: teacher.teacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      departmentId: teacher.departmentId?._id || teacher.departmentId,
      designation: teacher.designation,
      qualification: teacher.qualification,
      specialization: teacher.specialization,
      experience: teacher.experience,
      joiningDate: teacher.joiningDate?.split("T")[0] || "",
    });
    setEditingId(teacher._id);
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
      await api.delete(`/admin/teachers/${confirm.id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== confirm.id));
      setSuccess("Teacher deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete teacher");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: "",
      name: "",
      email: "",
      phone: "",
      departmentId: "",
      designation: "",
      qualification: "",
      specialization: "",
      experience: "",
      joiningDate: "",
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    resetForm();
    setError("");
    setSuccess("");
    setFieldErrors({});
  };

  const getDesignationBadge = (designation) => {
    switch (designation) {
      case "Professor":
        return "badge-purple";
      case "Associate Professor":
        return "badge-blue";
      case "Assistant Professor":
        return "badge-green";
      case "Senior Lecturer":
        return "badge-yellow";
      case "Lecturer":
        return "badge-blue";
      default:
        return "badge-blue";
    }
  };

  const filteredTeachers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const deptName = teacher.departmentId?.name || "";
      const matchesSearch =
        !q ||
        teacher.name?.toLowerCase().includes(q) ||
        teacher.teacherId?.toLowerCase().includes(q) ||
        teacher.email?.toLowerCase().includes(q) ||
        deptName.toLowerCase().includes(q);

      const matchesDept =
        filterDept === "all" || teacher.departmentId?._id === filterDept;

      return matchesSearch && matchesDept;
    });
  }, [teachers, searchTerm, filterDept]);

  const stats = {
    total: teachers.length,
    professors: teachers.filter((t) => t.designation === "Professor").length,
    associateProfessors: teachers.filter(
      (t) => t.designation === "Associate Professor",
    ).length,
    assistantProfessors: teachers.filter(
      (t) => t.designation === "Assistant Professor",
    ).length,
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
          <h1>Teacher Management</h1>
          <p>Manage faculty members and their academic details</p>
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
                Add Teacher
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
        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Teachers</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <UserPlusIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">↑ 100%</span>
            <span className="text-muted">faculty strength</span>
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
            <span className="trend-up">👑 Senior</span>
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
            <span className="trend-up">📚 Experienced</span>
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
            <span className="trend-up">📖 Junior</span>
          </div>
        </div>
      </div>

      <AdminSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search teachers by name, ID, email, or department..."
        filters={[
          {
            key: "department",
            label: "Department",
            value: filterDept,
            onChange: setFilterDept,
            options: [
              { value: "all", label: "All Departments" },
              ...departments.map((d) => ({
                value: d._id,
                label: `${d.name} (${d.code})`,
              })),
            ],
          },
        ]}
        rightText={`${filteredTeachers.length} teachers`}
      />

      {/* Form */}
      {showForm && (
        <div className="modern-card mb-6 slide-in">
          <h3 className="card-title mb-6">
            {editingId ? "Edit Teacher" : "Add New Teacher"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Teacher ID</label>
                <input
                  type="text"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="e.g., TCH001"
                />
                {fieldErrors.teacherId && (
                  <span className="input-error-message">
                    {fieldErrors.teacherId}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Dr. Rajesh Kumar"
                />
                {fieldErrors.name && (
                  <span className="input-error-message">{fieldErrors.name}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="teacher@esam.edu"
                />
                {fieldErrors.email && (
                  <span className="input-error-message">{fieldErrors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="9876543210"
                />
                {fieldErrors.phone && (
                  <span className="input-error-message">{fieldErrors.phone}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
                {fieldErrors.departmentId && (
                  <span className="input-error-message">
                    {fieldErrors.departmentId}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Designation</option>
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">
                    Associate Professor
                  </option>
                  <option value="Assistant Professor">
                    Assistant Professor
                  </option>
                  <option value="Senior Lecturer">Senior Lecturer</option>
                  <option value="Lecturer">Lecturer</option>
                </select>
                {fieldErrors.designation && (
                  <span className="input-error-message">
                    {fieldErrors.designation}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Ph.D. in Computer Science"
                />
                {fieldErrors.qualification && (
                  <span className="input-error-message">
                    {fieldErrors.qualification}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Machine Learning"
                />
                {fieldErrors.specialization && (
                  <span className="input-error-message">
                    {fieldErrors.specialization}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Experience (years)</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="10"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                {fieldErrors.joiningDate && (
                  <span className="input-error-message">
                    {fieldErrors.joiningDate}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary">
                <CheckIcon className="w-5 h-5 mr-2" />
                {editingId ? "Update Teacher" : "Create Teacher"}
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

      {/* Teachers Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Qualification</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher._id}>
                <td>
                  <span className="font-mono font-medium text-gray-900">
                    {teacher.teacherId}
                  </span>
                </td>
                <td>
                  <div className="font-medium text-gray-900">
                    {teacher.name}
                  </div>
                </td>
                <td>
                  <div className="contact-row">
                    <span className="contact-item" title={teacher.email}>
                      <EnvelopeIcon className="contact-icon" />
                      <span className="contact-text">{teacher.email}</span>
                    </span>
                    <span className="contact-item" title={teacher.phone}>
                      <PhoneIcon className="contact-icon" />
                      <span className="contact-text">{teacher.phone}</span>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="badge badge-blue">
                    {teacher.departmentId?.name || "N/A"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${getDesignationBadge(teacher.designation)}`}
                  >
                    {teacher.designation}
                  </span>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="font-medium">{teacher.qualification}</div>
                    <div className="text-xs text-muted">
                      {teacher.specialization}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleEdit(teacher)}
                      className="action-btn action-btn--edit"
                      title="Edit"
                    >
                      <PencilIcon className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(teacher._id)}
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

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <UserPlusIcon className="w-12 h-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No teachers found
            </h3>
            <p className="text-muted mt-2">
              {searchTerm || filterDept !== "all"
                ? "Try adjusting your filters"
                : "Click 'Add Teacher' to create one"}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher? This cannot be undone."
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Teachers;
