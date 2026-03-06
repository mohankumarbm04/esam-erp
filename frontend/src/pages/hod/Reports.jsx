// pages/hod/Reports.jsx
import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = (type) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert(`${type} report generated successfully!`);
    }, 1500);
  };

  const ReportCard = ({ title, icon: Icon, color, description, type }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-end">
        <button
          onClick={() => handleGenerateReport(title)}
          disabled={generating}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          Generate <ArrowDownTrayIcon className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
            Department Reports
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Computer Science Engineering (CSE)
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Semester
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Format
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
              </select>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ReportCard
            title="Attendance Report"
            icon={ChartBarIcon}
            color="bg-blue-500"
            description="Detailed attendance analysis for selected semester with percentage and eligibility"
            type="attendance"
          />
          <ReportCard
            title="Marks Sheet"
            icon={AcademicCapIcon}
            color="bg-green-500"
            description="Complete marks record for all subjects in selected semester"
            type="marks"
          />
          <ReportCard
            title="Student List"
            icon={UserGroupIcon}
            color="bg-purple-500"
            description="List of all students with their details and contact information"
            type="students"
          />
          <ReportCard
            title="Low Attendance"
            icon={ChartBarIcon}
            color="bg-red-500"
            description="Students with attendance below 75% - requires parent notification"
            type="low-attendance"
          />
          <ReportCard
            title="Grade Analysis"
            icon={DocumentTextIcon}
            color="bg-orange-500"
            description="Grade distribution and performance analysis for the semester"
            type="grades"
          />
          <ReportCard
            title="Department Summary"
            icon={CalendarIcon}
            color="bg-indigo-500"
            description="Overall department statistics and performance metrics"
            type="summary"
          />
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recently Generated</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">
                  Attendance Report - Semester 3 (Mar 2026)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">2 hours ago</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-sm">Student List - CSE Department</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">Yesterday</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
