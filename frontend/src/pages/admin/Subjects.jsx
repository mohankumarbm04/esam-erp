// pages/admin/Subjects.jsx
import "./Admin.css"; // Add this after your other imports
import React, { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../utils/axiosConfig";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AdminSearchBar from "../../components/common/AdminSearchBar";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  XMarkIcon,
  CheckIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  UserGroupIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterSem, setFilterSem] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [formData, setFormData] = useState({
    subjectCode: "",
    subjectName: "",
    departmentId: "",
    semester: "",
    credits: "",
    type: "Theory",
    hoursPerWeek: "",
    internalMarks: 50,
    externalMarks: 100,
    totalMarks: 150,
    isElective: false,
    syllabus: "",
    teacherIds: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await api.get("/admin/subjects");
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError(error.response?.data?.error || "Failed to load subjects. Please try again.");
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

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await api.get("/admin/teachers");
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setError(error.response?.data?.error || "Failed to load teachers.");
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
    fetchTeachers();
  }, [fetchSubjects, fetchDepartments, fetchTeachers]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTeacherSelection = (teacherId) => {
    setFormData((prev) => {
      const currentTeachers = [...prev.teacherIds];
      if (currentTeachers.includes(teacherId)) {
        return {
          ...prev,
          teacherIds: currentTeachers.filter((id) => id !== teacherId),
        };
      } else {
        return {
          ...prev,
          teacherIds: [...currentTeachers, teacherId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const nextErrors = {};
    if (!formData.subjectCode.trim()) nextErrors.subjectCode = "Subject code is required";
    if (!formData.subjectName.trim()) nextErrors.subjectName = "Subject name is required";
    if (!formData.departmentId) nextErrors.departmentId = "Department is required";
    if (!formData.semester) nextErrors.semester = "Semester is required";
    if (!formData.credits) nextErrors.credits = "Credits is required";
    if (!formData.type) nextErrors.type = "Type is required";
    if (!formData.hoursPerWeek) nextErrors.hoursPerWeek = "Hours/week is required";

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors);
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/admin/subjects/${editingId}`, formData);
        const updated = response.data.subject;
        setSubjects((prev) => prev.map((s) => (s._id === editingId ? updated : s)));
        setSuccess("Subject updated successfully!");
      } else {
        const response = await api.post("/admin/subjects", formData);
        const created = response.data.subject;
        setSubjects((prev) => [created, ...prev]);
        setSuccess("Subject created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to save subject");
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      departmentId: subject.departmentId?._id || subject.departmentId,
      semester: subject.semester,
      credits: subject.credits,
      type: subject.type,
      hoursPerWeek: subject.hoursPerWeek,
      internalMarks: subject.internalMarks || 50,
      externalMarks: subject.externalMarks || 100,
      totalMarks: subject.totalMarks || 150,
      isElective: subject.isElective || false,
      syllabus: subject.syllabus || "",
      teacherIds: subject.teachers?.map((t) => t._id) || [],
    });
    setEditingId(subject._id);
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
      await api.delete(`/admin/subjects/${confirm.id}`);
      setSubjects((prev) => prev.filter((s) => s._id !== confirm.id));
      setSuccess("Subject deleted successfully!");
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete subject");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, id: null });
    }
  };

  const handleView = (subject) => {
    setViewDetails(subject);
  };

  const resetForm = () => {
    setFormData({
      subjectCode: "",
      subjectName: "",
      departmentId: "",
      semester: "",
      credits: "",
      type: "Theory",
      hoursPerWeek: "",
      internalMarks: 50,
      externalMarks: 100,
      totalMarks: 150,
      isElective: false,
      syllabus: "",
      teacherIds: [],
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

  const getCreditsOptions = () => {
    return [1, 2, 3, 4, 5].map((credit) => (
      <option key={credit} value={credit}>
        {credit} Credit{credit > 1 ? "s" : ""}
      </option>
    ));
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "Theory":
        return "badge-purple";
      case "Lab":
        return "badge-green";
      case "Project":
        return "badge-blue";
      case "Internship":
        return "badge-yellow";
      default:
        return "badge-blue";
    }
  };

  const filteredSubjects = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return subjects.filter((subject) => {
      const matchesSearch =
        !q ||
        subject.subjectName?.toLowerCase().includes(q) ||
        subject.subjectCode?.toLowerCase().includes(q);

      const matchesDept =
        filterDept === "all" || subject.departmentId?._id === filterDept;
      const matchesSem =
        filterSem === "all" || subject.semester === parseInt(filterSem, 10);

      const matchesType =
        filterType === "all" ||
        (filterType === "elective"
          ? !!subject.isElective
          : String(subject.type || "").toLowerCase() === filterType);

      return matchesSearch && matchesDept && matchesSem && matchesType;
    });
  }, [subjects, searchTerm, filterDept, filterSem, filterType]);

  const stats = {
    total: subjects.length,
    theory: subjects.filter((s) => s.type === "Theory").length,
    lab: subjects.filter((s) => s.type === "Lab").length,
    elective: subjects.filter((s) => s.isElective).length,
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
          <h1>Subject Management</h1>
          <p>Manage academic subjects and course curriculum</p>
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
                Add Subject
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
              <p className="stat-title">Total Subjects</p>
              <p className="stat-value">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <BookOpenIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">📚 Across all depts</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Theory Subjects</p>
              <p className="stat-value">{stats.theory}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">📖 Classroom</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Lab Subjects</p>
              <p className="stat-value">{stats.lab}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">🔬 Practical</span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Electives</p>
              <p className="stat-value">{stats.elective}</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
          <div className="stat-trend">
            <span className="trend-up">⭐ Optional</span>
          </div>
        </div>
      </div>

      <AdminSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search subjects by code or name..."
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
                label: `Semester ${s}`,
              })),
            ],
          },
          {
            key: "type",
            label: "Type",
            value: filterType,
            onChange: setFilterType,
            options: [
              { value: "all", label: "All Types" },
              { value: "theory", label: "Theory" },
              { value: "lab", label: "Lab" },
              { value: "elective", label: "Elective" },
            ],
          },
        ]}
        rightText={`${filteredSubjects.length} subjects`}
      />

      {/* Subject Details View Modal */}
      {viewDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 slide-in">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
              <h2 className="text-2xl font-bold flex items-center">
                <BookOpenIcon className="w-6 h-6 text-blue-600 mr-2" />
                Subject Details
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
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
                  Basic Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p>
                    <span className="text-muted">Subject Code:</span>{" "}
                    <span className="font-medium">
                      {viewDetails.subjectCode}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">Subject Name:</span>{" "}
                    <span className="font-medium">
                      {viewDetails.subjectName}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">Department:</span>{" "}
                    {viewDetails.departmentId?.name || "N/A"}
                  </p>
                  <p>
                    <span className="text-muted">Semester:</span>{" "}
                    {viewDetails.semester}
                  </p>
                  <p>
                    <span className="text-muted">Credits:</span>{" "}
                    {viewDetails.credits}
                  </p>
                  <p>
                    <span className="text-muted">Type:</span>
                    <span
                      className={`badge ${getTypeBadge(viewDetails.type)} ml-2`}
                    >
                      {viewDetails.type}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">Hours/Week:</span>{" "}
                    {viewDetails.hoursPerWeek}
                  </p>
                  <p>
                    <span className="text-muted">Elective:</span>{" "}
                    {viewDetails.isElective ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              {/* Marks Distribution */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900 flex items-center">
                  <span className="w-1 h-5 bg-green-600 rounded-full mr-2"></span>
                  Marks Distribution
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <p>
                    <span className="text-muted">Internal Marks:</span>{" "}
                    {viewDetails.internalMarks}
                  </p>
                  <p>
                    <span className="text-muted">External Marks:</span>{" "}
                    {viewDetails.externalMarks}
                  </p>
                  <p>
                    <span className="text-muted">Total Marks:</span>{" "}
                    {viewDetails.totalMarks}
                  </p>
                </div>

                <h3 className="font-semibold text-lg text-gray-900 flex items-center mt-6">
                  <span className="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
                  Assigned Teachers
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  {viewDetails.teachers?.length > 0 ? (
                    viewDetails.teachers.map((teacher, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                          {teacher.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-muted">
                            {teacher.designation}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No teachers assigned</p>
                  )}
                </div>
              </div>

              {/* Syllabus */}
              {viewDetails.syllabus && (
                <div className="col-span-2">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center mb-3">
                    <span className="w-1 h-5 bg-orange-600 rounded-full mr-2"></span>
                    Syllabus
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {viewDetails.syllabus}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="modern-card mb-6 slide-in">
          <h3 className="card-title mb-6">
            {editingId ? "Edit Subject" : "Add New Subject"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="CS301"
                />
                {fieldErrors.subjectCode && (
                  <span className="input-error-message">
                    {fieldErrors.subjectCode}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Database Management Systems"
                />
                {fieldErrors.subjectName && (
                  <span className="input-error-message">
                    {fieldErrors.subjectName}
                  </span>
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
              <div className="form-group">
                <label className="form-label">Credits</label>
                <select
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Credits</option>
                  {getCreditsOptions()}
                </select>
                {fieldErrors.credits && (
                  <span className="input-error-message">
                    {fieldErrors.credits}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Subject Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                >
                  <option value="Theory">Theory</option>
                  <option value="Lab">Lab</option>
                  <option value="Project">Project</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Hours per Week</label>
                <input
                  type="number"
                  name="hoursPerWeek"
                  value={formData.hoursPerWeek}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="6"
                  className="form-input"
                  placeholder="4"
                />
                {fieldErrors.hoursPerWeek && (
                  <span className="input-error-message">
                    {fieldErrors.hoursPerWeek}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Internal Marks</label>
                <input
                  type="number"
                  name="internalMarks"
                  value={formData.internalMarks}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="50"
                />
              </div>
              <div className="form-group">
                <label className="form-label">External Marks</label>
                <input
                  type="number"
                  name="externalMarks"
                  value={formData.externalMarks}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="100"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="150"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="form-label">Syllabus</label>
                <textarea
                  name="syllabus"
                  value={formData.syllabus}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-input"
                  placeholder="Subject syllabus or topics covered..."
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isElective"
                    checked={formData.isElective}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    This is an Elective Subject
                  </span>
                </label>
              </div>

              {/* Teacher Assignment */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="form-label mb-3">Assign Teachers</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {teachers
                    .filter(
                      (t) =>
                        !formData.departmentId ||
                        t.departmentId?._id === formData.departmentId,
                    )
                    .map((teacher) => (
                      <label
                        key={teacher._id}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={formData.teacherIds.includes(teacher._id)}
                          onChange={() => handleTeacherSelection(teacher._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {teacher.name}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn btn-primary">
                <CheckIcon className="w-5 h-5 mr-2" />
                {editingId ? "Update Subject" : "Create Subject"}
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

      {/* Subjects Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Subject Name</th>
              <th>Dept</th>
              <th>Sem</th>
              <th>Credits</th>
              <th>Type</th>
              <th>Hours</th>
              <th>Marks</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubjects.map((subject) => (
              <tr key={subject._id}>
                <td>
                  <span className="font-mono font-medium text-gray-900">
                    {subject.subjectCode}
                  </span>
                </td>
                <td className="font-medium text-gray-900">
                  {subject.subjectName}
                </td>
                <td>
                  <span className="badge badge-blue">
                    {subject.departmentId?.code || "N/A"}
                  </span>
                </td>
                <td>{subject.semester}</td>
                <td>{subject.credits}</td>
                <td>
                  <span className={`badge ${getTypeBadge(subject.type)}`}>
                    {subject.type}
                  </span>
                </td>
                <td>{subject.hoursPerWeek}</td>
                <td>{subject.totalMarks}</td>
                <td>
                  <div className="table-actions">
                    <button
                      onClick={() => handleView(subject)}
                      className="action-btn"
                      title="View Details"
                    >
                      <EyeIcon className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleEdit(subject)}
                      className="action-btn action-btn--edit"
                      title="Edit"
                    >
                      <PencilIcon className="action-icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
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

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="w-12 h-12 mx-auto text-muted mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No subjects found
            </h3>
            <p className="text-muted mt-2">
              {searchTerm || filterDept !== "all" || filterSem !== "all"
                ? "Try adjusting your filters"
                : "Click 'Add Subject' to create one"}
            </p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirm.open}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? This cannot be undone."
        confirmText="Delete"
        danger
        loading={deleting}
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Subjects;
