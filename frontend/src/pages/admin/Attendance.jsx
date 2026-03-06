// pages/admin/Attendance.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  UserGroupIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    above75: 0,
    below75: 0,
    below65: 0,
    todayPresent: 0,
    todayAbsent: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchTodayAttendance();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/departments",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchTodayAttendance = async () => {
    // This would come from your API
    setStats({
      totalStudents: 45,
      above75: 38,
      below75: 7,
      below65: 3,
      todayPresent: 42,
      todayAbsent: 3,
    });
  };

  const fetchAttendanceByDept = async () => {
    if (!selectedDept) return;

    setLoading(true);
    try {
      // This would come from your API
      // Simulated data for demonstration
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
      ];
      setAttendanceData(mockData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
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

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600 bg-green-100";
    if (percentage >= 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "good":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case "danger":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
            Attendance Overview
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={UserGroupIcon}
            color="bg-blue-500"
          />
          <StatCard
            title="Above 75%"
            value={stats.above75}
            icon={CheckCircleIcon}
            color="bg-green-500"
            subtitle={`${Math.round((stats.above75 / stats.totalStudents) * 100)}% of total`}
          />
          <StatCard
            title="Below 75%"
            value={stats.below75}
            icon={ExclamationTriangleIcon}
            color="bg-yellow-500"
            subtitle="Need attention"
          />
          <StatCard
            title="Below 65%"
            value={stats.below65}
            icon={XCircleIcon}
            color="bg-red-500"
            subtitle="Risk of detention"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Semester</option>
                {getSemesterOptions()}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchAttendanceByDept}
                disabled={!selectedDept || loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Loading..." : "View Attendance"}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Attendance Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Today's Attendance Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                Present Today
              </p>
              <p className="text-2xl font-bold text-green-700">
                {stats.todayPresent}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {Math.round((stats.todayPresent / stats.totalStudents) * 100)}%
                of total students
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Absent Today</p>
              <p className="text-2xl font-bold text-red-700">
                {stats.todayAbsent}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {Math.round((stats.todayAbsent / stats.totalStudents) * 100)}%
                of total students
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Details Table */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h2 className="text-xl font-semibold p-6 border-b">
              Student Attendance Details
            </h2>
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
                {attendanceData.map((student, index) => (
                  <tr key={index}>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(student.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Attendance;
