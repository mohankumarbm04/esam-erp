// pages/teacher/EnterMarks.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const EnterMarks = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedExam, setSelectedExam] = useState("ia1");
  const [marks, setMarks] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
    { id: "ia1", name: "IA 1", maxMarks: 30 },
    { id: "ia2", name: "IA 2", maxMarks: 30 },
    { id: "ia3", name: "IA 3", maxMarks: 30 },
    { id: "lab", name: "Lab Internal", maxMarks: 25 },
    { id: "semester", name: "Semester Exam", maxMarks: 100 },
  ];

  // Mock student data
  const students = [
    { id: 1, usn: "1BI21CS001", name: "Alice Johnson" },
    { id: 2, usn: "1BI21CS002", name: "Bob Smith" },
    { id: 3, usn: "1BI21CS003", name: "Charlie Brown" },
    { id: 4, usn: "1BI21CS004", name: "Diana Prince" },
    { id: 5, usn: "1BI21CS005", name: "Eve Adams" },
  ];

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
      alert("Marks entered successfully!");
      navigate("/teacher/dashboard");
    }, 1500);
  };

  const getMaxMarks = () => {
    return examTypes.find((e) => e.id === selectedExam)?.maxMarks || 30;
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
        {/* Exam Type Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select Exam:
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              {examTypes.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} (Max: {exam.maxMarks})
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Maximum marks: {getMaxMarks()}
            </span>
          </div>
        </div>

        {/* Marks Entry Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Marks (Max: {getMaxMarks()})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.usn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
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
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                      placeholder="Marks"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
          >
            {submitting ? "Saving..." : "Save Marks"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EnterMarks;
