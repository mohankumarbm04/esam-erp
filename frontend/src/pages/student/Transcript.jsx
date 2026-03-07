// pages/student/Transcript.jsx
import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  PrinterIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

const Transcript = () => {
  const [loading, setLoading] = useState(true);
  const [transcript, setTranscript] = useState(null);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    // Mock data - replace with API call
    setTimeout(() => {
      const data = {
        student: {
          name: "Alice Johnson",
          usn: "1BI21CS001",
          department: "Computer Science",
          batch: "2021-2025",
          admissionYear: 2021,
          dob: "2003-05-15",
          bloodGroup: "O+",
          category: "General",
        },
        semesters: [
          {
            sem: 1,
            sgpa: 8.2,
            totalCredits: 22,
            earnedCredits: 22,
            subjects: [
              {
                code: "MA101",
                name: "Engineering Mathematics I",
                credits: 4,
                grade: "A",
                gp: 8,
              },
              {
                code: "PH102",
                name: "Engineering Physics",
                credits: 3,
                grade: "A+",
                gp: 9,
              },
              {
                code: "CS101",
                name: "Programming in C",
                credits: 4,
                grade: "O",
                gp: 10,
              },
              {
                code: "EE103",
                name: "Basic Electrical Engg",
                credits: 3,
                grade: "A",
                gp: 8,
              },
              {
                code: "ME104",
                name: "Engineering Mechanics",
                credits: 4,
                grade: "B+",
                gp: 7,
              },
              {
                code: "HS101",
                name: "Communicative English",
                credits: 2,
                grade: "O",
                gp: 10,
              },
              {
                code: "Lab101",
                name: "C Programming Lab",
                credits: 2,
                grade: "O",
                gp: 10,
              },
            ],
          },
          {
            sem: 2,
            sgpa: 8.5,
            totalCredits: 24,
            earnedCredits: 24,
            subjects: [
              {
                code: "MA201",
                name: "Engineering Mathematics II",
                credits: 4,
                grade: "A+",
                gp: 9,
              },
              {
                code: "CY202",
                name: "Engineering Chemistry",
                credits: 3,
                grade: "A",
                gp: 8,
              },
              {
                code: "CS202",
                name: "Data Structures",
                credits: 4,
                grade: "A+",
                gp: 9,
              },
              {
                code: "CS203",
                name: "Digital Electronics",
                credits: 3,
                grade: "A",
                gp: 8,
              },
              {
                code: "EC204",
                name: "Basic Electronics",
                credits: 4,
                grade: "B+",
                gp: 7,
              },
              {
                code: "HS102",
                name: "Environmental Studies",
                credits: 2,
                grade: "O",
                gp: 10,
              },
              {
                code: "Lab202",
                name: "Data Structures Lab",
                credits: 2,
                grade: "O",
                gp: 10,
              },
              {
                code: "Lab203",
                name: "Digital Electronics Lab",
                credits: 2,
                grade: "A+",
                gp: 9,
              },
            ],
          },
          {
            sem: 3,
            sgpa: 8.7,
            totalCredits: 24,
            earnedCredits: 24,
            subjects: [
              {
                code: "MA301",
                name: "Discrete Mathematics",
                credits: 4,
                grade: "A",
                gp: 8,
              },
              {
                code: "CS301",
                name: "Database Management Systems",
                credits: 4,
                grade: "O",
                gp: 10,
              },
              {
                code: "CS302",
                name: "Object Oriented Programming",
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
              {
                code: "CS304",
                name: "Operating Systems",
                credits: 4,
                grade: "A",
                gp: 8,
              },
              {
                code: "HS103",
                name: "Constitution of India",
                credits: 2,
                grade: "O",
                gp: 10,
              },
              {
                code: "Lab301",
                name: "DBMS Lab",
                credits: 2,
                grade: "O",
                gp: 10,
              },
            ],
          },
        ],
        cgpa: 8.5,
        totalCredits: 70,
        earnedCredits: 70,
        overallPercentage: 78.5,
        classRank: 15,
        totalStudents: 180,
      };

      setTranscript(data);
      setStudent(data.student);
      setLoading(false);
    }, 500);
  };

  const handleDownload = (format) => {
    alert(`Downloading transcript as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading transcript...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <DocumentTextIcon className="h-6 w-6 mr-2 text-blue-500" />
              Academic Transcript
            </h1>

            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => handleDownload("pdf")}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleDownload("excel")}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                Excel
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => handleDownload("share")}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Student Information Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">USN</p>
                  <p className="text-sm font-semibold">{student.usn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-semibold">{student.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Batch</p>
                  <p className="text-sm font-semibold">{student.batch}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission Year</p>
                  <p className="text-sm font-semibold">
                    {student.admissionYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-semibold">{student.dob}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blood Group</p>
                  <p className="text-sm font-semibold">{student.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="text-sm font-semibold">{student.category}</p>
                </div>
              </div>
            </div>

            {/* Overall Performance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">CGPA</p>
              <p className="text-3xl font-bold">{transcript.cgpa}</p>
              <p className="text-xs mt-2 opacity-90">
                Class Rank: {transcript.classRank}/{transcript.totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        {transcript.semesters.map((sem) => (
          <div
            key={sem.sem}
            className="bg-white rounded-xl shadow-md mb-6 overflow-hidden"
          >
            {/* Semester Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Semester {sem.sem}</h3>
                  <p className="text-sm text-gray-600">
                    Credits: {sem.earnedCredits}/{sem.totalCredits} • SGPA:{" "}
                    {sem.sgpa}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Earned Credits</p>
                    <p className="text-lg font-semibold text-green-600">
                      {sem.earnedCredits}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">SGPA</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {sem.sgpa}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade Point
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sem.subjects.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {subject.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}
                        >
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {subject.gp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-green-600 text-sm">
                          ✓ Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Final Summary */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Overall Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">Total Credits</p>
              <p className="text-2xl font-bold text-blue-700">
                {transcript.totalCredits}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600">Credits Earned</p>
              <p className="text-2xl font-bold text-green-700">
                {transcript.earnedCredits}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600">CGPA</p>
              <p className="text-2xl font-bold text-purple-700">
                {transcript.cgpa}
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-600">Overall %</p>
              <p className="text-2xl font-bold text-yellow-700">
                {transcript.overallPercentage}%
              </p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-600">Class Rank</p>
              <p className="text-2xl font-bold text-indigo-700">
                {transcript.classRank}/{transcript.totalStudents}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This is a computer generated transcript. No signature required.</p>
          <p className="mt-1">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Transcript;
