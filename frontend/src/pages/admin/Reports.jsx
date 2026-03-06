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
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [reportType, setReportType] = useState("transcript");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
    fetchStudents();
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

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const handleGenerateReport = async () => {
    setGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      alert(`Report generated successfully! Check your downloads folder.`);
    }, 2000);
  };

  const ReportCard = ({ title, icon: Icon, color, description, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500"
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${color} mr-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 flex justify-end">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
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
            Reports Generation
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ReportCard
            title="Student Transcript"
            icon={AcademicCapIcon}
            color="bg-blue-500"
            description="Complete academic record with all semesters, SGPA, and CGPA"
            onClick={() => setReportType("transcript")}
          />
          <ReportCard
            title="Class Report"
            icon={UserGroupIcon}
            color="bg-green-500"
            description="Attendance and performance summary for entire class"
            onClick={() => setReportType("class")}
          />
          <ReportCard
            title="Attendance Report"
            icon={ChartBarIcon}
            color="bg-purple-500"
            description="Detailed attendance analysis with percentage and eligibility"
            onClick={() => setReportType("attendance")}
          />
          <ReportCard
            title="Semester Results"
            icon={CalendarIcon}
            color="bg-orange-500"
            description="Marks and grades for specific semester"
            onClick={() => setReportType("semester")}
          />
          <ReportCard
            title="Department Analytics"
            icon={DocumentTextIcon}
            color="bg-red-500"
            description="Overall department performance statistics"
            onClick={() => setReportType("department")}
          />
          <ReportCard
            title="Low Attendance List"
            icon={ChartBarIcon}
            color="bg-yellow-500"
            description="Students with attendance below 75%"
            onClick={() => setReportType("low-attendance")}
          />
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Report</h2>

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
                <option value="class">Class Report</option>
                <option value="attendance">Attendance Report</option>
                <option value="semester">Semester Results</option>
                <option value="department">Department Analytics</option>
                <option value="low-attendance">Low Attendance List</option>
              </select>
            </div>

            {(reportType === "transcript" || reportType === "attendance") && (
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
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.usn} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(reportType === "class" || reportType === "department") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(reportType === "class" ||
              reportType === "semester" ||
              reportType === "attendance") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Semester
                </label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose Semester</option>
                  {getSemesterOptions()}
                </select>
              </div>
            )}
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

          {/* Preview Section */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm">
                    Alice Johnson - Transcript (Sem 1-3)
                  </span>
                </div>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-sm">
                    CSE Department - Semester 3 Attendance
                  </span>
                </div>
                <span className="text-xs text-gray-500">Yesterday</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
