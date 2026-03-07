// pages/teacher/EnterMarks.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const EnterMarks = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState("ia1");
  const [marks, setMarks] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const classes = [
    {
      id: 1,
      subject: "Database Management Systems",
      code: "CS301",
      semester: 3,
      section: "A",
      students: 25,
    },
    {
      id: 2,
      subject: "Data Structures",
      code: "CS302",
      semester: 3,
      section: "B",
      students: 24,
    },
    {
      id: 3,
      subject: "Algorithm Design",
      code: "CS303",
      semester: 5,
      section: "A",
      students: 26,
    },
  ];

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

  // Mock student data
  const [students, setStudents] = useState([
    {
      id: 1,
      usn: "1BI21CS001",
      name: "Alice Johnson",
      previousMarks: { ia1: 28, ia2: 26, ia3: 27 },
    },
    {
      id: 2,
      usn: "1BI21CS002",
      name: "Bob Smith",
      previousMarks: { ia1: 24, ia2: 25, ia3: 23 },
    },
    {
      id: 3,
      usn: "1BI21CS003",
      name: "Charlie Brown",
      previousMarks: { ia1: 22, ia2: 21, ia3: 23 },
    },
    {
      id: 4,
      usn: "1BI21CS004",
      name: "Diana Prince",
      previousMarks: { ia1: 29, ia2: 28, ia3: 27 },
    },
    {
      id: 5,
      usn: "1BI21CS005",
      name: "Eve Adams",
      previousMarks: { ia1: 18, ia2: 19, ia3: 20 },
    },
  ]);

  const handleMarkChange = (studentId, value) => {
    setMarks({
      ...marks,
      [studentId]: value,
    });
  };

  const handleSubmit = () => {
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

  const getExamColor = () => {
    return examTypes.find((e) => e.id === selectedExam)?.color || "bg-blue-500";
  };

  const validateMarks = (value) => {
    const num = parseInt(value);
    if (isNaN(num)) return true;
    return num >= 0 && num <= getMaxMarks();
  };

  if (!selectedClass) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
              Select Class for Marks Entry
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                onClick={() => setSelectedClass(cls)}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-500"
              >
                <h3 className="text-lg font-semibold">{cls.subject}</h3>
                <p className="text-sm text-gray-600">
                  {cls.code} • Semester {cls.semester} • Section {cls.section}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {cls.students} students
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedClass(null)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Enter Marks</h1>
              <p className="text-sm text-gray-600 mt-1">
                {selectedClass.subject} ({selectedClass.code}) • Semester{" "}
                {selectedClass.semester} • Section {selectedClass.section}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Marks saved successfully! Redirecting...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Exam Type Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Select Examination Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {examTypes.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam.id)}
                className={`p-3 rounded-lg text-white transition ${
                  selectedExam === exam.id
                    ? exam.color + " ring-2 ring-offset-2 ring-gray-400"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                <div className="text-xs font-medium">{exam.name}</div>
                <div className="text-lg font-bold mt-1">{exam.maxMarks}</div>
                <div className="text-xs opacity-75">Max Marks</div>
              </button>
            ))}
          </div>
        </div>

        {/* Marks Entry Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Student Marks</h2>
              <div className="text-sm text-gray-600">
                Maximum Marks:{" "}
                <span className="font-bold text-blue-600">{getMaxMarks()}</span>
              </div>
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  USN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Previous IA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marks (Max: {getMaxMarks()})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const currentMark = marks[student.id];
                const isValid = validateMarks(currentMark);

                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.usn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {selectedExam.includes("ia") ? (
                        <span className="text-gray-600">
                          IA1: {student.previousMarks.ia1} | IA2:{" "}
                          {student.previousMarks.ia2} | IA3:{" "}
                          {student.previousMarks.ia3}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="0"
                        max={getMaxMarks()}
                        value={marks[student.id] || ""}
                        onChange={(e) =>
                          handleMarkChange(student.id, e.target.value)
                        }
                        className={`w-24 px-2 py-1 border rounded-md ${
                          marks[student.id] && !isValid
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        placeholder="Marks"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {marks[student.id] && isValid ? (
                        <span className="text-green-600 text-sm">✓ Valid</span>
                      ) : marks[student.id] && !isValid ? (
                        <span className="text-red-600 text-sm">Invalid</span>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary and Submit */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                Total Students:{" "}
                <span className="font-semibold">{students.length}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Marks Entered:{" "}
                <span className="font-semibold">
                  {Object.keys(marks).length}
                </span>
              </p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setSelectedClass(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || Object.keys(marks).length === 0}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Marks"}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            📝 Instructions
          </h3>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Enter marks between 0 and {getMaxMarks()}</li>
            <li>• Invalid marks will be highlighted in red</li>
            <li>• Previous IA marks are shown for reference</li>
            <li>• Click Save Marks to submit all entries</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default EnterMarks;
