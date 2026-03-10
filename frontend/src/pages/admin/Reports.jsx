// frontend/src/pages/admin/Reports.jsx
import "./Admin.css";
import React, { useState } from "react";
import api from "../../utils/axiosConfig";

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState("attendance");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("2021-2025");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [modalMessage, setModalMessage] = useState("");

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
  const batches = ["2020-2024", "2021-2025", "2022-2026", "2023-2027"];

  // Sample faculty data
  const facultyData = [
    {
      name: "Dr. Rajesh Kumar",
      department: "CSE",
      designation: "Professor",
      qualification: "PhD",
      experience: 15,
      publications: 45,
    },
    {
      name: "Dr. Sunita Sharma",
      department: "CSE",
      designation: "Associate Professor",
      qualification: "PhD",
      experience: 12,
      publications: 32,
    },
    {
      name: "Prof. Amit Patel",
      department: "ECE",
      designation: "Professor",
      qualification: "PhD",
      experience: 18,
      publications: 56,
    },
    {
      name: "Dr. Priya Singh",
      department: "ME",
      designation: "Assistant Professor",
      qualification: "PhD",
      experience: 8,
      publications: 18,
    },
    {
      name: "Prof. Suresh Reddy",
      department: "CE",
      designation: "Professor",
      qualification: "PhD",
      experience: 22,
      publications: 62,
    },
  ];

  const [attendanceData, setAttendanceData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);

  const handleGenerateReport = async () => {
    if (!selectedDepartment || !selectedYear || !selectedSemester) {
      alert("Please select department, year, and semester");
      return;
    }

    setLoading(true);
    setModalMessage("");
    try {
      if (selectedReportType === "attendance") {
        const res = await api.get("/admin/reports/attendance", {
          params: {
            departmentId: selectedDepartment || undefined,
            year: selectedYear || undefined,
            semester: selectedSemester || undefined,
            section: selectedSection || undefined,
          },
        });
        setAttendanceData(res.data || []);
      } else if (selectedReportType === "marks") {
        const res = await api.get("/admin/reports/marks", {
          params: {
            departmentId: selectedDepartment || undefined,
            semester: selectedSemester || undefined,
            section: selectedSection || undefined,
          },
        });
        setMarksData(res.data || []);
      } else if (selectedReportType === "summary") {
        setSummaryData(null);
      } else if (selectedReportType === "performance") {
        setPerformanceData([]);
      }

      setModalMessage(`${getReportTitle()} generated successfully.`);
    } catch (error) {
      console.error("Report generation error:", error);
      setModalMessage(
        error.response?.data?.error ||
          "Failed to generate report. Please try again.",
      );
    } finally {
      setShowModal(true);
      setLoading(false);
      setTimeout(() => setShowModal(false), 2500);
    }
  };

  const getCurrentRows = () => {
    switch (selectedReportType) {
      case "attendance":
        return attendanceData;
      case "marks":
        return marksData;
      case "summary":
        return summaryData ? [summaryData] : [];
      case "performance":
        return performanceData;
      default:
        return [];
    }
  };

  const handleExport = () => {
    const rows = getCurrentRows();
    if (!rows || rows.length === 0) {
      setModalMessage("No report data available to export.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      return;
    }

    if (exportFormat === "csv") {
      const headers = Object.keys(rows[0]);
      const csv = [
        headers.join(","),
        ...rows.map((row) =>
          headers.map((h) => JSON.stringify(row[h] ?? "")).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${selectedReportType}-report-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setModalMessage("Report downloaded as CSV.");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
      return;
    }

    setModalMessage(
      `${exportFormat.toUpperCase()} export is not implemented yet. Please use CSV.`,
    );
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  const getReportTitle = () => {
    switch (selectedReportType) {
      case "attendance":
        return "Attendance Report";
      case "marks":
        return "Marks & Grades Report";
      case "summary":
        return "Department Summary Report";
      case "performance":
        return "Performance Analysis Report";
      case "faculty":
        return "Faculty Report";
      default:
        return "Report";
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "O":
        return "#10B981";
      case "A+":
        return "#2563EB";
      case "A":
        return "#3B82F6";
      case "B+":
        return "#F59E0B";
      case "B":
        return "#F97316";
      default:
        return "#6B7280";
    }
  };

  return (
    <div className="modern-dashboard">
      <div className="modern-header-clean">
        <div>
          <h1>Reports</h1>
          <p>Generate and analyze department-wise academic reports</p>
        </div>
        <div className="header-actions">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="form-input"
            style={{ width: "140px" }}
          >
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
          <button className="btn btn-success" onClick={handleExport}>
            Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="modern-card mb-6" style={{ overflowX: "auto" }}>
        <div style={{ display: "flex", gap: "8px", minWidth: "max-content" }}>
          <button
            onClick={() => setSelectedReportType("attendance")}
            className={`btn ${selectedReportType === "attendance" ? "btn-primary" : "btn-outline"}`}
          >
            📊 Attendance
          </button>
          <button
            onClick={() => setSelectedReportType("marks")}
            className={`btn ${selectedReportType === "marks" ? "btn-primary" : "btn-outline"}`}
          >
            📝 Marks & Grades
          </button>
          <button
            onClick={() => setSelectedReportType("summary")}
            className={`btn ${selectedReportType === "summary" ? "btn-primary" : "btn-outline"}`}
          >
            📈 Department Summary
          </button>
          <button
            onClick={() => setSelectedReportType("performance")}
            className={`btn ${selectedReportType === "performance" ? "btn-primary" : "btn-outline"}`}
          >
            🎯 Performance Analysis
          </button>
          <button
            onClick={() => setSelectedReportType("faculty")}
            className={`btn ${selectedReportType === "faculty" ? "btn-primary" : "btn-outline"}`}
          >
            👨‍🏫 Faculty Report
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#4B5563",
            marginBottom: "16px",
          }}
        >
          🔍 Report Filters
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
              <option value="">All Departments</option>
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
              <option value="">All Years</option>
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
              <option value="">All Semesters</option>
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
              <option value="">All Sections</option>
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Batch</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="input-field"
            >
              {batches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              className="btn btn-primary"
              onClick={handleGenerateReport}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Generating..." : "📊 Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: "white",
            padding: "48px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
          <p style={{ color: "#6B7280" }}>
            Generating report for {selectedDepartment || "all departments"}...
          </p>
        </div>
      )}

      {/* Report Content */}
      {!loading && (
        <>
          {/* Summary Cards (only when summary API exists) */}
          {summaryData ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
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
                  Total Students
                </p>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#2563EB",
                    margin: 0,
                  }}
                >
                  {summaryData.totalStudents}
                </h3>
              </div>
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
                  Avg. Attendance
                </p>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#10B981",
                    margin: 0,
                  }}
                >
                  {summaryData.averageAttendance}%
                </h3>
              </div>
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderLeft: "4px solid #8B5CF6",
                }}
              >
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Pass Percentage
                </p>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#8B5CF6",
                    margin: 0,
                  }}
                >
                  {summaryData.passPercentage}%
                </h3>
              </div>
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
                  Placement Rate
                </p>
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "600",
                    color: "#F59E0B",
                    margin: 0,
                  }}
                >
                  {summaryData.placementRate}%
                </h3>
              </div>
            </div>
          ) : (
            <div className="alert alert-info mb-6">
              Reports are now connected to live Attendance/Marks data. Summary and
              Performance reports will appear after their backend APIs are enabled.
            </div>
          )}

          {/* Report Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{ fontSize: "20px", fontWeight: "600", color: "#1F2937" }}
            >
              {getReportTitle()}
              {selectedDepartment && ` - ${selectedDepartment}`}
              {selectedYear && ` - ${selectedYear}`}
            </h2>
            <span style={{ color: "#6B7280", fontSize: "14px" }}>
              Batch: {selectedBatch}
            </span>
          </div>

          {/* Dynamic Report Tables based on type */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              overflow: "hidden",
              marginBottom: "24px",
            }}
          >
            {/* Attendance Report */}
            {selectedReportType === "attendance" && (
              <>
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
                          Present
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Absent
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Late
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Percentage
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
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record, index) => (
                        <tr
                          key={index}
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
                            {record.rollNo}
                          </td>
                          <td
                            style={{ padding: "16px 24px", color: "#1F2937" }}
                          >
                            {record.name}
                          </td>
                          <td
                            style={{ padding: "16px 24px", color: "#6B7280" }}
                          >
                            {record.department}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#10B981",
                              fontWeight: "600",
                            }}
                          >
                            {record.present}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#EF4444",
                              fontWeight: "600",
                            }}
                          >
                            {record.absent}
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              color: "#F59E0B",
                              fontWeight: "600",
                            }}
                          >
                            {record.late}
                          </td>
                          <td
                            style={{ padding: "16px 24px", fontWeight: "600" }}
                          >
                            {record.percentage}%
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 12px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                fontWeight: "500",
                                background:
                                  record.percentage >= 90
                                    ? "#10B98120"
                                    : record.percentage >= 75
                                      ? "#F59E0B20"
                                      : "#EF444420",
                                color:
                                  record.percentage >= 90
                                    ? "#10B981"
                                    : record.percentage >= 75
                                      ? "#F59E0B"
                                      : "#EF4444",
                              }}
                            >
                              {record.percentage >= 90
                                ? "Excellent"
                                : record.percentage >= 75
                                  ? "Good"
                                  : "Needs Improvement"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid #e2e8f0",
                    background: "#F8FAFC",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ color: "#4B5563", fontWeight: "500" }}>
                      Total Students:{" "}
                    </span>
                    <span style={{ color: "#1F2937", fontWeight: "600" }}>
                      {attendanceData.length}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#4B5563", fontWeight: "500" }}>
                      Average Attendance:{" "}
                    </span>
                    <span style={{ color: "#10B981", fontWeight: "600" }}>
                      {(
                        attendanceData.reduce(
                          (acc, curr) => acc + curr.percentage,
                          0,
                        ) / attendanceData.length
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Marks & Grades Report */}
            {selectedReportType === "marks" && (
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
                        Subject
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Internal
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        External
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Total
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Grade
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksData.map((record, index) => (
                      <tr
                        key={index}
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
                          {record.rollNo}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#1F2937" }}>
                          {record.name}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                          {record.subject}
                        </td>
                        <td
                          style={{
                            padding: "16px 24px",
                            color: "#2563EB",
                            fontWeight: "600",
                          }}
                        >
                          {record.internal}
                        </td>
                        <td
                          style={{
                            padding: "16px 24px",
                            color: "#8B5CF6",
                            fontWeight: "600",
                          }}
                        >
                          {record.external}
                        </td>
                        <td
                          style={{
                            padding: "16px 24px",
                            fontWeight: "700",
                            color: "#1F2937",
                          }}
                        >
                          {record.total}
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 12px",
                              borderRadius: "20px",
                              fontSize: "14px",
                              fontWeight: "700",
                              background: `${getGradeColor(record.grade)}20`,
                              color: getGradeColor(record.grade),
                            }}
                          >
                            {record.grade}
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                          {record.credits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Department Summary Report */}
            {selectedReportType === "summary" && summaryData && (
              <div style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        color: "#2563EB",
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "8px",
                      }}
                    >
                      {summaryData.totalStudents}
                    </h4>
                    <p style={{ color: "#4B5563", fontSize: "14px" }}>
                      Total Students
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        color: "#10B981",
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "8px",
                      }}
                    >
                      {summaryData.totalFaculty}
                    </h4>
                    <p style={{ color: "#4B5563", fontSize: "14px" }}>
                      Faculty Members
                    </p>
                  </div>
                  <div
                    style={{
                      background: "#F8FAFC",
                      padding: "20px",
                      borderRadius: "12px",
                      textAlign: "center",
                    }}
                  >
                    <h4
                      style={{
                        color: "#8B5CF6",
                        fontSize: "32px",
                        fontWeight: "700",
                        marginBottom: "8px",
                      }}
                    >
                      {summaryData.totalDepartments}
                    </h4>
                    <p style={{ color: "#4B5563", fontSize: "14px" }}>
                      Departments
                    </p>
                  </div>
                </div>

                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: "16px",
                  }}
                >
                  Grade Distribution
                </h4>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #10B98120 0%, #10B98105 100%)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #10B98130",
                    }}
                  >
                    <p
                      style={{
                        color: "#10B981",
                        fontWeight: "600",
                        fontSize: "20px",
                        marginBottom: "4px",
                      }}
                    >
                      {summaryData.distinction}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: "13px" }}>
                      Distinction (O, A+)
                    </p>
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #2563EB20 0%, #2563EB05 100%)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #2563EB30",
                    }}
                  >
                    <p
                      style={{
                        color: "#2563EB",
                        fontWeight: "600",
                        fontSize: "20px",
                        marginBottom: "4px",
                      }}
                    >
                      {summaryData.firstClass}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: "13px" }}>
                      First Class (A, B+)
                    </p>
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #F59E0B20 0%, #F59E0B05 100%)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #F59E0B30",
                    }}
                  >
                    <p
                      style={{
                        color: "#F59E0B",
                        fontWeight: "600",
                        fontSize: "20px",
                        marginBottom: "4px",
                      }}
                    >
                      {summaryData.secondClass}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: "13px" }}>
                      Second Class (B, C)
                    </p>
                  </div>
                  <div
                    style={{
                      background:
                        "linear-gradient(135deg, #EF444420 0%, #EF444405 100%)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid #EF444430",
                    }}
                  >
                    <p
                      style={{
                        color: "#EF4444",
                        fontWeight: "600",
                        fontSize: "20px",
                        marginBottom: "4px",
                      }}
                    >
                      {summaryData.failed}
                    </p>
                    <p style={{ color: "#4B5563", fontSize: "13px" }}>
                      Failed (Below 40%)
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1F2937",
                        marginBottom: "12px",
                      }}
                    >
                      Academic Overview
                    </h4>
                    <div
                      style={{
                        background: "#F8FAFC",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Total Subjects:
                        </span>
                        <span style={{ fontWeight: "600", color: "#1F2937" }}>
                          {summaryData.totalSubjects}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>Total Labs:</span>
                        <span style={{ fontWeight: "600", color: "#1F2937" }}>
                          {summaryData.totalLabs}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>Total Classes:</span>
                        <span style={{ fontWeight: "600", color: "#1F2937" }}>
                          {summaryData.totalClasses}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Research Papers:
                        </span>
                        <span style={{ fontWeight: "600", color: "#1F2937" }}>
                          {summaryData.researchPapers}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1F2937",
                        marginBottom: "12px",
                      }}
                    >
                      Placement Overview
                    </h4>
                    <div
                      style={{
                        background: "#F8FAFC",
                        padding: "16px",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Placement Rate:
                        </span>
                        <span style={{ fontWeight: "600", color: "#10B981" }}>
                          {summaryData.placementRate}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Average Package:
                        </span>
                        <span style={{ fontWeight: "600", color: "#2563EB" }}>
                          ₹8.5 LPA
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "12px",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Highest Package:
                        </span>
                        <span style={{ fontWeight: "600", color: "#8B5CF6" }}>
                          ₹45 LPA
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#6B7280" }}>
                          Companies Visited:
                        </span>
                        <span style={{ fontWeight: "600", color: "#1F2937" }}>
                          124
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Analysis Report */}
            {selectedReportType === "performance" && performanceData.length > 0 && (
              <div style={{ padding: "24px" }}>
                <h4
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1F2937",
                    marginBottom: "16px",
                  }}
                >
                  Department-wise Performance
                </h4>
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
                          Avg. CGPA
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Pass Rate
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Placement Rate
                        </th>
                        <th
                          style={{
                            padding: "16px 24px",
                            textAlign: "left",
                            color: "#4B5563",
                            fontWeight: "600",
                          }}
                        >
                          Research Papers
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((dept, index) => (
                        <tr
                          key={index}
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
                            {dept.department}
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <span
                              style={{
                                fontWeight: "600",
                                color:
                                  dept.averageCGPA >= 8.5
                                    ? "#10B981"
                                    : dept.averageCGPA >= 8.0
                                      ? "#2563EB"
                                      : "#F59E0B",
                              }}
                            >
                              {dept.averageCGPA}
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <span style={{ fontWeight: "600" }}>
                                {dept.passRate}%
                              </span>
                              <div
                                style={{
                                  width: "80px",
                                  height: "6px",
                                  background: "#e2e8f0",
                                  borderRadius: "3px",
                                  overflow: "hidden",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${dept.passRate}%`,
                                    height: "100%",
                                    background:
                                      dept.passRate >= 90
                                        ? "#10B981"
                                        : dept.passRate >= 80
                                          ? "#2563EB"
                                          : "#F59E0B",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              fontWeight: "600",
                              color:
                                dept.placementRate >= 90
                                  ? "#10B981"
                                  : dept.placementRate >= 80
                                    ? "#2563EB"
                                    : "#F59E0B",
                            }}
                          >
                            {dept.placementRate}%
                          </td>
                          <td
                            style={{
                              padding: "16px 24px",
                              fontWeight: "600",
                              color: "#8B5CF6",
                            }}
                          >
                            {dept.research}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Faculty Report */}
            {selectedReportType === "faculty" && (
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
                        Faculty Name
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
                        Designation
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Qualification
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Experience
                      </th>
                      <th
                        style={{
                          padding: "16px 24px",
                          textAlign: "left",
                          color: "#4B5563",
                          fontWeight: "600",
                        }}
                      >
                        Publications
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {facultyData.map((faculty, index) => (
                      <tr
                        key={index}
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
                          {faculty.name}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#6B7280" }}>
                          {faculty.department}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#4B5563" }}>
                          {faculty.designation}
                        </td>
                        <td style={{ padding: "16px 24px", color: "#4B5563" }}>
                          {faculty.qualification}
                        </td>
                        <td
                          style={{
                            padding: "16px 24px",
                            fontWeight: "600",
                            color: "#2563EB",
                          }}
                        >
                          {faculty.experience} years
                        </td>
                        <td
                          style={{
                            padding: "16px 24px",
                            fontWeight: "600",
                            color: "#8B5CF6",
                          }}
                        >
                          {faculty.publications}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    padding: "20px 24px",
                    borderTop: "1px solid #e2e8f0",
                    background: "#F8FAFC",
                  }}
                >
                  <p style={{ color: "#4B5563" }}>
                    <span style={{ fontWeight: "600" }}>Total Faculty: </span>
                    {facultyData.length} |
                    <span style={{ fontWeight: "600", marginLeft: "16px" }}>
                      Professors:{" "}
                    </span>
                    {
                      facultyData.filter((f) =>
                        f.designation.includes("Professor"),
                      ).length
                    }{" "}
                    |
                    <span style={{ fontWeight: "600", marginLeft: "16px" }}>
                      PhD Holders:{" "}
                    </span>
                    {
                      facultyData.filter((f) => f.qualification === "PhD")
                        .length
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
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
                {modalMessage}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
