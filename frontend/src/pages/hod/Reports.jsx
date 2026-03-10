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
  ShareIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [department, setDepartment] = useState(null);
  const [selectedSem, setSelectedSem] = useState("3");
  const [selectedReport, setSelectedReport] = useState("attendance");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generating, setGenerating] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({
    teachers: 12,
    students: 180,
    subjects: 24,
    passPercentage: 87.5,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartment();
    fetchRecentReports();
  }, []);

  const fetchDepartment = async () => {
    setDepartment({
      name: "Computer Science",
      code: "CSE",
      totalTeachers: 12,
      totalStudents: 180,
      totalSubjects: 24,
    });
  };

  const fetchRecentReports = async () => {
    setRecentReports([
      {
        id: 1,
        title: "Attendance Report - Semester 3",
        type: "Attendance",
        date: "March 2026",
        size: "245 KB",
        format: "PDF",
        generatedBy: "Dr. Sharma",
        generatedOn: "2 hours ago",
        status: "completed",
      },
      {
        id: 2,
        title: "Student List - CSE Department",
        type: "Student List",
        date: "March 2026",
        size: "189 KB",
        format: "PDF",
        generatedBy: "Prof. Kumar",
        generatedOn: "Yesterday",
        status: "completed",
      },
      {
        id: 3,
        title: "Marks Statement - Semester 3",
        type: "Marks",
        date: "March 2026",
        size: "423 KB",
        format: "PDF",
        generatedBy: "Dr. Sharma",
        generatedOn: "2 days ago",
        status: "completed",
      },
      {
        id: 4,
        title: "Low Attendance Report",
        type: "Alert",
        date: "March 2026",
        size: "156 KB",
        format: "PDF",
        generatedBy: "System",
        generatedOn: "3 days ago",
        status: "warning",
      },
    ]);
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      const newReport = {
        id: Date.now(),
        title: `${getReportTitle()} - ${new Date().toLocaleDateString()}`,
        type: getReportType(),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        size: "~250 KB",
        format: selectedFormat.toUpperCase(),
        generatedBy: "You",
        generatedOn: "Just now",
        status: "completed",
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
      case "transcript":
        return "Student Transcript";
      case "low-attendance":
        return "Low Attendance Report";
      default:
        return "Report";
    }
  };

  const getReportType = () => {
    switch (selectedReport) {
      case "attendance":
        return "Attendance";
      case "student-list":
        return "Student List";
      case "marks":
        return "Marks";
      case "department":
        return "Department";
      case "transcript":
        return "Transcript";
      case "low-attendance":
        return "Alert";
      default:
        return "Report";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "warning":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const ReportTypeCard = ({ title, icon: Icon, color, description, type }) => (
    <div
      onClick={() => setSelectedReport(type)}
      className={`modern-card cursor-pointer transition-all hover:scale-105 ${
        selectedReport === type ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modern-dashboard">
      {/* Header */}
      <div className="modern-header-clean">
        <div>
          <h1>Department Reports</h1>
          <p className="flex items-center gap-2 mt-1">
            <span className="text-muted">{department?.name}</span>
            <span className="badge badge-blue">{department?.code}</span>
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid mb-6">
        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Teachers</p>
              <p className="stat-value">{stats.teachers}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <UserGroupIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Students</p>
              <p className="stat-value">{stats.students}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Total Subjects</p>
              <p className="stat-value">{stats.subjects}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <ChartBarIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="flex items-start justify-between">
            <div>
              <p className="stat-title">Pass Percentage</p>
              <p className="stat-value text-green-600">
                {stats.passPercentage}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <ReportTypeCard
          title="Attendance Report"
          icon={ChartBarIcon}
          color="bg-blue-500"
          description="Detailed attendance analysis with percentages"
          type="attendance"
        />
        <ReportTypeCard
          title="Student List"
          icon={UserGroupIcon}
          color="bg-green-500"
          description="Complete list of students with contact details"
          type="student-list"
        />
        <ReportTypeCard
          title="Marks Statement"
          icon={AcademicCapIcon}
          color="bg-purple-500"
          description="Subject-wise marks and grades"
          type="marks"
        />
        <ReportTypeCard
          title="Department Summary"
          icon={DocumentTextIcon}
          color="bg-orange-500"
          description="Overall department statistics"
          type="department"
        />
        <ReportTypeCard
          title="Student Transcript"
          icon={CalendarIcon}
          color="bg-indigo-500"
          description="Complete academic record"
          type="transcript"
        />
        <ReportTypeCard
          title="Low Attendance Report"
          icon={ChartBarIcon}
          color="bg-red-500"
          description="Students below 75% attendance"
          type="low-attendance"
        />
      </div>

      {/* Report Generation Form */}
      <div className="modern-card mb-6">
        <div className="card-header">
          <h3 className="card-title">
            <FunnelIcon className="w-5 h-5" />
            Generate Report
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="form-label">Report Type</label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="form-input"
            >
              <option value="attendance">Attendance Report</option>
              <option value="student-list">Student List</option>
              <option value="marks">Marks Statement</option>
              <option value="department">Department Summary</option>
              <option value="transcript">Student Transcript</option>
              <option value="low-attendance">Low Attendance Report</option>
            </select>
          </div>

          <div>
            <label className="form-label">Semester</label>
            <select
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              className="form-input"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="form-input"
            >
              <option value="pdf">PDF Document</option>
              <option value="excel">Excel Spreadsheet</option>
              <option value="csv">CSV File</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={generating}
              className="btn btn-primary w-full"
            >
              {generating ? (
                <span className="flex items-center justify-center">
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Generating...
                </span>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="modern-card">
        <div className="card-header">
          <h3 className="card-title">
            <ClockIcon className="w-5 h-5" />
            Recently Generated Reports
          </h3>
          <span className="text-sm text-muted">
            {recentReports.length} reports
          </span>
        </div>

        <div className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-lg ${
                    report.type === "Attendance"
                      ? "bg-blue-100"
                      : report.type === "Student List"
                        ? "bg-green-100"
                        : report.type === "Marks"
                          ? "bg-purple-100"
                          : report.type === "Alert"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                  }`}
                >
                  <DocumentTextIcon
                    className={`w-5 h-5 ${
                      report.type === "Attendance"
                        ? "text-blue-600"
                        : report.type === "Student List"
                          ? "text-green-600"
                          : report.type === "Marks"
                            ? "text-purple-600"
                            : report.type === "Alert"
                              ? "text-yellow-600"
                              : "text-gray-600"
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">
                      {report.title}
                    </h4>
                    {getStatusIcon(report.status)}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted mt-1">
                    <span>{report.type}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                    <span>•</span>
                    <span>{report.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Preview"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="Download"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                  title="Print"
                >
                  <PrinterIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                  title="Share"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span className="text-lg">📌</span>
          Reports are generated in real-time. Large reports may take a few
          moments to process.
        </p>
      </div>
    </div>
  );
};

export default Reports;
