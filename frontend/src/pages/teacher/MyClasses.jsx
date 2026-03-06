// pages/teacher/MyClasses.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const MyClasses = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState("all");

  const classes = [
    {
      id: 1,
      subject: "Database Management Systems",
      code: "CS301",
      semester: 3,
      section: "A",
      students: 25,
      schedule: [
        { day: "Monday", time: "09:00 - 10:00" },
        { day: "Wednesday", time: "09:00 - 10:00" },
        { day: "Friday", time: "10:15 - 11:15" },
      ],
      attendanceMarked: 12,
      totalClasses: 15,
      averageMarks: 78,
    },
    {
      id: 2,
      subject: "Data Structures",
      code: "CS302",
      semester: 3,
      section: "B",
      students: 24,
      schedule: [
        { day: "Tuesday", time: "10:15 - 11:15" },
        { day: "Thursday", time: "10:15 - 11:15" },
        { day: "Friday", time: "11:30 - 12:30" },
      ],
      attendanceMarked: 10,
      totalClasses: 15,
      averageMarks: 72,
    },
    {
      id: 3,
      subject: "Algorithm Design",
      code: "CS303",
      semester: 5,
      section: "A",
      students: 26,
      schedule: [
        { day: "Monday", time: "11:30 - 12:30" },
        { day: "Wednesday", time: "11:30 - 12:30" },
        { day: "Thursday", time: "14:00 - 15:00" },
      ],
      attendanceMarked: 14,
      totalClasses: 15,
      averageMarks: 81,
    },
    {
      id: 4,
      subject: "DBMS Lab",
      code: "CS351",
      semester: 3,
      section: "A",
      students: 25,
      schedule: [{ day: "Tuesday", time: "14:00 - 17:00" }],
      attendanceMarked: 5,
      totalClasses: 8,
      averageMarks: 85,
    },
  ];

  const filteredClasses =
    selectedSemester === "all"
      ? classes
      : classes.filter((c) => c.semester === parseInt(selectedSemester));

  const getSemesterOptions = () => {
    const sems = [...new Set(classes.map((c) => c.semester))];
    return sems.sort((a, b) => a - b);
  };

  const ClassCard = ({ cls }) => (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{cls.subject}</h3>
          <p className="text-sm text-gray-600">
            {cls.code} • Semester {cls.semester} • Section {cls.section}
          </p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
          {cls.students} Students
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {cls.schedule.map((sch, idx) => (
          <div key={idx} className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span className="w-20">{sch.day}:</span>
            <ClockIcon className="h-4 w-4 mx-2 text-gray-400" />
            <span>{sch.time}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t">
        <div className="text-center">
          <p className="text-xs text-gray-500">Attendance</p>
          <p className="text-sm font-semibold">
            {Math.round((cls.attendanceMarked / cls.totalClasses) * 100)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Avg. Marks</p>
          <p className="text-sm font-semibold">{cls.averageMarks}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Classes</p>
          <p className="text-sm font-semibold">
            {cls.attendanceMarked}/{cls.totalClasses}
          </p>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={() =>
            navigate("/teacher/attendance", { state: { class: cls } })
          }
          className="flex-1 bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100"
        >
          Mark Attendance
        </button>
        <button
          onClick={() => navigate("/teacher/marks")}
          className="flex-1 bg-green-50 text-green-700 px-3 py-2 rounded text-sm hover:bg-green-100"
        >
          Enter Marks
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BookOpenIcon className="h-8 w-8 mr-3 text-blue-500" />
            My Classes
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Filter by Semester:
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Semesters</option>
              {getSemesterOptions().map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClasses.map((cls) => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyClasses;
