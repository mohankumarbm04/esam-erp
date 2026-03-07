// pages/teacher/Students.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const classes = [
    { id: "CS301", name: "Database Management Systems (Sem 3, Sec A)" },
    { id: "CS302", name: "Data Structures (Sem 3, Sec B)" },
    { id: "CS303", name: "Algorithm Design (Sem 5, Sec A)" },
    { id: "CS351", name: "DBMS Lab (Sem 3, Sec A)" },
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    // Mock data
    setStudents([
      {
        id: 1,
        usn: "1BI21CS001",
        name: "Alice Johnson",
        class: "CS301",
        attendance: 100,
        marks: 85,
        internalMarks: [28, 26, 27],
        parent: "Mr. Robert Johnson",
        email: "alice.j@student.edu",
        phone: "9876543210",
        semester: 3,
        section: "A",
      },
      {
        id: 2,
        usn: "1BI21CS002",
        name: "Bob Smith",
        class: "CS301",
        attendance: 82,
        marks: 78,
        internalMarks: [24, 25, 23],
        parent: "Mrs. Sarah Smith",
        email: "bob.s@student.edu",
        phone: "9876543211",
        semester: 3,
        section: "A",
      },
      {
        id: 3,
        usn: "1BI21CS003",
        name: "Charlie Brown",
        class: "CS302",
        attendance: 68,
        marks: 65,
        internalMarks: [22, 21, 23],
        parent: "Mr. David Brown",
        email: "charlie.b@student.edu",
        phone: "9876543212",
        semester: 3,
        section: "B",
      },
      {
        id: 4,
        usn: "1BI21CS004",
        name: "Diana Prince",
        class: "CS302",
        attendance: 92,
        marks: 88,
        internalMarks: [29, 28, 27],
        parent: "Dr. Helen Prince",
        email: "diana.p@student.edu",
        phone: "9876543213",
        semester: 3,
        section: "B",
      },
      {
        id: 5,
        usn: "1BI21CS005",
        name: "Eve Adams",
        class: "CS303",
        attendance: 58,
        marks: 72,
        internalMarks: [18, 19, 20],
        parent: "Mr. John Adams",
        email: "eve.a@student.edu",
        phone: "9876543214",
        semester: 5,
        section: "A",
      },
    ]);
    setLoading(false);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.usn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getPerformanceBadge = (marks) => {
    if (marks >= 85) return "bg-green-100 text-green-800";
    if (marks >= 70) return "bg-blue-100 text-blue-800";
    if (marks >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading students...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <UserGroupIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Students
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-semibold">{students.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Above 75% Attendance</p>
            <p className="text-2xl font-semibold text-green-600">
              {students.filter((s) => s.attendance >= 75).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Below 65% Attendance</p>
            <p className="text-2xl font-semibold text-red-600">
              {students.filter((s) => s.attendance < 65).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Average Marks</p>
            <p className="text-2xl font-semibold text-blue-600">
              {Math.round(
                students.reduce((acc, s) => acc + s.marks, 0) / students.length,
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or USN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-right text-sm text-gray-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
            >
              {/* Header with attendance color */}
              <div
                className={`h-2 ${student.attendance >= 75 ? "bg-green-500" : student.attendance >= 65 ? "bg-yellow-500" : "bg-red-500"}`}
              />

              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.usn}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceBadge(student.marks)}`}
                  >
                    {student.marks}%
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="h-4 w-4 mr-2 text-gray-400" />
                    Semester {student.semester} • Section {student.section}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ChartBarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <span
                      className={`font-medium ${getAttendanceColor(student.attendance)} px-2 py-0.5 rounded`}
                    >
                      {student.attendance}% Attendance
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {student.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {student.phone}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Parent:</span>{" "}
                    {student.parent}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Internal Marks: IA1: {student.internalMarks[0]}, IA2:{" "}
                    {student.internalMarks[1]}, IA3: {student.internalMarks[2]}
                  </p>
                </div>

                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate("/teacher/attendance")}
                    className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100"
                  >
                    View Attendance
                  </button>
                  <button
                    onClick={() => navigate("/teacher/marks")}
                    className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-100"
                  >
                    Enter Marks
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No students found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Students;
