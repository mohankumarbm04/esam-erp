// frontend/src/App.js
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Departments from "./pages/admin/Departments";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Subjects from "./pages/admin/Subjects";
import Attendance from "./pages/admin/Attendance";
import Reports from "./pages/admin/Reports";
import HODs from "./pages/admin/HODs";
import Settings from "./pages/admin/Settings";
import Fees from "./pages/admin/Fees";

// HOD Pages
import HODDashboard from "./pages/hod/Dashboard";
import HODTeachers from "./pages/hod/Teachers";
import HODStudents from "./pages/hod/Students";
import HODAttendance from "./pages/hod/Attendance";
import HODReports from "./pages/hod/Reports";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherMyClasses from "./pages/teacher/MyClasses";
import TeacherMarkAttendance from "./pages/teacher/MarkAttendance";
import TeacherEnterMarks from "./pages/teacher/EnterMarks";
import TeacherStudents from "./pages/teacher/Students";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/MyAttendance";
import StudentMarks from "./pages/student/MyMarks";
import StudentTranscript from "./pages/student/Transcript";
import StudentDocuments from "./pages/student/Documents";

// Parent Pages
import ParentDashboard from "./pages/parent/Dashboard";
import ChildAttendance from "./pages/parent/ChildAttendance";
import ChildMarks from "./pages/parent/ChildMarks";
import ChildReports from "./pages/parent/ChildReports";

// Protected Route Component with Role-Based Access
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [hasToken, setHasToken] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check both localStorage and sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    console.log("🔍 ProtectedRoute - token exists:", !!token);

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
        console.log("🔍 User role:", user.role);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    setHasToken(!!token);
  }, []);

  if (hasToken === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!hasToken) {
    console.log("🔴 No token - redirecting to login");
    return <Navigate to="/login" />;
  }

  // If specific roles are required, check them
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(
      `🔴 Role ${userRole} not allowed. Required: ${allowedRoles.join(", ")}`,
    );

    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") return <Navigate to="/admin/dashboard" />;
    if (userRole === "hod") return <Navigate to="/hod/dashboard" />;
    if (userRole === "teacher") return <Navigate to="/teacher/dashboard" />;
    if (userRole === "student") return <Navigate to="/student/dashboard" />;
    if (userRole === "parent") return <Navigate to="/parent/dashboard" />;

    return <Navigate to="/login" />;
  }

  console.log("🟢 Access granted");
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ===== ADMIN ROUTES ===== (only admin) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hods"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <HODs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Subjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/fees"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Fees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ===== HOD ROUTES ===== (admin or hod) */}
          <Route
            path="/hod/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <HODDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/teachers"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <HODTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <HODStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <HODAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/reports"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod"]}>
                <HODReports />
              </ProtectedRoute>
            }
          />

          {/* ===== TEACHER ROUTES ===== (admin, hod, or teacher) */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod", "teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod", "teacher"]}>
                <TeacherMyClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod", "teacher"]}>
                <TeacherMarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/marks"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod", "teacher"]}>
                <TeacherEnterMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute allowedRoles={["admin", "hod", "teacher"]}>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />

          {/* ===== STUDENT ROUTES ===== (admin, hod, teacher, or student) */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "student"]}
              >
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "student"]}
              >
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/marks"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "student"]}
              >
                <StudentMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/transcript"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "student"]}
              >
                <StudentTranscript />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/documents"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "student"]}
              >
                <StudentDocuments />
              </ProtectedRoute>
            }
          />

          {/* ===== PARENT ROUTES ===== (admin, hod, teacher, or parent) */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "parent"]}
              >
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/attendance"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "parent"]}
              >
                <ChildAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/marks"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "parent"]}
              >
                <ChildMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/reports"
            element={
              <ProtectedRoute
                allowedRoles={["admin", "hod", "teacher", "parent"]}
              >
                <ChildReports />
              </ProtectedRoute>
            }
          />

          {/* ===== CATCH ALL - MUST BE LAST ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
