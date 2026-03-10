// pages/parent/ChildReports.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChartBarIcon,
  EyeIcon,
  PrinterIcon,
  ShareIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ChildReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const [selectedSem, setSelectedSem] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!child) {
      navigate("/parent/dashboard");
      return;
    }
    fetchReports();
  }, [child]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/parent/child/${child.id}/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setReports(response.data.reports || []);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);

      // Mock data for development
      const mockReports = [
        {
          id: 1,
          title: "Semester 3 Report Card",
          type: "Report Card",
          semester: 3,
          date: "March 2026",
          size: "245 KB",
          format: "PDF",
          pages: 2,
          generatedOn: "2026-03-05",
          description:
            "Complete semester performance report with grades and SGPA",
          subjects: [
            { name: "Database Management Systems", grade: "O", marks: 112 },
            { name: "Data Structures", grade: "A+", marks: 102 },
            { name: "Algorithm Design", grade: "A", marks: 107 },
            { name: "DBMS Lab", grade: "O", marks: 23 },
          ],
          summary: {
            sgpa: 8.7,
            totalMarks: 345,
            creditsEarned: 14,
            rank: 15,
            totalStudents: 180,
          },
          url: "#",
        },
        {
          id: 2,
          title: "Attendance Report - Semester 3",
          type: "Attendance",
          semester: 3,
          date: "March 2026",
          size: "156 KB",
          format: "PDF",
          pages: 1,
          generatedOn: "2026-03-05",
          description: "Detailed attendance analysis for Semester 3",
          summary: {
            overall: 92,
            present: 49,
            total: 53,
            percentage: 92,
          },
          url: "#",
        },
        {
          id: 3,
          title: "Marks Statement - Semester 3",
          type: "Marks Statement",
          semester: 3,
          date: "March 2026",
          size: "189 KB",
          format: "PDF",
          pages: 2,
          generatedOn: "2026-03-05",
          description: "Subject-wise marks breakdown with IA and exam scores",
          url: "#",
        },
        {
          id: 4,
          title: "Complete Academic Transcript",
          type: "Transcript",
          semester: "all",
          date: "March 2026",
          size: "423 KB",
          format: "PDF",
          pages: 5,
          generatedOn: "2026-03-05",
          description: "Complete academic record across all semesters",
          summary: {
            cgpa: 8.5,
            totalCredits: 70,
            earnedCredits: 70,
          },
          url: "#",
        },
        {
          id: 5,
          title: "Semester 2 Report Card",
          type: "Report Card",
          semester: 2,
          date: "November 2025",
          size: "238 KB",
          format: "PDF",
          pages: 2,
          generatedOn: "2025-11-20",
          description: "Semester 2 performance report",
          summary: {
            sgpa: 8.5,
            totalMarks: 412,
            creditsEarned: 24,
          },
          url: "#",
        },
        {
          id: 6,
          title: "Low Attendance Report",
          type: "Alert",
          semester: 3,
          date: "March 2026",
          size: "98 KB",
          format: "PDF",
          pages: 1,
          generatedOn: "2026-03-01",
          description: "Students with attendance below 75%",
          alert: true,
          url: "#",
        },
        {
          id: 7,
          title: "Grade Analysis - Semester 3",
          type: "Analysis",
          semester: 3,
          date: "March 2026",
          size: "312 KB",
          format: "PDF",
          pages: 3,
          generatedOn: "2026-03-06",
          description: "Comparative grade analysis with class performance",
          url: "#",
        },
      ];

      setReports(mockReports);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (report) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloading ${report.title}...`);
    }, 1500);
  };

  const handlePreview = (report) => {
    window.open(report.url, "_blank");
  };

  const handlePrint = (report) => {
    alert(`Printing ${report.title}...`);
  };

  const handleShare = (report) => {
    alert(`Share options for ${report.title}`);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Report Card":
        return <AcademicCapIcon className="h-8 w-8 text-blue-500" />;
      case "Attendance":
        return <CalendarIcon className="h-8 w-8 text-green-500" />;
      case "Marks Statement":
        return <ChartBarIcon className="h-8 w-8 text-purple-500" />;
      case "Transcript":
        return <DocumentTextIcon className="h-8 w-8 text-orange-500" />;
      case "Alert":
        return <ClockIcon className="h-8 w-8 text-yellow-500" />;
      case "Analysis":
        return <ChartBarIcon className="h-8 w-8 text-indigo-500" />;
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Report Card":
        return "bg-blue-50 text-blue-600";
      case "Attendance":
        return "bg-green-50 text-green-600";
      case "Marks Statement":
        return "bg-purple-50 text-purple-600";
      case "Transcript":
        return "bg-orange-50 text-orange-600";
      case "Alert":
        return "bg-yellow-50 text-yellow-600";
      case "Analysis":
        return "bg-indigo-50 text-indigo-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const filteredReports = reports.filter((report) => {
    if (
      selectedSem !== "all" &&
      report.semester !== parseInt(selectedSem) &&
      report.semester !== "all"
    )
      return false;
    if (selectedType !== "all" && report.type !== selectedType) return false;
    return true;
  });

  const getSemesterOptions = () => {
    const sems = [
      ...new Set(reports.map((r) => r.semester).filter((s) => s !== "all")),
    ];
    return sems.sort((a, b) => b - a);
  };

  const getTypeOptions = () => {
    return [...new Set(reports.map((r) => r.type))];
  };

  if (!child) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="mr-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-800">
                {child.name}'s Reports
              </h1>
              <p className="text-sm text-gray-500">
                {child.usn} • {child.department}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Semester
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Semesters</option>
                {getSemesterOptions().map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Report Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {getTypeOptions().map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedSem("all");
                  setSelectedType("all");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex items-start">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-lg ${getTypeColor(report.type)} mr-4`}
                  >
                    {getTypeIcon(report.type)}
                  </div>

                  {/* Report Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.description}
                        </p>
                      </div>
                      {report.alert && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Alert
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {report.date}
                      </span>
                      <span>•</span>
                      <span>{report.format}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                      <span>•</span>
                      <span>
                        {report.pages} {report.pages === 1 ? "page" : "pages"}
                      </span>
                      {report.semester !== "all" && (
                        <>
                          <span>•</span>
                          <span>Semester {report.semester}</span>
                        </>
                      )}
                    </div>

                    {/* Summary Preview */}
                    {report.summary && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        {report.type === "Report Card" && (
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div>
                              <p className="text-xs text-gray-500">SGPA</p>
                              <p className="text-sm font-bold text-blue-600">
                                {report.summary.sgpa}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Total Marks
                              </p>
                              <p className="text-sm font-bold text-green-600">
                                {report.summary.totalMarks}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Credits</p>
                              <p className="text-sm font-bold text-purple-600">
                                {report.summary.creditsEarned}
                              </p>
                            </div>
                            {report.summary.rank && (
                              <div>
                                <p className="text-xs text-gray-500">
                                  Class Rank
                                </p>
                                <p className="text-sm font-bold text-orange-600">
                                  {report.summary.rank}/
                                  {report.summary.totalStudents}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        {report.type === "Attendance" && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs text-gray-500">Overall</p>
                              <p
                                className={`text-sm font-bold ${
                                  report.summary.overall >= 75
                                    ? "text-green-600"
                                    : report.summary.overall >= 65
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }`}
                              >
                                {report.summary.overall}%
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Present</p>
                              <p className="text-sm font-bold text-green-600">
                                {report.summary.present}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-sm font-bold text-gray-600">
                                {report.summary.total}
                              </p>
                            </div>
                          </div>
                        )}
                        {report.type === "Transcript" && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-xs text-gray-500">CGPA</p>
                              <p className="text-sm font-bold text-blue-600">
                                {report.summary.cgpa}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">
                                Total Credits
                              </p>
                              <p className="text-sm font-bold text-green-600">
                                {report.summary.totalCredits}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Earned</p>
                              <p className="text-sm font-bold text-purple-600">
                                {report.summary.earnedCredits}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Subjects Preview for Report Cards */}
                    {report.type === "Report Card" && report.subjects && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {report.subjects.map((sub, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full"
                          >
                            {sub.name.substring(0, 15)}... {sub.grade}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <button
                      onClick={() => handlePreview(report)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Preview"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      disabled={downloading}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handlePrint(report)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                      title="Print"
                    >
                      <PrinterIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleShare(report)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                      title="Share"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              No reports found
            </h3>
            <p className="text-gray-500 mt-2">
              {selectedSem !== "all" || selectedType !== "all"
                ? "Try adjusting your filter criteria"
                : "No reports available for this student yet"}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setSelectedSem("all");
              setSelectedType("all");
            }}
            className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition flex items-center justify-center"
          >
            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">All Reports</span>
          </button>
          <button
            onClick={() => setSelectedType("Report Card")}
            className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition flex items-center justify-center"
          >
            <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Report Cards</span>
          </button>
          <button
            onClick={() => alert("Requesting consolidated report...")}
            className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition flex items-center justify-center"
          >
            <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">
              Request New Report
            </span>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">📌 Note:</span> Reports are generated
            periodically. For real-time updates, please check the Attendance and
            Marks sections. Contact the department office for any discrepancies
            in the reports.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChildReports;
