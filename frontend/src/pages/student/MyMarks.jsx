// pages/student/MyMarks.jsx
import React, { useState } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";

const MyMarks = () => {
  const [selectedSem, setSelectedSem] = useState("3");

  const marksData = [
    {
      semester: 3,
      sgpa: 8.5,
      subjects: [
        {
          code: "CS301",
          name: "Database Management Systems",
          ia1: 28,
          ia2: 26,
          ia3: 27,
          bestIa: 27,
          lab: null,
          exam: 85,
          total: 112,
          grade: "O",
          gp: 10,
        },
        {
          code: "CS302",
          name: "Data Structures",
          ia1: 24,
          ia2: 25,
          ia3: 23,
          bestIa: 24.5,
          lab: null,
          exam: 78,
          total: 102.5,
          grade: "A+",
          gp: 9,
        },
        {
          code: "CS303",
          name: "Algorithm Design",
          ia1: 26,
          ia2: 24,
          ia3: 25,
          bestIa: 25.5,
          lab: null,
          exam: 82,
          total: 107.5,
          grade: "A",
          gp: 8,
        },
        {
          code: "CS351",
          name: "DBMS Lab",
          ia1: null,
          ia2: null,
          ia3: null,
          bestIa: null,
          lab: 23,
          exam: null,
          total: 23,
          grade: "O",
          gp: 10,
        },
      ],
    },
    {
      semester: 2,
      sgpa: 8.2,
      subjects: [
        {
          code: "CS201",
          name: "Object Oriented Programming",
          ia1: 26,
          ia2: 25,
          ia3: 24,
          bestIa: 25.5,
          lab: null,
          exam: 80,
          total: 105.5,
          grade: "A",
          gp: 8,
        },
        {
          code: "CS202",
          name: "Discrete Mathematics",
          ia1: 22,
          ia2: 24,
          ia3: 23,
          bestIa: 23.5,
          lab: null,
          exam: 75,
          total: 98.5,
          grade: "B+",
          gp: 7,
        },
        {
          code: "CS203",
          name: "Digital Electronics",
          ia1: 25,
          ia2: 26,
          ia3: 24,
          bestIa: 25.5,
          lab: null,
          exam: 82,
          total: 107.5,
          grade: "A",
          gp: 8,
        },
      ],
    },
  ];

  const currentData =
    marksData.find((d) => d.semester === parseInt(selectedSem)) || marksData[0];

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

  const getSemesterOptions = () => {
    return marksData.map((d) => (
      <option key={d.semester} value={d.semester}>
        Semester {d.semester}
      </option>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Marks
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Semester Selector and SGPA */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Select Semester:
              </label>
              <select
                value={selectedSem}
                onChange={(e) => setSelectedSem(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                {getSemesterOptions()}
              </select>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Semester SGPA</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentData.sgpa}
              </p>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IA1
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IA2
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  IA3
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Best IA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Lab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  GP
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subject.code}
                    </div>
                    <div className="text-xs text-gray-500">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.ia1 || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.ia2 || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.ia3 || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.bestIa || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.lab || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subject.exam || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {subject.total}
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

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Grade Legend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <span className="text-xs">
              <span className="inline-block w-16">O: 90-100</span> (10 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">A+: 80-89</span> (9 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">A: 70-79</span> (8 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">B+: 60-69</span> (7 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">B: 55-59</span> (6 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">C: 50-54</span> (5 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">P: 40-49</span> (4 GP)
            </span>
            <span className="text-xs">
              <span className="inline-block w-16">F: &lt;40</span> (0 GP)
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyMarks;
