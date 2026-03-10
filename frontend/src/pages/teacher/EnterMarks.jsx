// pages/teacher/EnterMarks.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CalculatorIcon,
  ArrowDownTrayIcon, // ✅ Replaced SaveIcon with ArrowDownTrayIcon
} from "@heroicons/react/24/outline";

const EnterMarks = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState("ia1");
  const [marks, setMarks] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    entered: 0,
    average: 0,
    highest: 0,
    lowest: 100,
  });

  const classes = [];

  const examTypes = [
    {
      id: "ia1",
      name: "Internal Assessment 1",
      maxMarks: 30,
      weight: "20%",
      color: "bg-blue-500",
    },
    {
      id: "ia2",
      name: "Internal Assessment 2",
      maxMarks: 30,
      weight: "20%",
      color: "bg-green-500",
    },
    {
      id: "ia3",
      name: "Internal Assessment 3",
      maxMarks: 30,
      weight: "20%",
      color: "bg-purple-500",
    },
    {
      id: "lab",
      name: "Lab Internal",
      maxMarks: 25,
      weight: "25%",
      color: "bg-orange-500",
    },
    {
      id: "semester",
      name: "Semester End Exam",
      maxMarks: 100,
      weight: "80%",
      color: "bg-red-500",
    },
  ];

  const [students] = useState([]);

  const calculateStats = useCallback(() => {
    const marksArray = Object.values(marks).filter((m) => m !== "");
    if (marksArray.length === 0) return;

    const total = marksArray.reduce((a, b) => a + b, 0);
    const avg = total / marksArray.length;
    const high = Math.max(...marksArray);
    const low = Math.min(...marksArray);

    setStats({
      total: students.length,
      entered: marksArray.length,
      average: Math.round(avg * 10) / 10,
      highest: high,
      lowest: low,
    });
  }, [marks, students.length]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleMarkChange = (studentId, value) => {
    const numValue = value === "" ? "" : parseInt(value);

    setMarks({
      ...marks,
      [studentId]: numValue,
    });

    // Validate
    const maxMarks = getMaxMarks();
    if (numValue !== "" && (numValue < 0 || numValue > maxMarks)) {
      setErrors({
        ...errors,
        [studentId]: `Marks must be between 0 and ${maxMarks}`,
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors[studentId];
      setErrors(newErrors);
    }
  };

  const handleSubmit = () => {
    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      alert("Please fix validation errors before submitting");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/teacher/dashboard");
      }, 2000);
    }, 1500);
  };

  const getMaxMarks = () => {
    return examTypes.find((e) => e.id === selectedExam)?.maxMarks || 30;
  };

  const getGradePrediction = (marks) => {
    if (!marks) return null;
    const percentage = (marks / getMaxMarks()) * 100;
    if (percentage >= 90) return { grade: "O", color: "text-green-600" };
    if (percentage >= 80) return { grade: "A+", color: "text-blue-600" };
    if (percentage >= 70) return { grade: "A", color: "text-indigo-600" };
    if (percentage >= 60) return { grade: "B+", color: "text-yellow-600" };
    if (percentage >= 55) return { grade: "B", color: "text-orange-600" };
    if (percentage >= 50) return { grade: "C", color: "text-purple-600" };
    if (percentage >= 40) return { grade: "P", color: "text-gray-600" };
    return { grade: "F", color: "text-red-600" };
  };

  const ClassSelector = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="modern-dashboard">
        <div className="modern-header-clean">
          <div>
            <h1>Enter Marks</h1>
            <p className="text-muted mt-1">Select a class to enter marks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => setSelectedClass(cls)}
              className="modern-card hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {cls.subject}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {cls.code} • Semester {cls.semester} • Section {cls.section}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition">
                  <AcademicCapIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted">
                  <CalculatorIcon className="w-4 h-4" />
                  <span className="text-sm">{cls.students} students</span>
                </div>
                <span className="text-blue-600 text-sm font-medium group-hover:translate-x-1 transition">
                  Select →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!selectedClass) {
    return <ClassSelector />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="modern-dashboard">
        {/* Header */}
        <div className="modern-header-clean">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedClass(null)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <div>
              <h1>Enter Marks</h1>
              <p className="flex items-center gap-2 mt-1">
                <span className="font-medium text-gray-900">
                  {selectedClass.subject}
                </span>
                <span className="badge badge-blue">{selectedClass.code}</span>
                <span className="text-muted">
                  Sem {selectedClass.semester} • Sec {selectedClass.section}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-6">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5" />
              <span>Marks saved successfully! Redirecting...</span>
            </div>
          </div>
        )}

        {/* Exam Type Selector */}
        <div className="modern-card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Select Examination
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {examTypes.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam.id)}
                className={`p-4 rounded-xl text-white transition-all ${
                  selectedExam === exam.id
                    ? exam.color + " ring-2 ring-offset-2 ring-blue-500"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                <p className="text-xs font-medium opacity-90">{exam.name}</p>
                <p className="text-2xl font-bold mt-2">{exam.maxMarks}</p>
                <p className="text-xs opacity-75 mt-1">Max Marks</p>
              </button>
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid mb-6">
          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Entered</p>
                <p className="stat-value">
                  {stats.entered}/{students.length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Average</p>
                <p className="stat-value">{stats.average}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50 text-green-600">
                <ChartBarIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Highest</p>
                <p className="stat-value">{stats.highest}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <AcademicCapIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="stat-card-modern">
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-title">Lowest</p>
                <p className="stat-value">{stats.lowest}</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                <CheckCircleIcon className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Marks Entry Table */}
        <div className="modern-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Student Marks</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">Max Marks:</span>
              <span className="badge badge-blue text-lg">{getMaxMarks()}</span>
            </div>
          </div>

          <div className="space-y-4">
            {students.map((student) => {
              const gradePrediction = getGradePrediction(marks[student.id]);
              const hasError = errors[student.id];

              return (
                <div
                  key={student.id}
                  className={`p-4 rounded-xl transition-all ${
                    hasError ? "bg-red-50" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Student Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            marks[student.id]
                              ? "bg-blue-200 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="text-sm text-muted">{student.usn}</p>
                        </div>
                      </div>

                      {/* Previous Marks */}
                      {selectedExam.includes("ia") && (
                        <div className="mt-2 flex gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            IA1: {student.previousMarks.ia1}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            IA2: {student.previousMarks.ia2}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            IA3: {student.previousMarks.ia3}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Marks Input */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={getMaxMarks()}
                          value={marks[student.id] || ""}
                          onChange={(e) =>
                            handleMarkChange(student.id, e.target.value)
                          }
                          className={`form-input w-24 text-center ${
                            hasError ? "border-red-500" : ""
                          }`}
                          placeholder="Marks"
                        />
                        {hasError && (
                          <p className="absolute -bottom-5 left-0 text-xs text-red-500">
                            {errors[student.id]}
                          </p>
                        )}
                      </div>

                      {/* Grade Prediction */}
                      {marks[student.id] && !hasError && gradePrediction && (
                        <div
                          className={`px-3 py-1 rounded-lg font-semibold ${gradePrediction.color} bg-white shadow-sm`}
                        >
                          {gradePrediction.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-4 pt-6 border-t">
            <button
              onClick={() => setSelectedClass(null)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(errors).length > 0}
              className="btn btn-primary"
            >
              {submitting ? (
                <>
                  <div className="spinner w-4 h-4 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                  Save Marks
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
            <CalculatorIcon className="w-4 h-4" />
            Instructions
          </h4>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Enter marks between 0 and {getMaxMarks()}</li>
            <li>• Invalid marks will be highlighted in red</li>
            <li>• Previous IA marks are shown for reference</li>
            <li>• Grade predictions are shown in real-time</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EnterMarks;
