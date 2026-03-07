// pages/parent/ChildReports.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (!child) {
      navigate("/parent/dashboard");
      return;
    }
    fetchReports();
  }, [child]);

  const fetchReports = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      const data = [
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
          },
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
        },
      ];

      setReports(data);
      setLoading(false);
    }, 500);
  };

  const handleDownload = (report) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloading ${report.title}...`);
    }, 1500);
  };

  const handlePreview = (report) => {
    alert(`Previewing ${report.title}`);
  };

  const handlePrint = (report) => {
    alert(`Printing ${report.title}`);
  };

  const handleShare = (report) => {
    alert(`Share options for ${report.title}`);
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
      default:
        return <DocumentTextIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getSemesterOptions = () => {
    const sems = [
      ...new Set(reports.map((r) => r.semester).filter((s) => s !== "all")),
    ];
    return sems.sort((a, b) => b - a);
  };

  const getTypeOptions = () => {
    return [...new Set(reports.map((r) => r.type))];
  };

  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Header with color based on type */}
      <div
        className={`h-2 ${
          report.type === "Report Card"
            ? "bg-blue-500"
            : report.type === "Attendance"
              ? "bg-green-500"
              : report.type === "Transcript"
                ? "bg-purple-500"
                : report.type === "Alert"
                  ? "bg-red-500"
                  : "bg-gray-500"
        }`}
      />

      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">{getTypeIcon(report.type)}</div>
          <div className="ml-4 flex-1">
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
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
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
                      <p className="text-xs text-gray-500">Total Marks</p>
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
                        <p className="text-xs text-gray-500">Class Rank</p>
                        <p className="text-sm font-bold text-orange-600">
                          {report.summary.rank}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                {report.type === "Attendance" && (
                  <div className="grid grid-cols-4 gap-2 text-center">
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
                      <p className="text-xs text-gray-500">Total Credits</p>
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

            {/* Action Buttons */}
            <div className="mt-4 flex items-center justify-end space-x-2">
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
      </div>
    </div>
  );

  if (!child) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading reports...</div>
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
                <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
                {child.name}'s Reports
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {child.usn} • {child.department}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredReports.length} reports available
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No reports found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Try adjusting your filter criteria
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleDownload({ title: "All Reports" })}
            className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition flex items-center justify-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">Download All</span>
          </button>
          <button
            onClick={() => window.print()}
            className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition flex items-center justify-center"
          >
            <PrinterIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">Print Summary</span>
          </button>
          <button
            onClick={() => alert("Requesting consolidated report...")}
            className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition flex items-center justify-center"
          >
            <DocumentTextIcon className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">
              Request Consolidated
            </span>
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">📌 Note:</span> Reports are generated
            periodically. For real-time updates, please check the respective
            sections. Contact the department office for any discrepancies in the
            reports.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChildReports;
