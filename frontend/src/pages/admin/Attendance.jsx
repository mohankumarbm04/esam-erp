// pages/admin/Attendance.jsx
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
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Attendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
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
  const [summary, setSummary] = useState({
    departmentWise: {},
    semesterWise: {},
    subjectWise: {},
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchTodayAttendance();
    fetchAttendanceSummary();
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
    try {
      // This would come from your API
      setStats({
        totalStudents: 450,
        above75: 382,
        below75: 68,
        below65: 23,
        todayPresent: 412,
        todayAbsent: 38,
      });
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  const fetchAttendanceSummary = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      setTimeout(() => {
        setSummary({
          departmentWise: {
            CSE: { total: 180, above75: 152, below75: 28 },
            ECE: { total: 150, above75: 128, below75: 22 },
            ME: { total: 120, above75: 102, below75: 18 },
          },
          semesterWise: {
            1: { total: 120, above75: 108, below75: 12 },
            2: { total: 115, above75: 98, below75: 17 },
            3: { total: 110, above75: 92, below75: 18 },
            4: { total: 105, above75: 84, below75: 21 },
          },
        });
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setLoading(false);
    }
  };

  const fetchAttendanceByFilters = async () => {
    if (!selectedDept && !selectedSem) return;

    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockData = [
        {
          usn: "1BI21CS001",
          name: "Alice Johnson",
          department: "CSE",
          semester: 3,
          section: "A",
          attendance: 100,
          status: "good",
        },
        {
          usn: "1BI21CS002",
          name: "Bob Smith",
          department: "CSE",
          semester: 3,
          section: "A",
          attendance: 82,
          status: "good",
        },
        {
          usn: "1BI21CS003",
          name: "Charlie Brown",
          department: "CSE",
          semester: 3,
          section: "A",
          attendance: 68,
          status: "warning",
        },
        {
          usn: "1BI21CS004",
          name: "Diana Prince",
          department: "CSE",
          semester: 3,
          section: "B",
          attendance: 92,
          status: "good",
        },
        {
          usn: "1BI21CS005",
          name: "Eve Adams",
          department: "CSE",
          semester: 3,
          section: "B",
          attendance: 58,
          status: "danger",
        },
        {
          usn: "1BI21CS006",
          name: "Frank Castle",
          department: "ECE",
          semester: 3,
          section: "A",
          attendance: 75,
          status: "good",
        },
      ];

      setAttendanceData(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setLoading(false);
    }
  };

  const fetchDailyAttendance = async () => {
    setLoading(true);
    try {
      // Mock data - replace with API call
      const mockData = [
        {
          usn: "1BI21CS001",
          name: "Alice Johnson",
          status: "present",
          time: "09:05 AM",
          department: "CSE",
          semester: 3,
        },
        {
          usn: "1BI21CS002",
          name: "Bob Smith",
          status: "present",
          time: "09:00 AM",
          department: "CSE",
          semester: 3,
        },
        {
          usn: "1BI21CS003",
          name: "Charlie Brown",
          status: "absent",
          time: "-",
          department: "CSE",
          semester: 3,
        },
        {
          usn: "1BI21CS004",
          name: "Diana Prince",
          status: "present",
          time: "08:55 AM",
          department: "CSE",
          semester: 3,
        },
        {
          usn: "1BI21CS005",
          name: "Eve Adams",
          status: "absent",
          time: "-",
          department: "CSE",
          semester: 3,
        },
      ];
      setAttendanceData(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching daily attendance:", error);
      setLoading(false);
    }
  };

  const handleFilter = () => {
    if (selectedDept || selectedSem) {
      fetchAttendanceByFilters();
    }
  };

  const handleDateChange = () => {
    fetchDailyAttendance();
  };

  const exportReport = () => {
    alert("Exporting attendance report...");
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
            subtitle={`${Math.round(
              (stats.above75 / stats.totalStudents) * 100,
            )}% of total`}
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
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Filter Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Departments</option>
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
                <option value="">All Semesters</option>
                {getSemesterOptions()}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex items-end space-x-2">
              <button
                onClick={handleFilter}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Apply Filters
              </button>
              <button
                onClick={exportReport}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Today's Attendance Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
            Today's Attendance ({selectedDate})
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

        {/* Department-wise Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Department-wise Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(summary.departmentWise).map(([dept, data]) => (
              <div key={dept} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{dept}</h3>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Students:</span>
                    <span className="font-medium">{data.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Above 75%:</span>
                    <span className="font-medium text-green-600">
                      {data.above75}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Below 75%:</span>
                    <span className="font-medium text-yellow-600">
                      {data.below75}
                    </span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 rounded-full h-2"
                    style={{
                      width: `${(data.above75 / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Semester-wise Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Semester-wise Attendance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(summary.semesterWise).map(([sem, data]) => (
              <div key={sem} className="border rounded-lg p-3">
                <p className="text-sm font-medium">Semester {sem}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.above75}/{data.total} above 75%
                </p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 rounded-full h-1.5"
                    style={{
                      width: `${(data.above75 / data.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Details Table */}
        {attendanceData.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">
                Student Attendance Details
              </h2>
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
                    Department
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
                    <td colSpan="7" className="px-6 py-4 text-center">
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
                        {student.department || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.semester || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.section || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {student.attendance ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getAttendanceColor(
                              student.attendance,
                            )}`}
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
        )}
      </main>
    </div>
  );
};

export default Attendance;
