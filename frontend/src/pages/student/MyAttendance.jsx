// pages/student/MyAttendance.jsx
import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const MyAttendance = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    overall: 0,
    totalClasses: 0,
    present: 0,
    absent: 0,
  });

  useEffect(() => {
    fetchAttendance();
  }, [selectedSem]);

  const fetchAttendance = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      const data = {
        semester: 3,
        subjects: [
          {
            code: "CS301",
            name: "Database Management Systems",
            total: 15,
            present: 15,
            absent: 0,
            percentage: 100,
            details: [
              { date: "2026-03-01", status: "present" },
              { date: "2026-03-02", status: "present" },
              { date: "2026-03-03", status: "present" },
            ],
          },
          {
            code: "CS302",
            name: "Data Structures",
            total: 15,
            present: 13,
            absent: 2,
            percentage: 87,
            details: [
              { date: "2026-03-01", status: "present" },
              { date: "2026-03-02", status: "present" },
              { date: "2026-03-03", status: "absent" },
            ],
          },
          {
            code: "CS303",
            name: "Algorithm Design",
            total: 15,
            present: 14,
            absent: 1,
            percentage: 93,
          },
          {
            code: "CS351",
            name: "DBMS Lab",
            total: 8,
            present: 7,
            absent: 1,
            percentage: 88,
          },
        ],
      };

      setAttendanceData(data.subjects);

      const total = data.subjects.reduce((acc, sub) => acc + sub.total, 0);
      const present = data.subjects.reduce((acc, sub) => acc + sub.present, 0);

      setSummary({
        overall: Math.round((present / total) * 100),
        totalClasses: total,
        present,
        absent: total - present,
      });

      setLoading(false);
    }, 500);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading attendance...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Attendance
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Controls and Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Semester
                </label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getSemesterOptions()}
                </select>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Attendance</p>
                <p
                  className={`text-3xl font-bold ${getPercentageColor(summary.overall)}`}
                >
                  {summary.overall}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-semibold text-green-600">
                  {summary.present}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-semibold text-red-600">
                  {summary.absent}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Classes</p>
                <p className="text-2xl font-semibold">{summary.totalClasses}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Cards */}
        <div className="grid grid-cols-1 gap-6">
          {attendanceData.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold">{subject.name}</h3>
                      <span className="ml-3 text-sm text-gray-500">
                        {subject.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Total Classes</p>
                        <p className="text-lg font-semibold">{subject.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Present</p>
                        <p className="text-lg font-semibold text-green-600">
                          {subject.present}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Absent</p>
                        <p className="text-lg font-semibold text-red-600">
                          {subject.absent}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Attendance %</p>
                        <p
                          className={`text-lg font-semibold ${getPercentageColor(subject.percentage)}`}
                        >
                          {subject.percentage}%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        subject.percentage >= 75
                          ? "bg-green-100 text-green-800"
                          : subject.percentage >= 65
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subject.percentage >= 75
                        ? "Eligible"
                        : subject.percentage >= 65
                          ? "At Risk"
                          : "Not Eligible"}
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

                {/* Recent Attendance Details */}
                {subject.details && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Recent Records
                    </p>
                    <div className="flex space-x-2">
                      {subject.details.map((record, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <span className="text-gray-500">{record.date}:</span>
                          {record.status === "present" ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 ml-1" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-500 ml-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Attendance Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                ≥75% - Eligible for exams
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                65-74% - At risk, need attention
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                &lt;65% - Not eligible, may be detained
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAttendance;
