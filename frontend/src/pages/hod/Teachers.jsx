// pages/hod/Teachers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTeachers();
    fetchDepartment();
  }, []);

  const fetchTeachers = async () => {
    try {
      // This would fetch teachers for HOD's department
      // Mock data for now
      setTeachers([
        {
          _id: "1",
          teacherId: "TCH001",
          name: "Dr. Rajesh Kumar",
          email: "rajesh.k@cse.edu",
          phone: "9876543210",
          designation: "Professor",
          qualification: "Ph.D. CS",
          specialization: "DBMS",
          experience: 15,
        },
        {
          _id: "2",
          teacherId: "TCH002",
          name: "Prof. Sunita Sharma",
          email: "sunita.s@cse.edu",
          phone: "9876543211",
          designation: "Associate Professor",
          qualification: "M.Tech, Ph.D.",
          specialization: "Networks",
          experience: 12,
        },
        {
          _id: "3",
          teacherId: "TCH003",
          name: "Dr. Anil Kumar",
          email: "anil.k@cse.edu",
          phone: "9876543212",
          designation: "Assistant Professor",
          qualification: "Ph.D. AI",
          specialization: "Machine Learning",
          experience: 8,
        },
      ]);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartment = async () => {
    setDepartment({
      name: "Computer Science",
      code: "CSE",
      totalTeachers: 12,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading teachers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Department Teachers
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {department?.name} ({department?.code}) • Total:{" "}
            {department?.totalTeachers} teachers
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Professors</p>
            <p className="text-2xl font-semibold">4</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Associate Professors</p>
            <p className="text-2xl font-semibold">3</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Assistant Professors</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Ph.D. Holders</p>
            <p className="text-2xl font-semibold">8</p>
          </div>
        </div>

        {/* Teachers Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Qualification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {teacher.teacherId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {teacher.email}
                      </span>
                      <span className="flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {teacher.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.qualification}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {teacher.experience} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Teachers;
