// pages/parent/ChildAttendance.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon, // ✅ Added this import
} from "@heroicons/react/24/outline";

const ChildAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const [selectedSem, setSelectedSem] = useState("3");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    overall: 0,
    totalClasses: 0,
    present: 0,
    absent: 0,
    bySubject: {},
  });

  useEffect(() => {
    if (!child) {
      navigate("/parent/dashboard");
      return;
    }
    fetchAttendance();
  }, [child, selectedSem]); // ✅ Fixed: Added dependency array

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
            teacher: "Dr. Rajesh Kumar",
            details: [
              { date: "2026-03-01", status: "present", time: "09:00 AM" },
              { date: "2026-03-02", status: "present", time: "09:05 AM" },
              { date: "2026-03-03", status: "present", time: "08:55 AM" },
              { date: "2026-03-04", status: "present", time: "09:02 AM" },
              { date: "2026-03-05", status: "present", time: "09:00 AM" },
            ],
          },
          {
            code: "CS302",
            name: "Data Structures",
            total: 15,
            present: 13,
            absent: 2,
            percentage: 87,
            teacher: "Prof. Sunita Sharma",
            details: [
              { date: "2026-03-01", status: "present", time: "10:15 AM" },
              { date: "2026-03-02", status: "present", time: "10:20 AM" },
              { date: "2026-03-03", status: "absent", time: "-" },
              { date: "2026-03-04", status: "present", time: "10:10 AM" },
              { date: "2026-03-05", status: "absent", time: "-" },
            ],
          },
          {
            code: "CS303",
            name: "Algorithm Design",
            total: 15,
            present: 14,
            absent: 1,
            percentage: 93,
            teacher: "Dr. Anil Kumar",
            details: [
              { date: "2026-03-01", status: "present", time: "11:30 AM" },
              { date: "2026-03-02", status: "present", time: "11:35 AM" },
              { date: "2026-03-03", status: "present", time: "11:28 AM" },
              { date: "2026-03-04", status: "present", time: "11:32 AM" },
              { date: "2026-03-05", status: "absent", time: "-" },
            ],
          },
          {
            code: "CS351",
            name: "DBMS Lab",
            total: 8,
            present: 7,
            absent: 1,
            percentage: 88,
            teacher: "Dr. Rajesh Kumar",
            details: [
              { date: "2026-03-02", status: "present", time: "02:00 PM" },
              { date: "2026-03-09", status: "absent", time: "-" },
              { date: "2026-03-16", status: "present", time: "02:05 PM" },
            ],
          },
        ],
      };

      setAttendanceData(data.subjects);

      const total = data.subjects.reduce((acc, sub) => acc + sub.total, 0);
      const present = data.subjects.reduce((acc, sub) => acc + sub.present, 0);

      const bySubject = {};
      data.subjects.forEach((sub) => {
        bySubject[sub.code] = sub.percentage;
      });

      setSummary({
        overall: Math.round((present / total) * 100),
        totalClasses: total,
        present,
        absent: total - present,
        bySubject,
      });

      setLoading(false);
    }, 500);
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status) => {
    return status === "present"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const downloadReport = () => {
    alert("Downloading attendance report...");
  };

  if (!child) {
    return null;
  }

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
          <div className="flex items-center">
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CalendarIcon className="h-8 w-8 mr-3 text-blue-500" />
                {child.name}'s Attendance
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {child.usn} • {child.department} • Semester {child.semester} •
                Section {child.section}
              </p>
            </div>
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Download Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Controls and Overall Stats */}
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

        {/* Subject-wise Attendance Cards */}
        <div className="grid grid-cols-1 gap-6">
          {attendanceData.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Subject Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{subject.name}</h3>
                    <p className="text-sm text-gray-600">
                      {subject.code} • {subject.teacher}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-4">
                    <div
                      className={`px-4 py-2 rounded-lg ${getPercentageColor(subject.percentage)}`}
                    >
                      <span className="font-bold">{subject.percentage}%</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        subject.percentage >= 75
                          ? "bg-green-100 text-green-800"
                          : subject.percentage >= 65
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {subject.percentage >= 75
                        ? "Good Standing"
                        : subject.percentage >= 65
                          ? "At Risk"
                          : "Critical"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-4 border-b">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Attendance Progress
                  </span>
                  <span className="text-sm font-medium">
                    {subject.present}/{subject.total} classes
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
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
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Attendance Records
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {subject.details.map((record, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        record.status === "present"
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {record.date}
                        </span>
                        {record.status === "present" ? (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p
                        className={`text-sm font-medium mt-1 ${
                          record.status === "present"
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {record.status === "present" ? "Present" : "Absent"}
                      </p>
                      {record.status === "present" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {record.time}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* View All Link */}
              <div className="px-6 py-3 bg-gray-50 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Complete Attendance History →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary and Recommendations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Required Attendance
                </span>
                <span className="text-sm font-semibold">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Overall</span>
                <span
                  className={`text-sm font-semibold ${getPercentageColor(summary.overall)}`}
                >
                  {summary.overall}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Classes Needed to Maintain 75%
                </span>
                <span className="text-sm font-semibold">
                  {Math.max(
                    0,
                    Math.ceil(
                      (0.75 * summary.totalClasses - summary.present) / 0.25,
                    ),
                  )}
                </span>
              </div>
            </div>

            {summary.overall < 75 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">⚠️ Attention Required:</span>{" "}
                  Overall attendance is below 75%. Please ensure regular
                  attendance.
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <div className="space-y-3">
              {attendanceData
                .filter((sub) => sub.percentage < 75)
                .map((sub, idx) => (
                  <div key={idx} className="flex items-start">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{sub.name}:</span> Need to
                      attend{" "}
                      {Math.ceil((0.75 * sub.total - sub.present) / 0.25)} more
                      classes to reach 75%
                    </p>
                  </div>
                ))}
              {attendanceData.filter((sub) => sub.percentage < 75).length ===
                0 && (
                <p className="text-sm text-green-600">
                  ✓ All subjects meet the attendance requirement!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">
                ≥75% - Good Standing
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">65-74% - At Risk</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">&lt;65% - Critical</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChildAttendance;
