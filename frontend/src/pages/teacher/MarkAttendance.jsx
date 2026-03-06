// pages/teacher/MarkAttendance.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowLeftIcon,
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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock data for classes
  const classes = [
    {
      id: 1,
      subject: "Database Management Systems",
      code: "CS301",
      semester: 3,
      section: "A",
      students: 25,
    },
    {
      id: 2,
      subject: "Data Structures",
      code: "CS302",
      semester: 3,
      section: "B",
      students: 24,
    },
    {
      id: 3,
      subject: "Algorithm Design",
      code: "CS303",
      semester: 5,
      section: "A",
      students: 26,
    },
    {
      id: 4,
      subject: "DBMS Lab",
      code: "CS351",
      semester: 3,
      section: "A",
      students: 25,
    },
  ];

  useEffect(() => {
    if (!selectedClass) {
      // If no class selected, show class selector
      return;
    }
    fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    // Mock student data
    setTimeout(() => {
      const mockStudents = [
        {
          id: 1,
          usn: "1BI21CS001",
          name: "Alice Johnson",
          attendance: "present",
        },
        { id: 2, usn: "1BI21CS002", name: "Bob Smith", attendance: "present" },
        {
          id: 3,
          usn: "1BI21CS003",
          name: "Charlie Brown",
          attendance: "absent",
        },
        {
          id: 4,
          usn: "1BI21CS004",
          name: "Diana Prince",
          attendance: "present",
        },
        { id: 5, usn: "1BI21CS005", name: "Eve Adams", attendance: "absent" },
        {
          id: 6,
          usn: "1BI21CS006",
          name: "Frank Castle",
          attendance: "present",
        },
        {
          id: 7,
          usn: "1BI21CS007",
          name: "Grace Hopper",
          attendance: "present",
        },
        {
          id: 8,
          usn: "1BI21CS008",
          name: "Henry Cavill",
          attendance: "absent",
        },
      ];
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  };

  const handleAttendanceChange = (studentId, status) => {
    setStudents(
      students.map((s) =>
        s.id === studentId ? { ...s, attendance: status } : s,
      ),
    );
  };

  const markAllPresent = () => {
    setStudents(students.map((s) => ({ ...s, attendance: "present" })));
  };

  const markAllAbsent = () => {
    setStudents(students.map((s) => ({ ...s, attendance: "absent" })));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      alert("Attendance marked successfully!");
      navigate("/teacher/dashboard");
    }, 1500);
  };

  const getStats = () => {
    const total = students.length;
    const present = students.filter((s) => s.attendance === "present").length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, percentage };
  };

  const stats = getStats();

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <CalendarIcon className="h-8 w-8 mr-3 text-blue-500" />
              Select Class for Attendance
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-lg font-semibold">{cls.subject}</h3>
                <p className="text-sm text-gray-600">
                  {cls.code} • Semester {cls.semester} • Section {cls.section}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {cls.students} students
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedClass(null)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mark Attendance
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedClass.subject} ({selectedClass.code}) • Semester{" "}
                {selectedClass.semester} • Section {selectedClass.section}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Date Selector and Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={markAllPresent}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  Mark All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-sm text-blue-600">Percentage</p>
                <p className="text-xl font-semibold text-blue-600">
                  {stats.percentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading students...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    USN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Attendance Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.usn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.attendance === "present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.attendance === "present"
                          ? "Present"
                          : "Absent"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "present")
                        }
                        className={`mr-2 p-1 rounded ${
                          student.attendance === "present"
                            ? "text-green-600 bg-green-100"
                            : "text-gray-400 hover:text-green-600"
                        }`}
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
                        className={`p-1 rounded ${
                          student.attendance === "absent"
                            ? "text-red-600 bg-red-100"
                            : "text-gray-400 hover:text-red-600"
                        }`}
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default MarkAttendance;
