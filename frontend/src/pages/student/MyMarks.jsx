// pages/student/MyMarks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const MyMarks = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [marksData, setMarksData] = useState([]);
  const [semesterData, setSemesterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    sgpa: 0,
    totalMarks: 0,
    totalCredits: 0,
    earnedCredits: 0,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchMarks();
  }, [selectedSem]);

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/students/marks?semester=${selectedSem}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMarksData(response.data.marks || []);
        setSemesterData(response.data.semesterData || {});

        // Calculate summary for selected semester
        const semesterMarks =
          response.data.marks?.filter(
            (m) => m.semester === parseInt(selectedSem),
          ) || [];
        let totalPoints = 0;
        let totalCredits = 0;
        let earnedCredits = 0;
        let totalMarks = 0;

        semesterMarks.forEach((mark) => {
          if (mark.gradePoint) {
            totalPoints += mark.gradePoint * (mark.subjectId?.credits || 0);
            totalCredits += mark.subjectId?.credits || 0;
            if (mark.grade !== "F") {
              earnedCredits += mark.subjectId?.credits || 0;
            }
          }
          totalMarks += mark.totalMarks || 0;
        });

        setSummary({
          sgpa: totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0,
          totalMarks,
          totalCredits,
          earnedCredits,
        });
      }
    } catch (err) {
      console.error("Error fetching marks:", err);
      setError("Failed to load marks data");

      // Mock data for development
      const mockMarks = [
        {
          _id: "1",
          subjectId: {
            code: "CS301",
            name: "Database Management Systems",
            credits: 4,
            type: "Theory",
          },
          semester: 3,
          ia1: 28,
          ia2: 26,
          ia3: 27,
          bestIa: 27.5,
          labInternal: null,
          semesterExam: 85,
          totalMarks: 112.5,
          grade: "O",
          gradePoint: 10,
        },
        {
          _id: "2",
          subjectId: {
            code: "CS302",
            name: "Data Structures",
            credits: 4,
            type: "Theory",
          },
          semester: 3,
          ia1: 24,
          ia2: 25,
          ia3: 23,
          bestIa: 24.5,
          labInternal: null,
          semesterExam: 78,
          totalMarks: 102.5,
          grade: "A+",
          gradePoint: 9,
        },
        {
          _id: "3",
          subjectId: {
            code: "CS303",
            name: "Algorithm Design",
            credits: 4,
            type: "Theory",
          },
          semester: 3,
          ia1: 26,
          ia2: 24,
          ia3: 25,
          bestIa: 25.5,
          labInternal: null,
          semesterExam: 82,
          totalMarks: 107.5,
          grade: "A",
          gradePoint: 8,
        },
        {
          _id: "4",
          subjectId: {
            code: "CS351",
            name: "DBMS Lab",
            credits: 2,
            type: "Lab",
          },
          semester: 3,
          ia1: null,
          ia2: null,
          ia3: null,
          bestIa: null,
          labInternal: 23,
          semesterExam: null,
          totalMarks: 23,
          grade: "O",
          gradePoint: 10,
        },
      ];

      setMarksData(mockMarks);

      const semesterMarks = mockMarks.filter(
        (m) => m.semester === parseInt(selectedSem),
      );
      let totalPoints = 0;
      let totalCredits = 0;
      let earnedCredits = 0;
      let totalMarks = 0;

      semesterMarks.forEach((mark) => {
        totalPoints += mark.gradePoint * mark.subjectId.credits;
        totalCredits += mark.subjectId.credits;
        earnedCredits += mark.subjectId.credits;
        totalMarks += mark.totalMarks;
      });

      setSummary({
        sgpa: (totalPoints / totalCredits).toFixed(2),
        totalMarks,
        totalCredits,
        earnedCredits,
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      O: "bg-green-100 text-green-800 border-green-200",
      "A+": "bg-blue-100 text-blue-800 border-blue-200",
      A: "bg-indigo-100 text-indigo-800 border-indigo-200",
      "B+": "bg-yellow-100 text-yellow-800 border-yellow-200",
      B: "bg-orange-100 text-orange-800 border-orange-200",
      C: "bg-purple-100 text-purple-800 border-purple-200",
      P: "bg-gray-100 text-gray-800 border-gray-200",
      F: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[grade] || "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score, max) => {
    if (!score) return "text-gray-400";
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "text-green-600 font-semibold";
    if (percentage >= 60) return "text-blue-600 font-semibold";
    if (percentage >= 40) return "text-yellow-600 font-semibold";
    return "text-red-600 font-semibold";
  };

  const getSemesterOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
      <option key={sem} value={sem}>
        Semester {sem}
      </option>
    ));
  };

  const handleDownloadReport = () => {
    alert("Downloading marks report...");
  };

  const calculatePerformance = (total, max) => {
    const percentage = (total / max) * 100;
    if (percentage >= 90) return { text: "Excellent", color: "text-green-600" };
    if (percentage >= 80) return { text: "Very Good", color: "text-blue-600" };
    if (percentage >= 70) return { text: "Good", color: "text-indigo-600" };
    if (percentage >= 60)
      return { text: "Satisfactory", color: "text-yellow-600" };
    if (percentage >= 50) return { text: "Average", color: "text-orange-600" };
    return { text: "Needs Improvement", color: "text-red-600" };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading marks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-800">My Marks</h1>
            <button
              onClick={handleDownloadReport}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls and Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Semester
                </label>
                <select
                  value={selectedSem}
                  onChange={(e) => setSelectedSem(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {getSemesterOptions()}
                </select>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">SGPA</p>
                <p className="text-3xl font-bold text-blue-600">
                  {summary.sgpa}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-2xl font-semibold text-gray-700">
                  {summary.totalMarks}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Credits</p>
                <p className="text-2xl font-semibold text-green-600">
                  {summary.earnedCredits}/{summary.totalCredits}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Cards */}
        <div className="grid grid-cols-1 gap-6">
          {marksData
            .filter((mark) => mark.semester === parseInt(selectedSem))
            .map((subject) => {
              const maxMarks = subject.subjectId?.type === "Lab" ? 25 : 150;
              const performance = calculatePerformance(
                subject.totalMarks,
                maxMarks,
              );

              return (
                <div
                  key={subject._id}
                  className="bg-white rounded-lg shadow overflow-hidden border border-gray-100"
                >
                  {/* Subject Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {subject.subjectId?.name}
                          </h3>
                          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {subject.subjectId?.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {subject.subjectId?.code} •{" "}
                          {subject.subjectId?.credits} Credits
                        </p>
                      </div>
                      <div className="mt-2 md:mt-0 flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(subject.grade)}`}
                        >
                          Grade: {subject.grade} ({subject.gradePoint})
                        </span>
                        <span
                          className={`text-sm font-medium ${performance.color}`}
                        >
                          {performance.text}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Marks Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                      {/* IA Marks */}
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium">
                          IA 1
                        </p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(subject.ia1 || 0, 30)}`}
                        >
                          {subject.ia1 || "-"}
                        </p>
                        <p className="text-xs text-gray-500">/30</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium">
                          IA 2
                        </p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(subject.ia2 || 0, 30)}`}
                        >
                          {subject.ia2 || "-"}
                        </p>
                        <p className="text-xs text-gray-500">/30</p>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium">
                          IA 3
                        </p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(subject.ia3 || 0, 30)}`}
                        >
                          {subject.ia3 || "-"}
                        </p>
                        <p className="text-xs text-gray-500">/30</p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-green-600 font-medium">
                          Best IA
                        </p>
                        <p
                          className={`text-lg font-bold ${getScoreColor(subject.bestIa || 0, 30)}`}
                        >
                          {subject.bestIa?.toFixed(1) || "-"}
                        </p>
                        <p className="text-xs text-gray-500">/30</p>
                      </div>

                      {subject.subjectId?.type === "Lab" ? (
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-600 font-medium">
                            Lab
                          </p>
                          <p
                            className={`text-lg font-bold ${getScoreColor(subject.labInternal || 0, 25)}`}
                          >
                            {subject.labInternal || "-"}
                          </p>
                          <p className="text-xs text-gray-500">/25</p>
                        </div>
                      ) : (
                        <div className="bg-orange-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-orange-600 font-medium">
                            Sem Exam
                          </p>
                          <p
                            className={`text-lg font-bold ${getScoreColor(subject.semesterExam || 0, 100)}`}
                          >
                            {subject.semesterExam || "-"}
                          </p>
                          <p className="text-xs text-gray-500">/100</p>
                        </div>
                      )}

                      <div className="bg-purple-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-purple-600 font-medium">
                          Total
                        </p>
                        <p className="text-xl font-bold text-purple-700">
                          {subject.totalMarks}
                        </p>
                        <p className="text-xs text-gray-500">/{maxMarks}</p>
                      </div>

                      <div className="bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-300 font-medium">
                          Grade
                        </p>
                        <p className="text-xl font-bold text-white">
                          {subject.grade}
                        </p>
                        <p className="text-xs text-gray-400">
                          {subject.gradePoint} GP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Grade Scale Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Grade Scale
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-800 rounded-lg flex items-center justify-center font-bold mr-2">
                O
              </span>
              <span className="text-sm text-gray-600">90-100% (10 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-lg flex items-center justify-center font-bold mr-2">
                A+
              </span>
              <span className="text-sm text-gray-600">80-89% (9 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-indigo-100 text-indigo-800 rounded-lg flex items-center justify-center font-bold mr-2">
                A
              </span>
              <span className="text-sm text-gray-600">70-79% (8 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-yellow-100 text-yellow-800 rounded-lg flex items-center justify-center font-bold mr-2">
                B+
              </span>
              <span className="text-sm text-gray-600">60-69% (7 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-orange-100 text-orange-800 rounded-lg flex items-center justify-center font-bold mr-2">
                B
              </span>
              <span className="text-sm text-gray-600">55-59% (6 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-800 rounded-lg flex items-center justify-center font-bold mr-2">
                C
              </span>
              <span className="text-sm text-gray-600">50-54% (5 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-gray-100 text-gray-800 rounded-lg flex items-center justify-center font-bold mr-2">
                P
              </span>
              <span className="text-sm text-gray-600">40-49% (4 GP)</span>
            </div>
            <div className="flex items-center">
              <span className="w-8 h-8 bg-red-100 text-red-800 rounded-lg flex items-center justify-center font-bold mr-2">
                F
              </span>
              <span className="text-sm text-gray-600">&lt;40% (0 GP)</span>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">📊 Performance Insight:</span> Your
            SGPA of {summary.sgpa} for Semester {selectedSem} is{" "}
            {summary.sgpa >= 9
              ? "Excellent"
              : summary.sgpa >= 8
                ? "Very Good"
                : summary.sgpa >= 7
                  ? "Good"
                  : summary.sgpa >= 6
                    ? "Satisfactory"
                    : "Needs Improvement"}
            . Keep up the good work!
          </p>
        </div>
      </main>
    </div>
  );
};

export default MyMarks;
