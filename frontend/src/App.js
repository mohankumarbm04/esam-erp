// frontend/src/App.js
import React from "react";
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* ========== ADMIN ROUTES ========== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* ========== HOD ROUTES ========== */}
          <Route
            path="/hod/dashboard"
            element={
              <ProtectedRoute>
                <HODDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/teachers"
            element={
              <ProtectedRoute>
                <HODTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/students"
            element={
              <ProtectedRoute>
                <HODStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/attendance"
            element={
              <ProtectedRoute>
                <HODAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hod/reports"
            element={
              <ProtectedRoute>
                <HODReports />
              </ProtectedRoute>
            }
          />

          {/* ========== TEACHER ROUTES ========== */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute>
                <TeacherMyClasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute>
                <TeacherMarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/marks"
            element={
              <ProtectedRoute>
                <TeacherEnterMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />

          {/* ========== STUDENT ROUTES ========== */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/marks"
            element={
              <ProtectedRoute>
                <StudentMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/transcript"
            element={
              <ProtectedRoute>
                <StudentTranscript />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/documents"
            element={
              <ProtectedRoute>
                <StudentDocuments />
              </ProtectedRoute>
            }
          />

          {/* ========== PARENT ROUTES ========== */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/attendance"
            element={
              <ProtectedRoute>
                <ChildAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/marks"
            element={
              <ProtectedRoute>
                <ChildMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent/reports"
            element={
              <ProtectedRoute>
                <ChildReports />
              </ProtectedRoute>
            }
          />

          {/* ========== CATCH ALL - REDIRECT TO LOGIN ========== */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
