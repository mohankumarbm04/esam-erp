// pages/student/Transcript.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  PrinterIcon,
  ShareIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const Transcript = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState(null);
  const [student, setStudent] = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [cgpa, setCgpa] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [earnedCredits, setEarnedCredits] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTranscript();
  }, []);

  const fetchTranscript = async () => {
    try {
      setLoading(true);

      // Fetch student profile
      const profileRes = await axios.get(
        "/api/students/profile/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (profileRes.data.success) {
        setStudent(profileRes.data.student);
      }

      // Fetch all marks for transcript
      const marksRes = await axios.get(
        "/api/students/marks",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (marksRes.data.success) {
        processTranscriptData(marksRes.data.marks || []);
      }
    } catch (err) {
      console.error("Error fetching transcript:", err);
      setError("Failed to load transcript data");

      // Mock data for development
      const mockStudent = {
        name: "Alice Johnson",
        usn: "1BI21CS001",
        department: { name: "Computer Science", code: "CSE" },
        batch: "2021-2025",
        admissionYear: 2021,
        dob: "2003-05-15",
        bloodGroup: "O+",
      };

      const mockMarks = [
        // Semester 1
        {
          semester: 1,
          subjectId: {
            code: "MA101",
            name: "Engineering Mathematics I",
            credits: 4,
          },
          grade: "A",
          gradePoint: 8,
          totalMarks: 85,
        },
        {
          semester: 1,
          subjectId: { code: "PH102", name: "Engineering Physics", credits: 3 },
          grade: "A+",
          gradePoint: 9,
          totalMarks: 88,
        },
        {
          semester: 1,
          subjectId: { code: "CS101", name: "Programming in C", credits: 4 },
          grade: "O",
          gradePoint: 10,
          totalMarks: 92,
        },
        {
          semester: 1,
          subjectId: {
            code: "EE103",
            name: "Basic Electrical Engg",
            credits: 3,
          },
          grade: "A",
          gradePoint: 8,
          totalMarks: 82,
        },
        {
          semester: 1,
          subjectId: {
            code: "ME104",
            name: "Engineering Mechanics",
            credits: 4,
          },
          grade: "B+",
          gradePoint: 7,
          totalMarks: 76,
        },
        {
          semester: 1,
          subjectId: {
            code: "HS101",
            name: "Communicative English",
            credits: 2,
          },
          grade: "O",
          gradePoint: 10,
          totalMarks: 94,
        },
        {
          semester: 1,
          subjectId: { code: "Lab101", name: "C Programming Lab", credits: 2 },
          grade: "O",
          gradePoint: 10,
          totalMarks: 95,
        },

        // Semester 2
        {
          semester: 2,
          subjectId: {
            code: "MA201",
            name: "Engineering Mathematics II",
            credits: 4,
          },
          grade: "A+",
          gradePoint: 9,
          totalMarks: 89,
        },
        {
          semester: 2,
          subjectId: {
            code: "CY202",
            name: "Engineering Chemistry",
            credits: 3,
          },
          grade: "A",
          gradePoint: 8,
          totalMarks: 84,
        },
        {
          semester: 2,
          subjectId: { code: "CS202", name: "Data Structures", credits: 4 },
          grade: "A+",
          gradePoint: 9,
          totalMarks: 87,
        },
        {
          semester: 2,
          subjectId: { code: "CS203", name: "Digital Electronics", credits: 3 },
          grade: "A",
          gradePoint: 8,
          totalMarks: 83,
        },
        {
          semester: 2,
          subjectId: { code: "EC204", name: "Basic Electronics", credits: 4 },
          grade: "B+",
          gradePoint: 7,
          totalMarks: 78,
        },
        {
          semester: 2,
          subjectId: {
            code: "HS102",
            name: "Environmental Studies",
            credits: 2,
          },
          grade: "O",
          gradePoint: 10,
          totalMarks: 96,
        },
        {
          semester: 2,
          subjectId: {
            code: "Lab202",
            name: "Data Structures Lab",
            credits: 2,
          },
          grade: "O",
          gradePoint: 10,
          totalMarks: 97,
        },
        {
          semester: 2,
          subjectId: {
            code: "Lab203",
            name: "Digital Electronics Lab",
            credits: 2,
          },
          grade: "A+",
          gradePoint: 9,
          totalMarks: 90,
        },

        // Semester 3
        {
          semester: 3,
          subjectId: {
            code: "MA301",
            name: "Discrete Mathematics",
            credits: 4,
          },
          grade: "A",
          gradePoint: 8,
          totalMarks: 85,
        },
        {
          semester: 3,
          subjectId: {
            code: "CS301",
            name: "Database Management Systems",
            credits: 4,
          },
          grade: "O",
          gradePoint: 10,
          totalMarks: 112,
        },
        {
          semester: 3,
          subjectId: {
            code: "CS302",
            name: "Object Oriented Programming",
            credits: 4,
          },
          grade: "A+",
          gradePoint: 9,
          totalMarks: 102,
        },
        {
          semester: 3,
          subjectId: { code: "CS303", name: "Algorithm Design", credits: 4 },
          grade: "A",
          gradePoint: 8,
          totalMarks: 107,
        },
        {
          semester: 3,
          subjectId: { code: "CS304", name: "Operating Systems", credits: 4 },
          grade: "A",
          gradePoint: 8,
          totalMarks: 104,
        },
        {
          semester: 3,
          subjectId: {
            code: "HS103",
            name: "Constitution of India",
            credits: 2,
          },
          grade: "O",
          gradePoint: 10,
          totalMarks: 98,
        },
        {
          semester: 3,
          subjectId: { code: "Lab301", name: "DBMS Lab", credits: 2 },
          grade: "O",
          gradePoint: 10,
          totalMarks: 95,
        },
      ];

      setStudent(mockStudent);
      processTranscriptData(mockMarks);
    } finally {
      setLoading(false);
    }
  };

  const processTranscriptData = (marksData) => {
    // Group marks by semester
    const semesterMap = {};
    let totalPoints = 0;
    let totalCreditsAll = 0;
    let earnedCreditsAll = 0;

    marksData.forEach((mark) => {
      const sem = mark.semester;
      if (!semesterMap[sem]) {
        semesterMap[sem] = {
          semester: sem,
          subjects: [],
          totalPoints: 0,
          totalCredits: 0,
          earnedCredits: 0,
        };
      }

      semesterMap[sem].subjects.push(mark);

      if (mark.gradePoint) {
        semesterMap[sem].totalPoints +=
          mark.gradePoint * (mark.subjectId?.credits || 0);
        semesterMap[sem].totalCredits += mark.subjectId?.credits || 0;

        totalPoints += mark.gradePoint * (mark.subjectId?.credits || 0);
        totalCreditsAll += mark.subjectId?.credits || 0;

        if (mark.grade !== "F") {
          semesterMap[sem].earnedCredits += mark.subjectId?.credits || 0;
          earnedCreditsAll += mark.subjectId?.credits || 0;
        }
      }
    });

    // Calculate SGPA for each semester
    const semestersArray = Object.values(semesterMap)
      .map((sem) => ({
        ...sem,
        sgpa:
          sem.totalCredits > 0
            ? (sem.totalPoints / sem.totalCredits).toFixed(2)
            : 0,
      }))
      .sort((a, b) => a.semester - b.semester);

    setSemesters(semestersArray);
    setCgpa(
      totalCreditsAll > 0 ? (totalPoints / totalCreditsAll).toFixed(2) : 0,
    );
    setTotalCredits(totalCreditsAll);
    setEarnedCredits(earnedCreditsAll);
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

  const handleDownload = (format) => {
    alert(`Downloading transcript as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert("Share options for transcript");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading transcript...</p>
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
            <h1 className="text-xl font-semibold text-gray-800">
              Academic Transcript
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload("pdf")}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleDownload("excel")}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Excel
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleShare}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-sm"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Student Information Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {student?.name}
              </h2>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500">USN</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.usn}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.department?.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Batch</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.batch ||
                      `${student?.admissionYear}-${student?.admissionYear + 4}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Admission Year</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.admissionYear}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date of Birth</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.dob}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blood Group</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {student?.bloodGroup || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* CGPA Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <p className="text-sm opacity-90">Cumulative GPA</p>
              <p className="text-4xl font-bold mt-2">{cgpa}</p>
              <p className="text-xs mt-2 opacity-75">out of 10.0</p>
            </div>
          </div>
        </div>

        {/* Semesters */}
        {semesters.map((sem) => (
          <div
            key={sem.semester}
            className="bg-white rounded-lg shadow mb-6 overflow-hidden border border-gray-100"
          >
            {/* Semester Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Semester {sem.semester}
                  </h3>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">SGPA</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {sem.sgpa}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Credits</p>
                    <p className="text-lg font-semibold text-green-600">
                      {sem.earnedCredits}/{sem.totalCredits}
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
                      Marks
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade Point
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sem.subjects.map((subject, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subject.subjectId?.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {subject.subjectId?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {subject.subjectId?.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {subject.totalMarks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(subject.grade)}`}
                        >
                          {subject.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {subject.gradePoint}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Final Summary */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">Total Credits</p>
              <p className="text-2xl font-bold text-blue-700">{totalCredits}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600">Credits Earned</p>
              <p className="text-2xl font-bold text-green-700">
                {earnedCredits}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600">CGPA</p>
              <p className="text-2xl font-bold text-purple-700">{cgpa}</p>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-600">Semesters</p>
              <p className="text-2xl font-bold text-indigo-700">
                {semesters.length}
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-xs text-orange-600">Subjects</p>
              <p className="text-2xl font-bold text-orange-700">
                {semesters.reduce((acc, sem) => acc + sem.subjects.length, 0)}
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
