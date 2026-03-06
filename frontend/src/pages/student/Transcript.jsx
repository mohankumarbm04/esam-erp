// pages/student/Transcript.jsx
import React, { useState } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Transcript = () => {
  const [loading, setLoading] = useState(false);

  const transcript = {
    student: {
      name: "Alice Johnson",
      usn: "1BI21CS001",
      department: "Computer Science",
      batch: 2021,
    },
    semesters: [
      {
        sem: 1,
        sgpa: 8.2,
        subjects: [
          {
            code: "CS101",
            name: "Programming in C",
            credits: 4,
            grade: "A",
            gp: 8,
          },
          {
            code: "CS102",
            name: "Mathematics I",
            credits: 4,
            grade: "A+",
            gp: 9,
          },
          { code: "CS103", name: "Physics", credits: 3, grade: "A", gp: 8 },
          {
            code: "HS101",
            name: "Communicative English",
            credits: 2,
            grade: "O",
            gp: 10,
          },
        ],
      },
      {
        sem: 2,
        sgpa: 8.5,
        subjects: [
          {
            code: "CS201",
            name: "Object Oriented Programming",
            credits: 4,
            grade: "A",
            gp: 8,
          },
          {
            code: "CS202",
            name: "Discrete Mathematics",
            credits: 4,
            grade: "B+",
            gp: 7,
          },
          {
            code: "CS203",
            name: "Digital Electronics",
            credits: 3,
            grade: "A",
            gp: 8,
          },
          {
            code: "HS102",
            name: "Environmental Studies",
            credits: 2,
            grade: "O",
            gp: 10,
          },
        ],
      },
      {
        sem: 3,
        sgpa: 8.7,
        subjects: [
          {
            code: "CS301",
            name: "Database Management Systems",
            credits: 4,
            grade: "O",
            gp: 10,
          },
          {
            code: "CS302",
            name: "Data Structures",
            credits: 4,
            grade: "A+",
            gp: 9,
          },
          {
            code: "CS303",
            name: "Algorithm Design",
            credits: 4,
            grade: "A",
            gp: 8,
          },
          { code: "CS351", name: "DBMS Lab", credits: 2, grade: "O", gp: 10 },
        ],
      },
    ],
    cgpa: 8.5,
    totalCredits: 52,
    earnedCredits: 52,
  };

  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Transcript downloaded successfully!");
    }, 1500);
  };

  const getGradeColor = (grade) => {
    const colors = {
      O: "bg-green-100 text-green-800",
      "A+": "bg-blue-100 text-blue-800",
      A: "bg-indigo-100 text-indigo-800",
      "B+": "bg-yellow-100 text-yellow-800",
      B: "bg-orange-100 text-orange-800",
      C: "bg-purple-100 text-purple-800",
      P: "bg-gray-100 text-gray-800",
      F: "bg-red-100 text-red-800",
    };
    return colors[grade] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-8 w-8 mr-3 text-blue-500" />
              Academic Transcript
            </h1>
            <button
              onClick={handleDownload}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              {loading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Student Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{transcript.student.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">USN</p>
              <p className="font-semibold">{transcript.student.usn}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold">{transcript.student.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Batch</p>
              <p className="font-semibold">{transcript.student.batch}</p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        {transcript.semesters.map((sem) => (
          <div
            key={sem.sem}
            className="bg-white rounded-lg shadow mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Semester {sem.sem}</h2>
                <div className="flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="font-semibold">SGPA: {sem.sgpa}</span>
                </div>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Grade Point
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sem.subjects.map((subject, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {subject.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subject.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subject.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}
                      >
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {subject.gp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Final CGPA */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Final Result</h3>
              <p className="text-sm text-gray-600">
                Total Credits: {transcript.totalCredits} | Credits Earned:{" "}
                {transcript.earnedCredits}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Cumulative Grade Point Average
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {transcript.cgpa}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Transcript;
