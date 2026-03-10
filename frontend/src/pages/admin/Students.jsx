// pages/admin/Students.jsx
import "./Admin.css"; // Add this after your other imports
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminSearchBar from "../../components/common/AdminSearchBar";
import {
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  EyeIcon,
  XMarkIcon,
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  MapPinIcon,
  CheckIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [formData, setFormData] = useState({
    usn: "",
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    departmentId: "",
    semester: "",
    section: "",
    admissionYear: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await api.get("/admin/students");
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.response?.data?.error || "Failed to load students. Please try again.");
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
      setError(error.response?.data?.error || "Failed to load departments.");
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, [fetchStudents, fetchDepartments]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const nextErrors = {};
    if (!formData.usn.trim()) nextErrors.usn = "USN is required";
    if (!formData.name.trim()) nextErrors.name = "Name is required";
    if (!formData.email.trim()) nextErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = "Invalid email";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required";
    if (!formData.dob) nextErrors.dob = "DOB is required";
    if (!formData.gender) nextErrors.gender = "Gender is required";
    if (!formData.departmentId) nextErrors.departmentId = "Department is required";
    if (!formData.semester) nextErrors.semester = "Semester is required";
    if (!formData.section) nextErrors.section = "Section is required";
    if (!formData.admissionYear) nextErrors.admissionYear = "Admission year is required";
    if (!formData.parentName.trim()) nextErrors.parentName = "Parent name is required";
    if (!formData.parentPhone.trim()) nextErrors.parentPhone = "Parent phone is required";

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/admin/students/${editingId}`, formData);
        const updated = response.data.student;
        setStudents((prev) => prev.map((s) => (s._id === editingId ? updated : s)));
        setSuccess("Student updated successfully!");
      } else {
        const response = await api.post("/admin/students", formData);
        const created = response.data.student;
        setStudents((prev) => [created, ...prev]);
        setSuccess("Student created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setFormData({
      usn: student.usn,
      name: student.name,
      email: student.email,
      phone: student.phone,
      dob: student.dob?.split("T")[0] || "",
      gender: student.gender,
      bloodGroup: student.bloodGroup || "",
      departmentId: student.departmentId?._id || student.departmentId,
      semester: student.semester,
      section: student.section,
      admissionYear: student.admissionYear,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || "",
      address: student.address || {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    });
    setEditingId(student._id);
    setShowForm(true);
    setViewDetails(null);
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
      await api.delete(`/admin/students/${confirm.id}`);
      setStudents((prev) => prev.filter((s) => s._id !== confirm.id));
      setSuccess("Student deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete student");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, id: null });
    }
  };

  const handleView = (student) => {
    setViewDetails(student);
  };

  const resetForm = () => {
    setFormData({
      usn: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      departmentId: "",
      semester: "",
      section: "",
      admissionYear: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
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

  const closeView = () => {
    setViewDetails(null);
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const getSectionOptions = () => {
    return ["A", "B", "C"].map((sec) => (
      <option key={sec} value={sec}>
        Section {sec}
      </option>
    ));
  };

  const getBloodGroupBadge = (bloodGroup) => {
    const colors = {
      "A+": "badge-success",
      "A-": "badge-info",
      "B+": "badge-warning",
      "B-": "badge-info",
      "O+": "badge-success",
      "O-": "badge-info",
      "AB+": "badge-warning",
      "AB-": "badge-danger",
    };
    return colors[bloodGroup] || "badge-info";
  };

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !q ||
        student.name?.toLowerCase().includes(q) ||
        student.usn?.toLowerCase().includes(q) ||
        student.email?.toLowerCase().includes(q) ||
        student.phone?.toLowerCase().includes(q);

      const matchesDept =
        filterDept === "all" || student.departmentId?._id === filterDept;
      const matchesSem =
        filterSem === "all" || student.semester === parseInt(filterSem, 10);
      const matchesSection =
        filterSection === "all" ||
        String(student.section || "").toUpperCase() ===
          String(filterSection).toUpperCase();

      return matchesSearch && matchesDept && matchesSem && matchesSection;
    });
  }, [students, searchTerm, filterDept, filterSem, filterSection]);

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
          <h1>Student Management</h1>
          <p>Manage student records and academic information</p>
        </div>
        <div className="header-actions">
          <button
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                setShowForm(true);
                setViewDetails(null);
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
                Add Student
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {error && <div className="alert alert-error mb-6">{error}</div>}
      {success && <div className="alert alert-success mb-6">{success}</div>}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Details View Modal */}
        {viewDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 slide-in">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                <h2 className="text-2xl font-bold flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600 mr-2" />
                  Student Details
                </h2>
                <button
                  onClick={closeView}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                    <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p>
                      <span className="text-gray-500">USN:</span>{" "}
                      <span className="font-medium">{viewDetails.usn}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Name:</span>{" "}
                      <span className="font-medium">{viewDetails.name}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      {viewDetails.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      {viewDetails.phone}
                    </p>
                    <p>
                      <span className="text-gray-500">DOB:</span>{" "}
                      {new Date(viewDetails.dob).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="text-gray-500">Gender:</span>{" "}
                      {viewDetails.gender}
                    </p>
                    <p>
                      <span className="text-gray-500">Blood Group:</span>{" "}
                      <span
                        className={`badge ${getBloodGroupBadge(viewDetails.bloodGroup)}`}
                      >
                        {viewDetails.bloodGroup || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                    <span className="w-1 h-5 bg-green-600 rounded-full mr-2"></span>
                    Academic Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p>
                      <span className="text-gray-500">Department:</span>{" "}
                      {viewDetails.departmentId?.name || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">Semester:</span>{" "}
                      {viewDetails.semester}
                    </p>
                    <p>
                      <span className="text-gray-500">Section:</span>{" "}
                      {viewDetails.section}
                    </p>
                    <p>
                      <span className="text-gray-500">Admission Year:</span>{" "}
                      {viewDetails.admissionYear}
                    </p>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                    <span className="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
                    Parent Information
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p>
                      <span className="text-gray-500">Parent Name:</span>{" "}
                      {viewDetails.parentName}
                    </p>
                    <p>
                      <span className="text-gray-500">Parent Phone:</span>{" "}
                      {viewDetails.parentPhone}
                    </p>
                    <p>
                      <span className="text-gray-500">Parent Email:</span>{" "}
                      {viewDetails.parentEmail || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                    <span className="w-1 h-5 bg-orange-600 rounded-full mr-2"></span>
                    Address
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <p>
                      <span className="text-gray-500">Street:</span>{" "}
                      {viewDetails.address?.street || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">City:</span>{" "}
                      {viewDetails.address?.city || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">State:</span>{" "}
                      {viewDetails.address?.state || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-500">Pincode:</span>{" "}
                      {viewDetails.address?.pincode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AdminSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Search students by name, USN, email, or phone..."
          filters={[
            {
              key: "department",
              label: "Department",
              value: filterDept,
              onChange: setFilterDept,
              options: [
                { value: "all", label: "All Departments" },
                ...departments.map((d) => ({ value: d._id, label: d.name })),
              ],
            },
            {
              key: "semester",
              label: "Semester",
              value: filterSem,
              onChange: setFilterSem,
              options: [
                { value: "all", label: "All Semesters" },
                ...[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
                  value: String(s),
                  label: `Sem ${s}`,
                })),
              ],
            },
            {
              key: "section",
              label: "Section",
              value: filterSection,
              onChange: setFilterSection,
              options: [
                { value: "all", label: "All Sections" },
                ...["A", "B", "C"].map((sec) => ({
                  value: sec,
                  label: `Section ${sec}`,
                })),
              ],
            },
          ]}
          rightText={`${filteredStudents.length} students`}
        />

        {/* Quick Stats */}
        <div className="stats-grid mb-6">
          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Total Students</p>
                <p className="stat-value">{students.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <UserGroupIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Active Students</p>
                <p className="stat-value text-green-600">
                  {students.filter((s) => s.isActive !== false).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Departments</p>
                <p className="stat-value text-purple-600">
                  {new Set(students.map((s) => s.departmentId?._id)).size}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Avg Semester</p>
                <p className="stat-value text-orange-600">
                  {students.length > 0
                    ? Math.round(
                        students.reduce((acc, s) => acc + s.semester, 0) /
                          students.length,
                      )
                    : 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                <ChartBarIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="modern-card mb-6 slide-in">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 w-1 h-6 rounded-full mr-3"></span>
              {editingId ? "Edit Student" : "Add New Student"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">USN</label>
                    <input
                      type="text"
                      name="usn"
                      value={formData.usn}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="1BI21CS001"
                    />
                    {fieldErrors.usn && (
                      <span className="input-error-message">
                        {fieldErrors.usn}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Alice Johnson"
                    />
                    {fieldErrors.name && (
                      <span className="input-error-message">
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="student@esam.edu"
                    />
                    {fieldErrors.email && (
                      <span className="input-error-message">
                        {fieldErrors.email}
                      </span>
                    )}
                  </div>
                  <div>
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
                      <span className="input-error-message">
                        {fieldErrors.phone}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    />
                    {fieldErrors.dob && (
                      <span className="input-error-message">
                        {fieldErrors.dob}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {fieldErrors.gender && (
                      <span className="input-error-message">
                        {fieldErrors.gender}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="form-input"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
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
                  <div>
                    <label className="form-label">Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select Semester</option>
                      {getSemesterOptions()}
                    </select>
                    {fieldErrors.semester && (
                      <span className="input-error-message">
                        {fieldErrors.semester}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Section</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select Section</option>
                      {getSectionOptions()}
                    </select>
                    {fieldErrors.section && (
                      <span className="input-error-message">
                        {fieldErrors.section}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Admission Year</label>
                    <input
                      type="number"
                      name="admissionYear"
                      value={formData.admissionYear}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="2021"
                    />
                    {fieldErrors.admissionYear && (
                      <span className="input-error-message">
                        {fieldErrors.admissionYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-purple-600 mr-2" />
                  Parent Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Parent Name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Mr. Robert Johnson"
                    />
                    {fieldErrors.parentName && (
                      <span className="input-error-message">
                        {fieldErrors.parentName}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Parent Phone</label>
                    <input
                      type="text"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="9876543211"
                    />
                    {fieldErrors.parentPhone && (
                      <span className="input-error-message">
                        {fieldErrors.parentPhone}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Parent Email</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="parent@family.com"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 text-orange-600 mr-2" />
                  Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Bangalore"
                    />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Karnataka"
                    />
                  </div>
                  <div>
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="560001"
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="btn btn-success">
                  <CheckIcon className="h-5 w-5 mr-2" />
                  {editingId ? "Update Student" : "Create Student"}
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

        {/* Students Table */}
        <div className="modern-card">
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>USN</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Sem/Sec</th>
                  <th>Parent</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="group">
                    <td>
                      <span className="font-mono font-medium text-gray-900">
                        {student.usn}
                      </span>
                    </td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {student.name}
                      </div>
                    </td>
                    <td>
                      <div className="contact-row">
                        <span className="contact-item" title={student.email}>
                          <EnvelopeIcon className="contact-icon" />
                          <span className="contact-text">{student.email}</span>
                        </span>
                        <span className="contact-item" title={student.phone}>
                          <PhoneIcon className="contact-icon" />
                          <span className="contact-text">{student.phone}</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {student.departmentId?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>Sem {student.semester}</div>
                        <div className="text-xs text-gray-500">
                          Sec {student.section}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{student.parentName}</div>
                        <div className="text-xs text-gray-500">
                          {student.parentPhone}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          onClick={() => handleView(student)}
                          className="action-btn"
                          title="View Details"
                        >
                          <EyeIcon className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleEdit(student)}
                          className="action-btn action-btn--edit"
                          title="Edit"
                        >
                          <PencilIcon className="action-icon" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
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

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  No students found
                </h3>
                <p className="text-gray-500 mt-2">
                  {searchTerm || filterDept !== "all" || filterSem !== "all"
                    ? "Try adjusting your filters"
                    : "Click 'Add Student' to create one"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete Student"
        message="Are you sure you want to delete this student? This cannot be undone."
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Students;
