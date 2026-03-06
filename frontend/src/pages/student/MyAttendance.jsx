// pages/student/MyAttendance.jsx
import React, { useState } from "react";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const MyAttendance = () => {
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
        {
          code: "CS201",
          name: "Object Oriented Programming",
          total: 15,
          present: 14,
          percentage: 93,
        },
        {
          code: "CS202",
          name: "Discrete Mathematics",
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
    {
      semester: 1,
      subjects: [
        {
          code: "CS101",
          name: "Programming in C",
          total: 15,
          present: 15,
          percentage: 100,
        },
        {
          code: "CS102",
          name: "Mathematics I",
          total: 15,
          present: 14,
          percentage: 93,
        },
        {
          code: "CS103",
          name: "Physics",
          total: 15,
          present: 13,
          percentage: 87,
        },
      ],
    },
  ];

  const currentData =
    attendanceData.find((d) => d.semester === parseInt(selectedSem)) ||
    attendanceData[0];

  const overallAttendance =
    currentData.subjects.reduce((acc, sub) => {
      return acc + (sub.present / sub.total) * 100;
    }, 0) / currentData.subjects.length;

  const getSemesterOptions = () => {
    return attendanceData.map((d) => (
      <option key={d.semester} value={d.semester}>
        Semester {d.semester}
      </option>
    ));
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Attendance
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Semester Selector */}
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
                {getSemesterOptions()}
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Overall Attendance</p>
              <p
                className={`text-2xl font-bold ${getPercentageColor(overallAttendance)}`}
              >
                {overallAttendance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 gap-6">
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

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Total Classes: {subject.total}
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Present: {subject.present}
                  </span>
                </div>
                <div className="flex items-center">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-sm text-gray-600">
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

export default MyAttendance;
