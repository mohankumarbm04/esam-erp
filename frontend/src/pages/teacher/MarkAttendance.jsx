// pages/teacher/MarkAttendance.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const MarkAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(
    location.state?.class || null,
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const classes = [];

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    setStudents([]);
    setLoading(false);
  };

  const filterAndSortStudents = useCallback(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.usn.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, sortOrder]);

  useEffect(() => {
    filterAndSortStudents();
  }, [filterAndSortStudents]);

  const handleAttendanceChange = (studentId, status) => {
    const updatedStudents = students.map((s) =>
      s.id === studentId ? { ...s, status } : s,
    );
    setStudents(updatedStudents);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const newStatus = !selectAll ? "present" : "absent";
    const updatedStudents = filteredStudents.map((s) => ({
      ...s,
      status: newStatus,
    }));

    // Update only filtered students, preserve others
    const otherStudents = students.filter(
      (s) => !filteredStudents.find((fs) => fs.id === s.id),
    );
    setStudents([...otherStudents, ...updatedStudents]);
    setSelectAll(!selectAll);
  };

  const markAllPresent = () => {
    const updatedStudents = students.map((s) => ({ ...s, status: "present" }));
    setStudents(updatedStudents);
    setSelectAll(true);
  };

  const markAllAbsent = () => {
    const updatedStudents = students.map((s) => ({ ...s, status: "absent" }));
    setStudents(updatedStudents);
    setSelectAll(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // TODO: send attendance to backend when endpoint is available
      navigate("/teacher/dashboard");
    } finally {
      setSubmitting(false);
    }
  };

  const getStats = () => {
    const total = students.length;
    const present = students.filter((s) => s.status === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  };

  const stats = getStats();

  const ClassSelector = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="modern-dashboard">
        <div className="modern-header-clean">
          <div>
            <h1>Mark Attendance</h1>
            <p className="text-muted mt-1">Select a class to mark attendance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className="modern-card hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {cls.subject}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {cls.code} • Semester {cls.semester} • Section {cls.section}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span className="text-sm">{cls.students} students</span>
                </div>
                <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition">
                  Select →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!selectedClass) {
    return <ClassSelector />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="modern-dashboard">
        {/* Header */}
        <div className="modern-header-clean">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedClass(null)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1>Mark Attendance</h1>
              <p className="flex items-center gap-2 mt-1">
                <span className="font-medium text-gray-900">
                  {selectedClass.subject}
                </span>
                <span className="badge badge-blue">{selectedClass.code}</span>
                <span className="text-muted">
                  Sem {selectedClass.semester} • Sec {selectedClass.section}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Date & Controls */}
        <div className="modern-card mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-muted" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="form-input py-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllPresent}
                  className="btn btn-success py-2"
                >
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  All Present
                </button>
                <button onClick={markAllAbsent} className="btn btn-danger py-2">
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  All Absent
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-muted">Total</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-600">Present</p>
                <p className="text-xl font-semibold text-green-600">
                  {stats.present}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-red-600">Absent</p>
                <p className="text-xl font-semibold text-red-600">
                  {stats.absent}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted">%</p>
                <p className="text-xl font-semibold text-blue-600">
                  {stats.percentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="btn btn-secondary"
              >
                Sort Name
                {sortOrder === "asc" ? (
                  <ChevronUpIcon className="w-4 h-4 ml-2" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 ml-2" />
                )}
              </button>
              <button
                onClick={handleSelectAll}
                className={`btn ${selectAll ? "btn-danger" : "btn-success"}`}
              >
                {selectAll ? "Clear All" : "Select All Present"}
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="modern-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Student List</h3>
            <p className="text-sm text-muted">
              {filteredStudents.length} students
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className={`p-4 rounded-xl transition-all ${
                    student.status === "present"
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          student.status === "present"
                            ? "bg-green-200 text-green-700"
                            : "bg-red-200 text-red-700"
                        }`}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-muted">{student.usn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "present")
                        }
                        className={`p-2 rounded-lg transition ${
                          student.status === "present"
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-green-100"
                        }`}
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
                        className={`p-2 rounded-lg transition ${
                          student.status === "absent"
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-600 hover:bg-red-100"
                        }`}
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-12 h-12 mx-auto text-muted mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">
                    No students found
                  </h3>
                  <p className="text-muted mt-2">Try adjusting your search</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setSelectedClass(null)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Submit Attendance
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <span className="text-lg">📊</span>
            Summary: {stats.present} present, {stats.absent} absent (
            {stats.percentage}% attendance)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
