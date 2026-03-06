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
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    percentage: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchAttendance();
  }, [selectedSem, selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    // Mock data
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
        {
          usn: "1BI21CS006",
          name: "Frank Castle",
          status: "present",
          time: "09:10 AM",
        },
        {
          usn: "1BI21CS007",
          name: "Grace Hopper",
          status: "present",
          time: "08:50 AM",
        },
        {
          usn: "1BI21CS008",
          name: "Henry Cavill",
          status: "absent",
          time: "-",
        },
      ];

      setAttendanceData(mockData);

      const present = mockData.filter((d) => d.status === "present").length;
      setStats({
        total: mockData.length,
        present: present,
        absent: mockData.length - present,
        percentage: Math.round((present / mockData.length) * 100),
      });

      setLoading(false);
    }, 500);
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {getSemesterOptions()}
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
                onClick={fetchAttendance}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Present</p>
            <p className="text-2xl font-semibold text-green-600">
              {stats.present}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <p className="text-sm text-gray-600">Absent</p>
            <p className="text-2xl font-semibold text-red-600">
              {stats.absent}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Attendance %</p>
            <p className="text-2xl font-semibold">{stats.percentage}%</p>
          </div>
        </div>

        {/* Low Attendance Alert */}
        {stats.percentage < 75 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Warning!</span> Today's
                  attendance is below 75%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.status === "present" ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Present
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XCircleIcon className="h-5 w-5 mr-1" />
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.time}
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

export default Attendance;
