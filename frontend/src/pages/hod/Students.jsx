// pages/hod/Students.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(null);
  const [selectedSem, setSelectedSem] = useState("all");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudents();
    fetchDepartment();
  }, []);

  const fetchStudents = async () => {
    try {
      // Mock data
      setStudents([
        {
          _id: "1",
          usn: "1BI21CS001",
          name: "Alice Johnson",
          semester: 3,
          section: "A",
          attendance: 100,
          parentName: "Mr. Robert Johnson",
        },
        {
          _id: "2",
          usn: "1BI21CS002",
          name: "Bob Smith",
          semester: 3,
          section: "A",
          attendance: 82,
          parentName: "Mrs. Sarah Smith",
        },
        {
          _id: "3",
          usn: "1BI21CS003",
          name: "Charlie Brown",
          semester: 3,
          section: "A",
          attendance: 68,
          parentName: "Mr. David Brown",
        },
        {
          _id: "4",
          usn: "1BI21CS004",
          name: "Diana Prince",
          semester: 3,
          section: "B",
          attendance: 92,
          parentName: "Dr. Helen Prince",
        },
        {
          _id: "5",
          usn: "1BI21CS005",
          name: "Eve Adams",
          semester: 3,
          section: "B",
          attendance: 58,
          parentName: "Mr. John Adams",
        },
      ]);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    setDepartment({
      name: "Computer Science",
      code: "CSE",
      totalStudents: 180,
    });
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const filteredStudents =
    selectedSem === "all"
      ? students
      : students.filter((s) => s.semester === parseInt(selectedSem));

  const getSemesterStats = () => {
    const stats = {};
    students.forEach((s) => {
      if (!stats[s.semester]) {
        stats[s.semester] = { total: 0, low: 0 };
      }
      stats[s.semester].total++;
      if (s.attendance < 75) stats[s.semester].low++;
    });
    return stats;
  };

  const semesterStats = getSemesterStats();

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
          <h1 className="text-3xl font-bold text-gray-900">
            Department Students
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {department?.name} ({department?.code}) • Total:{" "}
            {department?.totalStudents} students
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Semester Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Object.entries(semesterStats).map(([sem, data]) => (
            <div key={sem} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600">Semester {sem}</p>
              <p className="text-2xl font-semibold">{data.total} students</p>
              <p className="text-xs text-red-600 mt-1">{data.low} below 75%</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Student List</h2>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  USN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.usn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(student.attendance)}`}
                    >
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.parentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Students;
