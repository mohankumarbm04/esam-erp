// pages/hod/Reports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  EyeIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [department, setDepartment] = useState(null);
  const [selectedSem, setSelectedSem] = useState("3");
  const [selectedReport, setSelectedReport] = useState("attendance");
  const [generating, setGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({
    teachers: 12,
    students: 180,
    subjects: 24,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
    fetchRecentReports();
    fetchStats();
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

  const fetchRecentReports = async () => {
    // Mock data - replace with API call
    setRecentReports([
      {
        id: 1,
        title: "Attendance Report - Semester 3",
        type: "Attendance",
        date: "March 2026",
        size: "245 KB",
        generatedBy: "Dr. Rajesh",
        generatedOn: "2 hours ago",
      },
      {
        id: 2,
        title: "Student List - CSE Department",
        type: "Student List",
        date: "March 2026",
        size: "189 KB",
        generatedBy: "Prof. Kumar",
        generatedOn: "Yesterday",
      },
      {
        id: 3,
        title: "Marks Statement - Semester 3",
        type: "Marks",
        date: "March 2026",
        size: "423 KB",
        generatedBy: "Dr. Sharma",
        generatedOn: "2 days ago",
      },
      {
        id: 4,
        title: "Low Attendance Report",
        type: "Alert",
        date: "March 2026",
        size: "156 KB",
        generatedBy: "System",
        generatedOn: "3 days ago",
      },
    ]);
  };

  const fetchStats = async () => {
    try {
      // This would come from your API
      setStats({
        teachers: 12,
        students: 180,
        subjects: 24,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleGenerateReport = () => {
    setGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(
        `${getReportTitle()} generated successfully! Check downloads folder.`,
      );

      // Add to recent reports
      const newReport = {
        id: Date.now(),
        title: `${getReportTitle()} - ${new Date().toLocaleDateString()}`,
        type:
          selectedReport === "attendance"
            ? "Attendance"
            : selectedReport === "student-list"
              ? "Student List"
              : selectedReport === "marks"
                ? "Marks"
                : "Department",
        date: "Just now",
        size: "~250 KB",
        generatedBy: "You",
        generatedOn: "Just now",
      };

      setRecentReports([newReport, ...recentReports]);
    }, 2000);
  };

  const getReportTitle = () => {
    switch (selectedReport) {
      case "attendance":
        return "Attendance Report";
      case "student-list":
        return "Student List";
      case "marks":
        return "Marks Statement";
      case "department":
        return "Department Summary";
      case "low-attendance":
        return "Low Attendance Report";
      default:
        return "Report";
    }
  };

  const handleDownload = (report) => {
    alert(`Downloading ${report.title}...`);
  };

  const handlePreview = (report) => {
    alert(`Previewing ${report.title}...`);
  };

  const ReportCard = ({ title, icon: Icon, color, description, type }) => (
    <div
      onClick={() => setSelectedReport(type)}
      className={`bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-2 ${
        selectedReport === type ? "border-blue-500" : "border-transparent"
      }`}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">Click to select</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
            Department Reports
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {department?.name} ({department?.code}) • Generate and download
            reports
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Teachers</p>
            <p className="text-2xl font-bold">{stats.teachers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{stats.students}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Subjects</p>
            <p className="text-2xl font-bold">{stats.subjects}</p>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ReportCard
            title="Attendance Report"
            icon={ChartBarIcon}
            color="bg-blue-500"
            description="Detailed attendance analysis with percentage and eligibility"
            type="attendance"
          />
          <ReportCard
            title="Student List"
            icon={UserGroupIcon}
            color="bg-green-500"
            description="Complete list of students with contact details"
            type="student-list"
          />
          <ReportCard
            title="Marks Statement"
            icon={AcademicCapIcon}
            color="bg-purple-500"
            description="Subject-wise marks and grades"
            type="marks"
          />
          <ReportCard
            title="Department Summary"
            icon={DocumentTextIcon}
            color="bg-orange-500"
            description="Overall department statistics and performance"
            type="department"
          />
          <ReportCard
            title="Low Attendance Report"
            icon={ChartBarIcon}
            color="bg-red-500"
            description="Students with attendance below 75%"
            type="low-attendance"
          />
          <ReportCard
            title="Semester Report"
            icon={CalendarIcon}
            color="bg-indigo-500"
            description="Complete semester performance summary"
            type="semester"
          />
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate Report</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="attendance">Attendance Report</option>
                <option value="student-list">Student List</option>
                <option value="marks">Marks Statement</option>
                <option value="department">Department Summary</option>
                <option value="low-attendance">Low Attendance Report</option>
                <option value="semester">Semester Report</option>
              </select>
            </div>

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
                Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {generating ? (
                <>Generating...</>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Generate Report
                </>
              )}
            </button>

            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 flex items-center">
              <PrinterIcon className="h-5 w-5 mr-2" />
              Print
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">
              Recently Generated Reports
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-4" />
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-4">{report.type}</span>
                      <span className="mr-4">{report.date}</span>
                      <span className="mr-4">{report.size}</span>
                      <span>
                        by {report.generatedBy} • {report.generatedOn}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePreview(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Preview"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDownload(report)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Download"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> Reports are generated in
            real-time. Large reports may take a few moments to process.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Reports;
