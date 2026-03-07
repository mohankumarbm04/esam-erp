// pages/student/MyMarks.jsx
import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const MyMarks = () => {
  const [selectedSem, setSelectedSem] = useState("3");
  const [marksData, setMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    sgpa: 0,
    totalCredits: 0,
    earnedCredits: 0,
    totalMarks: 0,
  });

  useEffect(() => {
    fetchMarks();
  }, [selectedSem]);

  const fetchMarks = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      const data = {
        semester: 3,
        sgpa: 8.7,
        totalCredits: 24,
        earnedCredits: 24,
        subjects: [
          {
            code: "CS301",
            name: "Database Management Systems",
            type: "Theory",
            credits: 4,
            ia1: 28,
            ia2: 26,
            ia3: 27,
            bestIa: 27.5,
            lab: null,
            exam: 85,
            total: 112.5,
            grade: "O",
            gradePoint: 10,
            status: "completed",
          },
          {
            code: "CS302",
            name: "Data Structures",
            type: "Theory",
            credits: 4,
            ia1: 24,
            ia2: 25,
            ia3: 23,
            bestIa: 24.5,
            lab: null,
            exam: 78,
            total: 102.5,
            grade: "A+",
            gradePoint: 9,
            status: "completed",
          },
          {
            code: "CS303",
            name: "Algorithm Design",
            type: "Theory",
            credits: 4,
            ia1: 26,
            ia2: 24,
            ia3: 25,
            bestIa: 25.5,
            lab: null,
            exam: 82,
            total: 107.5,
            grade: "A",
            gradePoint: 8,
            status: "completed",
          },
          {
            code: "CS304",
            name: "Operating Systems",
            type: "Theory",
            credits: 4,
            ia1: 22,
            ia2: 24,
            ia3: null,
            bestIa: 23,
            lab: null,
            exam: null,
            total: 23,
            grade: "P",
            gradePoint: 4,
            status: "pending",
          },
          {
            code: "CS351",
            name: "DBMS Lab",
            type: "Lab",
            credits: 2,
            ia1: null,
            ia2: null,
            ia3: null,
            bestIa: null,
            lab: 23,
            exam: null,
            total: 23,
            grade: "O",
            gradePoint: 10,
            status: "completed",
          },
          {
            code: "CS352",
            name: "DS Lab",
            type: "Lab",
            credits: 2,
            ia1: null,
            ia2: null,
            ia3: null,
            bestIa: null,
            lab: 21,
            exam: null,
            total: 21,
            grade: "A+",
            gradePoint: 9,
            status: "completed",
          },
        ],
      };

      setMarksData(data.subjects);

      const totalMarks = data.subjects.reduce(
        (acc, sub) => acc + (sub.total || 0),
        0,
      );
      const totalCredits = data.subjects.reduce(
        (acc, sub) => acc + sub.credits,
        0,
      );
      const earnedCredits = data.subjects
        .filter((sub) => sub.grade !== "F" && sub.grade !== "P")
        .reduce((acc, sub) => acc + sub.credits, 0);

      setSummary({
        sgpa: data.sgpa,
        totalCredits,
        earnedCredits,
        totalMarks,
      });

      setLoading(false);
    }, 500);
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
    return colors[grade] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getScoreColor = (score, max) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading marks...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Marks
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Controls and Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
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
                <p className="text-sm text-gray-600">Credits</p>
                <p className="text-2xl font-semibold">
                  {summary.earnedCredits}/{summary.totalCredits}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-2xl font-semibold">{summary.totalMarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Cards */}
        <div className="grid grid-cols-1 gap-6">
          {marksData.map((subject, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Subject Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{subject.name}</h3>
                    <p className="text-sm text-gray-600">
                      {subject.code} • {subject.type} • {subject.credits}{" "}
                      Credits
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(subject.grade)}`}
                    >
                      Grade: {subject.grade}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      GP: {subject.gradePoint}
                    </span>
                    {subject.status === "pending" && (
                      <span className="flex items-center text-yellow-600 text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Marks Grid */}
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {/* IA Marks */}
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">IA 1</p>
                    <p
                      className={`text-lg font-bold ${getScoreColor(subject.ia1 || 0, 30)}`}
                    >
                      {subject.ia1 || "-"}
                    </p>
                    <p className="text-xs text-gray-500">/30</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">IA 2</p>
                    <p
                      className={`text-lg font-bold ${getScoreColor(subject.ia2 || 0, 30)}`}
                    >
                      {subject.ia2 || "-"}
                    </p>
                    <p className="text-xs text-gray-500">/30</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 font-medium">IA 3</p>
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
                      {subject.bestIa || "-"}
                    </p>
                    <p className="text-xs text-gray-500">/30</p>
                  </div>

                  {subject.type === "Lab" ? (
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-purple-600 font-medium">
                        Lab Internal
                      </p>
                      <p
                        className={`text-lg font-bold ${getScoreColor(subject.lab || 0, 25)}`}
                      >
                        {subject.lab || "-"}
                      </p>
                      <p className="text-xs text-gray-500">/25</p>
                    </div>
                  ) : (
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <p className="text-xs text-orange-600 font-medium">
                        Sem Exam
                      </p>
                      <p
                        className={`text-lg font-bold ${getScoreColor(subject.exam || 0, 100)}`}
                      >
                        {subject.exam || "-"}
                      </p>
                      <p className="text-xs text-gray-500">/100</p>
                    </div>
                  )}

                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-300 font-medium">Total</p>
                    <p className="text-xl font-bold text-white">
                      {subject.total}
                    </p>
                    <p className="text-xs text-gray-400">
                      /{subject.type === "Lab" ? 25 : 150}
                    </p>
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Performance:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div
                          key={star}
                          className={`w-8 h-2 rounded-full ${
                            subject.gradePoint >= star * 2
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {subject.status === "completed" ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Results Published
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600 text-sm">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Awaiting Results
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grade Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Grade Legend
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

        {/* Summary Note */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> Your SGPA is calculated
            based on the best IA marks and semester exam performance. Grades
            marked with "Pending" will be updated once results are published.
          </p>
        </div>
      </main>
    </div>
  );
};

export default MyMarks;
