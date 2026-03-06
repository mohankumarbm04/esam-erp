// pages/teacher/Students.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");

  const classes = [
    { id: 1, name: "CS301 - DBMS (Sem 3, Sec A)" },
    { id: 2, name: "CS302 - Data Structures (Sem 3, Sec B)" },
    { id: 3, name: "CS303 - Algorithms (Sem 5, Sec A)" },
    { id: 4, name: "CS351 - DBMS Lab (Sem 3, Sec A)" },
  ];

  const students = [
    {
      id: 1,
      usn: "1BI21CS001",
      name: "Alice Johnson",
      class: "CS301",
      attendance: 100,
      marks: 85,
      parent: "Mr. Robert Johnson",
      phone: "9876543210",
    },
    {
      id: 2,
      usn: "1BI21CS002",
      name: "Bob Smith",
      class: "CS301",
      attendance: 82,
      marks: 78,
      parent: "Mrs. Sarah Smith",
      phone: "9876543211",
    },
    {
      id: 3,
      usn: "1BI21CS003",
      name: "Charlie Brown",
      class: "CS302",
      attendance: 68,
      marks: 65,
      parent: "Mr. David Brown",
      phone: "9876543212",
    },
    {
      id: 4,
      usn: "1BI21CS004",
      name: "Diana Prince",
      class: "CS302",
      attendance: 92,
      marks: 88,
      parent: "Dr. Helen Prince",
      phone: "9876543213",
    },
    {
      id: 5,
      usn: "1BI21CS005",
      name: "Eve Adams",
      class: "CS303",
      attendance: 58,
      marks: 72,
      parent: "Mr. John Adams",
      phone: "9876543214",
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <AcademicCapIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Students
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
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
              Total Students: {filteredStudents.length}
            </div>
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
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avg. Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.usn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(student.attendance)}`}
                    >
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.marks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.parent}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
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
