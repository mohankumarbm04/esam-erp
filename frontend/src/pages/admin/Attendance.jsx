// frontend/src/pages/admin/Attendance.jsx
import "./Admin.css";
import React, { useState } from "react";

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Engineering College Data
  const departments = [
    "Computer Science Engineering",
    "Electronics & Communication Engg",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Information Technology",
    "Artificial Intelligence & ML",
    "Data Science",
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];
  const sections = ["A", "B", "C"];

  // Sample subjects based on department
  const getSubjects = (dept) => {
    const subjects = {
      "Computer Science Engineering": [
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Operating Systems",
        "Computer Networks",
        "Web Development",
        "Machine Learning",
        "Cloud Computing",
      ],
      "Electronics & Communication Engg": [
        "Digital Electronics",
        "Analog Circuits",
        "Signal Processing",
        "VLSI Design",
        "Communication Systems",
        "Microcontrollers",
        "Embedded Systems",
        "IoT",
      ],
      "Mechanical Engineering": [
        "Thermodynamics",
        "Fluid Mechanics",
        "Strength of Materials",
        "Machine Design",
        "Manufacturing Process",
        "Heat Transfer",
        "CAD/CAM",
        "Robotics",
      ],
      "Civil Engineering": [
        "Structural Analysis",
        "Geotechnical Engineering",
        "Transportation Engineering",
        "Environmental Engineering",
        "Surveying",
        "Construction Management",
        "Design of Structures",
        "Earthquake Engineering",
      ],
      "Electrical Engineering": [
        "Power Systems",
        "Electrical Machines",
        "Control Systems",
        "Power Electronics",
        "Circuit Theory",
        "Renewable Energy",
        "High Voltage Engineering",
        "Electric Vehicles",
      ],
    };
    return (
      subjects[dept] || [
        "Engineering Mathematics",
        "Engineering Physics",
        "Engineering Chemistry",
        "Basic Engineering",
      ]
    );
  };

  // Sample students data
  const students = [
    {
      id: "CS001",
      name: "Aarav Sharma",
      rollNo: "2021CS001",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Computer Science Engineering",
      section: "A",
    },
    {
      id: "CS002",
      name: "Priya Patel",
      rollNo: "2021CS002",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Computer Science Engineering",
      section: "A",
    },
    {
      id: "CS003",
      name: "Rahul Kumar",
      rollNo: "2021CS003",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Computer Science Engineering",
      section: "A",
    },
    {
      id: "CS004",
      name: "Neha Singh",
      rollNo: "2021CS004",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Computer Science Engineering",
      section: "A",
    },
    {
      id: "CS005",
      name: "Vikram Reddy",
      rollNo: "2021CS005",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Computer Science Engineering",
      section: "A",
    },
    {
      id: "EC001",
      name: "Anjali Mehta",
      rollNo: "2021EC001",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Electronics & Communication Engg",
      section: "B",
    },
    {
      id: "EC002",
      name: "Karthik Nair",
      rollNo: "2021EC002",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Electronics & Communication Engg",
      section: "B",
    },
    {
      id: "ME001",
      name: "Rohan Desai",
      rollNo: "2021ME001",
      year: "3rd Year",
      semester: "Semester 6",
      department: "Mechanical Engineering",
      section: "C",
    },
  ];

  const handleFetchAttendance = () => {
    if (
      !selectedDepartment ||
      !selectedYear ||
      !selectedSemester ||
      !selectedSection
    ) {
      alert("Please select all filters");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filteredStudents = students.filter(
        (s) =>
          s.department === selectedDepartment &&
          s.year === selectedYear &&
          s.semester === selectedSemester &&
          s.section === selectedSection,
      );
      // Add status property to each student
      const studentsWithStatus = filteredStudents.map((s) => ({
        ...s,
        status: "present", // default status
      }));
      setAttendanceData(studentsWithStatus);
      setLoading(false);
    }, 1000);
  };

  const handleStatusChange = (studentId, newStatus) => {
    setAttendanceData((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student,
      ),
    );
  };

  const handleMarkAll = (status) => {
    setAttendanceData((prev) =>
      prev.map((student) => ({ ...student, status })),
    );
  };

  const handleSaveAttendance = () => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const getFilteredStudents = () => {
    if (filterStatus === "all") return attendanceData;
    return attendanceData.filter((s) => s.status === filterStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#10B981";
      case "absent":
        return "#EF4444";
      case "late":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const stats = {
    present: attendanceData.filter((s) => s.status === "present").length,
    absent: attendanceData.filter((s) => s.status === "absent").length,
    late: attendanceData.filter((s) => s.status === "late").length,
    total: attendanceData.length,
  };

  return (
    <div className="modern-dashboard">
      <div className="modern-header-clean">
        <div>
          <h1>Attendance Management</h1>
          <p>Mark and track student attendance</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={handleSaveAttendance}
            disabled={attendanceData.length === 0}
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="modern-card mb-6">
        <h3 className="card-title mb-4">Filter Students</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            alignItems: "end",
          }}
        >
          <div className="input-group">
            <label className="input-label">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="input-field"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="input-field"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="input-field"
            >
              <option value="">Select Section</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input-field"
              disabled={!selectedDepartment}
            >
              <option value="">Select Subject</option>
              {selectedDepartment &&
                getSubjects(selectedDepartment).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <button
              className="btn btn-primary"
              onClick={handleFetchAttendance}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Loading..." : "📋 Fetch Attendance"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards - FIXED */}
      {attendanceData.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Present Card */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #10B981",
            }}
          >
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Present
            </p>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#10B981",
                margin: 0,
              }}
            >
              {stats.present}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>
              {stats.total > 0
                ? ((stats.present / stats.total) * 100).toFixed(1)
                : "0"}
              %
            </p>
          </div>

          {/* Absent Card */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #EF4444",
            }}
          >
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Absent
            </p>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#EF4444",
                margin: 0,
              }}
            >
              {stats.absent}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>
              {stats.total > 0
                ? ((stats.absent / stats.total) * 100).toFixed(1)
                : "0"}
              %
            </p>
          </div>

          {/* Late Card */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #F59E0B",
            }}
          >
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Late
            </p>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#F59E0B",
                margin: 0,
              }}
            >
              {stats.late}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>
              {stats.total > 0
                ? ((stats.late / stats.total) * 100).toFixed(1)
                : "0"}
              %
            </p>
          </div>

          {/* Total Card */}
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #2563EB",
            }}
          >
            <p
              style={{
                color: "#6B7280",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Total
            </p>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#2563EB",
                margin: 0,
              }}
            >
              {stats.total}
            </h3>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "4px" }}>
              Students
            </p>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      {loading ? (
        <div
          style={{
            background: "white",
            padding: "48px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "#6B7280" }}>Loading student data...</p>
        </div>
      ) : attendanceData.length > 0 ? (
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              background: "#F8FAFC",
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ color: "#4B5563", fontWeight: "500" }}>
                Mark All:
              </span>
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleMarkAll("present")}
              >
                ✓ Present
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleMarkAll("absent")}
              >
                ✗ Absent
              </button>
              <button
                className="btn btn-sm btn-warning"
                onClick={() => handleMarkAll("late")}
              >
                ⚠ Late
              </button>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span style={{ color: "#4B5563" }}>Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field"
                style={{ width: "120px", padding: "6px 12px" }}
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "#F8FAFC" }}>
                <tr>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Roll No
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Student Name
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Department
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Year
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Semester
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Section
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: "16px 24px",
                      textAlign: "left",
                      color: "#4B5563",
                      fontWeight: "600",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredStudents().map((student, index) => (
                  <tr
                    key={student.id}
                    style={{
                      borderTop: "1px solid #e2e8f0",
                      background: index % 2 === 0 ? "white" : "#F8FAFC",
                    }}
                  >
                    <td
                      style={{
                        padding: "16px 24px",
                        fontWeight: "500",
                        color: "#1F2937",
                      }}
                    >
                      {student.rollNo}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#1F2937" }}>
                      {student.name}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                      {student.department}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                      {student.year}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                      {student.semester}
                    </td>
                    <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                      Section {student.section}
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <select
                        value={student.status || "present"}
                        onChange={(e) =>
                          handleStatusChange(student.id, e.target.value)
                        }
                        style={{
                          padding: "6px 12px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          background: "white",
                          color: getStatusColor(student.status),
                          fontWeight: "500",
                          outline: "none",
                          cursor: "pointer",
                        }}
                      >
                        <option value="present" style={{ color: "#10B981" }}>
                          Present
                        </option>
                        <option value="absent" style={{ color: "#EF4444" }}>
                          Absent
                        </option>
                        <option value="late" style={{ color: "#F59E0B" }}>
                          Late
                        </option>
                      </select>
                    </td>
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button
                          className={`btn btn-sm ${student.status === "present" ? "btn-success" : "btn-outline"}`}
                          onClick={() =>
                            handleStatusChange(student.id, "present")
                          }
                          style={{ padding: "4px 8px" }}
                          title="Mark Present"
                        >
                          ✓
                        </button>
                        <button
                          className={`btn btn-sm ${student.status === "absent" ? "btn-danger" : "btn-outline"}`}
                          onClick={() =>
                            handleStatusChange(student.id, "absent")
                          }
                          style={{ padding: "4px 8px" }}
                          title="Mark Absent"
                        >
                          ✗
                        </button>
                        <button
                          className={`btn btn-sm ${student.status === "late" ? "btn-warning" : "btn-outline"}`}
                          onClick={() => handleStatusChange(student.id, "late")}
                          style={{ padding: "4px 8px" }}
                          title="Mark Late"
                        >
                          ⚠
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#F8FAFC",
              color: "#4B5563",
              fontSize: "14px",
            }}
          >
            <span>
              Showing {getFilteredStudents().length} of {attendanceData.length}{" "}
              students
            </span>
            <span>
              Date:{" "}
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: "white",
            padding: "48px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <span
            style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}
          >
            📚
          </span>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1F2937",
              marginBottom: "8px",
            }}
          >
            No Students Found
          </h3>
          <p style={{ color: "#6B7280" }}>
            Please select department, year, semester, and section to fetch
            attendance
          </p>
        </div>
      )}

      {/* Success Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#10B981",
            color: "white",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.3s ease",
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>✅</span>
            <div>
              <h4 style={{ fontWeight: "600", marginBottom: "4px", margin: 0 }}>
                Success!
              </h4>
              <p style={{ fontSize: "14px", opacity: "0.9", margin: 0 }}>
                Attendance saved successfully
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
