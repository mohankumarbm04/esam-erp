// pages/parent/ChildReports.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const ChildReports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const child = location.state?.child;
  const [downloading, setDownloading] = useState(false);

  if (!child) {
    navigate("/parent/dashboard");
    return null;
  }

  const reports = [
    {
      id: 1,
      title: "Semester 3 Report Card",
      type: "Report Card",
      date: "March 2026",
      size: "245 KB",
    },
    {
      id: 2,
      title: "Attendance Report - Semester 3",
      type: "Attendance",
      date: "March 2026",
      size: "156 KB",
    },
    {
      id: 3,
      title: "Marks Statement - Semester 3",
      type: "Marks",
      date: "March 2026",
      size: "189 KB",
    },
    {
      id: 4,
      title: "Complete Academic Transcript",
      type: "Transcript",
      date: "March 2026",
      size: "423 KB",
    },
    {
      id: 5,
      title: "Semester 2 Report Card",
      type: "Report Card",
      date: "November 2025",
      size: "238 KB",
    },
  ];

  const handleDownload = (report) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Downloading ${report.title}...`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {child.name}'s Reports
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {child.usn} • {child.department}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Current Semester</p>
            <p className="text-2xl font-bold">Semester {child.semester}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">CGPA</p>
            <p className="text-2xl font-bold text-blue-600">{child.cgpa}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Reports Available</p>
            <p className="text-2xl font-bold">{reports.length}</p>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Available Reports</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-4" />
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {report.type} • {report.date} • {report.size}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(report)}
                  disabled={downloading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> All reports are in PDF
            format. You can view them using any PDF reader.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChildReports;
