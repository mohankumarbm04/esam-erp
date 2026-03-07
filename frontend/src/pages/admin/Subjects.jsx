// pages/admin/Subjects.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  XMarkIcon,
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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/departments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

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

    try {
      if (editingId) {
        // Update existing subject
        await axios.put(
          `http://localhost:5000/api/subjects/${editingId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSuccess("Subject updated successfully!");
      } else {
        // Create new subject
        await axios.post("http://localhost:5000/api/subjects", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Subject created successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchSubjects();
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
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Subject deleted successfully!");
      fetchSubjects();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete subject");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3 text-blue-500" />
            Subject Management
          </h1>
          <button
            onClick={() => {
              if (showForm) {
                cancelForm();
              } else {
                setShowForm(true);
                setViewDetails(null);
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
          >
            {showForm ? (
              <>
                <XMarkIcon className="h-5 w-5 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Subject
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Subject Details View Modal */}
        {viewDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Subject Details</h2>
                <button
                  onClick={closeView}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Subject Code:</span>{" "}
                      {viewDetails.subjectCode}
                    </p>
                    <p>
                      <span className="text-gray-600">Subject Name:</span>{" "}
                      {viewDetails.subjectName}
                    </p>
                    <p>
                      <span className="text-gray-600">Department:</span>{" "}
                      {viewDetails.departmentId?.name || "N/A"}
                    </p>
                    <p>
                      <span className="text-gray-600">Semester:</span>{" "}
                      {viewDetails.semester}
                    </p>
                    <p>
                      <span className="text-gray-600">Credits:</span>{" "}
                      {viewDetails.credits}
                    </p>
                    <p>
                      <span className="text-gray-600">Type:</span>{" "}
                      {viewDetails.type}
                    </p>
                    <p>
                      <span className="text-gray-600">Hours/Week:</span>{" "}
                      {viewDetails.hoursPerWeek}
                    </p>
                    <p>
                      <span className="text-gray-600">Elective:</span>{" "}
                      {viewDetails.isElective ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">
                    Marks Distribution
                  </h3>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Internal Marks:</span>{" "}
                      {viewDetails.internalMarks}
                    </p>
                    <p>
                      <span className="text-gray-600">External Marks:</span>{" "}
                      {viewDetails.externalMarks}
                    </p>
                    <p>
                      <span className="text-gray-600">Total Marks:</span>{" "}
                      {viewDetails.totalMarks}
                    </p>
                  </div>

                  <h3 className="font-semibold text-lg mb-3 mt-6">
                    Assigned Teachers
                  </h3>
                  <div className="space-y-2">
                    {viewDetails.teachers?.length > 0 ? (
                      viewDetails.teachers.map((teacher, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded">
                          <p className="font-medium">{teacher.name}</p>
                          <p className="text-xs text-gray-500">
                            {teacher.email} • {teacher.designation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No teachers assigned</p>
                    )}
                  </div>
                </div>

                {viewDetails.syllabus && (
                  <div className="col-span-2">
                    <h3 className="font-semibold text-lg mb-3">Syllabus</h3>
                    <p className="text-gray-700 whitespace-pre-line">
                      {viewDetails.syllabus}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Subject" : "Add New Subject"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    name="subjectCode"
                    value={formData.subjectCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="CS301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    name="subjectName"
                    value={formData.subjectName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Database Management Systems"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Semester</option>
                    {getSemesterOptions()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits
                  </label>
                  <select
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Credits</option>
                    {getCreditsOptions()}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                    <option value="Project">Project</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours per Week
                  </label>
                  <input
                    type="number"
                    name="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Marks
                  </label>
                  <input
                    type="number"
                    name="internalMarks"
                    value={formData.internalMarks}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    External Marks
                  </label>
                  <input
                    type="number"
                    name="externalMarks"
                    value={formData.externalMarks}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="150"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Syllabus
                  </label>
                  <textarea
                    name="syllabus"
                    value={formData.syllabus}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Subject syllabus or topics covered..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isElective"
                      checked={formData.isElective}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      This is an Elective Subject
                    </span>
                  </label>
                </div>

                {/* Teacher Assignment */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Teachers
                  </label>
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
                          className="flex items-center p-2 border rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={formData.teacherIds.includes(teacher._id)}
                            onChange={() => handleTeacherSelection(teacher._id)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {teacher.name}
                          </span>
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  {editingId ? "Update Subject" : "Create Subject"}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Subjects Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dept
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Sem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.subjectCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.subjectName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.departmentId?.code || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.credits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.hoursPerWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleView(subject)}
                      className="text-green-600 hover:text-green-900 mr-2"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(subject)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No subjects found. Click "Add Subject" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Subjects;
