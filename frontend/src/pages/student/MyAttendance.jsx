// pages/student/MyAttendance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const MyAttendance = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [attendanceData, setAttendanceData] = useState([]);
  const [bySubject, setBySubject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    overall: 0,
    totalClasses: 0,
    present: 0,
    absent: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttendance();
  }, [selectedSem]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/students/attendance?semester=${selectedSem}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setAttendanceData(response.data.attendance || []);
        setBySubject(response.data.bySubject || []);

        // Calculate summary
        const total = response.data.attendance?.length || 0;
        const present =
          response.data.attendance?.filter((a) => a.status === "present")
            .length || 0;
        const absent = total - present;

        setSummary({
          overall: total > 0 ? Math.round((present / total) * 100) : 0,
          totalClasses: total,
          present,
          absent,
        });
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setError("Failed to load attendance data");

      // Mock data for development
      const mockBySubject = [
        {
          subject: {
            code: "CS301",
            name: "Database Management Systems",
            credits: 4,
          },
          total: 15,
          present: 15,
          absent: 0,
          percentage: 100,
        },
        {
          subject: { code: "CS302", name: "Data Structures", credits: 4 },
          total: 15,
          present: 13,
          absent: 2,
          percentage: 87,
        },
        {
          subject: { code: "CS303", name: "Algorithm Design", credits: 4 },
          total: 15,
          present: 14,
          absent: 1,
          percentage: 93,
        },
        {
          subject: { code: "CS351", name: "DBMS Lab", credits: 2 },
          total: 8,
          present: 7,
          absent: 1,
          percentage: 88,
        },
      ];

      const mockAttendance = [
        { date: "2026-03-01", status: "present", subjectId: { code: "CS301" } },
        { date: "2026-03-02", status: "present", subjectId: { code: "CS301" } },
        { date: "2026-03-03", status: "present", subjectId: { code: "CS301" } },
        { date: "2026-03-01", status: "present", subjectId: { code: "CS302" } },
        { date: "2026-03-02", status: "absent", subjectId: { code: "CS302" } },
      ];

      setBySubject(mockBySubject);
      setAttendanceData(mockAttendance);

      const total = mockBySubject.reduce((acc, sub) => acc + sub.total, 0);
      const present = mockBySubject.reduce((acc, sub) => acc + sub.present, 0);

      setSummary({
        overall: Math.round((present / total) * 100),
        totalClasses: total,
        present,
        absent: total - present,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusIcon = (status) => {
    return status === "present" ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    );
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const handleDownloadReport = () => {
    alert("Downloading attendance report...");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">
              My Attendance
            </h1>
            <button
              onClick={handleDownloadReport}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls and Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
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
                <p className="text-2xl font-semibold text-gray-700">
                  {summary.totalClasses}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Attendance Cards */}
        <div className="grid grid-cols-1 gap-6">
          {bySubject.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow overflow-hidden border border-gray-100"
            >
              {/* Subject Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {subject.subject?.name || subject.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {subject.subject?.code || subject.code} •{" "}
                      {subject.subject?.credits || subject.credits} Credits
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
              <div className="px-6 py-4 border-b border-gray-100">
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

              {/* Recent Attendance Records */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Recent Records
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {attendanceData
                    .filter(
                      (a) =>
                        a.subjectId?.code === subject.subject?.code ||
                        a.subjectId?.code === subject.code,
                    )
                    .slice(0, 5)
                    .map((record, idx) => (
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
                            {new Date(record.date).toLocaleDateString()}
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
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary and Recommendations */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Summary */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Attendance Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Required Attendance
                </span>
                <span className="text-sm font-semibold text-gray-900">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Current</span>
                <span
                  className={`text-sm font-semibold ${getPercentageColor(summary.overall)}`}
                >
                  {summary.overall}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Classes to Reach 75%
                </span>
                <span className="text-sm font-semibold text-blue-600">
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
                  Your overall attendance is below 75%. Please ensure regular
                  attendance.
                </p>
              </div>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Subject-wise Status
            </h3>
            <div className="space-y-3">
              {bySubject
                .filter((sub) => sub.percentage < 75)
                .map((sub, idx) => (
                  <div key={idx} className="flex items-start">
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${
                        sub.percentage >= 65 ? "bg-yellow-500" : "bg-red-500"
                      } mr-3`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">
                          {sub.subject?.name || sub.name}:
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Need to attend{" "}
                        {Math.ceil((0.75 * sub.total - sub.present) / 0.25)}{" "}
                        more classes to reach 75%
                      </p>
                    </div>
                  </div>
                ))}

              {bySubject.filter((sub) => sub.percentage < 75).length === 0 && (
                <p className="text-sm text-green-600">
                  ✓ All subjects meet the attendance requirement!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-gray-100">
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

export default MyAttendance;
