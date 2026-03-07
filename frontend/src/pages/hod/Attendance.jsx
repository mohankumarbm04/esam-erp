// pages/hod/Attendance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
    lowAttendance: 0,
  });
  const [summary, setSummary] = useState({
    perSubject: [],
    perSemester: {},
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
    fetchAttendanceSummary();
  }, []);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(
        "https://esam-erp.onrender.com/api/hod/department",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setDepartment(response.data.department);
    } catch (error) {
      console.error("Error fetching department:", error);
    }
  };

  const fetchAttendanceSummary = async () => {
    setLoading(true);
    try {
      // This would be replaced with real API call
      // Mock data for demonstration
      setTimeout(() => {
        const mockData = [
          {
            usn: "1BI21CS001",
            name: "Alice Johnson",
            semester: 3,
            section: "A",
            attendance: 100,
            status: "good",
          },
          {
            usn: "1BI21CS002",
            name: "Bob Smith",
            semester: 3,
            section: "A",
            attendance: 82,
            status: "good",
          },
          {
            usn: "1BI21CS003",
            name: "Charlie Brown",
            semester: 3,
            section: "A",
            attendance: 68,
            status: "warning",
          },
          {
            usn: "1BI21CS004",
            name: "Diana Prince",
            semester: 3,
            section: "B",
            attendance: 92,
            status: "good",
          },
          {
            usn: "1BI21CS005",
            name: "Eve Adams",
            semester: 3,
            section: "B",
            attendance: 58,
            status: "danger",
          },
          {
            usn: "1BI21CS006",
            name: "Frank Castle",
            semester: 3,
            section: "B",
            attendance: 75,
            status: "good",
          },
          {
            usn: "1BI21CS007",
            name: "Grace Hopper",
            semester: 4,
            section: "A",
            attendance: 95,
            status: "good",
          },
          {
            usn: "1BI21CS008",
            name: "Henry Cavill",
            semester: 4,
            section: "A",
            attendance: 45,
            status: "danger",
          },
        ];

        setAttendanceData(mockData);

        const total = mockData.length;
        const present = mockData.filter((d) => d.attendance >= 75).length;
        const lowAttendance = mockData.filter((d) => d.attendance < 75).length;

        setStats({
          total,
          present,
          absent: total - present,
          percentage: Math.round((present / total) * 100),
          lowAttendance,
        });

        // Per semester summary
        const perSemester = {};
        mockData.forEach((s) => {
          perSemester[s.semester] = (perSemester[s.semester] || 0) + 1;
        });
        setSummary({ perSemester });

        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  const fetchAttendanceByDate = async () => {
    setLoading(true);
    try {
      // This would call your API with date filter
      // Mock implementation
      setTimeout(() => {
        const mockData = [
          {
            usn: "1BI21CS001",
            name: "Alice Johnson",
            status: "present",
            time: "09:05 AM",
          },
          {
            usn: "1BI21CS002",
            name: "Bob Smith",
            status: "present",
            time: "09:00 AM",
          },
          {
            usn: "1BI21CS003",
            name: "Charlie Brown",
            status: "absent",
            time: "-",
          },
          {
            usn: "1BI21CS004",
            name: "Diana Prince",
            status: "present",
            time: "08:55 AM",
          },
          { usn: "1BI21CS005", name: "Eve Adams", status: "absent", time: "-" },
        ];
        setAttendanceData(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "absent":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
            Attendance Overview
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {department?.name} ({department?.code}) • Overall Attendance:{" "}
            {stats.percentage}%
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.total}
            icon={UserGroupIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Above 75%"
            value={stats.present}
            icon={CheckCircleIcon}
            color="bg-green-500"
            subtitle={`${stats.percentage}% of total`}
          />
          <StatCard
            title="Below 75%"
            value={stats.lowAttendance}
            icon={ExclamationTriangleIcon}
            color="bg-yellow-500"
            subtitle="Need attention"
          />
          <StatCard
            title="Below 65%"
            value={stats.absent}
            icon={XCircleIcon}
            color="bg-red-500"
            subtitle="Risk of detention"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAttendanceByDate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Daily Attendance
              </button>
            </div>
            <div className="flex items-end justify-end">
              <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center">
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Semester-wise Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(summary.perSemester).map(([sem, count]) => (
            <div key={sem} className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">Semester {sem}</p>
              <p className="text-xl font-semibold">{count} students</p>
            </div>
          ))}
        </div>

        {/* Attendance Alert */}
        {stats.lowAttendance > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Warning!</span>{" "}
                  {stats.lowAttendance} students have attendance below 75%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Attendance Details</h2>
          </div>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                attendanceData.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.usn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.semester || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.section || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.attendance ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(student.attendance)}`}
                        >
                          {student.attendance}%
                        </span>
                      ) : (
                        getStatusIcon(student.status)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status === "present" && (
                        <span className="flex items-center text-green-600">
                          <CheckCircleIcon className="h-5 w-5 mr-1" />
                          Present
                        </span>
                      )}
                      {student.status === "absent" && (
                        <span className="flex items-center text-red-600">
                          <XCircleIcon className="h-5 w-5 mr-1" />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Attendance;
