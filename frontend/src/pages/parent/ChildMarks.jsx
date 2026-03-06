// pages/parent/ChildMarks.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const ChildMarks = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const [selectedSem, setSelectedSem] = useState("3");

  const marksData = [
    {
      semester: 3,
      sgpa: 8.5,
      subjects: [
        {
          code: "CS301",
          name: "DBMS",
          ia: 27,
          lab: null,
          exam: 85,
          total: 112,
          grade: "O",
          gp: 10,
        },
        {
          code: "CS302",
          name: "Data Structures",
          ia: 24.5,
          lab: null,
          exam: 78,
          total: 102.5,
          grade: "A+",
          gp: 9,
        },
        {
          code: "CS303",
          name: "Algorithms",
          ia: 25.5,
          lab: null,
          exam: 82,
          total: 107.5,
          grade: "A",
          gp: 8,
        },
        {
          code: "CS351",
          name: "DBMS Lab",
          ia: null,
          lab: 23,
          exam: null,
          total: 23,
          grade: "O",
          gp: 10,
        },
      ],
    },
    {
      semester: 2,
      sgpa: 8.2,
      subjects: [
        {
          code: "CS201",
          name: "OOP",
          ia: 25.5,
          lab: null,
          exam: 80,
          total: 105.5,
          grade: "A",
          gp: 8,
        },
        {
          code: "CS202",
          name: "Discrete Math",
          ia: 23.5,
          lab: null,
          exam: 75,
          total: 98.5,
          grade: "B+",
          gp: 7,
        },
        {
          code: "CS203",
          name: "Digital Electronics",
          ia: 25.5,
          lab: null,
          exam: 82,
          total: 107.5,
          grade: "A",
          gp: 8,
        },
      ],
    },
  ];

  if (!child) {
    navigate("/parent/dashboard");
    return null;
  }

  const currentData =
    marksData.find((d) => d.semester === parseInt(selectedSem)) || marksData[0];

  const getGradeColor = (grade) => {
    const colors = {
      O: "bg-green-100 text-green-800",
      "A+": "bg-blue-100 text-blue-800",
      A: "bg-indigo-100 text-indigo-800",
      "B+": "bg-yellow-100 text-yellow-800",
      B: "bg-orange-100 text-orange-800",
      C: "bg-purple-100 text-purple-800",
      P: "bg-gray-100 text-gray-800",
      F: "bg-red-100 text-red-800",
    };
    return colors[grade] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {child.name}'s Marks
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {child.usn} • {child.department} • Semester {child.semester}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Select Semester:
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="3">Semester 3</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Semester SGPA</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentData.sgpa}
              </p>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IA Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  GP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.code}
                    </div>
                    <div className="text-xs text-gray-500">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {subject.ia || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {subject.lab || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {subject.exam || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {subject.total}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}
                    >
                      {subject.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {subject.gp}
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

export default ChildMarks;
