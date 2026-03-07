// pages/admin/Reports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  PrinterIcon,
  ShareIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState("transcript");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [recentReports, setRecentReports] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    passPercentage: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchStudents();
    fetchStats();
    fetchRecentReports();
  }, []); // ✅ Fixed: Dependencies are fine - functions defined inside component

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

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would come from your API
      setStats({
        totalStudents: 450,
        totalTeachers: 45,
        totalSubjects: 120,
        passPercentage: 87.5,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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
        format: "PDF",
        generatedBy: "Admin",
        generatedOn: "2 hours ago",
        url: "#",
      },
      {
        id: 2,
        title: "Student List - CSE Department",
        type: "Student List",
        date: "March 2026",
        size: "189 KB",
        format: "PDF",
        generatedBy: "Admin",
        generatedOn: "Yesterday",
        url: "#",
      },
      {
        id: 3,
        title: "Marks Statement - Semester 3",
        type: "Marks",
        date: "March 2026",
        size: "423 KB",
        format: "PDF",
        generatedBy: "Admin",
        generatedOn: "2 days ago",
        url: "#",
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
        url: "#",
      },
    ]);
  };

  const handleGenerateReport = () => {
    setGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(`${getReportTitle()} generated successfully!`);

      // Add to recent reports
      const newReport = {
        id: Date.now(),
        title: `${getReportTitle()} - ${new Date().toLocaleDateString()}`,
        type:
          reportType === "attendance"
            ? "Attendance"
            : reportType === "student-list"
              ? "Student List"
              : reportType === "marks"
                ? "Marks"
                : "Department",
        date: new Date().toLocaleDateString(),
        size: "~250 KB",
        format: selectedFormat.toUpperCase(),
        generatedBy: "You",
        generatedOn: "Just now",
        url: "#",
      };

      setRecentReports([newReport, ...recentReports]);
    }, 2000);
  };

  const getReportTitle = () => {
    switch (reportType) {
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

  const handleDownload = (report) => {
    alert(`Downloading ${report.title}...`);
  };

  const handlePreview = (report) => {
    alert(`Previewing ${report.title}...`);
  };

  const handlePrint = (report) => {
    alert(`Printing ${report.title}...`);
  };

  const handleShare = (report) => {
    alert(`Share options for ${report.title}...`);
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const getFilteredStudents = () => {
    if (!selectedDept && !selectedSem) return students;
    return students.filter((student) => {
      const deptMatch =
        !selectedDept || student.departmentId?._id === selectedDept;
      const semMatch =
        !selectedSem || student.semester === parseInt(selectedSem);
      return deptMatch && semMatch;
    });
  };

  const ReportTypeCard = ({ title, icon: Icon, color, description, type }) => (
    <div
      onClick={() => setReportType(type)}
      className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 ${
        reportType === type ? "border-blue-500" : "border-transparent"
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
            Reports Generation
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600">Total Students</p>
            <p className="text-2xl font-bold">{stats.totalStudents}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600">Total Teachers</p>
            <p className="text-2xl font-bold">{stats.totalTeachers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600">Total Subjects</p>
            <p className="text-2xl font-bold">{stats.totalSubjects}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600">Pass Percentage</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.passPercentage}%
            </p>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ReportTypeCard
            title="Student Transcript"
            icon={AcademicCapIcon}
            color="bg-blue-500"
            description="Complete academic record with all semesters, SGPA, and CGPA"
            type="transcript"
          />
          <ReportTypeCard
            title="Attendance Report"
            icon={ChartBarIcon}
            color="bg-green-500"
            description="Detailed attendance analysis with percentage and eligibility"
            type="attendance"
          />
          <ReportTypeCard
            title="Marks Statement"
            icon={DocumentTextIcon}
            color="bg-purple-500"
            description="Subject-wise marks and grades for selected semester"
            type="marks"
          />
          <ReportTypeCard
            title="Student List"
            icon={UserGroupIcon}
            color="bg-orange-500"
            description="Complete list of students with contact details"
            type="student-list"
          />
          <ReportTypeCard
            title="Department Summary"
            icon={ChartBarIcon}
            color="bg-red-500"
            description="Overall department statistics and performance"
            type="department"
          />
          <ReportTypeCard
            title="Low Attendance Report"
            icon={ChartBarIcon} // ✅ Fixed: Replaced ExclamationTriangleIcon with ChartBarIcon
            color="bg-yellow-500"
            description="Students with attendance below 75%"
            type="low-attendance"
          />
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
            Generate Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="transcript">Student Transcript</option>
                <option value="attendance">Attendance Report</option>
                <option value="marks">Marks Statement</option>
                <option value="student-list">Student List</option>
                <option value="department">Department Summary</option>
                <option value="low-attendance">Low Attendance Report</option>
              </select>
            </div>

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

            {(reportType === "transcript" ||
              reportType === "attendance" ||
              reportType === "marks") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose Student</option>
                  {getFilteredStudents().map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.usn} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
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
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
                      <span className="mr-4">{report.format}</span>
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
                  <button
                    onClick={() => handlePrint(report)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded"
                    title="Print"
                  >
                    <PrinterIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleShare(report)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                    title="Share"
                  >
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">📌 Note:</span> Reports are generated
            in real-time based on current data. Large reports may take a few
            moments to process. All reports can be downloaded in multiple
            formats.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Reports;
