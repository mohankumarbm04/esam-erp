// pages/parent/ChildAttendance.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const ChildAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const [selectedSem, setSelectedSem] = useState("3");

  const attendanceData = [
    {
      semester: 3,
      subjects: [
        {
          code: "CS301",
          name: "Database Management Systems",
          total: 15,
          present: 15,
          percentage: 100,
        },
        {
          code: "CS302",
          name: "Data Structures",
          total: 15,
          present: 13,
          percentage: 87,
        },
        {
          code: "CS303",
          name: "Algorithm Design",
          total: 15,
          present: 14,
          percentage: 93,
        },
        {
          code: "CS351",
          name: "DBMS Lab",
          total: 8,
          present: 7,
          percentage: 88,
        },
      ],
    },
    {
      semester: 2,
      subjects: [
        { code: "CS201", name: "OOP", total: 15, present: 14, percentage: 93 },
        {
          code: "CS202",
          name: "Discrete Math",
          total: 15,
          present: 12,
          percentage: 80,
        },
        {
          code: "CS203",
          name: "Digital Electronics",
          total: 15,
          present: 15,
          percentage: 100,
        },
      ],
    },
  ];

  if (!child) {
    navigate("/parent/dashboard");
    return null;
  }

  const currentData =
    attendanceData.find((d) => d.semester === parseInt(selectedSem)) ||
    attendanceData[0];

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
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
                {child.name}'s Attendance
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
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p
                className={`text-2xl font-bold ${getPercentageColor(child.attendance)}`}
              >
                {child.attendance}%
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="space-y-4">
          {currentData.subjects.map((subject, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPercentageColor(subject.percentage)}`}
                >
                  {subject.percentage}%
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm">Total: {subject.total}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm">Present: {subject.present}</span>
                </div>
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm">
                    Absent: {subject.total - subject.present}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      subject.percentage >= 75
                        ? "bg-green-500"
                        : subject.percentage >= 65
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChildAttendance;
